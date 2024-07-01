import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

import {
  getAllEntitys,
  getEntityById,
  postEntity,
  updateEntity,
  deleteEntity,
  custID,
  updateCustRunningNo,
  checkEntity,
  getEntityCount,
  deleteAllEntity,
  searchEntitys,
  sortEntitys,
} from "../helpers/EntityHelper.js";

router.get("/getEntity/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const result = await getEntityById(id);
      console.log(id);
      res.send(result);
    }
  });
});

router.get("/getEntityCount", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const result = await getEntityCount();
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

router.post("/postEntity", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const EntityData = req.body;
      const existingEntity = await checkEntity(EntityData.email);

      if (existingEntity) {
        // User already exists
        console.log("exists");
        res
          .status(301)
          .send({ message: "User with this email already exists." });
        console.log("User with this email already exists.");
      } else {
        // Proceed with entity registration
        const postedEntity = await postEntity(EntityData);
        const idDetails = await custID();
        const running = parseInt(idDetails.runningNumber) + 1;
        const { rangeStart, rangeEnd } = idDetails;

        if (running > rangeStart && running < rangeEnd) {
          updateCustRunningNo(running);
        }

        // User registered successfully
        console.log("success");
        res.send(postedEntity);
      }
    }
  });
});

// router.post("/postEntity", verifyToken, async (req, res) => {
//   try {
//     const decoded = await jwt.verify(req.token, "DPP-Shh");
//     const EntityData = req.body;

//     const existingEntity = await checkEntity(EntityData.email);

//     if (existingEntity) {
//       // User already exists
//       console.log("exists");
//       return res
//         .status(301)
//         .json({ message: "User with this email already exists." });
//     }

//     // Proceed with entity registration
//     const postedEntity = await postEntity(EntityData);

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

router.post("/updateEntity/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let EntityData = req.body;

      console.log(EntityData);

      const postedProductData = await updateEntity(id, EntityData);
      if (postedProductData.status === 301) {
        res.status(301).send({ message: postedProductData.message });
      } else {
        res.send(postedProductData);
      }
    }
  });
});
router.delete("/deleteEntity/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const deletedEntity = await deleteEntity(id);
      res.send(deletedEntity);
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

router.get("/copyEntity/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let { id } = req.params;

    let toCopy = await getEntityById(id);

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
      let custCopy = await postEntity(toCopy);

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

router.get("/getAllEntitys", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 5; // Default to limit 5 if not provided
      const skip = parseInt(req.query.skip);
      const sort = req.query.sort;
      const allEntitys = await getAllEntitys(limit, skip, sort);
      if (allEntitys?.length < 0) {
        res.status(204);
      } else {
        res.send(allEntitys);
      }
    }
  });
});

router.delete("/d-a-c", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const delet = await deleteAllEntity();
      res.send(delet);
    }
  });
});

router.get("/searchEntity", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // Get all query parameters from the request
      const searchParams = req.query;

      try {
        const result = await searchEntitys(searchParams);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching entity data", error });
      }
    }
  });
});

router.get("/sortEntitys", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const sortType = req.body.sortType;

      try {
        const result = await sortEntitys(sortType);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching entity data", error });
      }
    }
  });
});

export const EntityRouter = router;
