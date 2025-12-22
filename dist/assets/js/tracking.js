// Supabase Client
class SupabaseClient {
  constructor(url, anonKey) {
    this.url = url;
    this.anonKey = anonKey;
  }

  async query(table) {
    return {
      select: (columns = "*") => {
        let queryUrl = `${this.url}/rest/v1/${table}?select=${columns}`;
        let filters = [];

        let queryBuilder = {
          ilike: (column, value) => {
            filters.push(`${column}=ilike.${value}`);
            return queryBuilder;
          },
          or: (conditions) => {
            filters.push(`or=(${conditions})`);
            return queryBuilder;
          },
          eq: (column, value) => {
            filters.push(`${column}=eq.${value}`);
            return queryBuilder;
          },
          single: async () => {
            try {
              const finalUrl =
                filters.length > 0
                  ? `${queryUrl}&${filters.join("&")}`
                  : queryUrl;

              console.log("Querying:", finalUrl); // Debug log

              const response = await fetch(finalUrl, {
                headers: {
                  apikey: this.anonKey,
                  Authorization: `Bearer ${this.anonKey}`,
                  "Content-Type": "application/json",
                  Prefer: "return=representation",
                },
              });

              if (!response.ok) {
                const errorText = await response.text();
                console.error("Query failed:", response.status, errorText);
                throw new Error(`Query failed: ${response.status}`);
              }

              const data = await response.json();
              console.log("Query result:", data); // Debug log

              if (!data || data.length === 0) {
                return { data: null, error: { message: "No shipment found" } };
              }
              return { data: data[0], error: null };
            } catch (err) {
              console.error("Query error:", err);
              return { data: null, error: { message: err.message } };
            }
          },
        };
        return queryBuilder;
      },
    };
  }
}

// Initialize Supabase client
const supabase = new SupabaseClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.anonKey
);

// Utility Functions
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.color = "#ff6b35";
    errorElement.style.marginTop = "10px";
    errorElement.style.fontSize = "14px";
  }
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
  }
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 8; // Allow shorter phone numbers for international
}

function formatPhoneForSearch(phone) {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // If it starts with country code, keep it; otherwise return as is
  return cleaned;
}

function getCountryInfo(location) {
  // Extract country from location string
  const locationLower = location.toLowerCase();

  if (
    locationLower.includes("usa") ||
    locationLower.includes("united states") ||
    locationLower.includes("new york") ||
    locationLower.includes("los angeles")
  ) {
    return {
      flag: "https://flagcdn.com/w40/us.png",
      alt: "United States flag",
    };
  } else if (
    locationLower.includes("uk") ||
    locationLower.includes("united kingdom") ||
    locationLower.includes("london")
  ) {
    return {
      flag: "https://flagcdn.com/w40/gb.png",
      alt: "United Kingdom flag",
    };
  } else if (
    locationLower.includes("germany") ||
    locationLower.includes("berlin")
  ) {
    return { flag: "https://flagcdn.com/w40/de.png", alt: "Germany flag" };
  } else if (
    locationLower.includes("france") ||
    locationLower.includes("paris")
  ) {
    return { flag: "https://flagcdn.com/w40/fr.png", alt: "France flag" };
  } else if (
    locationLower.includes("japan") ||
    locationLower.includes("tokyo")
  ) {
    return { flag: "https://flagcdn.com/w40/jp.png", alt: "Japan flag" };
  } else if (
    locationLower.includes("south korea") ||
    locationLower.includes("korea") ||
    locationLower.includes("seoul")
  ) {
    return {
      flag: "https://flagcdn.com/w40/kr.png",
      alt: "South Korea flag",
    };
  } else if (
    locationLower.includes("australia") ||
    locationLower.includes("sydney") ||
    locationLower.includes("melbourne")
  ) {
    return { flag: "https://flagcdn.com/w40/au.png", alt: "Australia flag" };
  } else if (
    locationLower.includes("uae") ||
    locationLower.includes("dubai") ||
    locationLower.includes("emirates") ||
    locationLower.includes("united arab emirates")
  ) {
    return { flag: "https://flagcdn.com/w40/ae.png", alt: "UAE flag" };
  } else if (
    locationLower.includes("china") ||
    locationLower.includes("shanghai") ||
    locationLower.includes("beijing") ||
    locationLower.includes("guangzhou") ||
    locationLower.includes("shenzhen")
  ) {
    return { flag: "https://flagcdn.com/w40/cn.png", alt: "China flag" };
  } else if (
    locationLower.includes("ghana") ||
    locationLower.includes("accra") ||
    locationLower.includes("tema") ||
    locationLower.includes("koforidua")
  ) {
    return { flag: "https://flagcdn.com/w40/gh.png", alt: "Ghana flag" };
  } else if (
    locationLower.includes("india") ||
    locationLower.includes("mumbai")
  ) {
    return { flag: "https://flagcdn.com/w40/in.png", alt: "India flag" };
  } else if (
    locationLower.includes("canada") ||
    locationLower.includes("vancouver")
  ) {
    return { flag: "https://flagcdn.com/w40/ca.png", alt: "Canada flag" };
  } else if (
    locationLower.includes("netherlands") ||
    locationLower.includes("amsterdam")
  ) {
    return {
      flag: "https://flagcdn.com/w40/nl.png",
      alt: "Netherlands flag",
    };
  } else if (
    locationLower.includes("belgium") ||
    locationLower.includes("brussels")
  ) {
    return { flag: "https://flagcdn.com/w40/be.png", alt: "Belgium flag" };
  } else if (locationLower.includes("singapore")) {
    return { flag: "https://flagcdn.com/w40/sg.png", alt: "Singapore flag" };
  } else if (
    locationLower.includes("indonesia") ||
    locationLower.includes("jakarta")
  ) {
    return { flag: "https://flagcdn.com/w40/id.png", alt: "Indonesia flag" };
  }

  // Default flag for unknown locations
  return {
    flag: "https://flagcdn.com/w40/un.png",
    alt: "Unknown location flag",
  };
}

function validateTrackingNumber(trackingId) {
  return trackingId && trackingId.trim().length > 0;
}

// Desktop Phone Tracking
document
  .getElementById("get-otp")
  ?.addEventListener("click", async function () {
    const phoneInput = document.getElementById("phonecalling");
    const phone = phoneInput?.value.trim();

    clearError("phonecalling-errortextMessage");

    if (!phone) {
      showError(
        "phonecalling-errortextMessage",
        "Please enter your phone number"
      );
      return;
    }

    if (!validatePhone(phone)) {
      showError(
        "phonecalling-errortextMessage",
        "Please enter a valid phone number"
      );
      return;
    }

    this.disabled = true;
    this.textContent = "Tracking...";

    try {
      const formattedPhone = formatPhoneForSearch(phone);
      const url = `${window.SUPABASE_CONFIG.url}/rest/v1/bookings?or=(sender_phone.ilike.*${formattedPhone}*,receiver_phone.ilike.*${formattedPhone}*)&select=*,origin_location:origin_location_id(name),destination_location:destination_location_id(name)`;
      console.log("Fetching:", url);

      const response = await fetch(url, {
        headers: {
          apikey: window.SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Response error:", response.status);
        showError(
          "phonecalling-errortextMessage",
          "Error connecting to server"
        );
        return;
      }

      const data = await response.json();
      console.log("Data received:", data);

      if (!data || data.length === 0) {
        showError(
          "phonecalling-errortextMessage",
          "No shipment found for this phone number"
        );
      } else {
        showShipmentModal(data[0]);
      }
    } catch (err) {
      console.error("Error:", err);
      showError(
        "phonecalling-errortextMessage",
        "Error tracking shipment. Please try again."
      );
    } finally {
      this.disabled = false;
      this.textContent = "Get OTP & Track Cargo";
    }
  });

// Desktop Tracking Number
document
  .getElementById("dpmb-track-awb")
  ?.addEventListener("click", async function () {
    const trackingInput = document.getElementById("dpmb-awb-number");
    const trackingId = trackingInput?.value.trim();

    clearError("dpmb-errortextMessage");

    if (!validateTrackingNumber(trackingId)) {
      showError(
        "dpmb-errortextMessage",
        "Please enter a valid tracking number"
      );
      return;
    }

    this.disabled = true;
    this.textContent = "Tracking...";

    try {
      // Direct fetch for better error handling - with joined location data
      const url = `${window.SUPABASE_CONFIG.url}/rest/v1/bookings?tracking_id=ilike.${trackingId}&select=*,origin_location:origin_location_id(name),destination_location:destination_location_id(name)`;
      console.log("Fetching:", url);

      const response = await fetch(url, {
        headers: {
          apikey: window.SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", response.status, errorText);
        showError(
          "dpmb-errortextMessage",
          "Error connecting to server. Please try again."
        );
        return;
      }

      const data = await response.json();
      console.log("Data received:", data);

      if (!data || data.length === 0) {
        showError(
          "dpmb-errortextMessage",
          "No shipment found with this tracking number"
        );
      } else {
        showShipmentModal(data[0]);
      }
    } catch (err) {
      console.error("Catch error:", err);
      showError(
        "dpmb-errortextMessage",
        "Error tracking shipment. Please try again."
      );
    } finally {
      this.disabled = false;
      this.textContent = "Track Homeway Express";
    }
  });

// Desktop Reference Number
document
  .getElementById("dpmbtrack-order-id")
  ?.addEventListener("click", async function () {
    const orderInput = document.getElementById("dpmborder-id-input");
    const orderId = orderInput?.value.trim();

    clearError("dpmborder-id-errortextMessage");

    if (!validateTrackingNumber(orderId)) {
      showError(
        "dpmborder-id-errortextMessage",
        "Please enter a valid order ID or reference number"
      );
      return;
    }

    this.disabled = true;
    this.textContent = "Tracking...";

    try {
      const url = `${window.SUPABASE_CONFIG.url}/rest/v1/bookings?or=(order_number.ilike.*${orderId}*,booking_reference.ilike.*${orderId}*)&select=*,origin_location:origin_location_id(name),destination_location:destination_location_id(name)`;

      const response = await fetch(url, {
        headers: {
          apikey: window.SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showError(
          "dpmborder-id-errortextMessage",
          "Error connecting to server"
        );
        return;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        showError(
          "dpmborder-id-errortextMessage",
          "No shipment found with this reference"
        );
      } else {
        showShipmentModal(data[0]);
      }
    } catch (err) {
      console.error("Error:", err);
      showError(
        "dpmborder-id-errortextMessage",
        "Error tracking shipment. Please try again."
      );
    } finally {
      this.disabled = false;
      this.textContent = "Track ORDER ID / Trackboo NUMBER / Homeway Express+";
    }
  });

// Mobile Phone Tracking
document
  .getElementById("mb-get-otp")
  ?.addEventListener("click", async function () {
    const phoneInput = document.getElementById("ccalling");
    const phone = phoneInput?.value.trim();

    clearError("ccalling-errortextMessage");

    if (!phone) {
      showError("ccalling-errortextMessage", "Please enter your phone number");
      return;
    }

    if (!validatePhone(phone)) {
      showError(
        "ccalling-errortextMessage",
        "Please enter a valid phone number"
      );
      return;
    }

    this.disabled = true;
    this.textContent = "Tracking...";

    try {
      const formattedPhone = formatPhoneForSearch(phone);
      const url = `${window.SUPABASE_CONFIG.url}/rest/v1/bookings?or=(sender_phone.ilike.*${formattedPhone}*,receiver_phone.ilike.*${formattedPhone}*)&select=*,origin_location:origin_location_id(name),destination_location:destination_location_id(name)`;

      const response = await fetch(url, {
        headers: {
          apikey: window.SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showError("ccalling-errortextMessage", "Error connecting to server");
        return;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        showError(
          "ccalling-errortextMessage",
          "No shipment found for this phone number"
        );
      } else {
        showShipmentModal(data[0]);
      }
    } catch (err) {
      console.error("Error:", err);
      showError(
        "ccalling-errortextMessage",
        "Error tracking shipment. Please try again."
      );
    } finally {
      this.disabled = false;
      this.textContent = "Get OTP & Track Cargo";
    }
  });

// Mobile Tracking Number
document
  .getElementById("mb-track-awb")
  ?.addEventListener("click", async function () {
    const trackingInput = document.getElementById("mb-awb-number");
    const trackingId = trackingInput?.value.trim();

    clearError("mb-errortextMessage");

    if (!validateTrackingNumber(trackingId)) {
      showError("mb-errortextMessage", "Please enter a valid tracking number");
      return;
    }

    this.disabled = true;
    this.textContent = "Tracking...";

    try {
      const url = `${window.SUPABASE_CONFIG.url}/rest/v1/bookings?tracking_id=ilike.${trackingId}&select=*,origin_location:origin_location_id(name),destination_location:destination_location_id(name)`;

      const response = await fetch(url, {
        headers: {
          apikey: window.SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showError("mb-errortextMessage", "Error connecting to server");
        return;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        showError(
          "mb-errortextMessage",
          "No shipment found with this tracking number"
        );
      } else {
        showShipmentModal(data[0]);
      }
    } catch (err) {
      console.error("Error:", err);
      showError(
        "mb-errortextMessage",
        "Error tracking shipment. Please try again."
      );
    } finally {
      this.disabled = false;
      this.textContent = "Track Homeway Express";
    }
  });

// Mobile Reference Number
document
  .getElementById("mbtrack-order-id")
  ?.addEventListener("click", async function () {
    const orderInput = document.getElementById("mborder-id-input");
    const orderId = orderInput?.value.trim();

    clearError("mborder-id-errortextMessage");

    if (!validateTrackingNumber(orderId)) {
      showError(
        "mborder-id-errortextMessage",
        "Please enter a valid order ID or reference number"
      );
      return;
    }

    this.disabled = true;
    this.textContent = "Tracking...";

    try {
      const url = `${window.SUPABASE_CONFIG.url}/rest/v1/bookings?or=(order_number.ilike.*${orderId}*,booking_reference.ilike.*${orderId}*)&select=*,origin_location:origin_location_id(name),destination_location:destination_location_id(name)`;

      const response = await fetch(url, {
        headers: {
          apikey: window.SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showError("mborder-id-errortextMessage", "Error connecting to server");
        return;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        showError(
          "mborder-id-errortextMessage",
          "No shipment found with this reference"
        );
      } else {
        showShipmentModal(data[0]);
      }
    } catch (err) {
      console.error("Error:", err);
      showError(
        "mborder-id-errortextMessage",
        "Error tracking shipment. Please try again."
      );
    } finally {
      this.disabled = false;
      this.textContent = "Track ORDER ID / Trackboo NUMBER / Homeway Express+";
    }
  });

// Show Shipment Modal with Beautiful UI
async function showShipmentModal(shipment) {
  const existingModal = document.getElementById("shipment-modal");
  if (existingModal) {
    existingModal.remove();
  }

  console.log("Shipment data received:", shipment);
  console.log("All keys in shipment:", Object.keys(shipment));

  // Fetch package tracking data for this booking
  let packages = [];
  try {
    const packagesUrl = `${window.SUPABASE_CONFIG.url}/rest/v1/package_tracking?booking_id=eq.${shipment.id}&select=*&order=package_number.asc`;
    const packagesResponse = await fetch(packagesUrl, {
      headers: {
        apikey: window.SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
        "Content-Type": "application/json",
      },
    });

    if (packagesResponse.ok) {
      packages = await packagesResponse.json();
      console.log("📦 Fetched packages:", packages.length);
    }
  } catch (err) {
    console.error("Error fetching packages:", err);
  }

  // Calculate display status (may be aggregated for multi-package bookings)
  let displayStatus = shipment.status || "In Transit";
  const hasMultiplePackages = packages.length > 1;

  if (hasMultiplePackages && packages.length > 0) {
    const aggregation = calculateAggregatedStatus(packages);
    if (aggregation) {
      displayStatus = aggregation.status;
      console.log("📊 Using aggregated status for display:", displayStatus);
    }
  }

  const events = buildEventsFromBooking(shipment, packages);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateEstimatedDelivery = () => {
    if (shipment.estimated_delivery) {
      return formatDate(shipment.estimated_delivery);
    }

    if (shipment.delivery_days_min && shipment.delivery_days_max) {
      // Calculate from booking date or current date
      const startDate =
        shipment.confirmed_at || shipment.created_at || new Date();
      const baseDate = new Date(startDate);

      // Add max delivery days to get estimated date
      const estimatedDate = new Date(baseDate);
      estimatedDate.setDate(
        estimatedDate.getDate() + parseInt(shipment.delivery_days_max)
      );

      return `${shipment.delivery_days_min}-${
        shipment.delivery_days_max
      } days (${formatDate(estimatedDate)})`;
    }

    return "Pending";
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Pending";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Find the first in-progress step (completed: false) for pulsing
  let currentStepIndex = -1;
  for (let i = 0; i < events.length; i++) {
    if (!events[i].completed) {
      currentStepIndex = i;
      break;
    }
  }

  const modalHTML = `
        <div id="shipment-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(145deg, #1a0a1e 0%, #2b042c 50%, #1a0a1e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-in-out;
            backdrop-filter: blur(5px);
        " onclick="if(event.target.id === 'shipment-modal') this.remove();">
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInUp {
                    from { 
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to { 
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes pulse-ring {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }
                .pulse-dot {
                    position: relative;
                }
                .pulse-dot::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #f97316;
                    animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .modal-scrollbar::-webkit-scrollbar {
                    width: 0px;
                    display: none;
                }
                .modal-scrollbar {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
            </style>
            <!-- Close Button Outside Modal -->
            <button onclick="document.getElementById('shipment-modal').remove()" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255,107,53,0.9);
                border: 2px solid rgba(255,107,53,0.5);
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 44px;
                height: 44px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
                font-weight: 300;
                z-index: 10001;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            " onmouseover="this.style.background='#ff6b35'; this.style.transform='rotate(90deg) scale(1.1)'; this.style.borderColor='#ff6b35';" onmouseout="this.style.background='rgba(255,107,53,0.9)'; this.style.transform='rotate(0deg) scale(1)'; this.style.borderColor='rgba(255,107,53,0.5)';">
                ×
            </button>
            <div class="modal-scrollbar" style="
                
                border-radius: 20px;
                max-width: 550px;
                width: 90%;
                max-height: 92vh;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                
                animation: slideInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
            " onclick="event.stopPropagation();">
                
                <div style="padding: 30px 30px 30px 30px;">
                    <!-- Header -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="
                            color: #fff;
                            font-size: 26px;
                            margin-bottom: 15px;
                            font-weight: 700;
                            letter-spacing: -0.5px;
                        ">
                            Shipment Tracking
                        </h2>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between;">
                            <div style="
                                background: linear-gradient(135deg, #ff6b35, #f7931e);
                                display: inline-block;
                                padding: 10px 18px;
                                border-radius: 10px;
                                color: #fff;
                                font-weight: 700;
                                font-size: 17px;
                                box-shadow: 0 4px 15px rgba(255,107,53,0.3);
                            ">
                                ${shipment.tracking_id || "N/A"}
                            </div>
                            <div style="
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                                background: rgba(74,222,128,0.15);
                                border: 1.5px solid rgba(74,222,128,0.5);
                                padding: 8px 14px;
                                border-radius: 8px;
                            ">
                                <div style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80;"></div>
                                <span style="color: #4ade80; font-size: 14px; font-weight: 600; text-transform: capitalize;">
                                    ${displayStatus.replace(/_/g, " ")}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Route Info -->
                    <div style="
                        background: linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,107,53,0.03) 100%);
                        border: 1.5px solid rgba(255,107,53,0.25);
                        border-radius: 12px;
                        padding: 22px;
                        margin-bottom: 28px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    ">
                        <h3 style="color: #ff6b35; font-size: 13px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
                            Shipping Route
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 15px; margin-bottom: 15px; align-items: center;">
                            <div>
                                <div style="color: rgba(255,255,255,0.5); font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Origin</div>
                                <div style="color: #fff; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <img 
                                        src="${
                                          getCountryInfo(
                                            shipment.origin_location?.name ||
                                              shipment.sender_city ||
                                              ""
                                          ).flag
                                        }" 
                                        alt="${
                                          getCountryInfo(
                                            shipment.origin_location?.name ||
                                              shipment.sender_city ||
                                              ""
                                          ).alt
                                        }" 
                                        style="width: 24px; height: 16px; border-radius: 3px; object-fit: cover;"
                                    />
                                    <span>${
                                      shipment.origin_location?.name ||
                                      shipment.sender_city ||
                                      "N/A"
                                    }</span>
                                </div>
                            </div>
                            <div style="color: #ff6b35; font-size: 20px; padding: 0 10px;">
                                →
                            </div>
                            <div style="text-align: right;">
                                <div style="color: rgba(255,255,255,0.5); font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Destination</div>
                                <div style="color: #fff; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                    <img 
                                        src="${
                                          getCountryInfo(
                                            shipment.destination_location
                                              ?.name ||
                                              shipment.receiver_city ||
                                              ""
                                          ).flag
                                        }" 
                                        alt="${
                                          getCountryInfo(
                                            shipment.destination_location
                                              ?.name ||
                                              shipment.receiver_city ||
                                              ""
                                          ).alt
                                        }" 
                                        style="width: 24px; height: 16px; border-radius: 3px; object-fit: cover;"
                                    />
                                    <span>${
                                      shipment.destination_location?.name ||
                                      shipment.receiver_city ||
                                      "N/A"
                                    }</span>
                                </div>
                            </div>
                        </div>
                        <div style="
                            display: flex; 
                            justify-content: space-between; 
                            padding-top: 15px; 
                            border-top: 1px solid rgba(255,107,53,0.2);
                        ">
                            <div style="color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 500;">Est. Delivery</div>
                            <div style="color: #fff; font-size: 14px; font-weight: 600;">
                                ${calculateEstimatedDelivery()}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Timeline -->
                    <div style="margin-top: 35px;">
                        <h3 style="color: #ff6b35; font-size: 15px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 18px;">📦</span> Shipment Progress
                        </h3>
                        <div style="position: relative; padding-left: 35px; padding-right: 10px;">
                            ${events
                              .map((event, index) => {
                                const isCurrentStep =
                                  index === currentStepIndex;
                                const nextEvent = events[index + 1];
                                const showConnector = index < events.length - 1;
                                const connectorStyle =
                                  event.completed && !isCurrentStep
                                    ? "border-left: 3px solid #4ade80;"
                                    : "border-left: 3px dotted rgba(107,114,128,0.5);";

                                return `
                                <div style="position: relative; margin-bottom: ${
                                  index === events.length - 1 ? "0" : "30px"
                                };">
                                    ${
                                      showConnector
                                        ? `
                                    <div style="
                                        position: absolute;
                                        left: -12px;
                                        top: 28px;
                                        height: calc(100% + 30px);
                                        ${connectorStyle}
                                    "></div>
                                    `
                                        : ""
                                    }
                                    <div class="${
                                      isCurrentStep ? "pulse-dot" : ""
                                    }" style="
                                        position: absolute;
                                        left: -25px;
                                        width: ${
                                          isCurrentStep ? "28px" : "26px"
                                        };
                                        height: ${
                                          isCurrentStep ? "28px" : "26px"
                                        };
                                        border-radius: 50%;
                                        background: ${
                                          event.completed
                                            ? "linear-gradient(135deg, #4ade80, #22c55e)"
                                            : isCurrentStep
                                            ? "linear-gradient(135deg, #f97316, #ff6b35)"
                                            : "linear-gradient(135deg, #64748b, #475569)"
                                        };
                                        border: ${
                                          isCurrentStep ? "3px" : "3px"
                                        } solid ${
                                  event.completed
                                    ? "#16a34a"
                                    : isCurrentStep
                                    ? "#ff6b35"
                                    : "#94a3b8"
                                };
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        box-shadow: ${
                                          event.completed
                                            ? "0 0 15px rgba(74,222,128,0.4)"
                                            : isCurrentStep
                                            ? "0 0 20px rgba(249,115,22,0.6)"
                                            : "0 0 8px rgba(100,116,139,0.3)"
                                        };
                                        transition: all 0.3s ease;
                                        z-index: 1;
                                    ">
                                        ${
                                          event.completed
                                            ? '<span style="color: #fff; font-size: 14px; font-weight: bold;">✓</span>'
                                            : isCurrentStep
                                            ? '<span style="color: #fff; font-size: 12px;">⏱</span>'
                                            : ""
                                        }
                                    </div>
                                    <div style="padding-left: 15px;">
                                        <div style="color: #fff; font-size: 15px; font-weight: ${
                                          event.completed || isCurrentStep
                                            ? "700"
                                            : "400"
                                        }; margin-bottom: 5px;">
                                            ${event.status}
                                        </div>
                                        <div style="color: ${
                                          event.completed
                                            ? "rgba(74,222,128,0.9)"
                                            : isCurrentStep
                                            ? "rgba(249,115,22,0.9)"
                                            : "rgba(255,255,255,0.5)"
                                        }; font-size: 12px; margin-bottom: 3px; font-weight: 500;">
                                            ${
                                              event.completed
                                                ? formatDateTime(event.date)
                                                : isCurrentStep
                                                ? "In Progress..."
                                                : "Pending"
                                            }
                                        </div>
                                        <div style="color: rgba(255,255,255,0.6); font-size: 12px; font-style: italic;">
                                            ${
                                              event.description ||
                                              getStatusDescription(event.status)
                                            }
                                        </div>
                                        ${
                                          event.subEvents &&
                                          event.subEvents.length > 0
                                            ? `
                                        <div style="margin-top: 12px; padding-left: 12px; border-left: 2px solid rgba(249,115,22,0.3);">
                                            ${event.subEvents
                                              .map(
                                                (subEvent) => `
                                            <div style="margin-bottom: 8px; padding: 8px 12px; background: rgba(249,115,22,0.1); border-radius: 6px; border: 1px solid rgba(249,115,22,0.2);">
                                                <div style="color: #f97316; font-size: 12px; font-weight: 600;">
                                                    ${subEvent.description}
                                                </div>
                                                <div style="color: rgba(249,115,22,0.7); font-size: 11px; margin-top: 2px;">
                                                    ${formatDateTime(
                                                      subEvent.date
                                                    )}
                                                </div>
                                            </div>
                                            `
                                              )
                                              .join("")}
                                        </div>
                                        `
                                            : ""
                                        }
                                    </div>
                                </div>
                            `;
                              })
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Calculate Aggregated Status for Multi-Package Shipments
function calculateAggregatedStatus(packages) {
  if (!packages || packages.length === 0) return null;
  if (packages.length === 1) {
    return { status: packages[0].status || "CONFIRMED", description: "" };
  }

  const total = packages.length;
  const statuses = packages.map((p) => p.status?.toUpperCase());

  // Priority 1: All Delivered
  if (statuses.every((s) => s === "DELIVERED" || s === "COMPLETED")) {
    return {
      status: "DELIVERED",
      description: "All packages have been delivered.",
    };
  }

  // Priority 2: All Confirmed (no movement yet)
  if (statuses.every((s) => s === "CONFIRMED" || s === "PENDING")) {
    return {
      status: "CONFIRMED",
      description: "All packages are confirmed and awaiting pickup.",
    };
  }

  // Priority 3: Some Delivered, Some Not (Partial Delivery)
  const deliveredCount = statuses.filter(
    (s) => s === "DELIVERED" || s === "COMPLETED"
  ).length;
  if (deliveredCount > 0 && deliveredCount < total) {
    return {
      status: "IN PROGRESS (Multi-Pieces Processing)",
      description: `${deliveredCount}/${total} packages delivered; remaining in transit.`,
    };
  }

  // Priority 4: Check for mixed statuses (different statuses among packages)
  const uniqueStatuses = new Set(statuses);
  if (uniqueStatuses.size > 1) {
    // Packages have different statuses - show partial progress
    const counts = {};
    packages.forEach((p) => {
      const s = p.status || "Unknown";
      counts[s] = (counts[s] || 0) + 1;
    });

    const summaryParts = Object.entries(counts).map(([s, c]) => {
      const formattedS = s.replace(/_/g, " ").toLowerCase();
      return `${c}/${total} packages ${formattedS}`;
    });

    return {
      status: "IN PROGRESS (Multi-Pieces Processing)",
      description: summaryParts.join("; "),
    };
  }

  // Priority 5: In Transit (all moving with same status)
  const movingStates = [
    "TRANSIT",
    "PICKED_UP",
    "LOADING",
    "LOADED",
    "DEPARTED",
    "CUSTOMS",
    "OFFLOAD",
    "ARRIVED",
  ];
  if (statuses.every((s) => movingStates.some((k) => s?.includes(k)))) {
    return {
      status: "IN TRANSIT",
      description: "All packages are on the way.",
    };
  }

  // Priority 6: Fallback - return first package status
  return {
    status: packages[0].status || "CONFIRMED",
    description: "",
  };
}

// Get Status Description
function getStatusDescription(status) {
  const statusUpper = status.toUpperCase();

  const descriptions = {
    // Core Life Cycle
    CONFIRMED: "Booking confirmed and ready for processing",
    ASSIGNED_DRIVER: "Driver assigned to handle pickup",
    PICKED_UP: "Driver has picked up shipment",
    ARRIVED_ORIGIN_FACILITY:
      "Shipment arrived at origin facility for processing",

    // Preparation / Origin Facility
    PREPARE_FOR_LOADING: "Shipment being prepared for loading",
    NOT_LOADED_DUE_TO_PAYMENT: "Loading on hold - payment pending",
    STORAGE_IN_ORIGIN_FACILITY: "Shipment stored in origin facility",

    // Loading Milestones
    LOADING_IN_PROGRESS: "Shipment is being loaded onto transport",
    LOADED_ONTO_TRANSPORT: "Shipment loaded and ready for departure",
    LOADED_INTO_CONTAINER: "Shipment loaded into shipping container",
    LOADED_INTO_AIR_FLIGHT: "Shipment loaded onto aircraft",
    LOADED_ONTO_RAIL: "Shipment loaded onto rail transport",
    LOADED_INTO_TRUCK: "Shipment loaded into truck for transport",
    TRANSPORT_DEPARTED: "Transport vehicle departed with shipment",
    TRANSPORT_ARRIVED: "Transport vehicle arrived at destination",
    ARRIVED_ORIGIN_SUPER_HUB: "Shipment arrived at origin super hub",
    READY_FOR_MAIN_CARRIAGE: "Shipment ready for main transport leg",
    MANIFEST_PREPARED: "Shipping manifest prepared and filed",

    // Transit
    ARRIVED_AT_ORIGIN_PORT: "Shipment arrived at origin port",
    ARRIVED_AT_ORIGIN_AIRPORT: "Shipment arrived at origin airport",
    ARRIVED_AT_ORIGIN_RAIL_TERMINAL: "Shipment arrived at origin rail terminal",
    ARRIVED_AT_ORIGIN_TRANSPORTING_HUB:
      "Shipment arrived at origin transport hub",
    DEPARTED_FROM_ORIGIN_PORT: "Vessel departed from origin port",
    DEPARTED_FROM_ORIGIN_AIRPORT: "Flight departed from origin airport",
    DEPARTED_FROM_ORIGIN_RAIL_TERMINAL: "Train departed from origin terminal",
    DEPARTED_FROM_ORIGIN_TRANSPORTING_HUB: "Transport departed from origin hub",
    IN_TRANSIT: "Shipment is in transit to destination",
    ARRIVED_AT_DESTINATION_PORT: "Shipment arrived at destination port",
    ARRIVED_AT_DESTINATION_AIRPORT: "Shipment arrived at destination airport",
    ARRIVED_AT_DESTINATION_RAIL_TERMINAL:
      "Shipment arrived at destination rail terminal",
    ARRIVED_AT_DESTINATION_TRANSPORTING_HUB:
      "Shipment arrived at destination transport hub",
    DEPARTED_FROM_DESTINATION_AIRPORT:
      "Shipment departed destination airport for delivery",
    DEPARTED_FROM_DESTINATION_PORT:
      "Shipment departed destination port for delivery",
    DEPARTED_FROM_DESTINATION_RAIL_TERMINAL:
      "Shipment departed destination rail terminal",
    DEPARTED_FROM_DESTINATION_TRANSPORTING_HUB:
      "Shipment departed destination hub for delivery",

    // Customs
    ARRIVED_FOR_CUSTOMS_INSPECTION: "Shipment arrived for customs inspection",
    CUSTOMS_PROCESSING: "Customs clearance in progress",
    UNDER_CUSTOMS_INSPECTION: "Shipment undergoing customs inspection",
    CUSTOMS_CLEARED: "Customs clearance completed successfully",
    CUSTOMS_HELD: "Shipment held by customs for review",
    CUSTOMS_REJECTED: "Shipment rejected by customs",
    CUSTOMS_SEIZED: "Shipment seized by customs authorities",
    DEPARTED_FROM_CUSTOMS: "Shipment released and departed customs",

    // Offloading Milestones
    ARRIVED_DESTINATION_SUPER_HUB: "Shipment arrived at destination super hub",
    PREPARE_FOR_OFFLOADING: "Shipment being prepared for offloading",
    OFFLOADING_IN_PROGRESS: "Shipment is being offloaded from transport",
    READY_FOR_DOMESTIC_TRANSFER: "Shipment ready for domestic transfer",
    FREIGHT_BREAKDOWN: "Freight being sorted and organized",
    OFFLOADED_TO_TERMINAL: "Shipment offloaded to terminal",
    OFFLOADED_FROM_CONTAINER: "Shipment removed from container",
    OFFLOADED_FROM_AIR_FLIGHT: "Shipment offloaded from aircraft",
    OFFLOADED_FROM_RAIL: "Shipment offloaded from rail transport",
    OFFLOADED_FROM_TRUCK: "Shipment offloaded from truck",

    // Preparation / Destination Facility
    SORTING_IN_PROGRESS: "Shipment being sorted at facility",
    CHECKING_IN_PROGRESS: "Shipment inspection in progress",
    ARRIVED_DESTINATION_FACILITY: "Shipment arrived at destination facility",
    STORAGE_IN_DESTINATION_FACILITY: "Shipment stored at destination facility",

    // Delivery & Collection
    READY_FOR_COLLECTION: "Shipment ready for customer collection",
    OUT_FOR_DELIVERY: "Shipment out for delivery to final address",
    DELIVERY_ATTEMPTED: "Delivery attempted - recipient unavailable",
    READY_FOR_DOOR_TO_DOOR: "Shipment ready for door-to-door delivery",
    DELIVERED: "Shipment has been delivered successfully",
    COMPLETED: "Shipment journey completed",

    // Fulfilment Milestones
    FULFILMENT_ORDER_RECEIVED: "Fulfillment order received and processing",
    INVENTORY_ALLOCATED: "Inventory allocated for this shipment",
    PACKING_IN_PROGRESS: "Shipment being packed for transport",
    LABEL_GENERATED: "Shipping label generated and applied",
    HANDED_OVER_TO_LAST_MILE: "Shipment handed over to last-mile carrier",

    // Exceptions and Holds
    CANCELLED: "Shipment has been cancelled",
    ON_HOLD: "Shipment placed on hold",
    DELAYED: "Shipment delayed - revised timeline to follow",
    PENDING: "Shipment pending further action",
    EXCEPTION: "Exception occurred - immediate attention required",
    ROUTE_DIVERTED: "Shipment route diverted due to circumstances",
    LOST_OR_DAMAGED: "Shipment reported lost or damaged",

    // Detailed Holds and Actions
    AWAITING_PAYMENT: "Shipment on hold - awaiting payment",
    DOCUMENTS_REQUIRED: "Shipment held - documents required",
    FAILED_COLLECTION: "Collection attempt failed",
    HELD_FOR_INSPECTION: "Shipment held for inspection",
    RETURNED_TO_SENDER: "Shipment being returned to sender",
    RETURN_IN_TRANSIT: "Shipment in transit back to sender",

    // Emergency/Force Majeure
    WEATHER_HOLD: "Shipment delayed due to weather conditions",
    STRIKES_HOLD: "Shipment delayed due to labor strikes",
    ACCIDENT_HOLD: "Shipment delayed due to accident or incident",
    PORT_CONGESTION_HOLD: "Shipment delayed due to port congestion",
    CIVIL_UNREST_HOLD: "Shipment delayed due to civil unrest",
  };

  return descriptions[statusUpper] || "Shipment is being processed";
}

// Format Status for Display
function formatStatusForDisplay(status) {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

// Build Events Timeline - Dynamic approach using status_history
function buildEventsFromBooking(booking, packages = []) {
  const events = [];
  const hasMultiplePackages = packages.length > 1;

  // Determine the effective status to display
  let currentStatus = (booking.status || "CONFIRMED").toUpperCase();

  // If this is a master booking with multiple packages, use aggregated status
  if (hasMultiplePackages && packages.length > 0) {
    const aggregation = calculateAggregatedStatus(packages);
    if (aggregation) {
      currentStatus = aggregation.status;
      console.log("📦 Using aggregated status:", currentStatus);
    }
  }

  const isDelivered =
    currentStatus === "DELIVERED" || currentStatus === "COMPLETED";

  // STEP 1: Always add "Booking Confirmed" at the start
  const statusHistory = booking.status_history || [];

  // Booking Confirmed is current step if:
  // - Status is CONFIRMED/PENDING AND no status_history exists
  // OR - All packages are still CONFIRMED (for multi-package bookings)
  const allPackagesConfirmed = hasMultiplePackages
    ? packages.every((p) => p.status === "CONFIRMED")
    : false;

  const bookingIsCurrentStep =
    ((currentStatus === "CONFIRMED" || currentStatus === "PENDING") &&
      statusHistory.length === 0) ||
    allPackagesConfirmed;

  events.push({
    status: "Booking Confirmed",
    date: booking.created_at || booking.booking_date || new Date(),
    description: "Booking confirmed and ready for processing",
    location: "",
    completed: !bookingIsCurrentStep,
  });

  // Check if shipment is fully delivered
  const isFullyDelivered = hasMultiplePackages
    ? packages.every(
        (p) => p.status === "DELIVERED" || p.status === "COMPLETED"
      )
    : isDelivered;

  // STEP 2: Add all historical statuses from status_history
  if (statusHistory.length > 0) {
    // We have history - display ALL entries except CONFIRMED (already shown above)
    statusHistory.forEach((historyEntry, index) => {
      // Skip "CONFIRMED" if we already added "Booking Confirmed"
      if (historyEntry.status === "CONFIRMED") return;

      // Determine if this entry is complete
      const isLastHistoryEntry = index === statusHistory.length - 1;
      const historyEntryStatus = historyEntry.status.toUpperCase();
      const isThisEntryDelivered =
        historyEntryStatus === "DELIVERED" ||
        historyEntryStatus === "COMPLETED";

      // If packages have different statuses, this becomes a completed step
      // because we'll add a separate "IN PROGRESS (PARTIAL)" step after
      let hasPartialStatus = false;
      if (isLastHistoryEntry && hasMultiplePackages && packages.length > 0) {
        const packageStatuses = packages.map((p) => p.status?.toUpperCase());
        const uniqueStatuses = new Set(packageStatuses);
        hasPartialStatus = uniqueStatuses.size > 1;
      }

      // Entry is completed if:
      // 1. It's delivered/completed itself, OR
      // 2. The overall shipment is delivered/completed, OR
      // 3. It's not the last entry, OR
      // 4. It's the last entry but packages have partial status (different statuses)
      const isCompleted =
        isThisEntryDelivered ||
        isFullyDelivered ||
        !isLastHistoryEntry ||
        hasPartialStatus;

      events.push({
        status: formatStatusForDisplay(historyEntry.status),
        date: historyEntry.timestamp || new Date(),
        location:
          historyEntry.location || booking.current_location || "In Progress",
        completed: isCompleted,
        description: getStatusDescription(historyEntry.status),
        updated_by: historyEntry.updated_by || "",
        previous_status: historyEntry.previous_status || "",
      });
    });

    // After processing all history, check if we need to add "IN PROGRESS (PARTIAL)" step
    if (hasMultiplePackages && packages.length > 0 && !isFullyDelivered) {
      // Check if packages have different statuses
      const packageStatuses = packages.map((p) => p.status?.toUpperCase());
      const uniqueStatuses = new Set(packageStatuses);

      if (uniqueStatuses.size > 1) {
        // Packages have different statuses - add a separate "IN PROGRESS (PARTIAL)" event
        const subEvents = [];

        // Sort packages by package_number to maintain order
        const sortedPackages = [...packages].sort(
          (a, b) => a.package_number - b.package_number
        );

        // Create a sub-event for each individual package
        sortedPackages.forEach((pkg, index) => {
          const pkgStatus = pkg.status?.toUpperCase() || "UNKNOWN";
          let latestDate = new Date();

          // Get the latest timestamp for this package's current status from its status_history
          if (pkg.status_history && Array.isArray(pkg.status_history)) {
            const statusEntry = pkg.status_history
              .filter((h) => h.status === pkgStatus)
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              )[0];

            if (statusEntry) {
              latestDate = new Date(statusEntry.timestamp);
            }
          }

          // Add sub-event for this individual package showing its position
          subEvents.push({
            description: `${index + 1}/${
              packages.length
            } packages ${formatStatusForDisplay(pkgStatus).toLowerCase()}`,
            date: latestDate,
          });
        });

        // Find the most recent timestamp among all sub-events for the main event date
        const mostRecentDate = Math.max(
          ...subEvents.map((se) => se.date.getTime())
        );

        // Add the "IN PROGRESS (PARTIAL)" event as current step
        events.push({
          status: "IN PROGRESS (Multi-Pieces Processing)",
          date: new Date(mostRecentDate),
          location: booking.current_location || "In Progress",
          completed: false, // This is the current step
          description:
            "Packages at different processing stage - see details below:",
          subEvents: subEvents,
        });
      }
    }
  } else {
    // No history yet - this happens for bookings created before status_history was added
    // OR bookings that have never had their status updated
    console.log(
      "⚠️ No status_history found, building from current status:",
      currentStatus
    );

    // If current status is not CONFIRMED, show it as in-progress
    if (
      currentStatus &&
      currentStatus !== "CONFIRMED" &&
      currentStatus !== "PENDING" &&
      currentStatus !== "DELIVERED" &&
      currentStatus !== "COMPLETED"
    ) {
      events.push({
        status: formatStatusForDisplay(currentStatus),
        date: booking.updated_at || booking.created_at || new Date(),
        location: booking.current_location || "In Progress",
        completed: false, // Current status is in progress (should pulse)
        description: getStatusDescription(currentStatus),
      });
    }
  }

  // STEP 3: Add "Delivered" at the end if not already in history
  const hasDeliveredInHistory = statusHistory.some(
    (h) => h.status === "DELIVERED" || h.status === "COMPLETED"
  );

  if (!hasDeliveredInHistory) {
    if (isFullyDelivered) {
      events.push({
        status: "Delivered",
        date: booking.delivered_at || new Date(),
        location: "",
        completed: true,
        description: "Shipment has been delivered successfully",
      });
    } else {
      // Future delivery - estimate based on delivery_days_max or default
      const estimatedDelivery = booking.estimated_delivery
        ? new Date(booking.estimated_delivery)
        : booking.delivery_days_max
        ? new Date(Date.now() + booking.delivery_days_max * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days

      events.push({
        status: "Delivered",
        date: estimatedDelivery,
        location: "",
        completed: false, // Future step (should NOT pulse)
        description: "Estimated delivery date",
      });
    }
  }

  return events;
}
