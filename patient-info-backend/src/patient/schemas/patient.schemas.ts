import * as mongoose from "mongoose";
import { Gender } from "../enums/gender.enum";

export const PatientSchemas = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    dateOfBirth: { type: String, required: true },
    address: { type: String, required: true},
    gender: { type: String, enum: Gender, required: false},
    specialAttention: { type: Boolean, required: true},
    file: { type: String, required: false},
    publicId: { type: String, required: false},
});
