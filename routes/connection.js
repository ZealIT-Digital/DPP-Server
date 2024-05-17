let router = express.Router();
import express, { response } from "express";
import jwt from "jsonwebtoken";
import { client } from "../index.js";

// Middleware function to verify JWT
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
router.get("/getAllConnection", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const allConnection = await getallConnection();
      res.send(allConnection);
      return allConnection;
    }
  });
});
const getallConnection = async () => {
  const getAllConnection = await client
    .db("DigitalProductPassport")
    .collection("ConnectionMasterData")
    .find()
    .toArray();
  return getAllConnection;
};
export const connectionRouter = router;
