"use client";

import { useMemo, useState } from "react";
import {
  createFromWizard,
  emptyBrief,
  looksForType,
  uniqueBrandSources,
  type PageBrief,
} from "@/lib/creation";
import { DEFAULT_CTA, LOOKS, PAGE_TYPES } from "@/lib/defaults";
import type { PageType, Project, TemplateId } from "@/lib/types";

type Step = "tipo" | "look" | "brief";

export function CreateWizard({
  projects,
  initialType,
  initialSourceId,
  onClose,
  onCreate,
}: {
  projects: Project[];
  initialType?: PageType;
  initialSourceId?: string;
  onClose: () => void;
  onCreate: (project: Project) => void;
}) {
  const sources = useMemo(() => uniqueBrandSources(projects), [projects]);
  const [step, setStep] = useState<Step>(initialType ? "look" : "tipo");
  const [type, setType] = useState<PageType | undefined>(initialType);
  const [template, setTemplate] = useState<TemplateId | undefined>(
    initialType ? looksForType(initialType)[0]?.id : undefined,
  );
  const [sourceId, setSourceId] = useState(initialSourceId ?? "");
  const [name, setName] = useState("");
  const [partner, setPartner] = useState(() => {
    const source = projects.find((item) => item.id === initialSourceId);
    return source?.partner ?? "";
  });
  const [brief, setBrief] = useState<PageBrief>(emptyBrief());

  const looks = type ? looksForType(type) : [];
  const typeMeta = PAGE_TYPES.find((item) => item.id === type);
  const lookMeta = LOOKS.find((item) => item.id === template);
  const source = sources.find((item) => item.id === sourceId);

  function patchBrief<K extends keyof PageBrief>(key: K, value: PageBrief[K]) {
    setBrief((current) => ({ ...current, [key]: value }));
  }

  function finish() {
    if (!type || !template) return;
    onCreate(
      createFromWizard({
        type,
        template,
        name,
        partner: source?.partner ?? partner,
        brief: {
          ...brief,
          cta: brief.cta.trim() || DEFAULT_CTA[type],
        },
        source,
      }),
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0c0f0ecc] p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-line bg-[#0a0c0b]">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist">
            Nova página
            {typeMeta ? ` · ${typeMeta.label}` : ""}
            {lookMeta ? ` · ${lookMeta.label}` : ""}
          </p>
          <button type="button" onClick={onClose} className="text-[12px] text-mist underline">
            Cancelar
          </button>
        </div>

        <div className="flex gap-4 border-b border-line px-6 py-3 text-[11px] uppercase tracking-[0.14em]">
          {(
            [
              ["tipo", "1 · Tipo"],
              ["look", "2 · Linguagem"],
              ["brief", "3 · Briefing"],
            ] as const
          ).map(([id, label]) => (
            <span key={id} className={step === id ? "text-paper" : "text-mist"}>
              {label}
            </span>
          ))}
        </div>

        <div className="grid gap-4 px-6 py-6">
          {step === "tipo" ? (
            PAGE_TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setType(item.id);
                  setTemplate(looksForType(item.id)[0]?.id);
                  setStep("look");
                }}
                className="border border-line px-5 py-5 text-left hover:border-[#c4a574]"
              >
                <p className="font-display text-[32px] leading-none">{item.label}</p>
                <p className="mt-3 text-[13px] leading-6 text-mist">{item.brief}</p>
              </button>
            ))
          ) : null}

          {step === "look" && type ? (
            <>
              <p className="text-[13px] leading-6 text-mist">
                A linguagem decide o esqueleto. A copy e as fotos é que fazem a página parecer deste parceiro.
              </p>
              {looks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTemplate(item.id);
                    setStep("brief");
                  }}
                  className={`border px-5 py-4 text-left ${
                    template === item.id ? "border-[#c4a574] bg-[#141816]" : "border-line hover:border-[#c4a574]"
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#c4a574]">{item.label}</p>
                  <p className="mt-2 text-[15px]">{item.brief}</p>
                </button>
              ))}
              <button type="button" onClick={() => setStep("tipo")} className="justify-self-start text-[12px] text-mist">
                ← Tipo
              </button>
            </>
          ) : null}

          {step === "brief" && type && template ? (
            <>
              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Nome da página</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={brief.offer || `Nova ${typeMeta?.label.toLowerCase()}`}
                  className="border border-line bg-ink px-3 py-2.5 text-[14px] outline-none focus:border-[#c4a574]"
                />
              </label>

              <div className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Marca</span>
                <select
                  value={sourceId}
                  onChange={(event) => {
                    const next = event.target.value;
                    setSourceId(next);
                    const found = sources.find((item) => item.id === next);
                    if (found) setPartner(found.partner);
                  }}
                  className="border border-line bg-ink px-3 py-2.5 text-[13px]"
                >
                  <option value="">Marca nova</option>
                  {sources.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.brand.name} · {item.partner}
                    </option>
                  ))}
                </select>
                {source ? (
                  <p className="text-[12px] text-mist">
                    Traz cores, fontes e fotos de {source.brand.name}. A copy começa vazia — ou do briefing abaixo.
                  </p>
                ) : (
                  <input
                    value={partner}
                    onChange={(event) => setPartner(event.target.value)}
                    placeholder="Nome do parceiro"
                    className="border border-line bg-ink px-3 py-2.5 text-[14px] outline-none focus:border-[#c4a574]"
                  />
                )}
              </div>

              <p className="pt-2 text-[13px] leading-6 text-mist">
                Cinco linhas chegam para a página deixar de estar em branco. O resto faz-se no estúdio, só nos
                campos que este look usa.
              </p>

              <BriefInput label="Para quem é" value={brief.audience} onChange={(value) => patchBrief("audience", value)} />
              <BriefInput
                label="Headline / resultado"
                value={brief.outcome}
                onChange={(value) => patchBrief("outcome", value)}
                multiline
              />
              <BriefInput
                label={type === "thanks" ? "O que acabou de acontecer" : "Nome da oferta / sessão"}
                value={brief.offer}
                onChange={(value) => patchBrief("offer", value)}
              />
              <BriefInput
                label="O que acontece a seguir"
                value={brief.nextStep}
                onChange={(value) => patchBrief("nextStep", value)}
                multiline
              />
              <BriefInput
                label="Texto do botão"
                value={brief.cta}
                onChange={(value) => patchBrief("cta", value)}
                placeholder={DEFAULT_CTA[type]}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button type="button" onClick={() => setStep("look")} className="text-[12px] text-mist">
                  ← Linguagem
                </button>
                <button
                  type="button"
                  onClick={finish}
                  className="border border-[#c4a574] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#c4a574]"
                >
                  Abrir no estúdio
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BriefInput({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          rows={3}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="resize-y border border-line bg-ink px-3 py-2.5 text-[14px] outline-none focus:border-[#c4a574]"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="border border-line bg-ink px-3 py-2.5 text-[14px] outline-none focus:border-[#c4a574]"
        />
      )}
    </label>
  );
}
