module.exports = (sq, type) => {
  const model = sq.define(
    "bookingPurpose",
    {
      id: {
        type: type.STRING,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
      },
      name: type.STRING,
      jamaatLagat: type.INTEGER,
      perThaal: type.INTEGER,
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
