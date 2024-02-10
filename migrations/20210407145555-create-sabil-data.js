module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sabilData", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      sabilNo: { type: Sequelize.STRING, unique: true },
      currentTakhmeenId: { type: Sequelize.STRING },
      prevSabilNo: { type: Sequelize.STRING },
      sabilType: { type: Sequelize.STRING },
      itsNo: { type: Sequelize.STRING },
      name: { type: Sequelize.STRING },
      firmName: { type: Sequelize.STRING },
      firmAddress: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      mohallah: { type: Sequelize.STRING },
      category: { type: Sequelize.STRING },
      lastPaidDate: { type: Sequelize.DATE },
      pan: { type: Sequelize.STRING },
      pendingBalance: { type: Sequelize.INTEGER },
      paidBalance: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable("sabilData");
  },
};
