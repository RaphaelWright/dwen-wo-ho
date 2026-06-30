import type {
  AuthFooterStepLabel,
  OnboardingFooterStepLabel,
  OnboardingScreen,
} from "@/lib/types/components/patient/onboarding";
import { LANDING_2_CHARACTERS } from "@/lib/marketing/landing-2";

export const ONBOARDING_DEFAULT_SCHOOL_TYPE = "high-school" as const;

export const ONBOARDING_INITIAL_DRAFT = {
  phone: "",
  email: "",
  firstName: "",
  lastName: "",
  fullName: "",
  nickname: "",
  gender: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "2005",
  password: "",
  confirmPassword: "",
  profilePhotoUrl: "",
  profilePhotoFile: null,
  schoolId: "",
  schoolName: "",
  schoolLogo: "",
  schoolType: ONBOARDING_DEFAULT_SCHOOL_TYPE,
  programme: "",
  programmeTags: [],
  programmeDurationYears: 0,
  gradeShort: "",
  gradeYearsRemaining: 0,
  graduationYearOffset: "",
  educationLevel: ONBOARDING_DEFAULT_SCHOOL_TYPE,
  school: "",
  year: "",
} as const;

export const ONBOARDING_SCREENS = {
  CHOICE: "choice",
  CONTACT: "contact",
  CREATE_ACCOUNT: "createAccount",
  VERIFY: "verify",
  PROFILE_PHOTO: "profilePhoto",
  SIGN_IN: "signIn",
  FORGOT_PASSWORD: "forgotPassword",
  NEW_PASSWORD: "newPassword",
  SCHOOL_TYPE: "schoolType",
  PROGRAMME: "programme",
  GRADE: "grade",
} as const;

export const ONBOARDING_INITIAL_SCREEN = ONBOARDING_SCREENS.CHOICE;

export const ONBOARDING_CONTACT_MODE_OPTIONS = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
] as const;

export const AUTH_FOOTER_STEP_LABELS = [
  "Create Account",
  "Verify",
  "Profile Photo",
] as const;

export const ONBOARDING_FOOTER_STEP_LABELS = [
  "Profile",
  "Campus",
  "Class",
] as const;

export const AUTH_FOOTER_STEP_BY_SCREEN: Record<
  OnboardingScreen,
  AuthFooterStepLabel | null
> = {
  choice: null,
  contact: null,
  createAccount: "Create Account",
  verify: "Verify",
  profilePhoto: null,
  signIn: null,
  forgotPassword: null,
  newPassword: null,
  schoolType: null,
  programme: null,
  grade: null,
};

export const ONBOARDING_FOOTER_STEP_BY_SCREEN: Record<
  OnboardingScreen,
  OnboardingFooterStepLabel | null
> = {
  choice: null,
  contact: null,
  createAccount: null,
  verify: null,
  profilePhoto: "Profile",
  signIn: null,
  forgotPassword: null,
  newPassword: null,
  schoolType: "Campus",
  programme: "Campus",
  grade: "Class",
};

export const ONBOARDING_VERIFY_RESEND_SECONDS = 57;

export const ONBOARDING_OTP_INPUT_FOCUS_DELAY_MS = 700;

export const ONBOARDING_DEMO_OTP = "123456";

export const ONBOARDING_GHANA_PHONE = {
  countryCode: "+233",
  flagSrc: "/ghana-flag.png",
  maxLength: 10,
  minLength: 9,
} as const;

export const ONBOARDING_REFERRAL_INFLUENCERS = LANDING_2_CHARACTERS.map(
  (character) => ({
    handle: character.name,
    label: character.name,
  }),
);

export const ONBOARDING_SOCIAL_PROOF = {
  name: "Amanda",
  quote: "Lock In makes it easy for me to take care of my mental health.",
  programme: "Human Biology (Medicine)",
  school: "Class of 2029, KNUST",
  rating: 4.9,
  ratingLabel: "Amanda's rating",
} as const;

export const ONBOARDING_COPY = {
  choice: {
    title: "Phone or Email?",
    subtitle: "We'll use this to get you started.",
    phoneLabel: "Phone",
    phoneDescription: "Use your Ghana mobile number",
    emailLabel: "Email",
    emailDescription: "Use the email on your account",
  },
  contact: {
    phoneTitle: "Drop Your Phone Number",
    emailTitle: "Drop Your Email",
    entrySubtitle:
      "We'll see if you're already locked in or just getting started.",
    phoneLabel: "Phone number",
    emailLabel: "Email",
    phonePlaceholder: "24 123 4567",
    emailPlaceholder: "you@example.com",
    countryLabel: "Ghana",
    phoneBoxLabel: "Phone Number",
    emailBoxLabel: "Email Address",
    outsideGhanaPrefix: "If you're outside Ghana, try ",
    outsideGhanaLink: "JustGo Health (Canada/USA version)",
    termsPrefix: "By continuing, you agree to ",
    termsLink: "JustGo Health Terms & Conditions",
    continue: "Continue",
  },
  policySheets: {
    canadaUs: {
      eyebrow: "Early Access",
      title: "JustGo Health Canada and USA.",
      scrollHint: "scroll to explore ↓",
    },
    terms: {
      eyebrow: "Legal",
      title: "Terms & Conditions",
      scrollHint: "scroll to read ↓",
    },
    closeLabel: "Close",
  },
  verify: {
    title: "Enter Verification Code",
    subtitlePrefix: "A 6-digit verification code was just sent to",
    resendPrefix: "Resend code in",
    resendReady: "Resend code",
    continue: "Continue",
  },
  createAccount: {
    title: "Create your LOCK IN account",
    subtitlePrefix: "You're using",
    subtitleSuffix: "for this account.",
    firstName: "First name",
    firstNamePlaceholder: "First name",
    lastName: "Last name",
    lastNamePlaceholder: "Last name",
    nickname: "Nickname",
    nicknamePlaceholder: "What should we call you?",
    gender: "Gender",
    dob: "Date of birth",
    dobBornOnPrefix: "You were born on",
    dobAgeSuffix: "y",
    password: "Password",
    passwordPlaceholder: "Create a password",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter your password",
    passwordMatch: "Passwords match",
    passwordMismatch: "Passwords do not match",
    showPassword: "SHOW",
    hidePassword: "HIDE",
    continue: "Continue",
  },
  profilePhoto: {
    title: "Add a profile photo",
    subtitle: "Help your campus community recognize you.",
    addPhoto: "Add photo",
    changePhoto: "Change photo",
    photoAdded: "Looking good!",
    photoAddedDescription: "Your photo is ready. Continue when you're set.",
  },
  signIn: {
    greetingPrefix: "Hey",
    subtitle: "Welcome back. Enter your password to continue.",
    password: "Password",
    passwordPlaceholder: "Your password",
    forgotPassword: "Forgot password?",
    continue: "Continue",
  },
  forgotPassword: {
    title: "Reset your password",
    subtitlePrefix: "We'll send a verification code to",
  },
  newPassword: {
    title: "Create a new password",
    subtitle: "Choose a strong password you'll remember.",
    password: "New password",
    confirmPassword: "Confirm new password",
    passwordMatch: "Passwords match",
    passwordMismatch: "Passwords do not match",
    continue: "Continue",
  },
  schoolType: {
    title: "Where do you study?",
    subtitle: "This helps us find your campus.",
    toggleTitle: "High School or College?",
    toggleSubtitle: "Pick your level so we can show the right schools.",
    pickerLabel: "Your school",
    pickerPlaceholder: "Search and select your school",
    pickerButton: "Find your school",
    pickerLoading: "Loading schools…",
    emptyResults: "No schools found. Try a different search.",
    clearSchool: "Clear selection",
    lockedInSuffix: "Locked In",
    modalTitle: "Select your school",
    searchPlaceholder: "Search schools…",
  },
  programme: {
    title: "What's your programme?",
    subtitle: "Pick the one you're studying — search if it's not in view.",
    label: "Programme",
    placeholder: "Search programmes…",
    emptyResults: "No programmes found. Try a different search.",
    clearProgramme: "Clear selection",
  },
  grade: {
    hsTitle: "What Grade Are You In?",
    collegeTitle: "What Year Are You In?",
    hsSubtitle: "Choosing this tells us your class.",
    collegeSubtitle: "Choosing this tells us your year of study.",
    hsSectionLabel: "Current Grade",
    collegeSectionLabel: "Current Year",
    submit: "Enter Lock In",
  },
  homeModal: {
    title: "You're locked in",
    subtitle: "Here's how your campus will see you.",
    cta: "Go to profile",
    dismiss: "Maybe later",
    ageLabel: "Age",
    genderLabel: "Gender",
    phoneLabel: "Phone",
    emailLabel: "Email",
    logout: "Logout",
  },
  toast: {
    onboardingComplete: "You're locked in! Welcome to your campus.",
  },
  referralPrefix: "Locking in with",
  referralOnly: "Locking in",
  referralPickerLabel: "Choose who you're locking in with",
  referralNone: "No influencer",
  progressAria: "Onboarding progress",
  back: "Back",
} as const;

export const ONBOARDING_GENDER_OPTIONS = [
  { value: "male", label: "Male", iconSrc: "/male.png" },
  { value: "female", label: "Female", iconSrc: "/femenine.png" },
] as const;

export const ONBOARDING_SCHOOL_TYPES = [
  {
    value: "high-school",
    label: "High School",
    description: "SHS, WASSCE, or equivalent",
  },
  {
    value: "college",
    label: "College",
    description: "University or tertiary",
  },
] as const;

export const ONBOARDING_PROGRAMMES = [
  {
    name: "Chemistry",
    tags: ["Chem", "BSc Chemistry", "Chemist", "Pre-Med Track"],
    durationYears: 4,
  },
  {
    name: "Human Biology (Medicine)",
    tags: ["Med", "MBChB", "Doctor", "Pre-Med"],
    durationYears: 6,
  },
  {
    name: "Electrical Engineering",
    tags: ["EE", "BSc EE", "Engineer", "Power & Electronics"],
    durationYears: 4,
  },
  {
    name: "Computer Science",
    tags: ["CS", "BSc CS", "Software Engineer", "Coding"],
    durationYears: 4,
  },
  {
    name: "Nursing",
    tags: ["Nursing", "BSc Nursing", "Nurse", "RN Track"],
    durationYears: 4,
  },
  {
    name: "Pharmacy",
    tags: ["Pharm", "PharmD", "Pharmacist", "Drugs & Meds"],
    durationYears: 4,
  },
  {
    name: "Law",
    tags: ["Law", "LLB", "Lawyer", "Legal Studies"],
    durationYears: 4,
  },
  {
    name: "Business Administration",
    tags: ["BA", "BBA", "Business", "Management"],
    durationYears: 4,
  },
  {
    name: "Economics",
    tags: ["Econ", "BSc Economics", "Economist", "Markets & Money"],
    durationYears: 4,
  },
  {
    name: "Psychology",
    tags: ["Psych", "BSc Psychology", "Psychologist", "Mind Science"],
    durationYears: 4,
  },
] as const;

export const ONBOARDING_HS_GRADE_OPTIONS = [
  {
    label: "Freshman (9th Grade)",
    short: "Freshman",
    yearsRemaining: 3,
    yearNumber: 1,
  },
  {
    label: "Sophomore (10th Grade)",
    short: "Sophomore",
    yearsRemaining: 2,
    yearNumber: 2,
  },
  {
    label: "Junior (11th Grade)",
    short: "Junior",
    yearsRemaining: 1,
    yearNumber: 3,
  },
  {
    label: "Senior (12th Grade)",
    short: "Senior",
    yearsRemaining: 0,
    yearNumber: 4,
  },
] as const;

export const ONBOARDING_COLLEGE_GRADE_OPTIONS = [
  {
    label: "Year 1 (Freshman)",
    short: "Freshman",
    yearsRemaining: 3,
    yearNumber: 1,
  },
  {
    label: "Year 2 (Sophomore)",
    short: "Sophomore",
    yearsRemaining: 2,
    yearNumber: 2,
  },
  {
    label: "Year 3 (Junior)",
    short: "Junior",
    yearsRemaining: 1,
    yearNumber: 3,
  },
  {
    label: "Year 4 (Senior)",
    short: "Senior",
    yearsRemaining: 0,
    yearNumber: 4,
  },
] as const;

export const ONBOARDING_POLICY_CANADA_SECTIONS = [
  {
    title: "Built for North America",
    body: "JustGo Health Canada and USA brings campus mental health support to students abroad — same belonging, same Lock In experience.",
  },
  {
    title: "Early adopters welcome",
    body: "Join the early adopters shaping Lock In 3.0 — powered by campus programs that actually move the needle.",
  },
] as const;

export const ONBOARDING_POLICY_TERMS_SECTIONS = [
  {
    title: "Your privacy matters",
    body: "We protect your data and never share your mental health information without your consent.",
  },
  {
    title: "Community guidelines",
    body: "Lock In is a safe space. Respect, kindness, and campus belonging guide everything we build.",
  },
] as const;

export const ONBOARDING_DOB_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const ONBOARDING_DOB_DAYS = Array.from({ length: 31 }, (_, index) =>
  String(index + 1),
);

export const ONBOARDING_DOB_YEAR_MIN = 1980;
export const ONBOARDING_DOB_YEAR_MAX = 2015;
export const ONBOARDING_DOB_DEFAULT_YEAR = "2005";

export const ONBOARDING_DOB_YEARS = Array.from(
  { length: ONBOARDING_DOB_YEAR_MAX - ONBOARDING_DOB_YEAR_MIN + 1 },
  (_, index) => String(ONBOARDING_DOB_YEAR_MAX - index),
);

export const ONBOARDING_SESSION_KEYS = {
  showHomeProfileModal: "patient:onboarding:show-home-modal",
  draft: "patient:onboarding:draft",
} as const;

export const ONBOARDING_AUTH_SCREENS: OnboardingScreen[] = [
  ONBOARDING_SCREENS.CHOICE,
  ONBOARDING_SCREENS.CONTACT,
  ONBOARDING_SCREENS.CREATE_ACCOUNT,
  ONBOARDING_SCREENS.VERIFY,
  ONBOARDING_SCREENS.PROFILE_PHOTO,
  ONBOARDING_SCREENS.SIGN_IN,
  ONBOARDING_SCREENS.FORGOT_PASSWORD,
  ONBOARDING_SCREENS.NEW_PASSWORD,
];

export const ONBOARDING_PHASE_SCREENS: OnboardingScreen[] = [
  ONBOARDING_SCREENS.SCHOOL_TYPE,
  ONBOARDING_SCREENS.PROGRAMME,
  ONBOARDING_SCREENS.GRADE,
];
