import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserType } from "@/types";

const userSchema = new mongoose.Schema<UserType>({
    userName: {
        unique: true,
        required: [true, "Username is required"],
        type: String,
        minLength: 2,
    },
    email: {
        unique: true,
        required: [true, "Email is required"],
        type: String,
        match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email address"],
    },
    password: {
        required: [true, "Password is required"],
        type: String,
        minlength: 6,
    },
    accessToken: {
        type: String,
        default: "",
    }
}, { timestamps: true });

// before saving the user to the database, hash the password and then save it
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// compare the password entered by the user with the hashed password stored in the database
userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// create jwt token using user's user._id
userSchema.methods.createAccessToken = async function () {
    this.accessToken = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
    await this.save();
    return this.accessToken;
}

const User = mongoose.models?.Users || mongoose.model("Users", userSchema);

export default User;