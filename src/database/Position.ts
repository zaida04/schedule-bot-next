import { Schema, model } from "mongoose";

const position = new Schema(
	{
		"_id": String,
		"msg_id": String,
		"email": String,
		"description": String,
		"taken": Boolean,
		"claimer": String
	}
);

export default model("position", position);