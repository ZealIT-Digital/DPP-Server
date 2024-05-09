import { client } from "../index.js";
async function createUser(userData) {
  const postedCustomerData = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .insertOne(userData);
  return postedCustomerData;
}

async function updateUser(jsonData) {
  try {
    let newrole = jsonData.roles;
    let newallowed = jsonData.allowed;
    let filter = { roles: newrole };
    let update = {
      $set: {
        allowed: newallowed,
      },
    };
    const updatedUser = await client
      .db("DigitalProductPassport")
      .collection("RoleMasterData")
      .updateOne(filter, update);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Throw the error to be caught by the caller
  }
}

async function login(email) {
  const loginUserData = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .findOne({ email: email });
  return loginUserData;
}
async function getUserData(email) {
  const userData = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .findOne({ email: email });
  return userData;
}
export { createUser, getUserData, login, updateUser };
