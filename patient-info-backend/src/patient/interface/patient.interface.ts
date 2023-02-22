import { Gender } from "../enums/gender.enum";

export interface Patient {
    fullname: string;
    email: string;
    phoneNo: number;
    dateOfBirth: string;
    address: string;
    gender: Gender;
    specialAttention: boolean;
    file: string;
    publicId: string;
}
