import { IoSchoolOutline, IoStar } from "react-icons/io5";
import { ONBOARDING_SOCIAL_PROOF } from "@/lib/constants/components/patient/onboarding";
import { OnboardingBrandLogo } from "@/components/patient/onboarding/brand-logo";

export function SocialProofPanel() {
  return (
    <aside className="photo-side">
      <div className="photo-logo">
        <OnboardingBrandLogo placement="photo-side" />
      </div>

      <div className="student-name-cycle">
        <b>{ONBOARDING_SOCIAL_PROOF.name}</b>
        <IoSchoolOutline className="grad-cap" aria-hidden="true" />
      </div>

      <div className="student-quote">
        &ldquo;Lock In makes it easy for me to take care
        <br />
        of my mental health.&rdquo;
      </div>

      <div className="student-block">
        <div className="student-programme">
          {ONBOARDING_SOCIAL_PROOF.programme}
        </div>
        <div className="student-school">{ONBOARDING_SOCIAL_PROOF.school}</div>
      </div>

      <div className="student-rating">
        <div className="stars" aria-hidden="true">
          <IoStar />
          <IoStar />
          <IoStar />
          <IoStar />
          <IoStar />
        </div>
        <div className="num">{ONBOARDING_SOCIAL_PROOF.rating}</div>
        <div className="label">{ONBOARDING_SOCIAL_PROOF.ratingLabel}</div>
      </div>
    </aside>
  );
}
