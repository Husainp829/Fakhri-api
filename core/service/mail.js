const { SendMailClient } = require("zeptomail");

const url = process.env.ZOHO_ZEPTO_URL;
const token = process.env.ZOHO_ZEPTO_TOKEN;

function sendBatchConfirmation(config) {
  const client = new SendMailClient({ url, token });
  return new Promise((resolve, reject) => {
    client
      .MailBatchWithTemplate(config)
      .then((resp) => {
        console.log(resp);
        return resolve(resp);
      })
      .catch((error) => {
        console.log(error);
        return reject(error);
      });
  });
}

module.exports = {
  sendBatchConfirmation,
};
