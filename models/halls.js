module.exports = (sq, type) => {
  const model = sq.define(
    "halls",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: type.STRING,
      shortCode: type.STRING,
      thaalCapacity: type.INTEGER,
      rent: type.INTEGER,
      deposit: type.INTEGER,
      acCharges: type.INTEGER,
      kitchenCleaning: type.INTEGER,
      includeThaalCharges: type.BOOLEAN,
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
