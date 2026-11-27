import { SITE } from "@/site/config";
import { TextPageView } from "@/site/InnerPages";
import { pageMetadata } from "@/site/seo";

// DRAFT LEGAL WORDING: Daniel must review and approve this page before it is treated as final.
// It describes only what the site actually does today. Update it if the form, the tools or analytics change.
const DRAFT = true;
const UPDATED = "November 27, 2026";

export const metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy | Daniel Exteriors, Daniel Refundini",
  description:
    "How Daniel Refundini handles the details you share through the free estimate form on danielrefundini.com, which tools receive them, and how to reach Daniel.",
});

export default function PrivacyRoute() {
  return (
    <TextPageView name="Privacy policy" draft={DRAFT}>
      <h1 className="s-h1 p-h1">Privacy policy</h1>
      <p className="s-muted">Last updated {UPDATED}</p>

      <p>
        This website, danielrefundini.com, is run by {SITE.person}, {SITE.jobTitle} at {SITE.company.name}, under the name {SITE.name}. This page explains what
        information the site collects, how it is used, and how to contact Daniel about it.
      </p>

      <h2 className="s-h2">Information you give us</h2>
      <p>When you use the free estimate form, you can share:</p>
      <ul>
        <li>your name, mobile phone number and email address</li>
        <li>the property address and ZIP code</li>
        <li>the project you have in mind, your answers to the form’s questions, the price range shown to you, and a preferred day and time</li>
      </ul>
      <p>If you use the chat bubble, the messages you type are also received so Daniel can follow up.</p>

      <h2 className="s-h2">How we use it</h2>
      <p>
        We use your information to respond to your request, arrange an exterior inspection or a call, and prepare your estimate. By checking the consent box on the form,
        you agree that Daniel Refundini or {SITE.company.name} may call, text or email you about your request. Consent isn’t required to buy. Sending the form does not by
        itself book an appointment; your appointment is confirmed only after we connect and agree on a time.
      </p>

      <h2 className="s-h2">Who receives it</h2>
      <ul>
        <li>Daniel Refundini, and {SITE.company.name}, the company that handles your project.</li>
        <li>The tools that deliver the form to Daniel: a customer relationship management system that stores the request, and Formspree, which sends it to Daniel by email.</li>
        <li>Geoapify, which suggests matching addresses while you type the property address.</li>
        <li>Vercel, which hosts this website and keeps standard technical logs.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2 className="s-h2">Information collected automatically</h2>
      <p>
        When you arrive on the site, it notes the page you landed on, the website that referred you, and any campaign tags in the link (such as utm_source or utm_campaign).
        This is kept in your browser’s session storage and sent along with your request, so Daniel knows how you found the site.
      </p>
      <p>
        The site may use Google Analytics to understand how visitors use it, for example which pages are viewed and when an estimate request is sent. Google Analytics uses
        cookies. The details you type into the form, such as your name, phone, email and address, are not sent to Google Analytics. You can learn more at{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">How Google uses information from sites that use its services</a>.
      </p>

      <h2 className="s-h2">Your choices</h2>
      <p>
        You can ask Daniel to see, correct or delete the information you sent, or to stop contacting you, by emailing{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2 className="s-h2">Children</h2>
      <p>This site is meant for homeowners and is not directed to children under 13.</p>

      <h2 className="s-h2">Changes</h2>
      <p>If this policy changes, the new version will be posted on this page with a new date.</p>

      <h2 className="s-h2">Contact</h2>
      <p>
        Questions about this policy? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </TextPageView>
  );
}
