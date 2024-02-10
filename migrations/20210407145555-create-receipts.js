module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("receipts", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      formNo: { type: Sequelize.STRING },
      HOFId: { type: Sequelize.STRING },
      HOFName: { type: Sequelize.STRING },
      date: { type: Sequelize.DATE },
      amount: { type: Sequelize.INTEGER },
      mode: { type: Sequelize.STRING },
      details: { type: Sequelize.STRING },
      markaz: { type: Sequelize.STRING },
      total: { type: Sequelize.INTEGER },
      receiptNo: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("receipts");
  },
};
