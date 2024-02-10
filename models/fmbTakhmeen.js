module.exports = (sq, type) => {
  const model = sq.define(
    "fmbTakhmeen",

    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      fmbId: type.STRING,
      takhmeenAmount: type.INTEGER,
      pendingBalance: type.INTEGER,
      paidBalance: type.INTEGER,
      takhmeenYear: type.INTEGER,
      startDate: type.DATE,
      updatedBy: type.STRING,
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },

    {
      paranoid: true,
      freezeTableName: true,
    }
  );
  model.associate = () => {};

  return model;
};
