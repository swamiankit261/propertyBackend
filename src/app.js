const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require('dotenv');


dotenv.config({ path: "./.env" });



const app = express();

// middlewares for express middlewares that require authentication and authorization for the application to use
app.use(cors({ origin: `${process.env.CORS_ORIGIN}`, credentials: true }));

app.use(express.json({ limit: "10mb" }));

// To understand URL patterns
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

const rateLimit = require('express-rate-limit');

// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 65 // Limit each IP to 100 requests per windowMs
});

app.use(limiter);


// Routes imports
const userRoutes = require("./routes/user.routes");
const propertyRoutes = require("./routes/property.routes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/property", propertyRoutes);



module.exports = app