module.exports = (sq, type) => {
  const model = sq.define(
    "sabilReceipt",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      receiptNo: type.STRING,
      sabilId: type.STRING,
      amount: type.INTEGER,
      receiptDate: type.DATE,
      receiptType: type.STRING,
      paymentMode: type.STRING,
      updatedBy: type.STRING,
      remarks: type.STRING,
      deletedOn: type.DATE,
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
