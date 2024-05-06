import express, { response } from "express";
import bcrypt from "bcrypt";
import { login } from "../helpers/UserHelper.js";
import jwt from "jsonwebtoken";
import { userid } from "../helper.js";
import { createUser } from "../helper.js";
import { client } from "../index.js";
let router = express.Router();

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
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        email: loginData.email,
        password: loginData.password,
        passwordStatus: result,
        role: loginData.role,
        token: signature,
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
router.post("/postUser", async (req, res) => {
  let userData = req.body;
  let userPassword = userData.password;
  let saltRounds = 10;
  let uid = await genUserId();

  const postedUser = bcrypt.hash(
    userPassword,
    saltRounds,

    async function (err, hash) {
      let hashedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hash,
        role: "user",
        id: uid,
        History: {},
      };
      await createUser(hashedData);
    }
  );

  res.send(postedUser);
});
export const entryRouter = router;
