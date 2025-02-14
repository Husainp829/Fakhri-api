module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("vendorLedger", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      vendorId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      paid: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      mode: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      remarks: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      updatedBy: { type: Sequelize.STRING, allowNull: false },
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
    await queryInterface.dropTable("vendorLedger");
  },
};
