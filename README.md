# Calculadora HH 2026 — Multprest

Calculadora de custo mensal e formação do valor-hora da Multprest.

## Base de outubro/2026

- Jornada usada na formação: 220 h/mês.
- Salários-base atualizados com dissídio de 5%.
- Insalubridade: 20% sobre salário mínimo de R$ 1.621,00.
- Prêmio assiduidade: R$ 380,00, fora da base de encargos na parametrização atual.
- INSS patronal + RAT/FAP: 24,8516% (editável).
- FGTS: 8%.
- DAS Anexo IV: 10,81% (editável mensalmente).
- ISS retido: 4,36% (efeito de recebimento, sem somar novamente ao DAS).
- INSS retido: 0% por padrão, editável quando houver retenção.
- Seguro mensal total: R$ 792,69 (Icatu + Sicredi).
- Exames: R$ 339,00/ano = R$ 28,25/mês.
- Kit inicial EPI/uniforme: R$ 448,50, amortizado inicialmente em 12 meses = R$ 37,38/mês.
- Ferramentas: R$ 300,00/mês provisório como depreciação/reposição, editável até o inventário patrimonial.
- Treinamentos: R$ 380,00/ano quando aplicáveis, editável.
- Funcionários produtivos: 6, editável.
- Markup sobre custo: 30%, editável.
- Taxa de antecipação: 0,1% ao dia, editável.

## Prazos padrão

- BRF: 180 dias
- JBS: 120 dias
- JBS Couros: 10 dias
- Seara: 120 dias
- Vibra: 30 dias
- SBE: à vista
- Agrogen: 35 dias
- Lar: 5 dias
- Mig Plus: 45 dias

A margem de negociação padrão é 12% para JBS/JBS Couros e 8% para os demais, sempre editável.

## Custo fixo

A aba **Custo Fixo** é a fonte do custo operacional. O total é a soma dos itens e é rateado automaticamente pelo número de funcionários produtivos.

O item antigo **Seguro Func. R$ 600** foi retirado do custo fixo para evitar duplicidade. Os dois seguros são tratados no campo próprio de Seguro de Vida.

O item **Salários ADM** foi renomeado para **Retiradas Administrativas**.

## Regras importantes

- O prêmio de assiduidade é custo mensal, mas não entra na base de FGTS/INSS/férias/13º nesta parametrização.
- A provisão rescisória usada nesta versão é a reserva de 40% sobre o FGTS provisionado. Não foi criado um percentual fictício de aviso-prévio.
- ISS e INSS retidos reduzem o recebível disponível para antecipação.
- O custo financeiro da antecipação é calculado sobre o recebível líquido após retenções.
- As 220 horas foram mantidas como divisor da formação de preço.

## Publicação

O projeto é estático (`index.html`, `styles.css`, `app.js`) e pode ser publicado diretamente no GitHub Pages ou hospedado em Vercel/Netlify sem build.

## Próximas validações

- Conferir a prova real do pedreiro com os valores de R$ 77, R$ 85, R$ 95 e R$ 110.
- Revisar a depreciação real de ferramentas/equipamentos quando houver inventário.
- Ajustar qualquer regra fiscal se a contabilidade trouxer nova orientação.
