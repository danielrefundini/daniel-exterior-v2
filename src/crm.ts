// The only link between this site and the CRM: two public addresses and two IDs.
// Changing the site never needs a change in the CRM.
export const CRM = {
  // Website forms and the price estimator send each lead here (contact + "Form submitted" in the CRM).
  leadUrl: "https://crm.danielrefundini.com/api/public/lead",
  // Which CRM site the leads are filed under ("danielrefundini.com" in Presidential Exteriors).
  siteId: "465660f2-dbc8-47a7-bdf2-45a4bcf03e8d",
  // Chat bubble with the AI agent (Daniel's Assistant), loaded like any third-party widget.
  widgetUrl: "https://crm.danielrefundini.com/widget.js",
  chatAgentId: "3d1f2e85-4c2b-4d97-92aa-e0f2b914496e",
};
