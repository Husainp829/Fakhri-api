module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("employeeAttendance", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      checkTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Composite unique on (userId, checkTime)
    await queryInterface.addConstraint("employeeAttendance", {
      fields: ["userId", "checkTime"],
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
    await queryInterface.addIndex("employeeAttendance", ["userId", "checkDate"], {
      name: "idx_employeeAttendance_user_checkDate",
    });
  },

  down: async (queryInterface) => {
    // drop optional index first if present
    await queryInterface
      .removeIndex("employeeAttendance", "idx_employeeAttendance_user_checkDate")
      .catch(() => {});
    await queryInterface
      .removeIndex("employeeAttendance", "idx_employeeAttendance_checkDate")
      .catch(() => {});
    await queryInterface.sequelize.query(`
      ALTER TABLE \`employeeAttendance\` DROP COLUMN \`checkDate\`
    `);
    await queryInterface.removeConstraint(
      "employeeAttendance",
      "uq_employeeAttendance_user_checkTime"
    );
    await queryInterface.dropTable("employeeAttendance");
  },
};
