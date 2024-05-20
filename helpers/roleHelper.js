import { client } from "../index.js";

async function getAllRoles() {
  const allRoles = await client
    .db("DigitalProductPassport")
    .collection("RoleMasterData")
    .find()
    .toArray();
  return allRoles;
}

export { getAllRoles };
