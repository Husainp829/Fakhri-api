module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sabilTakhmeen", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      sabilId: { type: Sequelize.STRING },
      takhmeenAmount: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable("sabilTakhmeen");
  },
};
