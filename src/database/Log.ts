import { Schema, model } from "mongoose";

const log = new Schema({
	"_id": String,
	"msg_id": String,
	"name": String,
	"time": {
		"hours": String,
		"minutes": String
	},
	"description": String,
	"verified": Boolean,
	"date": {
		type: Date,
		required: true
	},
	"log_date": {
		type: Date,
		default: new Date()
	},
	"tutee": {
		"name": String,
		"contact": String,
		"grade": String,
	},
	"subject": String,
	"submitter": String,
	"verifier": String,
	"additional_note": String
});

export default model("log", log);