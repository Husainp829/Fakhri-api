module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "lagatTypes",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING },
      description: { type: DataTypes.STRING },
      amount: { type: DataTypes.INTEGER },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { paranoid: true, freezeTableName: true }
  );
  model.associate = () => {};

  return model;
};
