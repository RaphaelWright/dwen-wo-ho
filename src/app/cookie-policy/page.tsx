import { LegalPolicyPageShell } from "@/components/legal/policy-page-shell";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata(
  "Cookie Policy",
  "How Dwen Wo Ho uses cookies and similar technologies.",
  "/cookie-policy",
);

export default function CookiePolicyPage() {
  return (
    <LegalPolicyPageShell title="Cookie Policy">
      <p>
        This Cookie Policy explains what cookies are, how we use them, and your
        choices regarding cookies.
      </p>
      <h2 className="mt-8 mb-4 text-2xl font-semibold">1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on your device when you
        visit a website. They help the website function properly and provide
        analytics data.
      </p>
      <h2 className="mt-8 mb-4 text-2xl font-semibold">
        2. How We Use Cookies
      </h2>
      <p>
        We use cookies to improve your experience on our website, analyze site
        traffic, and personalize content.
      </p>
      <h2 className="mt-8 mb-4 text-2xl font-semibold">
        3. Types of Cookies We Use
      </h2>
      <ul className="mb-4 list-disc pl-6">
        <li>
          <strong>Essential Cookies:</strong> Necessary for the website to
          function.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Help us understand how visitors
          interact with the website.
        </li>
        <li>
          <strong>Marketing Cookies:</strong> Used to track visitors across
          websites to display relevant ads.
        </li>
      </ul>
      <h2 className="mt-8 mb-4 text-2xl font-semibold">4. Managing Cookies</h2>
      <p>
        You can control and manage cookies through your browser settings.
        However, disabling cookies may affect some features of the website.
      </p>
    </LegalPolicyPageShell>
  );
}
