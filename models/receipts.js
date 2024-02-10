module.exports = (sq, type) => {
  const model = sq.define(
    "receipts",

    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      formNo: type.STRING,
      HOFId: type.STRING,
      HOFName: type.STRING,
      date: type.DATE,
      amount: type.INTEGER,
      mode: type.STRING,
      details: type.STRING,
      markaz: type.STRING,
      total: type.INTEGER,
      receiptNo: type.STRING,
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
  };

  return model;
};
