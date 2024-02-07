import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import {
  getAllCustomers,
  getCustomerById,
  getProductsById,
  postCustomer,
  postProduct,
  deleteCustomer,
} from "./helper.js";
import { customerRouter } from "./routes/customerData.js";

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

app.delete("/deleteCustomer/:id", async (req, res) => {
  let { id } = req.params;
  const deletedCustomer = await deleteCustomer(id);
  res.send(deletedCustomer);
});

app.listen(PORT, () =>
  console.log("The server has started in local host ", PORT)
);

export { client };
