import { parseBriefMarkdown } from "./brief-md";
import { createFromFixedCopy } from "./creation";
import { generateDistinctLooks } from "./look";
import type { BrandKit, Project } from "./types";

/** Same bytes as public/briefs/sistema-crescimento.md — the file the studio reads. */
export const SISTEMA_MARKDOWN = `---
nome: Sistema de Crescimento
parceiro: REDNA
---

## Para quem
Apresentação em reunião. Público consciente e já diagnosticado. Não é para tráfego frio nem para o site.

## Headline
Um plano bem feito continua a ser um palpite até alguém o testar.

## Subheadline
Podes montar o funil certo à primeira. Acontece. Mas se ninguém olhar para o que aconteceu a seguir, nunca vais saber se acertaste, ou só não deste por isso. O Sistema de Crescimento constrói o percurso e fica a trabalhá-lo durante quatro meses, com o que os dados forem dizendo.

## Problemas
- Uma página nova costuma trazer resultado. Depois estabiliza, e ninguém sabe se estabilizou no melhor sítio possível ou no primeiro que apareceu.
- O mesmo com o tráfego: a primeira campanha diz-te pouco. É a terceira, já com o que aprendeste nas duas anteriores, que começa a valer alguma coisa.
- Quando o trabalho acaba na entrega, ficas com a versão inicial de tudo. Funcione ela bem ou mal.

## História
O problema não é montar. É o que acontece depois.

Uma página nova costuma trazer resultado. Depois estabiliza, e ninguém sabe se estabilizou no melhor sítio possível ou no primeiro que apareceu.

O mesmo com o tráfego: a primeira campanha diz-te pouco. É a terceira, já com o que aprendeste nas duas anteriores, que começa a valer alguma coisa.

Quando o trabalho acaba na entrega, ficas com a versão inicial de tudo. Funcione ela bem ou mal.

## Mecanismo
### Mês 1. Diagnosticar, construir e lançar
Na primeira semana olhamos para os números e escolhemos a prioridade. Em paralelo trabalhamos a mensagem e a página. O objetivo é ter o primeiro teste a correr ainda este mês, não daqui a dois.

### Mês 2. Medir e corrigir
A primeira leitura a sério. O que a página fez, o que os anúncios trouxeram, onde as pessoas param. Corrigimos o que estiver a criar fricção.

### Mês 3. Otimizar
Já com dados suficientes para decidir com alguma confiança. Trabalhamos o que tem impacto na compra, não o que é mais fácil de mexer.

### Mês 4. Consolidar e decidir
O que ficámos a saber, o que fica a funcionar sozinho, e o que fazer a seguir: continuar, acelerar, internalizar ou parar.

## Oferta
Sistema de Crescimento

## O que inclui
- Uma oferta. Um funil. Uma fonte de procura. Tempo suficiente para melhorar.
- A oferta principal trabalhada e o percurso de venda construído
- Uma página principal e uma de confirmação
- O mecanismo de captação: formulário, quiz ou calendário
- Até cinco emails ou mensagens de follow-up
- Uma fonte de tráfego ativada e gerida durante os quatro meses
- Até cinco conceitos iniciais de anúncios, e até duas rondas novas por mês a partir do mês 2
- Duas rondas de revisão na construção
- Uma reunião de decisão por mês depois do lançamento
- O tracking da lead até à venda
- O fecho do ciclo, com o que ficou aprendido e a recomendação seguinte

## Levas
- a oferta principal trabalhada e o percurso de venda construído
- uma página principal e uma de confirmação
- o mecanismo de captação, formulário, quiz ou calendário
- até cinco emails ou mensagens de follow-up
- uma fonte de tráfego ativada e gerida durante os quatro meses
- até cinco conceitos iniciais de anúncios, e até duas rondas novas por mês a partir do mês 2
- duas rondas de revisão na construção
- uma reunião de decisão por mês depois do lançamento
- o tracking da lead até à venda
- o fecho do ciclo, com o que ficou aprendido e a recomendação seguinte

## Não levas
- vários funis ao mesmo tempo
- mais do que uma plataforma de anúncios
- uma oferta nova sem necessidade
- gestão de redes ou produção contínua de conteúdo
- o orçamento de tráfego, ferramentas ou fornecedores

## O que é teu
- dás acesso aos dados e às contas
- aprovas decisões em até 48 horas úteis
- respondes às leads e fechas as vendas
- tens capacidade para receber os clientes que aparecerem
- apareces em conteúdo ou criativos quando fizer falta
- o orçamento de tráfego é pago por ti, diretamente à plataforma

## Autoridade
Trabalho em marketing desde 2021. Nesse tempo analisei mais de 50 negócios, com diagnóstico e recomendações, e participei diretamente em mais de 100 funis de vendas, meus e de outras pessoas. O que proponho não sai de um manual. Sai de ter visto o mesmo tipo de erro repetido em negócios diferentes, e de saber quais é que costumam custar mais.

## Garantia
Se os ativos acordados não ficarem implementados e a funcionar por falha minha, continuo até estarem, sem cobrar mais. Não garanto vendas, faturação nem ROAS. Garanto o trabalho, e garanto que os números que te mostrar são os reais.

## Investimento
3.000 € + IVA, ou quatro prestações de 800 € + IVA. O compromisso é de quatro meses. O pagamento faseado é uma facilidade de tesouraria, não uma renovação mensal: o projeto só dá leitura útil se completar o ciclo. O orçamento de tráfego é à parte e pago por ti diretamente à plataforma. Sem verba de tráfego, o sistema fica construído e não arranca.

## Próximo passo
Dizes que sim e envias os dados de faturação. Recebes a fatura nas 24 horas seguintes. Marcamos a sessão de arranque e começamos.

## CTA
Avançar com o Sistema de Crescimento
`;

export const SISTEMA_MD_PATH = "/briefs/sistema-crescimento.md";

export const REDNA_BRAND: BrandKit = {
  name: "REDNA",
  primary: "#101513",
  accent: "#377fb5",
  background: "#f3f4ee",
  foreground: "#101513",
  muted: "#59615c",
  surface: "#fbfcf8",
  headingFont: "syne",
  bodyFont: "outfit",
  radius: "none",
};

export function pagesFromMarkdown(markdown: string, count = 3): Project[] {
  const parsed = parseBriefMarkdown(markdown);
  const partner = parsed.partner || "REDNA";

  const created = createFromFixedCopy({
    name: parsed.name || "Sistema de Crescimento",
    partner,
    copy: parsed.copy,
    type: "sales",
  });
  const brand = { ...REDNA_BRAND, name: created.brand.name || REDNA_BRAND.name };
  const looks = generateDistinctLooks(
    {
      type: created.type,
      partner,
      brand,
      headline: created.copy.headline,
      offerName: created.copy.offerName,
    },
    count,
    ["cover", "mechanism", "argument"],
  );

  return looks.map((look, index) => ({
    ...created,
    id: `sistema-md-${index + 1}`,
    name: count === 1 ? created.name : `${created.name} · ${index + 1}`,
    partner,
    brand,
    form: {
      ...created.form,
      fields: ["firstName", "email", "business"] as const,
      submitLabel: parsed.copy.cta || created.form.submitLabel,
      note: "Compromisso de quatro meses. O orçamento de tráfego é à parte e pago por ti à plataforma.",
    },
    look,
  }));
}

export function sistemaPagesFromMd(count = 3) {
  return pagesFromMarkdown(SISTEMA_MARKDOWN, count);
}

export async function fetchSistemaPages(count = 3) {
  const markdown = await fetch(SISTEMA_MD_PATH).then((response) => response.text());
  return pagesFromMarkdown(markdown, count);
}
