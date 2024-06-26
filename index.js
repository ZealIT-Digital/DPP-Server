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
import { EntityRouter } from "./routes/entity.js";
import { uiRouter } from "./routes/ui.js";
import { connectionRouter } from "./routes/connection.js";
import { componentRouter } from "./routes/components.js";
import { roleRouter } from "./routes/roles.js";
import { logsRouter } from "./routes/logs.js";
import { blockchainRouter } from "./routes/blockchain.js";
import { vendorRouter } from "./routes/vendor.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://dpp-client-dev.vercel.app",
  "https://dpp-server-app.azurewebsites.net",
  "https://devdpp.vercel.app",
  "http://localhost:3000",
];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (e.g., mobile apps, curl requests)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: [
//     "X-CSRF-Token",
//     "X-Requested-With",
//     "Accept",
//     "Accept-Version",
//     "Content-Length",
//     "Content-MD5",
//     "Content-Type",
//     "Date",
//     "X-Api-Version",
//   ],
//   credentials: true,
// };

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

const verifyRole = (roles) => async (req, res, next) => {
  let id = req.body;

  const employee = await genUserId(id);

  !roles.includes(employee.role)
    ? res.status(401).json("Sorry you do not have access to this route")
    : next();
};

app.use("/entry", entryRouter);
app.use("/product", productRouter);
app.use("/entity", EntityRouter);
app.use("/vendor", vendorRouter);
app.use("/ui", uiRouter);
app.use("/connection", connectionRouter);
app.use("/components", componentRouter);
app.use("/roles", roleRouter);
app.use("/logs", logsRouter);
app.use("/blockchain", blockchainRouter);

app.get("/routVerification", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.status(403).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () =>
  console.log("The server has started in local host ", PORT)
);

export { client, verifyToken };
