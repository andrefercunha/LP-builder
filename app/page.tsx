"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LOOKS, PAGE_TYPES, createProject } from "@/lib/defaults";
import { auditProject, qualityScore } from "@/lib/quality";
import { loadProjects, resetSeeds, upsertProject } from "@/lib/store";
import type { PageType, Project } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  function create(type: PageType) {
    const project = createProject({
      type,
      name: `Nova ${PAGE_TYPES.find((item) => item.id === type)?.label.toLowerCase()}`,
    });
    upsertProject(project);
    router.push(`/studio/${project.id}`);
  }

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-mist">REDNA · Estúdio LP</p>
            <h1 className="mt-3 max-w-3xl font-display text-[clamp(42px,7vw,78px)] leading-[0.92]">
              Entregas marca, fotos e copy. Sai uma página que se pode mostrar.
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
              onClick={() => create(item.id)}
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
                <Link
                  key={project.id}
                  href={`/studio/${project.id}`}
                  className="grid gap-2 border-b border-line py-5 md:grid-cols-[1.2fr_0.7fr_80px] md:items-end"
                >
                  <div>
                    <p className="font-display text-[34px] leading-none">{project.name}</p>
                    <p className="mt-2 text-[13px] text-mist">{project.copy.headline}</p>
                  </div>
                  <p className="text-[13px] text-mist">
                    {project.partner} · {LOOKS.find((item) => item.id === project.template)?.label ?? project.type}
                  </p>
                  <p className="font-display text-[28px]">{score}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
