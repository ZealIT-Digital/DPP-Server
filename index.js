import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
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
} from "./helper.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 9000;

let mongoURL = process.env.MONGO_URL;

export async function createConnection() {
  const client = new MongoClient(mongoURL);
  await client.connect();
  console.log("Mongo DB is connected.");
  return client;
}
createConnection();
const client = await createConnection();

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

app.get("/login/:email/:password", async (req, res) => {
  let emailId = req.params.email;
  let password = req.params.password;

  const loginData = await login(emailId);
  if (loginData) {
    let hashedPassword = loginData.password;

    bcrypt.compare(password, hashedPassword, function (err, result) {
      let accumulatedData = {
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        email: loginData.email,
        password: loginData.password,
        passwordStatus: result,
        role: loginData.role,
      };
      res.send(accumulatedData);
    });
  }
});

app.get("/", async (req, res) => {
  const allCustomers = await getAllCustomers();
  res.send(allCustomers);
});

app.get("/getCustomer/:id", async (req, res) => {
  let { id } = req.params;
  const result = await getCustomerById(id);
  res.send(result);
});

app.get("/getProducts/:id", async (req, res) => {
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
});

app.post("/postCustomer", async (req, res) => {
  let customerData = req.body;
  const postedCustomer = await postCustomer(customerData);
  res.send(postedCustomer);
});

app.post("/postProduct", async (req, res) => {
  let productData = req.body;
  const postedProductData = await postProduct(productData);
  res.send(postedProductData);
});

app.post("/updateCustomer/:id", async (req, res) => {
  let { id } = req.params;
  let customerData = req.body;
  const postedProductData = await updateCustomer(id, customerData);
  res.send(postedProductData);
});

app.delete("/deleteCustomer/:id", async (req, res) => {
  let { id } = req.params;
  const deletedCustomer = await deleteCustomer(id);
  res.send(deletedCustomer);
});

app.listen(PORT, () =>
  console.log("The server has started in local host ", PORT)
);

export { client };
