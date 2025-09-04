const axios = require("axios");

const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
const accessToken = process.env.META_ACCESS_TOKEN;
const apiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

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
        type: "text",
        text: {
          body: message,
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

module.exports = {
  sendWhatsAppMessage,
};
