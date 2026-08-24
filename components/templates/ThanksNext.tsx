import type { Project } from "@/lib/types";
import { CtaButton, Eyebrow, Heading, LogoMark, PageFrame, Shell } from "./PageFrame";

export function ThanksNext({ project }: { project: Project }) {
  const items = project.copy.offerBullets.filter(Boolean);

  return (
    <PageFrame project={project}>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--lp-primary)",
          color: "var(--lp-fg)",
          display: "grid",
          alignContent: "center",
        }}
      >
        <Shell>
          <div style={{ padding: "72px 0", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ marginBottom: 36, display: "flex", justifyContent: "center" }}>
              <LogoMark project={project} />
            </div>
            <Eyebrow>{project.copy.eyebrow || "Confirmado"}</Eyebrow>
            <Heading as="h1" size={78}>
              {project.copy.headline}
            </Heading>
            <p
              style={{
                margin: "24px auto 0",
                maxWidth: 560,
                color: "var(--lp-muted)",
                fontSize: 18,
                lineHeight: 1.6,
              }}
            >
              {project.copy.subheadline}
            </p>
            <div style={{ marginTop: 32 }}>
              <CtaButton href={project.copy.ctaHref}>{project.copy.cta}</CtaButton>
            </div>
            {items.length > 0 ? (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "48px auto 0",
                  maxWidth: 460,
                  textAlign: "left",
                  display: "grid",
                  gap: 14,
                }}
              >
                {items.map((item) => (
                  <li
                    key={item}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid color-mix(in srgb, var(--lp-fg) 14%, transparent)",
                    }}
                  >
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
