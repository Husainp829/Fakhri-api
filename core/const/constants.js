const dayjs = require("dayjs");

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

  TIME_PERIODS: {
    TODAY: {
      from: dayjs().startOf("day").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    YESTERDAY: {
      from: dayjs().subtract(1, "day").startOf("day").toDate(),
      to: dayjs().subtract(1, "day").endOf("day").toDate(),
    },
    WEEK_TO_DATE: {
      from: dayjs().startOf("week").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    MONTH_TO_DATE: {
      from: dayjs().startOf("month").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    YEAR_TO_DATE: {
      from: dayjs().startOf("year").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    LAST_7_DAYS: {
      from: dayjs().subtract(7, "day").startOf("day").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    LAST_30_DAYS: {
      from: dayjs().subtract(30, "day").startOf("day").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    LAST_90_DAYS: {
      from: dayjs().subtract(90, "day").startOf("day").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    LAST_180_DAYS: {
      from: dayjs().subtract(180, "day").startOf("day").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    LAST_365_DAYS: {
      from: dayjs().subtract(365, "day").startOf("day").toDate(),
      to: dayjs().endOf("day").toDate(),
    },
    CURRENT_FINANCIAL_YEAR: {
      from:
        dayjs().month() >= 3
          ? dayjs().month(3).startOf("month").toDate()
          : dayjs().month(3).subtract(1, "year").startOf("month").toDate(),
      to:
        dayjs().month() >= 3
          ? dayjs().month(2).add(1, "year").endOf("month").toDate()
          : dayjs().month(2).endOf("month").toDate(),
    },
  },
};
