import { client } from "../index.js";

async function getAllLogs(
  page,
  limit,
  type,
  action,
  date,
  time,
  startDate,
  endDate
) {
  const skips = (page - 1) * limit;
  const query = {};

  // If startDate and endDate are provided, include them in the query
  if (startDate && endDate) {
    query.date = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  // If type is provided, include it in the query
  if (type) {
    query.type = type;
  }

  // If action is provided, include it in the query
  if (action) {
    query.action = action;
  }
  console.log({ date: date, time: time });
  let logs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .find(query) // Apply the query to filter logs based on type and action
    .sort({ date: date, time: time })
    .skip(skips)
    .limit(limit)
    .toArray();

  // No need for additional filtering here

  // Pagination logic
  const totalLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .countDocuments(query); // Count total number of logs that match the query

  const hasMoreLogs = totalLogs > skips + logs.length; // Check if there are more logs available

  return { logs, hasMoreLogs };
}

async function GetLogs(startDate, endDate, type, action) {
  try {
    // Format dates to ensure they are strings in 'YYYY-MM-DD' format
    const start = formatDate1(startDate);
    const end = formatDate1(endDate);
    function formatDate1(dateString) {
      console.log("date", dateString);
      const dateObject = new Date(dateString);
      console.log("dateobject", dateObject);
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObject.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Construct the query object
    const query = {
      date: {
        $gte: start,
        $lte: end,
      },
    };

    // Conditionally add the type filter if type is not blank
    if (type) {
      query.type = type;
    }

    // Conditionally add the action filter if action is not blank
    if (action) {
      query.action = action;
    }

    // Fetch logs based on the query
    const logs = await client
      .db("DigitalProductPassport")
      .collection("CustomerLogMaster")
      .find(query)
      .toArray();

    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

async function PostLogs(logs) {
  const PostedLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .insertOne(logs);
  return PostedLogs;
}

export { getAllLogs, PostLogs, GetLogs };
