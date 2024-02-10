module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "mohallas",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { paranoid: true, freezeTableName: true }
  );
  model.associate = () => {};

  return model;
};
