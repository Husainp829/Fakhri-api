const { SABIL_CHANGE_TYPES } = require("../core/utils/enums");

module.exports = (sq, type) => {
  const model = sq.define(
    "sabilChangeRequests",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      changeType: {
        type: type.ENUM,
        values: Object.keys(SABIL_CHANGE_TYPES),
      },
      sabilId: type.STRING,
      transferTo: type.STRING,
      fromITS: type.STRING,
      toITS: type.STRING,
      updatedBy: type.STRING,
      remarks: type.STRING,
      status: {
        type: type.ENUM,
        values: ["PENDING", "APPROVED", "DECLINED"],
      },
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },

    {
      paranoid: true,
      freezeTableName: true,
    }
  );
  model.associate = (models) => {
    model.hasOne(models.sabilData, {
      as: "sabilData",
      foreignKey: "id",
      sourceKey: "sabilId",
    });
  };

  return model;
};
