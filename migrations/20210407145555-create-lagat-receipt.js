module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lagatReceipt", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      itsNo: { type: Sequelize.STRING },
      purpose: { type: Sequelize.STRING },
      receiptNo: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("lagatReceipt");
  },
};
