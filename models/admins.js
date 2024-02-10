const bcrypt = require("bcryptjs");

module.exports = (sq, type) => {
  const model = sq.define(
    "admins",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: type.STRING,
      email: {
        type: type.STRING,
        isUnique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      createdAt: type.DATE,
      updatedAt: type.DATE,
      uid: type.STRING,
    },

    {
      hooks: {
        beforeCreate: (admin) => {
          // eslint-disable-next-line no-param-reassign
          admin.password = admin.password ? bcrypt.hashSync(admin.password, 12) : "";
        },
      },
      paranoid: true,
    }
  );
  model.associate = () => {};

  return model;
};
