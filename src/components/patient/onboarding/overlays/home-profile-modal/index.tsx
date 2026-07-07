"use client";

import {
  IoCheckmark,
  IoEllipsisHorizontal,
  IoPlay,
  IoStar,
} from "react-icons/io5";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import { OnboardingBrandLogo } from "@/components/patient/onboarding/brand-logo";
import type { HomeProfileModalProps } from "@/lib/types/components/patient/onboarding";
import { formatClassOf } from "@/lib/utils/patient/onboarding-class";

function computeAge(birthYear: string): number | null {
  const year = Number.parseInt(birthYear, 10);
  if (Number.isNaN(year)) {
    return null;
  }
  return new Date().getFullYear() - year;
}

export function HomeProfileModal({
  open,
  onOpenChange,
  preview,
  onGoToProfile,
  onLogout,
  onShowToast,
}: HomeProfileModalProps) {
  if (!open || !preview) {
    return null;
  }

  const age = computeAge(preview.birthYear);
  const graduationLabel =
    preview.graduationYear != null
      ? formatClassOf(preview.graduationYear)
      : null;
  const classLine =
    graduationLabel && preview.gradeShort
      ? `${graduationLabel} (${preview.gradeShort})`
      : graduationLabel;
  const contactValue =
    preview.contactMode === "phone" ? preview.phone : preview.email;
  const contactLabel =
    preview.contactMode === "phone"
      ? ONBOARDING_COPY.homeModal.phoneLabel
      : ONBOARDING_COPY.homeModal.emailLabel;
  const photoInitial = preview.nickname.charAt(0).toUpperCase() || "?";

  const handleEditProfile = () => {
    if (onGoToProfile) {
      onGoToProfile();
      return;
    }
    onShowToast?.(ONBOARDING_COPY.toast.editProfileComingSoon);
    onOpenChange(false);
  };

  const handleMoreOptions = () => {
    onShowToast?.(ONBOARDING_COPY.homeModal.moreOptionsToast);
  };

  const handleRadio = () => {
    onShowToast?.(ONBOARDING_COPY.toast.radioPlaying);
  };

  const handleDismiss = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    onOpenChange(false);
  };

  return (
    <div className="modal-overlay" id="homeModalOverlay">
      <div
        className="home-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="homeNickname"
      >
        <div className="home-modal-inner">
          <div className="home-top-header">
            <div className="brand">
              <OnboardingBrandLogo placement="home-modal" />
            </div>
            <button
              className="logout-btn"
              type="button"
              onClick={handleDismiss}
            >
              {ONBOARDING_COPY.homeModal.logout}
            </button>
          </div>

          <div className="home-profile-row">
            <div className="home-avatar-ring">
              <div
                className="home-photo-circle"
                id="homePhotoCircle"
                style={
                  preview.profilePhotoUrl
                    ? { backgroundImage: `url(${preview.profilePhotoUrl})` }
                    : undefined
                }
              >
                {!preview.profilePhotoUrl ? photoInitial : null}
              </div>
            </div>

            <div className="home-identity-col">
              <div className="home-handle-row">
                <span className="home-nickname" id="homeNickname">
                  @{preview.nickname}
                </span>
                <span className="home-verified-badge">
                  <IoCheckmark aria-hidden="true" />
                </span>
                <div className="home-action-btns">
                  <button
                    className="home-edit-btn"
                    type="button"
                    onClick={handleEditProfile}
                  >
                    {ONBOARDING_COPY.homeModal.cta}
                  </button>
                  <button
                    className="home-more-btn"
                    type="button"
                    onClick={handleMoreOptions}
                    aria-label={ONBOARDING_COPY.homeModal.moreOptionsToast}
                  >
                    <IoEllipsisHorizontal aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="home-fullname-row">
                <span className="home-fullname" id="homeFullname">
                  {preview.fullName}
                </span>
                <IoStar className="home-verified-star" aria-hidden="true" />
              </div>

              <div className="home-stats-row">
                {age !== null ? (
                  <span className="home-stat">
                    <b id="homeAge">{age}</b>
                    {ONBOARDING_COPY.homeModal.ageLabel}
                  </span>
                ) : null}
                {preview.gender ? (
                  <span className="home-stat">
                    <b id="homeGender" className="capitalize">
                      {preview.gender}
                    </b>
                    {ONBOARDING_COPY.homeModal.genderLabel}
                  </span>
                ) : null}
                <span className="home-stat">
                  <b id="homePhone">{contactValue}</b>
                  <span id="homeContactLabel">{contactLabel}</span>
                </span>
              </div>

              <div className="home-bio-block">
                {classLine ? (
                  <div className="home-bio-line accent" id="homeClassLine">
                    {classLine}
                  </div>
                ) : null}
                <span className="home-school-pill" id="homeSchoolPill">
                  {preview.schoolName} · {preview.programme}
                </span>
              </div>
            </div>
          </div>

          <div className="home-section-divider" />

          <div className="home-highlights-row">
            <div
              className="home-highlight"
              role="button"
              tabIndex={0}
              onClick={handleRadio}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleRadio();
                }
              }}
            >
              <div className="home-highlight-circle radio">
                <IoPlay className="play-icon" aria-hidden="true" />
              </div>
              <span className="home-highlight-label">Radio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
