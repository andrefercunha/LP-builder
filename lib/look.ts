import type {
  ArgumentKind,
  BrandKit,
  CloseKind,
  CoverKind,
  DisplayKind,
  LookSpec,
  MechanismKind,
  PageCopy,
  PageType,
  Project,
  ScopeKind,
} from "./types";

export type { LookSpec };

const COVERS: Record<PageType, CoverKind[]> = {
  sales: ["poster", "band", "frame", "split", "letter"],
  booking: ["letter", "split", "band", "frame"],
  "opt-in": ["split", "poster", "band", "frame"],
  thanks: ["letter", "frame", "band"],
};

const ARGUMENTS: Record<PageType, ArgumentKind[]> = {
  sales: ["spread", "pull", "column", "points"],
  booking: ["column", "pull", "points"],
  "opt-in": ["points", "column"],
  thanks: ["column"],
};

const MECHANISMS: Record<PageType, MechanismKind[]> = {
  sales: ["grid", "spine", "stack", "strip"],
  booking: ["spine", "stack", "strip"],
  "opt-in": ["strip", "stack"],
  thanks: ["stack"],
};

const SCOPES: Record<PageType, ScopeKind[]> = {
  sales: ["fields", "ledger", "pair"],
  booking: ["pair", "ledger"],
  "opt-in": ["ledger", "pair"],
  thanks: ["ledger"],
};

const CLOSES: Record<PageType, CloseKind[]> = {
  sales: ["invoice", "stack", "card"],
  booking: ["card", "stack", "invoice"],
  "opt-in": ["card", "stack"],
  thanks: ["stack"],
};

const DISPLAYS: Record<PageType, DisplayKind[]> = {
  sales: ["huge", "editorial", "compact"],
  booking: ["editorial", "compact", "huge"],
  "opt-in": ["huge", "compact"],
  thanks: ["editorial", "compact"],
};

export function hash32(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(items: T[], n: number) {
  return items[Math.abs(n) % items.length];
}

export function lookFingerprint(input: {
  type: PageType;
  partner: string;
  brand: BrandKit;
  headline: string;
  offerName: string;
}) {
  return hash32(
    [
      input.type,
      input.partner,
      input.brand.name,
      input.brand.primary,
      input.brand.accent,
      input.brand.headingFont,
      input.headline,
      input.offerName,
    ].join("|"),
  );
}

export function lookSignature(look: LookSpec) {
  return [
    look.cover,
    look.argument,
    look.mechanism,
    look.scope,
    look.close,
    look.coverInk ? "ink" : "paper",
    look.mechanismInk ? "ink" : "paper",
    look.display,
  ].join("|");
}

export function generateDistinctLooks(
  input: {
    type: PageType;
    partner: string;
    brand: BrandKit;
    headline: string;
    offerName: string;
  },
  count: number,
) {
  const looks: LookSpec[] = [];
  const used = new Set<string>();
  for (let n = 0; looks.length < count && n < 80; n += 1) {
    const look = generateLook({ ...input, n });
    const signature = lookSignature(look);
    if (used.has(signature)) continue;
    used.add(signature);
    looks.push(look);
  }
  return looks;
}

export function generateLook(input: {
  type: PageType;
  partner: string;
  brand: BrandKit;
  headline: string;
  offerName: string;
  n?: number;
}): LookSpec {
  const n = input.n ?? 0;
  const base = lookFingerprint(input) + n * 9973;
  const cover = pick(COVERS[input.type], base);
  return {
    cover,
    argument: pick(ARGUMENTS[input.type], base >> 3),
    mechanism: pick(MECHANISMS[input.type], base >> 6),
    scope: pick(SCOPES[input.type], base >> 9),
    close: pick(CLOSES[input.type], base >> 12),
    coverInk: cover !== "letter" && (base >> 2) % 3 !== 0,
    mechanismInk: (base >> 5) % 2 === 0,
    display: pick(DISPLAYS[input.type], base >> 8),
    n,
  };
}

export function lookFromProject(project: Project): LookSpec {
  if (project.look) return project.look;
  return generateLook({
    type: project.type,
    partner: project.partner,
    brand: project.brand,
    headline: project.copy.headline,
    offerName: project.copy.offerName,
  });
}

export function nextLook(project: Project): LookSpec {
  const current = lookFromProject(project);
  return generateLook({
    type: project.type,
    partner: project.partner,
    brand: project.brand,
    headline: project.copy.headline,
    offerName: project.copy.offerName,
    n: current.n + 1,
  });
}

export function describeLook(look: LookSpec) {
  const cover = {
    poster: "capa cartaz",
    letter: "capa carta",
    split: "capa partida",
    band: "capa em faixa",
    frame: "capa em moldura",
  }[look.cover];
  const argument = {
    spread: "argumento em duas colunas",
    column: "argumento numa coluna",
    pull: "citação a abrir",
    points: "lista de reconhecimento",
  }[look.argument];
  const mechanism = {
    grid: "mecanismo em grelha",
    spine: "mecanismo em linha",
    stack: "mecanismo empilhado",
    strip: "mecanismo em faixa",
  }[look.mechanism];
  const close = {
    invoice: "fecho em fatura",
    stack: "fecho numa coluna",
    card: "fecho em cartão",
  }[look.close];
  return `${cover} · ${argument} · ${mechanism} · ${close}`;
}

export function headingSize(look: LookSpec, role: "cover" | "section") {
  if (role === "cover") {
    if (look.display === "huge") return 92;
    if (look.display === "editorial") return 68;
    return 48;
  }
  if (look.display === "huge") return 54;
  if (look.display === "editorial") return 44;
  return 36;
}

export function lookFromCopy(
  type: PageType,
  copy: Pick<PageCopy, "headline" | "offerName">,
  brand: BrandKit,
  partner: string,
  n = 0,
) {
  return generateLook({
    type,
    partner,
    brand,
    headline: copy.headline,
    offerName: copy.offerName,
    n,
  });
}
