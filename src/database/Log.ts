import { Schema, model, Document } from "mongoose";

const log = new Schema({
    msg_id: String,
    name: String,
    time: {
        hours: Number,
        minutes: Number,
    },
    description: String,
    verified: Boolean,
    rejected: Boolean,
    rejector: String,
    date: {
        type: Date,
        required: true,
    },
    log_date: {
        type: Date,
        default: new Date(),
    },
    tutee: {
        name: String,
        contact: String,
        grade: String,
    },
    subject: String,
    submitter: String,
    verifier: String,
    rejected_reason: String,
    additional_note: String,
});

export interface LogSchema extends Document {
    _id: string;
    msg_id: string;
    name: string;
    time: {
        hours: string | number;
        minutes: string | number;
    };
    description: string;
    verified: boolean;
    date: Date;
    log_date: Date;
    tutee: {
        name: string;
        contact: string;
        grade: string;
    };
    subject: string;
    submitter: string;
    verifier: string;
    rejector?: string;
    rejected_reason?: string;
    rejected?: boolean;
    additional_note: string;
}

export default model<LogSchema>("log", log);
