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

      <div className="ps-quote">&ldquo;{ONBOARDING_SOCIAL_PROOF.quote}&rdquo;</div>

      <div className="ps-footer">
        <div className="ps-programme">{ONBOARDING_SOCIAL_PROOF.programme}</div>
        <div className="ps-school">{ONBOARDING_SOCIAL_PROOF.school}</div>
      </div>

      <div className="ps-rating">
        <div className="ps-stars" aria-hidden="true">
          &#9733;&#9733;&#9733;&#9733;&#9733;
        </div>
        <div className="ps-score">{ONBOARDING_SOCIAL_PROOF.rating}</div>
        <div className="ps-label">{ONBOARDING_SOCIAL_PROOF.ratingLabel}</div>
      </div>
    </aside>
  );
}
