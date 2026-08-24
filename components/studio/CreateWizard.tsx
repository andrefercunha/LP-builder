"use client";

import { useMemo, useState } from "react";
import { BRIEF_TEMPLATE, parseBriefMarkdown } from "@/lib/brief-md";
import { createFromFixedCopy, uniqueBrandSources } from "@/lib/creation";
import { emptyBrand, PAGE_TYPES } from "@/lib/defaults";
import { describeLook, generateLook } from "@/lib/look";
import { canRecommend, recommendPage } from "@/lib/recommend";
import type { PageType, Project } from "@/lib/types";

export function CreateWizard({
  projects,
  initialSourceId,
  initialMarkdown,
  onClose,
  onCreate,
}: {
  projects: Project[];
  initialSourceId?: string;
  initialMarkdown?: string;
  onClose: () => void;
  onCreate: (project: Project) => void;
}) {
  const sources = useMemo(() => uniqueBrandSources(projects), [projects]);
  const [sourceId, setSourceId] = useState(initialSourceId ?? "");
  const [markdown, setMarkdown] = useState(initialMarkdown ?? "");
  const [fileName, setFileName] = useState(initialMarkdown ? "copy.md" : "");
  const [typeOverride, setTypeOverride] = useState<PageType | null>(null);
  const [lookN, setLookN] = useState(0);

  const parsed = useMemo(() => parseBriefMarkdown(markdown), [markdown]);
  const source =
    sources.find((item) => item.id === sourceId) ??
    sources.find((item) => item.partner === parsed.partner || item.brand.name === parsed.partner);
  const recommended = recommendPage(parsed.copy, source?.photos);
  const pageType = typeOverride ?? recommended.type;
  const typeMeta = PAGE_TYPES.find((item) => item.id === pageType);
  const partner = source?.partner ?? parsed.partner ?? "Parceiro";
  const brand = source?.brand ?? { ...emptyBrand(), name: partner };
  const look = generateLook({
    type: pageType,
    partner,
    brand,
    headline: parsed.copy.headline,
    offerName: parsed.copy.offerName,
    n: lookN,
  });
  const ready = canRecommend(parsed.copy);

  function loadFile(file: File) {
    file.text().then((text) => {
      setMarkdown(text);
      setFileName(file.name);
      setTypeOverride(null);
      setLookN(0);
    });
  }

  function downloadTemplate() {
    const blob = new Blob([BRIEF_TEMPLATE], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formato-copy.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  function finish() {
    if (!ready) return;
    const project = createFromFixedCopy({
      name: parsed.name,
      partner,
      copy: parsed.copy,
      source,
      type: pageType,
    });
    onCreate({ ...project, look });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0c0f0ecc] p-4">
      <div className="grid max-h-[92vh] w-full max-w-6xl overflow-hidden border border-line bg-[#0a0c0b] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="studio-scroll max-h-[92vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Copy · ficheiro .md</p>
            <button type="button" onClick={onClose} className="text-[12px] text-mist underline">
              Cancelar
            </button>
          </div>

          <div className="grid gap-5 px-6 py-6">
            <p className="text-[14px] leading-6 text-mist">
              Um ficheiro, as mesmas secções sempre. A composição visual nasce deste copy e desta marca — não de um
              template fixo.
            </p>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={downloadTemplate} className="text-[12px] text-[#c4a574]">
                Descarregar o formato
              </button>
              <a href="/briefs/formato.md" className="text-[12px] text-mist underline">
                Ver formato
              </a>
            </div>

            <label className="grid cursor-pointer place-items-center border border-dashed border-line px-4 py-10 text-center hover:border-[#c4a574]">
              <span className="text-[13px] text-paper">
                {fileName ? fileName : "Largar o .md aqui, ou clicar para escolher"}
              </span>
              <input
                type="file"
                accept=".md,text/markdown,text/plain"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) loadFile(file);
                }}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Ou cola o markdown</span>
              <textarea
                value={markdown}
                onChange={(event) => {
                  setMarkdown(event.target.value);
                  setTypeOverride(null);
                  setLookN(0);
                  if (!event.target.value) setFileName("");
                }}
                rows={18}
                spellCheck
                className="resize-y border border-line bg-ink px-3 py-3 font-mono text-[13px] leading-6 outline-none focus:border-[#c4a574]"
                placeholder={BRIEF_TEMPLATE}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Marca</span>
              <select
                value={source?.id ?? sourceId}
                onChange={(event) => {
                  setSourceId(event.target.value);
                  setLookN(0);
                }}
                className="border border-line bg-ink px-3 py-2.5 text-[13px]"
              >
                <option value="">{parsed.partner ? `${parsed.partner} (do ficheiro)` : "Marca nova / a do ficheiro"}</option>
                {sources.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.brand.name} · {item.partner}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <aside className="studio-scroll border-t border-line xl:max-h-[92vh] xl:overflow-y-auto xl:border-l xl:border-t-0">
          <div className="border-b border-line px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist">O que este copy pede</p>
            {ready ? (
              <>
                <p className="mt-3 font-display text-[42px] leading-none">{typeMeta?.label}</p>
                <p className="mt-2 text-[13px] text-mist">{typeMeta?.brief}</p>
                <ul className="mt-4 grid gap-2 text-[13px] leading-5 text-paper">
                  {recommended.why.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-mist">Composição</p>
                <p className="mt-2 text-[14px] leading-6 text-paper">{describeLook(look)}</p>
                <button
                  type="button"
                  onClick={() => setLookN((value) => value + 1)}
                  className="mt-3 text-[12px] text-[#c4a574] underline"
                >
                  Gerar outra composição
                </button>
              </>
            ) : (
              <p className="mt-3 text-[13px] leading-6 text-mist">
                Sem ficheiro ainda. Descarrega o formato, preenche as secções que tens, larga aqui.
              </p>
            )}
          </div>

          {ready ? (
            <div className="grid gap-2 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Se o tipo falhou</p>
              {PAGE_TYPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTypeOverride(item.id);
                    setLookN(0);
                  }}
                  className={`border px-3 py-3 text-left ${
                    pageType === item.id ? "border-[#c4a574] bg-[#141816]" : "border-line"
                  }`}
                >
                  <p className="text-[14px]">{item.label}</p>
                </button>
              ))}
            </div>
          ) : null}

          <div className="px-5 py-5">
            <button
              type="button"
              onClick={finish}
              disabled={!ready}
              className="w-full border border-[#c4a574] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[#c4a574] disabled:opacity-40"
            >
              Abrir esta página
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
