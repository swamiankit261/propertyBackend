const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

exports.registerUser = asyncHandler(async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    const { firstName, lastName, email, password, mobileNo, companyName, address } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const Fields = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        mobileNo: mobileNo,
        companyName: companyName,
        address: address
    }

    const user = await User.create(Fields)


    res.status(201).json(new ApiResponse(201, user, "user registered successfully"));
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email.trim() && !password.trim()) {
        throw new ApiError(400, "Email and password must be required")
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password");
    }

    const token = await user.generateAccessToken();

    const options = { httpOnly: true, secure: true };
    res.status(200).cookie("accessToken", token, options)
        .json(new ApiResponse(200, { accessToken: token }, "user logged in successfully"));
});

exports.logoutUser = asyncHandler(async (_, res) => {
    res.clearCookie("accessToken");
    res.status(200).json(new ApiResponse(200, {}, "user logged out successfully"));
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    res.status(200).json(new ApiResponse(200, user, "user get successfully"));
})

exports.changeCurrentUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword && !newPassword) {
        throw new ApiError(403, "old password and new password is required")
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password cannot be same as old password")
    }

    const user = await User.findById(req.user._id).select("+password")

    const isValidPassword = await user.isPasswordCorrect(oldPassword);

    if (!isValidPassword) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "password changed successfully"));
});

exports.getAllUsers = asyncHandler(async (_, res) => {
    const totalUsers = await User.countDocuments();
    const user = await User.find();
    const users = user.map(user => ({
        ...user.toObject(), // Convert Mongoose document to plain JS object
        fullName: user.fullName // Access the virtual property
    }));

    res.status(200).json(new ApiResponse(200, { users, totalUsers }, "Users fetched successfully"));
});