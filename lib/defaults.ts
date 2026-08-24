import type { BrandKit, FormConfig, PageCopy, PageType, Photos, Project, TemplateId } from "./types";

export const PAGE_TYPES: Array<{
  id: PageType;
  template: TemplateId;
  label: string;
  brief: string;
}> = [
  {
    id: "opt-in",
    template: "opt-in-dense",
    label: "Opt-in / Registo",
    brief: "Uma ecrã denso: headline, prova e formulário. Estilo evento / VSL.",
  },
  {
    id: "sales",
    template: "sales-long",
    label: "Página de vendas",
    brief: "Documento de reunião: argumento, âmbito, investimento.",
  },
  {
    id: "booking",
    template: "booking-letter",
    label: "Marcação / Sessão",
    brief: "Uma conversa com destino único. Editorial, honesta, sem teatro.",
  },
  {
    id: "thanks",
    template: "thanks-next",
    label: "Obrigado",
    brief: "Confirmação + próximo passo imediato. Sem deixar a pessoa à espera.",
  },
];

export const DEFAULT_CTA: Record<PageType, string> = {
  "opt-in": "Quero o meu lugar",
  sales: "Quero começar",
  booking: "Marcar a conversa",
  thanks: "Ir para o próximo passo",
};

export const LOOKS: Array<{
  id: TemplateId;
  type: PageType;
  label: string;
  brief: string;
}> = [
  { id: "opt-in-dense", type: "opt-in", label: "Cartaz", brief: "Escuro, denso, formulário à direita. Evento / VSL." },
  { id: "opt-in-light", type: "opt-in", label: "Revista", brief: "Claro, foto a ocupar metade, ar de capa." },
  { id: "sales-long", type: "sales", label: "Dossier", brief: "Documento de reunião: capítulos, âmbito e preço." },
  { id: "sales-brutal", type: "sales", label: "Manifesto", brief: "Contraste alto, tipo enorme, quase sem decoração." },
  { id: "booking-letter", type: "booking", label: "Carta", brief: "Papel, íntima, uma coluna. Sem herói cinematográfico." },
  { id: "booking-editorial", type: "booking", label: "Cinemática", brief: "Herói escuro, wash de foto, sessão com peso." },
  { id: "thanks-next", type: "thanks", label: "Recibo", brief: "Confirmação centrada e próximo passo." },
];

export function emptyCopy(): PageCopy {
  return {
    eyebrow: "",
    headline: "",
    subheadline: "",
    cta: "",
    ctaHref: "#form",
    ctaSecondary: "",
    audience: "",
    leadTitle: "",
    problems: ["", "", "", "", ""],
    bodyTitle: "",
    body: "",
    mechanismTitle: "",
    mechanismSteps: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
    ],
    offerTitle: "",
    offerName: "",
    offerBullets: ["", "", ""],
    bonuses: [],
    proof: [{ quote: "", name: "", role: "" }],
    guaranteeTitle: "",
    guarantee: "",
    notFor: [],
    willGet: [],
    willGive: [],
    faqs: [
      { q: "", a: "" },
      { q: "", a: "" },
      { q: "", a: "" },
    ],
    nextStep: "",
    legal: "",
    authority: "",
    investment: "",
  };
}

export function emptyBrand(): BrandKit {
  return {
    name: "Parceiro",
    primary: "#101513",
    accent: "#c4a574",
    background: "#f4f1ea",
    foreground: "#101513",
    muted: "#5c635e",
    surface: "#ffffff",
    headingFont: "instrument-serif",
    bodyFont: "libre-franklin",
    radius: "none",
  };
}

export function emptyPhotos(): Photos {
  return { gallery: [] };
}

export function emptyForm(): FormConfig {
  return {
    fields: ["firstName", "email"],
    submitLabel: "Quero o meu lugar",
    note: "Sem spam. Usamos estes dados só para este passo.",
  };
}

export function createProject(partial?: Partial<Project>): Project {
  const now = new Date().toISOString();
  const type = partial?.type ?? "sales";
  const preset = PAGE_TYPES.find((item) => item.id === type)!;
  return {
    id: partial?.id ?? crypto.randomUUID(),
    name: partial?.name ?? "Nova página",
    partner: partial?.partner ?? "Parceiro",
    type,
    template: partial?.template ?? preset.template,
    brand: { ...emptyBrand(), ...partial?.brand },
    copy: { ...emptyCopy(), ...partial?.copy },
    photos: { ...emptyPhotos(), ...partial?.photos },
    form: { ...emptyForm(), ...partial?.form },
    createdAt: partial?.createdAt ?? now,
    updatedAt: now,
  };
}

export function blankList(values: string[], min: number) {
  const next = [...values];
  while (next.length < min) next.push("");
  return next;
}
