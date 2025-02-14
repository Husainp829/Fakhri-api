module.exports = (sq, type) => {
  const model = sq.define(
    "vendorTypes",
    {
      id: {
        type: type.STRING,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
      },
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
