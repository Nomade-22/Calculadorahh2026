const brl = v => (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const pct = v => `${(Number(v)||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:4})}%`;
const clone = o => JSON.parse(JSON.stringify(o));
const clamp = (v,min,max) => Math.min(max,Math.max(min,Number(v)||0));

const cargos = [
  {id:'mecanico-caldeireiro',nome:'Mecânico Caldeireiro',salario:2703.26},
  {id:'pedreiro',nome:'Pedreiro',salario:2330.79},
  {id:'servente',nome:'Servente',salario:1933.47},
  {id:'meio-oficial',nome:'Meio Oficial',salario:1984.29},
  {id:'serralheiro',nome:'Serralheiro',salario:3150.00},
  {id:'soldador',nome:'Soldador',salario:3150.00},
  {id:'supervisor-manutencao',nome:'Supervisor de Manutenção',salario:2717.19},
];

const clientes = [
  {id:'manual',nome:'Manual / Outro',dias:null,neg:null},
  {id:'brf',nome:'BRF',dias:180,neg:8},
  {id:'jbs',nome:'JBS',dias:120,neg:12},
  {id:'jbs-couros',nome:'JBS Couros',dias:10,neg:12},
  {id:'seara',nome:'Seara',dias:120,neg:8},
  {id:'vibra',nome:'Vibra',dias:30,neg:8},
  {id:'sbe',nome:'SBE',dias:0,neg:8},
  {id:'agrogen',nome:'Agrogen',dias:35,neg:8},
  {id:'lar',nome:'Lar',dias:5,neg:8},
  {id:'migplus',nome:'Mig Plus',dias:45,neg:8},
];

const custosPadrao = [
  {id:'aluguel',nome:'Aluguel',valor:6000},
  {id:'agua',nome:'Água',valor:0},
  {id:'luz',nome:'Luz',valor:700},
  {id:'internet',nome:'Internet',valor:100},
  {id:'assessoria',nome:'Assessoria',valor:2500},
  {id:'hgm',nome:'HGM',valor:304},
  {id:'eml',nome:'EML',valor:3000},
  {id:'retiradas-adm',nome:'Retiradas Administrativas',valor:14000},
  {id:'manut-carros',nome:'Manut. Carros',valor:300},
  {id:'iseg',nome:'ISEG',valor:710},
  {id:'higiene',nome:'Higiene',valor:80},
  {id:'aci',nome:'ACI',valor:125},
  {id:'santander',nome:'Santander',valor:240},
  {id:'protej',nome:'Protej',valor:116},
  {id:'ponto-web',nome:'Ponto Web',valor:125},
];

const defaults = {
  salario:2330.79,jornada:220,salarioMinimo:1621,premioAssiduidade:380,insalubridadePerc:20,
  almoco:0,epiMensal:448.50/12,transporte:0,examesMensal:339/12,ferramentas:300,planoSaude:15,
  seguroVidaTotal:792.69,treinamentosAnual:380,qtdFunc:6,inssPatronalPerc:24.8516,fgtsPerc:8,
  simplesPerc:10.81,issRetidoPerc:4.36,inssRetidoPerc:0,lucroPerc:30,taxaAntecipacaoDia:0.1,
  diasAntecipacao:120,descontoNegociacaoPerc:12,clientePreset:'jbs',cargoAtivo:'pedreiro'
};

let custos = JSON.parse(localStorage.getItem('hh2026_custos')||'null') || clone(custosPadrao);
let dados = Object.assign({},defaults,JSON.parse(localStorage.getItem('hh2026_dados')||'null')||{});
const inputIds = ['salario','jornada','salarioMinimo','premioAssiduidade','insalubridadePerc','almoco','epiMensal','transporte','examesMensal','ferramentas','planoSaude','seguroVidaTotal','treinamentosAnual','qtdFunc','inssPatronalPerc','fgtsPerc','simplesPerc','issRetidoPerc','inssRetidoPerc','lucroPerc','taxaAntecipacaoDia','diasAntecipacao','descontoNegociacaoPerc'];

function totalCustoFixo(){return custos.reduce((s,i)=>s+(Number(i.valor)||0),0)}
function calc(d=dados){
  const insalubridade=(d.insalubridadePerc/100)*d.salarioMinimo;
  const baseEncargos=d.salario+insalubridade;
  const ferias=baseEncargos/12;
  const terco=ferias/3;
  const feriasComTerco=ferias+terco;
  const decimo=baseEncargos/12;
  const fgtsBase=baseEncargos*(d.fgtsPerc/100);
  const fgtsFerias=feriasComTerco*(d.fgtsPerc/100);
  const fgts13=decimo*(d.fgtsPerc/100);
  const fgtsTotal=fgtsBase+fgtsFerias+fgts13;
  const inssBase=baseEncargos*(d.inssPatronalPerc/100);
  const inssFerias=feriasComTerco*(d.inssPatronalPerc/100);
  const inss13=decimo*(d.inssPatronalPerc/100);
  const inssPatronal=inssBase+inssFerias+inss13;
  const provisaoRescisao=fgtsTotal*0.40;
  const encargosTotais=feriasComTerco+decimo+fgtsTotal+inssPatronal+provisaoRescisao;
  const custosInd=(d.almoco||0)+(d.epiMensal||0)+(d.transporte||0)+(d.examesMensal||0)+(d.ferramentas||0)+(d.planoSaude||0);
  const custoFixo=totalCustoFixo();
  const custoOperFunc=d.qtdFunc>0?custoFixo/d.qtdFunc:0;
  const seguroFunc=d.qtdFunc>0?d.seguroVidaTotal/d.qtdFunc:0;
  const treinamentoMes=d.treinamentosAnual/12;
  const custoTotal=baseEncargos+d.premioAssiduidade+encargosTotais+custosInd+custoOperFunc+seguroFunc+treinamentoMes;
  const custoComMarkup=custoTotal*(1+d.lucroPerc/100);
  // ORDEM FISCAL/FINANCEIRA:
  // 1) o DAS efetivo é a carga econômica total do Simples para a receita;
  // 2) se houver ISS retido, essa parcela sai do DAS a recolher e é retida pelo tomador;
  // 3) INSS retido é crédito/compensação previdenciária, não custo definitivo;
  // 4) a antecipação incide somente sobre o recebível líquido das retenções.
  const dasRate=clamp(d.simplesPerc/100,0,.95);
  const issRetRate=clamp(d.issRetidoPerc/100,0,dasRate);
  const inssRetRate=clamp(d.inssRetidoPerc/100,0,Math.max(0,.95-issRetRate));
  const retencoesRate=issRetRate+inssRetRate;
  const recebivelFrac=Math.max(0,1-retencoesRate);
  const antRate=Math.max(0,d.diasAntecipacao)*Math.max(0,d.taxaAntecipacaoDia)/100;
  const antEfetivaSobreNF=antRate*recebivelFrac;
  const divisor=Math.max(.01,1-dasRate-antEfetivaSobreNF);
  const precoBase=custoComMarkup/divisor;
  const valorHoraBase=precoBase/d.jornada;
  const negociacaoRate=clamp(d.descontoNegociacaoPerc/100,0,.95);
  const precoOferta=negociacaoRate>0?precoBase/(1-negociacaoRate):precoBase;
  const valorHoraOferta=precoOferta/d.jornada;

  const issRetido=precoBase*issRetRate;
  const inssRetido=precoBase*inssRetRate;
  const recebivelLiquido=precoBase-issRetido-inssRetido;
  const custoAntecipacao=recebivelLiquido*antRate;

  // Quando o ISS é retido corretamente no Simples, não é recolhido novamente no DAS.
  // Logo: carga total do Simples = DAS a recolher + ISS retido.
  const dasRecolherRate=Math.max(0,dasRate-issRetRate);
  const dasRecolher=precoBase*dasRecolherRate;
  const cargaSimplesTotal=precoBase*dasRate;
  const caixaAposTributosEFinanceiro=recebivelLiquido-dasRecolher-custoAntecipacao;

  // O resultado econômico parte da NF bruta. O INSS retido não é despesa:
  // ele liquida/compensa obrigação previdenciária já contemplada no custo de pessoal.
  const resultadoEconomico=precoBase-cargaSimplesTotal-custoAntecipacao-custoTotal;
  const resultadoPerc=custoTotal?resultadoEconomico/custoTotal*100:0;
  const margemVenda=precoBase?resultadoEconomico/precoBase*100:0;
  return {insalubridade,baseEncargos,ferias,terco,feriasComTerco,decimo,fgtsBase,fgtsFerias,fgts13,fgtsTotal,inssBase,inssFerias,inss13,inssPatronal,provisaoRescisao,encargosTotais,custosInd,custoFixo,custoOperFunc,seguroFunc,treinamentoMes,custoTotal,custoHora:custoTotal/d.jornada,custoComMarkup,precoBase,valorHoraBase,precoOferta,valorHoraOferta,issRetido,inssRetido,recebivelLiquido,custoAntecipacao,dasRecolher,cargaSimplesTotal,caixaAposTributosEFinanceiro,resultadoEconomico,resultadoPerc,margemVenda,antRate,recebivelFrac};
}

function row(label,value,cls=''){return `<div class="result-row ${cls}"><span>${label}</span><strong>${typeof value==='number'?brl(value):value}</strong></div>`}
function syncInputs(){inputIds.forEach(id=>{const el=document.getElementById(id);if(el)el.value=Number(dados[id]).toString()});document.getElementById('clientePreset').value=dados.clientePreset||'manual'}
function save(){localStorage.setItem('hh2026_dados',JSON.stringify(dados));localStorage.setItem('hh2026_custos',JSON.stringify(custos))}

function renderCargoButtons(){
  const box=document.getElementById('cargoButtons');box.innerHTML=cargos.map(c=>`<button class="cargo-btn ${dados.cargoAtivo===c.id?'active':''}" data-cargo="${c.id}">${c.nome}<span>${brl(c.salario)}</span></button>`).join('');
  box.querySelectorAll('.cargo-btn').forEach(b=>b.onclick=()=>{const c=cargos.find(x=>x.id===b.dataset.cargo);dados.cargoAtivo=c.id;dados.salario=c.salario;syncInputs();save();render()});
}
function renderClientes(){document.getElementById('clientePreset').innerHTML=clientes.map(c=>`<option value="${c.id}">${c.nome}${c.dias===null?'':` — ${c.dias} dias`}</option>`).join('')}
function render(){
  const r=calc();
  document.getElementById('custoOperacional').value=r.custoFixo.toFixed(2);
  document.getElementById('seguroRateio').textContent=`Rateado por ${dados.qtdFunc} funcionário(s): ${brl(r.seguroFunc)}/func`;
  document.getElementById('encargosResultados').innerHTML=[
    row('Base de Encargos',r.baseEncargos,'emphasis'),row('Férias (1/12)',r.ferias),row('1/3 Constitucional',r.terco),row('Férias + 1/3',r.feriasComTerco,'emphasis'),row('13º Salário',r.decimo),row(`FGTS Base (${pct(dados.fgtsPerc)})`,r.fgtsBase),row('FGTS Férias',r.fgtsFerias),row('FGTS 13º',r.fgts13),row('FGTS Total',r.fgtsTotal,'emphasis'),row(`INSS Base (${pct(dados.inssPatronalPerc)})`,r.inssBase),row('INSS Férias',r.inssFerias),row('INSS 13º',r.inss13),row('INSS Patronal Total',r.inssPatronal,'emphasis'),row('Provisão Rescisão (40% FGTS)',r.provisaoRescisao),row('Total Encargos',r.encargosTotais,'total')
  ].join('');
  document.getElementById('custosResultados').innerHTML=[row('Custos Fixos Individuais',r.custosInd),row('Custo Fixo/Func',r.custoOperFunc),row('Seguro de Vida/Func',r.seguroFunc),row('Treinamentos NR/Mês',r.treinamentoMes),row('Prêmio Assiduidade',dados.premioAssiduidade)].join('');
  document.getElementById('resultadoFinal').innerHTML=[row('Custo Total Mensal',r.custoTotal,'emphasis'),row('Custo por HH',r.custoHora),row('Preço Base p/ Faturar',r.precoBase,'total'),row('Margem efetiva s/ NF base',pct(r.margemVenda)),`<div class="offer-box"><div class="result-row"><span>Preço p/ Oferecer (permite ${pct(dados.descontoNegociacaoPerc)} de desconto)</span><strong>${brl(r.precoOferta)}</strong></div></div>`].join('');
  document.getElementById('jornadaLabel').textContent=dados.jornada;
  document.getElementById('composicaoHora').innerHTML=[['Custo real / HH',r.custoHora],['Preço base / HH',r.valorHoraBase],['Negociação / HH',r.valorHoraOferta-r.valorHoraBase],['Carga Simples / HH',r.cargaSimplesTotal/dados.jornada],['Financeiro / HH',r.custoAntecipacao/dados.jornada],['Resultado / HH',r.resultadoEconomico/dados.jornada]].map(([l,v])=>`<div class="hour-item"><span>${l}</span><strong>${brl(v)}</strong></div>`).join('');
  document.getElementById('valorHoraOferta').textContent=brl(r.valorHoraOferta);
  document.getElementById('valorHoraBaseInfo').textContent=`Base sem negociação: ${brl(r.valorHoraBase)}`;
  document.getElementById('provaReal').innerHTML=[['NF base',r.precoBase,''],['ISS retido (parte do Simples)',r.issRetido,'warn'],['INSS retido (compensável)',r.inssRetido,'warn'],['Recebido do cliente',r.recebivelLiquido,''],['DAS a recolher (sem ISS retido)',r.dasRecolher,''],['Carga Simples total',r.cargaSimplesTotal,''],['Custo antecipação',r.custoAntecipacao,''],[`Resultado econômico (${pct(r.resultadoPerc)} s/ custo)`,r.resultadoEconomico,'good']].map(([l,v,c])=>`<div class="proof-item ${c}"><span>${l}</span><strong>${brl(v)}</strong></div>`).join('');
  renderCargoButtons();renderTabela();renderCustos();
}

function renderTabela(){
  const thead=document.querySelector('#tabelaValores thead');const tbody=document.querySelector('#tabelaValores tbody');
  thead.innerHTML=`<tr><th>Cliente</th>${cargos.map(c=>`<th>${c.nome}</th>`).join('')}</tr>`;
  tbody.innerHTML=clientes.filter(c=>c.id!=='manual').map(cl=>{const cells=cargos.map(c=>{const d=Object.assign({},dados,{salario:c.salario,diasAntecipacao:cl.dias,descontoNegociacaoPerc:cl.neg});return `<td>${brl(calc(d).valorHoraOferta)}</td>`}).join('');return `<tr><td><strong>${cl.nome}</strong><br><small>${cl.dias} dias • negociação ${cl.neg}%</small></td>${cells}</tr>`}).join('')
}
function renderCustos(){
  const box=document.getElementById('listaCustos');box.innerHTML=custos.map((i,idx)=>`<div class="cost-row"><input data-cost-name="${idx}" value="${i.nome.replace(/"/g,'&quot;')}"><input data-cost-value="${idx}" type="number" step="0.01" value="${i.valor}"><button class="remove-cost" data-remove="${idx}">×</button></div>`).join('');
  box.querySelectorAll('[data-cost-name]').forEach(el=>el.oninput=e=>{custos[+e.target.dataset.costName].nome=e.target.value;save()});
  box.querySelectorAll('[data-cost-value]').forEach(el=>el.oninput=e=>{custos[+e.target.dataset.costValue].valor=Number(e.target.value)||0;save();render()});
  box.querySelectorAll('[data-remove]').forEach(el=>el.onclick=e=>{custos.splice(+e.target.dataset.remove,1);save();render()});
  const total=totalCustoFixo();document.getElementById('totalCustoFixo').textContent=brl(total);document.getElementById('custoPorFuncionario').textContent=brl(dados.qtdFunc?total/dados.qtdFunc:0);document.getElementById('custoPorFuncLegenda').textContent=`Total ÷ ${dados.qtdFunc} funcionários`;
}

function download(name,content,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function exportTxt(){const r=calc();download('calculadora-hh-2026.txt',`CALCULADORA HH 2026 - MULTPREST\n\nCargo: ${cargos.find(c=>c.id===dados.cargoAtivo)?.nome||'Manual'}\nSalário base: ${brl(dados.salario)}\nCusto mensal: ${brl(r.custoTotal)}\nCusto HH: ${brl(r.custoHora)}\nValor HH base: ${brl(r.valorHoraBase)}\nValor HH oferta: ${brl(r.valorHoraOferta)}\nDAS: ${pct(dados.simplesPerc)}\nINSS Patronal + RAT/FAP: ${pct(dados.inssPatronalPerc)}\n`)}
function exportCsv(){const r=calc();download('calculadora-hh-2026.csv',`Campo;Valor\nSalário Base;${dados.salario}\nCusto Mensal;${r.custoTotal}\nCusto HH;${r.custoHora}\nValor HH Base;${r.valorHoraBase}\nValor HH Oferta;${r.valorHoraOferta}\n`,'text/csv;charset=utf-8')}

inputIds.forEach(id=>{const el=document.getElementById(id);el.addEventListener('input',e=>{dados[id]=Number(e.target.value)||0;if(id==='qtdFunc')dados.qtdFunc=Math.max(1,Math.round(dados.qtdFunc));save();render()})});
document.getElementById('clientePreset').addEventListener('change',e=>{const cl=clientes.find(c=>c.id===e.target.value);dados.clientePreset=cl.id;if(cl.dias!==null)dados.diasAntecipacao=cl.dias;if(cl.neg!==null)dados.descontoNegociacaoPerc=cl.neg;syncInputs();save();render()});
document.getElementById('limparCargo').onclick=()=>{dados.cargoAtivo=null;save();renderCargoButtons()};
document.getElementById('btnReset').onclick=()=>{if(confirm('Resetar os parâmetros da calculadora para os padrões 2026?')){dados=clone(defaults);custos=clone(custosPadrao);save();syncInputs();render()}};
document.getElementById('btnExportTxt').onclick=exportTxt;document.getElementById('btnExportCsv').onclick=exportCsv;
document.getElementById('addCusto').onclick=()=>{custos.push({id:String(Date.now()),nome:'Novo item',valor:0});save();render()};
document.getElementById('resetCustos').onclick=()=>{if(confirm('Restaurar os custos fixos padrão?')){custos=clone(custosPadrao);save();render()}};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById(`tab-${t.dataset.tab}`).classList.add('active')});

renderClientes();syncInputs();render();