export const CACHE_KEY_PREFIX = "lockin_form_cache_";
export const CACHE_DURATION = 5 * 60 * 1000;

export const LOCKIN_FREQUENCY_OPTIONS = [
  "never",
  "rarely",
  "sometimes",
  "often",
  "always",
];

export const LOCKIN_YES_NO_OPTIONS = ["yes", "no"];

export const LOCKIN_MOTIVATION_OPTIONS = [
  "none",
  "slightly",
  "moderate",
  "high",
];

export const LOCKIN_STUDY_FREQUENCY_OPTIONS = [
  "never",
  "rarely",
  "occasionally",
  "frequently",
  "always",
];

export const LOCKIN_TIME_TO_EXAM_OPTIONS = [
  "1d",
  "2d",
  "3d",
  "1w",
  "2w",
  "1m",
  "2m+",
];

export const LOCKIN_REASON_OPTIONS = ["exam", "assignment", "project", "other"];

export const LOCK_IN_TEXTS = {
  header: {
    title: "Student Lock In Form",
    subtitle: "Complete this form to register for the upcoming lock in session",
  },
  details: {
    title: "Lock In Details",
    reasonLabel: "Reason for Lock In",
    reasonPlaceholder: "Select reason",
    timeLabel: "Time to Exam",
    timePlaceholder: "Select time",
  },
  anxiety: {
    title: "Exam Anxiety",
    fields: [
      { name: "examWorrying", label: "Exam Worrying" },
      { name: "sleepProblems", label: "Sleep Problems" },
      { name: "fearOfFailure", label: "Fear of Failure" },
      { name: "feelingNervous", label: "Feeling Nervous" },
      {
        name: "sweatingOrHeartRacing",
        label: "Sweating or Heart Racing",
      },
      { name: "stomachUpset", label: "Stomach Upset" },
    ],
    placeholder: "Select frequency",
  },
  mentalHealth: {
    title: "Mental Health Assessment",
    frequencyFields: [
      { name: "feelingDepressed", label: "Feeling Depressed" },
      { name: "lossOfInterest", label: "Loss of Interest" },
      { name: "feelingLonely", label: "Feeling Lonely" },
    ],
    yesNoFields: [
      { name: "suicidalThoughts", label: "Suicidal Thoughts" },
      { name: "suicidalPlans", label: "Suicidal Plans" },
    ],
    frequencyPlaceholder: "Select frequency",
    yesNoPlaceholder: "Select",
  },
  personal: {
    title: "Personal Information",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    ageLabel: "Age",
    agePlaceholder: "Enter your age",
    sexLabel: "Sex",
    sexPlaceholder: "Select sex",
    sexOptions: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ],
    levelLabel: "Level",
    levelPlaceholder: "Enter your level (e.g., 2, 3, 4)",
  },
  study: {
    title: "Study Habits",
    motivationLabel: "Motivation to Study",
    motivationPlaceholder: "Select level",
    fields: [
      { name: "focusWhileStudying", label: "Focus While Studying" },
      { name: "activeStudying", label: "Active Studying" },
      { name: "activeRecall", label: "Active Recall" },
      { name: "lastMinuteStudying", label: "Last Minute Studying" },
    ],
    placeholder: "Select frequency",
  },
  buttons: {
    cancel: "Cancel",
    submit: "Submit Lock In",
    submitting: "Submitting...",
  },
};
