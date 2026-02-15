import WidthConstraint from "@/components/ui/width-constraint";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20 bg-background text-foreground">
      <WidthConstraint>
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p>
            At Dwen Wo Ho, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and share your personal
            information when you use our website and services.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p>
            We may collect personal information such as your name, email
            address, and usage data when you interact with our platform.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to provide and improve our services,
            communicate with you, and ensure the security of our platform.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Sharing Your Information
          </h2>
          <p>
            We do not sell your personal information. We may share it with
            trusted service providers who assist us in operating our website.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. Please contact us if you wish to exercise these rights.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at support@dwenwoho.com.
          </p>
        </div>
      </WidthConstraint>
    </div>
  );
}
