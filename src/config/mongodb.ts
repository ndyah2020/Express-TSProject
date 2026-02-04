import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
const connectDB = async (): Promise<void> => {
    const mongoDbUrI = process.env.MONGO_URI
    if(!mongoDbUrI) throw new ApiError(StatusCodes.NOT_FOUND,"MONGO_URI is not defined in environment variables")

    try {        
        const conn = await mongoose.connect(mongoDbUrI)
        console.log(`Connected to ${conn.connection.host}:${conn.connection.port}`) 
    } catch (error) {
        console.error("MongoDB connection error:", error)
        process.exit(1)
    }
}
export default connectDB