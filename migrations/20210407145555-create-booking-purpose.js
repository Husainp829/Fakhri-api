module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bookingPurpose", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
      },
      sarkariLagat: { type: Sequelize.INTEGER, default: 0, allowNull: false },
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
    await queryInterface.dropTable("bookingPurpose");
  },
};
