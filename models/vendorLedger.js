module.exports = (sq, type) => {
  const model = sq.define(
    "vendorLedger",

    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      type: type.STRING,
      paid: type.INTEGER,
      date: type.DATE,
      mode: type.STRING,
      remarks: type.STRING,
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
    model.belongsTo(models.events);
    model.belongsTo(models.vendors);
    model.hasOne(models.admins, { as: "admin", foreignKey: "id", sourceKey: "updatedBy" });
  };

  return model;
};
