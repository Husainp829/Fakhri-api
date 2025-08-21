module.exports = (sq, type) => {
  const model = sq.define(
    "bookings",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      bookingNo: type.STRING,
      organiser: type.STRING,
      purpose: type.STRING,
      phone: type.STRING,
      itsNo: type.STRING,
      paidAmount: type.INTEGER,
      depositPaidAmount: type.INTEGER,
      writeOffAmount: type.INTEGER,
      refundReturnAmount: type.INTEGER,
      extraExpenses: type.INTEGER,
      jamaatLagat: type.INTEGER,
      sadarat: type.STRING,
      mohalla: type.STRING,
      submitter: type.STRING,
      razaGranted: type.BOOLEAN,
      comments: type.STRING,
      checkedOutOn: type.DATE,
      refundReturnedOn: type.DATE,
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },

    {
      paranoid: true,
      freezeTableName: true,
    }
  );
  model.associate = (models) => {
    model.hasMany(models.hallBookings, {
      foreignKey: "bookingId",
      as: "hallBookings",
    });
    model.hasMany(models.rentBookingReceipts, {
      foreignKey: "bookingId",
      as: "rentBookingReceipts",
    });
    model.hasOne(models.admins, { as: "admin", foreignKey: "id", sourceKey: "submitter" });
    model.hasOne(models.bookingPurpose, { as: "bookingPurpose", foreignKey: "id", sourceKey: "purpose" });
  };

  return model;
};
