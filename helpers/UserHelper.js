import { client } from "../index.js";
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
  export {
    createUser,
    login};