// migrations/xxxx-create-employees.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("employees", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      identity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });

    // Add foreign key on employeeAttendance.employeeId
    await queryInterface.addConstraint("employeeAttendance", {
      fields: ["employeeId"],
      type: "foreign key",
      name: "fk_employeeAttendance_employee",
      references: {
        table: "employees",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint("employeeAttendance", "fk_employeeAttendance_employee");
    await queryInterface.dropTable("employees");
  },
};
