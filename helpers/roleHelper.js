import { client } from "../index.js";

async function getAllRoles() {
  const allRoles = await client
    .db("DigitalProductPassport")
    .collection("RoleMasterData")
    .find()
    .toArray();
  return allRoles;
}

async function updateRole(jsonData) {
  try {
    let newrole = jsonData.roles;
    let newallowed = jsonData.allowed;
    let filter = { Roles: newrole };
    let update = {
      $set: {
        allowed: newallowed,
      },
    };
    const updatedRole = await client
      .db("DigitalProductPassport")
      .collection("RoleMasterData")
      .updateOne(filter, update);
    return updatedRole;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Throw the error to be caught by the caller
  }
}

export { getAllRoles, updateRole };
