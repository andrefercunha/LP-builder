import type { Project } from "@/lib/types";
import { BookingEditorial } from "./BookingEditorial";
import { OptInDense } from "./OptInDense";
import { SalesLong } from "./SalesLong";
import { ThanksNext } from "./ThanksNext";

export function renderPage(project: Project) {
  switch (project.template) {
    case "opt-in-dense":
      return <OptInDense project={project} />;
    case "booking-editorial":
      return <BookingEditorial project={project} />;
    case "thanks-next":
      return <ThanksNext project={project} />;
    case "sales-long":
    default:
      return <SalesLong project={project} />;
  }
}
