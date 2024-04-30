import { client } from "../index.js";
async function getAllCustomers() {
    const allCustomerData = await client
      .db("DigitalProductPassport")
      .collection("CustomerMasterData")
      .find()
      .toArray();
    return allCustomerData;
  }
  async function getAllLogs(){
    const allLogs = await client
    .db('DigitalProductPassport')
    .collection("CustomerLogMaster")
    .find()
    .toArray();
    return allLogs
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
  export {
    getAllLogs,
    getAllCustomers,
    getCustomerById,
    postCustomer,
    updateCustomer,
    deleteCustomer,
    custID,
    updateCustRunningNo
  };