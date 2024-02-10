/* eslint-disable consistent-return */
const imageType = require("image-type");
const s3 = require("../../../storageConfigDO");
const constants = require("../../const/constants");

const upload = (req, res) => {
  const { eventId } = req.decoded;
  const { type, base64Image } = req.body;
  const imageBuffer = Buffer.from(base64Image, "base64");
  const { mime: contentType, ext } = imageType(imageBuffer);
  if (contentType !== "image/png" && contentType !== "image/jpg" && contentType !== "image/jpeg") {
    return sendError(
      res,
      "Only .png, .jpg and .jpeg format allowed!",
      constants.HTTP_STATUS_CODES.BAD_REQUEST
    );
  }
  const rndstr = new Date().getTime();
  const fullPath = `${eventId}/${type}/${rndstr}.${ext}`;
  // Set the parameters for S3 upload
  const params = {
    Bucket: process.env.DO_SPACES_NAME,
    ACL: "public-read",
    Key: fullPath,
    Body: imageBuffer,
    ContentType: contentType,
  };

  // Upload the image to S3
  s3.upload(params, (error, data) => {
    if (error) {
      return sendError(res, error.message, constants.HTTP_STATUS_CODES.BAD_REQUEST);
    }
    return sendResponse(res, { image: data.Location }, constants.HTTP_STATUS_CODES.OK);
  });
};

module.exports = {
  upload,
};
