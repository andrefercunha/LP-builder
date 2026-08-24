"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { renderPage } from "@/components/templates/render";
import { PAGE_TYPES } from "@/lib/defaults";
import { downloadHtml, downloadJson } from "@/lib/export-html";
import { FONT_CATALOG } from "@/lib/fonts";
import { auditProject, qualityScore } from "@/lib/quality";
import { deleteProject, getProject, upsertProject } from "@/lib/store";
import type { FontId, PageCopy, Project } from "@/lib/types";
import { ColorField, ImageField, ListEditor, TextField } from "./fields";

const TABS = ["tipo", "marca", "fotos", "copy", "qualidade"] as const;
type Tab = (typeof TABS)[number];

export function Studio({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tab, setTab] = useState<Tab>("copy");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = getProject(id);
    if (!found) {
      router.replace("/");
      return;
    }
    setProject(found);
  }, [id, router]);

  const flags = useMemo(() => (project ? auditProject(project) : []), [project]);
  const score = qualityScore(flags);

  if (!project) {
    return <div className="p-8 text-mist">A carregar o briefing…</div>;
  }

  const current = project;

  function update(next: Project) {
    setProject(next);
    setSaved(false);
  }

  function patchCopy(patch: Partial<PageCopy>) {
    update({ ...current, copy: { ...current.copy, ...patch } });
  }

  function save() {
    upsertProject(current);
    setSaved(true);
  }

  function exportPage() {
    save();
    const root = document.querySelector("[data-preview-root]");
    const markup = root?.innerHTML ?? "";
    downloadHtml(markup, current);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)_300px]">
      <aside className="studio-scroll border-r border-line bg-[#0a0c0b] xl:h-screen xl:overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link href="/" className="text-[11px] uppercase tracking-[0.16em] text-mist">
            Estúdio LP
          </Link>
          <button
            type="button"
            onClick={save}
            className="border border-[#c4a574] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#c4a574]"
          >
            {saved ? "Guardado" : "Guardar"}
          </button>
        </div>
        <div className="px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist">{project.partner}</p>
          <input
            value={project.name}
            onChange={(event) => update({ ...project, name: event.target.value })}
            className="mt-2 w-full bg-transparent font-display text-[34px] leading-none text-paper outline-none"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto border-y border-line px-3 py-2">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] ${
                tab === item ? "bg-paper text-ink" : "text-mist"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-6 px-5 py-6">
          {tab === "tipo" ? <TypeTab project={project} onChange={update} /> : null}
          {tab === "marca" ? <BrandTab project={project} onChange={update} /> : null}
          {tab === "fotos" ? <PhotosTab project={project} onChange={update} /> : null}
          {tab === "copy" ? <CopyTab project={project} onChange={patchCopy} /> : null}
          {tab === "qualidade" ? <QualityList flags={flags} score={score} /> : null}
        </div>
      </aside>

      <section className="min-h-screen bg-[#141816] xl:h-screen xl:overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-mist">
          <span>Pré-visualização</span>
          <div className="flex gap-3">
            <Link href={`/preview/${project.id}`} target="_blank" onClick={save}>
              Abrir página
            </Link>
            <button type="button" onClick={() => downloadJson(project)}>
              JSON
            </button>
            <button type="button" onClick={exportPage}>
              HTML
            </button>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div
            data-preview-root
            className="origin-top overflow-hidden bg-white shadow-[0_30px_80px_#00000080]"
          >
            {renderPage(project)}
          </div>
        </div>
      </section>

      <aside className="hidden border-l border-line bg-[#0a0c0b] xl:block xl:h-screen xl:overflow-y-auto">
        <div className="border-b border-line px-5 py-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Qualidade</p>
          <p className="mt-2 font-display text-[56px] leading-none">{score}</p>
          <p className="mt-2 text-[13px] text-mist">
            Abaixo de 80 a página ainda parece rascunho. Não entregues.
          </p>
        </div>
        <QualityList flags={flags} score={score} compact />
        <div className="px-5 py-6">
          <button
            type="button"
            onClick={() => {
              if (confirm("Apagar esta página?")) {
                deleteProject(project.id);
                router.push("/");
              }
            }}
            className="text-[12px] text-mist underline"
          >
            Apagar página
          </button>
        </div>
      </aside>
    </div>
  );
}

function TypeTab({
  project,
  onChange,
}: {
  project: Project;
  onChange: (project: Project) => void;
}) {
  return (
    <div className="grid gap-4">
      <TextField
        label="Parceiro"
        value={project.partner}
        onChange={(partner) => onChange({ ...project, partner })}
      />
      {PAGE_TYPES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() =>
            onChange({
              ...project,
              type: item.id,
              template: item.template,
            })
          }
          className={`border px-4 py-4 text-left ${
            project.type === item.id ? "border-[#c4a574] bg-[#141816]" : "border-line"
          }`}
        >
          <p className="text-[15px]">{item.label}</p>
          <p className="mt-1 text-[13px] text-mist">{item.brief}</p>
        </button>
      ))}
    </div>
  );
}

function BrandTab({
  project,
  onChange,
}: {
  project: Project;
  onChange: (project: Project) => void;
}) {
  const brand = project.brand;
  function setBrand<K extends keyof typeof brand>(key: K, value: (typeof brand)[K]) {
    onChange({ ...project, brand: { ...brand, [key]: value } });
  }
  return (
    <div className="grid gap-4">
      <TextField label="Nome da marca" value={brand.name} onChange={(value) => setBrand("name", value)} />
      <ImageField label="Logótipo" value={brand.logo} onChange={(value) => setBrand("logo", value)} />
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Primária" value={brand.primary} onChange={(value) => setBrand("primary", value)} />
        <ColorField label="Acento" value={brand.accent} onChange={(value) => setBrand("accent", value)} />
        <ColorField label="Fundo" value={brand.background} onChange={(value) => setBrand("background", value)} />
        <ColorField label="Texto" value={brand.foreground} onChange={(value) => setBrand("foreground", value)} />
        <ColorField label="Secundário" value={brand.muted} onChange={(value) => setBrand("muted", value)} />
        <ColorField label="Superfície" value={brand.surface} onChange={(value) => setBrand("surface", value)} />
      </div>
      <label className="grid gap-2">
        <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Fonte dos títulos</span>
        <select
          value={brand.headingFont}
          onChange={(event) => setBrand("headingFont", event.target.value as FontId)}
          className="border border-line bg-ink px-3 py-2 text-[13px]"
        >
          {Object.entries(FONT_CATALOG).map(([id, font]) => (
            <option key={id} value={id}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Fonte do corpo</span>
        <select
          value={brand.bodyFont}
          onChange={(event) => setBrand("bodyFont", event.target.value as FontId)}
          className="border border-line bg-ink px-3 py-2 text-[13px]"
        >
          {Object.entries(FONT_CATALOG).map(([id, font]) => (
            <option key={id} value={id}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
      <p className="text-[12px] leading-5 text-mist">
        Evita Inter, roxo de template e a mesma fonte no título e no corpo. A página tem de parecer deste
        parceiro, não de um gerador.
      </p>
    </div>
  );
}

function PhotosTab({
  project,
  onChange,
}: {
  project: Project;
  onChange: (project: Project) => void;
}) {
  return (
    <div className="grid gap-5">
      <ImageField
        label="Herói"
        value={project.photos.hero}
        onChange={(hero) => onChange({ ...project, photos: { ...project.photos, hero } })}
      />
      <ImageField
        label="Retrato"
        value={project.photos.portrait}
        onChange={(portrait) => onChange({ ...project, photos: { ...project.photos, portrait } })}
      />
      <p className="text-[12px] leading-5 text-mist">
        Usa fotos reais do parceiro. Stock sorridente e escritórios de stock são o caminho mais rápido para
        uma página genérica.
      </p>
    </div>
  );
}

function CopyTab({
  project,
  onChange,
}: {
  project: Project;
  onChange: (patch: Partial<PageCopy>) => void;
}) {
  const copy = project.copy;
  return (
    <div className="grid gap-5">
      <TextField
        label="Eyebrow"
        hint="Chamada de audiência ou ideia grande. Uma linha."
        value={copy.eyebrow}
        onChange={(eyebrow) => onChange({ eyebrow })}
      />
      <TextField
        label="Headline"
        hint="Promessa clara. Evita slogans e travessões longos."
        value={copy.headline}
        onChange={(headline) => onChange({ headline })}
        multiline
        rows={3}
      />
      <TextField
        label="Subheadline"
        value={copy.subheadline}
        onChange={(subheadline) => onChange({ subheadline })}
        multiline
      />
      <TextField label="CTA" value={copy.cta} onChange={(cta) => onChange({ cta })} />
      <TextField label="Ligação do CTA" value={copy.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      <TextField
        label="CTA secundário"
        value={copy.ctaSecondary ?? ""}
        onChange={(ctaSecondary) => onChange({ ctaSecondary })}
      />
      <TextField
        label="Título do reconhecimento"
        value={copy.leadTitle}
        onChange={(leadTitle) => onChange({ leadTitle })}
      />
      <ListEditor
        label="Problemas"
        hint="5 a 8 frases na linguagem do cliente. Spray, não cartões."
        values={copy.problems}
        onChange={(problems) => onChange({ problems })}
        min={5}
      />
      <TextField label="Título do corpo" value={copy.bodyTitle} onChange={(bodyTitle) => onChange({ bodyTitle })} />
      <TextField
        label="Corpo / história"
        hint="Transformação e argumento. Sem autobiografia irrelevante."
        value={copy.body}
        onChange={(body) => onChange({ body })}
        multiline
        rows={7}
      />
      <TextField
        label="Título do mecanismo"
        value={copy.mechanismTitle}
        onChange={(mechanismTitle) => onChange({ mechanismTitle })}
      />
      <div className="grid gap-3">
        <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Passos do mecanismo</span>
        {copy.mechanismSteps.map((step, index) => (
          <div key={index} className="grid gap-2 border border-line p-3">
            <input
              value={step.title}
              placeholder="Nome do passo"
              onChange={(event) => {
                const mechanismSteps = [...copy.mechanismSteps];
                mechanismSteps[index] = { ...step, title: event.target.value };
                onChange({ mechanismSteps });
              }}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
            <textarea
              value={step.text}
              placeholder="O que acontece neste passo"
              onChange={(event) => {
                const mechanismSteps = [...copy.mechanismSteps];
                mechanismSteps[index] = { ...step, text: event.target.value };
                onChange({ mechanismSteps });
              }}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
              rows={3}
            />
          </div>
        ))}
      </div>
      <TextField label="Título da oferta" value={copy.offerTitle} onChange={(offerTitle) => onChange({ offerTitle })} />
      <TextField label="Nome da oferta" value={copy.offerName} onChange={(offerName) => onChange({ offerName })} />
      <ListEditor
        label="O que inclui"
        values={copy.offerBullets}
        onChange={(offerBullets) => onChange({ offerBullets })}
      />
      <ListEditor label="Bónus" values={copy.bonuses} onChange={(bonuses) => onChange({ bonuses })} min={0} />
      <div className="grid gap-3">
        <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Prova autorizada</span>
        {copy.proof.map((item, index) => (
          <div key={index} className="grid gap-2 border border-line p-3">
            <textarea
              value={item.quote}
              placeholder="Citação"
              onChange={(event) => {
                const proof = [...copy.proof];
                proof[index] = { ...item, quote: event.target.value };
                onChange({ proof });
              }}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
              rows={3}
            />
            <input
              value={item.name}
              placeholder="Nome"
              onChange={(event) => {
                const proof = [...copy.proof];
                proof[index] = { ...item, name: event.target.value };
                onChange({ proof });
              }}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
            <input
              value={item.role ?? ""}
              placeholder="Contexto"
              onChange={(event) => {
                const proof = [...copy.proof];
                proof[index] = { ...item, role: event.target.value };
                onChange({ proof });
              }}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ proof: [...copy.proof, { quote: "", name: "" }] })}
          className="justify-self-start text-[12px] text-[#c4a574]"
        >
          + testemunho
        </button>
      </div>
      <TextField
        label="Título da garantia"
        value={copy.guaranteeTitle}
        onChange={(guaranteeTitle) => onChange({ guaranteeTitle })}
      />
      <TextField
        label="Garantia / risco"
        hint="Só o que for verdade. Sem resultados garantidos inventados."
        value={copy.guarantee}
        onChange={(guarantee) => onChange({ guarantee })}
        multiline
      />
      <ListEditor label="Não é para / não vais receber" values={copy.notFor} onChange={(notFor) => onChange({ notFor })} />
      <ListEditor label="Levas / vamos trabalhar" values={copy.willGet} onChange={(willGet) => onChange({ willGet })} />
      <div className="grid gap-3">
        <span className="text-[11px] uppercase tracking-[0.16em] text-mist">FAQ</span>
        {copy.faqs.map((item, index) => (
          <div key={index} className="grid gap-2 border border-line p-3">
            <input
              value={item.q}
              placeholder="Pergunta"
              onChange={(event) => {
                const faqs = [...copy.faqs];
                faqs[index] = { ...item, q: event.target.value };
                onChange({ faqs });
              }}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
            <textarea
              value={item.a}
              placeholder="Resposta"
              onChange={(event) => {
                const faqs = [...copy.faqs];
                faqs[index] = { ...item, a: event.target.value };
                onChange({ faqs });
              }}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
              rows={3}
            />
          </div>
        ))}
      </div>
      <TextField
        label="O que acontece a seguir"
        value={copy.nextStep}
        onChange={(nextStep) => onChange({ nextStep })}
        multiline
      />
      <TextField label="Legal / disclaimer" value={copy.legal} onChange={(legal) => onChange({ legal })} multiline />
    </div>
  );
}

function QualityList({
  flags,
  score,
  compact,
}: {
  flags: ReturnType<typeof auditProject>;
  score: number;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "grid gap-0" : "grid gap-3"}>
      {!compact ? (
        <p className="font-display text-[48px] leading-none">
          {score}
          <span className="ml-2 text-[16px] text-mist">/ 100</span>
        </p>
      ) : null}
      {flags.map((flag) => (
        <div key={flag.id} className="border-b border-line px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px]">
              {flag.letter ? <span className="mr-2 text-mist">{flag.letter}</span> : null}
              {flag.title}
            </p>
            <span
              className={`text-[10px] uppercase tracking-[0.14em] ${
                flag.status === "pass"
                  ? "text-emerald-400"
                  : flag.status === "warn"
                    ? "text-[#c4a574]"
                    : "text-red-400"
              }`}
            >
              {flag.status === "pass" ? "ok" : flag.status === "warn" ? "rever" : "falha"}
            </span>
          </div>
          <p className="mt-1 text-[12px] leading-5 text-mist">{flag.detail}</p>
        </div>
      ))}
    </div>
  );
}

