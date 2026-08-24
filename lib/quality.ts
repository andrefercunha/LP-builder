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

export function auditProject(project: Project): QualityFlag[] {
  const { copy, brand, photos, type } = project;
  const headline = copy.headline.toLowerCase();
  const flags: QualityFlag[] = [];

  const genericHit = GENERIC_HEADLINES.find((phrase) =>
    `${copy.headline} ${copy.subheadline} ${copy.body}`.toLowerCase().includes(phrase),
  );

  flags.push({
    id: "clear-outcome",
    letter: "C",
    title: "Resultado claro",
    status:
      wordCount(copy.headline) >= 5 && !genericHit
        ? "pass"
        : wordCount(copy.headline) >= 4
          ? "warn"
          : "fail",
    detail: genericHit
      ? `A headline soa a template: “${genericHit}”. Diz o resultado concreto, sem slogan.`
      : wordCount(copy.headline) < 5
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
      copy.mechanismSteps.filter((s) => hasText(s.title) && hasText(s.text)).length >= 3
        ? "pass"
        : type === "thanks"
          ? "pass"
          : "fail",
    detail:
      type === "thanks"
        ? "Página de obrigado não precisa de mecanismo."
        : "Explica uma forma diferente de chegar ao resultado, em passos nomeados.",
  });

  flags.push({
    id: "value",
    letter: "V",
    title: "Proposta de valor",
    status: copy.offerBullets.filter(hasText).length >= 3 || type === "thanks" ? "pass" : "warn",
    detail: "A oferta tem de melhorar uma vida concreta, não listar serviços.",
  });

  flags.push({
    id: "empathy",
    letter: "E",
    title: "Empatia",
    status: copy.problems.filter(hasText).length >= 4 ? "pass" : "warn",
    detail:
      copy.problems.filter(hasText).length >= 4
        ? "Há spray de problemas suficientes para a pessoa se reconhecer."
        : "Lista 5 a 8 problemas reais, na linguagem do cliente. Não uses cartões com ícones.",
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
    status:
      copy.proof.filter((p) => hasText(p.quote) && hasText(p.name)).length >= 1
        ? "pass"
        : "warn",
    detail:
      copy.proof.some((p) => hasText(p.quote))
        ? "Há prova atribuída. Confirma autorização antes de publicar."
        : "Sem prova, a página pede fé. Usa testemunho autorizado ou tira a secção.",
  });

  flags.push({
    id: "offer",
    letter: "I",
    title: "Oferta irresistível",
    status: hasText(copy.offerName) && hasText(copy.cta) ? "pass" : "fail",
    detail: "Nome da oferta, o que inclui e o próximo passo têm de estar visíveis cedo.",
  });

  flags.push({
    id: "objections",
    letter: "O2",
    title: "Objeções",
    status:
      copy.faqs.filter((f) => hasText(f.q) && hasText(f.a)).length >= 3 || type === "thanks"
        ? "pass"
        : "warn",
    detail: "FAQ e “o que não é” tratam risco sem inventar pressão.",
  });

  flags.push({
    id: "next-steps",
    letter: "N2",
    title: "Próximo passo",
    status: hasText(copy.nextStep) && hasText(copy.cta) ? "pass" : "fail",
    detail: "A pessoa tem de saber exactamente o que acontece depois do clique.",
  });

  flags.push({
    id: "scarcity",
    letter: "S2",
    title: "Escassez honesta",
    status: /últimas|só hoje|vagas limitadas|hoje apenas/i.test(
      `${copy.headline} ${copy.subheadline} ${copy.cta} ${copy.guarantee}`,
    )
      ? "warn"
      : "pass",
    detail:
      /últimas|só hoje|vagas limitadas|hoje apenas/i.test(
        `${copy.headline} ${copy.subheadline} ${copy.cta} ${copy.guarantee}`,
      )
        ? "Há linguagem de urgência. Só fica se for verdadeira e verificável."
        : "Sem escassez fabricada.",
  });

  const accent = brand.accent.toLowerCase();
  const genericColor = GENERIC_COLORS.includes(accent);
  flags.push({
    id: "brand",
    title: "Marca visível",
    status:
      brand.name && !genericColor && brand.headingFont !== brand.bodyFont
        ? "pass"
        : genericColor
          ? "fail"
          : "warn",
    detail: genericColor
      ? "Roxo indigo/violet de template SaaS. Usa as cores reais do brand kit."
      : brand.headingFont === brand.bodyFont
        ? "Título e corpo com a mesma fonte deixam a página plana. Contrasta serif/sans."
        : "A identidade tem nome, contraste e tipografia própria.",
  });

  flags.push({
    id: "photos",
    title: "Fotografia real",
    status: photos.hero || photos.portrait || photos.gallery.length > 0 ? "pass" : "fail",
    detail:
      photos.hero || photos.portrait
        ? "Há fotografia para ancorar a página. Evita stock sorridente de stock site."
        : "Sem fotos a página fica genérica. Entrega um retrato e uma imagem de herói.",
  });

  flags.push({
    id: "cta-coherence",
    title: "CTA coerente",
    status:
      hasText(copy.cta) && copy.cta.trim().split(/\s+/).length <= 6 ? "pass" : "warn",
    detail: "O botão pede uma acção proporcional (marcar, reservar, pedir acesso), não “saber mais”.",
  });

  return flags;
}

export function qualityScore(flags: QualityFlag[]) {
  const weight = { pass: 1, warn: 0.45, fail: 0 };
  const total = flags.reduce((sum, flag) => sum + weight[flag.status], 0);
  return Math.round((total / flags.length) * 100);
}
