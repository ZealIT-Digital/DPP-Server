import { client } from "./index.js";

async function createUser(userData) {
  const postedCustomerData = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .insertOne(userData);
  return postedCustomerData;
}

async function login(email) {
  const loginUserData = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .findOne({ email: email });
  return loginUserData;
}

async function getAllCustomers() {
  const allCustomerData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .find()
    .toArray();
  return allCustomerData;
}

async function getCustomerById(id) {
  const customerData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .findOne({ id: id }, function (err, result) {
      if (err) throw err;
      console.log(result.name);
    });
  return customerData;
}

async function getProductsById(id) {
  let productData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .findOne({ id: id });
  return productData;
}

async function postCustomer(customerData) {
  const postedCustomerData = await client
    .db("DigitalProductPassport")
    .collection("CustomerMasterData")
    .insertOne(customerData);
  return postedCustomerData;
}

async function postProduct(productData) {
  const postedProductData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .insertOne(productData);
  return postedProductData;
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

async function getUiTemplate(id) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .findOne({ template_ID: id });
  return UiTemplate;
}

async function postUiTemplate(data) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .insertOne(data);
  return UiTemplate;
}

export {
  createUser,
  login,
  getAllCustomers,
  getCustomerById,
  getProductsById,
  postCustomer,
  postProduct,
  updateCustomer,
  deleteCustomer,
  getUiTemplate,
  postUiTemplate,
};
