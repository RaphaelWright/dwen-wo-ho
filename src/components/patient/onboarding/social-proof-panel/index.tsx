import { ONBOARDING_SOCIAL_PROOF } from "@/lib/constants/components/patient/onboarding";

export function SocialProofPanel() {
  return (
    <aside className="photo-side">
      <div className="ps-name">
        <span className="ps-name-text">
          {ONBOARDING_SOCIAL_PROOF.name}{" "}
          <span className="ps-emoji" aria-hidden="true">
            &#127891;
          </span>
        </span>
      </div>

      <div className="student-name-cycle">
        <b>{ONBOARDING_SOCIAL_PROOF.name}</b>
        <span className="grad-cap">🎓</span>
      </div>

      <div className="student-quote">
        &ldquo;Lock In makes it easy for me to take care
        <br />
        of my mental health.&rdquo;
      </div>

      <div className="ps-footer">
        <div className="ps-programme">{ONBOARDING_SOCIAL_PROOF.programme}</div>
        <div className="ps-school">{ONBOARDING_SOCIAL_PROOF.school}</div>
      </div>

      <div className="student-rating">
        <div className="stars">★★★★★</div>
        <div className="num">{ONBOARDING_SOCIAL_PROOF.rating}</div>
        <div className="label">{ONBOARDING_SOCIAL_PROOF.ratingLabel}</div>
      </div>
    </aside>
  );
}
