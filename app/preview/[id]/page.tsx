"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { renderPage } from "@/components/templates/render";
import { getProject } from "@/lib/store";
import type { Project } from "@/lib/types";

export default function PreviewPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    setProject(getProject(params.id) ?? null);
  }, [params.id]);

  if (!project) {
    return <main className="min-h-screen bg-ink p-8 text-mist">Página não encontrada neste browser.</main>;
  }

  return <main>{renderPage(project)}</main>;
}
