import type { Project } from "@/lib/types";
import { CtaButton, Eyebrow, Heading, LeadForm, LogoMark, PageFrame, Shell } from "./PageFrame";

export function BookingEditorial({ project }: { project: Project }) {
  const { copy, photos } = project;
  const problems = copy.problems.filter(Boolean);
  const steps = copy.mechanismSteps.filter((step) => step.title);
  const faqs = copy.faqs.filter((item) => item.q);

  return (
    <PageFrame project={project}>
      <div style={{ background: "var(--lp-primary)", color: "#f6f3ec" }}>
        <Shell>
          <div
            style={{
              height: 88,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #ffffff24",
            }}
          >
            <LogoMark project={project} />
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c5c1b7" }}>
              {copy.eyebrow}
            </span>
          </div>
          <div style={{ padding: "88px 0 100px", maxWidth: 980 }}>
            <Heading as="h1" size={86} style={{ color: "#f6f3ec" }}>
              {copy.headline}
            </Heading>
            <p style={{ maxWidth: 640, margin: "32px 0 0", fontSize: 19, lineHeight: 1.6, color: "#c9c4b8" }}>
              {copy.subheadline}
            </p>
            <div style={{ marginTop: 36, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <CtaButton href={copy.ctaHref}>{copy.cta}</CtaButton>
              {copy.ctaSecondary ? <span style={{ color: "#b7b1a4", fontSize: 14 }}>{copy.ctaSecondary}</span> : null}
            </div>
          </div>
        </Shell>
      </div>

      <section style={{ padding: "92px 0" }}>
        <Shell>
          <div
            className="lp-split"
            style={{ display: "grid", gridTemplateColumns: "1fr 0.72fr", gap: 64, alignItems: "center" }}
          >
            <div>
              <Eyebrow>Reconhecimento</Eyebrow>
              <Heading size={52}>{copy.leadTitle}</Heading>
              <ul style={{ listStyle: "none", padding: 0, margin: "36px 0 0", display: "grid", gap: 14 }}>
                {problems.map((item) => (
                  <li
                    key={item}
                    style={{
                      paddingBottom: 14,
                      borderBottom: "1px solid color-mix(in srgb, var(--lp-fg) 10%, transparent)",
                      fontSize: 18,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {photos.portrait ? (
              <img
                src={photos.portrait}
                alt=""
                style={{
                  width: "100%",
                  aspectRatio: "4 / 5",
                  objectFit: "cover",
                  borderRadius: "var(--lp-radius)",
                  filter: "grayscale(0.35) contrast(1.08)",
                }}
              />
            ) : null}
          </div>
        </Shell>
      </section>

      {copy.body ? (
        <section style={{ padding: "0 0 92px" }}>
          <Shell>
            <div style={{ maxWidth: 760 }}>
              <Heading size={46}>{copy.bodyTitle}</Heading>
              <p style={{ fontSize: 19, lineHeight: 1.7, color: "var(--lp-muted)" }}>{copy.body}</p>
            </div>
          </Shell>
        </section>
      ) : null}

      {steps.length > 0 ? (
        <section style={{ padding: "0 0 92px" }}>
          <Shell>
            <Eyebrow>Como corre</Eyebrow>
            <Heading size={50}>{copy.mechanismTitle}</Heading>
            <div style={{ marginTop: 40, display: "grid", gap: 0 }}>
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="lp-split"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr",
                    gap: 28,
                    padding: "28px 0",
                    borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
                  }}
                >
                  <span style={{ fontFamily: "var(--lp-heading)", fontSize: 34, color: "var(--lp-accent)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 26, fontFamily: "var(--lp-heading)", fontWeight: 500 }}>
                      {step.title}
                    </h3>
                    <p style={{ margin: 0, color: "var(--lp-muted)", lineHeight: 1.6 }}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      {(copy.notFor.length || copy.willGet.length) ? (
        <section style={{ padding: "0 0 92px" }}>
          <Shell>
            <div className="lp-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ padding: "32px 28px", background: "var(--lp-surface)" }}>
                <h3 style={{ margin: "0 0 14px", fontFamily: "var(--lp-heading)", fontSize: 28 }}>Não vais receber</h3>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.85, color: "var(--lp-muted)" }}>
                  {copy.notFor.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: "32px 28px", background: "var(--lp-primary)", color: "#f6f3ec" }}>
                <h3 style={{ margin: "0 0 14px", fontFamily: "var(--lp-heading)", fontSize: 28 }}>Vamos trabalhar</h3>
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

      {copy.guarantee ? (
        <section style={{ padding: "0 0 92px" }}>
          <Shell>
            <p
              style={{
                maxWidth: 760,
                margin: 0,
                fontFamily: "var(--lp-heading)",
                fontSize: "clamp(24px, 3.4vw, 36px)",
                lineHeight: 1.25,
              }}
            >
              {copy.guarantee}
            </p>
          </Shell>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section style={{ padding: "0 0 92px" }}>
          <Shell>
            <Heading size={44}>Antes de marcares</Heading>
            <div style={{ marginTop: 28 }}>
              {faqs.map((item) => (
                <details
                  key={item.q}
                  style={{
                    padding: "16px 0",
                    borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
                  }}
                >
                  <summary style={{ cursor: "pointer", fontWeight: 600 }}>{item.q}</summary>
                  <p style={{ margin: "10px 0 0", color: "var(--lp-muted)", lineHeight: 1.6 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      <section style={{ padding: "0 0 110px" }} id="form">
        <Shell>
          <div
            className="lp-split"
            style={{ display: "grid", gridTemplateColumns: "1.1fr 0.8fr", gap: 48, alignItems: "start" }}
          >
            <div>
              <Heading size={50}>{copy.nextStep}</Heading>
              <p style={{ color: "var(--lp-muted)" }}>{copy.legal}</p>
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
