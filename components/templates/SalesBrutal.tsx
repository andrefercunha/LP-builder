import type { Project } from "@/lib/types";
import { Faqs, Heading, LeadForm, LogoMark, PageFrame } from "./PageFrame";

export function SalesBrutal({ project }: { project: Project }) {
  const { copy, photos } = project;
  const problems = copy.problems.filter(Boolean);
  const steps = copy.mechanismSteps.filter((step) => step.title);
  const bullets = copy.offerBullets.filter(Boolean);
  const proof = copy.proof.filter((item) => item.quote);
  const faqs = copy.faqs.filter((item) => item.q);

  return (
    <PageFrame project={project}>
      <div style={{ background: "#090909", color: "#f3f3f3", minHeight: "100vh" }}>
        <div
          style={{
            padding: "22px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "4px solid var(--lp-accent)",
          }}
        >
          <LogoMark project={project} />
          <a href={copy.ctaHref || "#form"} style={{ color: "var(--lp-accent)", textDecoration: "none", fontWeight: 700 }}>
            {copy.cta}
          </a>
        </div>

        <div style={{ padding: "48px 28px 64px", maxWidth: 1100 }}>
          <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 12, color: "var(--lp-accent)" }}>
            {copy.eyebrow}
          </p>
          <Heading as="h1" size={104} style={{ marginTop: 16, textTransform: "uppercase", letterSpacing: "-0.05em" }}>
            {copy.headline}
          </Heading>
          <p style={{ maxWidth: 640, fontSize: 20, lineHeight: 1.5, marginTop: 24 }}>{copy.subheadline}</p>
          <a
            href={copy.ctaHref || "#form"}
            style={{
              display: "inline-block",
              marginTop: 32,
              background: "var(--lp-accent)",
              color: "#090909",
              textDecoration: "none",
              padding: "18px 28px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {copy.cta}
          </a>
        </div>

        {photos.hero ? (
          <img
            src={photos.hero}
            alt=""
            style={{ width: "100%", height: 360, objectFit: "cover", filter: "grayscale(1) contrast(1.3)", display: "block" }}
          />
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="lp-split">
          <section style={{ padding: "48px 28px", borderRight: "4px solid #f3f3f3" }}>
            <h2 style={{ margin: "0 0 20px", textTransform: "uppercase", fontSize: 22 }}>{copy.leadTitle}</h2>
            {problems.map((item, index) => (
              <p key={item} style={{ margin: "0 0 14px", fontSize: 18, lineHeight: 1.35 }}>
                {index + 1}. {item}
              </p>
            ))}
          </section>
          <section style={{ padding: "48px 28px" }}>
            <h2 style={{ margin: "0 0 20px", textTransform: "uppercase", fontSize: 22 }}>{copy.bodyTitle}</h2>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: "#c8c8c8" }}>{copy.body}</p>
          </section>
        </div>

        {steps.length > 0 ? (
          <section>
            {steps.map((step, index) => (
              <div
                key={step.title}
                style={{
                  padding: "28px",
                  borderTop: "4px solid #f3f3f3",
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 20,
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 800, color: "var(--lp-accent)" }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 style={{ margin: "0 0 8px", textTransform: "uppercase", fontSize: 24 }}>{step.title}</h3>
                  <p style={{ margin: 0, color: "#c8c8c8" }}>{step.text}</p>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        <section style={{ padding: "48px 28px", background: "var(--lp-accent)", color: "#090909" }}>
          <p style={{ margin: 0, textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.12em" }}>
            {copy.offerName}
          </p>
          <ul style={{ padding: "20px 0 0 18px", margin: 0, fontSize: 20, lineHeight: 1.6 }}>
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {proof[0] ? (
          <section style={{ padding: "56px 28px" }}>
            <p style={{ margin: 0, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.15, maxWidth: 900 }}>
              {proof[0].quote}
            </p>
            <p style={{ marginTop: 16, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12 }}>
              {proof[0].name} {proof[0].role ? `/ ${proof[0].role}` : ""}
            </p>
          </section>
        ) : null}

        {copy.guarantee ? (
          <section style={{ padding: "0 28px 48px" }}>
            <p style={{ margin: 0, border: "4px solid var(--lp-accent)", padding: 24, fontSize: 20 }}>
              {copy.guarantee}
            </p>
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section style={{ padding: "0 28px 48px" }}>
            <Faqs items={faqs} />
          </section>
        ) : null}

        <section id="form" style={{ padding: "0 28px 80px", maxWidth: 560 }}>
          <Heading as="h2" size={48}>
            {copy.nextStep}
          </Heading>
          <div style={{ marginTop: 24 }}>
            <LeadForm project={project} />
          </div>
          <p style={{ fontSize: 12, color: "#888" }}>{copy.legal}</p>
        </section>
      </div>
    </PageFrame>
  );
}
