module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("halls", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      shortCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      thaalCapacity: {
        type: Sequelize.INTEGER,
        default: 0,
        allowNull: false,
      },
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
    await queryInterface.dropTable("halls");
  },
};
