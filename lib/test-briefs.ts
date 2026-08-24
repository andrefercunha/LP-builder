import type { TemplateId } from "./types";

export type TestBrief = {
  id: string;
  file: string;
  name: string;
  expectLook: string;
  expectTemplate: TemplateId;
  whatToWatch: string;
};

export const TEST_BRIEFS: TestBrief[] = [
  {
    id: "sessao",
    file: "/briefs/sessao.md",
    name: "Copy de sessão",
    expectLook: "Carta",
    expectTemplate: "booking-letter",
    whatToWatch: "À direita tem de aparecer Carta. O ficheiro já está no formato.",
  },
  {
    id: "workshop",
    file: "/briefs/workshop.md",
    name: "Copy de workshop",
    expectLook: "Cartaz",
    expectTemplate: "opt-in-dense",
    whatToWatch: "À direita tem de aparecer Cartaz. A página é um ecrã com formulário.",
  },
  {
    id: "obrigado",
    file: "/briefs/obrigado.md",
    name: "Copy de obrigado",
    expectLook: "Recibo",
    expectTemplate: "thanks-next",
    whatToWatch: "À direita tem de aparecer Recibo. Só confirmação e o próximo passo.",
  },
];
