export const SIGN_UP_TEXTS = {
  header: {
    for: "for",
    providers: "Providers",
  },
  steps: {
    create: "Create",
    verify: "Verify",
    profile: "Profile",
  },
  navigation: {
    back: "Back",
    next: "Next",
  },
  createAccount: {
    title: "Create Your Account",
    emailPlaceholder: "Enter your email address",
    professionalTitle: "Professional Title",
    professionalTitlePlaceholder: "Professional Title",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    passwordPlaceholder: "Password (6 or more characters)",
    passwordStrength: {
      label: "Password Strength",
      weak: "Weak",
      moderate: "Moderate",
      strong: "Strong",
      veryStrong: "Very Strong",
      requirements: {
        length: "At least 6 characters",
        lowercase: "One lowercase letter",
        uppercase: "One uppercase letter",
        number: "One number",
        special: "One special character (@$!%*?&)",
      },
    },
    youAre: "You are",
    show: "Show",
    hide: "Hide",
    agreeTo: "Agree to",
    terms: "Terms & Conditions",
    verificationText: "Sending verification code",
  },
  verification: {
    title: "Enter Verification Code",
    subtitle: "A 6-digit verification code was just sent to",
    verifying: "Verifying your code",
    creating: "Creating your account",
    sending: "Sending",
    resend: "Resend code",
    resending: "Resending code",
  },
  profile: {
    steps: {
      photo: "1. Photo",
      bio: "2. Bio",
      specialty: "3. Specialty",
    },
    submit: "Submit",
    submitting: "Submitting",
  },
  photoStep: {
    addPhoto: "Add Photo",
    photoAdded: "Photo Added",
    photoDescription:
      "Upload your photo so your patients can easily trust and connect with you.",
    photoAddedDescription:
      "You can click on the photo to edit or upload a new one.",
    editPhoto: "Edit Photo",
    editPhotoDescription:
      "You can scale, rotate, or drag your image to your desired position. When you are done, click submit.",
    uploading: "Uploading",
    add: "Add",
    cancel: "Cancel",
    failedProcess: "Failed to process image",
    failedUpload: "Failed to upload photo. Please try again.",
    successUpload: "Photo uploaded successfully!",
  },
  bioStep: {
    officePhoneLabel: "Phone Number",
    officePhonePlaceholder: "Enter your phone number (e.g. 0555555555)",
    countryCode: "+233",
    ghanaFlagSrc: "/ghana-flag.png",
    privateInfo:
      "This is private and will not be shared with anyone outside JustGo Health.",
    status: "My Slogan",
    bioPlaceholder: "One thing I want my patients to know",
    bioDescription: "Introduce yourself to the world of mental health.",
  },
  specialtyStep: {
    title: "Add Specialty",
    subtitle:
      "Click to choose your specialty. You can add more than one later.",
  },
  resume: {
    checking: "Checking your profile...",
    signInRequired: "Sign in to continue your profile.",
    continueProfile: "Continue setting up your profile.",
    sessionExpired:
      "Your session has expired. Please sign in again after verifying your email.",
  },
  errors: {
    termsRequired: "Please agree to Terms & Conditions",
    accountExists: "Account already exists. Sign in to continue.",
    createFailed: "Failed to create account",
    general: "Failed to create account. Please try again.",
    verifyFailed: "Verification failed. Please try again.",
    verifySuccessLoginFailed:
      "Verification succeeded but login failed. Please try logging in.",
    noToken: "Verification error: No token received",
    resendFailed: "Failed to resend code. Please try again.",
    fillAllFields: "Please fill in all required fields",
    selectSpecialty: "Please select a specialty",
    updateProfileFailed: "Failed to update profile. Please try again.",
    profileUpdated: "Profile updated successfully!",
    specialtyAdded: "Specialty added successfully!",
    autoLoginFailed: "Auto-login failed. Please sign in manually.",
    addSpecialtyFailed: "Failed to add specialty. Please try again.",
  },
  toasts: {
    verified: "Account verified successfully",
    resend: "Verification email resent",
    send: "Verification email sent",
    resendPasswordReset: "Recovery code resent",
  },
  loading: "Loading",
};

export const PROVIDER_SPECIALTIES = [
  "Clinical Psychologist",
  "Psychiatrist",
  "Academic Advisor",
  "Counsellor",
  "Mental Health Nurse",
  "Therapist",
  "Medical Doctor",
  "Peer Counselor",
  "Wellness Coach",
  "Career Counselor",
];

export const PROFESSIONAL_TITLES = [
  "Dr. (Doctor)",
  "Prof. (Professor)",
  "Mr.",
  "Mrs.",
  "Ms.",
  "Miss",
  "Rev. (Reverend)",
];

export const TITLE_SELECT_OPEN_DELAY_MS = 1000;

export const OTP_INPUT_FOCUS_DELAY_MS = 700;
