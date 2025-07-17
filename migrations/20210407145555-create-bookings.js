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
      purpose: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      itsNo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone: { allowNull: false, type: Sequelize.STRING },
      depositAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      rentAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      thaalAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      paidAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      depositPaidAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      writeOffAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      refundAmount: { type: Sequelize.INTEGER, default: 0, allowNull: false },
      mohalla: { type: Sequelize.STRING },
      submitter: { type: Sequelize.STRING },
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
