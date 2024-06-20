let router = express.Router();
import express, { response } from "express";
import jwt from "jsonwebtoken";
import {
  getallConnection,
  postConnectionHeader,
  postConnectionParams,
  connectionCategoryID,
  updateConnectionCategoryRunningNo,
  deleteConnectionCategory,
  connectionID,
  updateConnectionRunningNo,
  deleteConnection,
  encrypt,
  decrypt,
  postEncConnections,
} from "../helpers/connectionHelper.js";

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

router.post("/postConnectionHeader", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let data = req.body;

      let idDetails = await connectionCategoryID();
      let prefix = idDetails.prefix;
      let running = idDetails.runningNumber;
      let rangeStart = idDetails.rangeStart;
      let rangeEnd = idDetails.rangeEnd;

      let inc = parseInt(running) + 1;
      let id = prefix + "-" + inc;

      if (inc > rangeStart && inc < rangeEnd) {
        updateConnectionCategoryRunningNo(inc);

        data.id = id;

        const postedConnection = await postConnectionHeader(data);

        res.send(postedConnection);
      } else {
        res.send({ message: "ID Range did not match" });
      }
    }
  });
});

router.put("/postConnectionParams/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let data = req.body;

      let dataCopy = JSON.parse(JSON.stringify(data));

      delete dataCopy.ConnectionType;
      delete dataCopy.Description;
      let encry = encrypt(dataCopy.toString());

      let idDetails = await connectionID();
      let prefix = idDetails.prefix;
      let running = idDetails.runningNumber;
      let rangeStart = idDetails.rangeStart;
      let rangeEnd = idDetails.rangeEnd;

      let inc = parseInt(running) + 1;
      let conId = prefix + "-" + inc;

      if (inc > rangeStart && inc < rangeEnd) {
        updateConnectionRunningNo(inc);

        data.uid = conId;
        console.log({ dta: data });
        const connectionParam = await postConnectionParams(id, data);

        let sd = {
          connectionCategory: id,
          connectionId: conId,
          connectionParams: {
            iv: encry.iv,
            encryptedPassword: encry.encryptedPassword,
          },
        };

        const postSecret = await postEncConnections(sd);

        res.send({ secretKey: encry.secretKey });
      } else {
        res.send({ message: "ID Range did not match" });
      }
    }
  });
});

router.post("/encrypt", async (req, res) => {
  const { password, secretKey } = req.body;

  if (!password) {
    return res.status(400).send("Password is required");
  }

  const encrypted = encrypt(password);
  res.json(encrypted);
});

router.post("/decrypt", async (req, res) => {
  const { encryptedPassword, iv, secretKey } = req.body;

  if (!encryptedPassword || !iv) {
    return res.status(400).send("Encrypted password and IV are required");
  }

  const decryptedPassword = decrypt(encryptedPassword, iv, secretKey);
  res.json({ decryptedPassword });
});

router.delete(
  "/deleteConnectionCategory/:id",
  verifyToken,
  async (req, res) => {
    jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        let { id } = req.params;

        const deletedConnection = await deleteConnectionCategory(id);

        res.send(deletedConnection);
      }
    });
  }
);

router.put("/deleteConnection/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let toDelete = req.body;

      const deleted = toDelete.map(async (del) => {
        await deleteConnection(id, del);
      });
      res.send(deleted);
    }
  });
});

export const connectionRouter = router;
