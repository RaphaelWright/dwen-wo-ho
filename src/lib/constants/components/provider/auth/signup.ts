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
    fullNamePlaceholder: "Full Name",
    passwordPlaceholder: "Password (6 or more characters)",
    youAre: "You are",
    show: "Show",
    hide: "Hide",
    agreeTo: "Agree to",
    terms: "Terms & Conditions",
    verificationText: "Sending verification code...",
  },
  verification: {
    title: "Enter Verification Code",
    subtitle: "A 6-digit verification code was just sent to",
    verifying: "Verifying your code...",
    creating: "Creating your account...",
    sending: "Sending...",
    resend: "Resend code",
  },
  profile: {
    steps: {
      photo: "1. Photo",
      bio: "2. Bio",
      specialty: "3. Specialty",
    },
    submit: "Submit",
    submitting: "Submitting...",
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
    uploading: "Uploading...",
    add: "Add",
    cancel: "Cancel",
    failedProcess: "Failed to process image",
    failedUpload: "Failed to upload photo. Please try again.",
    successUpload: "Photo uploaded successfully!",
  },
  bioStep: {
    officePhonePlaceholder: "Office Phone Number",
    privateInfo:
      "This is private and will not be shared with anyone outside JustGo Health.",
    status: "Status",
    bioPlaceholder: "",
    bioDescription: "Introduce yourself to the world of mental health.",
  },
  specialtyStep: {
    title: "Add Specialty",
    subtitle:
      "Click to choose your specialty. You can add more than one later.",
  },
  errors: {
    termsRequired: "Please agree to Terms & Conditions",
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
  },
  loading: "Loading...",
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
