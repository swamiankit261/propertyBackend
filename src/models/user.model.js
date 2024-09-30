const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addressSchema = mongoose.Schema(
    {
        street: String,

        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            index: true,
            minlength: 5,
            match: [/^[0-9]+$/, 'Please enter a valid zip/pin code']
        }
    }
)

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            minlength: 2,
            maxlength: 30,
            match: [/^[a-zA-Z]+$/, "field only accepts alphabetic characters"],
        },
        lastName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            match: [/^[a-zA-Z]+$/, "field only accepts alphabetic characters"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        mobileNo: {
            type: String,
            required: true
        },
        companyName: String,
        address: {
            type: addressSchema,
            required: true
        },
        roleOf: {
            type: String,
            default: "user"
        }

    }, { timestamps: true });

userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    return this.password = await bcrypt.hash(this.password, 10)
    next();
});

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
};




const User = mongoose.model("User", userSchema);

module.exports = User;