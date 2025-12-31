import "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js";

// Enable dark mode
document.documentElement.classList.add("cc--darkmode");

CookieConsent.run({
  guiOptions: {
    consentModal: {
      layout: "box inline",
      position: "bottom left",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },

    analytics: {
      services: {
        youtube: {
          label: "Youtube Embed",
          onAccept: () => im.acceptService("youtube"),
          onReject: () => im.rejectService("youtube"),
        },
        vimeo: {
          label: "Vimeo Embed",
          onAccept: () => im.acceptService("vimeo"),
          onReject: () => im.rejectService("vimeo"),
        },
      },
    },

    ads: {},
  },

  language: {
    default: "en",

    translations: {
      en: "./en.json",
    },
  },
});
