module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sabilAudit", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      refId: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.STRING },
      actionType: { type: Sequelize.STRING },
      remarks: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("sabilAudit");
  },
};
