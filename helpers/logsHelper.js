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

  // Check if startDate and endDate are valid dates
  if (startDate && endDate) {
    // Adjust endDate to include the entire day by adding one day and setting it to the start of that day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1); // Add one day
    adjustedEndDate.setHours(0, 0, 0, 0); // Set to start of day

    query.date = {
      $gte: new Date(startDate),
      $lt: adjustedEndDate,
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

  console.log({ startDate, endDate }); // Debugging to ensure startDate and endDate are correctly passed

  // Fetch logs based on the constructed query
  let logs = [];
  try {
    logs = await client
      .db("DigitalProductPassport")
      .collection("EntityLogMaster")
      .find(query)
      .sort({ date: date, time: time })
      .skip(skips)
      .limit(limit)
      .toArray();
    console.log({ logs: logs }); // Debugging to see fetched logs
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }

  // Pagination logic
  const totalLogs = await client
    .db("DigitalProductPassport")
    .collection("EntityLogMaster")
    .countDocuments(query); // Count total number of logs that match the query

  const hasMoreLogs = totalLogs > skips + logs.length; // Check if there are more logs available

  return { logs, hasMoreLogs };
}

async function GetLogs(startDate, endDate, type, action) {
  try {
    // Adjust endDate to include the entire day by adding one day and setting it to the start of that day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1); // Add one day
    adjustedEndDate.setHours(0, 0, 0, 0); // Set to start of day

    // Construct the query object
    const query = {
      date: {
        $gte: new Date(startDate), // Convert startDate to Date object
        $lt: adjustedEndDate, // Use $lt to include up to the end of adjustedEndDate (exclusive)
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
      .collection("EntityLogMaster")
      .find(query)
      .toArray();

    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

async function PostLogs(logs) {
  // Assuming logs.date is already a Date object or can be parsed into one
  const formattedLogs = {
    ...logs,
    date: new Date(logs.date), // Convert logs.date to a Date object
  };

  try {
    const dbResponse = await client
      .db("DigitalProductPassport")
      .collection("EntityLogMaster")
      .insertOne(formattedLogs);

    return dbResponse;
  } catch (error) {
    console.error("Error inserting logs:", error);
    throw error; // Handle or propagate the error as needed
  }
}

export { getAllLogs, PostLogs, GetLogs };
