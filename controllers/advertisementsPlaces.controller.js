const mongoose = require('mongoose');
const AdvertisementsPlacesSchema = require("../models/advertisementsPlaces.model");

  //Create Advertisement Place
exports.createPlace = async (req, res) => {
  try {
    let placeName = req.body.name;
    let maxAddCount = req.body.max_Add_Count;
    if(placeName === undefined || placeName === null || (placeName.trim().length === 0)){
      return res.status(400).json({ success: false, message: "Must enter your place name" });
    } else{
      let insertdata = {
        name : placeName
        // max_Add_Count : req.body.max_Add_Count
      }
      if(maxAddCount === 0 || maxAddCount === null || maxAddCount === undefined || (maxAddCount.trim().length === 0)){ 
        console.log("max_Add_Count can't be null or 0!");
        insertdata.max_Add_Count = "1"
      } else {insertdata.max_Add_Count = maxAddCount}
      const createPlace = new AdvertisementsPlacesSchema(insertdata);
      const newPlace = await createPlace.save();
      return res.status(201).json({ success: true, message: "Created successfully", data: newPlace });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error"});
  }
}

  //Fetch or Get Advertisement Place List
exports.fetchPlaceList = async (req, res) => {
  try {
    var mysort = { name: 1 };
    const PlaceList = await AdvertisementsPlacesSchema.find().sort(mysort);
    if(PlaceList.length != 0){
      return res.status(200).json({ success: true, message: "Data Found", data: PlaceList })
    } else {return res.status(204).json({ success: false, message: "No Content"})}
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error"});
  }
}

//Fetch or Get Advertisement Place By ID
exports.fetchPlaceById = async (req, res) => {
  try {
    const _id = req.params.id;
    const fetchPlace = await AdvertisementsPlacesSchema.findById({ _id: _id });
    if (!fetchPlace) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    } else {
      return res.status(200).json({ success: true, message: "Data Found", data: fetchPlace });
    }
  } catch (error) {
    // return res.status(500).json({ success: false, message: "Internal Server Error"});
    return res.status(404).json({ success: false, message: "Data Not Found" });
  }
}

//Update Advertisement Place By ID
exports.updatePlaceById = async (req, res) => {
  try {
    let insertdata = {};
    let placeName = req.body.name;
    let maxAddCount = req.body.max_Add_Count;
    const _id = req.params.id;
    const fetchPlace = await AdvertisementsPlacesSchema.findById({ _id: _id });
    if (!fetchPlace) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    } else {
      if(placeName != undefined || maxAddCount != undefined){
        if(placeName != undefined){
          if(placeName != null && (placeName.trim().length != 0)){
            insertdata.name = placeName;
          }else {return res.status(400).json({ success: false, message: "place name can't be empty" })}
        }
        if(maxAddCount != undefined) {
          if(maxAddCount != null && maxAddCount > 0){
            insertdata.max_Add_Count = maxAddCount;
          }else{return res.status(400).json({ success: false, message: "add count can't be empty or 0!" })}
        }     
        const updatePlace = await AdvertisementsPlacesSchema.findByIdAndUpdate(_id, insertdata, {new: true});
        return res.status(201).json({ success: true, message: "Updated Successfully" });
      }else {return res.status(400).json({ success: false, message: "Enter data, what you want to update!" })}        
    }
  } catch (error) {
    // return res.status(500).json({ success: false, message: "Internal Server Error"});
    return res.status(404).json({ success: false, message: "Data Not Found" });
  }
}

//Delete Advertisement Place By ID
exports.deletePlaceById = async (req, res) => {
  try {
    const _id = req.params.id;
    const fetchPlace = await AdvertisementsPlacesSchema.findById({ _id: _id });
    if (!fetchPlace) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    } else {
      const deletePlace = await AdvertisementsPlacesSchema.findByIdAndDelete(_id);
      return res.status(200).json({ success: true, message: "Deleted Successfully" });
    }
  } catch (error) {
    // return res.status(500).json({ success: false, message: "Internal Server Error"});
    return res.status(404).json({ success: false, message: "Data Not Found" });
  }
}
