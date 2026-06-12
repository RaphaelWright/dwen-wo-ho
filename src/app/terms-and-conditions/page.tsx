import WidthConstraint from "@/components/ui/width-constraint";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata(
  "Terms and Conditions",
  "The terms and conditions governing your use of Dwen Wo Ho.",
  "/terms-and-conditions",
);

const LAST_UPDATED = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-background text-foreground py-20">
      <WidthConstraint>
        <h1 className="mb-8 text-4xl font-bold">Terms and Conditions</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">Last updated: {LAST_UPDATED}</p>
          <p>
            Please read these Terms and Conditions carefully before using the
            Dwen Wo Ho website and services.
          </p>
          <h2 className="mt-8 mb-4 text-2xl font-semibold">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using our services, you agree to be bound by these
            Terms. If you disagree with any part of the terms, you may not
            access the service.
          </p>
          <h2 className="mt-8 mb-4 text-2xl font-semibold">
            2. Use of Service
          </h2>
          <p>
            You seek to use our services for lawful purposes only. You must not
            use the service in any way that causes, or may cause, damage to the
            website or impairment of the availability or accessibility of the
            website.
          </p>
          <h2 className="mt-8 mb-4 text-2xl font-semibold">
            3. Intellectual Property
          </h2>
          <p>
            The content, features, and functionality of this website are and
            will remain the exclusive property of Dwen Wo Ho and its licensors.
          </p>
          <h2 className="mt-8 mb-4 text-2xl font-semibold">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall Dwen Wo Ho be liable for any indirect, incidental,
            special, consequential, or punitive damages arising out of your use
            of the service.
          </p>
          <h2 className="mt-8 mb-4 text-2xl font-semibold">
            5. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify or replace these Terms at any time.
            It is your responsibility to check these Terms periodically for
            changes.
          </p>
        </div>
      </WidthConstraint>
    </div>
  );
}
