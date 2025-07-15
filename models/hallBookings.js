module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "hallBookings",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      hallId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      slot: {
        type: DataTypes.ENUM("morning", "afternoon", "evening"),
        allowNull: false,
      },
      thaals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "hallBookings",
      paranoid: true, // enable deletedAt
      timestamps: true, // enables createdAt & updatedAt
    }
  );

  model.associate = (models) => {
    model.belongsTo(models.bookings, {
      foreignKey: "bookingId",
      as: "booking",
    });
    model.belongsTo(models.halls, {
      foreignKey: "hallId",
      as: "hall",
    });
  };

  return model;
};
