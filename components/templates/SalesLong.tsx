import type { Project } from "@/lib/types";
import {
  Faqs,
  Heading,
  LeadForm,
  LogoMark,
  PageFrame,
  Shell,
} from "./PageFrame";

function isStockPhoto(src?: string) {
  if (!src) return true;
  return /unsplash\.com|images\.unsplash|pexels\.com|pixabay\.com/.test(src);
}

function overlap(item: string, haystack: string) {
  const needle = item.trim().toLowerCase();
  return needle.length > 24 && haystack.toLowerCase().includes(needle);
}

function keepAmount(text: string) {
  return text.replace(/(\d)\.(\d{3})/g, "$1\u202f$2").replace(/ €/g, "\u00a0€");
}

function splitInvestment(text: string) {
  const trimmed = text.trim();
  const first = trimmed.match(/^.+?€[^.]*(?:\.)?/)?.[0] ?? trimmed.match(/^[^.]+(?:\.)?/)?.[0] ?? trimmed;
  const notes = trimmed.slice(first.length).trim();
  const [primary, alternate] = first.split(/,\s*(?=ou\b)/i);
  return {
    primary: keepAmount((primary ?? first).replace(/\.$/, "").trim()),
    alternate: keepAmount((alternate ?? "").replace(/\.$/, "").trim()),
    notes,
  };
}

function Chapter({
  n,
  kicker,
  title,
  children,
}: {
  n: string;
  kicker?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="lp-chapter">
      <Shell>
        <div className="lp-chapter-head">
          <span className="lp-chapter-n">{n}</span>
          <div>
            {kicker ? <p className="lp-rule">{kicker}</p> : null}
            {title ? (
              <Heading size={46} style={{ marginTop: kicker ? 12 : 0 }}>
                {title}
              </Heading>
            ) : null}
          </div>
        </div>
        <div className="lp-chapter-body">{children}</div>
      </Shell>
    </section>
  );
}

export function SalesLong({ project }: { project: Project }) {
  const { copy, photos, brand } = project;
  const bodyText = copy.body.trim();
  const bodyParagraphs = bodyText.split(/\n\n+/).filter(Boolean);
  const problems = copy.problems.filter((item) => item && !overlap(item, bodyText));
  const steps = copy.mechanismSteps.filter((step) => step.title);
  const willGet = copy.willGet.filter(Boolean);
  const notFor = copy.notFor.filter(Boolean);
  const willGive = (copy.willGive ?? []).filter(Boolean);
  const hasScope = willGet.length + notFor.length + willGive.length > 0;
  const bullets = copy.offerBullets.filter((item) => {
    if (!item) return false;
    if (!hasScope) return true;
    return !willGet.some((entry) => overlap(item, entry) || overlap(entry, item));
  });
  const proof = copy.proof.filter((item) => item.quote);
  const faqs = copy.faqs.filter((item) => item.q);
  const investment = copy.investment?.trim() ? splitInvestment(copy.investment) : null;
  const portrait = isStockPhoto(photos.portrait) ? "" : photos.portrait;
  const showHeaderCta = Boolean(copy.ctaSecondary);

  let chapter = 1;
  const nextChapter = () => String(chapter++).padStart(2, "0");
  const coverN = nextChapter();

  return (
    <PageFrame project={project}>
      <div className="lp-doc">
        <header className="lp-masthead">
          <Shell>
            <div className="lp-masthead-row">
              <LogoMark project={project} />
              <p className="lp-folio">
                {copy.offerName || brand.name}
                <span>Documento de reunião</span>
              </p>
            </div>
          </Shell>
        </header>

        <section className="lp-cover">
          <Shell>
            <div className="lp-cover-grid">
              <div>
                <p className="lp-stamp">{copy.eyebrow || "Documento"}</p>
                <p className="lp-chapter-n lp-cover-n">{coverN}</p>
                <Heading as="h1" size={78} style={{ marginTop: 18, maxWidth: "15ch" }}>
                  {copy.headline}
                </Heading>
                <p className="lp-lead">{copy.subheadline}</p>
                {copy.audience ? <p className="lp-use">{copy.audience}</p> : null}
                {showHeaderCta ? (
                  <p className="lp-use" style={{ marginTop: 28 }}>
                    <a href={copy.ctaHref || "#form"}>{copy.cta}</a>
                    {copy.ctaSecondary ? ` · ${copy.ctaSecondary}` : ""}
                  </p>
                ) : null}
              </div>
              <aside className="lp-cover-meta">
                <p>
                  <span>Marca</span>
                  {brand.name}
                </p>
                <p>
                  <span>Oferta</span>
                  {copy.offerName || "—"}
                </p>
                {copy.audience ? (
                  <p>
                    <span>Uso</span>
                    Reunião. Não é página de tráfego.
                  </p>
                ) : null}
              </aside>
            </div>
          </Shell>
        </section>

        {bodyParagraphs.length > 0 ? (
          <Chapter n={nextChapter()} kicker="Argumento" title={copy.bodyTitle || copy.leadTitle}>
            {bodyParagraphs[0] ? <p className="lp-pull">{bodyParagraphs[0]}</p> : null}
            <div className="lp-prose">
              {bodyParagraphs.slice(1).map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </Chapter>
        ) : problems.length > 0 ? (
          <Chapter n={nextChapter()} kicker="Reconhecimento" title={copy.leadTitle || "Isto é para ti se"}>
            <ol className="lp-points">
              {problems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </Chapter>
        ) : null}

        {problems.length > 0 && bodyParagraphs.length > 0 ? (
          <Chapter n={nextChapter()} kicker="Reconhecimento" title={copy.leadTitle}>
            <ol className="lp-points">
              {problems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </Chapter>
        ) : null}

        {steps.length > 0 ? (
          <Chapter n={nextChapter()} kicker="Mecanismo" title={copy.mechanismTitle || "Como se chega lá"}>
            <div className="lp-spine">
              {steps.map((step, index) => (
                <article key={step.title}>
                  <p className="lp-spine-n">{String(index + 1).padStart(2, "0")}</p>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </Chapter>
        ) : null}

        {hasScope || bullets.length > 0 ? (
          <Chapter n={nextChapter()} kicker="Âmbito" title={copy.offerTitle || copy.offerName || "O que entra"}>
            {bullets.length > 0 && hasScope ? (
              <p className="lp-summary">{bullets[0]}</p>
            ) : null}
            {hasScope ? (
              <div
                className="lp-ledger"
                data-cols={1 + (notFor.length ? 1 : 0) + (willGive.length ? 1 : 0)}
              >
                <div>
                  <h3>Levas</h3>
                  <ul>
                    {willGet.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                {notFor.length > 0 ? (
                  <div>
                    <h3>Não levas</h3>
                    <ul>
                      {notFor.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {willGive.length > 0 ? (
                  <div>
                    <h3>O que é teu</h3>
                    <ul>
                      {willGive.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <ul className="lp-plain">
                {bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </Chapter>
        ) : null}

        {copy.guarantee ? (
          <Chapter n={nextChapter()} kicker={copy.guaranteeTitle || "Risco"} title="O que fica garantido">
            <blockquote className="lp-guarantee">{copy.guarantee}</blockquote>
          </Chapter>
        ) : null}

        {copy.authority ? (
          <Chapter n={nextChapter()} kicker="Autoridade" title="Quem faz este trabalho">
            <div className="lp-authority">
              {portrait ? <img src={portrait} alt="" /> : null}
              <div>
                <p>{copy.authority}</p>
                <cite>{brand.name}</cite>
              </div>
            </div>
          </Chapter>
        ) : null}

        {proof.length > 0 ? (
          <Chapter n={nextChapter()} kicker="Prova">
            <div className="lp-proofs">
              {proof.map((item) => (
                <blockquote key={item.quote}>
                  <p>“{item.quote}”</p>
                  <cite>
                    {item.name}
                    {item.role ? ` · ${item.role}` : ""}
                  </cite>
                </blockquote>
              ))}
            </div>
          </Chapter>
        ) : null}

        {faqs.length > 0 ? (
          <Chapter n={nextChapter()} kicker="Antes de avançares">
            <Faqs items={faqs} />
          </Chapter>
        ) : null}

        <section className="lp-close">
          <Shell>
            <div className="lp-close-inner">
              <p className="lp-stamp invert">Investimento e adjudicação</p>
              {investment ? (
                <div className="lp-price">
                  <p className="lp-price-main">{investment.primary}</p>
                  {investment.alternate ? <p className="lp-price-alt">{investment.alternate}</p> : null}
                  {investment.notes ? <p className="lp-price-notes">{investment.notes}</p> : null}
                </div>
              ) : null}
              <Heading size={36} style={{ color: "#f4f5f0", marginTop: 8, maxWidth: 620 }}>
                {copy.nextStep}
              </Heading>
              <LeadForm project={project} />
              <p className="lp-legal">{copy.legal}</p>
            </div>
          </Shell>
        </section>
      </div>
    </PageFrame>
  );
}
