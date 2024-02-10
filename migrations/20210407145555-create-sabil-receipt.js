module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sabilReceipt", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      receiptNo: { type: Sequelize.STRING },
      sabilId: { type: Sequelize.STRING },
      amount: { type: Sequelize.INTEGER },
      receiptDate: { type: Sequelize.DATE },
      updatedBy: { type: Sequelize.STRING },
      receiptType: { type: Sequelize.STRING },
      paymentMode: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedOn: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("sabilReceipt");
  },
};
