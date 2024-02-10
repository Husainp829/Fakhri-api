module.exports = (sq, type) => {
  const model = sq.define(
    "fmbData",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      currentTakhmeenId: type.STRING,
      fmbNo: type.STRING,
      itsNo: type.INTEGER,
      name: type.STRING,
      address: type.STRING,
      mohallah: type.STRING,
      lastPaidDate: type.DATE,
      pan: type.STRING,
      updatedBy: type.STRING,
      closedAt: type.DATE,
      createdAt: type.DATE,
      updatedAt: type.DATE,
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
    model.hasMany(models.fmbTakhmeen, {
      as: "fmbTakhmeen",
      foreignKey: "fmbId",
      sourceKey: "id",
    });
    model.hasOne(models.fmbTakhmeen, {
      as: "fmbTakhmeenCurrent",
      foreignKey: "id",
      sourceKey: "currentTakhmeenId",
    });
  };

  return model;
};
