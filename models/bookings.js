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
      depositAmount: type.INTEGER,
      rentAmount: type.INTEGER,
      thaalAmount: type.INTEGER,
      paidAmount: type.INTEGER,
      depositPaidAmount: type.INTEGER,
      writeOffAmount: type.INTEGER,
      refundAmount: type.INTEGER,
      sadarat: type.STRING,
      mohalla: type.STRING,
      submitter: type.STRING,
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
    model.hasMany(models.depositBookingReceipts, {
      foreignKey: "bookingId",
      as: "depositBookingReceipts",
    });
    model.hasOne(models.admins, { as: "admin", foreignKey: "id", sourceKey: "submitter" });
  };

  return model;
};
