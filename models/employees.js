module.exports = (sq, type) => {
  const model = sq.define(
    "employees",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: type.STRING,
      phone: type.STRING,
      type: type.STRING,
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },

    {
      paranoid: true,
    }
  );
  model.associate = (models) => {
    model.hasMany(models.employeeAttendance, {
      foreignKey: "employeeId",
      as: "employeeAttendance",
    });
  };

  return model;
};
