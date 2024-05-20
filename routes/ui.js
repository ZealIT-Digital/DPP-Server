import express from "express";
let router = express.Router();
import {
  getUiTemplate,
  getUiMasterTemplatebyCategory,
  getAllUiId,
  postUiTemplate,
  updateUi,
  templateID,
  updateTempRunningNo,
  deleteMasterTemplate,
  postUiMasterTemplate,
} from "../helpers/UiHelper.js";

import { updateProductCategory } from "../helpers/ProductHelper.js";
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
router.get("/getUiTemplate/:id", async (req, res) => {
  let { id } = req.params;
  const UiTemplate = await getUiTemplate(id);
  res.send(UiTemplate);
});

router.get("/getAllUiId", async (req, res) => {
  let uiIds = await getAllUiId();
  res.send(uiIds);
});

router.post("/postUiMasterTemplate", async (req, res) => {
  let data = req.body;
  let postedMasterTemplate = postUiMasterTemplate(data);
  res.send(postedMasterTemplate);
});

router.delete("/deleteMasterTemplate/:id", async (req, res) => {
  let { id } = req.params;

  let ids = id.split(":");

  let tempId = ids[0];
  let catId = ids[1];

  let deleted = await deleteMasterTemplate(tempId);

  await updateProductCategory(catId, "");

  res.send(deleted);
});

router.post("/postProductDetailsUI/:id", async (req, res) => {
  let { id } = req.params;
  let data = req.body;

  let tempID = id.split(":")[0];
  let templateId = "MASTER" + "-" + tempID.toUpperCase();
  let catId = data.categoryId;

  delete data.categoryId;

  let prodData = await getProductsById(id);

  if (prodData == null) {
    data.templateId = templateId;
    let postedMasterTemplate = await postUiMasterTemplate(data);

    let dta = await updateProductCategory(catId, templateId);
    res.send(postedMasterTemplate);
  } else {
    console.log("second");
    let templateId = prodData.templateId;
    data.templateId = templateId;

    let updatedUI = await updateUi(templateId, data);

    res.send(id);
  }
});

router.get("/getMasterTemplate/:id", async (req, res) => {
  let { id } = req.params;

  let masterTemplateData = await getUiMasterTemplate(id);

  res.send(masterTemplateData);
});

router.get("/getAllUiId", async (req, res) => {
  let uiIds = await getAllUiId();
  res.send(uiIds);
});

export const uiRouter = router;
