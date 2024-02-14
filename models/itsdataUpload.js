module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "itsdataupload",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      ITS_ID: DataTypes.STRING,
      HOF_FM_TYPE: DataTypes.STRING,
      HOF_ID: DataTypes.STRING,
      Full_Name: DataTypes.STRING,
      Age: DataTypes.STRING,
      Gender: DataTypes.STRING,
      Mobile: DataTypes.STRING,
      Email: DataTypes.STRING,
      Address: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { paranoid: true, freezeTableName: true }
  );
  model.associate = (models) => {
    model.hasMany(models.itsdataupload, {
      as: "familyMembers",
      foreignKey: "HOF_ID",
      sourceKey: "ITS_ID",
    });
  };

  return model;
};
