const router = express.Router();
import express from "express";
import jwt from "jsonwebtoken";

import { verifyToken } from "../index.js";

import { getAllRoles } from "../helpers/roleHelper.js";

router.get("/getAllRoles", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const allRoles = await getAllRoles();
      res.send(allRoles);
      return allRoles;
    }
  });
});

export const roleRouter = router;
