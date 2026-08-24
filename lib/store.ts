"use client";

import { SEED_PROJECTS } from "./seeds";
import type { Project } from "./types";

const KEY = "lp-builder.projects.v5";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function loadProjects(): Project[] {
  if (!canUseStorage()) return SEED_PROJECTS;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    window.localStorage.setItem(KEY, JSON.stringify(SEED_PROJECTS));
    return SEED_PROJECTS;
  }
  try {
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_PROJECTS;
    return parsed;
  } catch {
    return SEED_PROJECTS;
  }
}

export function saveProjects(projects: Project[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(KEY, JSON.stringify(projects));
}

export function upsertProject(project: Project) {
  const projects = loadProjects();
  const index = projects.findIndex((item) => item.id === project.id);
  const next = { ...project, updatedAt: new Date().toISOString() };
  if (index >= 0) projects[index] = next;
  else projects.unshift(next);
  saveProjects(projects);
  return next;
}

export function deleteProject(id: string) {
  saveProjects(loadProjects().filter((item) => item.id !== id));
}

export function getProject(id: string) {
  return loadProjects().find((item) => item.id === id);
}

export function resetSeeds() {
  saveProjects(SEED_PROJECTS);
  return SEED_PROJECTS;
}
