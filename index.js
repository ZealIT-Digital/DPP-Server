import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { createUser, login } from "./helpers/UserHelper.js";

import { addData } from "./blockChain/blockchain.js";
import { retrieveData } from "./blockChain/newretrive.js";

import { entryRouter } from "./routes/user.js";
import { productRouter } from "./routes/product.js";
import { customerRouter } from "./routes/customer.js";
import { uiRouter } from "./routes/ui.js";
import { connectionRouter } from "./routes/connection.js";
import { componentRouter } from "./routes/components.js";
import { roleRouter } from "./routes/roles.js";
import { logsRouter } from "./routes/logs.js";
import { blockchainRouter } from "./routes/blockchain.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://devdpp.vercel.app",
  "http://localhost:3000",
  "https://dpp-client-dev.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 9000;

// let mongoURL = process.env.MONGO_URL;
let mongoURL =
  "mongodb+srv://zealitdigital:ZealIT-2024@zealit.c3y2eea.mongodb.net/?retryWrites=true&w=majority";

export async function createConnection() {
  const client = new MongoClient(mongoURL);
  await client.connect();
  console.log("Mongo DB is connected.");
  return client;
}
createConnection();
const client = await createConnection();

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

app.use("/entry", entryRouter);
app.use("/product", productRouter);
app.use("/customer", customerRouter);
app.use("/ui", uiRouter);
app.use("/connection", connectionRouter);
app.use("/components", componentRouter);
app.use("/roles", roleRouter);
app.use("/logs", logsRouter);
app.use("/blockchain", blockchainRouter);

app.get("/routVerification", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () =>
  console.log("The server has started in local host ", PORT)
);

export { client, verifyToken };
