module.exports = (sq, type) => {
  const model = sq.define(
    "sequence",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: type.STRING,
      prefix: type.STRING,
      currentValue: type.INTEGER,
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
