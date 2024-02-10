module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("itsdata", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      ITS_ID: {
        allowNull: false,
        autoIncrement: false,
        type: Sequelize.STRING(10),
      },
      HOF_FM_TYPE: {
        type: Sequelize.STRING(5),
      },
      HOF_ID: {
        type: Sequelize.STRING(10),
      },
      Family_ID: {
        type: Sequelize.STRING(10),
      },
      Father_ITS_ID: {
        type: Sequelize.STRING(10),
      },
      Mother_ITS_ID: {
        type: Sequelize.STRING(10),
      },
      Spouse_ITS_ID: {
        type: Sequelize.STRING(10),
      },
      TanzeemFile_No: {
        type: Sequelize.STRING(10),
      },
      Full_Name: {
        type: Sequelize.STRING(20),
      },
      Full_Name_Arabic: {
        type: Sequelize.STRING(20),
      },
      First_Prefix: {
        type: Sequelize.STRING(20),
      },
      Prefix_Year: {
        type: Sequelize.STRING(20),
      },
      First_Name: {
        type: Sequelize.STRING,
      },
      Father_Prefix: {
        type: Sequelize.STRING,
      },
      Father_Name: {
        type: Sequelize.STRING,
      },
      Father_Surname: {
        type: Sequelize.STRING,
      },
      Husband_Prefix: {
        type: Sequelize.STRING,
      },
      Husband_Name: {
        type: Sequelize.STRING,
      },
      Surname: {
        type: Sequelize.STRING,
      },
      Age: {
        type: Sequelize.STRING(3),
      },
      Gender: {
        type: Sequelize.STRING(10),
      },
      Misaq: {
        type: Sequelize.STRING(10),
      },
      Marital_Status: {
        type: Sequelize.STRING(10),
      },
      Blood_Group: {
        type: Sequelize.STRING(5),
      },
      Warakatul_Tarkhis: {
        type: Sequelize.STRING(20),
      },
      Date_Of_Nikah: {
        type: Sequelize.STRING(10),
      },
      Date_Of_Nikah_Hijri: {
        type: Sequelize.STRING(20),
      },
      Mobile: {
        type: Sequelize.STRING(15),
      },
      Email: {
        type: Sequelize.STRING,
      },
      Title: {
        type: Sequelize.STRING(20),
      },
      Category: {
        type: Sequelize.STRING(50),
      },
      Idara: {
        type: Sequelize.STRING(100),
      },
      Organisation: {
        type: Sequelize.TEXT,
      },
      Organisation_CSV: {
        type: Sequelize.TEXT,
      },
      Vatan: {
        type: Sequelize.STRING,
      },
      Nationality: {
        type: Sequelize.STRING,
      },
      Jamaat: {
        type: Sequelize.STRING(25),
      },
      Jamiaat: {
        type: Sequelize.STRING(25),
      },
      Qualification: {
        type: Sequelize.STRING,
      },
      Languages: {
        type: Sequelize.TEXT,
      },
      Hunars: {
        type: Sequelize.TEXT,
      },
      Occupation: {
        type: Sequelize.TEXT,
      },
      Sub_Occupation: {
        type: Sequelize.TEXT,
      },
      Sub_Occupation2: {
        type: Sequelize.TEXT,
      },
      Quran_Sanad: {
        type: Sequelize.STRING(100),
      },
      Qadambosi_Sharaf: {
        type: Sequelize.STRING(10),
      },
      Raudat_Tahera_Ziyarat: {
        type: Sequelize.STRING(10),
      },
      Karbala_Ziyarat: {
        type: Sequelize.STRING(10),
      },
      Ashara_Mubaraka: {
        type: Sequelize.INTEGER,
      },
      Housing: {
        type: Sequelize.STRING,
      },
      Type_of_House: {
        type: Sequelize.STRING(100),
      },
      Address: {
        type: Sequelize.TEXT,
      },
      Building: {
        type: Sequelize.STRING,
      },
      Street: {
        type: Sequelize.STRING,
      },
      Area: {
        type: Sequelize.STRING,
      },
      State: {
        type: Sequelize.STRING,
      },
      City: {
        type: Sequelize.STRING(100),
      },
      Pincode: {
        type: Sequelize.STRING(10),
      },
      Sector: {
        type: Sequelize.STRING(40),
      },
      Sub_Sector: {
        type: Sequelize.STRING(40),
      },
      Inactive_Status: {
        type: Sequelize.STRING(100),
      },
      Data_Verifcation_Status: {
        type: Sequelize.STRING(100),
      },
      Data_Verification_Date: {
        type: Sequelize.STRING(100),
      },
      Photo_Verifcation_Status: {
        type: Sequelize.STRING(100),
      },
      Photo_Verification_Date: {
        type: Sequelize.STRING(100),
      },
      Last_Scanned_Event: {
        type: Sequelize.STRING(100),
      },
      Last_Scanned_Place: {
        type: Sequelize.STRING(100),
      },
      Sector_Incharge_ITSID: {
        type: Sequelize.STRING(10),
      },
      Sector_Incharge_Name: {
        type: Sequelize.STRING,
      },
      Sector_Incharge_Female_ITSID: {
        type: Sequelize.STRING(10),
      },
      Sector_Incharge_Female_Name: {
        type: Sequelize.STRING,
      },
      Sub_Sector_Incharge_ITSID: {
        type: Sequelize.STRING(10),
      },
      Sub_Sector_Incharge_Name: {
        type: Sequelize.STRING,
      },
      Sub_Sector_Incharge_Female_ITSID: {
        type: Sequelize.STRING(10),
      },
      Sub_Sector_Incharge_Female_Name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("itsdata");
  },
};
