module.exports = (sq, type) => {
  const model = sq.define(
    "rentBookingReceipts",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      bookingId: type.STRING,
      receiptNo: type.STRING,
      organiser: type.STRING,
      organiserIts: type.STRING,
      date: type.DATE,
      amount: type.INTEGER,
      mode: type.STRING,
      details: type.STRING,
      ref: type.STRING,
      type: {
        type: type.ENUM("RENT", "DEPOSIT"),
        allowNull: false,
      },
      createdBy: type.STRING,
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },

    {
      paranoid: true,
      freezeTableName: true,
    }
  );
  model.associate = (models) => {
    model.belongsTo(models.bookings);
    model.hasOne(models.admins, { as: "admin", foreignKey: "id", sourceKey: "createdBy" });
  };

  return model;
};
