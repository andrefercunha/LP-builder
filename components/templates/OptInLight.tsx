import type { Project } from "@/lib/types";
import { Heading, LeadForm, LogoMark, PageFrame } from "./PageFrame";

export function OptInLight({ project }: { project: Project }) {
  const { copy, photos } = project;
  const proof = copy.proof.filter((item) => item.quote);
  const scene = photos.hero || photos.portrait;

  return (
    <PageFrame project={project}>
      <div
        className="lp-split"
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "minmax(280px, 1fr) minmax(320px, 520px)",
          background: "var(--lp-bg)",
        }}
      >
        <div style={{ position: "relative", minHeight: 420, background: "var(--lp-primary)" }}>
          {scene ? (
            <img
              src={scene}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "100vh" }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              left: 28,
              bottom: 28,
              color: "#fff",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontSize: 11,
            }}
          >
            {copy.eyebrow}
          </div>
        </div>

        <div style={{ padding: "36px 36px 48px", display: "grid", alignContent: "center" }}>
          <LogoMark project={project} />
          <p
            style={{
              margin: "36px 0 14px",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--lp-accent)",
            }}
          >
            {copy.audience}
          </p>
          <Heading as="h1" size={58}>
            {copy.headline}
          </Heading>
          <p style={{ margin: "18px 0 0", color: "var(--lp-muted)", lineHeight: 1.65, fontSize: 16 }}>
            {copy.subheadline}
          </p>
          {proof[0] ? (
            <p style={{ margin: "22px 0 0", fontSize: 15, fontStyle: "italic", color: "var(--lp-fg)" }}>
              “{proof[0].quote}” — {proof[0].name}
            </p>
          ) : null}
          <div style={{ marginTop: 28 }}>
            <LeadForm project={project} />
          </div>
          <p style={{ fontSize: 11, color: "var(--lp-muted)" }}>{copy.legal}</p>
        </div>
      </div>
    </PageFrame>
  );
}
