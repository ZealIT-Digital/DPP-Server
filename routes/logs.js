import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

import { verifyToken } from "../index.js";

import { getAllLogs, PostLogs, GetLogs } from "../helpers/logsHelper.js";

// router.get("/getAllLogs", verifyToken, async (req, res) => {
//   jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       const allLogs = await getAllLogs();
//       res.send(allLogs);
//     }
//   });
// });
router.get("/getAllLogs", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 5; // Default to limit 5 if not provided
      const type = req.query.type || ""; // Extract type query parameter
      const action = req.query.action || ""; // Extract action query parameter
      const date = req.query.date;
      const time = req.query.time;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      try {
        const allLogs = await getAllLogs(
          page,
          limit,
          type,
          action,
          date,
          time,
          startDate,
          endDate
        ); // Pass type and action to getAllLogs
        res.send(allLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
        res.sendStatus(500);
      }
    }
  });
});
// router.get("/getAllLogsByDate", verifyToken, async (req, res) => {
//   jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       const excellogs = await GetLogs();
//       res.send(excellogs);
//     }
//   });
// });
// Route to get logs by date range

// router.get("/getAllLogsByDate", verifyToken, async (req, res) => {
//   jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       const { startDate, endDate } = req.query;

//       if (!startDate || !endDate) {
//         return res
//           .status(400)
//           .send({ error: "Start date and end date are required" });
//       }

//       try {
//         const logs = await GetLogs(startDate, endDate);
//         res.status(200).send(logs);
//       } catch (error) {
//         console.error("Error fetching logs:", error);
//         res.status(500).send({ error: "Error fetching logs" });
//       }
//     }
//   });
// });

router.get("/getAllLogsByDate", async (req, res) => {
  const { startDate, endDate, type, action } = req.query;

  try {
    const logs = await GetLogs(startDate, endDate, type, action);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error });
  }
});

router.post("/postLogs", async (req, res) => {
  let logData = req.body;
  res.send(logData);
  try {
    // Save logs in the database
    await PostLogs(logData); //

    res.status(200);
  } catch (error) {
    console.error("Error saving logs:", error);
    res.status(500);
  }
});

export const logsRouter = router;
