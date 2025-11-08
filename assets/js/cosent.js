// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Cookie consent script initialized");

  // Get all elements after DOM is loaded
  const consentBox = document.getElementById("consentBox");
  const customizeBtn = document.getElementById("customizeBtn");
  const rejectBtn = document.getElementById("rejectBtn");
  const acceptBtn = document.getElementById("acceptBtn");
  const customizePopup = document.getElementById("customizePopup");
  const closePopup = document.getElementById("closePopup");
  const popupRejectBtn = document.getElementById("popupRejectBtn");
  const savePreferences = document.getElementById("savePreferences");
  const popupAcceptBtn = document.getElementById("popupAcceptBtn");
  const analyticsCookies = document.getElementById("analyticsCookies");
  const marketingCookies = document.getElementById("marketingCookies");
  const consentOverlay = document.getElementById("consentOverlay");
  const ccpaLink = document.getElementById("ccpa-dnsmpi-link");

  // Verify all elements exist
  const elements = {
    consentBox,
    acceptBtn,
    rejectBtn,
    customizeBtn,
    savePreferences,
    popupAcceptBtn,
    popupRejectBtn,
    analyticsCookies,
    marketingCookies,
  };

  console.log("Elements found:", elements);

  // Cookie Functions
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Check if consent was already given
  function checkConsent() {
    const consentGiven = getCookie("cookie_consent");
    if (!consentGiven) {
      showConsentBox();
    } else {
      loadScriptsBasedOnConsent();
      if (isCaliforniaUser()) {
        initCcpaCompliance();
      }
    }
  }

  // UI Control Functions
  function showConsentBox() {
    if (consentBox) {
      consentBox.style.display = "block";
      console.log("Consent box shown");
    }
  }

  function hideConsentBox() {
    if (consentBox) {
      consentBox.style.display = "none";
      console.log("Consent box hidden");
    } else {
      console.error("Cannot hide consent box - element not found");
    }
  }

  function showCustomizePopup() {
    hideConsentBox();
    if (customizePopup && consentOverlay) {
      customizePopup.style.display = "block";
      consentOverlay.style.display = "block";
      document.body.style.overflow = "hidden";
      console.log("Customize popup shown");
    }
  }

  function hideCustomizePopup() {
    if (customizePopup && consentOverlay) {
      customizePopup.style.display = "none";
      consentOverlay.style.display = "none";
      document.body.style.overflow = "auto";
      console.log("Customize popup hidden");
    }
  }

  // Tracking cookies Scripts
  function loadNecessaryCookies() {
    setCookie("session_id", generateSessionId(), 1);
    setCookie("csrf_token", generateCsrfToken(), 1);
    setCookie("cookie_preferences_set", "true", 365);
  }

  function loadGoogleAnalytics() {
    if (getCookie("analytics_consent") !== "true") return;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "G-5SSQRTBJBV", {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-5SSQRTBJBV";
    document.head.appendChild(script);

    console.log("Google Analytics loaded with GDPR compliance");
  }

  function loadFacebookPixel() {
    if (getCookie("marketing_consent") !== "true") return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    fbq("init", "806099131735675", {
      em: "hashed_email_if_available",
      external_id: "hashed_user_id_if_available",
    });

    fbq("set", "autoConfig", false, "806099131735675");
    fbq("track", "PageView");

    console.log("Facebook Pixel loaded with GDPR compliance");
  }

  function loadHotjar() {
    if (getCookie("analytics_consent") !== "true") return;

    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script");
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");

    console.log("Hotjar loaded with GDPR compliance");
  }

  function loadGoogleAds() {
    if (getCookie("marketing_consent") !== "true") return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=AW_CONVERSION_ID";
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "AW_CONVERSION_ID", {
      allow_ad_personalization_signals: false,
    });

    console.log("Google Ads loaded with GDPR compliance");
  }

  // CCPA Compliance
  function isCaliforniaUser() {
    return (
      getCookie("ca_user") === "true" ||
      navigator.userAgent.includes("California") ||
      false
    );
  }

  function initCcpaCompliance() {
    ccpaLink.style.display = "block";

    ccpaLink.addEventListener("click", function (e) {
      e.preventDefault();
      handleCcpaOptOut();
    });

    console.log("CCPA compliance initialized");
  }

  function handleCcpaOptOut() {
    setCookie("ccpa_opt_out", "true", 365 * 5);

    if (getCookie("ccpa_opt_out") === "true") {
      if (window.fbq) {
        fbq("dataProcessingOptions", ["LDU"], 0, 0);
      }

      if (window.gtag) {
        gtag("set", "allow_ad_personalization_signals", false);
      }

      alert(
        "You have successfully opted out of the sale of your personal information under CCPA."
      );
    }
  }

  // Main Consent Functions
  function saveCookiePreferences(analytics, marketing, fromPopup = false) {
    console.log("Saving cookie preferences:", {
      analytics,
      marketing,
      fromPopup,
    });

    setCookie("cookie_consent", "true", 365);
    setCookie("analytics_consent", analytics.toString(), 365);
    setCookie("marketing_consent", marketing.toString(), 365);
    setCookie("consent_date", new Date().toISOString(), 365);

    console.log("Cookies saved. Loading scripts...");
    loadScriptsBasedOnConsent();

    if (isCaliforniaUser()) {
      initCcpaCompliance();
    }

    // Only hide popup if this was called from the popup
    if (fromPopup) {
      hideCustomizePopup();
    }

    console.log("Cookie preferences saved successfully");
  }

  function loadScriptsBasedOnConsent() {
    loadNecessaryCookies();

    if (getCookie("analytics_consent") === "true") {
      loadGoogleAnalytics();
      loadHotjar();
    }

    if (getCookie("marketing_consent") === "true") {
      loadFacebookPixel();
      loadGoogleAds();
    }
  }

  // Helper Functions
  function generateSessionId() {
    return "session_" + Math.random().toString(36).substr(2, 9);
  }

  function generateCsrfToken() {
    return "csrf_" + Math.random().toString(36).substr(2, 16);
  }

  // Event Listeners
  if (customizeBtn) {
    customizeBtn.addEventListener("click", showCustomizePopup);
    console.log("Customize button listener attached");
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      console.log("Reject All clicked");
      saveCookiePreferences(false, false);
      hideConsentBox();
    });
    console.log("Reject button listener attached");
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent any default behavior
      console.log("Accept All button clicked - starting process");
      console.log("Current consent box display:", consentBox?.style.display);

      // Save preferences with all consents accepted
      saveCookiePreferences(true, true);

      // Hide the consent box
      hideConsentBox();

      console.log("Accept All process completed");
      console.log("New consent box display:", consentBox?.style.display);
    });
    console.log("Accept button listener attached");
  }

  if (closePopup) {
    closePopup.addEventListener("click", hideCustomizePopup);
  }

  if (consentOverlay) {
    consentOverlay.addEventListener("click", hideCustomizePopup);
  }

  if (popupRejectBtn) {
    popupRejectBtn.addEventListener("click", () => {
      console.log("Popup Reject All clicked");
      analyticsCookies.checked = false;
      marketingCookies.checked = false;
      saveCookiePreferences(false, false, true);
    });
    console.log("Popup Reject button listener attached");
  }

  if (popupAcceptBtn) {
    popupAcceptBtn.addEventListener("click", () => {
      console.log("Popup Accept All clicked");
      analyticsCookies.checked = true;
      marketingCookies.checked = true;
      saveCookiePreferences(true, true, true);
    });
    console.log("Popup Accept button listener attached");
  }

  if (savePreferences) {
    savePreferences.addEventListener("click", () => {
      console.log("Save Preferences clicked", {
        analytics: analyticsCookies.checked,
        marketing: marketingCookies.checked,
      });
      saveCookiePreferences(
        analyticsCookies.checked,
        marketingCookies.checked,
        true
      );
    });
    console.log("Save Preferences button listener attached");
  }

  // Check consent on page load
  checkConsent();

  // For demo purposes - simulate California user
  if (new URLSearchParams(window.location.search).has("california")) {
    setCookie("ca_user", "true", 1);
  }

  console.log("Cookie consent initialization complete");
  console.log("Accept button:", acceptBtn);
  console.log("Accept button exists:", !!acceptBtn);
  console.log("Current cookie_consent value:", getCookie("cookie_consent"));

  // Add a test to see if we can manually trigger
  window.testAcceptButton = function () {
    console.log("Manual test triggered");
    if (acceptBtn) {
      acceptBtn.click();
    } else {
      console.error("Accept button not found for manual test");
    }
  };

  // Add function to clear consent cookies for testing
  window.clearConsentCookies = function () {
    document.cookie =
      "cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "analytics_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "marketing_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "consent_date=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log(
      "Consent cookies cleared. Reload the page to see the consent box."
    );
    location.reload();
  };

  console.log("Debug functions available:");
  console.log("- testAcceptButton() - Manually trigger accept button click");
  console.log("- clearConsentCookies() - Clear consent cookies and reload");
});
