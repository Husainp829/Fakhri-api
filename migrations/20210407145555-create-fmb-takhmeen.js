module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("fmbTakhmeen", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      fmbId: { type: Sequelize.STRING },
      takhmeenAmount: { type: Sequelize.INTEGER },
      pendingBalance: { type: Sequelize.INTEGER },
      paidBalance: { type: Sequelize.INTEGER },
      takhmeenYear: { type: Sequelize.INTEGER },
      startDate: { type: Sequelize.DATE },
      updatedBy: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("fmbTakhmeen");
  },
};
