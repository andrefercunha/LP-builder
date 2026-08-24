import type { Project } from "@/lib/types";
import {
  CtaButton,
  Eyebrow,
  Faqs,
  Heading,
  LeadForm,
  LogoMark,
  PageFrame,
  Shell,
  TreatedPhoto,
} from "./PageFrame";

export function SalesLong({ project }: { project: Project }) {
  const { copy, photos } = project;
  const problems = copy.problems.filter(Boolean);
  const steps = copy.mechanismSteps.filter((step) => step.title);
  const bullets = copy.offerBullets.filter(Boolean);
  const proof = copy.proof.filter((item) => item.quote);
  const faqs = copy.faqs.filter((item) => item.q);
  const atmosphere = photos.hero;

  return (
    <PageFrame project={project}>
      <header style={{ position: "relative", background: "var(--lp-primary)", color: "#f7f8f3", overflow: "hidden" }}>
        {atmosphere ? (
          <div className="lp-wash" style={{ opacity: 0.2 }}>
            <img src={atmosphere} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.5)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, var(--lp-primary), transparent 40%, var(--lp-primary))" }} />
          </div>
        ) : null}
        <div
          className="lp-wash"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, color-mix(in srgb, var(--lp-accent) 22%, transparent), transparent 32%)",
          }}
        />
        <div style={{ padding: "0 0 96px", position: "relative" }}>
          <Shell>
            <div
              style={{
                height: 88,
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
                gridTemplateColumns: "minmax(0, 1.15fr) minmax(260px, 0.72fr)",
                gap: 64,
                paddingTop: 80,
                alignItems: "end",
              }}
            >
              <div>
                <Eyebrow>{copy.eyebrow}</Eyebrow>
                <Heading as="h1" size={86} style={{ color: "#f7f8f3", marginTop: 18 }}>
                  {copy.headline}
                </Heading>
                <p style={{ maxWidth: 600, margin: "28px 0 0", color: "#c5c9c4", fontSize: 18, lineHeight: 1.65 }}>
                  {copy.subheadline}
                </p>
                <div style={{ marginTop: 36, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <CtaButton href={copy.ctaHref}>{copy.cta}</CtaButton>
                  {copy.ctaSecondary ? <span style={{ color: "#9aa19b", fontSize: 13 }}>{copy.ctaSecondary}</span> : null}
                </div>
              </div>
              {photos.portrait || photos.hero ? (
                <TreatedPhoto src={photos.portrait || photos.hero!} />
              ) : null}
            </div>
          </Shell>
        </div>
      </header>

      {problems.length > 0 ? (
        <section style={{ padding: "108px 0" }}>
          <Shell>
            <Eyebrow>Reconhecimento</Eyebrow>
            <Heading size={58} style={{ marginTop: 16 }}>
              {copy.leadTitle || "Isto é para ti se"}
            </Heading>
            <ol style={{ listStyle: "none", padding: 0, margin: "52px 0 0" }}>
              {problems.map((item, index) => (
                <li
                  key={item}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "88px 1fr",
                    gap: 20,
                    padding: "24px 0",
                    borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
                  }}
                >
                  <span className="lp-index" style={{ fontSize: 34 }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p style={{ margin: "8px 0 0", fontSize: 22, lineHeight: 1.4 }}>{item}</p>
                </li>
              ))}
            </ol>
          </Shell>
        </section>
      ) : null}

      {copy.body ? (
        <section
          style={{
            padding: "108px 0",
            background: "var(--lp-surface)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <p
            className="lp-index"
            style={{
              position: "absolute",
              left: "-2%",
              top: "-6%",
              fontSize: "28vw",
              opacity: 0.05,
              margin: 0,
              pointerEvents: "none",
            }}
          >
            02
          </p>
          <Shell>
            <div className="lp-split" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 72 }}>
              <Heading size={54}>{copy.bodyTitle}</Heading>
              <p style={{ margin: 0, fontSize: 20, lineHeight: 1.75, color: "var(--lp-muted)", maxWidth: 640 }}>
                {copy.body}
              </p>
            </div>
          </Shell>
        </section>
      ) : null}

      {steps.length > 0 ? (
        <section style={{ padding: "108px 0" }}>
          <Shell>
            <Eyebrow>Mecanismo</Eyebrow>
            <Heading size={58} style={{ marginTop: 16 }}>
              {copy.mechanismTitle || "Como se chega lá"}
            </Heading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 0,
                marginTop: 56,
                borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
              }}
            >
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  style={{
                    padding: "28px 24px 8px 0",
                    borderRight: index === steps.length - 1 ? 0 : "1px solid color-mix(in srgb, var(--lp-fg) 10%, transparent)",
                  }}
                >
                  <p className="lp-index" style={{ fontSize: 42, margin: "0 0 18px" }}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 style={{ margin: "0 0 12px", fontFamily: "var(--lp-heading)", fontSize: 28, fontWeight: 500 }}>
                    {step.title}
                  </h3>
                  <p style={{ margin: 0, color: "var(--lp-muted)", lineHeight: 1.65 }}>{step.text}</p>
                </article>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      <section
        style={{
          padding: "108px 0",
          background: "var(--lp-primary)",
          color: "#f7f8f3",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="lp-wash"
          style={{
            background:
              "radial-gradient(circle at 20% 80%, color-mix(in srgb, var(--lp-accent) 20%, transparent), transparent 30%)",
          }}
        />
        <Shell>
          <div style={{ position: "relative" }}>
            <Eyebrow>{copy.offerTitle || "A oferta"}</Eyebrow>
            <Heading size={68} style={{ color: "#f7f8f3", marginTop: 16 }}>
              {copy.offerName}
            </Heading>
            <ul style={{ padding: 0, margin: "44px 0 0", listStyle: "none", display: "grid", gap: 0, maxWidth: 700 }}>
              {bullets.map((item) => (
                <li
                  key={item}
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #ffffff22",
                    fontSize: 19,
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
            <div style={{ marginTop: 40 }}>
              <CtaButton href={copy.ctaHref}>{copy.cta}</CtaButton>
            </div>
          </div>
        </Shell>
      </section>

      {proof.length > 0 ? (
        <section style={{ padding: "108px 0" }}>
          <Shell>
            <Eyebrow>Prova</Eyebrow>
            <div style={{ display: "grid", gap: 64, marginTop: 28 }}>
              {proof.map((item) => (
                <blockquote key={item.quote} style={{ margin: 0, maxWidth: 900, position: "relative" }}>
                  <span className="lp-index" style={{ fontSize: 96, opacity: 0.16, position: "absolute", top: -36, left: -8 }}>
                    “
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--lp-heading)",
                      fontSize: "clamp(28px, 4vw, 44px)",
                      lineHeight: 1.18,
                      position: "relative",
                    }}
                  >
                    {item.quote}
                  </p>
                  <cite
                    style={{
                      display: "block",
                      marginTop: 18,
                      fontStyle: "normal",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontSize: 12,
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
        <section style={{ padding: "0 0 108px" }}>
          <Shell>
            <div
              style={{
                maxWidth: 840,
                padding: "48px 44px",
                border: "1px solid var(--lp-fg)",
                boxShadow: "12px 12px 0 color-mix(in srgb, var(--lp-accent) 35%, transparent)",
              }}
            >
              <Eyebrow>{copy.guaranteeTitle || "Risco"}</Eyebrow>
              <p style={{ margin: "16px 0 0", fontSize: 22, lineHeight: 1.5 }}>{copy.guarantee}</p>
            </div>
          </Shell>
        </section>
      ) : null}

      {copy.notFor.length || copy.willGet.length ? (
        <section style={{ padding: "0 0 108px" }}>
          <Shell>
            <div className="lp-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <div style={{ padding: "36px 32px", background: "var(--lp-surface)" }}>
                <h3 style={{ margin: "0 0 16px", fontFamily: "var(--lp-heading)", fontSize: 30 }}>Não é para</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--lp-muted)", lineHeight: 1.85 }}>
                  {copy.notFor.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: "36px 32px", background: "var(--lp-primary)", color: "#f7f8f3", transform: "translateY(-8px)" }}>
                <h3 style={{ margin: "0 0 16px", fontFamily: "var(--lp-heading)", fontSize: 30 }}>Levas</h3>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.85 }}>
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
        <section style={{ padding: "0 0 108px" }}>
          <Shell>
            <Heading size={48}>Antes de avançares</Heading>
            <div style={{ marginTop: 32 }}>
              <Faqs items={faqs} />
            </div>
          </Shell>
        </section>
      ) : null}

      <section style={{ padding: "0 0 120px" }}>
        <Shell>
          <div className="lp-split" style={{ display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 56 }}>
            <div>
              <Eyebrow>Começar</Eyebrow>
              <Heading size={52} style={{ marginTop: 16 }}>
                {copy.nextStep}
              </Heading>
              <p style={{ color: "var(--lp-muted)", lineHeight: 1.65 }}>{copy.legal}</p>
            </div>
            <LeadForm project={project} />
          </div>
        </Shell>
      </section>
    </PageFrame>
  );
}
