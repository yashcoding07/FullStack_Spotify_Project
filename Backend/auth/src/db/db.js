import mongoose from "mongoose";
import _config from "../config/config.js";

async function connectToDB() {
    try {
        await mongoose.connect(_config.MONGO_URI);
        console.log("Connected to the database");      
    } catch (error) {
        console.log("Error connecting to the database.", error);
    };
};

export default connectToDB;