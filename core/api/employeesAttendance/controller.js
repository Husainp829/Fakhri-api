const { Op } = require("sequelize");
const models = require("../../../models");
const constants = require("../../const/constants");

async function getMonthAttendance(req, res) {
  let code;
  try {
    const { month, type } = req.query;
    if (!month || !type) {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("month and type are required", true);
    }

    const [yearStr, monthStr] = month.split("-"); // format: YYYY-MM
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59); // last day of month

    // Fetch employees in the department
    const employees = await models.employees.findAll({
      where: { type },
      include: [
        {
          model: models.employeeAttendance,
          as: "employeeAttendance",
          where: {
            checkTime: {
              [Op.between]: [startDate, endDate],
            },
          },
          required: false, // allow employees without attendance
        },
      ],
      order: [["id", "ASC"]],
    });

    const data = employees.map((emp) => {
      const days = {};

      // Group attendance by day
      emp.employeeAttendance.forEach((att) => {
        const day = att.checkTime.getDate();

        if (type === "FMB_STAFF") {
          // Only first check-in
          if (!days[day]) days[day] = att.checkTime;
        } else {
          // Store checkIn / checkOut per day
          // eslint-disable-next-line no-lonely-if
          if (!days[day]) days[day] = { checkIn: att.checkTime, checkOut: att.checkTime };
          else if (att.checkTime < days[day].checkIn) days[day].checkIn = att.checkTime;
          else if (att.checkTime > days[day].checkOut) days[day].checkOut = att.checkTime;
        }
      });

      return {
        employeeId: emp.id,
        name: emp.name,
        department: emp.department,
        days, // keys = day numbers, values = checkIn or {checkIn, checkOut}
      };
    });

    sendResponse(res, { month, type, data }, constants.HTTP_STATUS_CODES.OK);
  } catch (err) {
    sendError(res, err, code);
  }
}

module.exports = {
  getMonthAttendance,
};
