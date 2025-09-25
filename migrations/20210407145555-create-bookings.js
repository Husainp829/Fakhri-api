module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bookings", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      organiser: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      itsNo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone: { allowNull: false, type: Sequelize.STRING },
      paidAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      depositPaidAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      writeOffAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      extraExpenses: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      refundReturnAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      jamaatLagat: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      mohalla: { type: Sequelize.STRING },
      submitter: { type: Sequelize.STRING },
      razaGranted: { type: Sequelize.BOOLEAN, default: false, allowNull: false },
      comments: { type: Sequelize.STRING, default: false, allowNull: false },
      checkedOutOn: { type: Sequelize.DATE },
      refundReturnedOn: { type: Sequelize.DATE },
      memberReference: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("bookings");
  },
};
