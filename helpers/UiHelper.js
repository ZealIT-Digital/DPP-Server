import { client } from "../index.js";
async function getUiTemplate(id) {
    const UiTemplate = await client
      .db("DigitalProductPassport")
      .collection("UiTemplateMaster")
      .findOne({ templateId: id });
  
    return UiTemplate;
  }
  
  async function PostLogs(logs) {
    const PostedLogs = await client
      .db("DigitalProductPassport")
      .collection("CustomerLogMaster")
      .insertOne(logs);
    return PostLogs;
  }
  async function getAllLogs(){
    const allLogs = await client
    .db('DigitalProductPassport')
    .collection("CustomerLogMaster")
    .find()
    .toArray();
    return allLogs
  }
  async function getUiMasterTemplatebyCategory(category) {
    const UiTemplate = await client
      .db("DigitalProductPassport")
      .collection("UiTemplateMaster")
      .findOne({ templateCategory: category });
  
    return UiTemplate;
  }
  
  async function getAllUiId() {
    const UiTemplate = await client
      .db("DigitalProductPassport")
      .collection("UiTemplateMaster")
      .find({})
      .project({ templateId: 1 })
      .toArray();
  
    return UiTemplate;
  }
  
  async function postUiTemplate(data) {
    const UiTemplate = await client
      .db("DigitalProductPassport")
      .collection("UiTemplateMaster")
      .insertOne(data);
    return UiTemplate;
  }
  
  async function updateUi(tempId, data) {
    const postedUIData = await client
      .db("DigitalProductPassport")
      .collection("UiTemplateMaster")
      .replaceOne({ templateId: tempId }, data);
  
    return postedUIData;
  }
  async function templateID() {
    const productDetail = await client
      .db("DigitalProductPassport")
      .collection("NumberRangeMasterData")
      .findOne({ idType: "Template" });
    return productDetail;
  }
  async function updateTempRunningNo(num) {
    let filter = { idType: "Template" };
    let update = {
      $set: {
        runningNumber: num,
      },
    };
    const updatedDetails = await client
      .db("DigitalProductPassport")
      .collection("NumberRangeMasterData")
      .updateOne(filter, update);
    return updatedDetails;
  }
  export{
    getUiTemplate,
    getUiMasterTemplatebyCategory,
    getAllUiId,
    postUiTemplate,
    PostLogs,
    getAllLogs,
    updateUi,
    templateID,
    updateTempRunningNo
  };