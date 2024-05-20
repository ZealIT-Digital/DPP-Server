import { client } from "../index.js";

async function getAllLogs(page = 1, limit = 5) {
  const skips = (page - 1) * limit;
  const allLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .find()
    .skip(skips)
    .limit(limit)
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
