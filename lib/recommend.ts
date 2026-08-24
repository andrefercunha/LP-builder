import { LOOKS } from "./defaults";
import type { FixedCopy } from "./creation";
import type { PageType, Photos, TemplateId } from "./types";

export type CopySignals = {
  blob: string;
  bodyWords: number;
  headlineWords: number;
  problems: number;
  steps: number;
  bullets: number;
  notFor: number;
  hasProof: boolean;
  hasBody: boolean;
  hasGuarantee: boolean;
  hasOffer: boolean;
  thanks: boolean;
  book: boolean;
  register: boolean;
  buy: boolean;
  punch: boolean;
  event: boolean;
  depth: number;
};

export type LookRecommendation = {
  template: TemplateId;
  type: PageType;
  label: string;
  score: number;
  why: string[];
};

function filled(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function copySignals(copy: FixedCopy): CopySignals {
  const blob = [
    copy.audience,
    copy.headline,
    copy.subheadline,
    copy.body,
    copy.offerName,
    copy.nextStep,
    copy.cta,
    copy.guarantee,
    ...copy.problems,
    ...copy.offerBullets,
    ...copy.notFor,
  ]
    .join(" ")
    .toLowerCase();

  const problems = filled(copy.problems).length;
  const steps = copy.mechanismSteps.filter((step) => step.title.trim() && step.text.trim()).length;
  const bullets = filled(copy.offerBullets).length;
  const notFor = filled(copy.notFor).length;
  const bodyWords = words(copy.body);
  const hasBody = bodyWords >= 25;
  const hasGuarantee = Boolean(copy.guarantee.trim());
  const depth = [hasBody, steps >= 2, bullets >= 3, hasGuarantee, notFor >= 2, problems >= 4].filter(Boolean).length;

  return {
    blob,
    bodyWords,
    headlineWords: words(copy.headline),
    problems,
    steps,
    bullets,
    notFor,
    hasProof: Boolean(copy.proofQuote.trim() && copy.proofName.trim()),
    hasBody,
    hasGuarantee,
    hasOffer: Boolean(copy.offerName.trim()),
    thanks: /(obrigad|confirmad|já está|recebemos|ver o (teu )?e-?mail|entra no (grupo|whats))/.test(blob),
    book: /(marcar|sessão|conversa|call\b|reunião|calendário|30 minutos)/.test(blob),
    register: /(lista|registo|inscrev|workshop|webinar|lugar|acesso|convite|vsl)/.test(blob),
    buy: /(comprar|investimento|checkout|candidat|aplicar|programa|sistema de)/.test(blob),
    punch: /(chega de|para de|não é|basta|acabou|sem tretas|anti-tretas)/.test(blob),
    event: /(workshop|webinar|evento|ao vivo|live)/.test(blob),
    depth,
  };
}

export function recommendType(signals: CopySignals): PageType {
  if (signals.thanks && signals.depth <= 2 && signals.bodyWords < 50) return "thanks";
  if (signals.book && !signals.buy && signals.depth < 5) return "booking";
  if (signals.register && signals.bodyWords < 90 && signals.bullets < 4 && signals.depth < 5) return "opt-in";
  if (signals.depth >= 4 || signals.bodyWords >= 90 || signals.buy) return "sales";
  if (signals.book) return "booking";
  if (signals.register) return "opt-in";
  if (signals.thanks) return "thanks";
  if (signals.bodyWords >= 90 || signals.depth >= 4) return "sales";
  if (signals.bodyWords >= 30 || signals.steps >= 2) return "booking";
  return "opt-in";
}

function adjacent(a: PageType, b: PageType) {
  const pairs: Array<[PageType, PageType]> = [
    ["opt-in", "thanks"],
    ["opt-in", "booking"],
    ["sales", "booking"],
    ["sales", "opt-in"],
  ];
  return pairs.some(([left, right]) => (left === a && right === b) || (left === b && right === a));
}

function scoreLook(
  template: TemplateId,
  job: PageType,
  signals: CopySignals,
  photos?: Photos,
): { score: number; why: string[] } {
  const look = LOOKS.find((item) => item.id === template)!;
  const why: string[] = [];
  let score = 0;
  const hasHero = Boolean(photos?.hero);
  const hasPortrait = Boolean(photos?.portrait);

  if (look.type === job) {
    score += 46;
    why.push(`O copy pede uma ${labelType(job)}.`);
  } else if (adjacent(look.type, job)) {
    score += 10;
  }

  if (template === "thanks-next") {
    if (signals.thanks) {
      score += 28;
      why.push("A linguagem é de confirmação, não de argumento.");
    }
    if (signals.depth <= 1) score += 8;
    if (signals.bodyWords > 60 || signals.bullets >= 4) score -= 20;
  }

  if (template === "opt-in-dense") {
    if (signals.register || signals.event) {
      score += 16;
      why.push("O destino é um registo ou um evento.");
    }
    if (signals.problems >= 3 || signals.hasProof) {
      score += 14;
      why.push("Há spray ou prova para o friso — o cartaz usa isso.");
    } else {
      score -= 10;
    }
    if (signals.bodyWords < 80) score += 6;
    if (hasHero) score += 6;
  }

  if (template === "opt-in-light") {
    if (signals.register && signals.problems < 3 && signals.bodyWords < 40) {
      score += 20;
      why.push("Copy curta: a revista vive da capa e do formulário.");
    }
    if (hasHero) {
      score += 12;
      why.push("Há foto de capa para ocupar metade do ecrã.");
    }
    if (signals.problems >= 4 || signals.depth >= 4) score -= 16;
  }

  if (template === "sales-long") {
    if (signals.depth >= 4 || signals.bodyWords >= 80) {
      score += 20;
      why.push("Há capítulos suficientes para um dossier.");
    }
    if (signals.steps >= 2) score += 8;
    if (signals.bullets >= 3) score += 8;
    if (signals.hasGuarantee || signals.notFor >= 2) score += 6;
    if (signals.punch && signals.depth < 3 && signals.bodyWords < 70) score -= 12;
  }

  if (template === "sales-brutal") {
    if (signals.punch || (signals.headlineWords > 0 && signals.headlineWords <= 10 && signals.depth <= 3)) {
      score += 18;
      why.push("A copy aguenta tipo enorme e pouco decoração.");
    }
    if (signals.bodyWords > 0 && signals.bodyWords < 90) score += 8;
    if (signals.depth >= 5) score -= 14;
    if (!hasHero && !hasPortrait) score += 4;
  }

  if (template === "booking-letter") {
    if (signals.book) {
      score += 16;
      why.push("O destino é uma conversa, não um checkout.");
    }
    if (signals.hasBody) {
      score += 14;
      why.push("Há um parágrafo que segura uma carta.");
    }
    if (hasPortrait && !hasHero) {
      score += 8;
      why.push("Um retrato chega — a carta não precisa de cinema.");
    }
    if (signals.event) score -= 10;
  }

  if (template === "booking-editorial") {
    if (signals.book && hasHero) {
      score += 18;
      why.push("Sessão com foto de herói: a cinemática tem peso.");
    }
    if (signals.book && !signals.hasBody) score += 8;
    if (signals.hasBody && !hasHero) score -= 8;
  }

  return { score, why: why.slice(0, 3) };
}

function labelType(type: PageType) {
  if (type === "opt-in") return "página de registo";
  if (type === "sales") return "página de vendas";
  if (type === "booking") return "página de marcação";
  return "página de obrigado";
}

export function rankLooks(copy: FixedCopy, photos?: Photos): LookRecommendation[] {
  const signals = copySignals(copy);
  const job = recommendType(signals);

  return LOOKS.map((look) => {
    const { score, why } = scoreLook(look.id, job, signals, photos);
    return {
      template: look.id,
      type: look.type,
      label: look.label,
      score,
      why: why.length ? why : [look.brief],
    };
  }).sort((a, b) => b.score - a.score);
}

export function recommendPage(copy: FixedCopy, photos?: Photos): LookRecommendation {
  return rankLooks(copy, photos)[0];
}

export function canRecommend(copy: FixedCopy) {
  return Boolean(copy.headline.trim() || copy.cta.trim() || copy.offerName.trim() || copy.nextStep.trim());
}
