module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("employeeAttendance", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      checkTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Composite unique on (employeeId, checkTime)
    await queryInterface.addConstraint("employeeAttendance", {
      fields: ["employeeId", "checkTime"],
      type: "unique",
      name: "uq_employeeAttendance_user_checkTime",
    });

    // Add a generated DATE-only column (works on MySQL 5.7+/MariaDB 10.2+)
    await queryInterface.sequelize.query(`
      ALTER TABLE \`employeeAttendance\`
      ADD COLUMN \`checkDate\` DATE
      GENERATED ALWAYS AS (DATE(\`checkTime\`)) STORED
    `);

    // Index the date-only column
    await queryInterface.addIndex("employeeAttendance", ["checkDate"], {
      name: "idx_employeeAttendance_checkDate",
    });

    // (Optional but useful) index for lookups by user + date
    await queryInterface.addIndex("employeeAttendance", ["employeeId", "checkDate"], {
      name: "idx_employeeAttendance_user_checkDate",
    });
  },

  down: async (queryInterface) => {
    // Drop optional indexes first
    await queryInterface
      .removeIndex("employeeAttendance", "idx_employeeAttendance_user_checkDate")
      .catch(() => {});
    await queryInterface
      .removeIndex("employeeAttendance", "idx_employeeAttendance_checkDate")
      .catch(() => {});

    // Drop generated column
    await queryInterface.sequelize.query(`
      ALTER TABLE \`employeeAttendance\` DROP COLUMN \`checkDate\`
    `);

    // Drop unique constraint
    await queryInterface.removeConstraint(
      "employeeAttendance",
      "uq_employeeAttendance_user_checkTime"
    );

    // Finally drop table
    await queryInterface.dropTable("employeeAttendance");
  },
};
