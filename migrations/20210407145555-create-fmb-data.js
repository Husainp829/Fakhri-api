module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("fmbData", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      fmbNo: { type: Sequelize.STRING, unique: true },
      currentTakhmeenId: { type: Sequelize.STRING },
      itsNo: { type: Sequelize.STRING },
      name: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      mohallah: { type: Sequelize.STRING },
      lastPaidDate: { type: Sequelize.DATE },
      pan: { type: Sequelize.STRING },
      updatedBy: { type: Sequelize.STRING },
      closedAt: { type: Sequelize.DATE },
      remarks: { type: Sequelize.STRING },
      transferTo: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("fmbData");
  },
};
