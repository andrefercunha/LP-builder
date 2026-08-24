import { emptyFixedCopy, type FixedCopy } from "./creation";

export type ParsedBrief = {
  name: string;
  partner: string;
  copy: FixedCopy;
};

const HEADING_ALIASES: Record<string, keyof FixedCopy | "name" | "partner"> = {
  "para quem": "audience",
  audiencia: "audience",
  audience: "audience",
  headline: "headline",
  titulo: "headline",
  resultado: "headline",
  subheadline: "subheadline",
  sub: "subheadline",
  problemas: "problems",
  spray: "problems",
  historia: "body",
  corpo: "body",
  argumento: "body",
  mecanismo: "mechanismSteps",
  passos: "mechanismSteps",
  oferta: "offerName",
  "nome da oferta": "offerName",
  "o que inclui": "offerBullets",
  inclui: "offerBullets",
  prova: "proofQuote",
  testemunho: "proofQuote",
  "nao e para": "notFor",
  "nao e": "notFor",
  garantia: "guarantee",
  risco: "guarantee",
  "proximo passo": "nextStep",
  "a seguir": "nextStep",
  cta: "cta",
  botao: "cta",
  "texto do botao": "cta",
  parceiro: "partner",
  marca: "partner",
  nome: "name",
};

export const BRIEF_TEMPLATE = `---
nome: Nome interno da página
parceiro: Nome do parceiro
---

## Para quem
Uma frase. Quem é a pessoa.

## Headline
A promessa. Uma a duas frases.

## Subheadline
O que acontece, para quem, em que prazo.

## Problemas
- Frase na linguagem do cliente
- Outra frase
- Outra frase

## História
O parágrafo que segura a página. Sem autobiografia irrelevante.

## Mecanismo
### Nome do passo
O que acontece neste passo.

### Nome do passo
O que acontece neste passo.

### Nome do passo
O que acontece neste passo.

## Oferta
Nome da oferta, sessão ou lead.

## O que inclui
- Item
- Item
- Item

## Prova
Citação autorizada.

Nome: Quem disse

## Não é para
- Quem não é
- O que não vais receber

## Garantia
Só o que for verdade.

## Próximo passo
Exactamente o que acontece depois do clique.

## CTA
Texto do botão
`;

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "");
}

function normalizeHeading(value: string) {
  return stripAccents(value)
    .toLowerCase()
    .replace(/[|#*_:`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[normalizeHeading(line.slice(0, idx))] = line.slice(idx + 1).trim();
  }
  return { meta, body: raw.slice(match[0].length) };
}

function bullets(text: string) {
  const items = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*+]\s+/, "").replace(/^\s*\d+\.\s+/, "").trim())
    .filter(Boolean);
  return items.length ? items : [];
}

function parseMechanism(text: string) {
  if (/^###\s+/m.test(text)) {
    return text
      .split(/^###\s+/m)
      .slice(1)
      .map((block) => {
        const newline = block.indexOf("\n");
        return {
          title: (newline === -1 ? block : block.slice(0, newline)).trim(),
          text: (newline === -1 ? "" : block.slice(newline + 1)).trim(),
        };
      });
  }
  return bullets(text).map((item) => {
    const [title, ...rest] = item.split(/[:—–-]\s+/);
    return { title: title.trim(), text: rest.join(" ").trim() };
  });
}

function parseProof(text: string): { quote: string; name: string } {
  const quoteMatch = text.match(/>\s*([\s\S]*?)(?:\n\n|\n—|\nNome:|$)/);
  const nameMatch = text.match(/(?:^|\n)(?:—|Nome:)\s*(.+)/i);
  if (quoteMatch || nameMatch) {
    return {
      quote: (quoteMatch?.[1] ?? text).replace(/^>+\s?/gm, "").trim(),
      name: nameMatch?.[1].trim() ?? "",
    };
  }
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const nameLine = lines.find((line) => /^nome:/i.test(line));
  return {
    quote: lines.filter((line) => !/^nome:/i.test(line)).join("\n").trim(),
    name: nameLine ? nameLine.replace(/^nome:\s*/i, "") : "",
  };
}

export function parseBriefMarkdown(raw: string): ParsedBrief {
  const { meta, body } = parseFrontmatter(raw.trim());
  const copy = emptyFixedCopy();
  let name = meta.nome ?? "";
  let partner = meta.parceiro ?? meta.marca ?? "";

  const title = body.match(/^#\s+(.+)$/m);
  if (title && !name) name = title[1].trim();

  const sections = body.split(/^##\s+/m).slice(1);
  for (const section of sections) {
    const newline = section.indexOf("\n");
    const heading = normalizeHeading(newline === -1 ? section : section.slice(0, newline));
    const text = (newline === -1 ? "" : section.slice(newline + 1)).trim();
    const key = HEADING_ALIASES[heading];
    if (!key || !text) continue;
    if (key === "name") {
      name = text.split(/\r?\n/)[0];
      continue;
    }
    if (key === "partner") {
      partner = text.split(/\r?\n/)[0];
      continue;
    }
    if (key === "problems" || key === "offerBullets" || key === "notFor") {
      copy[key] = bullets(text);
      continue;
    }
    if (key === "mechanismSteps") {
      copy.mechanismSteps = parseMechanism(text);
      continue;
    }
    if (key === "proofQuote") {
      const proof = parseProof(text);
      copy.proofQuote = proof.quote;
      copy.proofName = proof.name;
      continue;
    }
    if (key === "offerName" || key === "cta" || key === "audience" || key === "headline") {
      copy[key] = text.split(/\r?\n/)[0].replace(/^[*_]+|[*_]+$/g, "").trim() || text;
      if (key === "headline" && text.includes("\n")) {
        const lines = text.split(/\r?\n/).filter(Boolean);
        copy.headline = lines[0];
      }
      continue;
    }
    copy[key] = text;
  }

  return { name, partner, copy };
}

export function fixedCopyToMarkdown(copy: FixedCopy, meta?: { name?: string; partner?: string }) {
  const steps = copy.mechanismSteps
    .filter((step) => step.title.trim() || step.text.trim())
    .map((step) => `### ${step.title}\n${step.text}`.trim())
    .join("\n\n");
  const list = (items: string[]) =>
    items
      .filter((item) => item.trim())
      .map((item) => `- ${item.trim()}`)
      .join("\n");

  return `---
nome: ${meta?.name ?? ""}
parceiro: ${meta?.partner ?? ""}
---

## Para quem
${copy.audience}

## Headline
${copy.headline}

## Subheadline
${copy.subheadline}

## Problemas
${list(copy.problems)}

## História
${copy.body}

## Mecanismo
${steps}

## Oferta
${copy.offerName}

## O que inclui
${list(copy.offerBullets)}

## Prova
${copy.proofQuote}
${copy.proofName ? `Nome: ${copy.proofName}` : ""}

## Não é para
${list(copy.notFor)}

## Garantia
${copy.guarantee}

## Próximo passo
${copy.nextStep}

## CTA
${copy.cta}
`.replace(/\n{3,}/g, "\n\n");
}
