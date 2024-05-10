import { client } from "../index.js";
async function getAllProducts() {
  const allProductData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .find()
    .toArray();
  return allProductData;
}
async function postUiTemplate(data) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .insertOne(data);
  return UiTemplate;
}
async function getAllProductCategory() {
  let categories = await client
    .db("DigitalProductPassport")
    .collection("ProductCategoryMasterData")
    .find({})
    .toArray();
  return categories;
}
async function getAllLogs() {
  const allLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .find()
    .toArray();
  return allLogs;
}
async function templateID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Template" });
  return productDetail;
}
async function getProductsById(id) {
  let productData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .findOne({ id: id });
  return productData;
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
async function deleteProduct(id) {
  const deletedCustomer = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .deleteOne({ id: id });
  return deletedCustomer;
}
async function getUiMasterTemplatebyCategory(category) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .findOne({ templateCategory: category });

  return UiTemplate;
}
async function getUiTemplate(id) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .findOne({ templateId: id });

  return UiTemplate;
}
async function prodID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Product" });
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

async function addProductCategory(data) {
  const postedCustomerData = await client
    .db("DigitalProductPassport")
    .collection("ProductCategoryMaster")
    .insertOne(data);
  return postedCustomerData;
}

async function prodCatId() {
  const productCategoryDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Product Category" });
  return productCategoryDetail;
}

async function updateProdCatRunningNo(num) {
  let filter = { idType: "Product Category" };
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
  getAllProducts,
  getProductsById,
  postProduct,
  updateProductHeader,
  getAllLogs,
  updateProduct,
  deleteProduct,
  prodID,
  templateID,
  postUiTemplate,
  updateProdRunningNo,
  getUiMasterTemplatebyCategory,
  getAllProductCategory,
  getUiTemplate,
  updateTempRunningNo,
  addProductCategory,
  prodCatId,
  updateProdCatRunningNo,
};
