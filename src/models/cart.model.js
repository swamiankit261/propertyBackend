const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        shortList: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);