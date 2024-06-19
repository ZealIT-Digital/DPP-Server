import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

import {
  getAllCustomers,
  getCustomerById,
  postCustomer,
  updateCustomer,
  deleteCustomer,
  custID,
  updateCustRunningNo,
  checkcustomer,
  getCustomerCount,
  deleteAllCustomer,
  searchCustomers,
  sortCustomers,
} from "../helpers/CustomerHelper.js";

router.get("/getCustomer/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const result = await getCustomerById(id);
      res.send(result);
    }
  });
});

router.get("/getCustomerCount", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const result = await getCustomerCount();
      res.send({ count: result });
    }
  });
});

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

router.post("/postCustomer", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const customerData = req.body;
      const existingCustomer = await checkcustomer(customerData.email);

      if (existingCustomer) {
        // User already exists
        console.log("exists");
        res
          .status(301)
          .send({ message: "User with this email already exists." });
        console.log("User with this email already exists.");
      } else {
        // Proceed with customer registration
        const postedCustomer = await postCustomer(customerData);
        const idDetails = await custID();
        const running = parseInt(idDetails.runningNumber) + 1;
        const { rangeStart, rangeEnd } = idDetails;

        if (running > rangeStart && running < rangeEnd) {
          updateCustRunningNo(running);
        }

        // User registered successfully
        console.log("success");
        res.send(postedCustomer);
      }
    }
  });
});

// router.post("/postCustomer", verifyToken, async (req, res) => {
//   try {
//     const decoded = await jwt.verify(req.token, "DPP-Shh");
//     const customerData = req.body;

//     const existingCustomer = await checkcustomer(customerData.email);

//     if (existingCustomer) {
//       // User already exists
//       console.log("exists");
//       return res
//         .status(301)
//         .json({ message: "User with this email already exists." });
//     }

//     // Proceed with customer registration
//     const postedCustomer = await postCustomer(customerData);

//     const idDetails = await custID();
//     const running = parseInt(idDetails.runningNumber) + 1;
//     const { rangeStart, rangeEnd } = idDetails;

//     if (running >= rangeStart && running <= rangeEnd) {
//       await updateCustRunningNo(running);
//     }

//     // User registered successfully
//     console.log("success");
//     res.status(200).json({ message: "User registered successfully." });
//   } catch (err) {
//     console.error(err);
//     if (err.name === "JsonWebTokenError") {
//       return res.sendStatus(403); // Forbidden
//     }
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.post("/updateCustomer/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
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
router.delete("/deleteCustomer/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const deletedCustomer = await deleteCustomer(id);
      res.send(deletedCustomer);
    }
  });
});

router.get("/genCustId", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let idDetails = await custID();
    let prefix = idDetails.prefix;
    let running = idDetails.runningNumber;
    let rangeStart = idDetails.rangeStart;
    let rangeEnd = idDetails.rangeEnd;

    let inc = parseInt(running) + 1;
    let id = prefix + "-" + inc;

    if (inc > rangeStart && inc < rangeEnd) {
      // updateCustRunningNo(inc);
      res.send({ message: id });
    } else {
      res.send({ message: "ID Range did not match" });
    }
  });
});

router.get("/copyCustomer/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let { id } = req.params;

    let toCopy = await getCustomerById(id);

    let idDetails = await custID();
    let prefix = idDetails.prefix;
    let running = idDetails.runningNumber;
    let rangeStart = idDetails.rangeStart;
    let rangeEnd = idDetails.rangeEnd;

    let inc = parseInt(running) + 1;
    let incId = prefix + "-" + inc;

    toCopy.name = `Copied-${id}`;
    toCopy.id = incId;
    toCopy.descreption = "";
    toCopy.addressL1 = "";
    toCopy.addressL2 = "";
    delete toCopy._id;
    if (inc > rangeStart && inc < rangeEnd) {
      await updateCustRunningNo(inc);
      let custCopy = await postCustomer(toCopy);

      let toSend = {
        custCopy: custCopy,
        incId: incId,
      };

      res.send(toSend);
    } else {
      res.send({ message: "ID Range did not match" });
    }
  });
});

router.get("/getAllCustomers", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 5; // Default to limit 5 if not provided
      const skip = parseInt(req.query.skip);
      const sort = req.query.sort;
      const allCustomers = await getAllCustomers(limit, skip, sort);
      res.send(allCustomers);
    }
  });
});

router.delete("/d-a-c", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const delet = await deleteAllCustomer();
      res.send(delet);
    }
  });
});

router.get("/searchCustomer", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // Get all query parameters from the request
      const searchParams = req.query;
      
      try {
        const result = await searchCustomers(searchParams);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching customer data", error });
      }
    }
  });
});

router.get("/sortCustomers", verifyToken, async (req,res)=>{
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    
    if (err) {
      res.sendStatus(403);
    } else {
     
      const sortType = req.body.sortType;
      
      try {
        const result = await sortCustomers(sortType);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching customer data", error });
      }
    } 
  });
});


export const customerRouter = router;
