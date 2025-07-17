/* eslint-disable implicit-arrow-linebreak */
const gc = require("../../storageConfig");
const { PER_THAAL_COST } = require("../const/constants");

const bucket = gc.bucket("explat-bucket"); // should be your bucket name

const uploadImage = (file, eventId, type) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    const rndstr = new Date().getTime();
    const fullPath = `${eventId}/${type}/${rndstr}-${originalname.replace(/ /g, "_")}`;

    const blob = bucket.file(fullPath);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on("error", (err) => {
        reject(err);
      })
      .end(buffer);
  });

const getDelegateTypeSlug = (delegateType) => {
  switch (delegateType) {
    case "DELEGATE":
      return "d";
    case "EXHIBITOR":
      return "e";
    case "MEDIA":
      return "m";
    case "ORGANISER":
      return "o";
    case "SPEAKER":
      return "s";
    default:
      return "d";
  }
};

const constructMailConfig = (mailInfo, toArray) => {
  const to = toArray.map((arr) => {
    const url = `${mailInfo.url}?id=${arr.id}&t=${getDelegateTypeSlug(arr.delegateType)}`;
    return {
      email_address: {
        address: arr.email,
        // address: "husainpoonawala1995@gmail.com",
        name: arr.name,
      },
      merge_info: {
        name: arr.name,
        url,
        encodedUrl: encodeURIComponent(url),
      },
    };
  });
  return {
    mail_template_key: mailInfo.templateId,
    bounce_address: mailInfo.fromBounceEmail,
    from: {
      address: mailInfo.fromEmail,
      name: mailInfo.fromName,
    },
    to,
    client_reference: mailInfo.eventId,
  };
};

const getGentsLadiesCount = (familyMembers) => {
  let gentsCount = 0;
  let ladiesCount = 0;
  familyMembers.forEach((f) => {
    if (f.gender === "Male") {
      gentsCount += 1;
    } else {
      ladiesCount += 1;
    }
  });
  return { gentsCount, ladiesCount };
};

const calcBookingTotals = (halls = []) =>
  halls.reduce(
    ({ rent, deposit, thaals, total }, { rent: r = 0, deposit: d = 0, thaals: t = 0 }) => {
      const hallTotal = r + d + t * PER_THAAL_COST;
      return {
        rent: rent + r,
        deposit: deposit + d,
        thaals: thaals + t,
        total: total + hallTotal,
      };
    },
    { rent: 0, deposit: 0, thaals: 0, total: 0 }
  );

module.exports = { uploadImage, constructMailConfig, getGentsLadiesCount, calcBookingTotals };
