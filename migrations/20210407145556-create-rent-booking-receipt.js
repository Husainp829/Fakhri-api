module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rentBookingReceipts", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      bookingId: { type: Sequelize.STRING },
      receiptNo: { type: Sequelize.STRING },
      organiser: { type: Sequelize.STRING },
      date: { type: Sequelize.DATE },
      amount: { type: Sequelize.INTEGER },
      mode: { type: Sequelize.STRING },
      details: { type: Sequelize.STRING },
      total: { type: Sequelize.INTEGER },
      createdBy: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("rentBookingReceipts");
  },
};
