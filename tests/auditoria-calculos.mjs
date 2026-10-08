import assert from 'node:assert/strict';

const EPS = 0.02;
const close = (actual, expected, label) => assert.ok(Math.abs(actual-expected) <= EPS, `${label}: esperado ${expected}, obtido ${actual}`);

const cargos = {
  mecanico:2703.26,
  pedreiro:2330.79,
  servente:1933.47,
  meioOficial:1984.29,
  serralheiro:3150,
  soldador:3150,
  supervisor:2717.19,
};

const clientes = {
  BRF:{dias:180,neg:8},
  JBS:{dias:120,neg:12},
  'JBS Couros':{dias:10,neg:12},
  Seara:{dias:120,neg:8},
  Vibra:{dias:30,neg:8},
  SBE:{dias:0,neg:8},
  Agrogen:{dias:35,neg:8},
  Lar:{dias:5,neg:8},
  'Mig Plus':{dias:45,neg:8},
};

const p = {
  jornada:220,salarioMinimo:1621,premio:380,insalubridade:20,
  epi:448.50/12,exames:339/12,ferramentas:300,plano:15,
  seguros:792.69,funcionarios:6,inss:24.8516,fgts:8,
  das:10.81,iss:4.36,inssRet:0,markup:30,taxaDia:0.1,
  custoFixo:28300,treinamento:380
};

function calc(salario,dias,neg,qtd=p.funcionarios){
  const insal=p.salarioMinimo*p.insalubridade/100;
  const base=salario+insal;
  const ferias=base/12;
  const terco=ferias/3;
  const feriasTotal=ferias+terco;
  const decimo=base/12;
  const fgts=(base+feriasTotal+decimo)*p.fgts/100;
  const cpp=(base+feriasTotal+decimo)*p.inss/100;
  const rescisao=fgts*0.40;
  const individuais=p.epi+p.exames+p.ferramentas+p.plano;
  const custo=base+p.premio+feriasTotal+decimo+fgts+cpp+rescisao+individuais+(p.custoFixo/qtd)+(p.seguros/qtd)+(p.treinamento/12);

  const das=p.das/100;
  const iss=p.iss/100;
  const recebivelFrac=1-iss-(p.inssRet/100);
  const ant=dias*p.taxaDia/100;
  const precoBase=(custo*(1+p.markup/100))/(1-das-ant*recebivelFrac);
  const precoOferta=precoBase/(1-neg/100);
  const issRetido=precoBase*iss;
  const dasRecolher=precoBase*(das-iss);
  const totalSimples=dasRecolher+issRetido;
  const financeiro=(precoBase-issRetido)*ant;
  const resultado=precoBase-totalSimples-financeiro-custo;

  return {base,ferias,terco,feriasTotal,decimo,fgts,cpp,rescisao,custo,custoHH:custo/p.jornada,precoBase,precoBaseHH:precoBase/p.jornada,precoOferta,precoOfertaHH:precoOferta/p.jornada,issRetido,dasRecolher,totalSimples,financeiro,resultado};
}

assert.equal(Object.keys(cargos).length,7);
assert.equal(Object.keys(clientes).length,9);
close(p.custoFixo,28300,'custo fixo');
close(p.custoFixo/6,4716.67,'custo fixo / 6');
close(p.custoFixo/7,4042.86,'custo fixo / 7');
close(p.custoFixo/8,3537.50,'custo fixo / 8');

const pedJbs=calc(cargos.pedreiro,clientes.JBS.dias,clientes.JBS.neg);
close(pedJbs.base,2654.99,'base encargos pedreiro');
close(pedJbs.custo,9955.59,'custo mensal carregado pedreiro');
close(pedJbs.custoHH,45.25,'custo HH pedreiro');
close(pedJbs.precoBaseHH,75.70,'preço base HH JBS');
close(pedJbs.precoOfertaHH,86.02,'preço oferta HH JBS');
close(pedJbs.resultado/pedJbs.custo*100,30,'markup preservado JBS');
close(pedJbs.dasRecolher+pedJbs.issRetido,pedJbs.totalSimples,'ISS não duplicado no DAS');
close(pedJbs.precoOferta*(1-clientes.JBS.neg/100),pedJbs.precoBase,'negociação retorna ao preço-base');

const pedVibra=calc(cargos.pedreiro,clientes.Vibra.dias,clientes.Vibra.neg);
close(pedVibra.precoOfertaHH,74.08,'preço oferta HH Vibra');
close(pedVibra.resultado/pedVibra.custo*100,30,'markup preservado Vibra');

const pedBrf=calc(cargos.pedreiro,clientes.BRF.dias,clientes.BRF.neg);
close(pedBrf.precoOfertaHH,88.84,'preço oferta HH BRF');
close(pedBrf.resultado/pedBrf.custo*100,30,'markup preservado BRF');

for (const [cargo,salario] of Object.entries(cargos)) {
  for (const [cliente,c] of Object.entries(clientes)) {
    const r=calc(salario,c.dias,c.neg);
    assert.ok(Number.isFinite(r.precoOfertaHH) && r.precoOfertaHH > 0, `${cargo}/${cliente}: HH inválida`);
    close(r.resultado/r.custo*100,30,`${cargo}/${cliente}: markup`);
    close(r.dasRecolher+r.issRetido,r.totalSimples,`${cargo}/${cliente}: carga Simples`);
    close(r.precoOferta*(1-c.neg/100),r.precoBase,`${cargo}/${cliente}: negociação`);
  }
}

console.log('OK — 7 cargos x 9 clientes auditados; regras fiscais/financeiras principais fecham.');
