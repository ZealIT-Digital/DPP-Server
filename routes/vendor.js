import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

import {
  getAllVendors,
  getVendorById,
  postVendor,
  updateVendor,
  deleteVendor,
  vendID,
  updateCustRunningNo,
  checkVendor,
  getVendorCount,
  deleteAllVendor,
  searchVendors,
  sortVendors,
} from "../helpers/VendorHelper.js";

router.get("/getVendor/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const result = await getVendorById(id);
      res.send(result);
    }
  });
});

router.get("/getVendorCount", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const result = await getVendorCount();
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

router.post("/postVendor", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const VendorData = req.body;
      const existingVendor = await checkVendor(VendorData.email);

      if (existingVendor) {
        // User already exists
        console.log("exists");
        res
          .status(301)
          .send({ message: "User with this email already exists." });
        console.log("User with this email already exists.");
      } else {
        // Proceed with Vendor registration
        const postedVendor = await postVendor(VendorData);
        const idDetails = await vendID();
        const running = parseInt(idDetails.runningNumber) + 1;
        const { rangeStart, rangeEnd } = idDetails;

        if (running > rangeStart && running < rangeEnd) {
          updateCustRunningNo(running);
        }

        // User registered successfully
        console.log("success");
        res.send(postedVendor);
      }
    }
  });
});

router.post("/updateVendor/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let VendorData = req.body;

      const postedProductData = await updateVendor(id, VendorData);
      res.send(postedProductData);
    }
  });
});
router.delete("/deleteVendor/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const deletedVendor = await deleteVendor(id);
      res.send(deletedVendor);
    }
  });
});

router.get("/genVendId", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let idDetails = await vendID();
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

router.get("/copyVendor/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let { id } = req.params;

    let toCopy = await getVendorById(id);

    let idDetails = await vendID();
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
      let custCopy = await postVendor(toCopy);

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

router.get("/getAllVendors", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 5; // Default to limit 5 if not provided
      const skip = parseInt(req.query.skip);
      const sort = req.query.sort;
      const allVendors = await getAllVendors(limit, skip, sort);
      if (allVendors?.length < 0) {
        res.status(204);
      } else {
        res.send(allVendors);
      }
    }
  });
});

router.delete("/d-a-c", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const delet = await deleteAllVendor();
      res.send(delet);
    }
  });
});

router.get("/searchVendor", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // Get all query parameters from the request
      const searchParams = req.query;

      try {
        const result = await searchVendors(searchParams);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching Vendor data", error });
      }
    }
  });
});

router.get("/sortVendors", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const sortType = req.body.sortType;

      try {
        const result = await sortVendors(sortType);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching Vendor data", error });
      }
    }
  });
});

export const vendorRouter = router;
