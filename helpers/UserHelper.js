import { client } from "../index.js";

async function createUser(userData) {
  const postedCustomerData = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .insertOne(userData);
  return postedCustomerData;
}

async function updateUser(userId, userData) {
  try {
    
    const result = await client.db("DigitalProductPassport").collection('UserMasterData').updateOne(
      { id: userId },  // Search for the document by the custom 'id' field
      { $set: userData }
    );
   
    console.log(result);
    if (result.matchedCount === 0) {
      return { status: 404, message: 'User not found' };
    }
    // return result;

    return { status: 200, message: 'User updated successfully' };
  } catch (error) {
    console.error(error);
    return { status: 500, message: 'An error occurred while updating the user' };
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

async function postHistory(History) {
  if (History.productName) {
    let filter = { email: History.userEmail };
    let update = {
      $addToSet: {
        history: History,
      },
    };
    const PostedHistory = await client
      .db("DigitalProductPassport")
      .collection("UserMasterData")
      .updateOne(filter, update);
    return PostedHistory;
  } else {
    return "error";
  }
}

export { createUser, getUserData, login, updateUser, postHistory };
