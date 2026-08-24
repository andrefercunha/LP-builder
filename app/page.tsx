"use client";

import { CreateWizard } from "@/components/studio/CreateWizard";
import { LOOKS } from "@/lib/defaults";
import { auditProject, qualityScore } from "@/lib/quality";
import { loadProjects, resetSeeds, upsertProject } from "@/lib/store";
import { TEST_BRIEFS, type TestBrief } from "@/lib/test-briefs";
import type { Project } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type WizardState = {
  sourceId?: string;
  markdown?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [wizard, setWizard] = useState<WizardState | null>(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  function openCreated(project: Project) {
    upsertProject(project);
    setProjects(loadProjects());
    router.push(`/studio/${project.id}`);
  }

  async function startTest(brief: TestBrief) {
    const markdown = await fetch(brief.file).then((response) => response.text());
    setWizard({ markdown });
  }

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-mist">REDNA · Estúdio LP</p>
            <h1 className="mt-3 max-w-3xl font-display text-[clamp(42px,7vw,78px)] leading-[0.92]">
              O copy é um ficheiro .md. O estúdio recomenda a página.
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setProjects(resetSeeds())}
            className="text-[12px] text-mist underline"
          >
            Repor exemplos
          </button>
        </header>

        <section className="grid gap-6 border-b border-line py-10">
          <p className="max-w-2xl text-[16px] leading-7 text-mist">
            Sempre as mesmas secções: para quem, headline, problemas, história, mecanismo, oferta, prova, próximo
            passo, CTA. Escreves isso no Notion, no Cursor ou num doc — exportas markdown — e largas o ficheiro.
            Não é um formulário de 20 perguntas.
          </p>
          <ol className="grid max-w-3xl gap-3 text-[16px] leading-7 text-paper">
            <li>
              <span className="text-mist">1. </span>
              Olha para uma página já feita, em baixo.
            </li>
            <li>
              <span className="text-mist">2. </span>
              Clica num teste. Entra o .md. À direita tem de aparecer o look do cartão.
            </li>
            <li>
              <span className="text-mist">3. </span>
              Ou descarrega o formato, preenche o teu copy, e larga o ficheiro.
            </li>
          </ol>
        </section>

        <section className="grid gap-4 py-10 md:grid-cols-3">
          {TEST_BRIEFS.map((brief) => (
            <button
              key={brief.id}
              type="button"
              onClick={() => startTest(brief)}
              className="border border-line p-5 text-left hover:border-[#c4a574]"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#c4a574]">
                Teste · {brief.file} · espera {brief.expectLook}
              </p>
              <h2 className="mt-3 font-display text-[28px] leading-none">{brief.name}</h2>
              <p className="mt-3 text-[13px] leading-6 text-mist">{brief.whatToWatch}</p>
            </button>
          ))}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-6">
          <p className="max-w-xl text-[14px] leading-6 text-mist">
            Copy teu: descarrega o formato, preenche só o que tens, larga o .md.
          </p>
          <button
            type="button"
            onClick={() => setWizard({})}
            className="border border-[#c4a574] px-5 py-3 text-[12px] uppercase tracking-[0.16em] text-[#c4a574]"
          >
            Largar um .md
          </button>
        </div>

        <section className="pb-20 pt-10">
          <p className="mb-5 text-[11px] uppercase tracking-[0.16em] text-mist">Páginas já feitas — só olhar</p>
          <div className="grid gap-0 border-t border-line">
            {projects.map((project) => {
              const score = qualityScore(auditProject(project));
              return (
                <div
                  key={project.id}
                  className="grid gap-3 border-b border-line py-5 md:grid-cols-[1.2fr_0.7fr_80px_auto] md:items-end"
                >
                  <Link href={`/studio/${project.id}`}>
                    <p className="font-display text-[34px] leading-none">{project.name}</p>
                    <p className="mt-2 text-[13px] text-mist">{project.copy.headline}</p>
                  </Link>
                  <Link href={`/studio/${project.id}`} className="text-[13px] text-mist">
                    {project.partner} · {LOOKS.find((item) => item.id === project.template)?.label ?? project.type}
                  </Link>
                  <Link href={`/studio/${project.id}`} className="font-display text-[28px]">
                    {score}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setWizard({ sourceId: project.id })}
                    className="justify-self-start text-[12px] text-[#c4a574] md:justify-self-end"
                  >
                    Nova desta marca
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {wizard ? (
        <CreateWizard
          projects={projects}
          initialSourceId={wizard.sourceId}
          initialMarkdown={wizard.markdown}
          onClose={() => setWizard(null)}
          onCreate={openCreated}
        />
      ) : null}
    </main>
  );
}
