export const WAITLIST_CONTENT = {
  TITLE: "Join The Waitlist",
  SUBTITLE: "The Dwen Wo Ho campaign by JustGo Health",
  IMAGE: {
    SRC: "/cat.jpg",
    ALT: "cat",
  },
  FORM: {
    NAME_PLACEHOLDER: "Name",
    WHATSAPP_PLACEHOLDER: "WhatsApp No.",
    WHATSAPP_HELPER_TEXT:
      "Get exclusive access to our clinical team on WhatsApp now.",
    EMAIL_PLACEHOLDER: "Email",
    SUBMIT_BUTTON: "GO",
    LOADING_BUTTON: "Loading...",
  },
  MESSAGES: {
    SUCCESS: "Successfully joined the waitlist!",
    ALREADY_JOINED: "You have already joined the waitlist",
    ERROR_GENERIC: "Something went wrong",
  },
  BRAND: {
    NAME: "JustGo Health",
    SYMBOL: "⊕",
  },
  FIELDS: [
    {
      id: "fullName",
      type: "text",
      placeholder: "Name",
      required: true,
    },
    {
      id: "whatsappNumber",
      type: "tel",
      placeholder: "WhatsApp No.",
      required: true,
      helperText: "Get exclusive access to our clinical team on WhatsApp now.",
    },
    {
      id: "email",
      type: "email",
      placeholder: "Email",
      required: true,
    },
  ],
};
