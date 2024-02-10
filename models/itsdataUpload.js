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
      Family_ID: DataTypes.STRING,
      Father_ITS_ID: DataTypes.STRING,
      Mother_ITS_ID: DataTypes.STRING,
      Spouse_ITS_ID: DataTypes.STRING,
      TanzeemFile_No: DataTypes.STRING,
      Full_Name: DataTypes.STRING,
      Full_Name_Arabic: DataTypes.STRING,
      First_Prefix: DataTypes.STRING,
      Prefix_Year: DataTypes.STRING,
      First_Name: DataTypes.STRING,
      Father_Prefix: DataTypes.STRING,
      Father_Name: DataTypes.STRING,
      Father_Surname: DataTypes.STRING,
      Husband_Prefix: DataTypes.STRING,
      Husband_Name: DataTypes.STRING,
      Surname: DataTypes.STRING,
      Age: DataTypes.STRING,
      Gender: DataTypes.STRING,
      Misaq: DataTypes.STRING,
      Marital_Status: DataTypes.STRING,
      Blood_Group: DataTypes.STRING,
      Warakatul_Tarkhis: DataTypes.STRING,
      Date_Of_Nikah: DataTypes.STRING,
      Date_Of_Nikah_Hijri: DataTypes.STRING,
      Mobile: DataTypes.STRING,
      Email: DataTypes.STRING,
      Title: DataTypes.STRING,
      Category: DataTypes.STRING,
      Idara: DataTypes.STRING,
      Organisation: DataTypes.STRING,
      Organisation_CSV: DataTypes.STRING,
      Vatan: DataTypes.STRING,
      Nationality: DataTypes.STRING,
      Jamaat: DataTypes.STRING,
      Jamiaat: DataTypes.STRING,
      Qualification: DataTypes.STRING,
      Languages: DataTypes.STRING,
      Hunars: DataTypes.STRING,
      Occupation: DataTypes.STRING,
      Sub_Occupation: DataTypes.STRING,
      Sub_Occupation2: DataTypes.STRING,
      Quran_Sanad: DataTypes.STRING,
      Qadambosi_Sharaf: DataTypes.STRING,
      Raudat_Tahera_Ziyarat: DataTypes.STRING,
      Karbala_Ziyarat: DataTypes.STRING,
      Ashara_Mubaraka: DataTypes.NUMBER,
      Housing: DataTypes.STRING,
      Type_of_House: DataTypes.STRING,
      Address: DataTypes.STRING,
      Building: DataTypes.STRING,
      Street: DataTypes.STRING,
      Area: DataTypes.STRING,
      State: DataTypes.STRING,
      City: DataTypes.STRING,
      Pincode: DataTypes.STRING,
      Sector: DataTypes.STRING,
      Sub_Sector: DataTypes.STRING,
      Inactive_Status: DataTypes.STRING,
      Data_Verifcation_Status: DataTypes.STRING,
      Data_Verification_Date: DataTypes.STRING,
      Photo_Verifcation_Status: DataTypes.STRING,
      Photo_Verification_Date: DataTypes.STRING,
      Last_Scanned_Event: DataTypes.STRING,
      Last_Scanned_Place: DataTypes.STRING,
      Sector_Incharge_ITSID: DataTypes.STRING,
      Sector_Incharge_Name: DataTypes.STRING,
      Sector_Incharge_Female_ITSID: DataTypes.STRING,
      Sector_Incharge_Female_Name: DataTypes.STRING,
      Sub_Sector_Incharge_ITSID: DataTypes.STRING,
      Sub_Sector_Incharge_Name: DataTypes.STRING,
      Sub_Sector_Incharge_Female_ITSID: DataTypes.STRING,
      Sub_Sector_Incharge_Female_Name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { paranoid: true, freezeTableName: true }
  );
  model.associate = () => {};

  return model;
};
