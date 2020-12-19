import { Schema, model, Document } from "mongoose";

const position = new Schema({
    msg_id: String,
    email: String,
    student_name: String,
    description: String,
    taken: Boolean,
    claimer: String,
});

export interface PositionSchema extends Document {
    _id: string;
    msg_id: string;
    email: string;
    student_name: string;
    description: string;
    taken: boolean;
    claimer: string;
}

export default model<PositionSchema>("position", position);
