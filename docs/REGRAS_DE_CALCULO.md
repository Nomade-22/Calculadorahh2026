# Regras de Cálculo — Calculadora HH 2026

Documento de auditoria da ordem dos cálculos usada na Calculadora HH da Multprest.

## 1. Natureza da calculadora

Esta é uma calculadora **gerencial de formação de preço por hora**, não uma folha de pagamento.

A jornada de 220 h/mês foi mantida por decisão de gestão. Por isso, férias, 13º e seus reflexos são provisionados para carregar na hora vendida os custos que surgem ao longo do vínculo.

## 2. Ordem correta do cálculo

### Etapa A — Remuneração-base sujeita a encargos

```
Insalubridade = salário mínimo × % de insalubridade
Base de encargos = salário-base + insalubridade
```

O prêmio de assiduidade fica fora da base de encargos na configuração atual. Essa classificação só é segura se o pagamento atender ao conceito legal/fiscal de prêmio; por isso o campo permanece separado e editável.

### Etapa B — Provisões trabalhistas

```
Férias (1/12) = base de encargos ÷ 12
1/3 de férias = férias ÷ 3
Férias + 1/3 = férias + 1/3
13º = base de encargos ÷ 12
```

Para a formação da HH com divisor de 220 h, a calculadora mantém a provisão completa de férias + 1/3. Se no futuro o modelo mudar para horas produtivas anuais, esta regra deverá ser revista para não haver dupla cobertura do período de férias.

### Etapa C — FGTS

```
FGTS base = base de encargos × 8%
FGTS férias = (férias + 1/3) × 8%
FGTS 13º = 13º × 8%
FGTS total = soma das três parcelas
```

### Etapa D — CPP + RAT/FAP

```
INSS/RAT base = base de encargos × 24,8516%
INSS/RAT férias = (férias + 1/3) × 24,8516%
INSS/RAT 13º = 13º × 24,8516%
```

O percentual de 24,8516% permanece editável porque depende da informação vigente da contabilidade/FAP.

### Etapa E — Reserva rescisória

```
Reserva rescisória = 40% × FGTS total provisionado
```

É uma reserva gerencial conservadora para dispensa sem justa causa. Não foi criado percentual mensal de aviso-prévio porque ele depende do histórico real de desligamentos e tempo de serviço.

### Etapa F — Custos adicionais por funcionário

São somados depois dos encargos:

- prêmio de assiduidade;
- EPI/uniforme mensal;
- exames mensalizados;
- ferramentas/depreciação;
- plano de saúde;
- alimentação e transporte, quando preenchidos;
- treinamento anual ÷ 12;
- seguros mensais ÷ quantidade de funcionários produtivos;
- custo fixo total ÷ quantidade de funcionários produtivos.

### Etapa G — Custo da HH

```
Custo mensal carregado =
base de encargos
+ prêmio
+ provisões/encargos
+ custos individuais
+ custo fixo rateado
+ seguros rateados
+ treinamentos mensalizados

Custo HH = custo mensal carregado ÷ 220
```

### Etapa H — Markup

```
Custo com markup = custo mensal carregado × (1 + markup)
```

O padrão atual é 30% de **markup sobre custo**, e não margem líquida sobre a venda.

### Etapa I — DAS, retenções e antecipação

O DAS efetivo informado é tratado como **carga econômica total do Simples**.

Quando há ISS retido:

```
ISS retido = NF × % ISS
DAS a recolher = NF × (DAS efetivo total - % ISS retido)
Carga Simples total = DAS a recolher + ISS retido
```

Assim o ISS não é contado duas vezes.

O INSS retido:

```
INSS retido = NF × % INSS retido
```

reduz o caixa recebido, mas é tratado como crédito/compensação previdenciária e não como novo custo.

O valor antecipável é:

```
Recebível líquido = NF - ISS retido - INSS retido
Custo de antecipação = recebível líquido × dias × taxa diária
```

### Etapa J — Preço-base

A fórmula faz gross-up para que, depois da carga do Simples e do custo financeiro, ainda reste o markup desejado:

```
Preço-base =
Custo com markup
÷
[1 - DAS efetivo - (taxa antecipação × fração líquida recebível)]
```

### Etapa K — Margem de negociação

A margem de negociação funciona como espaço para desconto:

```
Preço de oferta = preço-base ÷ (1 - % negociação)
```

Exemplo: com 12%, o preço de oferta é maior que simplesmente “preço-base + 12%”, porque o objetivo é que um desconto de 12% sobre a oferta retorne exatamente ao preço-base.

## 3. Parâmetros atuais

- Salário mínimo 2026: R$ 1.621,00
- Insalubridade: 20%
- FGTS: 8%
- INSS patronal + RAT/FAP: 24,8516% editável
- DAS efetivo total: 10,81% editável
- ISS retido: 4,36% editável
- INSS retido: 0% por padrão, editável
- Markup: 30%
- Taxa de antecipação: 0,1% ao dia, editável
- Funcionários produtivos: 6, editável
- Custo fixo padrão atual: R$ 28.300,00
- Seguros: R$ 792,69/mês
- Exames: R$ 339/ano
- Treinamentos: R$ 380/ano quando aplicáveis
- Jornada: 220 h/mês

## 4. Pontos que continuam deliberadamente editáveis

Ferramentas/depreciação, plano de saúde, EPI/reposições, treinamentos por função, DAS mensal, retenções, taxa de antecipação, prazo do cliente, margem de negociação e quantidade de funcionários.

## 5. Bases oficiais consultadas

- Receita Federal — Anexo IV: a CPP patronal não está incluída no DAS e é recolhida fora do Simples.
  https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cobrancas-e-intimacoes/contribuicao-previdenciaria-anexo-iv-do-simples-nacional

- Lei 8.036/1990, art. 15 — FGTS de 8% sobre remuneração e gratificação natalina.
  https://www.planalto.gov.br/ccivil_03/leis/l8036compilada.htm

- eSocial — férias gozadas e terço constitucional com incidência de contribuição previdenciária e FGTS.
  https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-07-2026-com-marcacoes.pdf

- Ministério da Previdência/STJ — contribuição patronal incide sobre adicional de insalubridade.
  https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/stj/resp-2050498-2050837-e-2052982-tema-1252-stj-incide-contribuicao-ao-rgps-sobre-adicional-de-insalubridade

- Resolução CGSN 140/2018, art. 27 — receita com ISS retido não recolhe novamente essa parcela de ISS pelo Simples.
  https://normas.receita.fazenda.gov.br/sijut2consulta/normas.receisulta/link.action?idAto=92278&visao=compilado

- CLT, art. 457 — regras para prêmios.
  https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm

- Receita Federal, Solução de Consulta Cosit 10/2026 — para excluir prêmio da base previdenciária é necessário que seja liberalidade e decorrente de desempenho superior ao ordinariamente esperado.
  https://normas.receita.fazenda.gov.br/sijut2consulta/consulta.action?termoBusca=RFB+971%2F2009

- Decreto 12.797/2025 — salário mínimo de 2026: R$ 1.621,00.
  https://planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12797.htm

## 6. Observação importante sobre prêmio de assiduidade

A calculadora mantém R$ 380,00 fora de FGTS/INSS/férias/13º conforme a parametrização informada. Porém, a Receita exige requisitos materiais para que um pagamento chamado de “prêmio” seja excluído da contribuição. Isso deve permanecer alinhado com a forma como a contabilidade registra a rubrica e com a política/documentação da Multprest.
