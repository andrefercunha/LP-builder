import { emptyFixedCopy, type FixedCopy } from "../lib/creation";
import { recommendPage } from "../lib/recommend";
import type { TemplateId } from "../lib/types";

function base(partial: Partial<FixedCopy>): FixedCopy {
  return { ...emptyFixedCopy(), ...partial };
}

const cases: Array<{ name: string; copy: FixedCopy; expect: TemplateId }> = [
  {
    name: "registo curto com problemas",
    copy: base({
      headline: "Reserva o teu lugar no workshop de lançamentos",
      cta: "Quero o convite",
      offerName: "Workshop Create Pro",
      problems: ["Improvisas o lançamento", "A lista está fria", "O VSL não converte", "", ""],
      nextStep: "Entras na lista e recebes o convite.",
    }),
    expect: "opt-in-dense",
  },
  {
    name: "registo curto sem spray",
    copy: base({
      headline: "Entra na lista do workshop",
      cta: "Quero o acesso",
      offerName: "Lista Create Pro",
      nextStep: "Recebes o convite por email.",
    }),
    expect: "opt-in-light",
  },
  {
    name: "sessão com história",
    copy: base({
      headline: "Há uma coisa importante que continua parada. Vamos perceber porquê.",
      cta: "Marcar a sessão",
      offerName: "Sessão Anti-Tretas",
      body: "Há sempre uma razão plausível. Algumas são verdadeiras. O problema aparece quando todas acabam no mesmo resultado: nada muda. A sessão cria um espaço para olharmos para uma situação concreta sem a maquilhar.",
      nextStep: "30 minutos por Google Meet. Sem obrigação de continuar.",
    }),
    expect: "booking-letter",
  },
  {
    name: "vendas com capítulos",
    copy: base({
      headline: "Um sistema para vender serviço sem viver de improvisos",
      cta: "Quero começar",
      offerName: "Sistema de crescimento",
      body: "A maior parte das páginas de serviço promete escala e entrega um PDF. Este sistema organiza a conversa, a oferta e o follow-up para o negócio deixar de depender de sorte. Trabalhamos o mecanismo, a prova e o risco com o que é verdade neste mercado.",
      mechanismSteps: [
        { title: "Diagnóstico", text: "Vemos onde a conversa quebra." },
        { title: "Oferta", text: "Nomeamos o que se compra." },
        { title: "Operação", text: "O follow-up deixa de ser memória." },
      ],
      offerBullets: ["Sessões de implementação", "Páginas e scripts", "Revisão mensal"],
      guarantee: "Se o trabalho não estiver feito como combinado, devolvemos o valor do mês.",
      notFor: ["Quem quer dinheiro fácil", "Quem não tem oferta", ""],
      problems: ["Leads frios", "Proposta longa", "Follow-up morto", "Agenda cheia sem venda", ""],
    }),
    expect: "sales-long",
  },
  {
    name: "confirmação",
    copy: base({
      headline: "Registo confirmado",
      cta: "Ver o email",
      nextStep: "Entra no email e confirma o lugar no workshop.",
    }),
    expect: "thanks-next",
  },
];

let failed = 0;
for (const item of cases) {
  const got = recommendPage(item.copy).template;
  if (got !== item.expect) {
    failed += 1;
    console.error(`FAIL ${item.name}: expected ${item.expect}, got ${got}`);
  } else {
    console.log(`ok  ${item.name} → ${got}`);
  }
}

if (failed) {
  process.exit(1);
}
