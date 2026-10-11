/**
 * All agency document templates live in this folder - one file per document.
 *
 * agency-info.ts     -> agency name, agent, address, emails, letterhead path (edit once)
 * application-form.ts -> Visa Application Form (PDF)
 * service-agreement.ts -> Client Service Agreement (PDF)
 * checklist.ts       -> Document Checklist (PDF)
 *
 * Official documents (visa grant, police clearance, medical report, job offer letter,
 * work permit visa) are never generated — they are uploaded as the original files
 * issued by the authority.
 *
 * To add a new template: copy one of the files above, change the content, export a
 * build function, and export it from here. The drawing engine is ../pdf-builder.ts.
 * Images used as backgrounds (letterhead) go in /public/templates/.
 */

export { AGENCY } from "./agency-info";
export { buildApplicationForm } from "./application-form";
export { buildServiceAgreement } from "./service-agreement";
export { buildChecklist } from "./checklist";
