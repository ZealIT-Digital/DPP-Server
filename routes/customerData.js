import express from "express";
import { getAllCustomers, getCustomerById } from "../helper.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const customerData = await getAllCustomers();
  res.send(customerData);
});

export const customerRouter = router;
