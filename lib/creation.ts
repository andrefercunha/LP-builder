import { DEFAULT_CTA, LOOKS, PAGE_TYPES, createProject, emptyBrand, emptyCopy, emptyForm } from "./defaults";
import { recommendPage } from "./recommend";
import type { PageCopy, PageType, Project, StepItem, TemplateId } from "./types";

export type PageBrief = {
  audience: string;
  outcome: string;
  offer: string;
  nextStep: string;
  cta: string;
};

export type FixedCopy = {
  audience: string;
  headline: string;
  subheadline: string;
  problems: string[];
  body: string;
  mechanismSteps: StepItem[];
  offerName: string;
  offerBullets: string[];
  proofQuote: string;
  proofName: string;
  notFor: string[];
  guarantee: string;
  nextStep: string;
  cta: string;
};

export type CopyFieldKind = "text" | "multiline" | "list" | "steps" | "proof" | "faqs";

export type CopyFieldSpec = {
  id: keyof PageCopy;
  label: string;
  hint?: string;
  kind: CopyFieldKind;
  rows?: number;
  min?: number;
};

export type TemplateCreation = {
  photoHint: string;
  heroLabel: string;
  portraitLabel: string;
  wantsForm: boolean;
  intro: string;
  fields: CopyFieldSpec[];
};

export function emptyBrief(): PageBrief {
  return { audience: "", outcome: "", offer: "", nextStep: "", cta: "" };
}

export function emptyFixedCopy(): FixedCopy {
  return {
    audience: "",
    headline: "",
    subheadline: "",
    problems: ["", "", "", "", ""],
    body: "",
    mechanismSteps: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
    ],
    offerName: "",
    offerBullets: ["", "", ""],
    proofQuote: "",
    proofName: "",
    notFor: ["", "", ""],
    guarantee: "",
    nextStep: "",
    cta: "",
  };
}

function padList(values: string[], min: number) {
  const next = values.map((value) => value);
  while (next.length < min) next.push("");
  return next;
}

export function fixedCopyToPageCopy(fixed: FixedCopy, base: PageCopy = emptyCopy()): PageCopy {
  const audience = fixed.audience.trim();
  const nextStep = fixed.nextStep.trim();
  return {
    ...base,
    audience,
    eyebrow: base.eyebrow.trim() || audience,
    headline: fixed.headline.trim(),
    subheadline: fixed.subheadline.trim() || nextStep,
    problems: padList(fixed.problems, 5),
    body: fixed.body.trim(),
    mechanismSteps:
      fixed.mechanismSteps.length >= 3
        ? fixed.mechanismSteps
        : [...fixed.mechanismSteps, ...emptyCopy().mechanismSteps].slice(0, 3),
    offerName: fixed.offerName.trim(),
    offerBullets: padList(fixed.offerBullets, 3),
    proof: [
      {
        quote: fixed.proofQuote.trim(),
        name: fixed.proofName.trim(),
        role: base.proof[0]?.role ?? "",
      },
    ],
    notFor: fixed.notFor.filter((item) => item.trim()),
    guarantee: fixed.guarantee.trim(),
    nextStep,
    cta: fixed.cta.trim(),
    ctaHref: base.ctaHref || "#form",
  };
}

export function pageCopyToFixed(copy: PageCopy): FixedCopy {
  return {
    audience: copy.audience,
    headline: copy.headline,
    subheadline: copy.subheadline,
    problems: copy.problems,
    body: copy.body,
    mechanismSteps: copy.mechanismSteps,
    offerName: copy.offerName,
    offerBullets: copy.offerBullets,
    proofQuote: copy.proof[0]?.quote ?? "",
    proofName: copy.proof[0]?.name ?? "",
    notFor: copy.notFor,
    guarantee: copy.guarantee,
    nextStep: copy.nextStep,
    cta: copy.cta,
  };
}

export function looksForType(type: PageType) {
  return LOOKS.filter((item) => item.type === type);
}

export function uniqueBrandSources(projects: Project[]): Project[] {
  const seen = new Map<string, Project>();
  for (const project of projects) {
    const key = `${project.brand.name}|${project.partner}`;
    if (!seen.has(key)) seen.set(key, project);
  }
  return [...seen.values()];
}

export function isBriefEmpty(brief: PageBrief) {
  return !brief.audience.trim() && !brief.outcome.trim() && !brief.offer.trim() && !brief.nextStep.trim();
}

export function isCopyStarted(copy: PageCopy) {
  return Boolean(copy.headline.trim() || copy.offerName.trim() || copy.audience.trim());
}

export function applyBrief(copy: PageCopy, brief: PageBrief): PageCopy {
  const next = { ...copy };
  const audience = brief.audience.trim();
  const outcome = brief.outcome.trim();
  const offer = brief.offer.trim();
  const nextStep = brief.nextStep.trim();
  const cta = brief.cta.trim();

  if (audience) {
    next.audience = audience;
    if (!next.eyebrow.trim()) next.eyebrow = audience;
  }
  if (outcome) next.headline = outcome;
  if (offer) next.offerName = offer;
  if (nextStep) {
    next.nextStep = nextStep;
    if (!next.subheadline.trim()) next.subheadline = nextStep;
  }
  if (cta) next.cta = cta;
  return next;
}

export function createFromWizard({
  type,
  template,
  name,
  partner,
  brief,
  source,
}: {
  type: PageType;
  template: TemplateId;
  name: string;
  partner: string;
  brief: PageBrief;
  source?: Project;
}): Project {
  return createFromFixedCopy({
    name,
    partner,
    copy: {
      ...emptyFixedCopy(),
      audience: brief.audience,
      headline: brief.outcome,
      offerName: brief.offer,
      nextStep: brief.nextStep,
      cta: brief.cta,
    },
    source,
    template,
    type,
  });
}

export function createFromFixedCopy({
  name,
  partner,
  copy,
  source,
  template,
  type,
}: {
  name: string;
  partner: string;
  copy: FixedCopy;
  source?: Project;
  template?: TemplateId;
  type?: PageType;
}): Project {
  const photos = source ? { ...source.photos, gallery: [...source.photos.gallery] } : undefined;
  const picked = template
    ? { template, type: type ?? LOOKS.find((item) => item.id === template)?.type ?? "opt-in" }
    : recommendPage(copy, photos);
  const pageType = type ?? picked.type;
  const pageTemplate = template ?? picked.template;
  const typeLabel = PAGE_TYPES.find((item) => item.id === pageType)?.label ?? "página";
  const cta = copy.cta.trim() || DEFAULT_CTA[pageType];
  const pageCopy = fixedCopyToPageCopy({ ...copy, cta });
  const project = createProject({
    type: pageType,
    template: pageTemplate,
    name: name.trim() || copy.offerName.trim() || copy.headline.trim().slice(0, 42) || `Nova ${typeLabel.toLowerCase()}`,
    partner: source?.partner ?? (partner.trim() || "Parceiro"),
    brand: source
      ? { ...source.brand }
      : { ...emptyBrand(), name: partner.trim() || "Parceiro" },
    photos,
    copy: pageCopy,
    form: {
      ...emptyForm(),
      submitLabel: cta,
    },
  });

  return project;
}

export function cloneAsNewPage(source: Project, template: TemplateId, type: PageType): Project {
  return createFromWizard({
    type,
    template,
    name: `${source.brand.name} · ${LOOKS.find((item) => item.id === template)?.label ?? type}`,
    partner: source.partner,
    brief: emptyBrief(),
    source,
  });
}

export const FLAG_TAB: Record<string, "tipo" | "marca" | "fotos" | "copy" | "qualidade"> = {
  "clear-outcome": "copy",
  opportunity: "copy",
  "new-method": "copy",
  value: "copy",
  empathy: "copy",
  results: "copy",
  "social-proof": "copy",
  offer: "copy",
  objections: "copy",
  "next-steps": "copy",
  scarcity: "copy",
  brand: "marca",
  photos: "fotos",
  "cta-coherence": "copy",
};

const HERO: CopyFieldSpec = {
  id: "headline",
  label: "Headline",
  hint: "Promessa clara. Evita slogans e travessões longos.",
  kind: "multiline",
  rows: 3,
};

const SUB: CopyFieldSpec = {
  id: "subheadline",
  label: "Subheadline",
  hint: "O que acontece, para quem, em que prazo.",
  kind: "multiline",
  rows: 3,
};

const EYEBROW: CopyFieldSpec = {
  id: "eyebrow",
  label: "Eyebrow",
  hint: "Chamada de audiência ou contexto. Uma linha.",
  kind: "text",
};

const AUDIENCE: CopyFieldSpec = {
  id: "audience",
  label: "Para quem é",
  hint: "Uma frase. Sem ‘para todos os que querem crescer’.",
  kind: "text",
};

const CTA: CopyFieldSpec = {
  id: "cta",
  label: "CTA",
  hint: "Acção proporcional: marcar, reservar, pedir acesso.",
  kind: "text",
};

const CTA_HREF: CopyFieldSpec = {
  id: "ctaHref",
  label: "Ligação do CTA",
  kind: "text",
};

const LEGAL: CopyFieldSpec = {
  id: "legal",
  label: "Legal / disclaimer",
  kind: "multiline",
  rows: 3,
};

const NEXT: CopyFieldSpec = {
  id: "nextStep",
  label: "O que acontece a seguir",
  hint: "Exactamente o que a pessoa recebe ou faz depois do clique.",
  kind: "multiline",
  rows: 3,
};

const PROBLEMS: CopyFieldSpec = {
  id: "problems",
  label: "Problemas",
  hint: "Frases na linguagem do cliente. Spray, não cartões com ícones.",
  kind: "list",
  min: 5,
};

const PROOF: CopyFieldSpec = {
  id: "proof",
  label: "Prova autorizada",
  hint: "Só testemunho com autorização. Sem prova, tira a secção.",
  kind: "proof",
};

const STEPS: CopyFieldSpec = {
  id: "mechanismSteps",
  label: "Passos do mecanismo",
  hint: "Uma forma diferente de chegar ao resultado, com nome.",
  kind: "steps",
};

const FAQS: CopyFieldSpec = {
  id: "faqs",
  label: "FAQ",
  kind: "faqs",
};

export const TEMPLATE_CREATION: Record<TemplateId, TemplateCreation> = {
  "opt-in-dense": {
    wantsForm: true,
    photoHint: "Uma foto de cena para o wash. Retrato só se for do parceiro, não stock de palco.",
    heroLabel: "Cena / wash",
    portraitLabel: "Retrato (opcional)",
    intro: "Cartaz: headline, prova e formulário. Sem capítulos de página de vendas.",
    fields: [
      EYEBROW,
      AUDIENCE,
      HERO,
      SUB,
      { ...PROBLEMS, label: "Friso de prova / problemas", hint: "3 a 6 frases curtas que correm no friso.", min: 3 },
      PROOF,
      { id: "offerName", label: "Nome do evento / lead", kind: "text" },
      NEXT,
      LEGAL,
    ],
  },
  "opt-in-light": {
    wantsForm: true,
    photoHint: "A foto de capa ocupa metade do ecrã. Tem de ser real e ter peso, não um escritório de stock.",
    heroLabel: "Foto de capa",
    portraitLabel: "Retrato (se não houver capa)",
    intro: "Revista: capa + formulário. Pouca copy. Cada linha conta.",
    fields: [EYEBROW, AUDIENCE, HERO, SUB, PROOF, { id: "offerName", label: "Nome do lead", kind: "text" }, NEXT, LEGAL],
  },
  "sales-long": {
    wantsForm: true,
    photoHint: "Herói com atmosfera + retrato do parceiro. As duas âncoras da página.",
    heroLabel: "Herói",
    portraitLabel: "Retrato",
    intro: "Dossier: o fluxo completo. Não deixes secções vazias a meio do argumento.",
    fields: [
      EYEBROW,
      HERO,
      SUB,
      CTA,
      CTA_HREF,
      { id: "ctaSecondary", label: "CTA secundário", kind: "text" },
      { id: "leadTitle", label: "Título do reconhecimento", kind: "text" },
      PROBLEMS,
      { id: "bodyTitle", label: "Título do corpo", kind: "text" },
      {
        id: "body",
        label: "Corpo / história",
        hint: "Transformação e argumento. Sem autobiografia irrelevante.",
        kind: "multiline",
        rows: 7,
      },
      { id: "mechanismTitle", label: "Título do mecanismo", kind: "text" },
      STEPS,
      { id: "offerTitle", label: "Título da oferta", kind: "text" },
      { id: "offerName", label: "Nome da oferta", kind: "text" },
      { id: "offerBullets", label: "O que inclui", kind: "list", min: 3 },
      { id: "bonuses", label: "Bónus", kind: "list", min: 0 },
      PROOF,
      { id: "guaranteeTitle", label: "Título da garantia", kind: "text" },
      {
        id: "guarantee",
        label: "Garantia / risco",
        hint: "Só o que for verdade. Sem resultados garantidos inventados.",
        kind: "multiline",
        rows: 4,
      },
      { id: "notFor", label: "Não é para / não vais receber", kind: "list", min: 3 },
      { id: "willGet", label: "Levas / vamos trabalhar", kind: "list", min: 3 },
      FAQS,
      NEXT,
      LEGAL,
    ],
  },
  "sales-brutal": {
    wantsForm: true,
    photoHint: "Podes viver só de tipo. Se houver foto, que seja um retrato cru, sem stock.",
    heroLabel: "Herói (opcional)",
    portraitLabel: "Retrato",
    intro: "Manifesto: pouca decoração, tipo enorme. A copy tem de aguentar o silêncio.",
    fields: [
      EYEBROW,
      HERO,
      SUB,
      CTA,
      CTA_HREF,
      { id: "leadTitle", label: "Título do reconhecimento", kind: "text" },
      PROBLEMS,
      { id: "bodyTitle", label: "Título do corpo", kind: "text" },
      { id: "body", label: "Corpo / argumento", kind: "multiline", rows: 6 },
      STEPS,
      { id: "offerName", label: "Nome da oferta", kind: "text" },
      { id: "offerBullets", label: "O que inclui", kind: "list", min: 3 },
      PROOF,
      { id: "guarantee", label: "Garantia / risco", kind: "multiline", rows: 4 },
      NEXT,
      LEGAL,
    ],
  },
  "booking-letter": {
    wantsForm: true,
    photoHint: "Um retrato pequeno, como numa carta. Herói quase não se usa.",
    heroLabel: "Herói (raramente usado)",
    portraitLabel: "Retrato",
    intro: "Carta: uma conversa. História, honestidade, um destino.",
    fields: [
      EYEBROW,
      AUDIENCE,
      HERO,
      SUB,
      { id: "body", label: "Corpo da carta", hint: "O parágrafo que segura a página.", kind: "multiline", rows: 7 },
      { id: "leadTitle", label: "Título do reconhecimento", kind: "text" },
      PROBLEMS,
      { id: "mechanismTitle", label: "Título do mecanismo", kind: "text" },
      STEPS,
      { id: "notFor", label: "Não é para", kind: "list", min: 3 },
      { id: "willGet", label: "Vamos trabalhar", kind: "list", min: 3 },
      { id: "guarantee", label: "Risco / honestidade", kind: "multiline", rows: 3 },
      FAQS,
      CTA,
      NEXT,
      LEGAL,
    ],
  },
  "booking-editorial": {
    wantsForm: true,
    photoHint: "Herói para o wash + retrato. Sem as duas, a cinemática fica oca.",
    heroLabel: "Wash do herói",
    portraitLabel: "Retrato",
    intro: "Cinemática: peso visual. A copy continua a ser uma sessão, não um evento.",
    fields: [
      EYEBROW,
      HERO,
      SUB,
      CTA,
      CTA_HREF,
      { id: "ctaSecondary", label: "CTA secundário", kind: "text" },
      { id: "leadTitle", label: "Título do reconhecimento", kind: "text" },
      PROBLEMS,
      { id: "bodyTitle", label: "Título do corpo", kind: "text" },
      { id: "body", label: "Corpo / história", kind: "multiline", rows: 6 },
      { id: "mechanismTitle", label: "Título do mecanismo", kind: "text" },
      STEPS,
      { id: "notFor", label: "Não é para", kind: "list", min: 3 },
      { id: "willGet", label: "Vamos trabalhar", kind: "list", min: 3 },
      { id: "guarantee", label: "Risco / honestidade", kind: "multiline", rows: 3 },
      FAQS,
      NEXT,
      LEGAL,
    ],
  },
  "thanks-next": {
    wantsForm: false,
    photoHint: "Uma atmosfera discreta chega. Não precisas de galeria.",
    heroLabel: "Atmosfera",
    portraitLabel: "Retrato (opcional)",
    intro: "Recibo: confirmaste, agora dizes o que fazer. Nada mais.",
    fields: [
      EYEBROW,
      HERO,
      SUB,
      CTA,
      CTA_HREF,
      {
        id: "offerBullets",
        label: "O que acontece agora",
        hint: "Os 2 a 4 passos imediatos. Não é a oferta de vendas.",
        kind: "list",
        min: 2,
      },
      NEXT,
      LEGAL,
    ],
  },
};

export function creationFor(template: TemplateId): TemplateCreation {
  return TEMPLATE_CREATION[template];
}
