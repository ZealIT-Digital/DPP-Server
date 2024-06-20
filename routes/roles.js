const router = express.Router();
import express from "express";
import jwt from "jsonwebtoken";

import { verifyToken } from "../index.js";

import { getAllRoles, updateRole } from "../helpers/roleHelper.js";

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

router.post("/updateRole", async (req, res) => {
  try {
    let userData = req.body;
    let jsonData = {
      allowed: userData.allowed,
      roles: userData.Roles,
    };

    await updateRole(jsonData);

    res.send({ success: true, message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({
      success: false,
      error: "An error occurred while updating user.",
    });
  }
});

export const roleRouter = router;
