import type { Software } from "@/lib/types";
import { editorialReviews } from "@/lib/data/reviews";
import { accounting } from "./accounting";
import { payroll } from "./payroll";
import { hr } from "./hr";
import { crm } from "./crm";
import { erp } from "./erp";
import { projectManagement } from "./project-management";

export const softwareByCategory = {
  accounting,
  payroll,
  hr,
  crm,
  erp,
  "project-management": projectManagement,
} satisfies Record<string, Software[]>;

/** The bundled register, with each product's editorial review attached. */
export const allSoftware: Software[] = Object.values(softwareByCategory)
  .flat()
  .map((s) => (editorialReviews[s.slug] ? { ...s, review: editorialReviews[s.slug] } : s));
