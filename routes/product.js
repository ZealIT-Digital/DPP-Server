import express from "express";
import jwt from "jsonwebtoken";
import { promises as fsPromises } from "fs";
import path from "path";

import {
  getAllProducts,
  getProductsById,
  getUiMasterTemplatebyCategory,
  postProduct,
  updateProductHeader,
  templateID,
  updateProduct,
  deleteProduct,
  prodID,
  updateProdRunningNo,
  getUiTemplate,
  getAllProductCategory,
  postUiTemplate,
  updateTempRunningNo,
  prodCatId,
  addProductCategory,
  updateProdCatRunningNo,
  deleteProductCategory,
  deleteCategories,
  postSerials,
  deleteAllProduct,
  getProductCount,
  SerialCheck,
} from "../helpers/ProductHelper.js";

import { updateUi } from "../helpers/UiHelper.js";

import { getCustomerById } from "../helpers/CustomerHelper.js";

let router = express.Router();
router.get("/getAllProducts", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      console.log({ datas: req.query });
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 5; // Default to limit 5 if not provided
      const skip = parseInt(req.query.skip) || 20;
      const sort = req.query.sort;
      const allProducts = await getAllProducts(limit, skip, sort);
      res.send(allProducts);
    }
  });
});
router.get("/getAllProductCategory", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let categories = await getAllProductCategory();

    res.send(categories);
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
router.get("/getProducts/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let productId = [];
      let productArray = [];
      const customerData = await getCustomerById(id);

      for (let i = 0; i < customerData.products.length; i++) {
        productId.push(customerData.products[i].id);
      }

      for (let i = 0; i < productId.length; i++) {
        let result = await getProductsById(productId[i]);
        productArray.push(result);
      }
      res.send(productArray);
    }
  });
});
router.get("/productUiTemplate/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let prodDetails = await getProductsById(id);

      let tempId = prodDetails.templateId;

      let templateDetails = await getUiTemplate(tempId);
      res.send(templateDetails);
    }
  });
});

router.get("/getProduct/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let { id } = req.params;
    let result = await getProductsById(id);
    res.send(result);
  });
});

router.post("/postProduct", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      let prodData = req.body;
      let prodCat = prodData.category;
      let uiData = await getUiMasterTemplatebyCategory(prodCat);
      delete uiData?._id;

      let idDetails = await templateID();
      let prefix = idDetails.prefix;
      let running = idDetails.runningNumber;
      let rangeStart = idDetails.rangeStart;
      let rangeEnd = idDetails.rangeEnd;

      let inc = parseInt(running) + 1;
      let tempId = prefix + "-" + inc;

      delete uiData?.templateCategory;

      if (uiData) {
        uiData.templateId = tempId;
        prodData.templateId = tempId;
      }

      if (inc > rangeStart && inc < rangeEnd) {
        const postedTemplate = await postUiTemplate(uiData);
        await updateTempRunningNo(inc);

        const postedProductData = await postProduct(prodData);
        console.log(postedProductData);
        res.send(postedProductData);
      } else {
        res.send({ message: "ID Range did not match" });
      }
      console.log(uiData);
    }
  });
});

router.post("/updateProductHeader/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      let productData = req.body;
      const postedProductData = await updateProductHeader(productData);
      console.log(postedProductData);
      res.send(postedProductData);
    }
  });
});
router.delete("/deleteProduct/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      const deletedProduct = await deleteProduct(id);
      res.send(deletedProduct);
    }
  });
});
router.get("/getProductDetailsUI/:id", async (req, res) => {
  let { id } = req.params;

  let prodData = await getProductsById(id);

  if (prodData.templateId) {
    let tempId = prodData.templateId;
    let templateData = await getUiTemplate(tempId);
    res.send(templateData);
  }
});
router.post("/postProductDetailsUI/:id", async (req, res) => {
  let { id } = req.params;
  let data = req.body;

  let prodData = await getProductsById(id);

  let templateId = prodData.templateId;
  data.templateId = templateId;

  let updatedUI = await updateUi(templateId, data);

  res.send(updatedUI);
});
router.get("/copyProd/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let { id } = req.params;

    let toCopy = await getProductsById(id);
    let prodCat = toCopy.category;

    let uiData = await getUiMasterTemplatebyCategory(prodCat);

    let prodIdDetails = await prodID();
    let prodPrefix = prodIdDetails.prefix;
    let prodRunning = prodIdDetails.runningNumber;
    let prodRangeStart = prodIdDetails.rangeStart;
    let prodRangeEnd = prodIdDetails.rangeEnd;

    let prodInc = parseInt(prodRunning) + 1;
    let prodIncId = prodPrefix + "-" + prodInc;

    let templateIdDetails = await templateID();
    let templatePrefix = templateIdDetails.prefix;
    let templateRunning = templateIdDetails.runningNumber;
    let templateRangeStart = templateIdDetails.rangeStart;
    let templateRangeEnd = templateIdDetails.rangeEnd;

    let templateInc = parseInt(templateRunning) + 1;
    let templateIncId = templatePrefix + "-" + templateInc;

    delete uiData?._id;
    delete toCopy?._id;
    delete uiData.templateCategory;

    toCopy.id = prodIncId;
    toCopy.templateId = templateIncId;

    uiData.templateId = templateIncId;

    if (
      prodInc > prodRangeStart &&
      prodInc < prodRangeEnd &&
      templateInc > templateRangeStart &&
      templateInc < templateRangeEnd
    ) {
      await updateProdRunningNo(prodInc);
      await updateTempRunningNo(templateInc);

      let prodCopy = await postProduct(toCopy);
      let postUiCopy = await postUiTemplate(uiData);
      let tosend = {
        prodCopy: prodCopy,
        prodIncId: prodIncId,
      };
      res.send(tosend);
    } else {
      res.send({ message: "ID Range did not match" });
    }
  });
});

router.post("/postSerials/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    let { id } = req.params;
    let data = req.body;
    console.log({ jsonddatafoserial: req.body });

    // Ensure data is an array
    if (!Array.isArray(data)) {
      data = [data];
    }

    try {
      // Process serials asynchronously
      const pushedSerials = await Promise.all(
        data.map(async (serial) => {
          return await postSerials(serial, id);
        })
      );

      console.log(pushedSerials);
      res.send(pushedSerials);
    } catch (error) {
      console.error("Error processing serials:", error);
      res.sendStatus(500);
    }
  });
});
router.get("/checkDuplicateSerialkey", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const serialkey = req.body;
      const check = SerialCheck(serialkey);
      if (check == true) {
        console.log("errr... Serial Already Exists");
        res.send(true);
      }
    }
  });
});
router.post("/postProductCategory", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let prodCatDetails = req.body;

      let allCategory = await getAllProductCategory();
      let exist = false;

      for (let i = 0; i < allCategory.length; i++) {
        if (allCategory[i].label == prodCatDetails.label) {
          exist = true;
          break;
        }
      }

      if (!exist) {
        let prodCatID = await prodCatId();
        let prodCatPrefix = prodCatID.prefix;
        let prodCatRunning = prodCatID.runningNumber;
        let prodCatIDRangeStart = prodCatID.rangeStart;
        let prodCatIDRangeEnd = prodCatID.rangeEnd;

        let prodCatIDInc = parseInt(prodCatRunning) + 1;
        let prodCatIncID = prodCatPrefix + "-" + prodCatIDInc;

        prodCatDetails.id = prodCatIncID;

        if (
          prodCatIDInc > prodCatIDRangeStart &&
          prodCatIDInc < prodCatIDRangeEnd
        ) {
          await updateProdCatRunningNo(prodCatIDInc);

          let newProdCat = await addProductCategory(prodCatDetails);

          res.send(newProdCat);
        } else {
          res.send({ message: "ID Range did not match" });
        }
      } else {
        res.send({ message: "Category already exists" });
      }
    }
  });
});

router.get("/getProductCount", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const result = await getProductCount();
      console.log(result);
      res.send({ count: result });
    }
  });
});

router.get("/genProdId", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    let idDetails = await prodID();
    let prefix = idDetails.prefix;
    let running = idDetails.runningNumber;
    let rangeStart = idDetails.rangeStart;
    let rangeEnd = idDetails.rangeEnd;

    let inc = parseInt(running) + 1;
    let id = prefix + "-" + inc;

    if (inc > rangeStart && inc < rangeEnd) {
      updateProdRunningNo(inc);

      res.send({ message: id });
    } else {
      res.send({ message: "ID Range did not match" });
    }
  });
});

router.delete("/deleteProductCategory", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let data = req.body;
      let toDelete = data.toDelete;

      let response = deleteCategories(toDelete);

      res.send(response);
    }
  });
});

router.delete("/d-a-p", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const delet = await deleteAllProduct();
      res.send(delet);
    }
  });
});

export const productRouter = router;
