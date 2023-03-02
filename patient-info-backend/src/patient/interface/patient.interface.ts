export interface Patient {
    fullname: string;
    email: string;
    phoneNo: number;
    dateOfBirth: string;
    address: string;
    gender?: string;
    specialAttention: boolean;
    file?: string;
    publicId?: string;
}
