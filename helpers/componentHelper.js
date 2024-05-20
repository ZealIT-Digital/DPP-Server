import { client } from "../index.js";

async function getAllComponents() {
  const allIdentity = await client
    .db("DigitalProductPassport")
    .collection("ComponentMasterData")
    .find()
    .toArray();
  return allIdentity;
}

export { getAllComponents };
