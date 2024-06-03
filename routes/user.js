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
  res.setHeader("Access-Control-Allow-Origin", "https://devdpp.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        email: loginData.email,
        password: loginData.password,
        passwordStatus: result,
        role: loginData.role,
        token: signature,
        dp: loginData.dp,
      };
      console.log(accumulatedData);
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
  //        let idDetails = await userid();
  // console.log(idDetails)
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
    console.log(email);
    let userData = await getUserData(email);
    res.send(userData);
  });
});
// router.post("/postUser", async (req, res) => {
//   let userData = req.body;
//   let userPassword = userData.password;
//   let saltRounds = 10;
//   let uid = await genUserId();

//   function test() {
//     if (userData.role) {
//       return userData.role;
//     } else {
//       return "user";
//     }
//   }

//   const postedUser = bcrypt.hash(
//     userPassword,
//     saltRounds,

//     async function (err, hash) {
//       let hashedData = {
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         email: userData.email,
//         countryCode: userData.countryCode,
//         phoneNo: userData.phoneNo,
//         password: hash,
//         role: test(),
//         id: uid,
//         History: {},
//       };

//       await createUser(hashedData);
//       res.send({ success: true, message: "User Saved successfully." });
//     }
//   );
// });

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

      // Save the user data to the database
      await createUser(hashedData);
      res.status(200);
      res.send({ success: true, message: "User saved successfully." });
      // console.log("success");
    });
  } catch (error) {
    console.error("User with this email Already Exists!:", error);
    console.log("failed");
  }
});

// Update the route handler to properly handle async/await
router.post("/updateUser", async (req, res) => {
  try {
    let userData = req.body;
    let jsonData = {
      allowed: userData.allowed,
      roles: userData.Roles,
    };

    // Call the updateUser function and wait for it to finish
    await updateUser(jsonData);

    // Send a success response
    res.send({ success: true, message: "User updated successfully." });
  } catch (error) {
    // If an error occurs, send an error response
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
