import { fontFamily, fontHref } from "@/lib/fonts";
import type { Project } from "@/lib/types";

export function PageFrame({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const { brand } = project;
  const radius =
    brand.radius === "none" ? "0px" : brand.radius === "sm" ? "10px" : "18px";

  return (
    <div
      data-lp-root
      data-template={project.template}
      style={
        {
          "--lp-bg": brand.background,
          "--lp-fg": brand.foreground,
          "--lp-accent": brand.accent,
          "--lp-muted": brand.muted,
          "--lp-surface": brand.surface,
          "--lp-primary": brand.primary,
          "--lp-heading": fontFamily(brand.headingFont),
          "--lp-body": fontFamily(brand.bodyFont),
          "--lp-radius": radius,
          background: brand.background,
          color: brand.foreground,
          fontFamily: fontFamily(brand.bodyFont),
          minHeight: "100%",
        } as React.CSSProperties
      }
    >
      {fontHref([brand.headingFont, brand.bodyFont]).map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div className="lp-grain" aria-hidden />
      {children}
    </div>
  );
}

export function Heading({
  children,
  as: Tag = "h2",
  size = 56,
  style,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <Tag
      style={{
        fontFamily: "var(--lp-heading)",
        fontWeight: 500,
        letterSpacing: "-0.045em",
        lineHeight: 0.94,
        fontSize: `clamp(${Math.round(size * 0.5)}px, 6.2vw, ${size}px)`,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="lp-rule">{children}</p>;
}

export function CtaButton({
  href,
  children,
  full,
}: {
  href: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  if (!children) return null;
  return (
    <a href={href || "#form"} className={`lp-cta${full ? " full" : ""}`}>
      {children}
      <span aria-hidden>→</span>
    </a>
  );
}

const FIELD_LABELS = {
  firstName: "Primeiro nome",
  lastName: "Apelido",
  email: "Email",
  phone: "Telefone",
  business: "Tens um negócio?",
};

export function LeadForm({ project }: { project: Project }) {
  return (
    <form id="form" className="lp-form" onSubmit={(event) => event.preventDefault()}>
      {project.form.fields.map((field) => (
        <label key={field} className="lp-field">
          {FIELD_LABELS[field]}
          <input placeholder={FIELD_LABELS[field]} />
        </label>
      ))}
      <button type="submit" className="lp-cta full">
        {project.form.submitLabel || project.copy.cta}
        <span aria-hidden>→</span>
      </button>
      {project.form.note ? (
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.55, color: "var(--lp-muted)" }}>
          {project.form.note}
        </p>
      ) : null}
    </form>
  );
}

export function Shell({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div style={{ width: wide ? "min(1360px, calc(100% - 40px))" : "min(1120px, calc(100% - 40px))", margin: "0 auto" }}>
      {children}
    </div>
  );
}

export function LogoMark({ project, invert }: { project: Project; invert?: boolean }) {
  if (project.brand.logo) {
    return (
      <img
        src={project.brand.logo}
        alt={project.brand.name}
        style={{ height: 28, width: "auto", filter: invert ? "brightness(10)" : undefined }}
      />
    );
  }
  if (/^re\.?dna$/i.test(project.brand.name)) {
    return (
      <span className="lp-mark">
        RE<span>·</span>DNA
      </span>
    );
  }
  return (
    <span style={{ fontWeight: 700, letterSpacing: "0.16em", fontSize: 12, textTransform: "uppercase" }}>
      {project.brand.name}
    </span>
  );
}

export function TreatedPhoto({
  src,
  ratio = "4 / 5",
  height,
}: {
  src: string;
  ratio?: string;
  height?: number | string;
}) {
  return (
    <div className="lp-photo">
      <div className="lp-photo-shift" />
      <div className="lp-photo-media" style={{ aspectRatio: height ? undefined : ratio, height }}>
        <img src={src} alt="" />
        <div className="lp-photo-grade" />
      </div>
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];
  return (
    <div className="lp-marquee">
      <div className="lp-marquee-track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="lp-marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Faqs({ items }: { items: Array<{ q: string; a: string }> }) {
  if (items.length === 0) return null;
  return (
    <div className="lp-faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p style={{ margin: "12px 0 0", color: "var(--lp-muted)", lineHeight: 1.65, maxWidth: 680 }}>
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
