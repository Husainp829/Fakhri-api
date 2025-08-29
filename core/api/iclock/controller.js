const constants = require("../../const/constants");
const models = require("../../../models");

async function iclock(req, res) {
  try {
    const { table } = req.query;
    if (table === "ATTLOG") {
      const lines = req.body.split(/\r?\n/).filter((l) => l.trim() !== "");
      const punches = lines.map((line) => {
        const parts = line.trim().split(/\s+/);
        return {
          employeeId: parseInt(parts[0], 10),
          checkTime: new Date(`${parts[1]} ${parts[2]}`),
        };
      });

      await models.employeeAttendance.bulkCreate(punches, {
        ignoreDuplicates: true,
      });
    }

    res.status(200).send("OK\n");
  } catch (error) {
    res.status(500).send("ERROR");
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  iclock,
};
