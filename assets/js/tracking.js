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
function showShipmentModal(shipment) {
  const existingModal = document.getElementById("shipment-modal");
  if (existingModal) {
    existingModal.remove();
  }

  console.log("Shipment data received:", shipment); // Debug log
  console.log("All keys in shipment:", Object.keys(shipment));
  console.log("Origin:", shipment.origin_city, shipment.origin_country);
  console.log(
    "Destination:",
    shipment.destination_city,
    shipment.destination_country
  );
  console.log("Estimated Delivery:", shipment.estimated_delivery);

  const events = buildEventsFromBooking(shipment);

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

  let currentStepIndex = -1;
  for (let i = 0; i < events.length; i++) {
    if (
      events[i].completed &&
      (i === events.length - 1 || !events[i + 1].completed)
    ) {
      currentStepIndex = i + 1 < events.length ? i + 1 : -1;
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
                    width: 8px;
                }
                .modal-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                }
                .modal-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,107,53,0.5);
                    border-radius: 4px;
                }
                .modal-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,107,53,0.7);
                }
            </style>
            <div class="modal-scrollbar" style="
                
                border-radius: 20px;
                max-width: 550px;
                width: 90%;
                max-height: 92vh;
                display: flex;
                flex-direction: column;
                
                
                animation: slideInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
            " onclick="event.stopPropagation();">
                <!-- Close Button -->
                <div style="position: sticky; top: 0; right: 0; padding: 20px 20px 0 20px; text-align: right; background: linear-gradient(180deg, #1a0a1e 0%, transparent 100%); z-index: 10; border-radius: 20px 20px 0 0;">
                    <button onclick="document.getElementById('shipment-modal').remove()" style="
                        background: rgba(255,107,53,0.1);
                        border: 1px solid rgba(255,107,53,0.3);
                        color: #ff6b35;
                        font-size: 24px;
                        cursor: pointer;
                        line-height: 1;
                        padding: 0;
                        width: 36px;
                        height: 36px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                        font-weight: 300;
                    " onmouseover="this.style.background='rgba(255,107,53,0.3)'; this.style.transform='rotate(90deg)'; this.style.borderColor='#ff6b35';" onmouseout="this.style.background='rgba(255,107,53,0.1)'; this.style.transform='rotate(0deg)'; this.style.borderColor='rgba(255,107,53,0.3)';">
                        ×
                    </button>
                </div>
                
                <div style="padding: 0 30px 30px 30px;">
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
                                    ${(shipment.status || "In Transit").replace(
                                      "_",
                                      " "
                                    )}
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
                                <div style="color: #fff; font-size: 15px; font-weight: 600;">
                                    ${
                                      shipment.origin_location?.name ||
                                      shipment.sender_city ||
                                      "N/A"
                                    }
                                </div>
                            </div>
                            <div style="color: #ff6b35; font-size: 20px; padding: 0 10px;">
                                →
                            </div>
                            <div style="text-align: right;">
                                <div style="color: rgba(255,255,255,0.5); font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Destination</div>
                                <div style="color: #fff; font-size: 15px; font-weight: 600;">
                                    ${
                                      shipment.destination_location?.name ||
                                      shipment.receiver_city ||
                                      "N/A"
                                    }
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
                    <div style="margin-top: 35px; max-height: 400px; overflow: hidden; display: flex; flex-direction: column;">
                        <h3 style="color: #ff6b35; font-size: 15px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                            <span style="font-size: 18px;">📦</span> Shipment Progress
                        </h3>
                        <div class="modal-scrollbar" style="position: relative; padding-left: 35px; padding-right: 10px; overflow-y: auto; flex: 1; min-height: 0;">
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
                                            ${event.location}
                                        </div>
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

// Build Events Timeline
function buildEventsFromBooking(booking) {
  const events = [];

  const standardEvents = [
    {
      key: "confirmed",
      timestamp: booking.confirmed_at || booking.created_at,
      status: "Booking Confirmed",
      location:
        booking.origin_location?.name ||
        `${booking.sender_city}, ${booking.sender_country}`,
    },
    {
      key: "assigned",
      timestamp: booking.assigned_at,
      status: "Assigned to Carrier",
      location: booking.current_location || "Processing",
    },
    {
      key: "picked_up",
      timestamp: booking.picked_up_at,
      status: "Shipment Picked Up",
      location:
        booking.origin_location?.name ||
        `${booking.sender_city}, ${booking.sender_country}`,
    },
    {
      key: "in_transit",
      timestamp: booking.in_transit_at,
      status: "In Transit",
      location: booking.current_location || "In Transit",
    },
    {
      key: "customs",
      timestamp: booking.customs_cleared_at,
      status: "Customs Cleared",
      location: booking.current_location || "Customs",
    },
    {
      key: "out_for_delivery",
      timestamp: booking.out_for_delivery_at,
      status: "Out for Delivery",
      location:
        booking.destination_location?.name ||
        `${booking.receiver_city}, ${booking.receiver_country}`,
    },
    {
      key: "delivered",
      timestamp: booking.delivered_at,
      status: "Delivered",
      location:
        booking.destination_location?.name ||
        `${booking.receiver_city}, ${booking.receiver_country}`,
    },
  ];

  standardEvents.forEach((event) => {
    events.push({
      date: event.timestamp ? new Date(event.timestamp) : new Date(),
      location: event.location,
      status: event.status,
      completed: !!event.timestamp,
    });
  });

  return events;
}
