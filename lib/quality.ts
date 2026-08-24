import { creationFor } from "./creation";
import type { Project, QualityFlag } from "./types";

const GENERIC_HEADLINES = [
  "desbloqueia o teu potencial",
  "unlock your potential",
  "transforma o teu negócio",
  "o futuro começa agora",
  "soluções à medida",
  "potenciar",
  "alavancar sinergias",
  "máquina de vendas",
  "resultados garantidos",
  "dinheiro fácil",
  "piloto automático",
  "escala automática",
  "funil perfeito",
];

const GENERIC_COLORS = ["#6366f1", "#8b5cf6", "#7c3aed", "#a855f7", "#4f46e5"];

function hasText(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function skipFlag(project: Project, id: string) {
  const { type, template } = project;
  if (type === "thanks") {
    return ["new-method", "value", "empathy", "results", "social-proof", "objections"].includes(id);
  }
  if (type === "opt-in") {
    const skip = ["new-method", "results", "objections"];
    if (template === "opt-in-light") skip.push("empathy");
    return skip.includes(id);
  }
  return false;
}

export function auditProject(project: Project): QualityFlag[] {
  const { copy, brand, photos, type, template } = project;
  const flags: QualityFlag[] = [];
  const spec = creationFor(template);

  const genericHit = GENERIC_HEADLINES.find((phrase) =>
    `${copy.headline} ${copy.subheadline} ${copy.body}`.toLowerCase().includes(phrase),
  );

  const minHeadline = type === "thanks" ? 3 : 5;

  flags.push({
    id: "clear-outcome",
    letter: "C",
    title: "Resultado claro",
    status:
      wordCount(copy.headline) >= minHeadline && !genericHit
        ? "pass"
        : wordCount(copy.headline) >= Math.max(3, minHeadline - 1)
          ? "warn"
          : "fail",
    detail: genericHit
      ? `A headline soa a template: “${genericHit}”. Diz o resultado concreto, sem slogan.`
      : wordCount(copy.headline) < minHeadline
        ? "A headline precisa de uma promessa específica. Evita frases curtas de cartaz."
        : "A headline nomeia um resultado compreensível.",
  });

  flags.push({
    id: "opportunity",
    letter: "O",
    title: "Perspetiva nova",
    status: hasText(copy.eyebrow) && hasText(copy.subheadline) ? "pass" : "warn",
    detail:
      hasText(copy.eyebrow) && hasText(copy.subheadline)
        ? "Eyebrow e subheadline abrem o ponto de vista antes da oferta."
        : "Falta um enquadramento curto: para quem é, ou que ideia muda o jogo.",
  });

  flags.push({
    id: "new-method",
    letter: "N",
    title: "Mecanismo",
    status:
      copy.mechanismSteps.filter((s) => hasText(s.title) && hasText(s.text)).length >= 3 ? "pass" : "fail",
    detail: "Explica uma forma diferente de chegar ao resultado, em passos nomeados.",
  });

  const offerReady =
    type === "opt-in"
      ? hasText(copy.offerName) || hasText(copy.cta)
      : copy.offerBullets.filter(hasText).length >= 3 || copy.willGet.filter(hasText).length >= 3;

  flags.push({
    id: "value",
    letter: "V",
    title: "Proposta de valor",
    status: offerReady ? "pass" : "warn",
    detail:
      type === "opt-in"
        ? "O lead tem de ter nome e um motivo para o formulário existir."
        : "A oferta tem de melhorar uma vida concreta, não listar serviços.",
  });

  const problemMin = template === "opt-in-dense" ? 3 : 4;
  flags.push({
    id: "empathy",
    letter: "E",
    title: "Empatia",
    status: copy.problems.filter(hasText).length >= problemMin ? "pass" : "warn",
    detail:
      copy.problems.filter(hasText).length >= problemMin
        ? "Há spray de problemas suficientes para a pessoa se reconhecer."
        : "Lista problemas reais, na linguagem do cliente. Não uses cartões com ícones.",
  });

  flags.push({
    id: "results",
    letter: "R",
    title: "Resultados",
    status: hasText(copy.body) && wordCount(copy.body) >= 40 ? "pass" : "warn",
    detail: "O corpo tem de mostrar transformação, não biografia irrelevante.",
  });

  flags.push({
    id: "social-proof",
    letter: "S",
    title: "Prova social",
    status: copy.proof.filter((p) => hasText(p.quote) && hasText(p.name)).length >= 1 ? "pass" : "warn",
    detail: copy.proof.some((p) => hasText(p.quote))
      ? "Há prova atribuída. Confirma autorização antes de publicar."
      : "Sem prova, a página pede fé. Usa testemunho autorizado ou tira a secção.",
  });

  flags.push({
    id: "offer",
    letter: "I",
    title: type === "thanks" ? "Confirmação" : "Oferta irresistível",
    status: (hasText(copy.offerName) || type === "thanks" || type === "booking") && hasText(copy.cta) ? "pass" : "fail",
    detail:
      type === "thanks"
        ? "A pessoa tem de perceber que o passo anterior ficou feito e o que clicar agora."
        : "Nome da oferta, o que inclui e o próximo passo têm de estar visíveis cedo.",
  });

  flags.push({
    id: "objections",
    letter: "O2",
    title: "Objeções",
    status: copy.faqs.filter((f) => hasText(f.q) && hasText(f.a)).length >= 3 ? "pass" : "warn",
    detail: "FAQ e “o que não é” tratam risco sem inventar pressão.",
  });

  flags.push({
    id: "next-steps",
    letter: "N2",
    title: "Próximo passo",
    status: hasText(copy.nextStep) && hasText(copy.cta) ? "pass" : "fail",
    detail: "A pessoa tem de saber exactamente o que acontece depois do clique.",
  });

  const urgency = /últimas|só hoje|vagas limitadas|hoje apenas/i.test(
    `${copy.headline} ${copy.subheadline} ${copy.cta} ${copy.guarantee}`,
  );
  flags.push({
    id: "scarcity",
    letter: "S2",
    title: "Escassez honesta",
    status: urgency ? "warn" : "pass",
    detail: urgency
      ? "Há linguagem de urgência. Só fica se for verdadeira e verificável."
      : "Sem escassez fabricada.",
  });

  const accent = brand.accent.toLowerCase();
  const genericColor = GENERIC_COLORS.includes(accent);
  flags.push({
    id: "brand",
    title: "Marca visível",
    status:
      brand.name && brand.name !== "Parceiro" && !genericColor && brand.headingFont !== brand.bodyFont
        ? "pass"
        : genericColor
          ? "fail"
          : "warn",
    detail: genericColor
      ? "Roxo indigo/violet de template SaaS. Usa as cores reais do brand kit."
      : brand.headingFont === brand.bodyFont
        ? "Título e corpo com a mesma fonte deixam a página plana. Contrasta serif/sans."
        : brand.name === "Parceiro"
          ? "A marca ainda se chama Parceiro. Mete o nome real."
          : "A identidade tem nome, contraste e tipografia própria.",
  });

  const hasPhoto = Boolean(photos.hero || photos.portrait || photos.gallery.length > 0);
  flags.push({
    id: "photos",
    title: "Fotografia real",
    status: hasPhoto ? "pass" : type === "thanks" || template === "sales-brutal" ? "warn" : "fail",
    detail: hasPhoto
      ? "Há fotografia para ancorar a página. Evita stock sorridente de stock site."
      : spec.photoHint,
  });

  flags.push({
    id: "cta-coherence",
    title: "CTA coerente",
    status: hasText(copy.cta) && copy.cta.trim().split(/\s+/).length <= 6 ? "pass" : "warn",
    detail: "O botão pede uma acção proporcional (marcar, reservar, pedir acesso), não “saber mais”.",
  });

  return flags.filter((flag) => !skipFlag(project, flag.id));
}

export function qualityScore(flags: QualityFlag[]) {
  if (flags.length === 0) return 0;
  const weight = { pass: 1, warn: 0.45, fail: 0 };
  const total = flags.reduce((sum, flag) => sum + weight[flag.status], 0);
  return Math.round((total / flags.length) * 100);
}
