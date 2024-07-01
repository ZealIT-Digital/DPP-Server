import { client } from "./index.js";

async function createUser(userData) {
  const postedEntityData = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .insertOne(userData);
  return postedEntityData;
}

async function login(email) {
  const loginUserData = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .findOne({ email: email });
  return loginUserData;
}

async function getAllEntitys() {
  const allEntityData = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .find()
    .toArray();
  return allEntityData;
}

async function getAllProducts() {
  const allProductData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .find()
    .toArray();
  return allProductData;
}

async function getEntityById(id) {
  const EntityData = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .findOne({ id: id }, function (err, result) {
      if (err) throw err;
    });
  return EntityData;
}

async function getProductsById(id) {
  let productData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .findOne({ id: id });
  return productData;
}

async function postEntity(EntityData) {
  const postedEntityData = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .insertOne(EntityData);
  return postedEntityData;
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

async function updateEntity(id, EntityData) {
  const postedProductData = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .replaceOne({ id: id }, EntityData);
  return postedProductData;
}

async function deleteEntity(id) {
  const deletedEntity = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .deleteOne({ id: id });
  return deletedEntity;
}

async function deleteProduct(id) {
  const deletedEntity = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .deleteOne({ id: id });
  return deletedEntity;
}

async function getUiTemplate(id) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("UiTemplateMaster")
    .findOne({ templateId: id });

  return UiTemplate;
}

async function getUiMasterTemplate(id) {
  const UiTemplate = await client
    .db("DigitalProductPassport")
    .collection("MasterTemplate")
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
    .findOne({ idType: "Entity" });
  return productDetail;
}

async function templateID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Template" });
  return productDetail;
}
async function userid() {
  const userid = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "User" });
  return userid;
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

async function PostIdentity(identity) {
  const PostedIdentity = await client
    .db("DigitalProductPassport")
    .collection("ComponentMasterData")
    .insertOne(identity);
  return PostedIdentity;
}

//! To Be Removed - Start
// async function getAllIdentity() {
//   const allIdentity = await client
//     .db("DigitalProductPassport")
//     .collection("ComponentMasterData")
//     .find()
//     .toArray();
//   return allIdentity;
// }

// async function getAllRoles() {
//   const allRoles = await client
//     .db("DigitalProductPassport")
//     .collection("RoleMasterData")
//     .find()
//     .toArray();
//   return allRoles;
// }
//! To Be Removed - End

async function updateCustRunningNo(num) {
  let filter = { idType: "Entity" };
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
  login,
  getAllEntitys,
  getEntityById,
  getProductsById,
  postEntity,
  postProduct,
  updateEntity,
  deleteEntity,
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
  PostIdentity,
  userid,
  getUiMasterTemplate,
};
