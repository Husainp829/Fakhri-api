module.exports = (sq, type) => {
  const model = sq.define(
    "sabilAudit",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      refId: type.STRING,
      actionType: type.STRING,
      amount: type.INTEGER,
      createdBy: type.STRING,
      remarks: type.STRING,
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
