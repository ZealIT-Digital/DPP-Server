const router = express.Router();
import express from "express";
import jwt from "jsonwebtoken";

import { verifyToken } from "../index.js";

import { getAllComponents } from "../helpers/componentHelper.js";

router.get("/getAllComponents", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const allIdentity = await getAllComponents();
      res.send(allIdentity);
    }
  });
});

export const componentRouter = router;
