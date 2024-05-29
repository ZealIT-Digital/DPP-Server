const router = express.Router();
import express from "express";
import jwt from "jsonwebtoken";

import { addData } from "../blockChain/blockchain.js";
import { retrieveData } from "../blockChain/newretrive.js";

// router.post(`/post`, async (req, res) => {
//   let data = req.body;

//   let bcResult = await addData(data);
//   let transactionHash = bcResult.transactionHash;
//   console.log(transactionHash);
//   res.send(bcResult);
// });
router.post(`/post`, async (req, res) => {
  let data = req.body;

  try {
    let bcResult = await addData(data);
    let transactionHash = bcResult.transactionHash;
    console.log(transactionHash);

    // Assuming you have obtained the status from your blockchain
    let status = "success"; // You should replace this with the actual status

    res.send({ transactionHash, status });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get(`/retrieve/:id`, async (req, res) => {
  let { id } = req.params;

  let bcResult = await retrieveData(id);

  res.send(bcResult);
});

export const blockchainRouter = router;
