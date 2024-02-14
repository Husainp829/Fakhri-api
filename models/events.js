module.exports = (sq, type) => {
  const model = sq.define(
    "events",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: type.STRING,
      fromDate: type.DATE,
      toDate: type.DATE,
      hijriYear: type.INTEGER,
      slug: type.STRING,
      zabihat: type.INTEGER,
      chairs: type.INTEGER,
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },
    { paranoid: true }
  );
  model.associate = () => {};

  return model;
};
