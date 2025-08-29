// models/employeeAttendance.js
module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "employeeAttendance",
    {
      userId: {
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
      id: false,
      indexes: [
        {
          unique: true,
          fields: ["userId", "checkTime"],
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
