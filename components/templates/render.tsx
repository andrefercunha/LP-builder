import type { Project } from "@/lib/types";
import { BookingEditorial } from "./BookingEditorial";
import { BookingLetter } from "./BookingLetter";
import { OptInDense } from "./OptInDense";
import { OptInLight } from "./OptInLight";
import { SalesBrutal } from "./SalesBrutal";
import { SalesLong } from "./SalesLong";
import { ThanksNext } from "./ThanksNext";

export function renderPage(project: Project) {
  switch (project.template) {
    case "opt-in-dense":
      return <OptInDense project={project} />;
    case "opt-in-light":
      return <OptInLight project={project} />;
    case "booking-letter":
      return <BookingLetter project={project} />;
    case "booking-editorial":
      return <BookingEditorial project={project} />;
    case "sales-brutal":
      return <SalesBrutal project={project} />;
    case "thanks-next":
      return <ThanksNext project={project} />;
    case "sales-long":
    default:
      return <SalesLong project={project} />;
  }
}
