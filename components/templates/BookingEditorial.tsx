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

export function BookingEditorial({ project }: { project: Project }) {
  const { copy, photos } = project;
  const problems = copy.problems.filter(Boolean);
  const steps = copy.mechanismSteps.filter((step) => step.title);
  const faqs = copy.faqs.filter((item) => item.q);
  const atmosphere = photos.hero || photos.portrait;

  return (
    <PageFrame project={project}>
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "var(--lp-primary)",
          color: "#f6f3ec",
          overflow: "hidden",
        }}
      >
        {atmosphere ? (
          <div className="lp-wash" style={{ right: "-8%", left: "36%", opacity: 0.38 }}>
            <img
              src={atmosphere}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "grayscale(0.55) contrast(1.15)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, var(--lp-primary) 0%, color-mix(in srgb, var(--lp-primary) 55%, transparent) 48%, color-mix(in srgb, var(--lp-primary) 18%, transparent) 100%)",
              }}
            />
          </div>
        ) : null}
        <div
          className="lp-wash"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--lp-accent) 16%, transparent), transparent 36%)",
          }}
        />

        <Shell>
          <div
            style={{
              height: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #ffffff1f",
              position: "relative",
            }}
          >
            <LogoMark project={project} />
            <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c5c1b7" }}>
              {copy.eyebrow}
            </span>
          </div>
          <div style={{ padding: "100px 0 120px", maxWidth: 860, position: "relative" }}>
            <p
              className="lp-index"
              style={{ fontSize: 72, opacity: 0.18, margin: "0 0 12px", color: "var(--lp-accent)" }}
            >
              01
            </p>
            <Heading as="h1" size={88} style={{ color: "#f6f3ec", maxWidth: 920 }}>
              {copy.headline}
            </Heading>
            <p style={{ maxWidth: 560, margin: "34px 0 0", fontSize: 19, lineHeight: 1.65, color: "#d0cbbf" }}>
              {copy.subheadline}
            </p>
            <div style={{ marginTop: 40, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <CtaButton href={copy.ctaHref}>{copy.cta}</CtaButton>
              {copy.ctaSecondary ? <span style={{ color: "#b7b1a4", fontSize: 14 }}>{copy.ctaSecondary}</span> : null}
            </div>
          </div>
        </Shell>
      </section>

      <section style={{ padding: "108px 0", position: "relative" }}>
        <Shell>
          <div className="lp-split" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.8fr", gap: 80, alignItems: "center" }}>
            <div>
              <Eyebrow>Reconhecimento</Eyebrow>
              <Heading size={54} style={{ marginTop: 18 }}>
                {copy.leadTitle}
              </Heading>
              <ul style={{ listStyle: "none", padding: 0, margin: "40px 0 0", display: "grid", gap: 0 }}>
                {problems.map((item) => (
                  <li
                    key={item}
                    style={{
                      padding: "16px 0",
                      borderBottom: "1px solid color-mix(in srgb, var(--lp-fg) 10%, transparent)",
                      fontSize: 19,
                      lineHeight: 1.4,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {photos.portrait ? <TreatedPhoto src={photos.portrait} /> : null}
          </div>
        </Shell>
      </section>

      {copy.body ? (
        <section
          style={{
            padding: "100px 0",
            background:
              "linear-gradient(180deg, transparent, color-mix(in srgb, var(--lp-accent) 6%, var(--lp-surface)) 12%, var(--lp-surface))",
          }}
        >
          <Shell>
            <div style={{ maxWidth: 780 }}>
              <p className="lp-index" style={{ fontSize: 88, opacity: 0.12, margin: 0 }}>
                “
              </p>
              <Heading size={48}>{copy.bodyTitle}</Heading>
              <p style={{ fontSize: 20, lineHeight: 1.75, color: "var(--lp-muted)", marginTop: 24 }}>{copy.body}</p>
            </div>
          </Shell>
        </section>
      ) : null}

      {steps.length > 0 ? (
        <section style={{ padding: "108px 0" }}>
          <Shell>
            <Eyebrow>Como corre</Eyebrow>
            <Heading size={52} style={{ marginTop: 16 }}>
              {copy.mechanismTitle}
            </Heading>
            <div style={{ marginTop: 56, display: "grid", gap: 0, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 23,
                  top: 18,
                  bottom: 18,
                  width: 1,
                  background: "linear-gradient(180deg, var(--lp-accent), transparent)",
                }}
              />
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="lp-split"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: 28,
                    padding: "28px 0 36px",
                  }}
                >
                  <span
                    className="lp-index"
                    style={{
                      width: 46,
                      height: 46,
                      border: "1px solid var(--lp-accent)",
                      display: "grid",
                      placeItems: "center",
                      background: "var(--lp-bg)",
                      fontSize: 16,
                      position: "relative",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 style={{ margin: "6px 0 10px", fontSize: 28, fontFamily: "var(--lp-heading)", fontWeight: 500 }}>
                      {step.title}
                    </h3>
                    <p style={{ margin: 0, color: "var(--lp-muted)", lineHeight: 1.65, maxWidth: 620 }}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      {copy.notFor.length || copy.willGet.length ? (
        <section style={{ padding: "0 0 108px" }}>
          <Shell>
            <div className="lp-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <div
                style={{
                  padding: "40px 36px",
                  background: "var(--lp-surface)",
                  border: "1px solid color-mix(in srgb, var(--lp-fg) 8%, transparent)",
                }}
              >
                <h3 style={{ margin: "0 0 16px", fontFamily: "var(--lp-heading)", fontSize: 30 }}>Não vais receber</h3>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, color: "var(--lp-muted)" }}>
                  {copy.notFor.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  padding: "40px 36px",
                  background: "var(--lp-primary)",
                  color: "#f6f3ec",
                  boxShadow: "0 24px 70px rgba(0,0,0,0.18)",
                  transform: "translateY(-10px)",
                }}
              >
                <h3 style={{ margin: "0 0 16px", fontFamily: "var(--lp-heading)", fontSize: 30 }}>Vamos trabalhar</h3>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
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
        <section style={{ padding: "0 0 108px" }}>
          <Shell>
            <div
              style={{
                maxWidth: 820,
                padding: "48px 8px 0",
                borderTop: "1px solid var(--lp-accent)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--lp-heading)",
                  fontSize: "clamp(26px, 3.6vw, 40px)",
                  lineHeight: 1.22,
                }}
              >
                {copy.guarantee}
              </p>
            </div>
          </Shell>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section style={{ padding: "0 0 108px" }}>
          <Shell>
            <Heading size={46}>Antes de marcares</Heading>
            <div style={{ marginTop: 28 }}>
              <Faqs items={faqs} />
            </div>
          </Shell>
        </section>
      ) : null}

      <section
        style={{
          padding: "80px 0 120px",
          background: "color-mix(in srgb, var(--lp-primary) 6%, var(--lp-bg))",
        }}
        id="form"
      >
        <Shell>
          <div className="lp-split" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.8fr", gap: 56, alignItems: "start" }}>
            <div>
              <Eyebrow>Próximo passo</Eyebrow>
              <Heading size={50} style={{ marginTop: 16 }}>
                {copy.nextStep}
              </Heading>
              <p style={{ color: "var(--lp-muted)", maxWidth: 460 }}>{copy.legal}</p>
            </div>
            <LeadForm project={project} />
          </div>
        </Shell>
      </section>
    </PageFrame>
  );
}
