import { client } from "../index.js";

// async function getAllLogs(page = 1, limit = 5) {
//   const skips = (page - 1) * limit;
//   const allLogs = await client
//     .db("DigitalProductPassport")
//     .collection("CustomerLogMaster")
//     .find()
//     .skip(skips)
//     .limit(limit)
//     .toArray();
//   return allLogs;
// }
// async function getAllLogs(page = 1, limit = 5) {
//   const skips = (page - 1) * limit;
//   const allLogs = await client
//     .db("DigitalProductPassport")
//     .collection("CustomerLogMaster")
//     .find()
//     .skip(skips)
//     .limit(limit)
//     .toArray();

//   return allLogs;
// }
async function getAllLogs(page = 1, limit = 5) {
  const skips = (page - 1) * limit;
  const allLogs = await client
    .db("DigitalProductPassport")
    .collection("CustomerLogMaster")
    .find()
    .sort({ date: -1, time: -1 }) // Sort by date and time in descending order
    .skip(skips)
    .limit(limit)
    .toArray();

  return allLogs;
}

// async function GetLogs(startDate, endDate) {
//   try {
//     // Format dates to ensure they are strings in 'YYYY-MM-DD' format
//     const start = startDate;
//     const end = endDate;

//     const logs = await client
//       .db("DigitalProductPassport")
//       .collection("CustomerLogMaster")
//       .find({
//         date: {
//           $gte: start,
//           $lte: end,
//         },
//       })
//       .toArray();

//     return logs;
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     throw error;
//   }
// }

// async function GetLogs(startDate, endDate, type) {
//   try {
//     // Format dates to ensure they are strings in 'YYYY-MM-DD' format
//     const start = startDate;
//     const end = endDate;
//     console.log(type);
//     const logs = await client
//       .db("DigitalProductPassport")
//       .collection("CustomerLogMaster")
//       .find({
//         date: {
//           $gte: start,
//           $lte: end,
//         },
//         type: type, // Filter by type
//       })
//       .toArray();

//     return logs;
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     throw error;
//   }
// }

// async function GetLogs(startDate, endDate, type, action) {
//   try {
//     // Format dates to ensure they are strings in 'YYYY-MM-DD' format
//     const start = startDate;
//     const end = endDate;
//     console.log(action);
//     // Construct the query object
//     const query = {
//       date: {
//         $gte: start,
//         $lte: end,
//       },
//     };

//     // Conditionally add the type filter if type is not blank
//     if (type) {
//       query.type = type;
//     } else if (action) {
//       query.action = action;
//     }

//     // Fetch logs based on the query
//     const logs = await client
//       .db("DigitalProductPassport")
//       .collection("CustomerLogMaster")
//       .find(query)
//       .toArray();

//     return logs;
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     throw error;
//   }
// }

async function GetLogs(startDate, endDate, type, action) {
  try {
    // Format dates to ensure they are strings in 'YYYY-MM-DD' format
    const start = startDate;
    const end = endDate;
    console.log(action);

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