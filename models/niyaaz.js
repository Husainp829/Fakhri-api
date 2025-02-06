module.exports = (sq, type) => {
  const model = sq.define(
    "niyaaz",

    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      markaz: type.STRING,
      namaazVenue: type.STRING,
      HOFId: type.STRING,
      HOFName: type.STRING,
      HOFAddress: type.STRING,
      HOFPhone: type.STRING,
      familyMembers: type.JSON,
      takhmeenAmount: type.INTEGER,
      zabihat: type.INTEGER,
      iftaari: type.INTEGER,
      chairs: type.INTEGER,
      gentsCount: type.INTEGER,
      ladiesCount: type.INTEGER,
      comments: type.STRING,
      formNo: type.STRING,
      paidAmount: type.INTEGER,
      submitter: type.STRING,
      createdAt: type.DATE,
      updatedAt: type.DATE,
    },

    {
      paranoid: true,
      freezeTableName: true,
    }
  );
  model.associate = (models) => {
    model.belongsTo(models.events);
    model.hasOne(models.admins, { as: "admin", foreignKey: "id", sourceKey: "submitter" });
  };

  return model;
};
