import type { Project } from "@/lib/types";
import {
  Eyebrow,
  Heading,
  LeadForm,
  LogoMark,
  Marquee,
  PageFrame,
  Shell,
} from "./PageFrame";

export function OptInDense({ project }: { project: Project }) {
  const { copy, photos } = project;
  const proof = copy.proof.filter((item) => item.quote);
  const scene = photos.hero || photos.portrait;
  const uppercase = project.brand.headingFont === "bebas";

  return (
    <PageFrame project={project}>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--lp-primary)",
          color: "var(--lp-fg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {scene ? (
          <div className="lp-wash" style={{ opacity: 0.22 }}>
            <img
              src={scene}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.4) contrast(1.2)" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 70% 40%, transparent, var(--lp-primary) 72%), linear-gradient(180deg, var(--lp-primary), transparent 30%, var(--lp-primary))",
              }}
            />
          </div>
        ) : null}
        <div
          className="lp-wash"
          style={{
            background:
              "radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--lp-accent) 18%, transparent), transparent 28%)",
          }}
        />

        <header style={{ borderBottom: "1px solid color-mix(in srgb, var(--lp-fg) 10%, transparent)", position: "relative" }}>
          <Shell>
            <div
              style={{
                minHeight: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <LogoMark project={project} />
              <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--lp-muted)" }}>
                {copy.eyebrow}
              </span>
            </div>
          </Shell>
        </header>

        <Shell>
          <div
            className="lp-split"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, 0.82fr)",
              gap: 64,
              padding: "72px 0 48px",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div>
              <Eyebrow>{copy.audience || "Registo aberto"}</Eyebrow>
              <Heading
                as="h1"
                size={96}
                style={{
                  textTransform: uppercase ? "uppercase" : "none",
                  marginTop: 18,
                  textShadow: "0 20px 60px rgba(0,0,0,0.35)",
                }}
              >
                {copy.headline || "Escreve a headline"}
              </Heading>
              <p
                style={{
                  maxWidth: 540,
                  margin: "28px 0 0",
                  fontSize: 18,
                  lineHeight: 1.6,
                  color: "var(--lp-muted)",
                }}
              >
                {copy.subheadline}
              </p>
              {proof.length > 0 ? (
                <div style={{ marginTop: 36, display: "grid", gap: 18 }}>
                  {proof.slice(0, 2).map((item) => (
                    <blockquote
                      key={item.name + item.quote}
                      style={{
                        margin: 0,
                        paddingLeft: 18,
                        borderLeft: "2px solid var(--lp-accent)",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{item.quote}</p>
                      <cite
                        style={{
                          display: "block",
                          marginTop: 8,
                          fontStyle: "normal",
                          fontSize: 12,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
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

            <div style={{ display: "grid", gap: 0, position: "relative" }}>
              {scene ? (
                <div style={{ position: "relative", height: 210, overflow: "hidden", borderRadius: "var(--lp-radius) var(--lp-radius) 0 0" }}>
                  <img
                    src={scene}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.2) contrast(1.1)" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, var(--lp-surface), color-mix(in srgb, var(--lp-primary) 15%, transparent))",
                    }}
                  />
                </div>
              ) : null}
              <div style={{ marginTop: scene ? -28 : 0, position: "relative" }}>
                <LeadForm project={project} />
              </div>
            </div>
          </div>
        </Shell>

        <div
          style={{
            borderTop: "1px solid color-mix(in srgb, var(--lp-fg) 10%, transparent)",
            padding: "22px 0",
            background: "color-mix(in srgb, var(--lp-primary) 88%, #000)",
          }}
        >
          <Marquee items={copy.problems.filter(Boolean)} />
        </div>

        <footer style={{ padding: "22px 0 36px" }}>
          <Shell>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: "var(--lp-muted)", maxWidth: 760 }}>
              {copy.legal}
            </p>
          </Shell>
        </footer>
      </div>
    </PageFrame>
  );
}
