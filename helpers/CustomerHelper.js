import { client } from "../index.js";

async function getAllCustomers(page, limit, skip, sort) {
  // const skips = (page + 1) * limit;
  console.log({ page: page, limit: limit, skip: skip });
  const allCustomerData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .find()
    .skip(parseInt(skip))
    .limit(limit)
    .sort({ id: sort })
    .toArray();
  console.log(allCustomerData);
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
    .find({ id: id }, function (err, result) {
      if (err) throw err;
    }).toArray();
  return customerData; 
}

async function getCustomerByname(name) {
  try {
    const customerData = await client
      .db("DigitalProductPassport")
      .collection("CustomerMasterData")
      .find({ name: { '$regex': name, '$options': 'i' } })
      .toArray();
    return customerData;
  } catch (err) {
    // console.error(err);
    throw err;
  }
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

export {
  getAllLogs,
  getAllCustomers,
  getCustomerByname,
  getCustomerById,
  postCustomer,
  updateCustomer,
  deleteCustomer,
  custID,
  updateCustRunningNo,
  checkcustomer,
  getCustomerCount,
  deleteAllCustomer,
};
