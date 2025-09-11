const axios = require("axios");

const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
const accessToken = process.env.META_ACCESS_TOKEN;
const apiUrl = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

/**
 * Send a WhatsApp message using Meta's WhatsApp Business API
 * @param {string} phone - Recipient phone number in E.164 format (e.g., +1234567890)
 * @param {string} message - Message text to send
 * @returns {Promise<object>} - Meta API response
 */
function sendWhatsAppMessage({ phone, message }) {
  if (!phoneNumberId || !accessToken) {
    return Promise.reject(
      new Error(
        "Meta phone number ID or access token not set in environment variables."
      )
    );
  }
  return axios
    .post(
      apiUrl,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "template",
        template: { name: "hello_world", language: { code: "en_US" } },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log("WhatsApp message sent via Meta:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error sending WhatsApp message via Meta:",
        error.response ? error.response.data : error.message
      );
      throw error;
    });
}

/**
 * Send booking confirmation message via WhatsApp using Meta template
 * @param {string} phone - Recipient phone number in E.164 format (e.g., +1234567890)
 * @param {string} organiserName - Organiser name ({{1}})
 * @param {string} hallName - Hall name ({{2}})
 * @param {string} bookingDate - Booking date ({{3}})
 * @param {string} slot - Slot ({{4}})
 * @param {string} bookingNumber - Booking number ({{5}})
 * @returns {Promise<object>} - Meta API response
 */
function sendBookingConfirmation({
  phone,
  organiserName,
  hallName,
  bookingDate,
  slot,
  bookingNumber,
}) {
  if (!phoneNumberId || !accessToken) {
    return Promise.reject(
      new Error(
        "Meta phone number ID or access token not set in environment variables."
      )
    );
  }

  return axios
    .post(
      apiUrl,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "template",
        template: {
          name: "hall_booking_confirmation",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: organiserName },
                { type: "text", text: hallName },
                { type: "text", text: bookingDate },
                { type: "text", text: slot },
                { type: "text", text: bookingNumber },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(
        "Booking confirmation WhatsApp message sent via Meta:",
        response.data
      );
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error sending booking confirmation WhatsApp message via Meta:",
        error.response ? error.response.data : error.message
      );
      throw error;
    });
}

/**
 * Send hall contribution confirmation message via WhatsApp using Meta template
 * @param {string} phone - Recipient phone number in E.164 format (e.g., +1234567890)
 * @param {string} bookingNumber - Booking number ({{1}})
 * @param {string} contributionDate - Contribution date ({{2}})
 * @param {string} amount - Contribution amount ({{3}})
 * @param {string} receiptNumber - Receipt number ({{4}})
 * @param {string} receiptUrl - URL for the receipt (call-to-action button)
 * @returns {Promise<object>} - Meta API response
 */
function sendHallContributionConfirmation({
  phone,
  bookingNumber,
  contributionDate,
  amount,
  receiptNumber,
  receiptUrl,
}) {
  if (!phoneNumberId || !accessToken) {
    return Promise.reject(
      new Error(
        "Meta phone number ID or access token not set in environment variables."
      )
    );
  }

  return axios
    .post(
      apiUrl,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "template",
        template: {
          name: "hall_contribution_confirmation",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: bookingNumber },
                { type: "text", text: contributionDate },
                { type: "text", text: amount },
                { type: "text", text: receiptNumber },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                {
                  type: "text",
                  text: receiptUrl,
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(
        "Hall contribution confirmation WhatsApp message sent via Meta:",
        response.data
      );
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error sending hall contribution confirmation WhatsApp message via Meta:",
        error.response ? error.response.data : error.message
      );
      throw error;
    });
}

/**
 * Send hall deposit confirmation message via WhatsApp using Meta template
 * @param {string} phone - Recipient phone number in E.164 format (e.g., +1234567890)
 * @param {string} bookingNumber - Booking number ({{1}})
 * @param {string} depositDate - Deposit date ({{2}})
 * @param {string} amount - Deposit amount ({{3}})
 * @param {string} receiptNumber - Receipt number ({{4}})
 * @param {string} receiptUrl - URL for the receipt (call-to-action button)
 * @returns {Promise<object>} - Meta API response
 */
function sendHallDepositConfirmation({
  phone,
  bookingNumber,
  depositDate,
  amount,
  receiptNumber,
  receiptUrl,
}) {
  if (!phoneNumberId || !accessToken) {
    return Promise.reject(
      new Error(
        "Meta phone number ID or access token not set in environment variables."
      )
    );
  }

  return axios
    .post(
      apiUrl,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "template",
        template: {
          name: "hall_deposit_confirmation",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: bookingNumber },
                { type: "text", text: depositDate },
                { type: "text", text: amount },
                { type: "text", text: receiptNumber },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                {
                  type: "text",
                  text: receiptUrl,
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(
        "Hall deposit confirmation WhatsApp message sent via Meta:",
        response.data
      );
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error sending hall deposit confirmation WhatsApp message via Meta:",
        error.response ? error.response.data : error.message
      );
      throw error;
    });
}

module.exports = {
  sendWhatsAppMessage,
  sendBookingConfirmation,
  sendHallContributionConfirmation,
  sendHallDepositConfirmation,
};
