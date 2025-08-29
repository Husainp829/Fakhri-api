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
      timestamps: false, // remove if you don’t want createdAt/updatedAt
      indexes: [
        {
          unique: true,
          fields: ["userId", "checkTime"], // composite unique constraint
        },
        {
          name: "idx_checkTime_date",
          fields: [sequelize.literal("DATE(`checkTime`)")], // index on date only
        },
      ],
    }
  );

  return model;
};
