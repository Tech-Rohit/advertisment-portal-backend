const AdvertisementSchema = require("../models/advertisements.model");
const AppSchema = require("../models/apps.model");
const PlaceSchema = require("../models/advertisementsPlaces.model");
// const commonHelper = require("../helpers/commonHelper");

//Create Advertisement
exports.createAdvertisement = async (req, res) => {
	try {
		// console.log("Create Advertisement")
		let insertData = {
			// app_id: req.body.app_id,
			// place_id: req.body.place_id,
			rank: req.body.rank,
			brand_logo: req.body.logoFile,
			brand_name: req.body.brand_name,
			campaign_title: req.body.campaign_title,
			call_to_action: req.body.call_to_action,
			// poster_type: req.body.poster_type,
			// thumbnail: req.body.thumbnail,
			ad_click_url: req.body.ad_click_url,
			start_date_time: new Date(req.body.start_date_time).setSeconds(0, 0),
			end_date_time: new Date(req.body.end_date_time).setSeconds(0, 0),
			status: req.body.status,
			gross_price: req.body.gross_price,
			net_price: req.body.net_price,
			tax: req.body.tax,
			payment_method: req.body.payment_method,
			is_partial_payment: req.body.is_partial_payment,
			pending_amount: req.body.pending_amount,
			last_modify_date_time: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
			// poster : req.body.posterFile,
			images: req.body.imageFiles,
			videos: req.body.videoFiles,
			// thumbnail : req.body.thumbnailImage
		};

		insertData.app_id = req.body.app_id;
		insertData.place_id = req.body.place_id;
		const getApp = await AppSchema.findById({ _id: req.body.app_id });
		const getPlace = await PlaceSchema.findById({ _id: req.body.place_id });
		insertData.app_name = getApp.name;
		insertData.place_name = getPlace.name;
		let posterType = req.body.poster_type;
		let posterImg = req.body.posterFile;
		if ((posterImg && posterType) || (!posterImg && !posterType)) {
			insertData.poster_type = posterType;
			insertData.poster = posterImg;
			insertData.thumbnail = req.body.thumbnailImage;
		} else {
			return res.status(400).json({ success: false, message: "you must select both poster & poster_type" });
		}
		const createAdvertisement = new AdvertisementSchema(insertData);
		// console.log(createAdvertisement);
		const newAdvertisement = await createAdvertisement.save();
		return res.status(201).json({ success: true, message: "Created successfully", data: newAdvertisement });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: "Internal Server Error", data: error });
	}
};

//Fetch or Get Advertisement List
exports.fetchAdvertisementList = async (req, res) => {
	try {
		const fetchAdvertisement = await AdvertisementSchema.find({}).sort({ rank: 1 });
		if (fetchAdvertisement.length != 0) {
			return res.status(200).json({ success: true, message: "Data Found", data: fetchAdvertisement });
		} else {
			return res.status(204).json({ success: false, message: "No Content" });
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

//Fetch or Get Advertisement By ID
exports.fetchAdvertisementById = async (req, res) => {
	try {
		const _id = req.params.id;
		const fetchAdvertisement = await AdvertisementSchema.findById({ _id: _id });
		if (!fetchAdvertisement) {
			return res.status(404).json({ success: false, message: "Data Not Found" });
		} else {
			return res.status(200).json({ success: true, message: "Data Found", data: fetchAdvertisement });
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: "Data Not Found" });
	}
};

//Fetch or Get Advertisement By Query
exports.fetchAdvertisementByQuery = async (req, res) => {
	try {
		const fetchAdvertisement = await AdvertisementSchema.find(req.query);
		if (fetchAdvertisement.length != 0) {
			return res.status(200).json({ success: true, message: "Data Found", data: fetchAdvertisement });
		} else {
			return res.status(400).json({ success: false, message: "Data Not Found" });
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

//Update Advertisement By ID
exports.updateAdvertisementById = async (req, res) => {
	try {
		// console.log(JSON.parse(JSON.stringify(req.body)));
		const _id = req.params.id;
		const fetchAdvertisement = await AdvertisementSchema.findById({ _id: _id });
		if (!fetchAdvertisement) {
			return res.status(404).json({ success: false, message: "Data Not Found" });
		} else {
			let insertData = {
				// app_id: req.body.app_id,
				// place_id: req.body.place_id,
				// rank: req.body.rank,
				brand_logo: req.body.logoFile,
				brand_name: req.body.brand_name,
				campaign_title: req.body.campaign_title,
				call_to_action: req.body.call_to_action,
				// poster_type: req.body.poster_type,
				ad_click_url: req.body.ad_click_url,
				// start_date_time: new Date(req.body.start_date_time).setSeconds(0, 0),
				// end_date_time: new Date(req.body.end_date_time).setSeconds(0, 0),
				status: req.body.status,
				gross_price: req.body.gross_price,
				net_price: req.body.net_price,
				tax: req.body.tax,
				payment_method: req.body.payment_method,
				is_partial_payment: req.body.is_partial_payment,
				pending_amount: req.body.pending_amount,
				last_modify_date_time: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
				// poster : req.body.posterFile,
				images: req.body.imageFiles,
				videos: req.body.videoFiles,
				// thumbnail : req.body.thumbnailImage
			};
			if (req.body.poster_type != undefined || req.body.posterFile != undefined) {
				if (req.body.poster_type != undefined) {
					if (req.body.posterFile != undefined) {
						insertData.poster_type = req.body.poster_type;
						insertData.poster = req.body.posterFile;
						insertData.thumbnail = req.body.thumbnailImage;
					} else {
						return res.status(400).json({ success: false, message: "You must select Poster field!" });
					}
				} else {
					return res.status(400).json({ success: false, message: "You must select Poster_type field" });
				}
			}
			if (req.body.end_date_time != undefined) {
				let maxEndDateTime = await AdvertisementSchema.find({}).sort({ end_date_time: -1 }).limit(1);
				let popArrayObject = maxEndDateTime.pop();
				let a = fetchAdvertisement.end_date_time.toISOString();
				let b = popArrayObject.end_date_time.toISOString();
				if (a === b) {
					insertData.end_date_time = req.body.end_date_time;
				} else {
					return res.status(400).json({ success: false, message: "You can't update end_date_time" });
				}
			}
			await AdvertisementSchema.findByIdAndUpdate(_id, insertData, { new: true });
			return res.status(201).json({ success: true, message: "Updated successfully" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: "Data not found" });
	}
};

exports.deleteAdvertisementById = async (req, res) => {
	try {
		const _id = req.params.id;
		const fetchAdvertisement = await AdvertisementSchema.findById({ _id: _id });
		if (!fetchAdvertisement) {
			return res.status(404).json({ success: false, message: "Data Not Found" });
		} else {
			await AdvertisementSchema.findByIdAndDelete(_id);
			return res.status(200).json({ success: true, message: "Deleted successfully" });
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: "Data not found" });
	}
};
