import type { Project } from "@/lib/types";
import { Faqs, Heading, LeadForm, LogoMark, PageFrame, Shell } from "./PageFrame";

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

function monthParts(title: string, index: number) {
  const match = title.match(/^Mês\s+(\d+)[.\s]+(.*)$/i);
  if (match) {
    return { n: String(match[1]).padStart(2, "0"), kicker: `Mês ${match[1]}`, title: match[2] };
  }
  return { n: String(index + 1).padStart(2, "0"), kicker: `0${index + 1}`, title };
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
  const facts = (copy.eyebrow || "")
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
  const pull = bodyParagraphs[0] || copy.leadTitle;

  return (
    <PageFrame project={project}>
      <div className="lp-book">
        <section className="lp-poster">
          <div className="lp-poster-bar">
            <Shell wide>
              <div className="lp-poster-nav">
                <LogoMark project={project} />
                <p>{copy.offerName || brand.name}</p>
              </div>
            </Shell>
          </div>
          <Shell wide>
            <div className="lp-poster-hero">
              <p className="lp-kicker">{copy.eyebrow || "Proposta"}</p>
              <Heading as="h1" size={92}>
                {copy.headline}
              </Heading>
              <p className="lp-poster-lead">{copy.subheadline}</p>
            </div>
          </Shell>
          <div className="lp-poster-foot">
            <Shell wide>
              <ul>
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
                {copy.audience ? <li className="mute">{copy.audience}</li> : null}
              </ul>
            </Shell>
          </div>
        </section>

        {bodyParagraphs.length > 0 ? (
          <section className="lp-spread">
            <Shell wide>
              <div className="lp-spread-2">
                <div>
                  <p className="lp-kicker">{copy.bodyTitle || "Argumento"}</p>
                  <p className="lp-display">{pull}</p>
                </div>
                <div className="lp-prose">
                  {bodyParagraphs.slice(1).map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </Shell>
          </section>
        ) : problems.length > 0 ? (
          <section className="lp-spread">
            <Shell wide>
              <p className="lp-kicker">Reconhecimento</p>
              <Heading size={52}>{copy.leadTitle || "Isto é para ti se"}</Heading>
              <ol className="lp-points">
                {problems.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </Shell>
          </section>
        ) : null}

        {steps.length > 0 ? (
          <section className="lp-spread lp-spread-ink">
            <Shell wide>
              <div className="lp-spread-head">
                <p className="lp-kicker">Como corre</p>
                <Heading size={58}>{copy.mechanismTitle || "O mecanismo"}</Heading>
              </div>
              <div className="lp-months" data-count={steps.length}>
                {steps.map((step, index) => {
                  const month = monthParts(step.title, index);
                  return (
                    <article key={step.title}>
                      <p className="lp-month-n">{month.n}</p>
                      <p className="lp-month-k">{month.kicker}</p>
                      <h3>{month.title}</h3>
                      <p>{step.text}</p>
                    </article>
                  );
                })}
              </div>
            </Shell>
          </section>
        ) : null}

        {hasScope || bullets.length > 0 ? (
          <section className="lp-spread">
            <Shell wide>
              <div className="lp-spread-head">
                <p className="lp-kicker">Âmbito</p>
                <Heading size={52}>{copy.offerTitle || copy.offerName || "O que entra"}</Heading>
                {bullets[0] && hasScope ? <p className="lp-summary">{bullets[0]}</p> : null}
              </div>
              {hasScope ? (
                <div className="lp-fields" data-cols={1 + Number(Boolean(notFor.length)) + Number(Boolean(willGive.length))}>
                  <div className="ink">
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
            </Shell>
          </section>
        ) : null}

        {copy.guarantee || copy.authority ? (
          <section className="lp-spread">
            <Shell wide>
              <div className="lp-spread-2 tight">
                {copy.guarantee ? (
                  <div className="lp-plate">
                    <p className="lp-kicker">{copy.guaranteeTitle || "O que garanto"}</p>
                    <p className="lp-plate-text">{copy.guarantee}</p>
                  </div>
                ) : null}
                {copy.authority ? (
                  <div className="lp-sign">
                    <p className="lp-kicker">Quem faz este trabalho</p>
                    {portrait ? <img src={portrait} alt="" /> : null}
                    <p>{copy.authority}</p>
                    <cite>{brand.name}</cite>
                  </div>
                ) : null}
              </div>
            </Shell>
          </section>
        ) : null}

        {proof.length > 0 ? (
          <section className="lp-spread">
            <Shell wide>
              <p className="lp-kicker">Prova</p>
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
            </Shell>
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section className="lp-spread">
            <Shell wide>
              <Heading size={44}>Antes de avançares</Heading>
              <div style={{ marginTop: 28 }}>
                <Faqs items={faqs} />
              </div>
            </Shell>
          </section>
        ) : null}

        <section className="lp-invoice">
          <Shell wide>
            <div className="lp-invoice-grid">
              <div>
                <p className="lp-kicker invert">Investimento</p>
                {investment ? (
                  <>
                    <p className="lp-price">{investment.primary}</p>
                    {investment.alternate ? <p className="lp-price-alt">{investment.alternate}</p> : null}
                    {investment.notes ? <p className="lp-price-notes">{investment.notes}</p> : null}
                  </>
                ) : null}
                <Heading size={34} style={{ color: "#f3f1ea", marginTop: 28, maxWidth: 520 }}>
                  {copy.nextStep}
                </Heading>
                <p className="lp-legal">{copy.legal}</p>
              </div>
              <LeadForm project={project} />
            </div>
          </Shell>
        </section>
      </div>
    </PageFrame>
  );
}
