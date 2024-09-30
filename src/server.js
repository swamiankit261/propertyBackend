// const dotenv = require('dotenv');
const connectDB = require("./db/dbconnection");
const app = require("./app");
const cloudinary = require("cloudinary");

const PORT = process.env.PORT || 8000;

// dotenv.config({ path: "./.env" });

process.on("SIGINT", () => {
    console.log('Server shutting down gracefully !');
    process.exit(0);
})

connectDB()
    .then(() => {

        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => console.error(err));
