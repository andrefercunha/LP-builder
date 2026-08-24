import type { Project } from "@/lib/types";
import { CtaButton, Eyebrow, Heading, LeadForm, LogoMark, PageFrame, Shell } from "./PageFrame";

export function SalesLong({ project }: { project: Project }) {
  const { copy, photos } = project;
  const problems = copy.problems.filter(Boolean);
  const steps = copy.mechanismSteps.filter((step) => step.title);
  const bullets = copy.offerBullets.filter(Boolean);
  const proof = copy.proof.filter((item) => item.quote);
  const faqs = copy.faqs.filter((item) => item.q);

  return (
    <PageFrame project={project}>
      <header
        style={{
          background: "var(--lp-primary)",
          color: "var(--lp-background, #fff)",
        }}
      >
        <div
          style={{
            color: "#f7f8f3",
            padding: "0 0 88px",
            background: "var(--lp-primary)",
          }}
        >
          <Shell>
            <div
              style={{
                height: 84,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #ffffff22",
              }}
            >
              <LogoMark project={project} />
              <CtaButton href={copy.ctaHref}>{copy.cta}</CtaButton>
            </div>
            <div
              className="lp-split"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) minmax(240px, 0.7fr)",
                gap: 48,
                paddingTop: 72,
                alignItems: "end",
              }}
            >
              <div>
                <Eyebrow>{copy.eyebrow}</Eyebrow>
                <Heading as="h1" size={84} style={{ color: "#f7f8f3" }}>
                  {copy.headline}
                </Heading>
                <p
                  style={{
                    maxWidth: 620,
                    margin: "28px 0 0",
                    color: "#c5c9c4",
                    fontSize: 18,
                    lineHeight: 1.6,
                  }}
                >
                  {copy.subheadline}
                </p>
                <div style={{ marginTop: 32, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <CtaButton href={copy.ctaHref}>{copy.cta}</CtaButton>
                  {copy.ctaSecondary ? (
                    <span style={{ color: "#9aa19b", fontSize: 13 }}>{copy.ctaSecondary}</span>
                  ) : null}
                </div>
              </div>
              {photos.portrait || photos.hero ? (
                <img
                  src={photos.portrait || photos.hero}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 5",
                    objectFit: "cover",
                    borderRadius: "var(--lp-radius)",
                    filter: "grayscale(0.2) contrast(1.05)",
                  }}
                />
              ) : null}
            </div>
          </Shell>
        </div>
      </header>

      {problems.length > 0 ? (
        <section style={{ padding: "96px 0" }}>
          <Shell>
            <Eyebrow>Reconhecimento</Eyebrow>
            <Heading size={58}>{copy.leadTitle || "Isto é para ti se"}</Heading>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: "48px 0 0",
                display: "grid",
                gap: 0,
              }}
            >
              {problems.map((item, index) => (
                <li
                  key={item}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: 20,
                    padding: "22px 0",
                    borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
                  }}
                >
                  <span style={{ color: "var(--lp-accent)", fontFamily: "var(--lp-heading)", fontSize: 28 }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p style={{ margin: 0, fontSize: 20, lineHeight: 1.45 }}>{item}</p>
                </li>
              ))}
            </ol>
          </Shell>
        </section>
      ) : null}

      {copy.body ? (
        <section
          style={{
            padding: "96px 0",
            background: "var(--lp-surface)",
          }}
        >
          <Shell>
            <div
              className="lp-split"
              style={{
                display: "grid",
                gridTemplateColumns: "0.9fr 1.1fr",
                gap: 64,
                alignItems: "start",
              }}
            >
              <Heading size={54}>{copy.bodyTitle}</Heading>
              <p
                style={{
                  margin: 0,
                  fontSize: 19,
                  lineHeight: 1.7,
                  color: "var(--lp-muted)",
                  maxWidth: 640,
                }}
              >
                {copy.body}
              </p>
            </div>
          </Shell>
        </section>
      ) : null}

      {steps.length > 0 ? (
        <section style={{ padding: "96px 0" }}>
          <Shell>
            <Eyebrow>Mecanismo</Eyebrow>
            <Heading size={58}>{copy.mechanismTitle || "Como se chega lá"}</Heading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 28,
                marginTop: 48,
              }}
            >
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  style={{
                    paddingTop: 18,
                    borderTop: "2px solid var(--lp-accent)",
                  }}
                >
                  <p style={{ margin: "0 0 12px", color: "var(--lp-accent)", fontSize: 13, letterSpacing: "0.12em" }}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 style={{ margin: "0 0 12px", fontFamily: "var(--lp-heading)", fontSize: 28, fontWeight: 500 }}>
                    {step.title}
                  </h3>
                  <p style={{ margin: 0, color: "var(--lp-muted)", lineHeight: 1.6 }}>{step.text}</p>
                </article>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      <section
        style={{
          padding: "96px 0",
          background: "var(--lp-primary)",
          color: "#f7f8f3",
        }}
      >
        <Shell>
          <Eyebrow>{copy.offerTitle || "A oferta"}</Eyebrow>
          <Heading size={64} style={{ color: "#f7f8f3" }}>
            {copy.offerName}
          </Heading>
          <ul style={{ padding: 0, margin: "40px 0 0", listStyle: "none", display: "grid", gap: 16, maxWidth: 680 }}>
            {bullets.map((item) => (
              <li
                key={item}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #ffffff22",
                  fontSize: 18,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
          {copy.bonuses.filter(Boolean).length > 0 ? (
            <p style={{ margin: "28px 0 0", color: "#c5c9c4" }}>
              Inclui ainda: {copy.bonuses.filter(Boolean).join(" · ")}
            </p>
          ) : null}
          <div style={{ marginTop: 36 }}>
            <CtaButton href={copy.ctaHref}>{copy.cta}</CtaButton>
          </div>
        </Shell>
      </section>

      {proof.length > 0 ? (
        <section style={{ padding: "96px 0" }}>
          <Shell>
            <Eyebrow>Prova</Eyebrow>
            <div style={{ display: "grid", gap: 48 }}>
              {proof.map((item) => (
                <blockquote key={item.quote} style={{ margin: 0, maxWidth: 860 }}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--lp-heading)",
                      fontSize: "clamp(26px, 4vw, 40px)",
                      lineHeight: 1.2,
                    }}
                  >
                    “{item.quote}”
                  </p>
                  <cite
                    style={{
                      display: "block",
                      marginTop: 16,
                      fontStyle: "normal",
                      color: "var(--lp-muted)",
                    }}
                  >
                    {item.name}
                    {item.role ? ` · ${item.role}` : ""}
                  </cite>
                </blockquote>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      {copy.guarantee ? (
        <section style={{ padding: "0 0 96px" }}>
          <Shell>
            <div
              style={{
                border: "1px solid var(--lp-fg)",
                padding: "48px 44px",
                maxWidth: 820,
              }}
            >
              <Eyebrow>{copy.guaranteeTitle || "Risco"}</Eyebrow>
              <p style={{ margin: 0, fontSize: 22, lineHeight: 1.45 }}>{copy.guarantee}</p>
            </div>
          </Shell>
        </section>
      ) : null}

      {copy.notFor.length || copy.willGet.length ? (
        <section style={{ padding: "0 0 96px" }}>
          <Shell>
            <div
              className="lp-split"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
            >
              <div style={{ padding: 28, background: "var(--lp-surface)" }}>
                <h3 style={{ margin: "0 0 16px", fontFamily: "var(--lp-heading)", fontSize: 28 }}>Não é para</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--lp-muted)", lineHeight: 1.8 }}>
                  {copy.notFor.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: 28, background: "var(--lp-primary)", color: "#f7f8f3" }}>
                <h3 style={{ margin: "0 0 16px", fontFamily: "var(--lp-heading)", fontSize: 28 }}>Levas</h3>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                  {copy.willGet.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Shell>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section style={{ padding: "0 0 96px" }}>
          <Shell>
            <Heading size={48}>Antes de avançares</Heading>
            <div style={{ marginTop: 36, display: "grid", gap: 0 }}>
              {faqs.map((item) => (
                <details
                  key={item.q}
                  style={{
                    padding: "18px 0",
                    borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
                  }}
                >
                  <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 17 }}>{item.q}</summary>
                  <p style={{ margin: "12px 0 0", color: "var(--lp-muted)", lineHeight: 1.6 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      <section style={{ padding: "0 0 120px" }}>
        <Shell>
          <div
            className="lp-split"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 0.85fr",
              gap: 48,
              alignItems: "start",
            }}
          >
            <div>
              <Heading size={52}>{copy.nextStep}</Heading>
              <p style={{ color: "var(--lp-muted)", lineHeight: 1.6 }}>{copy.legal}</p>
            </div>
            <LeadForm project={project} />
          </div>
        </Shell>
      </section>
      <style>{`
        @media (max-width: 860px) {
          .lp-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageFrame>
  );
}
