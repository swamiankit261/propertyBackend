const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    street: String,

    city: {
        type: String,
        required: true,
        index: true
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        index: true,
        required: true,
        minlength: 5,
        match: [/^[0-9]+$/, 'Please enter a valid zip/pin code']
    }
})

const propertySchema = new mongoose.Schema(
    {
        images: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        price: {
            type: Number,
            required: true
        },
        // Information about who posted the property
        posted: {
            at: {
                type: String,
                required: true,
                enum: ["Owner", "Agent", "Builder"]
            },
            by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        },
        // Type of the property (e.g., residential, commercial)
        propertyType: {
            type: String,
            required: true,
            index: true,
            enum: ["Residential", "Commercial"]
        },
        // Category of the property (e.g., house, apartment, office)
        propertyCategory: {
            type: String,
            required: true,
            indexedDB: true,
        },
        // Address of the property
        address: {
            type: addressSchema,
            required: true,
        },
        lookingTo: {
            type: String,
            required: true,
            enum: ["rent", "sell", "PG/Co-living"]
        },
        // Unit of measurement for the area of the property
        areaUnit: {
            type: Number,
            required: true
        },
        BHK: {
            type: String,
            required: true,
            enum: ["1RK", "1BHK", "2BHK", "3BHK", "3+BHK"]
        },
        // Name of the landlord
        landlord: {
            type: String,
            required: true
        },
        mobileNo: {
            type: String,
            required: true
        },

        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        // reviews: [
        //     {
        //         user: {
        //             type: mongoose.Schema.ObjectId,
        //             ref: "users",
        //             required: true
        //         },
        //         name: {
        //             type: String,
        //             required: true
        //         },
        //         rating: {
        //             type: Number,
        //             required: true
        //         },
        //         comment: {
        //             type: String,
        //             required: true
        //         }
        //     }
        // ],
        description: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
