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

async function getAllProducts() {
  const allProductData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .find()
    .toArray();
  return allProductData;
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

async function updateProductHeader(data) {
  let filter = { id: data.id };
  // const options = { upsert: true };
  let update = {
    $set: {
      name: data.name,
      category: data.category,
      imageUrl: data.imageUrl,
      description: data.description,
      templateId: data.templateId,
    },
  };
  const updatedDetails = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .updateOne(filter, update);
  return updatedDetails;
}

async function updateProduct(productId, tempID) {
  let filter = { id: productId };
  // const options = { upsert: true };
  let update = {
    $set: {
      templateId: tempID,
    },
  };
  const updatedDetails = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .updateOne(filter, update);
  return updatedDetails;
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

async function deleteProduct(id) {
  const deletedCustomer = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .deleteOne({ id: id });
  return deletedCustomer;
}

async function getUiTemplate(id) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .findOne({ templateId: id });

  return UiTemplate;
}

async function getUiMasterTemplatebyCategory(category) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .findOne({ templateCategory: category });

  return UiTemplate;
}

async function getAllUiId() {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .find({})
    .project({ templateId: 1 })
    .toArray();

  return UiTemplate;
}

async function postUiTemplate(data) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .insertOne(data);
  return UiTemplate;
}

async function updateUi(tempId, data) {
  const postedUIData = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .replaceOne({ templateId: tempId }, data);

  return postedUIData;
}

async function prodID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Product" });
  return productDetail;
}

async function custID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Customer" });
  return productDetail;
}

async function templateID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Template" });
  return productDetail;
}

async function updateProdRunningNo(num) {
  let filter = { idType: "Product" };
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

async function updateTempRunningNo(num) {
  let filter = { idType: "Template" };
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
async function PostLogs(logs) {
  const PostedLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .insertOne(logs);
  return PostLogs;
}
async function getAllLogs(){
  const allLogs = await client
  .db('DigitalProductPassport')
  .collection("CustomerLogMaster")
  .find()
  .toArray();
  return allLogs
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
  createUser,
  PostLogs,
  getAllLogs,
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
  getAllProducts,
  prodID,
  updateProdRunningNo,
  templateID,
  updateTempRunningNo,
  updateProduct,
  custID,
  updateCustRunningNo,
  deleteProduct,
  updateProductHeader,
  getAllUiId,
  getUiMasterTemplatebyCategory,
  updateUi,
};