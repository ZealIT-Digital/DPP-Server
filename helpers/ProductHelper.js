import { hash } from "bcrypt";
import { client } from "../index.js";

async function getAllProducts(page, limit, skip, sort) {
  const allProductData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .find()
    .skip(parseInt(skip))
    .limit(limit)
    .sort({ id: sort })
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
// async function getAllLogs() {
//   const allLogs = await client
//     .db("DigitalProductPassport")
//     .collection("CustomerLogMaster")
//     .find()
//     .toArray();
//   return allLogs;
// }
async function getAllLogs(page = 1, limit = 5) {
  const skips = (page - 1) * limit;
  const allLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .find()
    .skip(skips)
    .limit(limit)
    .toArray();
  return allLogs;
}

async function postSerials(data, id) {
  let filter = { id: id };
  // const options = { upsert: true };
  let update = {
    $push: {
      serialNos: data,
    },
  };
  const updatedDetails = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .updateOne(filter, update);

  return updatedDetails;
}
async function SerialCheck(serialkey, productId) {
  console.log({ serialback: serialkey, prodidback: productId });
  try {
    const duplicates = await client
      .db("DigitalProductPassport")
      .collection("ProductMasterData")
      .aggregate([
        {
          $match: {
            id: productId, // Match the specific productId
          },
        },
        {
          $unwind: "$serialNos", // Unwind the serialNos array to access each element
        },
        {
          $match: {
            "serialNos.serialNos": serialkey, // Match the specific serial number as a string
          },
        },
        {
          $group: {
            _id: "$serialNos.serialNos", // Group by serialNos
            count: { $sum: 1 }, // Count the number of occurrences
          },
        },
        {
          $match: {
            count: { $gt: 0 }, // Only keep serial numbers that appear at least once
          },
        },
      ])
      .toArray();

    console.log(
      "Duplicate serial numbers found:",
      duplicates.length > 0 ? duplicates : "None"
    );
    return duplicates.length > 0;
  } catch (error) {
    console.error("Error checking for duplicate serial numbers:", error);
    throw error;
  }
}

async function checkproduct(name) {
  const userData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .findOne({ name: name });
  return userData;
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
    .collection("ProductCategoryMasterData")
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

async function deleteProductCategory(id) {
  const deletedCustomer = await client
    .db("DigitalProductPassport")
    .collection("ProductCategoryMasterData")
    .deleteOne({ id: id });
  return deletedCustomer;
}

async function updateProductCategory(catId, tempID) {
  let filter = { id: catId };
  let update = {
    $set: {
      MastertemplateId: tempID,
    },
  };
  const updatedCategory = await client
    .db("DigitalProductPassport")
    .collection("ProductCategoryMasterData")
    .updateOne(filter, update);
  return updatedCategory;
}

async function deleteCategories(ids) {
  const deleted = await client
    .db("DigitalProductPassport")
    .collection("ProductCategoryMasterData")
    .deleteMany({ id: { $in: ids } });

  return deleted;
}

async function getProductCount() {
  const count = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .countDocuments();

  return count;
}

async function deleteAllProduct() {
  const delet = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .deleteMany();

  return delet;
}

async function deleteBcHash(prodId, bcHash) {
  try {
    let filter = { id: prodId };
    let update = {
      $pull: {
        serialNos: { Hash: bcHash },
      },
    };

    const deletedHash = await client
      .db("DigitalProductPassport")
      .collection("ProductMasterData")
      .updateOne(filter, update);

    if (deletedHash.modifiedCount != 0) {
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");

      const formattedDate = `${day}-${month}-${year} `;
      const formattedTime = `${hours}:${minutes}`;

      let insertionData = {
        productID: prodId,
        Hash: bcHash,
        deletionTime: `${formattedDate}|${formattedTime}`,
      };
      const addToVoid = await client
        .db("DigitalProductPassport")
        .collection("BlockChainVoidTransactions")
        .insertOne(insertionData);
    }

    return deletedHash;
  } catch (err) {
    console.error("Error deleting hash from the serialNos array:", err);
    throw err;
  }
}

async function searchProduct(queryParams) {
  const query = {};

  // Populate query object dynamically based on provided query parameters
  for (const param in queryParams) {
    if (queryParams[param]) {
      query[param] = { $regex: new RegExp(queryParams[param], "i") };
    }
  }

  const productData = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .find(query)
    .toArray();

  return productData;
}

async function sortProducts(sortType) {
  const sortedProducts = await client
    .db("DigitalProductPassport")
    .collection("ProductMasterData")
    .find()
    .sort({ id: sortType })
    .toArray();

  return sortedProducts;
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
  deleteProductCategory,
  updateProductCategory,
  deleteCategories,
  postSerials,
  deleteAllProduct,
  getProductCount,
  SerialCheck,
  deleteBcHash,
  searchProduct,
  sortProducts,
  checkproduct,
};
