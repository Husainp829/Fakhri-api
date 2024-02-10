module.exports = (sq, type) => {
  const model = sq.define(
    "lagatReceipt",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      itsNo: type.STRING,
      purpose: type.STRING,
      receiptNo: type.STRING,
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
    model.hasOne(models.itsdata, { as: "itsdata", foreignKey: "id", sourceKey: "itsNo" });
  };

  return model;
};
