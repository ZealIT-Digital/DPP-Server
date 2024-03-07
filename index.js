import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import {
  createUser,
  login,
  getAllCustomers,
  getCustomerById,
  getProductsById,
  postCustomer,
  postProduct,
  deleteCustomer,
  updateCustomer,
  getUiTemplate,
} from "./helper.js";

dotenv.config();
const app = express();
app.use(cors());
// app.use(express.json());
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

app.post("/postUser", async (req, res) => {
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

app.post("/login", async (req, res) => {
  let data = req.body;

  let emailId = data.email;
  let password = data.password;

  const loginData = await login(emailId);

  if (loginData) {
    let hashedPassword = loginData.password;

    let payload = req.params;
    let secret = process.env.TOKEN_SECRET;
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
});

app.get("/", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const allCustomers = await getAllCustomers();
      res.send(allCustomers);
    }
  });
});

app.get("/getCustomer/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const result = await getCustomerById(id);
      res.send(result);
    }
  });
});

app.get("/getProducts/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let productId = [];
      let productArray = [];
      const customerData = await getCustomerById(id);

      for (let i = 0; i < customerData.products.length; i++) {
        productId.push(customerData.products[i].productId);
      }

      for (let i = 0; i < productId.length; i++) {
        let result = await getProductsById(productId[i]);
        productArray.push(result);
      }
      res.send(productArray);
    }
  });
});

app.get("/getProduct/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, async (err, authData) => {
    let { id } = req.params;
    let result = await getProductsById(id);
    res.send(result);
  });
});

app.post("/postCustomer", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let customerData = req.body;
      const postedCustomer = await postCustomer(customerData);
      res.send(postedCustomer);
    }
  });
});

app.post("/postProduct", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, async (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      let productData = req.body;
      const postedProductData = await postProduct(productData);
      res.send(postedProductData);
    }
  });
});

app.post("/updateCustomer/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, async (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let customerData = req.body;

      const postedProductData = await updateCustomer(id, customerData);
      res.send(postedProductData);
    }
  });
});

app.delete("/deleteCustomer/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const deletedCustomer = await deleteCustomer(id);
      res.send(deletedCustomer);
    }
  });
});

app.get("/getUiTemplate/:id", async (req, res) => {
  let { id } = req.params;
  const UiTemplate = await getUiTemplate(id);
  res.send(UiTemplate);
});

app.listen(PORT, () =>
  console.log("The server has started in local host ", PORT)
);

export { client };
