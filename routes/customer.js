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

// router.post("/postCustomer", verifyToken, async (req, res) => {
//   jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       let customerData = req.body;
//       const allCustomers = await getAllCustomers();

//       let customerExist = false;

//       let dbCustomerAddress =
//         customerData.addressL1 +
//         customerData.addressL2 +
//         customerData.state +
//         customerData.city +
//         customerData.country;

//       for (let i = 0; i < allCustomers.length; i++) {
//         let customerAddress =
//           allCustomers[i].addressL1 +
//           allCustomers[i].addressL2 +
//           allCustomers[i].state +
//           allCustomers[i].city +
//           allCustomers[i].country;
//         allCustomers[i].phoneNo;
//         allCustomers[i].email;
//         if (
//           allCustomers[i].id == customerData.id ||
//           allCustomers[i].name == customerData.name ||
//           // allCustomers[i].logoUrl == customerData.logoUrl ||
//           customerAddress == dbCustomerAddress
//         ) {
//           customerExist = true;
//           console.log(allCustomers[i]);
//           break;
//         } else {
//           null;
//         }
//       }

//       if (customerExist == false) {
//         const postedCustomer = await postCustomer(customerData);

//         let idDetails = await custID();
//         let running = idDetails.runningNumber;
//         let rangeStart = idDetails.rangeStart;
//         let rangeEnd = idDetails.rangeEnd;

//         let inc = parseInt(running) + 1;

//         if (inc > rangeStart && inc < rangeEnd) {
//           updateCustRunningNo(inc);
//         }
//         res.send(postedCustomer);
//       } else {
//         res.send({ message: "This Customer Data Already Exist" });
//       }
//     }
//   });
// });
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
        res.status(200).send({ message: "User registered successfully." });
      }
    }
  });
});
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
    console.log({ incId: "incId" });
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
      const skip = parseInt(req.query.skip) || 20;
      const sort = req.query.sort;
      const allCustomers = await getAllCustomers(page, limit, skip, sort);
      res.send(allCustomers);
    }
  });
});

export const customerRouter = router;
