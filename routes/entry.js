import express from "express";
import bcrypt from "bcrypt";
import { login } from "../helpers/UserHelper.js";
import jwt from "jsonwebtoken";
let router = express.Router()

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
        console.log(accumulatedData);
      });
    } else {
      res.send("No User Found");
    }
})
router.post("postUser",async(req,res)=>{
  let userData = req.body;
  let hashtest = "hello";
  let userPassword = userData.password;
  let saltRounds = 10;
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
      };
      await createUser(hashedData);
    }
  );

  res.send(postedUser);
});
export const entryRouter = router