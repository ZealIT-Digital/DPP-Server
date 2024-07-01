import { client } from "../index.js";

async function getAllEntitys(limit, skip, sort) {
  console.log("mskip", skip);
  const allEntityData = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .find()
    .skip(parseInt(skip))
    .limit(limit)
    .sort({ id: sort })
    .toArray();

  return allEntityData;
}

async function getAllLogs() {
  const allLogs = await client
    .db("DigitalProductPassport")
    .collection("EntityLogMaster")
    .find()
    .toArray();
  return allLogs;
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

async function postEntity(EntityData) {
  const postedEntityData = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .insertOne(EntityData);
  return postedEntityData;
}
async function updateEntity(id, EntityData) {
  const existingUser = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .findOne({ email: EntityData.email, id: { $ne: id } });
  if (existingUser) {
    return { status: 301, message: "Email already exists in another user" }; // Conflict status code
  }
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
async function custID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Entity" });
  return productDetail;
}
async function checkEntity(email) {
  const userData = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .findOne({ email: email });
  return userData;
}
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

async function getEntityCount() {
  const count = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .countDocuments();

  return count;
}

async function deleteAllEntity() {
  const delet = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .deleteMany();

  return delet;
}

async function searchEntitys(queryParams) {
  const query = {};

  // Populate query object dynamically based on provided query parameters
  for (const param in queryParams) {
    if (queryParams[param]) {
      query[param] = { $regex: new RegExp(queryParams[param], "i") };
    }
  }

  const EntityData = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .find(query)
    .toArray();

  return EntityData;
}

async function sortEntitys(sortType) {
  const sortedEntitys = await client
    .db("DigitalProductPassport")
    .collection("EntityMasterData")
    .find()
    .sort({ id: sortType })
    .toArray();

  return sortedEntitys;
}

export {
  getAllLogs,
  getAllEntitys,
  getEntityById,
  postEntity,
  updateEntity,
  deleteEntity,
  custID,
  updateCustRunningNo,
  checkEntity,
  getEntityCount,
  deleteAllEntity,
  searchEntitys,
  sortEntitys,
};
