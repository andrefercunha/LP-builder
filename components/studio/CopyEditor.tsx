"use client";

import { parseBriefMarkdown, fixedCopyToMarkdown } from "@/lib/brief-md";
import { creationFor, fixedCopyToPageCopy, pageCopyToFixed } from "@/lib/creation";
import type { FormConfig, PageCopy, Project } from "@/lib/types";
import { useEffect, useState } from "react";
import { TextField } from "./fields";

const FORM_OPTIONS: Array<{ id: FormConfig["fields"][number]; label: string }> = [
  { id: "firstName", label: "Primeiro nome" },
  { id: "lastName", label: "Apelido" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Telefone" },
  { id: "business", label: "Tens um negócio?" },
];

export function CopyEditor({
  project,
  onApply,
  onForm,
}: {
  project: Project;
  onApply: (next: { name?: string; partner?: string; copy: PageCopy }) => void;
  onForm: (form: FormConfig) => void;
}) {
  const spec = creationFor(project.template);
  const [markdown, setMarkdown] = useState(() => documentFrom(project));

  useEffect(() => {
    setMarkdown(documentFrom(project));
  }, [project.id]);

  function applyText(text: string) {
    setMarkdown(text);
    const parsed = parseBriefMarkdown(text);
    onApply({
      name: parsed.name,
      partner: parsed.partner,
      copy: fixedCopyToPageCopy(parsed.copy, project.copy),
    });
  }

  return (
    <div className="grid gap-5">
      <p className="text-[12px] leading-5 text-mist">{spec.intro} O copy é este ficheiro. Não se preenche campo a campo.</p>

      <label className="grid cursor-pointer place-items-center border border-dashed border-line px-4 py-6 text-center text-[13px] text-mist hover:border-[#c4a574]">
        Largar outro .md para substituir
        <input
          type="file"
          accept=".md,text/markdown,text/plain"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) applyText(await file.text());
          }}
        />
      </label>

      <textarea
        value={markdown}
        onChange={(event) => applyText(event.target.value)}
        rows={28}
        spellCheck
        className="w-full resize-y border border-line bg-ink px-3 py-3 font-mono text-[13px] leading-6 outline-none focus:border-[#c4a574]"
      />

      {spec.wantsForm ? (
        <div className="grid gap-3 border-t border-line pt-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Formulário da página</p>
          <p className="text-[12px] text-mist">Isto não é copy. São os campos do formulário nesta linguagem.</p>
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

function documentFrom(project: Project) {
  return fixedCopyToMarkdown(pageCopyToFixed(project.copy), {
    name: project.name,
    partner: project.partner,
  });
}
