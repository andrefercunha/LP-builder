import { emptyFixedCopy, type FixedCopy } from "./creation";
import type { TemplateId } from "./types";

export type TestBrief = {
  id: string;
  name: string;
  expectLook: string;
  expectTemplate: TemplateId;
  whatToWatch: string;
  copy: FixedCopy;
};

function pack(partial: Partial<FixedCopy>): FixedCopy {
  return { ...emptyFixedCopy(), ...partial };
}

export const TEST_BRIEFS: TestBrief[] = [
  {
    id: "sessao",
    name: "Copy de sessão",
    expectLook: "Carta",
    expectTemplate: "booking-letter",
    whatToWatch: "À direita tem de aparecer Carta. Depois abres e vês uma página de conversa, não um evento.",
    copy: pack({
      audience: "Pessoas capazes com uma mudança concreta parada.",
      headline: "Há uma coisa importante que continua parada. Vamos perceber porquê.",
      cta: "Marcar a sessão",
      offerName: "Sessão Anti-Tretas",
      body: "Há sempre uma razão plausível. Algumas são verdadeiras. O problema aparece quando todas acabam no mesmo resultado: nada muda. A sessão cria um espaço para olharmos para uma situação concreta sem a maquilhar.",
      nextStep: "30 minutos por Google Meet. Sem obrigação de continuar.",
    }),
  },
  {
    id: "workshop",
    name: "Copy de workshop",
    expectLook: "Cartaz",
    expectTemplate: "opt-in-dense",
    whatToWatch: "À direita tem de aparecer Cartaz. A página é um ecrã: headline, prova e formulário.",
    copy: pack({
      audience: "Donos de negócio que vendem serviço.",
      headline: "Reserva o teu lugar no workshop de lançamentos",
      cta: "Quero o convite",
      offerName: "Workshop Create Pro",
      problems: ["Improvisas o lançamento", "A lista está fria", "O VSL não converte", "", ""],
      nextStep: "Entras na lista e recebes o convite.",
    }),
  },
  {
    id: "obrigado",
    name: "Copy de obrigado",
    expectLook: "Recibo",
    expectTemplate: "thanks-next",
    whatToWatch: "À direita tem de aparecer Recibo. Só confirmação e o que fazer a seguir.",
    copy: pack({
      headline: "Registo confirmado",
      cta: "Ver o email",
      nextStep: "Entra no email e confirma o lugar no workshop.",
    }),
  },
];
