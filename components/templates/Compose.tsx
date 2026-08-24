import { lookFromProject } from "@/lib/look";
import type { LookSpec, PageCopy, Project } from "@/lib/types";
import { Faqs, LeadForm, LogoMark, PageFrame, Shell } from "./PageFrame";

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
  if (match) return { n: String(match[1]).padStart(2, "0"), kicker: `Mês ${match[1]}`, title: match[2] };
  return { n: String(index + 1).padStart(2, "0"), kicker: `0${index + 1}`, title };
}

function splitLead(text: string) {
  const parts = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g)?.map((item) => item.trim()) ?? [text.trim()];
  if (parts.length < 2) return { lead: text.trim(), rest: "" };
  if ((parts[1] ?? "").length < 24) {
    return { lead: `${parts[0]} ${parts[1]}`.trim(), rest: parts.slice(2).join(" ") };
  }
  return { lead: parts[0] ?? text.trim(), rest: parts.slice(1).join(" ") };
}

function coverFacts(copy: PageCopy, price?: string) {
  const pool = `${copy.investment ?? ""} ${copy.subheadline} ${copy.body}`;
  const facts: { text: string; mute?: boolean }[] = [];
  if (/quatro meses/i.test(pool)) facts.push({ text: "4 meses" });
  if (price) facts.push({ text: price });
  if (copy.audience) facts.push({ text: copy.audience, mute: true });
  return facts;
}

export function Compose({ project }: { project: Project }) {
  const look = lookFromProject(project);
  const { copy, brand } = project;
  const problems = copy.problems.filter(Boolean);
  const bodyParagraphs = copy.body.trim().split(/\n\n+/).filter(Boolean);
  const uniqueBody = bodyParagraphs.filter((paragraph) => !problems.some((item) => overlap(item, paragraph)));
  const opening = uniqueBody[0] || "";
  const restBody = uniqueBody.slice(1);
  const steps = copy.mechanismSteps.filter((step) => step.title);
  const willGet = copy.willGet.filter(Boolean);
  const notFor = copy.notFor.filter(Boolean);
  const willGive = (copy.willGive ?? []).filter(Boolean);
  const hasScope = willGet.length + notFor.length + willGive.length > 0;
  const bullets = copy.offerBullets.filter(Boolean);
  const proof = copy.proof.filter((item) => item.quote);
  const faqs = copy.faqs.filter((item) => item.q);
  const investment = copy.investment?.trim() ? splitInvestment(copy.investment) : null;
  const formOnCover = project.type === "opt-in" && (look.cover === "split" || look.cover === "poster");
  const wantsForm = project.type !== "thanks";

  return (
    <PageFrame project={project}>
      <div
        className="lp-c"
        data-cover={look.cover}
        data-argument={look.argument}
        data-mechanism={look.mechanism}
        data-scope={look.scope}
        data-close={look.close}
        data-display={look.display}
        data-ink={look.coverInk ? "1" : "0"}
      >
        <Cover project={project} look={look} formOnCover={formOnCover} investment={investment} />

        {opening || problems.length ? (
          <section id="argumento" className="lp-c-spread">
            <Shell wide>
              <Argument
                look={look}
                title={copy.bodyTitle || copy.leadTitle}
                opening={opening}
                rest={restBody}
                problems={problems}
              />
            </Shell>
          </section>
        ) : null}

        {steps.length > 0 ? (
          <section id="mecanismo" className={`lp-c-spread lp-c-mech-spread${look.mechanismInk ? " ink" : ""}`}>
            <Shell wide>
              <p className="lp-c-kicker">{copy.mechanismTitle || "Como corre"}</p>
              <div className={`lp-c-mech ${look.mechanism}`}>
                {steps.map((step, index) => {
                  const month = monthParts(step.title, index);
                  return (
                    <article key={step.title}>
                      <p className="lp-c-num">{month.n}</p>
                      <div>
                        <p className="lp-c-kicker">{month.kicker}</p>
                        <h3>{month.title}</h3>
                        <p>{step.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </Shell>
          </section>
        ) : null}

        {hasScope || bullets.length > 0 ? (
          <section id="ambito" className="lp-c-spread">
            <Shell wide>
              <p className="lp-c-kicker">{copy.offerTitle || "Âmbito"}</p>
              <h2 className="lp-c-section">{copy.offerName || "O que entra"}</h2>
              {hasScope ? (
                <div
                  className={`lp-c-scope ${look.scope}`}
                  data-cols={1 + Number(Boolean(notFor.length)) + Number(Boolean(willGive.length))}
                >
                  <div className="ink">
                    <h3>Levas</h3>
                    <ul>
                      {willGet.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {notFor.length ? (
                    <div>
                      <h3>Não levas</h3>
                      <ul>
                        {notFor.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {willGive.length ? (
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
                <ul className="lp-c-plain">
                  {bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </Shell>
          </section>
        ) : null}

        {wantsForm ? (
          <section className="lp-c-midcta">
            <Shell wide>
              <p className="lp-c-mid-line">{copy.offerName || brand.name}</p>
              <a href="#form" className="lp-cta">
                {copy.cta}
                <span aria-hidden>→</span>
              </a>
            </Shell>
          </section>
        ) : null}

        {copy.guarantee || copy.authority ? (
          <section className="lp-c-spread lp-c-signoff">
            <Shell wide>
              <div className="lp-c-two">
                {copy.guarantee ? (
                  <div className="lp-c-plate-wrap">
                    <p className="lp-c-kicker">{copy.guaranteeTitle || "O que garanto"}</p>
                    <p className="lp-c-plate">{copy.guarantee}</p>
                  </div>
                ) : null}
                {copy.authority ? (
                  <div className="lp-c-sign">
                    <p className="lp-c-kicker">Autoridade</p>
                    <p className="lp-c-prose">{copy.authority}</p>
                    <cite className="lp-c-cite">{brand.name}</cite>
                  </div>
                ) : null}
              </div>
            </Shell>
          </section>
        ) : null}

        {proof.length > 0 ? (
          <section className="lp-c-spread">
            <Shell wide>
              <p className="lp-c-kicker">Prova</p>
              {proof.map((item) => (
                <blockquote key={item.quote} className="lp-c-proof">
                  <p>“{item.quote}”</p>
                  <cite>
                    {item.name}
                    {item.role ? ` · ${item.role}` : ""}
                  </cite>
                </blockquote>
              ))}
            </Shell>
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section className="lp-c-spread">
            <Shell wide>
              <h2 className="lp-c-section">Antes de avançares</h2>
              <div className="lp-c-faq">
                <Faqs items={faqs} />
              </div>
            </Shell>
          </section>
        ) : null}

        <section id="fecho" className={`lp-c-close ${look.close}`}>
          <Shell wide>
            <div className={look.close === "stack" ? "lp-c-one" : "lp-c-close-grid"}>
              <div className="lp-c-close-copy">
                {investment ? (
                  <>
                    <p className="lp-c-kicker invert">Investimento</p>
                    <p className="lp-c-price">{investment.primary}</p>
                    {investment.alternate ? <p className="lp-c-alt">{investment.alternate}</p> : null}
                    {investment.notes ? <p className="lp-c-notes">{investment.notes}</p> : null}
                  </>
                ) : (
                  <p className="lp-c-kicker invert">{project.type === "thanks" ? "A seguir" : "Começar"}</p>
                )}
                <h2 className="lp-c-next">{copy.nextStep}</h2>
                {copy.legal ? <p className="lp-c-legal">{copy.legal}</p> : null}
              </div>
              {wantsForm && !formOnCover ? <LeadForm project={project} /> : null}
            </div>
          </Shell>
        </section>
      </div>
    </PageFrame>
  );
}

function trustLine(
  copy: PageCopy,
  investment: ReturnType<typeof splitInvestment> | null,
  priceOnSide: boolean,
) {
  const parts: string[] = [];
  if (investment?.primary && !priceOnSide) parts.push(investment.primary);
  if (investment?.alternate) parts.push(investment.alternate);
  if (/quatro meses/i.test(`${copy.investment ?? ""} ${copy.subheadline}`)) parts.push("compromisso de 4 meses");
  return parts.slice(0, 3).join(" · ");
}

function Cover({
  project,
  look,
  formOnCover,
  investment,
}: {
  project: Project;
  look: LookSpec;
  formOnCover: boolean;
  investment: ReturnType<typeof splitInvestment> | null;
}) {
  const { copy, brand } = project;
  const { lead, rest } = splitLead(copy.subheadline);
  const side = look.cover === "split";
  const wantsCta = project.type !== "thanks" && !formOnCover;
  const priceOnSide = side && !formOnCover && Boolean(investment?.primary);
  const trust = wantsCta ? trustLine(copy, investment, priceOnSide) : "";
  const facts = coverFacts(copy, wantsCta ? undefined : investment?.primary);

  return (
    <header className={`lp-c-cover ${look.cover}${look.coverInk ? " ink" : ""}`}>
      <Shell wide>
        <div className="lp-c-nav">
          <LogoMark project={project} />
          {wantsCta ? (
            <a href="#form" className="lp-c-nav-cta">
              {copy.cta}
            </a>
          ) : (
            <p>{copy.offerName || brand.name}</p>
          )}
        </div>
        <div className="lp-c-hero">
          <div className="lp-c-hero-main">
            <p className="lp-c-kicker">{copy.offerName || brand.name}</p>
            <h1 className="lp-c-title">{copy.headline}</h1>
            {lead ? <p className="lp-c-lead">{lead}</p> : null}
            {rest ? <p className="lp-c-lead-rest">{rest}</p> : null}
            {wantsCta ? (
              <div className="lp-c-hero-cta">
                <a href="#form" className="lp-cta">
                  {copy.cta}
                  <span aria-hidden>→</span>
                </a>
                {trust ? <p className="lp-c-trust">{trust}</p> : null}
              </div>
            ) : null}
          </div>
          {side ? (
            <aside className="lp-c-side">
              {formOnCover ? (
                <LeadForm project={project} />
              ) : (
                <>
                  <p className="lp-c-kicker invert">{brand.name}</p>
                  <p className="lp-c-side-name">{copy.offerName || brand.name}</p>
                  {investment?.primary ? <p className="lp-c-side-price">{investment.primary}</p> : null}
                </>
              )}
            </aside>
          ) : formOnCover ? (
            <LeadForm project={project} />
          ) : null}
        </div>
        {facts.length ? (
          <footer className="lp-c-foot">
            <ul>
              {facts.map((fact) => (
                <li key={fact.text} className={fact.mute ? "mute" : undefined}>
                  {fact.text}
                </li>
              ))}
            </ul>
          </footer>
        ) : null}
      </Shell>
    </header>
  );
}

function Argument({
  look,
  title,
  opening,
  rest,
  problems,
}: {
  look: LookSpec;
  title?: string;
  opening: string;
  rest: string[];
  problems: string[];
}) {
  const kicker = title || "Argumento";
  const list = problems.length ? (
    <ol className="lp-c-points">
      {problems.map((item, index) => (
        <li key={item}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  ) : (
    <div className="lp-c-copy">
      {rest.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
    </div>
  );

  if (look.argument === "points" && problems.length) {
    return (
      <div className="lp-c-arg points">
        <p className="lp-c-kicker">{kicker}</p>
        {opening ? <h2 className="lp-c-display">{opening}</h2> : null}
        {list}
      </div>
    );
  }

  if (look.argument === "spread") {
    return (
      <div className="lp-c-arg spread lp-c-two">
        <div>
          <p className="lp-c-kicker">{kicker}</p>
          {opening ? <p className="lp-c-display">{opening}</p> : null}
        </div>
        {list}
      </div>
    );
  }

  if (look.argument === "pull") {
    return (
      <div className="lp-c-arg pull">
        <p className="lp-c-kicker">{kicker}</p>
        {opening ? <p className="lp-c-display">{opening}</p> : null}
        {list}
      </div>
    );
  }

  return (
    <div className="lp-c-arg column">
      <p className="lp-c-kicker">{kicker}</p>
      {opening ? <p className="lp-c-prose strong">{opening}</p> : null}
      {rest.length ? (
        <div className="lp-c-copy">
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      ) : (
        list
      )}
    </div>
  );
}
