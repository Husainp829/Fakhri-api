const Sequelize = require("sequelize");
const models = require("../../../models");

function getNiyaazCounts(decoded) {
  const { eventId } = decoded;
  return models.sequelize.query(
    `
    SELECT
      markaz,
      COUNT(*) as count,
      SUM(takhmeenAmount) as takhmeenAmount,
      SUM(chairs) as chairs,
      SUM(iftaari) as iftaari,
      SUM(zabihat) as zabihat,
      SUM(paidAmount) as paidAmount,
      SUM(gentsCount) as gentsCount,
      SUM(ladiesCount) as ladiesCount
    FROM niyaaz
    WHERE (
      deletedAt IS NULL 
      AND (
        eventId = '${eventId}'
      )
    )
    GROUP BY markaz
  `,
    {
      replacements: {
        eventId,
      },
      type: Sequelize.QueryTypes.SELECT,
    }
  );
}

function getNamaazVenueCounts(decoded) {
  const { eventId } = decoded;
  return models.sequelize.query(
    `
    SELECT
      namaazVenue,
      COUNT(*) as count,
      SUM(gentsCount) as gentsCount,
      SUM(ladiesCount) as ladiesCount
    FROM niyaaz
    WHERE (
      deletedAt IS NULL 
      AND (
        eventId = '${eventId}'
      )
    )
    GROUP BY namaazVenue
  `,
    {
      replacements: {
        eventId,
      },
      type: Sequelize.QueryTypes.SELECT,
    }
  );
}

function getDayWiseReceiptReport(decoded) {
  const { eventId } = decoded;
  return models.sequelize.query(
    `
    SELECT  Date(date) AS day,
            markaz,
            mode,
            Sum(amount) AS total_amount
    FROM    receipts
    WHERE   (
        deletedAt IS NULL 
        AND (
          eventId = '${eventId}'
        )
    )
    GROUP BY markaz, day, mode
    ORDER BY markaz, day, mode
  `,
    {
      replacements: {
        eventId,
      },
      type: Sequelize.QueryTypes.SELECT,
    }
  );
}

function getMarkazWiseList({ eventId, markaz }) {
  return models.sequelize.query(
    `
    SELECT 
        fm.name,
        fm.its AS ITS_ID,
        CASE 
            WHEN COALESCE(i.mobile, m.HOFPhone) LIKE '+91%' 
                THEN SUBSTRING(COALESCE(i.mobile, m.HOFPhone), 4)
            WHEN COALESCE(i.mobile, m.HOFPhone) LIKE '91%' 
                THEN SUBSTRING(COALESCE(i.mobile, m.HOFPhone), 3)
            ELSE COALESCE(i.mobile, m.HOFPhone)
        END AS phone
    FROM fakhri.niyaaz m
    JOIN JSON_TABLE(
        m.familyMembers, 
        '$[*]' 
        COLUMNS (
            name VARCHAR(255) PATH '$.name',
            its VARCHAR(20) PATH '$.its'
        )
    ) AS fm
    LEFT JOIN fakhri.itsdata i ON fm.its = i.ITS_ID 
    WHERE m.eventId = '${eventId}' 
    AND markaz = '${markaz}';
  `,
    {
      replacements: {
        eventId,
        markaz,
      },
      type: Sequelize.QueryTypes.SELECT,
    }
  );
}

module.exports = {
  getNiyaazCounts,
  getNamaazVenueCounts,
  getDayWiseReceiptReport,
  getMarkazWiseList,
};
