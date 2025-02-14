module.exports = (sq, type) => {
  const model = sq.define(
    "vendors",

    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: type.STRING,
      type: type.INTEGER,
      mobile: type.INTEGER,
      updatedBy: type.STRING,
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },

    {
      paranoid: true,
      freezeTableName: true,
    }
  );
  model.associate = (models) => {
    model.hasOne(models.admins, { as: "admin", foreignKey: "id", sourceKey: "updatedBy" });
  };

  return model;
};
