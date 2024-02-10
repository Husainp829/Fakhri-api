module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("niyaaz", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      markaz: { type: Sequelize.STRING },
      HOFId: { type: Sequelize.STRING },
      HOFName: { type: Sequelize.STRING },
      HOFAddress: { type: Sequelize.STRING },
      HOFPhone: { type: Sequelize.STRING },
      familyMembers: { type: Sequelize.JSON },
      takhmeenAmount: { type: Sequelize.INTEGER },
      zabihat: { type: Sequelize.INTEGER },
      iftaari: { type: Sequelize.INTEGER },
      chairs: { type: Sequelize.INTEGER },
      comments: { type: Sequelize.STRING },
      formNo: { type: Sequelize.STRING },
      paidAmount: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable("niyaaz");
  },
};
