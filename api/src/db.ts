import mongoose from "mongoose";

const DB_URL: string = process.env.DB_URL || "";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Could not connect to MongoDB", err);
    }
}

export default connectToMongoDB;