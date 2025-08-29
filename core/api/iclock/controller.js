const constants = require("../../const/constants");

async function iclock(req, res) {
  try {
    const { table } = req.query;
    if (table === "ATTLOG") {
      const lines = req.body.split(/\r?\n/).filter((l) => l.trim() !== "");
      const punches = lines.map((line) => {
        const parts = line.trim().split(/\s+/);
        return {
          pin: parts[0],
          timestamp: `${parts[1]} ${parts[2]}`,
        };
      });

      console.log("Parsed ATTLOG punches:", punches);

      // saveAttendance(punches).catch((err) => console.error("DB Error:", err));
    }

    // Always send back a success response so the device knows data was received
    res.status(200).send("OK\n");
  } catch (error) {
    console.error("Error in iclock handler:", error);
    res.status(500).send("ERROR");
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  iclock,
};
