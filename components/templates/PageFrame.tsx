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
    brand.radius === "none" ? "0px" : brand.radius === "sm" ? "8px" : "16px";

  return (
    <div
      data-lp-root
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
        letterSpacing: "-0.04em",
        lineHeight: 0.95,
        fontSize: `clamp(${Math.round(size * 0.52)}px, 6vw, ${size}px)`,
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
  return (
    <p
      style={{
        margin: "0 0 18px",
        color: "var(--lp-accent)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
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
    <a
      href={href || "#form"}
      style={{
        display: full ? "block" : "inline-block",
        textAlign: "center",
        background: "var(--lp-accent)",
        color: "var(--lp-primary)",
        textDecoration: "none",
        padding: "16px 28px",
        borderRadius: "var(--lp-radius)",
        fontWeight: 650,
        letterSpacing: "0.02em",
        fontSize: 15,
      }}
    >
      {children}
    </a>
  );
}

export function FieldInput({ label }: { label: string }) {
  return (
    <label style={{ display: "grid", gap: 6, fontSize: 12, color: "var(--lp-muted)" }}>
      {label}
      <input
        placeholder={label}
        style={{
          width: "100%",
          border: "1px solid color-mix(in srgb, var(--lp-fg) 18%, transparent)",
          background: "color-mix(in srgb, var(--lp-bg) 55%, var(--lp-surface))",
          color: "var(--lp-fg)",
          padding: "12px 14px",
          borderRadius: "var(--lp-radius)",
          outline: "none",
        }}
      />
    </label>
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
    <form
      id="form"
      onSubmit={(event) => event.preventDefault()}
      style={{
        display: "grid",
        gap: 12,
        background: "var(--lp-surface)",
        padding: 22,
        borderRadius: "var(--lp-radius)",
        border: "1px solid color-mix(in srgb, var(--lp-fg) 10%, transparent)",
      }}
    >
      {project.form.fields.map((field) => (
        <FieldInput key={field} label={FIELD_LABELS[field]} />
      ))}
      <button
        type="submit"
        style={{
          border: 0,
          background: "var(--lp-accent)",
          color: "var(--lp-primary)",
          padding: "15px 18px",
          borderRadius: "var(--lp-radius)",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {project.form.submitLabel || project.copy.cta}
      </button>
      {project.form.note ? (
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, color: "var(--lp-muted)" }}>
          {project.form.note}
        </p>
      ) : null}
    </form>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "min(1120px, calc(100% - 40px))", margin: "0 auto" }}>
      {children}
    </div>
  );
}

export function LogoMark({ project }: { project: Project }) {
  if (project.brand.logo) {
    return (
      <img
        src={project.brand.logo}
        alt={project.brand.name}
        style={{ height: 28, width: "auto" }}
      />
    );
  }
  return (
    <span style={{ fontWeight: 700, letterSpacing: "0.14em", fontSize: 12 }}>
      {project.brand.name}
    </span>
  );
}
