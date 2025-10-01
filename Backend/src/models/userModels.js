import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true} ,
    email: {type: String, required: true, unique: true} ,
    password: {type: String, required: true} ,
    role: {type: String, enum: ['manager', 'admin', 'team_member'], default: 'team_member'},
    mustChangePassword: {type: Boolean, default: true},
    language: {type: String, enum: ['en', 'ar'], default: 'ar'},
}, { timestamps: true });


export default mongoose.model("User", userSchema);
                                                 

    