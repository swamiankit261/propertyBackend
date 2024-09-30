const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies.accessToken
            || req.headers.Authorization?.split(" ")[1] || req.headers.Authorization
            || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "No token provided");
        }

        console.log('Token:', token);

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new ApiError(401, "Token expired");
            } else {
                throw new ApiError(401, "Invalid token");
            }
        }

        // console.log('Decoded Token:', decodedToken);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        next(new ApiError(401, error.message));
    }
});

exports.authorizeRoles = (...roles) => {
    return (req, _, next) => {
        if (!roles.includes(req.user.roleOf)) {
            return next(new ApiError(403, `RoleError: ${req.user.roleOf} is note allowed to access this resorce`));
        }

        next();
    };
};