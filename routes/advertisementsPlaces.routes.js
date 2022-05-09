const router = require("express").Router();

const PlaceController = require("../controllers/advertisementsPlaces.controller");

//places
router.post("/ads/place/create", PlaceController.createPlace);
router.get("/ads/place/list", PlaceController.fetchPlaceList);
router.get("/ads/place/:id", PlaceController.fetchPlaceById);
router.put("/ads/place/update/:id", PlaceController.updatePlaceById);
router.delete("/ads/place/delete/:id", PlaceController.deletePlaceById);

module.exports = router;