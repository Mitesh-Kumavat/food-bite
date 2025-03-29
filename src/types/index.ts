import mongoose from "mongoose";

export interface UserType {
    userName: string;
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    accessToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}