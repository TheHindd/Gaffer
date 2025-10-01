import mongoose from "mongoose";


export const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/gaffer`);
        console.log("Mongodb Connected Succesfully!!");
    }

    catch (error){
        console.error("Error connecting to Mongodb", error) ;
        process.exit(1);  //1 = exit with failure   // 0= exit with success    
    }
};