const { SABIL_CHANGE_TYPES } = require("../core/utils/enums");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sabilChangeRequests", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      changeType: {
        type: Sequelize.ENUM,
        values: Object.keys(SABIL_CHANGE_TYPES),
      },
      sabilId: { type: Sequelize.STRING },
      transferTo: { type: Sequelize.STRING },
      fromITS: { type: Sequelize.STRING },
      toITS: { type: Sequelize.STRING },
      remarks: { type: Sequelize.STRING },
      updatedBy: { type: Sequelize.STRING },
      status: {
        type: Sequelize.ENUM,
        values: ["PENDING", "APPROVED", "DECLINED"],
        defaultValue: "PENDING",
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
    await queryInterface.dropTable("sabilChangeRequests");
  },
};
