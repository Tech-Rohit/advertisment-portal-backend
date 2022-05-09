const { check, validationResult, body } = require("express-validator");
const AppSchema = require("../models/apps.model");
const PlaceSchema = require("../models/advertisementsPlaces.model");
const AdvertisementSchema = require("../models/advertisements.model");
const AdvertisementService = require("../services/advertisements.service");
const validator = require("validator");
const mongoose = require("mongoose");

//Advertisement Create Validation
exports.advertisementCreateValidation = [
	check("rank").not().isEmpty().withMessage("Rank is required!!"),
	check("brand_name").not().isEmpty().withMessage("brand_name is required!!"),
	check("start_date_time")
		.isISO8601()
		.toDate()
		.not()
		.isEmpty()
		.withMessage("start_date_time can't be empty !")
		.custom(async (value, { req }) => {
			var CurrentDate = new Date();
			if (value < CurrentDate) {
				// console.log("invalid date");
				throw new Error("Invalid Start Date!");
			}
		}),
	check("end_date_time")
		.isISO8601()
		.toDate()
		.not()
		.isEmpty()
		.withMessage("end_date_time can't be empty !")
		.custom(async (value, { req }) => {
			if (value != null) {
				let startDate = req.body.start_date_time;
				if (startDate >= value) throw new Error("Start Date must be less than End Date");
			}
		}),
	check("app_id")
		.not()
		.isEmpty()
		.withMessage("App Id is required!!")
		.custom(async (value) => {
			if (value != null) {
				if (!mongoose.isValidObjectId(value)) {
					throw new Error("Invalid App ID");
				}
				const getApp = await AppSchema.findById({ _id: value });
				// if (getApp === null) {
				// console.log(getApp.name);
				if (!getApp) {
					throw new Error("App Id Doesn't Exist");
				}
			}
		}),
	check("place_id")
		.not()
		.isEmpty()
		.withMessage("Place Id is required!!")
		.custom(async (value) => {
			if (value != null) {
				if (!mongoose.isValidObjectId(value)) {
					throw new Error("Invalid Place ID");
				}
				const getPlace = await PlaceSchema.findById({ _id: value });
				// console.log(getPlace.name);
				// if (getPlace === null) {
				if (!getPlace) {
					throw new Error("Place Id Doesn't Exist");
				}
			}
		}),
	check("ad_click_url")
		.not()
		.isEmpty()
		.withMessage("URL can't be empty !")
		.custom(async (value) => {
			if (value != null) {
				if (!validator.isURL(value, { protocols: ["http", "https", "ftp"], require_tld: true, require_protocol: true })) {
					throw new Error("Must be a Valid URL");
				}
			}
		}),
	check("is_partial_payment")
		.not()
		.isEmpty()
		.withMessage("is_partial_payment field is required")
		.custom(async (value) => {
			if (value != null) {
				if (value != "true" && value != "false") {
					throw new Error("You can select only true or false");
				}
			}
		}),
	check("status")
		.not()
		.isEmpty()
		.withMessage("status field is required")
		.custom(async (value) => {
			if (value != null) {
				if (value != "active" && value != "inactive" && value != "draft" && value != "deleted") {
					throw new Error("Invalid status");
				}
			}
		}),
	check("poster_type")
		.optional()
		// .not()
		// .isEmpty()
		// .withMessage("Poster type is required!!")
		.custom(async (value) => {
			// console.log('Value here')
			// console.log(value);
			if (value) {
				// console.log("Into IF")
				if (value != "image" && value != "video") {
					throw new Error("You can select only image or video type");
				}
			}
		}),
	async (req, res, next) => {
		// console.log("Create add middleware")
		let result = validationResult(req);
		let resultArray = result.array();
		resultArray = resultArray.map((obj) => {
			return obj.msg;
		});
		if (!result.isEmpty()) {
			// console.log(resultArray);
			return res.status(400).json({ success: false, message: resultArray });
		}

		let startDate = new Date(req.body.start_date_time);
		let query = { place_id: req.body.place_id, rank: req.body.rank, app_id: req.body.app_id, end_date_time: { $gte: startDate } };

		let queryResult = await AdvertisementService.getActiveAdvertisementsByQuery(query);
		if (queryResult.length > 0) {
			return res.status(400).json({ success: false, message: "Advertisement Already exists" });
		}

		// console.log("Create add middleware 2")

		// const errors = validationResult(req);

		// If some error occurs, then this
		// block of code will run
		// if (!errors.isEmpty()) {
		//     return res.status(400).json({ success: false, error: "Validator Error", message: errors.array() });
		// }
		next();
	},
];

//Advertisement Update Validation
exports.advertisementUpdateValidation = [
	// check(body()).not().isEmpty().withMessage("empty body"),
	check("end_date_time")
		.optional()
		.custom(async (value, { req }) => {
			if (!value) {
				throw new Error("Date not valid");
			}
			if (value != null) {
				const _id = req.params.id;
				const fetchAdvertisement = await AdvertisementSchema.findById({ _id: _id });
				// console.log(fetchAdvertisement.start_date_time);
				let existStartDate = fetchAdvertisement.start_date_time;
				let startDate = existStartDate.toISOString();
				startDate = new Date(startDate);
				value = new Date(value);
				if (startDate >= value) throw new Error("Start Date must be less than End Date");
			}
		}),
	// check("app_id")
	//     .custom(async (value) => {
	//         if (value != null) {
	//             const getApp = await AppSchema.findById({ _id: value });
	//             if (getApp === null) { throw new Error("App Id Doesn't Exist"); }
	//         }
	//     }),
	// check("place_id")
	//     .custom(async (value) => {
	//         if (value != null) {
	//             const getPlace = await PlaceSchema.findById({ _id: value });
	//             if (getPlace === null) { throw new Error("Place Id Doesn't Exist"); }
	//         }
	//     }),
	check("ad_click_url").custom(async (value) => {
		if (value != null) {
			if (!validator.isURL(value, { protocols: ["http", "https", "ftp"], require_tld: true, require_protocol: true })) {
				throw new Error("Must be a Valid URL");
			}
		}
	}),
	check("is_partial_payment").custom(async (value) => {
		if (value != null) {
			if (value != "true" && value != "false") {
				throw new Error("You can select only true or false");
			}
		}
	}),
	check("status").custom(async (value) => {
		if (value != null) {
			if (value != "active" && value != "inactive" && value != "draft" && value != "deleted") {
				throw new Error("Invalid status");
			}
		}
	}),
	check("poster_type").custom(async (value) => {
		if (value != null) {
			if (value != "image" && value != "video") {
				throw new Error("You can select only image or video type");
			}
		}
	}),
	async (req, res, next) => {
		// let query = { place_id: req.body.place_id, rank: req.body.rank, app_id: req.body.app_id };
		// let queryResult = await AdvertisementService.getActiveAdvertisementsByQuery(query);
		// if (queryResult.length > 0) {
		//     return res.status(400).json({
		//         success: false, error: "Validator Error", message: [{
		//             "value": "",
		//             "msg": "Advertisement Already exists",
		//             "param": "",
		//             "location": "body"
		//         }]
		//     });
		// }

		let errors = validationResult(req);
		let errorsArray = errors.array();
		errorsArray = errorsArray.map((obj) => {
			return obj.msg;
		});

		// If some error occurs, then this
		// block of code will run
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, error: "Validator Error", message: errorsArray });
		}
		next();
	},
];
