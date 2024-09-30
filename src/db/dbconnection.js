const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/propertyDealing`)
        console.log(`\n MongoDB connected !! DB host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("mongodb connection error", error)
        process.exit(1)
    }
}

module.exports = connectDB;