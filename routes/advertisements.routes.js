const router = require("express").Router();
const AdvertisementController = require("../controllers/advertisements.controller");
const { advertisementCreateValidation, advertisementUpdateValidation } = require('../valiadation/advertisement.validation');
const { uploadFiles } = require('../middleware/upload');
const { updateUploadFiles } = require('../middleware/upload.update');
//Advertisements_Portal
// router.post("/ads/createAdvertise",upload.fields([{
//   name: 'images', maxCount: 10
// }, {
//   name: 'videos', maxCount: 10
// }]) ,AdvertisementsController.createAdvertise);

//Higher Order Function
// const use = fn => (req, res, next) =>
// Promise.resolve(fn(req, res, next)).catch(next);

router.post("/ads/create", advertisementCreateValidation, uploadFiles, AdvertisementController.createAdvertisement);
router.get("/ads/list", AdvertisementController.fetchAdvertisementList);
router.get("/ads/:id", AdvertisementController.fetchAdvertisementById);
// router.put("/ads/update/:id", updateUploadFiles, AdvertisementController.updateAdvertisementById);
router.put("/ads/update/:id", advertisementUpdateValidation, updateUploadFiles, AdvertisementController.updateAdvertisementById);
router.delete("/ads/delete/:id", AdvertisementController.deleteAdvertisementById);

router.get("/search/ads?", AdvertisementController.fetchAdvertisementByQuery);

module.exports = router;0