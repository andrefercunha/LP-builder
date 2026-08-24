import { headingSize, lookFromProject } from "@/lib/look";
import type { LookSpec, Project } from "@/lib/types";
import { Faqs, Heading, LeadForm, LogoMark, PageFrame, Shell } from "./PageFrame";

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

export function Compose({ project }: { project: Project }) {
  const look = lookFromProject(project);
  const { copy, brand } = project;
  const bodyParagraphs = copy.body.trim().split(/\n\n+/).filter(Boolean);
  const problems = copy.problems.filter((item) => item && !overlap(item, copy.body));
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
        data-display={look.display}
        data-ink={look.coverInk ? "1" : "0"}
      >
        <Cover project={project} look={look} formOnCover={formOnCover} />

        {bodyParagraphs.length || problems.length ? (
          <section className="lp-c-spread">
            <Shell wide>
              <Argument look={look} title={copy.bodyTitle || copy.leadTitle} pull={bodyParagraphs[0] || copy.leadTitle} rest={bodyParagraphs.slice(1)} problems={problems} />
            </Shell>
          </section>
        ) : null}

        {steps.length > 0 ? (
          <section className={`lp-c-spread${look.mechanismInk ? " ink" : ""}`}>
            <Shell wide>
              <p className="lp-c-kicker">{copy.mechanismTitle || "Como corre"}</p>
              <div className={`lp-c-mech ${look.mechanism}`}>
                {steps.map((step, index) => {
                  const month = monthParts(step.title, index);
                  return (
                    <article key={step.title}>
                      <p className="lp-c-num">{month.n}</p>
                      <p className="lp-c-kicker">{month.kicker}</p>
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
          <section className="lp-c-spread">
            <Shell wide>
              <p className="lp-c-kicker">{copy.offerTitle || "Âmbito"}</p>
              <Heading size={headingSize(look, "section")}>{copy.offerName || "O que entra"}</Heading>
              {hasScope ? (
                <div className={`lp-c-scope ${look.scope}`} data-cols={1 + Number(Boolean(notFor.length)) + Number(Boolean(willGive.length))}>
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

        {copy.guarantee || copy.authority ? (
          <section className="lp-c-spread">
            <Shell wide>
              <div className="lp-c-two">
                {copy.guarantee ? (
                  <div>
                    <p className="lp-c-kicker">{copy.guaranteeTitle || "O que garanto"}</p>
                    <p className="lp-c-plate">{copy.guarantee}</p>
                  </div>
                ) : null}
                {copy.authority ? (
                  <div>
                    <p className="lp-c-kicker">Quem faz este trabalho</p>
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
              <Heading size={headingSize(look, "section")}>Antes de avançares</Heading>
              <div style={{ marginTop: 24 }}>
                <Faqs items={faqs} />
              </div>
            </Shell>
          </section>
        ) : null}

        <section className={`lp-c-close ${look.close}`}>
          <Shell wide>
            <div className={look.close === "invoice" ? "lp-c-two" : "lp-c-one"}>
              <div>
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
                <Heading size={headingSize(look, "section")} style={{ color: "inherit", marginTop: 20, maxWidth: 560 }}>
                  {copy.nextStep}
                </Heading>
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

function Cover({
  project,
  look,
  formOnCover,
}: {
  project: Project;
  look: LookSpec;
  formOnCover: boolean;
}) {
  const { copy, brand } = project;
  const facts = (copy.eyebrow || "")
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
  const size = headingSize(look, "cover");

  return (
    <header className={`lp-c-cover ${look.cover}${look.coverInk ? " ink" : ""}`}>
      <Shell wide>
        <div className="lp-c-nav">
          <LogoMark project={project} />
          <p>{copy.offerName || brand.name}</p>
        </div>
        <div className="lp-c-hero">
          <div>
            <p className="lp-c-kicker">{copy.eyebrow || copy.audience || "Página"}</p>
            <Heading as="h1" size={size}>
              {copy.headline}
            </Heading>
            <p className="lp-c-lead">{copy.subheadline}</p>
            {copy.audience && look.cover === "letter" ? <p className="lp-c-use">{copy.audience}</p> : null}
            {facts.length && look.cover !== "letter" ? (
              <ul className="lp-c-facts">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
          </div>
          {look.cover === "split" ? (
            <aside className="lp-c-side">
              {formOnCover ? (
                <LeadForm project={project} />
              ) : (
                <>
                  <p className="lp-c-kicker invert">{brand.name}</p>
                  <p className="lp-c-side-name">{copy.offerName || brand.name}</p>
                </>
              )}
            </aside>
          ) : formOnCover ? (
            <LeadForm project={project} />
          ) : null}
        </div>
      </Shell>
    </header>
  );
}

function Argument({
  look,
  title,
  pull,
  rest,
  problems,
}: {
  look: LookSpec;
  title?: string;
  pull?: string;
  rest: string[];
  problems: string[];
}) {
  if (look.argument === "points" && problems.length) {
    return (
      <>
        <p className="lp-c-kicker">{title || "Reconhecimento"}</p>
        <ol className="lp-c-points">
          {problems.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </>
    );
  }

  if (look.argument === "spread") {
    return (
      <div className="lp-c-two">
        <div>
          <p className="lp-c-kicker">{title || "Argumento"}</p>
          <p className="lp-c-display">{pull}</p>
        </div>
        <div className="lp-c-copy">
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  }

  if (look.argument === "pull") {
    return (
      <div className="lp-c-one">
        <p className="lp-c-kicker">{title || "Argumento"}</p>
        <p className="lp-c-display">{pull}</p>
        <div className="lp-c-copy">
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lp-c-one narrow">
      <p className="lp-c-kicker">{title || "Argumento"}</p>
      {pull ? <p className="lp-c-prose strong">{pull}</p> : null}
      <div className="lp-c-copy">
        {rest.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
