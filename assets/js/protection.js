// Code Protection Script - Anti-Debugging and DevTools Detection
(function () {
  "use strict";

  // Disable right-click context menu
  document.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
      return false;
    },
    false
  );

  // Disable specific keyboard shortcuts
  document.addEventListener(
    "keydown",
    function (e) {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
        (e.metaKey && e.altKey && e.keyCode === 73) || // Cmd+Option+I (Mac)
        (e.metaKey && e.altKey && e.keyCode === 74) || // Cmd+Option+J (Mac)
        (e.metaKey && e.keyCode === 85) // Cmd+U (Mac)
      ) {
        e.preventDefault();
        return false;
      }
    },
    false
  );

  // DevTools detection using timing check
  let devtoolsOpen = false;
  const threshold = 160;

  const detectDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? "vertical" : "horizontal";

    if (
      !(heightThreshold && widthThreshold) &&
      ((window.Firebug &&
        window.Firebug.chrome &&
        window.Firebug.chrome.isInitialized) ||
        widthThreshold ||
        heightThreshold)
    ) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        handleDevToolsOpen();
      }
    } else {
      if (devtoolsOpen) {
        devtoolsOpen = false;
      }
    }
  };

  // DevTools detection using debugger statement
  const detectDevToolsWithDebugger = () => {
    const before = new Date().getTime();
    debugger;
    const after = new Date().getTime();

    if (after - before > 100) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        handleDevToolsOpen();
      }
    }
  };

  // Console detection
  const consoleDetection = () => {
    const element = new Image();
    Object.defineProperty(element, "id", {
      get: function () {
        devtoolsOpen = true;
        handleDevToolsOpen();
      },
    });
    console.log(element);
  };

  // Action when DevTools detected
  function handleDevToolsOpen() {
    // Blur the page content
    document.body.style.filter = "blur(10px)";
    document.body.style.userSelect = "none";

    // Show warning overlay
    showWarningOverlay();

    // Optional: Redirect after delay
    // setTimeout(() => {
    //   window.location.href = '/';
    // }, 3000);
  }

  // Create warning overlay
  function showWarningOverlay() {
    const existingOverlay = document.getElementById("devtools-warning");
    if (existingOverlay) return;

    const overlay = document.createElement("div");
    overlay.id = "devtools-warning";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
    `;

    const message = document.createElement("div");
    message.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      border-radius: 15px;
      text-align: center;
      color: white;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    `;

    message.innerHTML = `
      <div style="font-size: 60px; margin-bottom: 20px;">🔒</div>
      <h2 style="margin: 0 0 15px 0; font-size: 28px;">Developer Tools Detected</h2>
      <p style="margin: 0; font-size: 16px; line-height: 1.6;">
        For security reasons, developer tools are disabled on this page.
        <br><br>
        Please close the developer console to continue.
      </p>
      <button onclick="window.location.reload()" style="
        margin-top: 25px;
        padding: 12px 30px;
        background: white;
        color: #667eea;
        border: none;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        Reload Page
      </button>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);
  }

  // Disable text selection on important elements
  const disableSelection = () => {
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.body.style.mozUserSelect = "none";
    document.body.style.msUserSelect = "none";
  };

  // Prevent drag and drop
  document.addEventListener(
    "dragstart",
    function (e) {
      e.preventDefault();
      return false;
    },
    false
  );

  // Disable printing (optional)
  window.addEventListener("beforeprint", function (e) {
    e.preventDefault();
    alert("Printing is disabled for security reasons.");
    return false;
  });

  // Clear console periodically
  const clearConsole = () => {
    if (typeof console !== "undefined") {
      console.clear();
    }
  };

  // Override console methods
  const overrideConsole = () => {
    const noop = () => {};
    [
      "log",
      "debug",
      "info",
      "warn",
      "error",
      "table",
      "trace",
      "dir",
      "dirxml",
      "group",
      "groupEnd",
      "time",
      "timeEnd",
      "assert",
      "profile",
    ].forEach((method) => {
      if (typeof console[method] !== "undefined") {
        // Store original for legitimate use
        const original = console[method];
        console[method] = function () {
          // Only allow console in development
          if (
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1"
          ) {
            original.apply(console, arguments);
          }
        };
      }
    });
  };

  // Initialize protection on DOM load
  document.addEventListener("DOMContentLoaded", function () {
    // Uncomment to enable specific protections
    // disableSelection();
    // overrideConsole();

    // Run detections periodically
    setInterval(detectDevTools, 1000);

    // Uncomment for aggressive detection (may impact performance)
    // setInterval(detectDevToolsWithDebugger, 1000);
    // setInterval(clearConsole, 100);
  });

  // Detect if code is being viewed in source
  const checkViewSource = () => {
    if (document.URL.indexOf("view-source:") === 0) {
      window.location.href = window.location.origin;
    }
  };
  checkViewSource();

  // Prevent frame/iframe embedding
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  // Additional protection: Detect Chrome DevTools using console.log timing
  let checkStatus = false;
  const checkTimer = setInterval(() => {
    const before = performance.now();
    const check = /./;
    check.toString = function () {
      checkStatus = true;
      handleDevToolsOpen();
    };
    console.log("%c", check);
    const after = performance.now();

    if (after - before > 10) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        handleDevToolsOpen();
      }
    }
  }, 1000);

  // Obfuscate important variables
  const _0x = {
    key: btoa(Math.random().toString(36)),
    timestamp: Date.now(),
    secure: true,
  };

  // Monitor page visibility
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      // Pause detection when page is hidden
    } else {
      // Resume detection
      detectDevTools();
    }
  });

  console.log(
    "%c⚠️ Warning!",
    "color: red; font-size: 40px; font-weight: bold;"
  );
  console.log(
    "%cThis is a browser feature intended for developers.",
    "font-size: 18px;"
  );
  console.log(
    "%cIf someone told you to copy-paste something here, it is a scam.",
    "font-size: 16px; color: orange;"
  );
  console.log(
    "%cPasting code here can give attackers access to your account.",
    "font-size: 14px; color: red;"
  );
})();
