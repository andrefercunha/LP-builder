"use client";

import { CreateWizard } from "@/components/studio/CreateWizard";
import { LOOKS, PAGE_TYPES } from "@/lib/defaults";
import { auditProject, qualityScore } from "@/lib/quality";
import { loadProjects, resetSeeds, upsertProject } from "@/lib/store";
import type { PageType, Project } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [wizard, setWizard] = useState<{ type?: PageType; sourceId?: string } | null>(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  function openCreated(project: Project) {
    upsertProject(project);
    setProjects(loadProjects());
    router.push(`/studio/${project.id}`);
  }

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-mist">REDNA · Estúdio LP</p>
            <h1 className="mt-3 max-w-3xl font-display text-[clamp(42px,7vw,78px)] leading-[0.92]">
              Tipo, linguagem, briefing. A página começa preenchida, não vazia.
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

        <section className="grid gap-4 py-10 md:grid-cols-2 xl:grid-cols-4">
          {PAGE_TYPES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setWizard({ type: item.id })}
              className="border border-line p-5 text-left hover:border-[#c4a574]"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#c4a574]">Nova</p>
              <h2 className="mt-3 font-display text-[32px] leading-none">{item.label}</h2>
              <p className="mt-3 text-[13px] leading-6 text-mist">{item.brief}</p>
            </button>
          ))}
        </section>

        <section className="pb-20">
          <p className="mb-5 text-[11px] uppercase tracking-[0.16em] text-mist">Páginas</p>
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
          initialType={wizard.type}
          initialSourceId={wizard.sourceId}
          onClose={() => setWizard(null)}
          onCreate={openCreated}
        />
      ) : null}
    </main>
  );
}
