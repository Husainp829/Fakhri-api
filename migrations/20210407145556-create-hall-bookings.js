module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("hallBookings", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      bookingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "bookings",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      hallId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "halls",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      slot: {
        type: Sequelize.ENUM("morning", "afternoon", "evening"),
        allowNull: false,
      },
      thaals: {
        type: Sequelize.INTEGER,
        default: 0,
        allowNull: false,
      },
      withAC: {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("hallBookings", {
      fields: ["bookingId", "hallId", "date", "slot"],
      type: "unique",
      name: "unique_booking_hall_date_slot",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("hallBookings");
  },
};
