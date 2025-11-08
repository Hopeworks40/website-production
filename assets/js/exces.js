let isTrackingMode = false;

function sendMessage() {
  const userInput = document.getElementById("botuserInput").value;
  if (userInput.trim() === "") return;

  displayMessage(userInput, "botuser");

  if (isTrackingMode) {
    processTrackingNumber(userInput);
  } else {
    const filteredInput = filterUserInput(userInput);
    if (filteredInput.includes("track") || filteredInput.includes("shipment")) {
      askForTracking();
    } else {
      const botResponse = getBotResponse(filteredInput);
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        displayMessage(botResponse, "botbot");
      }, 1500);
    }
  }

  document.getElementById("botuserInput").value = "";
}

function filterUserInput(input) {
  const words = input.toLowerCase().split(/\s+/);
  const stopwords = [
    "the",
    "is",
    "in",
    "and",
    "or",
    "of",
    "a",
    "an",
    "to",
    "for",
    "please",
  ];
  return words.filter((word) => !stopwords.includes(word)).join(" ");
}

function getBotResponse(input) {
  const responses = {
    hello: "Hi there! How can I help you?",
    hi: "Hello! How can I assist you?",
    help: "Sure, what do you need help with?",
    shipping: "We offer several shipping options. Please provide more details.",
    payment:
      "We accept various payment methods including credit cards and PayPal.",
    thanks: "You're welcome! Is there anything else I can assist you with?",
    days: "Delivery of cargo or shipments depends on several factors, including the Estimated Time of Departure (ETD) and the Estimated Time of Arrival (ETA). Typically, sea cargo can take anywhere from 45 days to 60 days and may delivered earlier depending on the distance between the origin and destination ports, countries, weather conditions, and any potential customs delays.",
    long: "Delivery of cargo or shipments depends on several factors, including the Estimated Time of Departure (ETD) and the Estimated Time of Arrival (ETA). Typically, sea cargo can take anywhere from 45 days to 60 days and may delivered earlier depending on the distance between the origin and destination ports, countries, weather conditions, and any potential customs delays.",
  };

  for (let key in responses) {
    if (input.includes(key)) {
      return responses[key];
    }
  }

  return "I'm sorry, I didn't understand that. Can you please rephrase? or give us a direct call";
}

function askForTracking() {
  displayMessage("Do you want to track your shipment?", "botbot");
  document.getElementById("inputArea").style.display = "none";
  document.getElementById("trackButtons").style.display = "flex";
}

function handleTrackResponse(isYes) {
  document.getElementById("inputArea").style.display = "flex";
  document.getElementById("trackButtons").style.display = "none";

  if (isYes) {
    displayMessage(
      "Please enter your tracking number or phone number.",
      "botbot"
    );
    isTrackingMode = true;
  } else {
    displayMessage("Okay! How else can I assist you?", "botbot");
  }
}

function processTrackingNumber(trackingNumber) {
  const cleanedTracking = trackingNumber.trim();

  if (!cleanedTracking) {
    displayMessage(
      "Please provide a valid tracking number or phone number.",
      "botbot"
    );
    isTrackingMode = false;
    return;
  }

  // Check if input is a phone number (starts with + or contains mostly digits)
  const digitsOnly = cleanedTracking.replace(/\D/g, "");
  const startsWithPlus = cleanedTracking.startsWith("+");
  const isPhoneNumber =
    (digitsOnly.length >= 8 && digitsOnly.length <= 15) || startsWithPlus;

  // Show loading message
  displayMessage(
    `🔍 Searching for ${
      isPhoneNumber ? "phone number" : "tracking number"
    }: ${cleanedTracking}...`,
    "botbot"
  );

  // Build query URL based on input type
  let url;
  if (isPhoneNumber) {
    // Search by phone number - use digits only for better matching
    url = `${window.SUPABASE_CONFIG.url}/rest/v1/bookings?or=(sender_phone.ilike.*${digitsOnly}*,receiver_phone.ilike.*${digitsOnly}*)&select=*,origin_location:origin_location_id(name),destination_location:destination_location_id(name)`;
  } else {
    // Search by tracking ID
    url = `${window.SUPABASE_CONFIG.url}/rest/v1/bookings?tracking_id=ilike.${cleanedTracking}&select=*,origin_location:origin_location_id(name),destination_location:destination_location_id(name)`;
  }

  fetch(url, {
    headers: {
      apikey: window.SUPABASE_CONFIG.anonKey,
      Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to connect to tracking system");
      }
      return response.json();
    })
    .then((data) => {
      if (!data || data.length === 0) {
        displayMessage(
          "❌ Sorry, the tracking number cannot be found. Please check and try again.",
          "botbot"
        );
      } else {
        const shipment = data[0];
        const origin =
          shipment.origin_location?.name || shipment.sender_city || "N/A";
        const destination =
          shipment.destination_location?.name ||
          shipment.receiver_city ||
          "N/A";
        const status = (shipment.status || "In Transit").replace(/_/g, " ");

        let deliveryInfo = "Pending";
        if (shipment.estimated_delivery) {
          const date = new Date(shipment.estimated_delivery);
          deliveryInfo = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } else if (shipment.delivery_days_min && shipment.delivery_days_max) {
          deliveryInfo = `${shipment.delivery_days_min}-${shipment.delivery_days_max} days`;
        }

        const trackingMessage = `
          ✅ <strong>Shipment Found!</strong><br><br>
          📦 <strong>Tracking ID:</strong> ${shipment.tracking_id || "N/A"}<br>
          📍 <strong>Origin:</strong> ${origin}<br>
          📍 <strong>Destination:</strong> ${destination}<br>
          🚚 <strong>Status:</strong> <span style="text-transform: capitalize;">${status}</span><br>
          📅 <strong>Est. Delivery:</strong> ${deliveryInfo}<br><br>
          <em>Click on the tracking section to view full details.</em>
        `;

        displayMessage(trackingMessage, "botbot");

        // Optionally, trigger the modal if the showShipmentModal function is available
        if (typeof showShipmentModal === "function") {
          setTimeout(() => {
            showShipmentModal(shipment);
          }, 1000);
        }
      }
    })
    .catch((error) => {
      console.error("Tracking error:", error);
      displayMessage(
        "⚠️ Error tracking shipment. Please try again later or contact support.",
        "botbot"
      );
    })
    .finally(() => {
      isTrackingMode = false;
    });
}

function displayMessage(message, sender) {
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("div");
  messageElement.className = `message-bot ${sender}`;
  if (sender === "botbot") {
    messageElement.innerHTML = `<img src="./assets/img/brand/logo-small-icon.png" alt="Bot Icon" class="bot-icon"><div class="message-content">${message}</div>`;
  } else {
    messageElement.innerHTML = `<div class="user-mc">${message}</div><img src="user-icon.png" alt="User Icon" class="botuser-icon">`;
  }
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chatBox");
  const typingIndicator = document.createElement("div");
  typingIndicator.className = "typing-indicator";
  typingIndicator.innerHTML =
    '<img src="./assets/img/brand/logo-small-icon.png" alt="Bot Icon" class="bot-icon"><div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  typingIndicator.id = "typing-indicator";
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function clearChat() {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";
}

function showWelcomeMessage() {
  displayMessage(
    "Hello! <br> How can I assist you today? <br><br> Dear Valued Customer, Homeway Express is undertaking an upgrade <br><br>As a result, you may experience some disruptions in some services during this period. <br><br> We apologize for any inconvenience this may cause. Thank you for your understanding. ",
    "botbot"
  );
}
function showWelcomeMessagex() {
  displayMessage(
    "Hello! <br> How can I assist you today? <br><br> Dear Valued Customer, Homeway Express is undertaking an upgrade <br><br>As a result, you may experience some disruptions in some services during this period. <br><br> We apologize for any inconvenience this may cause. Thank you for your understanding. ",
    "botbot"
  );
}

// coolies consent
/*window.addEventListener("scroll", () => {
  const overlay = document.querySelector(".consentbox-content");
  const scrollY = window.scrollY || window.pageYOffset;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  if (scrollY + windowHeight >= documentHeight - 100) {
    // Adjust the threshold as needed
    overlay.style.position = "absolute";
  } else {
    overlay.style.position = "fixed";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const consentBox = document.getElementById("consentBox");
  const customizeBtn = document.getElementById("customizeBtn");
  const rejectBtn = document.getElementById("rejectBtn");
  const acceptBtn = document.getElementById("acceptBtn");
  const customizePopup = document.getElementById("customizePopup");
  const closePopup = document.getElementById("closePopup");
  const savePreferencesBtn = document.getElementById("savePreferences");

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  function updateConsentState(preferences) {
    gtag("consent", "update", {
      ad_storage: preferences.marketing ? "granted" : "denied",
      analytics_storage: preferences.analytics ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: preferences.marketing ? "granted" : "denied",
      security_storage: "granted",
    });
  }

  function savePreferences() {
    const analytics = document.getElementById("analyticsCookies").checked;
    const marketing = document.getElementById("marketingCookies").checked;
    const preferences = { analytics, marketing };
    setCookie("cookiePreferences", JSON.stringify(preferences), 365);
    updateConsentState(preferences);
    hideConsentElements();
  }

  closePopup.addEventListener("click", () => {
    customizePopup.style.display = "none";
    consentBox.style.display = "block";
  });

  customizeBtn.addEventListener("click", function () {
    customizePopup.style.display = "block";
    consentBox.style.display = "none";
  });

  rejectBtn.addEventListener("click", function () {
    const preferences = { analytics: false, marketing: false };
    setCookie("cookiePreferences", JSON.stringify(preferences), 365);
    updateConsentState(preferences);
    hideConsentElements();
  });

  acceptBtn.addEventListener("click", function () {
    const preferences = { analytics: true, marketing: true };
    setCookie("cookiePreferences", JSON.stringify(preferences), 365);
    updateConsentState(preferences);
    hideConsentElements();
  });

  savePreferencesBtn.addEventListener("click", savePreferences);
});*/

//////////////////// flyer popup /////////////////////
// Show the flyer popup when the page loads

document.addEventListener("DOMContentLoaded", function () {
  // Get the popup element
  var popupxp = document.getElementById("flyerPopup");

  // Display the popup after the page loads
  popupxp.style.display = "block";

  // Get the close button element
  var closeBtnxp = document.getElementById("closePopuppo");

  // Close the popup when the user clicks the close button
  closeBtnxp.onclick = function () {
    popupxp.style.display = "none";
  };
});

function toggleChatbot() {
  const chatbotContainer = document.getElementById("chatbotContainer");

  const openChatbotBtn = document.getElementById("Pkchatbuton-1337");
  const isOpen = chatbotContainer.style.display === "flex";

  if (isOpen) {
    clearChat();
    chatbotContainer.style.display = "none";
    openChatbotBtn.style.display = "block";
    openChatbotBtn.setAttribute("aria-expanded", "false");
  } else {
    chatbotContainer.style.display = "flex";
    openChatbotBtn.style.display = "none";
    openChatbotBtn.setAttribute("aria-expanded", "true");
    showWelcomeMessage();
  }
}

//////////// mobile tracking ////////////////////
// International country
document.addEventListener("DOMContentLoaded", function () {
  var input = document.querySelector("#cellcalling");
  var iti = window.intlTelInput(input, {
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@24.3.4/build/js/utils.js",
    separateDialCode: true,
    initialCountry: "auto",
    preferredCountries: ["ae", "gh", "us", "gb", "ca", "au"],
    geoIpLookup: function (success, failure) {
      fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => success(data.country_code))
        .catch(() => success("us"));
    },
  });
});

///////// Homeway/////
document.getElementById("mb-track-awb").addEventListener("click", function () {
  const awbNumbermb = document.getElementById("mb-awb-number").value.trim();
  const errorElementmb = document.getElementById("mb-errortextMessage");

  function sanitizeInput(input) {
    return input.replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m];
    });
  }

  // 1. Validate the input when the button is pressed
  const regex = /^HWE\d+[A-Za-z]$/;
  if (!regex.test(awbNumbermb)) {
    // 2. Display an error message if the input format is incorrect
    errorElementmb.textContent = "Please enter a valid Homeway Express Number";
    return;
  }

  // Clear any previous error message
  errorElementmb.textContent = "";

  /*const sanitizedAwbNumber = sanitizeInput(awbNumbermb);*/

  // 3. Create and display a popup modal
  const popen = document.createElement("div");
  popen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
      z-index: 1000;
      min-width: 300px;
      text-align: center;
      width: 100%;
      height: 100%;
      background: rgba(76, 24, 78, 0.5);
  `;

  // Add loading animation
  popen.innerHTML = '<div class="loaderroam"></div>';

  document.body.appendChild(popen);

  // 4. Fetch details and display if the input details are valid
  fetch(`u`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    mode: "cors",
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setTimeout(() => {
        if (data && data.isValid) {
          // Display fetched details
          popen.innerHTML = `
        <div id="mbmodalpop-content">
          <h2>Tracking Details for </h2>
            <p>Status: </p>
            <p>Location: </p>
            <p>Last Updated: </p>
            <button id="close-modal">Close</button>
        </div>
            
        `;
        } else {
          // Display error image and message
          popen.innerHTML = `
          <div id="mbmodalpop-content">
            <div class="mbmodalpop-inside">
             <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><rect width="50" height="50" fill="#39073b" rx="4" opacity="1" data-original="#ffac00" class=""></rect><path fill="#f6f6f6" d="M50 32v18H32v-1a17 17 0 0 1 17-17z" opacity="1" data-original="#ea9706" class=""></path><circle cx="49" cy="49" r="15" fill="#f26925" opacity="1" data-original="#93e6e5" class=""></circle><circle cx="49" cy="49" r="12" fill="#39073b" opacity="1" data-original="#50d9d7" class=""></circle><g fill="#f3f3f3"><path d="M32 0v12.5a1.5 1.5 0 0 1-1.5 1.5 1.54 1.54 0 0 1-.9-.3l-2.8-2.1A3 3 0 0 0 25 11a3 3 0 0 0-1.8.6l-2.8 2.1a1.54 1.54 0 0 1-.9.3 1.5 1.5 0 0 1-1.5-1.5V0zM45 54a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l8-8a1 1 0 0 1 1.42 1.42l-8 8A1 1 0 0 1 45 54z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M53 54a1 1 0 0 1-.71-.29l-8-8a1 1 0 0 1 1.42-1.42l8 8a1 1 0 0 1 0 1.42A1 1 0 0 1 53 54zM9 38a1 1 0 0 1-.71-.29L7 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 9 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M7 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 38a1 1 0 0 1-.71-.29L15 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 17 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M15 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 47H5a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path></g></g></svg>
             <p>We couldn't find any cargo, shipment, or containers available</p>
             <button id="close-modal">Close</button>
            </div>
          </div>
            
        `;
        }

        document
          .getElementById("close-modal")
          .addEventListener("click", function () {
            document.body.removeChild(popen);
          });
      }, 2000);
    })
    .catch((error) => {
      setTimeout(() => {
        // Display error image and message for network errors
        popen.innerHTML = `
       <div id="mbmodalpop-content">
          <div class="mbmodalpop-inside">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><rect width="50" height="50" fill="#39073b" rx="4" opacity="1" data-original="#ffac00" class=""></rect><path fill="#f6f6f6" d="M50 32v18H32v-1a17 17 0 0 1 17-17z" opacity="1" data-original="#ea9706" class=""></path><circle cx="49" cy="49" r="15" fill="#f26925" opacity="1" data-original="#93e6e5" class=""></circle><circle cx="49" cy="49" r="12" fill="#39073b" opacity="1" data-original="#50d9d7" class=""></circle><g fill="#f3f3f3"><path d="M32 0v12.5a1.5 1.5 0 0 1-1.5 1.5 1.54 1.54 0 0 1-.9-.3l-2.8-2.1A3 3 0 0 0 25 11a3 3 0 0 0-1.8.6l-2.8 2.1a1.54 1.54 0 0 1-.9.3 1.5 1.5 0 0 1-1.5-1.5V0zM45 54a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l8-8a1 1 0 0 1 1.42 1.42l-8 8A1 1 0 0 1 45 54z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M53 54a1 1 0 0 1-.71-.29l-8-8a1 1 0 0 1 1.42-1.42l8 8a1 1 0 0 1 0 1.42A1 1 0 0 1 53 54zM9 38a1 1 0 0 1-.71-.29L7 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 9 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M7 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 38a1 1 0 0 1-.71-.29L15 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 17 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M15 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 47H5a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path></g></g></svg>
            <p>We couldn't find any cargo, shipment, or containers available</p>
            <button id="close-modal">Close</button>
         </div>
        </div>
        
    `;
        console.error("There was a problem with the fetch operation:", error);

        document
          .getElementById("close-modal")
          .addEventListener("click", function () {
            document.body.removeChild(popen);
          });
      }, 2000);
    });
});

///////// Homeway plus/////
document
  .getElementById("mbtrack-order-id")
  .addEventListener("click", function () {
    const mborderIdinput = document
      .getElementById("mborder-id-input")
      .value.trim();
    const orderiderrorElement = document.getElementById(
      "mborder-id-errortextMessage"
    );

    function sanitizeInput(input) {
      return input.replace(/[&<>"']/g, function (m) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m];
      });
    }

    // 1. Validate the input when the button is pressed
    const regex = /^HWE\d+[A-Za-z]$/;
    if (!regex.test(mborderIdinput)) {
      // 2. Display an error message if the input format is incorrect
      orderiderrorElement.textContent =
        "Please enter a valid ORDER ID / Trackboo NUMBER / Homeway Express+";
      return;
    }

    // Clear any previous error message
    orderiderrorElement.textContent = "";

    /*const sanitizedAwbNumber = sanitizeInput(awbNumbermb);*/

    // 3. Create and display a popup modal
    const popenorder = document.createElement("div");
    popenorder.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
      z-index: 1000;
      min-width: 300px;
      text-align: center;
      width: 100%;
      height: 100%;
      background: rgba(76, 24, 78, 0.5);
  `;

    // Add loading animation
    popenorder.innerHTML = '<div class="loaderroam"></div>';

    document.body.appendChild(popenorder);

    // 4. Fetch details and display if the input details are valid
    fetch(`u`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      mode: "cors",
      credentials: "same-origin",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTimeout(() => {
          if (data && data.isValid) {
            // Display fetched details
            popenorder.innerHTML = `
        <div id="mbmodalpop-content">
          <h2>Tracking Details for </h2>
            <p>Status: </p>
            <p>Location: </p>
            <p>Last Updated: </p>
            <button id="close-modal">Close</button>
        </div>
            
        `;
          } else {
            // Display error image and message
            popenorder.innerHTML = `
          <div id="mbmodalpop-content">
            <div class="mbmodalpop-inside">
             <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><rect width="50" height="50" fill="#39073b" rx="4" opacity="1" data-original="#ffac00" class=""></rect><path fill="#f6f6f6" d="M50 32v18H32v-1a17 17 0 0 1 17-17z" opacity="1" data-original="#ea9706" class=""></path><circle cx="49" cy="49" r="15" fill="#f26925" opacity="1" data-original="#93e6e5" class=""></circle><circle cx="49" cy="49" r="12" fill="#39073b" opacity="1" data-original="#50d9d7" class=""></circle><g fill="#f3f3f3"><path d="M32 0v12.5a1.5 1.5 0 0 1-1.5 1.5 1.54 1.54 0 0 1-.9-.3l-2.8-2.1A3 3 0 0 0 25 11a3 3 0 0 0-1.8.6l-2.8 2.1a1.54 1.54 0 0 1-.9.3 1.5 1.5 0 0 1-1.5-1.5V0zM45 54a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l8-8a1 1 0 0 1 1.42 1.42l-8 8A1 1 0 0 1 45 54z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M53 54a1 1 0 0 1-.71-.29l-8-8a1 1 0 0 1 1.42-1.42l8 8a1 1 0 0 1 0 1.42A1 1 0 0 1 53 54zM9 38a1 1 0 0 1-.71-.29L7 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 9 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M7 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 38a1 1 0 0 1-.71-.29L15 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 17 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M15 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 47H5a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path></g></g></svg>
             <p>We couldn't find any cargo, shipment, or containers available</p>
             <button id="close-modal">Close</button>
            </div>
          </div>
            
        `;
          }

          document
            .getElementById("close-modal")
            .addEventListener("click", function () {
              document.body.removeChild(popenorder);
            });
        }, 2000);
      })
      .catch((error) => {
        setTimeout(() => {
          // Display error image and message for network errors
          popenorder.innerHTML = `
       <div id="mbmodalpop-content">
          <div class="mbmodalpop-inside">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><rect width="50" height="50" fill="#39073b" rx="4" opacity="1" data-original="#ffac00" class=""></rect><path fill="#f6f6f6" d="M50 32v18H32v-1a17 17 0 0 1 17-17z" opacity="1" data-original="#ea9706" class=""></path><circle cx="49" cy="49" r="15" fill="#f26925" opacity="1" data-original="#93e6e5" class=""></circle><circle cx="49" cy="49" r="12" fill="#39073b" opacity="1" data-original="#50d9d7" class=""></circle><g fill="#f3f3f3"><path d="M32 0v12.5a1.5 1.5 0 0 1-1.5 1.5 1.54 1.54 0 0 1-.9-.3l-2.8-2.1A3 3 0 0 0 25 11a3 3 0 0 0-1.8.6l-2.8 2.1a1.54 1.54 0 0 1-.9.3 1.5 1.5 0 0 1-1.5-1.5V0zM45 54a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l8-8a1 1 0 0 1 1.42 1.42l-8 8A1 1 0 0 1 45 54z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M53 54a1 1 0 0 1-.71-.29l-8-8a1 1 0 0 1 1.42-1.42l8 8a1 1 0 0 1 0 1.42A1 1 0 0 1 53 54zM9 38a1 1 0 0 1-.71-.29L7 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 9 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M7 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 38a1 1 0 0 1-.71-.29L15 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 17 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M15 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 47H5a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path></g></g></svg>
            <p>We couldn't find any cargo, shipment, or containers available</p>
            <button id="close-modal">Close</button>
         </div>
        </div>
        
    `;
          console.error("There was a problem with the fetch operation:", error);

          document
            .getElementById("close-modal")
            .addEventListener("click", function () {
              document.body.removeChild(popenorder);
            });
        }, 2000);
      });
  });

////////////////
// searching office search

document.addEventListener("DOMContentLoaded", function () {
  const mfdSearchInput = document.getElementById(
    "mbfd-office-findersearchicom"
  );
  const mfdSearchResults = document.getElementById(
    "mbfd-findofficesearch-results"
  );
  const mfdLoadingAnimation = document.querySelector(
    ".mbfd-loading-animationfindofficesearch"
  );
  const mfdFindButton = document.getElementById("mbfd-find-offi");
  const mfdErrorMessage = document.getElementById(
    "mbfd-find-office-errortextMessage"
  );

  // Sample data (replace with your actual data)

  const mfdCountries = [
    { name: "Afghanistan", code: "AF", phone: 93, continent: "Asia" },
    { name: "Aland Islands", code: "AX", phone: 358, continent: "Europe" },
    { name: "Albania", code: "AL", phone: 355, continent: "Europe" },
    { name: "Algeria", code: "DZ", phone: 213, continent: "Africa" },
    { name: "American Samoa", code: "AS", phone: 1684, continent: "Oceania" },
    { name: "Andorra", code: "AD", phone: 376, continent: "Europe" },
    { name: "Angola", code: "AO", phone: 244, continent: "Africa" },
    { name: "Anguilla", code: "AI", phone: 1264, continent: "North America" },
    { name: "Antarctica", code: "AQ", phone: 672, continent: "Antarctica" },
    {
      name: "Antigua and Barbuda",
      code: "AG",
      phone: 1268,
      continent: "North America",
    },
    { name: "Argentina", code: "AR", phone: 54, continent: "South America" },
    { name: "Armenia", code: "AM", phone: 374, continent: "Asia" },
    { name: "Aruba", code: "AW", phone: 297, continent: "North America" },
    { name: "Australia", code: "AU", phone: 61, continent: "Oceania" },
    { name: "Austria", code: "AT", phone: 43, continent: "Europe" },
    { name: "Azerbaijan", code: "AZ", phone: 994, continent: "Asia" },
    { name: "Bahamas", code: "BS", phone: 1242, continent: "North America" },
    { name: "Bahrain", code: "BH", phone: 973, continent: "Asia" },
    { name: "Bangladesh", code: "BD", phone: 880, continent: "Asia" },
    { name: "Barbados", code: "BB", phone: 1246, continent: "North America" },
    { name: "Belarus", code: "BY", phone: 375, continent: "Europe" },
    { name: "Belgium", code: "BE", phone: 32, continent: "Europe" },
    { name: "Belize", code: "BZ", phone: 501, continent: "North America" },
    { name: "Benin", code: "BJ", phone: 229, continent: "Africa" },
    { name: "Bermuda", code: "BM", phone: 1441, continent: "North America" },
    { name: "Bhutan", code: "BT", phone: 975, continent: "Asia" },
    { name: "Bolivia", code: "BO", phone: 591, continent: "South America" },
    {
      name: "Bonaire, Sint Eustatius and Saba",
      code: "BQ",
      phone: 599,
      continent: "North America",
    },
    {
      name: "Bosnia and Herzegovina",
      code: "BA",
      phone: 387,
      continent: "Europe",
    },
    { name: "Botswana", code: "BW", phone: 267, continent: "Africa" },
    { name: "Bouvet Island", code: "BV", phone: 55, continent: "Antarctica" },
    { name: "Brazil", code: "BR", phone: 55, continent: "South America" },
    {
      name: "British Indian Ocean Territory",
      code: "IO",
      phone: 246,
      continent: "Asia",
    },
    { name: "Brunei Darussalam", code: "BN", phone: 673, continent: "Asia" },
    { name: "Bulgaria", code: "BG", phone: 359, continent: "Europe" },
    { name: "Burkina Faso", code: "BF", phone: 226, continent: "Africa" },
    { name: "Burundi", code: "BI", phone: 257, continent: "Africa" },
    { name: "Cambodia", code: "KH", phone: 855, continent: "Asia" },
    { name: "Cameroon", code: "CM", phone: 237, continent: "Africa" },
    { name: "Canada", code: "CA", phone: 1, continent: "North America" },
    { name: "Cape Verde", code: "CV", phone: 238, continent: "Africa" },
    {
      name: "Cayman Islands",
      code: "KY",
      phone: 1345,
      continent: "North America",
    },
    {
      name: "Central African Republic",
      code: "CF",
      phone: 236,
      continent: "Africa",
    },
    { name: "Chad", code: "TD", phone: 235, continent: "Africa" },
    { name: "Chile", code: "CL", phone: 56, continent: "South America" },
    { name: "China", code: "CN", phone: 86, continent: "Asia" },
    { name: "Christmas Island", code: "CX", phone: 61, continent: "Asia" },
    {
      name: "Cocos (Keeling) Islands",
      code: "CC",
      phone: 672,
      continent: "Asia",
    },
    { name: "Colombia", code: "CO", phone: 57, continent: "South America" },
    { name: "Comoros", code: "KM", phone: 269, continent: "Africa" },
    { name: "Congo", code: "CG", phone: 242, continent: "Africa" },
    {
      name: "Congo, Democratic Republic of the Congo",
      code: "CD",
      phone: 242,
      continent: "Africa",
    },
    { name: "Cook Islands", code: "CK", phone: 682, continent: "Oceania" },
    { name: "Costa Rica", code: "CR", phone: 506, continent: "North America" },
    { name: "Cote D'Ivoire", code: "CI", phone: 225, continent: "Africa" },
    { name: "Croatia", code: "HR", phone: 385, continent: "Europe" },
    { name: "Cuba", code: "CU", phone: 53, continent: "North America" },
    { name: "Curacao", code: "CW", phone: 599, continent: "North America" },
    { name: "Cyprus", code: "CY", phone: 357, continent: "Asia" },
    { name: "Czech Republic", code: "CZ", phone: 420, continent: "Europe" },
    { name: "Denmark", code: "DK", phone: 45, continent: "Europe" },
    { name: "Djibouti", code: "DJ", phone: 253, continent: "Africa" },
    { name: "Dominica", code: "DM", phone: 1767, continent: "North America" },
    {
      name: "Dominican Republic",
      code: "DO",
      phone: 1809,
      continent: "North America",
    },
    { name: "Ecuador", code: "EC", phone: 593, continent: "South America" },
    { name: "Egypt", code: "EG", phone: 20, continent: "Africa" },
    { name: "El Salvador", code: "SV", phone: 503, continent: "North America" },
    { name: "Equatorial Guinea", code: "GQ", phone: 240, continent: "Africa" },
    { name: "Eritrea", code: "ER", phone: 291, continent: "Africa" },
    { name: "Estonia", code: "EE", phone: 372, continent: "Europe" },
    { name: "Ethiopia", code: "ET", phone: 251, continent: "Africa" },
    {
      name: "Falkland Islands (Malvinas)",
      code: "FK",
      phone: 500,
      continent: "South America",
    },
    { name: "Faroe Islands", code: "FO", phone: 298, continent: "Europe" },
    { name: "Fiji", code: "FJ", phone: 679, continent: "Oceania" },
    { name: "Finland", code: "FI", phone: 358, continent: "Europe" },
    { name: "France", code: "FR", phone: 33, continent: "Europe" },
    {
      name: "French Guiana",
      code: "GF",
      phone: 594,
      continent: "South America",
    },
    { name: "French Polynesia", code: "PF", phone: 689, continent: "Oceania" },
    {
      name: "French Southern Territories",
      code: "TF",
      phone: 262,
      continent: "Antarctica",
    },
    { name: "Gabon", code: "GA", phone: 241, continent: "Africa" },
    { name: "Gambia", code: "GM", phone: 220, continent: "Africa" },
    { name: "Georgia", code: "GE", phone: 995, continent: "Asia" },
    { name: "Germany", code: "DE", phone: 49, continent: "Europe" },
    { name: "Ghana", code: "GH", phone: 233, continent: "Africa" },
    { name: "Gibraltar", code: "GI", phone: 350, continent: "Europe" },
    { name: "Greece", code: "GR", phone: 30, continent: "Europe" },
    { name: "Greenland", code: "GL", phone: 299, continent: "North America" },
    { name: "Grenada", code: "GD", phone: 1473, continent: "North America" },
    { name: "Guadeloupe", code: "GP", phone: 590, continent: "North America" },
    { name: "Guam", code: "GU", phone: 1671, continent: "Oceania" },
    { name: "Guatemala", code: "GT", phone: 502, continent: "North America" },
    { name: "Guernsey", code: "GG", phone: 44, continent: "Europe" },
    { name: "Guinea", code: "GN", phone: 224, continent: "Africa" },
    { name: "Guinea-Bissau", code: "GW", phone: 245, continent: "Africa" },
    { name: "Guyana", code: "GY", phone: 592, continent: "South America" },
    { name: "Haiti", code: "HT", phone: 509, continent: "North America" },
    {
      name: "Heard Island and McDonald Islands",
      code: "HM",
      phone: 0,
      continent: "Antarctica",
    },
    {
      name: "Holy See (Vatican City State)",
      code: "VA",
      phone: 39,
      continent: "Europe",
    },
    { name: "Honduras", code: "HN", phone: 504, continent: "North America" },
    { name: "Hong Kong", code: "HK", phone: 852, continent: "Asia" },
    { name: "Hungary", code: "HU", phone: 36, continent: "Europe" },
    { name: "Iceland", code: "IS", phone: 354, continent: "Europe" },
    { name: "India", code: "IN", phone: 91, continent: "Asia" },
    { name: "Indonesia", code: "ID", phone: 62, continent: "Asia" },
    {
      name: "Iran, Islamic Republic of",
      code: "IR",
      phone: 98,
      continent: "Asia",
    },
    { name: "Iraq", code: "IQ", phone: 964, continent: "Asia" },
    { name: "Ireland", code: "IE", phone: 353, continent: "Europe" },
    { name: "Isle of Man", code: "IM", phone: 44, continent: "Europe" },
    { name: "Israel", code: "IL", phone: 972, continent: "Asia" },
    { name: "Italy", code: "IT", phone: 39, continent: "Europe" },
    { name: "Jamaica", code: "JM", phone: 1876, continent: "North America" },
    { name: "Japan", code: "JP", phone: 81, continent: "Asia" },
    { name: "Jersey", code: "JE", phone: 44, continent: "Europe" },
    { name: "Jordan", code: "JO", phone: 962, continent: "Asia" },
    { name: "Kazakhstan", code: "KZ", phone: 7, continent: "Asia" },
    { name: "Kenya", code: "KE", phone: 254, continent: "Africa" },
    { name: "Kiribati", code: "KI", phone: 686, continent: "Oceania" },
    {
      name: "Korea, Democratic People's Republic of",
      code: "KP",
      phone: 850,
      continent: "Asia",
    },
    { name: "Korea, Republic of", code: "KR", phone: 82, continent: "Asia" },
    { name: "Kosovo", code: "XK", phone: 383, continent: "Europe" },
    { name: "Kuwait", code: "KW", phone: 965, continent: "Asia" },
    { name: "Kyrgyzstan", code: "KG", phone: 996, continent: "Asia" },
    {
      name: "Lao People's Democratic Republic",
      code: "LA",
      phone: 856,
      continent: "Asia",
    },
    { name: "Latvia", code: "LV", phone: 371, continent: "Europe" },
    { name: "Lebanon", code: "LB", phone: 961, continent: "Asia" },
    { name: "Lesotho", code: "LS", phone: 266, continent: "Africa" },
    { name: "Liberia", code: "LR", phone: 231, continent: "Africa" },
    {
      name: "Libyan Arab Jamahiriya",
      code: "LY",
      phone: 218,
      continent: "Africa",
    },
    { name: "Liechtenstein", code: "LI", phone: 423, continent: "Europe" },
    { name: "Lithuania", code: "LT", phone: 370, continent: "Europe" },
    { name: "Luxembourg", code: "LU", phone: 352, continent: "Europe" },
    { name: "Macao", code: "MO", phone: 853, continent: "Asia" },
    {
      name: "Macedonia, the Former Yugoslav Republic of",
      code: "MK",
      phone: 389,
      continent: "Europe",
    },
    { name: "Madagascar", code: "MG", phone: 261, continent: "Africa" },
    { name: "Malawi", code: "MW", phone: 265, continent: "Africa" },
    { name: "Malaysia", code: "MY", phone: 60, continent: "Asia" },
    { name: "Maldives", code: "MV", phone: 960, continent: "Asia" },
    { name: "Mali", code: "ML", phone: 223, continent: "Africa" },
    { name: "Malta", code: "MT", phone: 356, continent: "Europe" },
    { name: "Marshall Islands", code: "MH", phone: 692, continent: "Oceania" },
    { name: "Martinique", code: "MQ", phone: 596, continent: "North America" },
    { name: "Mauritania", code: "MR", phone: 222, continent: "Africa" },
    { name: "Mauritius", code: "MU", phone: 230, continent: "Africa" },
    { name: "Mayotte", code: "YT", phone: 262, continent: "Africa" },
    { name: "Mexico", code: "MX", phone: 52, continent: "North America" },
    {
      name: "Micronesia, Federated States of",
      code: "FM",
      phone: 691,
      continent: "Oceania",
    },
    {
      name: "Moldova, Republic of",
      code: "MD",
      phone: 373,
      continent: "Europe",
    },
    { name: "Monaco", code: "MC", phone: 377, continent: "Europe" },
    { name: "Mongolia", code: "MN", phone: 976, continent: "Asia" },
    { name: "Montenegro", code: "ME", phone: 382, continent: "Europe" },
    { name: "Montserrat", code: "MS", phone: 1664, continent: "North America" },
    { name: "Morocco", code: "MA", phone: 212, continent: "Africa" },
    { name: "Mozambique", code: "MZ", phone: 258, continent: "Africa" },
    { name: "Myanmar", code: "MM", phone: 95, continent: "Asia" },
    { name: "Namibia", code: "NA", phone: 264, continent: "Africa" },
    { name: "Nauru", code: "NR", phone: 674, continent: "Oceania" },
    { name: "Nepal", code: "NP", phone: 977, continent: "Asia" },
    { name: "Netherlands", code: "NL", phone: 31, continent: "Europe" },
    {
      name: "Netherlands Antilles",
      code: "AN",
      phone: 599,
      continent: "North America",
    },
    { name: "New Caledonia", code: "NC", phone: 687, continent: "Oceania" },
    { name: "New Zealand", code: "NZ", phone: 64, continent: "Oceania" },
    { name: "Nicaragua", code: "NI", phone: 505, continent: "North America" },
    { name: "Niger", code: "NE", phone: 227, continent: "Africa" },
    { name: "Nigeria", code: "NG", phone: 234, continent: "Africa" },
    { name: "Niue", code: "NU", phone: 683, continent: "Oceania" },
    { name: "Norfolk Island", code: "NF", phone: 672, continent: "Oceania" },
    {
      name: "Northern Mariana Islands",
      code: "MP",
      phone: 1670,
      continent: "Oceania",
    },
    { name: "Norway", code: "NO", phone: 47, continent: "Europe" },
    { name: "Oman", code: "OM", phone: 968, continent: "Asia" },
    { name: "Pakistan", code: "PK", phone: 92, continent: "Asia" },
    { name: "Palau", code: "PW", phone: 680, continent: "Oceania" },
    {
      name: "Palestinian Territory, Occupied",
      code: "PS",
      phone: 970,
      continent: "Asia",
    },
    { name: "Panama", code: "PA", phone: 507, continent: "North America" },
    { name: "Papua New Guinea", code: "PG", phone: 675, continent: "Oceania" },
    { name: "Paraguay", code: "PY", phone: 595, continent: "South America" },
    { name: "Peru", code: "PE", phone: 51, continent: "South America" },
    { name: "Philippines", code: "PH", phone: 63, continent: "Asia" },
    { name: "Pitcairn", code: "PN", phone: 64, continent: "Oceania" },
    { name: "Poland", code: "PL", phone: 48, continent: "Europe" },
    { name: "Portugal", code: "PT", phone: 351, continent: "Europe" },
    {
      name: "Puerto Rico",
      code: "PR",
      phone: 1787,
      continent: "North America",
    },
    { name: "Qatar", code: "QA", phone: 974, continent: "Asia" },
    { name: "Reunion", code: "RE", phone: 262, continent: "Africa" },
    { name: "Romania", code: "RO", phone: 40, continent: "Europe" },
    { name: "Russian Federation", code: "RU", phone: 7, continent: "Europe" },
    { name: "Rwanda", code: "RW", phone: 250, continent: "Africa" },
    {
      name: "Saint Barthelemy",
      code: "BL",
      phone: 590,
      continent: "North America",
    },
    { name: "Saint Helena", code: "SH", phone: 290, continent: "Africa" },
    {
      name: "Saint Kitts and Nevis",
      code: "KN",
      phone: 1869,
      continent: "North America",
    },
    {
      name: "Saint Lucia",
      code: "LC",
      phone: 1758,
      continent: "North America",
    },
    {
      name: "Saint Martin",
      code: "MF",
      phone: 590,
      continent: "North America",
    },
    {
      name: "Saint Pierre and Miquelon",
      code: "PM",
      phone: 508,
      continent: "North America",
    },
    {
      name: "Saint Vincent and the Grenadines",
      code: "VC",
      phone: 1784,
      continent: "North America",
    },
    { name: "Samoa", code: "WS", phone: 684, continent: "Oceania" },
    { name: "San Marino", code: "SM", phone: 378, continent: "Europe" },
    {
      name: "Sao Tome and Principe",
      code: "ST",
      phone: 239,
      continent: "Africa",
    },
    { name: "Saudi Arabia", code: "SA", phone: 966, continent: "Asia" },
    { name: "Senegal", code: "SN", phone: 221, continent: "Africa" },
    { name: "Serbia", code: "RS", phone: 381, continent: "Europe" },
    {
      name: "Serbia and Montenegro",
      code: "CS",
      phone: 381,
      continent: "Europe",
    },
    { name: "Seychelles", code: "SC", phone: 248, continent: "Africa" },
    { name: "Sierra Leone", code: "SL", phone: 232, continent: "Africa" },
    { name: "Singapore", code: "SG", phone: 65, continent: "Asia" },
    {
      name: "Sint Maarten",
      code: "SX",
      phone: 721,
      continent: "North America",
    },
    { name: "Slovakia", code: "SK", phone: 421, continent: "Europe" },
    { name: "Slovenia", code: "SI", phone: 386, continent: "Europe" },
    { name: "Solomon Islands", code: "SB", phone: 677, continent: "Oceania" },
    { name: "Somalia", code: "SO", phone: 252, continent: "Africa" },
    { name: "South Africa", code: "ZA", phone: 27, continent: "Africa" },
    {
      name: "South Georgia and the South Sandwich Islands",
      code: "GS",
      phone: 500,
      continent: "Antarctica",
    },
    { name: "South Sudan", code: "SS", phone: 211, continent: "Africa" },
    { name: "Spain", code: "ES", phone: 34, continent: "Europe" },
    { name: "Sri Lanka", code: "LK", phone: 94, continent: "Asia" },
    { name: "Sudan", code: "SD", phone: 249, continent: "Africa" },
    { name: "Suriname", code: "SR", phone: 597, continent: "South America" },
    {
      name: "Svalbard and Jan Mayen",
      code: "SJ",
      phone: 47,
      continent: "Europe",
    },
    { name: "Swaziland", code: "SZ", phone: 268, continent: "Africa" },
    { name: "Sweden", code: "SE", phone: 46, continent: "Europe" },
    { name: "Switzerland", code: "CH", phone: 41, continent: "Europe" },
    { name: "Syrian Arab Republic", code: "SY", phone: 963, continent: "Asia" },
    {
      name: "Taiwan, Province of China",
      code: "TW",
      phone: 886,
      continent: "Asia",
    },
    { name: "Tajikistan", code: "TJ", phone: 992, continent: "Asia" },
    {
      name: "Tanzania, United Republic of",
      code: "TZ",
      phone: 255,
      continent: "Africa",
    },
    { name: "Thailand", code: "TH", phone: 66, continent: "Asia" },
    { name: "Timor-Leste", code: "TL", phone: 670, continent: "Asia" },
    { name: "Togo", code: "TG", phone: 228, continent: "Africa" },
    { name: "Tokelau", code: "TK", phone: 690, continent: "Oceania" },
    { name: "Tonga", code: "TO", phone: 676, continent: "Oceania" },
    {
      name: "Trinidad and Tobago",
      code: "TT",
      phone: 1868,
      continent: "North America",
    },
    { name: "Tunisia", code: "TN", phone: 216, continent: "Africa" },
    { name: "Turkey", code: "TR", phone: 90, continent: "Asia" },
    { name: "Turkmenistan", code: "TM", phone: 7370, continent: "Asia" },
    {
      name: "Turks and Caicos Islands",
      code: "TC",
      phone: 1649,
      continent: "North America",
    },
    { name: "Tuvalu", code: "TV", phone: 688, continent: "Oceania" },
    { name: "Uganda", code: "UG", phone: 256, continent: "Africa" },
    { name: "Ukraine", code: "UA", phone: 380, continent: "Europe" },
    { name: "United Arab Emirates", code: "AE", phone: 971, continent: "Asia" },
    { name: "United Kingdom", code: "GB", phone: 44, continent: "Europe" },
    { name: "United States", code: "US", phone: 1, continent: "North America" },
    {
      name: "United States Minor Outlying Islands",
      code: "UM",
      phone: 1,
      continent: "Oceania",
    },
    { name: "Uruguay", code: "UY", phone: 598, continent: "South America" },
    { name: "Uzbekistan", code: "UZ", phone: 998, continent: "Asia" },
    { name: "Vanuatu", code: "VU", phone: 678, continent: "Oceania" },
    { name: "Venezuela", code: "VE", phone: 58, continent: "South America" },
    { name: "Viet Nam", code: "VN", phone: 84, continent: "Asia" },
    {
      name: "Virgin Islands, British",
      code: "VG",
      phone: 1284,
      continent: "North America",
    },
    {
      name: "Virgin Islands, U.s.",
      code: "VI",
      phone: 1340,
      continent: "North America",
    },
    { name: "Wallis and Futuna", code: "WF", phone: 681, continent: "Oceania" },
    { name: "Western Sahara", code: "EH", phone: 212, continent: "Africa" },
    { name: "Yemen", code: "YE", phone: 967, continent: "Asia" },
    { name: "Zambia", code: "ZM", phone: 260, continent: "Africa" },
    { name: "Zimbabwe", code: "ZW", phone: 263, continent: "Africa" },
  ];

  // Show animation on key press (excluding special keys)
  mfdSearchInput.addEventListener("keydown", () => {
    if (mfdSearchInput.value.length > 0) {
      mfdLoadingAnimation.style.display = "block";
    }
  });

  mfdSearchInput.addEventListener("keyup", () => {
    if (mfdSearchInput.value.length === 0) {
      mfdLoadingAnimation.style.display = "none";
    }
  });

  // Function to filter countries/cities based on input
  function mfdFilterResults(value) {
    const mfdFiltered = mfdCountries.filter((country) =>
      country.name.toLowerCase().startsWith(value.toLowerCase())
    );
    return mfdFiltered;
  }

  // Function to display the dropdown with filtered results
  function mfdShowResults(results) {
    mfdSearchResults.innerHTML = ""; // Clear previous results
    if (results.length > 0) {
      mfdSearchResults.style.display = "block";
      results.forEach((result) => {
        const mfdListItem = document.createElement("li");
        mfdListItem.innerText = result.name;
        mfdListItem.addEventListener("click", () => {
          mfdSearchInput.value = result.name; // Update input value on selection
          mfdSearchResults.style.display = "none"; // Hide dropdown after selection
          mfdLoadingAnimation.style.display = "none";
        });
        mfdSearchResults.appendChild(mfdListItem);
      });
    } else {
      mfdSearchResults.style.display = "none"; // Hide dropdown if no results
    }
  }

  // Event listener for input changes
  mfdSearchInput.addEventListener("keyup", () => {
    const mfdValue = mfdSearchInput.value;
    const mfdFilteredResults = mfdFilterResults(mfdValue);
    mfdShowResults(mfdFilteredResults);
  });

  // Hide results when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !mfdSearchInput.contains(e.target) &&
      !mfdSearchResults.contains(e.target)
    ) {
      mfdSearchResults.style.display = "none";
      // Check if the input matches any location exactly
      if (
        mfdCountries.some(
          (location) =>
            location.name.toLowerCase() === mfdSearchInput.value.toLowerCase()
        )
      ) {
        mfdLoadingAnimation.style.display = "none";
      }
    }
  });

  // Find button functionality
  mfdFindButton.addEventListener("click", function () {
    const mfdSelectedLocation = mfdSearchInput.value;
    const selectedCountry = mfdCountries.find(
      (location) => location.name === mfdSelectedLocation
    );

    if (selectedCountry) {
      mfdErrorMessage.textContent = `Office found in ${mfdSelectedLocation}`;
      mfdErrorMessage.style.display = "none";
      mfdLoadingAnimation.style.display = "none"; // Stop animation on successful find

      // Construct the URL
      const baseUrl = "http://www.homewayexpress.com/local-information";
      const continent = selectedCountry.continent
        .toLowerCase()
        .replace(/\s+/g, "-");
      const country = selectedCountry.name.toLowerCase().replace(/\s+/g, "-");
      const url = `${baseUrl}/${continent}/${country}`;

      // Check if the page exists before navigating
      fetch(url, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            // Page exists, navigate to it
            window.location.href = url;
          } else {
            // Page doesn't exist, redirect to 404
            window.location.href = "http://www.homewayexpress.com/404.html";
          }
        })
        .catch((error) => {
          console.error("Error checking page existence:", error);
          // In case of network error or other issues, redirect to 404
          window.location.href = "http://www.homewayexpress.com/404.html";
        });
    } else {
      mfdErrorMessage.textContent = "No office found at this location";
      mfdErrorMessage.style.cssText =
        "color:red; text-align:center; margin-top: 10px;";
    }
  });

  // Event listener for input changes
  mfdSearchInput.addEventListener("input", function () {
    if (this.value === "") {
      mfdErrorMessage.textContent = "";
      mfdLoadingAnimation.style.display = "none"; // Stop animation when input is cleared
    }
  });
});

/// button on 404
window.addEventListener("error", function (event) {
  if (event.target.src.startsWith("https://www.homewayexpress.com")) {
    window.location.href = "/404.html";
  }
});

function goHome() {
  window.location.href = "https://www.homewayexpress.com"; // Replace "/" with the actual path to your homepage
}
