const admin = require("firebase-admin");
const { LRUCache } = require("lru-cache");
const constants = require("../const/constants");

const tokenCache = new LRUCache({
  max: 500, // max number of tokens to store
  ttl: 1000 * 60 * 5, // cache for 5 minutes
});

function authenticate(req, res, next) {
  try {
    const auth = req.get("authorization");
    const eventId = req.get("eventid");

    if (!auth) {
      sendError(res, "Unauthorized access", constants.HTTP_STATUS_CODES.UNAUTHORIZED);
    }

    const cached = tokenCache.get(auth);
    if (cached && cached.exp * 1000 > Date.now()) {
      // token is valid and not expired
      req.decoded = {
        permissions: cached.permissions,
        uid: cached.uid,
        userId: cached.userId,
        eventId: cached.eventId,
      };
      next();
      return;
    }

    admin
      .auth()
      .verifyIdToken(auth, true)
      .then((claims) => {
        const { permissions, user_id: uid, exp } = claims;
        const decoded = {
          permissions,
          uid,
          userId: claims.userId,
          eventId,
          exp,
        };

        const ttl = Math.min(1000 * 60 * 5, exp * 1000 - Date.now());
        if (ttl > 0) {
          tokenCache.set(auth, decoded, { ttl });
        }

        req.decoded = decoded;
        next();
      })
      .catch(() => {
        sendError(res, "Unauthorized access", constants.HTTP_STATUS_CODES.UNAUTHORIZED);
      });
  } catch (err) {
    sendError(res, "Something went wrong", constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  authenticate,
};
