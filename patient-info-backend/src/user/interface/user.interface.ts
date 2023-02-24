import mongoose from "mongoose";

export interface User {
    email: string;
    password: string;
}