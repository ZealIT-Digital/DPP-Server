import express from "express";
import jwt from "jsonwebtoken";
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
} from "../helpers/ProductHelper.js";

let router = express.Router();
router.get("/getAllProducts", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const allProducts = await getAllProducts();
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
      delete uiData._id;

      let idDetails = await templateID();
      let prefix = idDetails.prefix;
      let running = idDetails.runningNumber;
      let rangeStart = idDetails.rangeStart;
      let rangeEnd = idDetails.rangeEnd;

      let inc = parseInt(running) + 1;
      let tempId = prefix + "-" + inc;

      delete uiData.templateCategory;

      uiData.templateId = tempId;
      prodData.templateId = tempId;

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

    delete uiData._id;
    delete toCopy._id;
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
      res.send(prodCopy);
    } else {
      res.send({ message: "ID Range did not match" });
    }
  });
});

router.post("/postProductCategory", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let prodCatDetails = req.body;
      console.log(prodCatDetails);
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
    }
  });
});

router.delete("/deleteProductCategory/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, "DPP-Shh", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let { id } = req.params;
      console.log(id);
      let response = deleteProductCategory(id);
      res.send(response);
    }
  });
});

export const productRouter = router;
