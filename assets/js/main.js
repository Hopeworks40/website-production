"use strict";

/**
 * accordion toggle
 */
const accordionActions = document.querySelectorAll("[data-accordion-action]");

accordionActions.forEach((element) => {
  element.addEventListener("click", () => {
    element.classList.toggle("active");
  });
});

window.onload = function () {
  window.addEventListener("scroll", function (e) {
    if (window.pageYOffset > 100) {
      document.querySelector(".style-0").classList.add("is-scrolling");
    } else {
      document.querySelector(".style-0").classList.remove("is-scrolling");
    }
  });

  window.addEventListener("scroll", function (e) {
    if (window.pageYOffset > 100) {
      document
        .querySelector(".mobnavbox-boxarea")
        .classList.add("is-scrolling");
    } else {
      document
        .querySelector(".mobnavbox-boxarea")
        .classList.remove("is-scrolling");
    }
  });

  window.addEventListener("scroll", function (e) {
    if (window.pageYOffset > 100) {
      document.querySelector(".mobnavstyle-3").style.display = "none";
    } else {
      document.querySelector(".mobnavstyle-3").style.display = "block";
    }
  });

  window.addEventListener("scroll", function (e) {
    if (window.pageYOffset > 100) {
      document.querySelector(".mobnavstyle-3a").style.display = "block";
    } else {
      document.querySelector(".mobnavstyle-3a").style.display = "none";
    }
  });

  /*const menu_btn = document.querySelector(".hamburger");
  const mobile_menu = document.querySelector(".pk-6");

  menu_btn.addEventListener("click", function () {
    menu_btn.classList.toggle("is-active");
    mobile_menu.classList.toggle("is-active");
  });*/

  document.getElementById("hmbIcon").addEventListener("click", function () {
    const sub_menu = document.getElementById("pk6");
    const hmbIcon = document.getElementById("hmbIcon");

    sub_menu.classList.toggle("active");
    hmbIcon.classList.toggle("active");
  });

  const swus_btn = document.querySelector(".pk-13");
  const swus_menu = document.querySelector(".pk-16x");

  swus_btn.addEventListener("click", function () {
    swus_btn.classList.toggle("is-active");
    swus_menu.classList.toggle("is-active");
  });

  const ssub_btn = document.querySelector(".pk-20");
  const ssub_menu = document.querySelector(".pk-20-content");

  ssub_btn.addEventListener("click", function () {
    ssub_btn.classList.toggle("is-active");
    ssub_menu.classList.toggle("is-active");
  });
  const xsub_btn = document.querySelector(".pk-38");
  const xsub_menu = document.querySelector(".pk-38-content");

  xsub_btn.addEventListener("click", function () {
    xsub_btn.classList.toggle("is-active");
    xsub_menu.classList.toggle("is-active");
  });

  const mmsub_btn = document.querySelector(".pk-133");
  const mmsub_menu = document.querySelector(".pk-136");

  mmsub_btn.addEventListener("click", function () {
    mmsub_btn.classList.toggle("is-active");
    mmsub_menu.classList.toggle("is-active");
  });

  const mxmsub_btn = document.querySelector(".pk-260");
  const mxmsub_menu = document.querySelector(".pk-263");

  mxmsub_btn.addEventListener("click", function () {
    mxmsub_btn.classList.toggle("is-active");
    mxmsub_menu.classList.toggle("is-active");
  });

  const foot_btn = document.querySelector(".pkayfooter-tile");
  const foot_menu = document.querySelector(".pkayfooter-listwords");

  foot_btn.addEventListener("click", function () {
    foot_btn.classList.toggle("is-active");
    foot_menu.classList.toggle("is-active");
  });

  const footA_btn = document.querySelector(".pkayfooter-tile-A");
  const footA_menu = document.querySelector(".pkayfooter-listwords-A");

  footA_btn.addEventListener("click", function () {
    footA_btn.classList.toggle("is-active");
    footA_menu.classList.toggle("is-active");
  });
  const footB_btn = document.querySelector(".pkayfooter-tile-B");
  const footB_menu = document.querySelector(".pkayfooter-listwords-B");

  footB_btn.addEventListener("click", function () {
    footB_btn.classList.toggle("is-active");
    footB_menu.classList.toggle("is-active");
  });

  const footC_btn = document.querySelector(".pkayfooter-tile-C");
  const footC_menu = document.querySelector(".pkayfooter-listwords-C");

  footC_btn.addEventListener("click", function () {
    footC_btn.classList.toggle("is-active");
    footC_menu.classList.toggle("is-active");
  });
  const footD_btn = document.querySelector(".pkayfooter-tile-D");
  const footD_menu = document.querySelector(".pkayfooter-listwords-D");

  footD_btn.addEventListener("click", function () {
    footD_btn.classList.toggle("is-active");
    footD_menu.classList.toggle("is-active");
  });
  const footE_btn = document.querySelector(".pkayfooter-tile-E");
  const footE_menu = document.querySelector(".pkayfooter-listwords-E");

  footE_btn.addEventListener("click", function () {
    footE_btn.classList.toggle("is-active");
    footE_menu.classList.toggle("is-active");
  });
  const footF_btn = document.querySelector(".pkayfooter-tile-F");
  const footF_menu = document.querySelector(".pkayfooter-listwords-F");

  footF_btn.addEventListener("click", function () {
    footF_btn.classList.toggle("is-active");
    footF_menu.classList.toggle("is-active");
  });

  const footcb_btn = document.querySelector(".chat-bton");
  const footcb_menu = document.querySelector(".Pkchatbuton-1242");

  footcb_btn.addEventListener("click", function () {
    footcb_btn.classList.toggle("is-active");
    footcb_menu.classList.toggle("is-active");
  });

  const footcbx_btn = document.querySelector(".Pkchatbuton-1256");

  footcbx_btn.addEventListener("click", function () {
    footcbx_btn.classList.toggle("is-active");
    footcb_menu.classList.toggle("is-active");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const classTabs = document.querySelectorAll(".tabs li");
  const classTabContents = document.querySelectorAll(".class-tab-content");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const getOtpButton = document.getElementById("get-otp");
  const mobileNumberInput = document.getElementById("mobile-number");
  const countryCodeSelect = document.getElementById("country-code");
  //const mobileErrorMessage = document.getElementById("mobile-error-message");

  // Class tab switching
  classTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      classTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const classTab = tab.getAttribute("data-class-tab");
      classTabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === `${classTab}-content`) {
          content.classList.add("active");
        }
      });
    });
  });

  // Switch tab content
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const tab = button.getAttribute("data-tab");
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === tab) {
          content.classList.add("active");
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var input = document.querySelector("#phonecalling, #cellcalling");
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
document
  .getElementById("dpmb-track-awb")
  .addEventListener("click", function () {
    const dpawbNumbermb = document
      .getElementById("dpmb-awb-number")
      .value.trim();
    const dperrorElementmb = document.getElementById("dpmb-errortextMessage");

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
    if (!regex.test(dpawbNumbermb)) {
      // 2. Display an error message if the input format is incorrect
      dperrorElementmb.textContent =
        "Please enter a valid Homeway Express Number";
      return;
    }

    // Clear any previous error message
    dperrorElementmb.textContent = "";

    /*const sanitizedAwbNumber = sanitizeInput(awbNumbermb);*/

    // 3. Create and display a popup modal
    const dppopen = document.createElement("div");
    dppopen.style.cssText = `
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
    dppopen.innerHTML = '<div class="loaderroam"></div>';

    document.body.appendChild(dppopen);

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
            dppopen.innerHTML = `
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
            dppopen.innerHTML = `
          <div id="mbmodalpop-content">
            <div class="mbmodalpop-inside">
             <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="150" height="150" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><rect width="50" height="50" fill="#39073b" rx="4" opacity="1" data-original="#ffac00" class=""></rect><path fill="#f6f6f6" d="M50 32v18H32v-1a17 17 0 0 1 17-17z" opacity="1" data-original="#ea9706" class=""></path><circle cx="49" cy="49" r="15" fill="#f26925" opacity="1" data-original="#93e6e5" class=""></circle><circle cx="49" cy="49" r="12" fill="#39073b" opacity="1" data-original="#50d9d7" class=""></circle><g fill="#f3f3f3"><path d="M32 0v12.5a1.5 1.5 0 0 1-1.5 1.5 1.54 1.54 0 0 1-.9-.3l-2.8-2.1A3 3 0 0 0 25 11a3 3 0 0 0-1.8.6l-2.8 2.1a1.54 1.54 0 0 1-.9.3 1.5 1.5 0 0 1-1.5-1.5V0zM45 54a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l8-8a1 1 0 0 1 1.42 1.42l-8 8A1 1 0 0 1 45 54z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M53 54a1 1 0 0 1-.71-.29l-8-8a1 1 0 0 1 1.42-1.42l8 8a1 1 0 0 1 0 1.42A1 1 0 0 1 53 54zM9 38a1 1 0 0 1-.71-.29L7 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 9 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M7 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 38a1 1 0 0 1-.71-.29L15 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 17 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M15 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 47H5a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path></g></g></svg>
             <p>We couldn't find any cargo, shipment, or containers available</p>
             <button id="close-modal">Close</button>
            </div>
          </div>
            
        `;
          }

          document
            .getElementById("close-modal")
            .addEventListener("click", function () {
              document.body.removeChild(dppopen);
            });
        }, 2000);
      })
      .catch((error) => {
        setTimeout(() => {
          // Display error image and message for network errors
          dppopen.innerHTML = `
        <div id="mbmodalpop-content">
          <div class="mbmodalpop-inside">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="150" height="150" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><rect width="50" height="50" fill="#39073b" rx="4" opacity="1" data-original="#ffac00" class=""></rect><path fill="#f6f6f6" d="M50 32v18H32v-1a17 17 0 0 1 17-17z" opacity="1" data-original="#ea9706" class=""></path><circle cx="49" cy="49" r="15" fill="#f26925" opacity="1" data-original="#93e6e5" class=""></circle><circle cx="49" cy="49" r="12" fill="#39073b" opacity="1" data-original="#50d9d7" class=""></circle><g fill="#f3f3f3"><path d="M32 0v12.5a1.5 1.5 0 0 1-1.5 1.5 1.54 1.54 0 0 1-.9-.3l-2.8-2.1A3 3 0 0 0 25 11a3 3 0 0 0-1.8.6l-2.8 2.1a1.54 1.54 0 0 1-.9.3 1.5 1.5 0 0 1-1.5-1.5V0zM45 54a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l8-8a1 1 0 0 1 1.42 1.42l-8 8A1 1 0 0 1 45 54z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M53 54a1 1 0 0 1-.71-.29l-8-8a1 1 0 0 1 1.42-1.42l8 8a1 1 0 0 1 0 1.42A1 1 0 0 1 53 54zM9 38a1 1 0 0 1-.71-.29L7 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 9 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M7 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 38a1 1 0 0 1-.71-.29L15 36.41l-1.29 1.3a1 1 0 0 1-1.42-1.42l2-2a1 1 0 0 1 1.42 0l2 2a1 1 0 0 1 0 1.42A1 1 0 0 1 17 38z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path><path d="M15 43a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zM17 47H5a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" fill="#f26925" opacity="1" data-original="#f3f3f3" class=""></path></g></g></svg>
            <p >We couldn't find any cargo, shipment, or containers available</p>
            <button id="close-modal">Close</button>
         </div>
        </div>
        
    `;
          console.error("There was a problem with the fetch operation:", error);

          document
            .getElementById("close-modal")
            .addEventListener("click", function () {
              document.body.removeChild(dppopen);
            });
        }, 2000);
      });
  });

///////// desktop Homeway plus/////
document
  .getElementById("dpmbtrack-order-id")
  .addEventListener("click", function () {
    const dpmborderIdinput = document
      .getElementById("dpmborder-id-input")
      .value.trim();
    const dporderiderrorElement = document.getElementById(
      "dpmborder-id-errortextMessage"
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
    if (!regex.test(dpmborderIdinput)) {
      // 2. Display an error message if the input format is incorrect
      dporderiderrorElement.textContent =
        "Please enter a valid ORDER ID / Trackboo NUMBER / Homeway Express+";
      return;
    }

    // Clear any previous error message
    dporderiderrorElement.textContent = "";

    /*const sanitizedAwbNumber = sanitizeInput(awbNumbermb);*/

    // 3. Create and display a popup modal
    const dppopenorder = document.createElement("div");
    dppopenorder.style.cssText = `
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
    dppopenorder.innerHTML = '<div class="loaderroam"></div>';

    document.body.appendChild(dppopenorder);

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
            dppopenorder.innerHTML = `
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
            dppopenorder.innerHTML = `
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
              document.body.removeChild(dppopenorder);
            });
        }, 2000);
      })
      .catch((error) => {
        setTimeout(() => {
          // Display error image and message for network errors
          dppopenorder.innerHTML = `
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
              document.body.removeChild(dppopenorder);
            });
        }, 2000);
      });
  });

////// find local office /////////

document.addEventListener("DOMContentLoaded", function () {
  const dpMfdSearchInput = document.getElementById(
    "dpmbfd-office-findersearchicom"
  );
  const dpMfdSearchResults = document.getElementById(
    "dpmbfd-findofficesearch-results"
  );
  const dpMfdLoadingAnimation = document.querySelector(
    ".dpmbfd-loading-animationfindofficesearch"
  );
  const dpMfdFindButton = document.getElementById("dpmbfd-find-offi");
  const dpMfdErrorMessage = document.getElementById(
    "dpmbfd-find-office-errortextMessage"
  );

  // Sample data (replace with your actual data)

  const dpMfdCountries = [
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
  dpMfdSearchInput.addEventListener("keydown", () => {
    if (dpMfdSearchInput.value.length > 0) {
      dpMfdLoadingAnimation.style.display = "block";
    }
  });

  dpMfdSearchInput.addEventListener("keyup", () => {
    if (dpMfdSearchInput.value.length === 0) {
      dpMfdLoadingAnimation.style.display = "none";
    }
  });

  // Function to filter countries/cities based on input
  function dpMfdFilterResults(value) {
    const dpMfdFiltered = dpMfdCountries.filter((country) =>
      country.name.toLowerCase().startsWith(value.toLowerCase())
    );
    return dpMfdFiltered;
  }

  // Function to display the dropdown with filtered results
  function dpMfdShowResults(results) {
    dpMfdSearchResults.innerHTML = ""; // Clear previous results
    if (results.length > 0) {
      dpMfdSearchResults.style.display = "block";
      results.forEach((result) => {
        const dpMfdListItem = document.createElement("li");
        dpMfdListItem.innerText = result.name;
        dpMfdListItem.addEventListener("click", () => {
          dpMfdSearchInput.value = result.name; // Update input value on selection
          dpMfdSearchResults.style.display = "none"; // Hide dropdown after selection
          dpMfdLoadingAnimation.style.display = "none";
        });
        dpMfdSearchResults.appendChild(dpMfdListItem);
      });
    } else {
      dpMfdSearchResults.style.display = "none"; // Hide dropdown if no results
    }
  }

  // Event listener for input changes
  dpMfdSearchInput.addEventListener("keyup", () => {
    const dpMfdValue = dpMfdSearchInput.value;
    const dpMfdFilteredResults = dpMfdFilterResults(dpMfdValue);
    dpMfdShowResults(dpMfdFilteredResults);
  });

  // Hide results when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !dpMfdSearchInput.contains(e.target) &&
      !dpMfdSearchResults.contains(e.target)
    ) {
      dpMfdSearchResults.style.display = "none";
      // Check if the input matches any location exactly
      if (
        dpMfdCountries.some(
          (location) =>
            location.name.toLowerCase() === dpMfdSearchInput.value.toLowerCase()
        )
      ) {
        dpMfdLoadingAnimation.style.display = "none";
      }
    }
  });

  // DOM elements
  /*const dpMfdSearchInput = document.getElementById("dpMfdSearchInput");
  const dpMfdLoadingAnimation = document.getElementById(
    "dpMfdLoadingAnimation"
  );
  const dpMfdSearchResults = document.getElementById("dpMfdSearchResults");

  // Show animation on key press (excluding special keys)
  dpMfdSearchInput.addEventListener("keydown", () => {
    if (dpMfdSearchInput.value.length > 0) {
      dpMfdLoadingAnimation.style.display = "block";
    }
  });

  dpMfdSearchInput.addEventListener("keyup", () => {
    const inputValue = dpMfdSearchInput.value.trim();

    if (inputValue.length === 0) {
      dpMfdLoadingAnimation.style.display = "none";
      dpMfdSearchResults.style.display = "none"; // Hide dropdown if input is empty
    } else {
      // Filter results based on input
      const filteredResults = dpMfdFilterResults(inputValue);
      dpMfdShowResults(filteredResults);
    }
  });

  // Function to filter countries/cities based on input
  function dpMfdFilterResults(value) {
    return dpMfdCountries.filter((country) =>
      country.name.toLowerCase().startsWith(value.toLowerCase())
    );
  }

  // Function to display the dropdown with filtered results
  function dpMfdShowResults(results) {
    dpMfdSearchResults.innerHTML = ""; // Clear previous results

    if (results.length > 0) {
      dpMfdSearchResults.style.display = "block"; // Show dropdown
      results.forEach((result) => {
        const dpMfdListItem = document.createElement("li");
        dpMfdListItem.innerText = result.name;
        dpMfdListItem.addEventListener("click", () => {
          dpMfdSearchInput.value = result.name; // Update input value on selection
          dpMfdSearchResults.style.display = "none"; // Hide dropdown after selection
          dpMfdLoadingAnimation.style.display = "none";
        });
        dpMfdSearchResults.appendChild(dpMfdListItem);
      });
    } else {
      dpMfdSearchResults.style.display = "none"; // Hide dropdown if no results
    }
  }*/

  // Find button functionality
  dpMfdFindButton.addEventListener("click", function () {
    const dpMfdSelectedLocation = dpMfdSearchInput.value;
    const selectedCountry = dpMfdCountries.find(
      (location) => location.name === dpMfdSelectedLocation
    );

    if (selectedCountry) {
      dpMfdErrorMessage.textContent = `Office found in ${dpMfdSelectedLocation}`;
      dpMfdErrorMessage.style.display = "none";
      dpMfdLoadingAnimation.style.display = "none"; // Stop animation on successful find

      // Construct the URL
      const baseUrl = "http://127.0.0.1:5500/index.html/local-information";
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
            window.location.href = "http://127.0.0.1:5500/404.html";
          }
        })
        .catch((error) => {
          console.error("Error checking page existence:", error);
          // In case of network error or other issues, redirect to 404
          window.location.href = "http://127.0.0.1:5500/404.html";
        });
    } else {
      dpMfdErrorMessage.textContent = "No office found at this location";
      dpMfdErrorMessage.style.cssText =
        "color:red; text-align:center; margin-top: 10px;";
    }
  });

  // Event listener for input changes
  dpMfdSearchInput.addEventListener("input", function () {
    if (this.value === "") {
      dpMfdErrorMessage.textContent = "";
      dpMfdLoadingAnimation.style.display = "none"; // Stop animation when input is cleared
    }
  });
});

// chatbutton js
function openTab(evt, tabName) {
  var i, tabContentcb, tabButtonscb;
  tabContentcb = document.getElementsByClassName("chat-tab-pane");
  for (i = 0; i < tabContentcb.length; i++) {
    tabContentcb[i].style.display = "none";
  }
  tabButtonscb = document.getElementsByClassName("chattab-button");
  for (i = 0; i < tabButtonscb.length; i++) {
    tabButtonscb[i].className = tabButtonscb[i].className.replace(
      " active",
      ""
    );
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

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

/* date updating*/

const yearSpan = document.querySelector("#currentYear");
const currentYear = new Date();
yearSpan.innerText = currentYear.getFullYear();
