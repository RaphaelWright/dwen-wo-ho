import WidthConstraint from "@/components/ui/width-constraint";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata(
  "Cookie Policy",
  "How Dwen Wo Ho uses cookies and similar technologies.",
  "/cookie-policy",
);

const LAST_UPDATED = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function CookiePolicyPage() {
  return (
    <div className="py-20 bg-background text-foreground">
      <WidthConstraint>
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">Last updated: {LAST_UPDATED}</p>
          <p>
            This Cookie Policy explains what cookies are, how we use them,
            andyour choices regarding cookies.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text files that are stored on your device when you
            visit a website. They help the website function properly and provide
            analytics data.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            2. How We Use Cookies
          </h2>
          <p>
            We use cookies to improve your experience on our website, analyze
            site traffic, and personalize content.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Types of Cookies We Use
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Essential Cookies:</strong> Necessary for the website to
              function.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how
              visitors interact with the website.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to track visitors across
              websites to display relevant ads.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Managing Cookies
          </h2>
          <p>
            You can control and manage cookies through your browser settings.
            However, disabling cookies may affect some features of the website.
          </p>
        </div>
      </WidthConstraint>
    </div>
  );
}
