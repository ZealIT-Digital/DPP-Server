import { client } from "../index.js";

async function getAllCustomers(limit, skip, sort) {
  console.log("mskip", skip);
  const allCustomerData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .find()
    .skip(parseInt(skip))
    .limit(limit)
    .sort({ id: sort })
    .toArray();

  return allCustomerData;
}

async function getAllLogs() {
  const allLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .find()
    .toArray();
  return allLogs;
}

async function getCustomerById(id) {
  const customerData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .findOne({ id: id }, function (err, result) {
      if (err) throw err;
    });
  return customerData;
}

async function postCustomer(customerData) {
  const postedCustomerData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .insertOne(customerData);
  return postedCustomerData;
}
async function updateCustomer(id, customerData) {
  const postedProductData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .replaceOne({ id: id }, customerData);
  return postedProductData;
}
async function deleteCustomer(id) {
  const deletedCustomer = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .deleteOne({ id: id });
  return deletedCustomer;
}
async function custID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Customer" });
  return productDetail;
}
async function checkcustomer(email) {
  const userData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .findOne({ email: email });
  return userData;
}
async function updateCustRunningNo(num) {
  let filter = { idType: "Customer" };
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

async function getCustomerCount() {
  const count = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .countDocuments();

  return count;
}

async function deleteAllCustomer() {
  const delet = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .deleteMany();

  return delet;
}

async function searchCustomers(queryParams) {
  const query = {};

  // Populate query object dynamically based on provided query parameters
  for (const param in queryParams) {
    if (queryParams[param]) {
      query[param] = { $regex: new RegExp(queryParams[param], "i") };
    }
  }

  const customerData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .find(query)
    .toArray();

  return customerData;
}

  async function sortCustomers(sortType){

    const sortedCustomers = await client
       .db("DigitalProductPassport")
       .collection("CustomerMasterData")
       .find().sort({id:sortType})
       .toArray();
   
   return sortedCustomers;
   }


export {
  getAllLogs,
  getAllCustomers,
  getCustomerById,
  postCustomer,
  updateCustomer,
  deleteCustomer,
  custID,
  updateCustRunningNo,
  checkcustomer,
  getCustomerCount,
  deleteAllCustomer,
  searchCustomers,
  sortCustomers,
};
