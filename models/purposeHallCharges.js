module.exports = (sq, type) => {
  const model = sq.define(
    "purposeHallCharges",
    {
      purposeId: {
        type: type.STRING, // matches bookingPurpose.id
        allowNull: false,
        primaryKey: true,
      },
      hallId: {
        type: type.UUID, // matches halls.id
        allowNull: false,
        primaryKey: true,
      },
      rent: {
        type: type.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      deposit: {
        type: type.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      acCharges: {
        type: type.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      kitchenCleaning: {
        type: type.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      includeThaalCharges: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },
    {
      paranoid: false,
      freezeTableName: true,
    }
  );

  model.associate = (models) => {
    model.belongsTo(models.bookingPurpose, {
      foreignKey: "purposeId",
      targetKey: "id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    model.belongsTo(models.halls, {
      foreignKey: "hallId",
      targetKey: "id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return model;
};
