import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

import { verifyToken } from "../index.js";

import { getAllLogs, PostLogs } from "../helpers/logsHelper.js";

router.get("/getAllLogs", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const allLogs = await getAllLogs();
      res.send(allLogs);
    }
  });
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
