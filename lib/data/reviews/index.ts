import type { EditorialReview } from "@/lib/types";
import { sageReviews } from "./sage";
import { sageExtraSections } from "./sage-extra";
import { accountingReviews } from "./accounting";
import { payrollHrReviews } from "./payroll-hr";
import { crmReviews } from "./crm";
import { erpPmReviews } from "./erp-pm";

const base: Record<string, EditorialReview> = {
  ...sageReviews,
  ...accountingReviews,
  ...payrollHrReviews,
  ...crmReviews,
  ...erpPmReviews,
};

/** Every editorial review, keyed by software slug, with the extra Sage sections appended. */
export const editorialReviews: Record<string, EditorialReview> = Object.fromEntries(
  Object.entries(base).map(([slug, review]) => [
    slug,
    { ...review, sections: [...review.sections, ...(sageExtraSections[slug] ?? [])] },
  ]),
);
