"use client";

import { Compose } from "@/components/templates/Compose";
import { describeLook, lookFromProject } from "@/lib/look";
import { sistemaPagesFromMd } from "@/lib/pages-from-md";
import { upsertProject } from "@/lib/store";
import Link from "next/link";
import { useEffect, useMemo } from "react";

export default function MesmoMdPage() {
  const pages = useMemo(() => sistemaPagesFromMd(4), []);

  useEffect(() => {
    pages.forEach(upsertProject);
  }, [pages]);

  return (
    <div className="mesmo-md">
      <header className="mesmo-md-bar">
        <Link href="/">← Estúdio</Link>
        <p>
          Quatro páginas geradas do mesmo ficheiro{" "}
          <code>public/briefs/sistema-crescimento.md</code>. A copy é a mesma.
          A composição muda.
        </p>
      </header>
      {pages.map((page) => (
        <section key={page.id} className="mesmo-md-page">
          <p className="mesmo-md-label">
            <Link href={`/preview/${page.id}`}>{page.name}</Link>
            {" · "}
            {describeLook(lookFromProject(page))}
          </p>
          <Compose project={page} />
        </section>
      ))}
    </div>
  );
}
