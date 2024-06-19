import express, { response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userid } from "../helper.js";
import { createUser } from "../helper.js";
import { client } from "../index.js";

import {
  login,
  getUserData,
  updateUser,
  postHistory,
} from "../helpers/UserHelper.js";

let router = express.Router();

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

router.post("/login", async (req, res) => {
  let data = req.body;

  let emailId = data.email;
  let password = data.password;

  const loginData = await login(emailId);

  if (loginData) {
    let hashedPassword = loginData.password;

    let payload = req.params;
    // let secret = process.env.TOKEN_SECRET;
    let secret = "DPP-Shh";
    let signature = jwt.sign(payload, secret, { expiresIn: "10h" });

    bcrypt.compare(password, hashedPassword, function (err, result) {
      let accumulatedData = {
        id: loginData.id,
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        email: loginData.email,
        password: loginData.password,
        passwordStatus: result,
        role: loginData.role,
        token: signature,
        dp: loginData.dp,
      };
      res.send(accumulatedData);
    });
  } else {
    res.send("No User Found");
  }
});

async function genUserId() {
  let idDetails = await userid();
  let running = idDetails.runningNumber;
  let rangeStart = idDetails.rangeStart;
  let rangeEnd = idDetails.rangeEnd;
  let prefix = idDetails.prefix;

  let inc = parseInt(running) + 1;
  let newId = prefix + "-" + inc;
  if (inc > rangeStart && inc < rangeEnd) {
    let res = await updateusrRunningNo(inc);
    return newId;
  }
}

async function updateusrRunningNo(num) {
  let filter = { idType: "User" };
  let update = {
    $set: {
      runningNumber: num,
    },
  };
  const updatedDetails = await client
    .db("DigitalProductPassport")
    .collection("NumberRangeMasterData")
    .updateOne(filter, update);
  return updatedDetails;
}
router.get("/getAllUsers", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const allUsers = await getallUsers();
      res.send(allUsers);
      return allUsers;
    }
  });
});
const getallUsers = async () => {
  const allRoles = await client
    .db("DigitalProductPassport")
    .collection("UserMasterData")
    .find()
    .toArray();
  return allRoles;
};

router.post("/getUserData", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let { email } = req.body;
    let userData = await getUserData(email);
    res.send(userData);
  });
});

router.post("/postUser", async (req, res) => {
  try {
    const userData = req.body;
    const userPassword = userData.password;
    const saltRounds = 10;
    const uid = await genUserId();

    function test() {
      return userData.role || "user";
    }

    // Check if the email already exists in the database
    const existingUser = await getUserData(userData.email);
    if (existingUser) {
      console.log("exits");
      return res
        .status(408)
        .send({ success: false, message: "Email already registered." });
    }

    bcrypt.hash(userPassword, saltRounds, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .send({ success: false, message: "Error hashing password." });
      }

      const hashedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        countryCode: userData.countryCode,
        phoneNo: userData.phoneNo,
        password: hash,
        role: test(),
        id: uid,
        History: {},
      };

      await createUser(hashedData);
      res.status(200);
      res.send({ success: true, message: "User saved successfully." });
    });
  } catch (error) {
    console.error("User with this email Already Exists!:", error);
  }
});

router.post("/updateUser", async (req, res) => {
  try {
    let userData = req.body;
    let jsonData = {
      allowed: userData.allowed,
      roles: userData.Roles,
    };

    await updateUser(jsonData);

    res.send({ success: true, message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({
      success: false,
      error: "An error occurred while updating user.",
    });
  }
});

router.post("/postHistory", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let history = req.body;

    let savedHistory = await postHistory(history);

    console.log(savedHistory);
  });
});

export const entryRouter = router;
