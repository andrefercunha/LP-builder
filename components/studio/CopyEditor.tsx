"use client";

import { parseBriefMarkdown } from "@/lib/brief-md";
import { applyBrief, creationFor, emptyBrief, fixedCopyToPageCopy, isCopyStarted, type PageBrief } from "@/lib/creation";
import { DEFAULT_CTA } from "@/lib/defaults";
import type { FormConfig, PageCopy, Project } from "@/lib/types";
import { useState } from "react";
import { ListEditor, TextField } from "./fields";

const FORM_OPTIONS: Array<{ id: FormConfig["fields"][number]; label: string }> = [
  { id: "firstName", label: "Primeiro nome" },
  { id: "lastName", label: "Apelido" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Telefone" },
  { id: "business", label: "Tens um negócio?" },
];

export function CopyEditor({
  project,
  onCopy,
  onForm,
}: {
  project: Project;
  onCopy: (patch: Partial<PageCopy>) => void;
  onForm: (form: FormConfig) => void;
}) {
  const spec = creationFor(project.template);
  const copy = project.copy;
  const [briefOpen, setBriefOpen] = useState(!isCopyStarted(copy));
  const [brief, setBrief] = useState<PageBrief>(emptyBrief());

  function apply() {
    const next = applyBrief(copy, {
      ...brief,
      cta: brief.cta.trim() || copy.cta || DEFAULT_CTA[project.type],
    });
    onCopy(next);
    if (brief.cta.trim() || !project.form.submitLabel) {
      onForm({ ...project.form, submitLabel: next.cta || project.form.submitLabel });
    }
    setBriefOpen(false);
  }

  return (
    <div className="grid gap-5">
      <div className="border border-line p-4">
        <button
          type="button"
          onClick={() => setBriefOpen((open) => !open)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#c4a574]">Briefing rápido</span>
          <span className="text-[12px] text-mist">{briefOpen ? "fechar" : "abrir"}</span>
        </button>
        <p className="mt-2 text-[12px] leading-5 text-mist">
          {spec.intro} O copy entra como .md. Estes campos são só para afinar o que o ficheiro já trouxe.
        </p>
        <label className="mt-3 cursor-pointer text-[12px] text-[#c4a574]">
          Substituir por outro .md
          <input
            type="file"
            accept=".md,text/markdown,text/plain"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const parsed = parseBriefMarkdown(await file.text());
              onCopy(fixedCopyToPageCopy(parsed.copy, copy));
            }}
          />
        </label>
        {briefOpen ? (
          <div className="mt-4 grid gap-3">
            <input
              value={brief.audience}
              placeholder="Para quem é"
              onChange={(event) => setBrief({ ...brief, audience: event.target.value })}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
            <textarea
              value={brief.outcome}
              placeholder="Headline / resultado"
              rows={2}
              onChange={(event) => setBrief({ ...brief, outcome: event.target.value })}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
            <input
              value={brief.offer}
              placeholder="Nome da oferta / sessão"
              onChange={(event) => setBrief({ ...brief, offer: event.target.value })}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
            <textarea
              value={brief.nextStep}
              placeholder="O que acontece a seguir"
              rows={2}
              onChange={(event) => setBrief({ ...brief, nextStep: event.target.value })}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
            <input
              value={brief.cta}
              placeholder={DEFAULT_CTA[project.type]}
              onChange={(event) => setBrief({ ...brief, cta: event.target.value })}
              className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
            />
            <button
              type="button"
              onClick={apply}
              className="justify-self-start text-[12px] text-[#c4a574]"
            >
              Preencher a página
            </button>
          </div>
        ) : null}
      </div>

      {spec.fields.map((field) => {
        const value = copy[field.id];
        if (field.kind === "text" || field.kind === "multiline") {
          return (
            <TextField
              key={field.id}
              label={field.label}
              hint={field.hint}
              value={typeof value === "string" ? value : ""}
              multiline={field.kind === "multiline"}
              rows={field.rows}
              onChange={(next) => onCopy({ [field.id]: next })}
            />
          );
        }
        if (field.kind === "list") {
          return (
            <ListEditor
              key={field.id}
              label={field.label}
              hint={field.hint}
              values={Array.isArray(value) ? (value as string[]) : []}
              min={field.min ?? 3}
              onChange={(next) => onCopy({ [field.id]: next })}
            />
          );
        }
        if (field.kind === "steps") {
          return (
            <div key={field.id} className="grid gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{field.label}</span>
              {field.hint ? <p className="text-[12px] text-mist/80">{field.hint}</p> : null}
              {copy.mechanismSteps.map((step, index) => (
                <div key={index} className="grid gap-2 border border-line p-3">
                  <input
                    value={step.title}
                    placeholder="Nome do passo"
                    onChange={(event) => {
                      const mechanismSteps = [...copy.mechanismSteps];
                      mechanismSteps[index] = { ...step, title: event.target.value };
                      onCopy({ mechanismSteps });
                    }}
                    className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
                  />
                  <textarea
                    value={step.text}
                    placeholder="O que acontece neste passo"
                    onChange={(event) => {
                      const mechanismSteps = [...copy.mechanismSteps];
                      mechanismSteps[index] = { ...step, text: event.target.value };
                      onCopy({ mechanismSteps });
                    }}
                    className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
                    rows={3}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => onCopy({ mechanismSteps: [...copy.mechanismSteps, { title: "", text: "" }] })}
                className="justify-self-start text-[12px] text-[#c4a574]"
              >
                + passo
              </button>
            </div>
          );
        }
        if (field.kind === "proof") {
          return (
            <div key={field.id} className="grid gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{field.label}</span>
              {field.hint ? <p className="text-[12px] text-mist/80">{field.hint}</p> : null}
              {copy.proof.map((item, index) => (
                <div key={index} className="grid gap-2 border border-line p-3">
                  <textarea
                    value={item.quote}
                    placeholder="Citação"
                    onChange={(event) => {
                      const proof = [...copy.proof];
                      proof[index] = { ...item, quote: event.target.value };
                      onCopy({ proof });
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
                      onCopy({ proof });
                    }}
                    className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
                  />
                  <input
                    value={item.role ?? ""}
                    placeholder="Contexto"
                    onChange={(event) => {
                      const proof = [...copy.proof];
                      proof[index] = { ...item, role: event.target.value };
                      onCopy({ proof });
                    }}
                    className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => onCopy({ proof: [...copy.proof, { quote: "", name: "" }] })}
                className="justify-self-start text-[12px] text-[#c4a574]"
              >
                + testemunho
              </button>
            </div>
          );
        }
        return (
          <div key={field.id} className="grid gap-3">
            <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{field.label}</span>
            {copy.faqs.map((item, index) => (
              <div key={index} className="grid gap-2 border border-line p-3">
                <input
                  value={item.q}
                  placeholder="Pergunta"
                  onChange={(event) => {
                    const faqs = [...copy.faqs];
                    faqs[index] = { ...item, q: event.target.value };
                    onCopy({ faqs });
                  }}
                  className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
                />
                <textarea
                  value={item.a}
                  placeholder="Resposta"
                  onChange={(event) => {
                    const faqs = [...copy.faqs];
                    faqs[index] = { ...item, a: event.target.value };
                    onCopy({ faqs });
                  }}
                  className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
                  rows={3}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => onCopy({ faqs: [...copy.faqs, { q: "", a: "" }] })}
              className="justify-self-start text-[12px] text-[#c4a574]"
            >
              + pergunta
            </button>
          </div>
        );
      })}

      {spec.wantsForm ? (
        <div className="grid gap-3 border-t border-line pt-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Formulário</p>
          <div className="grid gap-2">
            {FORM_OPTIONS.map((option) => {
              const checked = project.form.fields.includes(option.id);
              return (
                <label key={option.id} className="flex items-center gap-2 text-[13px]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const fields = checked
                        ? project.form.fields.filter((item) => item !== option.id)
                        : [...project.form.fields, option.id];
                      onForm({ ...project.form, fields });
                    }}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
          <TextField
            label="Texto do botão do formulário"
            value={project.form.submitLabel}
            onChange={(submitLabel) => onForm({ ...project.form, submitLabel })}
          />
          <TextField
            label="Nota por baixo do formulário"
            value={project.form.note}
            onChange={(note) => onForm({ ...project.form, note })}
            multiline
            rows={2}
          />
        </div>
      ) : null}
    </div>
  );
}
