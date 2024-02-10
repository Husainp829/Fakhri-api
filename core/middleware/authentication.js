const admin = require("firebase-admin");
const constants = require("../const/constants");

function authenticate(req, res, next) {
  try {
    const auth = req.get("authorization");
    const eventId = req.get("eventid");

    if (auth) {
      admin
        .auth()
        .verifyIdToken(auth, true)
        .then((claims) => {
          req.decoded = {
            permissions: claims.permissions,
            uid: claims.user_id,
            userId: claims.userId,
            eventId,
          };
          next();
        })
        .catch(() => {
          sendError(res, "Unauthorized access", constants.HTTP_STATUS_CODES.UNAUTHORIZED);
        });
    } else {
      sendError(res, "Unauthorized access", constants.HTTP_STATUS_CODES.UNAUTHORIZED);
    }
  } catch (err) {
    sendError(res, "Something went wrong", constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  authenticate,
};
