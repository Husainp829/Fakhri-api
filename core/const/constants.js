module.exports = {
  FORMATS: {
    DATE_API: "YYYY-MM-DD",
    DATETIME_API: "YYYY-MM-DD HH:mm",
    DATETIMEINHOURS_API: "YYYY-MM-DD HH",
    DATETIMESEC_API: "YYYY-MM-DD HH:mm:ss",
    TIME_API: "HH:mm",
  },

  BCRYPT_SALT_ROUNDS: 10,

  JWT: {
    SECRET: "pass@1234@4321",
  },

  ROUTES: {
    ADMIN_LOGIN: "/login/admin",
  },

  DEVICE_TYPE: {
    MOBILE: "Mobile",
    WEB: "Web",
  },

  HTTP_STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    ALREADY_EXISTS: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
  PERMISSIONS: {
    EVENT_DASHBOARD: "eventDashboard",
    ADMINS_VIEW: "admins.view",
    ADMINS_CREATE: "admins.create",
    ADMINS_EDIT: "admins.edit",
    ADMINS_DELETE: "admins.delete",
    VIEW_ITS_DATA: "view.its.data",
  },

  ALLOWED_ORIGINS: {
    development: ["http://localhost:3001", "http://localhost:3000"],
    production: ["http://localhost:3000"],
  },
  SEQUENCE_NAMES: {
    NIYAAZ: "NIYAAZ",
    RECEIPT_NIYAAZ: "RECEIPT_NIYAAZ",
    CHULA: "CHULA",
    ESTABLISHMENT: "ESTABLISHMENT",
    PROFESSIONAL: "PROFESSIONAL",
    MUTTAVATTEEN: "MUTTAVATTEEN",
    RECEIPT_SABIL: "RECEIPT_SABIL",
    RECEIPT_FMB: "RECEIPT_FMB",
    FMB: "FMB",
    LEDGER: "LEDGER",
    HALL_BOOKING: "HALL_BOOKING",
    RENT_BOOKING_RECEIPT: "RENT_BOOKING_RECEIPT",
    DEPOSIT_BOOKING_RECEIPT: "DEPOSIT_BOOKING_RECEIPT",
  },
  UI_URL: "http://fakhri-jamaat.web.app",
};
