import { client } from "../index.js";

async function getAllVendors(limit, skip, sort) {
  console.log("mskip", skip);
  const allVendorData = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .find()
    .skip(parseInt(skip))
    .limit(limit)
    .sort({ id: sort })
    .toArray();

  return allVendorData;
}

async function getAllLogs() {
  const allLogs = await client
    .db("DigitalProductPassport")
    .collection("VendorLogMaster")
    .find()
    .toArray();
  return allLogs;
}

async function getVendorById(id) {
  const VendorData = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .findOne({ id: id }, function (err, result) {
      if (err) throw err;
    });
  return VendorData;
}

async function postVendor(VendorData) {
  const postedVendorData = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .insertOne(VendorData);
  return postedVendorData;
}
async function updateVendor(id, VendorData) {
  const postedProductData = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .replaceOne({ id: id }, VendorData);
  return postedProductData;
}
async function deleteVendor(id) {
  const deletedVendor = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .deleteOne({ id: id });
  return deletedVendor;
}
async function vendID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Vendor" });
  return productDetail;
}
async function checkVendor(email) {
  const userData = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .findOne({ email: email });
  return userData;
}
async function updateVendRunningNo(num) {
  let filter = { idType: "Vendor" };
  let update = {
    $set: {
      runningNumber: num,
    },
  };

  const updatedDetails = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .updateOne(filter, update);
  return updatedDetails;
}

async function getVendorCount() {
  const count = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .countDocuments();

  return count;
}

async function deleteAllVendor() {
  const delet = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .deleteMany();

  return delet;
}

async function searchVendors(queryParams) {
  const query = {};

  // Populate query object dynamically based on provided query parameters
  for (const param in queryParams) {
    if (queryParams[param]) {
      query[param] = { $regex: new RegExp(queryParams[param], "i") };
    }
  }

  const VendorData = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .find(query)
    .toArray();

  return VendorData;
}

async function sortVendors(sortType) {
  const sortedVendors = await client
    .db("DigitalProductPassport")
    .collection("VendorMasterData")
    .find()
    .sort({ id: sortType })
    .toArray();

  return sortedVendors;
}

export {
  getAllLogs,
  getAllVendors,
  getVendorById,
  postVendor,
  updateVendor,
  deleteVendor,
  vendID,
  updateVendRunningNo,
  checkVendor,
  getVendorCount,
  deleteAllVendor,
  searchVendors,
  sortVendors,
};
