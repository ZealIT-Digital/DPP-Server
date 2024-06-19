import { client } from "../index.js";

async function connectionID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Connections" });
  return productDetail;
}

async function updateConnectionRunningNo(num) {
  let filter = { idType: "Connections" };
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

async function getallConnection() {
  const getAllConnection = await client
    .db("DigitalProductPassport")
    .collection("ConnectionMasterData")
    .find()
    .toArray();
  return getAllConnection;
}

async function postConnectionHeader(data) {
  const postConnection = await client
    .db("DigitalProductPassport")
    .collection("ConnectionMasterData")
    .insertOne(data);

  return postConnection;
}

async function postConnectionParams(id, data) {
  let filter = { id: id };
  let update = {
    $push: {
      connections: data,
    },
  };
  const postConnection = await client
    .db("DigitalProductPassport")
    .collection("ConnectionMasterData")
    .updateOne(filter, update);

  return postConnection;
}

export {
  getallConnection,
  postConnectionHeader,
  postConnectionParams,
  updateConnectionRunningNo,
  connectionID,
};
