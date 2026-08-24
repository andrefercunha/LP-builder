import type { Project } from "@/lib/types";
import { Compose } from "./Compose";

export function renderPage(project: Project) {
  return <Compose project={project} />;
}
