import type { Project } from "@/lib/types";
import { CtaButton, Eyebrow, Heading, LogoMark, PageFrame, Shell } from "./PageFrame";

export function ThanksNext({ project }: { project: Project }) {
  const items = project.copy.offerBullets.filter(Boolean);
  const atmosphere = project.photos.hero || project.photos.portrait;

  return (
    <PageFrame project={project}>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--lp-primary)",
          color: "var(--lp-fg)",
          display: "grid",
          alignContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {atmosphere ? (
          <div className="lp-wash" style={{ opacity: 0.16 }}>
            <img src={atmosphere} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent, var(--lp-primary) 72%)" }} />
          </div>
        ) : null}
        <div
          className="lp-wash"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--lp-accent) 18%, transparent), transparent 34%)",
          }}
        />
        <Shell>
          <div style={{ padding: "80px 0", maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <div
              style={{
                width: 92,
                height: 92,
                margin: "0 auto 28px",
                border: "1px solid var(--lp-accent)",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 0 0 12px color-mix(in srgb, var(--lp-accent) 10%, transparent)",
              }}
            >
              <span className="lp-index" style={{ fontSize: 34 }}>
                ✓
              </span>
            </div>
            <div style={{ marginBottom: 22, display: "flex", justifyContent: "center" }}>
              <LogoMark project={project} />
            </div>
            <Eyebrow>{project.copy.eyebrow || "Confirmado"}</Eyebrow>
            <Heading as="h1" size={76} style={{ marginTop: 16 }}>
              {project.copy.headline}
            </Heading>
            <p
              style={{
                margin: "24px auto 0",
                maxWidth: 540,
                color: "var(--lp-muted)",
                fontSize: 18,
                lineHeight: 1.65,
              }}
            >
              {project.copy.subheadline}
            </p>
            <div style={{ marginTop: 34 }}>
              <CtaButton href={project.copy.ctaHref}>{project.copy.cta}</CtaButton>
            </div>
            {items.length > 0 ? (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "52px auto 0",
                  maxWidth: 460,
                  textAlign: "left",
                  display: "grid",
                  gap: 0,
                }}
              >
                {items.map((item) => (
                  <li
                    key={item}
                    style={{
                      padding: "14px 0",
                      borderBottom: "1px solid color-mix(in srgb, var(--lp-fg) 14%, transparent)",
                      display: "grid",
                      gridTemplateColumns: "18px 1fr",
                      gap: 12,
                    }}
                  >
                    <span style={{ color: "var(--lp-accent)" }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            <p style={{ marginTop: 36, color: "var(--lp-muted)", fontSize: 14 }}>{project.copy.nextStep}</p>
            <p style={{ marginTop: 48, color: "var(--lp-muted)", fontSize: 11 }}>{project.copy.legal}</p>
          </div>
        </Shell>
      </div>
    </PageFrame>
  );
}
