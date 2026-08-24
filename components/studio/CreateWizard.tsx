"use client";

import { useMemo, useState } from "react";
import {
  createFromFixedCopy,
  emptyFixedCopy,
  uniqueBrandSources,
  type FixedCopy,
} from "@/lib/creation";
import { LOOKS } from "@/lib/defaults";
import { canRecommend, rankLooks } from "@/lib/recommend";
import type { Project, TemplateId } from "@/lib/types";
import { ListEditor, TextField } from "./fields";

export function CreateWizard({
  projects,
  initialSourceId,
  onClose,
  onCreate,
}: {
  projects: Project[];
  initialType?: string;
  initialSourceId?: string;
  onClose: () => void;
  onCreate: (project: Project) => void;
}) {
  const sources = useMemo(() => uniqueBrandSources(projects), [projects]);
  const [sourceId, setSourceId] = useState(initialSourceId ?? "");
  const [name, setName] = useState("");
  const [partner, setPartner] = useState(() => {
    const source = projects.find((item) => item.id === initialSourceId);
    return source?.partner ?? "";
  });
  const [copy, setCopy] = useState<FixedCopy>(emptyFixedCopy());
  const [override, setOverride] = useState<TemplateId | null>(null);

  const source = sources.find((item) => item.id === sourceId);
  const ranked = rankLooks(copy, source?.photos);
  const picked = override ? ranked.find((item) => item.template === override) ?? ranked[0] : ranked[0];
  const ready = canRecommend(copy);

  function patch<K extends keyof FixedCopy>(key: K, value: FixedCopy[K]) {
    setCopy((current) => ({ ...current, [key]: value }));
    setOverride(null);
  }

  function finish() {
    if (!ready || !picked) return;
    onCreate(
      createFromFixedCopy({
        name,
        partner: source?.partner ?? partner,
        copy,
        source,
        template: picked.template,
        type: picked.type,
      }),
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0c0f0ecc] p-4">
      <div className="grid max-h-[92vh] w-full max-w-6xl overflow-hidden border border-line bg-[#0a0c0b] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="studio-scroll max-h-[92vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Copy no formato fixo</p>
            <button type="button" onClick={onClose} className="text-[12px] text-mist underline">
              Cancelar
            </button>
          </div>

          <div className="grid gap-5 px-6 py-6">
            <p className="text-[14px] leading-6 text-mist">
              Sempre os mesmos blocos. Preenche o que tens — o estúdio lê o copy e recomenda a página. Não inventa
              layout.
            </p>

            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Nome interno</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={copy.offerName || copy.headline || "Nova página"}
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
                  setOverride(null);
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
                  Cores, fontes e fotos de {source.brand.name}. A recomendação também olha para as fotos.
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

            <TextField label="Para quem é" value={copy.audience} onChange={(audience) => patch("audience", audience)} />
            <TextField
              label="Headline / resultado"
              hint="Promessa específica. É o bloco que mais pesa na recomendação."
              value={copy.headline}
              onChange={(headline) => patch("headline", headline)}
              multiline
              rows={3}
            />
            <TextField
              label="Subheadline"
              value={copy.subheadline}
              onChange={(subheadline) => patch("subheadline", subheadline)}
              multiline
              rows={3}
            />
            <ListEditor
              label="Problemas"
              hint="Um por linha, na linguagem do cliente."
              values={copy.problems}
              onChange={(problems) => patch("problems", problems)}
              min={5}
            />
            <TextField
              label="História / argumento"
              hint="Se isto tiver peso, a recomendação foge do ecrã único."
              value={copy.body}
              onChange={(body) => patch("body", body)}
              multiline
              rows={6}
            />

            <div className="grid gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist">Mecanismo</span>
              {copy.mechanismSteps.map((step, index) => (
                <div key={index} className="grid gap-2 border border-line p-3">
                  <input
                    value={step.title}
                    placeholder="Nome do passo"
                    onChange={(event) => {
                      const mechanismSteps = [...copy.mechanismSteps];
                      mechanismSteps[index] = { ...step, title: event.target.value };
                      patch("mechanismSteps", mechanismSteps);
                    }}
                    className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
                  />
                  <textarea
                    value={step.text}
                    placeholder="O que acontece neste passo"
                    onChange={(event) => {
                      const mechanismSteps = [...copy.mechanismSteps];
                      mechanismSteps[index] = { ...step, text: event.target.value };
                      patch("mechanismSteps", mechanismSteps);
                    }}
                    className="border border-line bg-ink px-3 py-2 text-[13px] outline-none"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <TextField
              label="Nome da oferta / sessão / lead"
              value={copy.offerName}
              onChange={(offerName) => patch("offerName", offerName)}
            />
            <ListEditor
              label="O que inclui"
              values={copy.offerBullets}
              onChange={(offerBullets) => patch("offerBullets", offerBullets)}
              min={3}
            />
            <TextField
              label="Prova autorizada"
              value={copy.proofQuote}
              onChange={(proofQuote) => patch("proofQuote", proofQuote)}
              multiline
              rows={3}
            />
            <TextField label="Nome da prova" value={copy.proofName} onChange={(proofName) => patch("proofName", proofName)} />
            <ListEditor
              label="Não é para"
              values={copy.notFor}
              onChange={(notFor) => patch("notFor", notFor)}
              min={3}
            />
            <TextField
              label="Garantia / honestidade"
              value={copy.guarantee}
              onChange={(guarantee) => patch("guarantee", guarantee)}
              multiline
              rows={3}
            />
            <TextField
              label="O que acontece a seguir"
              value={copy.nextStep}
              onChange={(nextStep) => patch("nextStep", nextStep)}
              multiline
              rows={3}
            />
            <TextField label="Texto do botão" value={copy.cta} onChange={(cta) => patch("cta", cta)} />
          </div>
        </div>

        <aside className="studio-scroll border-t border-line xl:max-h-[92vh] xl:overflow-y-auto xl:border-l xl:border-t-0">
          <div className="border-b border-line px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Página recomendada</p>
            {ready && picked ? (
              <>
                <p className="mt-3 font-display text-[42px] leading-none">{picked.label}</p>
                <p className="mt-2 text-[13px] text-mist">
                  {LOOKS.find((item) => item.id === picked.template)?.brief}
                </p>
                <ul className="mt-4 grid gap-2 text-[13px] leading-5 text-paper">
                  {picked.why.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-[13px] leading-6 text-mist">
                Escreve a headline, o botão ou o nome da oferta. A recomendação aparece aqui.
              </p>
            )}
          </div>

          {ready ? (
            <div className="grid gap-2 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Ou escolhe outra</p>
              {ranked.slice(0, 4).map((item) => (
                <button
                  key={item.template}
                  type="button"
                  onClick={() => setOverride(item.template)}
                  className={`border px-3 py-3 text-left ${
                    picked?.template === item.template ? "border-[#c4a574] bg-[#141816]" : "border-line"
                  }`}
                >
                  <p className="text-[14px]">{item.label}</p>
                  <p className="mt-1 text-[12px] text-mist">{item.why[0]}</p>
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
