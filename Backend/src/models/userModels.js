import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true} ,
    email: {type: String, required: true, unique: true} ,
    password: {type: String, required: true} ,
    role: {type: String, enum: ['manager', 'admin', 'team_member', 'assistant'], default: 'team_member'},
    mustChangePassword: {type: Boolean, default: true},
    resetOtp: {type: String, default: null},
    resetOtpExpiry: {type: Number , default: null}
}, { timestamps: true });


export default mongoose.model("UserModel", userSchema);
                                                 

    