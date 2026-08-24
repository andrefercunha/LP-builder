import type { Project } from "@/lib/types";
import { Faqs, Heading, LeadForm, LogoMark, PageFrame, Shell } from "./PageFrame";

export function BookingLetter({ project }: { project: Project }) {
  const { copy, photos } = project;
  const problems = copy.problems.filter(Boolean);
  const steps = copy.mechanismSteps.filter((step) => step.title);
  const faqs = copy.faqs.filter((item) => item.q);

  return (
    <PageFrame project={project}>
      <div style={{ background: "var(--lp-bg)", color: "var(--lp-fg)", minHeight: "100vh" }}>
        <Shell>
          <div
            style={{
              padding: "36px 0 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              borderBottom: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
            }}
          >
            <LogoMark project={project} />
            <span style={{ fontSize: 12, color: "var(--lp-muted)" }}>{copy.eyebrow}</span>
          </div>

          <article style={{ padding: "56px 0 80px", maxWidth: 720 }}>
            {photos.portrait ? (
              <img
                src={photos.portrait}
                alt=""
                style={{
                  float: "right",
                  width: 168,
                  height: 210,
                  objectFit: "cover",
                  margin: "0 0 20px 32px",
                  filter: "grayscale(0.15) contrast(1.05)",
                }}
              />
            ) : null}
            <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--lp-muted)", fontStyle: "italic" }}>
              {copy.audience}
            </p>
            <Heading as="h1" size={54}>
              {copy.headline}
            </Heading>
            <p style={{ margin: "22px 0 0", fontSize: 18, lineHeight: 1.7, color: "var(--lp-muted)" }}>
              {copy.subheadline}
            </p>
            <p style={{ margin: "28px 0 0", fontSize: 18, lineHeight: 1.75 }}>{copy.body}</p>
            <div style={{ clear: "both" }} />
          </article>

          {problems.length > 0 ? (
            <section style={{ padding: "0 0 64px", maxWidth: 720 }}>
              <h2 style={{ fontFamily: "var(--lp-heading)", fontSize: 28, fontWeight: 500, margin: "0 0 16px" }}>
                {copy.leadTitle}
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10, fontSize: 17, lineHeight: 1.5 }}>
                {problems.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {steps.length > 0 ? (
            <section style={{ padding: "0 0 64px", maxWidth: 720 }}>
              <h2 style={{ fontFamily: "var(--lp-heading)", fontSize: 28, fontWeight: 500, margin: "0 0 20px" }}>
                {copy.mechanismTitle}
              </h2>
              <div style={{ display: "grid", gap: 22 }}>
                {steps.map((step, index) => (
                  <p key={step.title} style={{ margin: 0, lineHeight: 1.65 }}>
                    <strong>
                      {index + 1}. {step.title}.
                    </strong>{" "}
                    <span style={{ color: "var(--lp-muted)" }}>{step.text}</span>
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          {(copy.notFor.length || copy.willGet.length) ? (
            <section
              style={{
                padding: "28px 0",
                marginBottom: 64,
                borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
                borderBottom: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
                maxWidth: 720,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
              className="lp-split"
            >
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Não vais receber
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--lp-muted)", lineHeight: 1.8 }}>
                  {copy.notFor.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Vamos trabalhar
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                  {copy.willGet.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {copy.guarantee ? (
            <p style={{ maxWidth: 720, fontStyle: "italic", fontSize: 20, lineHeight: 1.5, margin: "0 0 64px" }}>
              {copy.guarantee}
            </p>
          ) : null}

          {faqs.length > 0 ? (
            <section style={{ padding: "0 0 64px", maxWidth: 720 }}>
              <h2 style={{ fontFamily: "var(--lp-heading)", fontSize: 28, fontWeight: 500, margin: "0 0 12px" }}>
                Antes de marcares
              </h2>
              <Faqs items={faqs} />
            </section>
          ) : null}

          <section id="form" style={{ padding: "0 0 96px", maxWidth: 520 }}>
            <h2 style={{ fontFamily: "var(--lp-heading)", fontSize: 30, fontWeight: 500, margin: "0 0 10px" }}>
              {copy.cta}
            </h2>
            <p style={{ color: "var(--lp-muted)", marginTop: 0 }}>{copy.nextStep}</p>
            <LeadForm project={project} />
            <p style={{ fontSize: 12, color: "var(--lp-muted)" }}>{copy.legal}</p>
          </section>
        </Shell>
      </div>
    </PageFrame>
  );
}
