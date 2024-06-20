import { client } from "../index.js";
import crypto from "crypto";

function encryptPassword(password, secretKey) {
  const algorithm = "aes-256-ctr"; // Encryption algorithm
  const iv = crypto.randomBytes(16); // Initialization vector

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  const encryptedPassword = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    encryptedPassword: encryptedPassword.toString("hex"),
  };
}

function decryptPassword(encryptedPassword, iv, secretKey) {
  const algorithm = "aes-256-ctr"; // Encryption algorithm
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );

  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryptedPassword, "hex")),
    decipher.final(),
  ]);

  return decryptedPassword.toString();
}

const password = "my-secret-password";
const secretKey = crypto.randomBytes(32).toString("hex"); // Secret key for encryption

const encrypted = encryptPassword(password, secretKey);
console.log("Encrypted Password:", encrypted);

const decrypted = decryptPassword(
  encrypted.encryptedPassword,
  encrypted.iv,
  secretKey
);
console.log("Decrypted Password:", decrypted);

async function connectionCategoryID() {
  const productDetail = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .findOne({ idType: "Connection Category" });
  return productDetail;
}

async function updateConnectionCategoryRunningNo(num) {
  let filter = { idType: "Connection Category" };
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

async function deleteConnectionCategory(id) {
  const deleted = await client
    .db("DigitalProductPassport")
    .collection("ConnectionMasterData")
    .deleteOne({ id: id });
  return deleted;
}

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

async function deleteConnection(conCatId, conId) {
  let filter = { id: conCatId };
  let update = {
    $pull: {
      connections: { uid: conId },
    },
  };

  const updated = await client
    .db("DigitalProductPassport")
    .collection("ConnectionMasterData")
    .updateOne(filter, update);

  return updated;
}

export {
  getallConnection,
  postConnectionHeader,
  postConnectionParams,
  updateConnectionCategoryRunningNo,
  connectionCategoryID,
  deleteConnectionCategory,
  connectionID,
  updateConnectionRunningNo,
  deleteConnection,
};
