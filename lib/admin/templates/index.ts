/**
 * All agency document templates live in this folder - one file per document.
 * 
 * agency-info.ts                  -> agency name, agent, address, emails, letterhead path (edit once)
 * application-form.tsx            -> Visa Application Form
 * service-agreement.ts            -> Client Service Agreement
 * checklist.ts                    -> Document Checklist
 * grantNotifications.tsx          -> Grant Notifications
 * job-offer-letter.tsx            -> Job Offer Letter
 * official-e-medical-report.tsx   -> Official E-Medical Report
 * police-clearance-certificate.tsx -> Police Clearance Certificate
 * work-permit-visa.tsx            -> Work Permit Visa
 * 
 * To add a new template: copy one of the files above, change the content, export a
 * build function, and export it from here. The drawing engine is ../pdf-builder.ts.
 * Images used as backgrounds (letterhead) go in /public/templates/.
 */

export { AGENCY } from "./agency-info";
export { buildApplicationForm } from "./application-form";
export { buildServiceAgreement } from "./service-agreement";
export { buildChecklist } from "./checklist";
export { buildGrantNotifications } from "./grantNotifications";
export { buildJobOfferLetter } from "./job-offer-letter";
export { buildOfficialEMedicalReport } from "./official-e-medical-report";
export { buildPoliceClearanceCertificate } from "./police-clearance-certificate";
export { buildWorkPermitVisa } from "./work-permit-visa";
