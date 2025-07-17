const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g., 'whatsapp:+14155238886'

const client = twilio(accountSid, authToken);

/**
 * Send a WhatsApp message using Twilio
 * @param {string} phone - Recipient phone number in E.164 format (e.g., +1234567890)
 * @param {string} message - Message text to send
 * @returns {Promise<object>} - Twilio API response
 */
function sendWhatsAppMessage({ phone, message }) {
  if (!accountSid || !authToken || !whatsappFrom) {
    return Promise.reject(
      new Error("Twilio credentials or WhatsApp sender number not set in environment variables.")
    );
  }
  console.log(message);
  return client.messages
    .create({
      from: `whatsapp:${whatsappFrom}`,
      to: `whatsapp:${phone}`,
      body: message,
    })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  sendWhatsAppMessage,
};
