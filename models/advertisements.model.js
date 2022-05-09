const mongoose = require("mongoose");
const { number } = require("sharp/lib/is");
const validator = require("validator");
// var uniqueValidator = require('mongoose-unique-validator');

const advertisementSchema = new mongoose.Schema({
	app_id: { type: mongoose.Schema.Types.ObjectId, ref: "App" },
	place_id: { type: mongoose.Schema.Types.ObjectId, ref: "places" },
	app_name: { type: String },
	place_name: { type: String },
	rank: { type: Number, required: true },
	brand_logo: { type: String },
	brand_name: { type: String },
	campaign_title: { type: String, default: "" },
	call_to_action: { type: String, default: "" },
	poster_type: { type: String }, //, enum:["image", "video"], required: true },
	poster: { type: String },
	thumbnail: { type: String, default: "" },
	ad_click_url: { type: String },
	images: { type: Array, default: [] },
	videos: { type: Array, default: [] },
	start_date_time: { type: Date },
	// end_date_time: { type: Date, validate: [dateValidator, 'Start Date must be less than End Date'] },
	end_date_time: { type: Date },
	status: { type: String, required: true, default: "active" },
	gross_price: { type: Number },
	net_price: { type: Number },
	tax: { type: Number },
	payment_method: { type: String },
	is_partial_payment: { type: Boolean },
	pending_amount: { type: Number },
	last_modify_date_time: { type: Date },
	duration_in_second: { type: Number, default: 5 },
});

// Validate function that validate the startDate and endDate
// function dateValidator(value) {
//   return this.start_date_time <= value;
// }

// advertisements_PortalSchema.plugin(uniqueValidator, { message: 'Already Exist' });

module.exports = mongoose.model("Advertisement", advertisementSchema);
