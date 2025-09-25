module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create purpose_hall_charges table
    await queryInterface.createTable("purposeHallCharges", {
      purposeId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "bookingPurpose", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      hallId: {
        type: Sequelize.UUID, // matches halls.id
        allowNull: false,
        references: { model: "halls", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      rent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      deposit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      acCharges: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      kitchenCleaning: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      includeThaalCharges: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Add composite PK
    await queryInterface.addConstraint("purposeHallCharges", {
      fields: ["purposeId", "hallId"],
      type: "primary key",
      name: "purpose_hall_charges_pkey",
    });

    // 2. Populate with cross-join data, copying charges from halls
    await queryInterface.sequelize.query(`
      INSERT INTO purposeHallCharges (
        purposeId, hallId, rent, deposit, acCharges, kitchenCleaning, includeThaalCharges, createdAt, updatedAt
      )
      SELECT 
        bp.id, 
        h.id, 
        h.rent, 
        h.deposit, 
        h.acCharges, 
        h.kitchenCleaning, 
        h.includeThaalCharges, 
        NOW(), 
        NOW()
      FROM bookingPurpose bp
      CROSS JOIN halls h;
    `);
  },

  async down(queryInterface) {
    // Drop mapping table
    await queryInterface.dropTable("purposeHallCharges");
  },
};
