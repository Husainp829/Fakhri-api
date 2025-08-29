// models/employeeAttendance.js
module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "employeeAttendance",
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      checkTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "employeeAttendance",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["employeeId", "checkTime"],
        },
        {
          name: "idx_checkTime_date",
          fields: [sequelize.literal("DATE(`checkTime`)")],
        },
      ],
    }
  );

  return model;
};
