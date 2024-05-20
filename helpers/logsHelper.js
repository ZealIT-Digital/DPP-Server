import { client } from "../index.js";

async function getAllLogs() {
  const allLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .find()
    .toArray();
  return allLogs;
}

async function PostLogs(logs) {
  const PostedLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .insertOne(logs);
  return PostLogs;
}

export { getAllLogs, PostLogs };
