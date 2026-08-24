import type { Project } from "@/lib/types";
import { CtaButton, Eyebrow, Heading, LeadForm, LogoMark, PageFrame, Shell } from "./PageFrame";

export function OptInDense({ project }: { project: Project }) {
  const { copy, photos } = project;
  const proof = copy.proof.filter((item) => item.quote);

  return (
    <PageFrame project={project}>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--lp-primary)",
          color: "var(--lp-fg)",
        }}
      >
        <header
          style={{
            borderBottom: "1px solid color-mix(in srgb, var(--lp-fg) 12%, transparent)",
          }}
        >
          <Shell>
            <div
              style={{
                minHeight: 76,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <LogoMark project={project} />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--lp-muted)",
                }}
              >
                {copy.eyebrow}
              </span>
            </div>
          </Shell>
        </header>

        <Shell>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
              gap: 56,
              padding: "64px 0 40px",
              alignItems: "center",
            }}
            className="lp-split"
          >
            <div>
              <Eyebrow>{copy.audience || "Registo aberto"}</Eyebrow>
              <Heading as="h1" size={92} style={{ textTransform: project.brand.headingFont === "bebas" ? "uppercase" : "none" }}>
                {copy.headline || "Escreve a headline"}
              </Heading>
              <p
                style={{
                  maxWidth: 560,
                  margin: "28px 0 0",
                  fontSize: 18,
                  lineHeight: 1.55,
                  color: "var(--lp-muted)",
                }}
              >
                {copy.subheadline}
              </p>
              {proof.length > 0 ? (
                <div style={{ marginTop: 36, display: "grid", gap: 16 }}>
                  {proof.slice(0, 2).map((item) => (
                    <blockquote
                      key={item.name + item.quote}
                      style={{
                        margin: 0,
                        paddingLeft: 16,
                        borderLeft: "2px solid var(--lp-accent)",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{item.quote}</p>
                      <cite
                        style={{
                          display: "block",
                          marginTop: 8,
                          fontStyle: "normal",
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
              ) : null}
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {photos.hero || photos.portrait ? (
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--lp-radius)" }}>
                  <img
                    src={photos.hero || photos.portrait}
                    alt=""
                    style={{ width: "100%", height: 220, objectFit: "cover", filter: "saturate(0.85)" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, color-mix(in srgb, var(--lp-primary) 70%, transparent), transparent 55%)",
                    }}
                  />
                </div>
              ) : null}
              <LeadForm project={project} />
            </div>
          </div>
        </Shell>

        {copy.problems.filter(Boolean).length > 0 ? (
          <div
            style={{
              borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 10%, transparent)",
              padding: "28px 0",
            }}
          >
            <Shell>
              <div
                style={{
                  display: "flex",
                  gap: 28,
                  overflow: "hidden",
                  fontSize: 13,
                  color: "var(--lp-muted)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {copy.problems.filter(Boolean).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </Shell>
          </div>
        ) : null}

        <footer style={{ padding: "20px 0 40px" }}>
          <Shell>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: "var(--lp-muted)", maxWidth: 760 }}>
              {copy.legal}
            </p>
          </Shell>
        </footer>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .lp-split { grid-template-columns: 1fr !important; padding-top: 36px !important; gap: 32px !important; }
        }
      `}</style>
    </PageFrame>
  );
}
