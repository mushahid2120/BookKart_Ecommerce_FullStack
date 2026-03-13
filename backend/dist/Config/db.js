import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";
console.log(MONGO_URI);
export default async function dbConnect() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database is connected");
    }
    catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
process.on("SIGINT", async () => {
    mongoose.disconnect();
    console.log("Client Disconnected");
    process.exit(0);
});
