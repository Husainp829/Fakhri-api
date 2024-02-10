module.exports = (sq, type) => {
  const model = sq.define(
    "sabilData",

    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      currentTakhmeenId: type.STRING,
      sabilNo: type.STRING,
      prevSabilNo: type.STRING,
      sabilType: type.STRING,
      itsNo: type.INTEGER,
      name: type.STRING,
      address: type.STRING,
      mohallah: type.STRING,
      category: type.STRING,
      lastPaidDate: type.DATE,
      pan: type.STRING,
      pendingBalance: type.INTEGER,
      paidBalance: type.INTEGER,
      updatedBy: type.STRING,
      closedAt: type.DATE,
      createdAt: type.DATE,
      updatedAt: type.DATE,
      firmName: type.STRING,
      firmAddress: type.STRING,
      remarks: type.STRING,
      transferTo: type.STRING,
    },

    {
      paranoid: true,
      freezeTableName: true,
    }
  );
  model.associate = (models) => {
    model.hasOne(models.itsdata, { as: "itsdata", foreignKey: "id", sourceKey: "itsNo" });
    model.hasMany(models.sabilTakhmeen, {
      as: "sabilTakhmeen",
      foreignKey: "sabilId",
      sourceKey: "id",
    });
    model.hasOne(models.sabilTakhmeen, {
      as: "sabilTakhmeenCurrent",
      foreignKey: "id",
      sourceKey: "currentTakhmeenId",
    });
  };

  return model;
};
