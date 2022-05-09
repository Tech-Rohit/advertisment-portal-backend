const res = require("express/lib/response");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const commonHelper = require("../helpers/commonHelper");

//Resize Poster Image & Generate Resized Thumbnail Image
const resizeImage = async (sampleFile) => {
	try {
		const img = await sharp(sampleFile.data).resize(100, 100);
		if (!fs.existsSync("./poster/")) {
			fs.mkdirSync("./poster/");
		}
		if (!fs.existsSync("./poster/thumbnail")) {
			fs.mkdirSync("./poster/thumbnail");
		}
		let randString = commonHelper.createRandomStringOfLength();
		let name = Date.now() + "_" + randString + path.extname(sampleFile.name);
		// let name =  Date.now() + '_' + sampleFile.name;
		img.toFile("./poster/thumbnail/" + name);
		return name;
	} catch (error) {
		return res.status(500).json({ success: false, message: "Internal Server Error", data: error });
	}
};

const resizeLogoImage = async (sampleFile) => {
	try {
		const img = await sharp(sampleFile.data).resize(150, 150);
		if (!fs.existsSync("./logo/")) {
			fs.mkdirSync("./logo/");
		}
		let randString = commonHelper.createRandomStringOfLength();
		let name = Date.now() + "_" + randString + path.extname(sampleFile.name);
		// let name =  Date.now() + '_' + sampleFile.name;
		img.toFile("./logo/" + name);
		return name;
	} catch (error) {
		return res.status(500).json({ success: false, message: "Internal Server Error", data: error });
	}
};

const storage = (sampleFile, folder) => {
	let dir = path.join(__dirname, `${folder}`);
	if (!fs.existsSync("./poster/")) {
		fs.mkdirSync("./poster/");
	}
	if (!fs.existsSync("./uploads/")) {
		fs.mkdirSync("./uploads/");
	}
	if (!fs.existsSync("./logo/")) {
		fs.mkdirSync("./logo/");
	}
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	let randString = commonHelper.createRandomStringOfLength();
	let name = Date.now() + "_" + randString + path.extname(sampleFile.name);
	// let name =  Date.now() + '_' + sampleFile.name;
	let uploadPath = path.join(dir, name);
	sampleFile.mv(uploadPath, function (err) {
		if (err) return res.status(500).json({ success: false, message: [], error: "Internal Server Error" });
	});
	// return  `${folder}`.replace('../',"") +'/' + name;
	return name;
};
//Dactar Wala Code
// exports.uploadFiles = async (req,res,next) => {
//     let folder = '';
//     let sampleFile = '';
//     let errors = true;
//     let message = {
//         "value"     : "",
//         "msg"       : "",
//         "param"     : "",
//         "location"  : "body"
//     }
//     let imageFiles = [];
//     let videoFiles = [];
//     if(req.files !== null){
//         //Upload Brand_Logo
//         if(req.files.brand_logo != undefined){
//             if(req.files.brand_logo.mimetype === 'image/png' || req.files.brand_logo.mimetype === 'image/jpg' || req.files.brand_logo.mimetype === 'image/jpeg'){
//                     sampleFile = req.files.brand_logo;
//                     folder = '../logo/';
//                     errors = false;
//             }else{
//                 message.msg = "Invalid logo type";
//                 message.param = 'brand_logo';
//                 errors = true;
//             }
//             if(!errors){
//                 req.body.logoFile =  storage(sampleFile,folder);
//             }
//         }else{
//             message.msg = "Brand logo is required";
//             message.param = 'brand_logo';
//             errors = true;
//         }
//         //Upload Poster
//         if(req.files.poster != undefined){
//             if(req.body.poster_type === 'image'){
//                 if(req.files.poster.mimetype === 'image/png' || req.files.poster.mimetype === 'image/jpg' || req.files.poster.mimetype === 'image/jpeg' || req.files.poster.mimetype === 'image/gif'){
//                     sampleFile = req.files.poster;
//                     folder = '../poster/images';
//                     errors = false;
//                     var image =  await resizeImage(sampleFile);
//                     req.body.thumbnailImage = image;
//                 }else{
//                     message.msg = "you have selected image poster type!";
//                     message.param = 'poster';
//                     errors = true;
//                 }
//             }else{
//                 if(req.files.poster.mimetype === 'video/mp4' || req.files.poster.mimetype === 'video/mov'){
//                     sampleFile = req.files.poster;
//                     folder = '../poster/videos';
//                     errors = false;
//                 }else{
//                     message.msg = "you have selected video poster type!";
//                     message.param = 'poster';
//                     errors = true;
//                 }
//             }
//             if(!errors){
//                 req.body.posterFile =  storage(sampleFile,folder);
//             }
//         }else{
//             message.msg = "poster field is required";
//             message.param = 'poster';
//             errors = true;
//         }
//         //Upload Files
//         if(req.files.files != undefined){
//             if(req.files.files.length === undefined){
//                 sampleFile  = req.files.files;
//                 if(sampleFile.mimetype === 'image/png' || sampleFile.mimetype === 'image/jpg' || sampleFile.mimetype === 'image/jpeg'){
//                     folder = '../uploads/images';
//                     imageFiles.push(storage(sampleFile,folder));
//                 }else if(sampleFile.mimetype === 'video/mp4' || sampleFile.mimetype === 'video/mov'){
//                     folder = '../uploads/videos';
//                     videoFiles.push(storage(sampleFile,folder));
//                 }

//             }else{
//                 req.files.files.forEach((file) => {
//                     if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
//                         folder = '../uploads/images';
//                        imageFiles.push(storage(file,folder));
//                     }else if(file.mimetype === 'video/mp4'){
//                         folder = '../uploads/videos';
//                         videoFiles.push(storage(file,folder));
//                     }
//                 });
//             }
//             req.body.imageFiles = imageFiles;
//             req.body.videoFiles = videoFiles;
//         }else{
//             message.msg = "files field is required";
//             message.param = 'files';
//             errors = false;
//         }
//     }else{
//         message.msg = "Files and poster fields is required";
//         message.param = "files and poster";
//         errors = true;
//     }
//     if(errors){
//         return res.status(400).json({ success: false, error: "Validator Error", message: [message] });
//     }
//     next();
// }

exports.uploadFiles = async (req, res, next) => {
	// console.log("Create add upload file");
	try {
		let folder = "";
		let sampleFile = "";
		let imageFiles = [];
		let videoFiles = [];
		// console.log("Your Files here");
		// console.log(req.files);
		if (req.files) {
			//Upload Brand_Logo

			if (req.files.brand_logo != undefined) {
				if (
					req.files.brand_logo.mimetype === "image/png" ||
					req.files.brand_logo.mimetype === "image/jpg" ||
					req.files.brand_logo.mimetype === "image/jpeg"
				) {
					sampleFile = req.files.brand_logo;
					folder = "../logo/";
					var logo = await resizeLogoImage(sampleFile);
				} else {
					return res.status(400).json({ success: false, message: "Invalid logo type" });
				}
				req.body.logoFile = logo;
			} else {
				return res.status(400).json({ success: false, message: "Brand logo is required" });
			}
			//Upload Poster
			if (req.files.poster != undefined) {
				if (!req.body.poster_type) {
					return res.status(400).json({ success: false, message: "you must select both poster & poster_type" });
				}
				if (req.body.poster_type === "image") {
					if (
						req.files.poster.mimetype === "image/png" ||
						req.files.poster.mimetype === "image/jpg" ||
						req.files.poster.mimetype === "image/jpeg" ||
						req.files.poster.mimetype === "image/gif"
					) {
						sampleFile = req.files.poster;
						folder = "../poster/images";
						var image = await resizeImage(sampleFile);
						req.body.thumbnailImage = image;
					} else {
						return res.status(400).json({ success: false, message: "you have selected image poster type!" });
					}
				} else {
					if (req.files.poster.mimetype === "video/mp4" || req.files.poster.mimetype === "video/mov") {
						sampleFile = req.files.poster;
						folder = "../poster/videos";
					} else {
						return res.status(400).json({ success: false, message: "you have selected video poster type!" });
					}
				}
				req.body.posterFile = storage(sampleFile, folder);
			}
			// else{
			//     return res.status(400).json({success: false, message: "poster field is required"});
			// }
			//Upload Files
			if (req.files.files != undefined) {
				if (req.files.files.length === undefined) {
					sampleFile = req.files.files;
					if (sampleFile.mimetype === "image/png" || sampleFile.mimetype === "image/jpg" || sampleFile.mimetype === "image/jpeg") {
						folder = "../uploads/images";
						imageFiles.push(storage(sampleFile, folder));
					} else if (sampleFile.mimetype === "video/mp4" || sampleFile.mimetype === "video/mov") {
						folder = "../uploads/videos";
						videoFiles.push(storage(sampleFile, folder));
					}
				} else {
					req.files.files.forEach((file) => {
						if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
							folder = "../uploads/images";
							imageFiles.push(storage(file, folder));
						} else if (file.mimetype === "video/mp4") {
							folder = "../uploads/videos";
							videoFiles.push(storage(file, folder));
						}
					});
				}
				req.body.imageFiles = imageFiles;
				req.body.videoFiles = videoFiles;
			}
		}else{return res.status(400).json({ success: false, message: "Brand Logo Required"})}
		next();
	} catch (error) {
		// console.log("Create add upload file error");
		console.log(error);

		return res.status(500).json({ success: false, message: "Internal Server Error", data: error });
	}
};
