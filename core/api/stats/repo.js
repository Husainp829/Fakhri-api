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
      SUM(paidAmount) as paidAmount
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

module.exports = {
  getNiyaazCounts,
};
