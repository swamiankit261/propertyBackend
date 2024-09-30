const { body } = require("express-validator");
const ApiError = require("../utils/apiError");

const validateAddress = (value, { req }) => {
    if (!value || typeof value !== 'object') {
        throw new Error('Address is required and should be an object');
    }
    if (!value.city || typeof value.city !== 'string' || !value.city.trim()) {
        throw new Error('City is required and should be a non-empty string');
    }
    if (!value.state || typeof value.state !== 'string' || !value.state.trim()) {
        throw new Error('State is required and should be a non-empty string');
    }
    if (!value.zipCode || typeof value.zipCode !== 'string' || !/^[0-9]+$/.test(value.zipCode)) {
        throw new Error('Zip code is required and should be a string containing only digits');
    }
    return true;
};

// Validation middleware
const validateRegisterFields = [
    body("firstName").exists().withMessage("firstName is required").trim().isAlpha().withMessage("field only accepts alphabetic characters"),
    body("lastName").exists().withMessage("lastName is required").trim().isAlpha().withMessage("field only accepts alphabetic characters"),
    body("email").trim().isEmail(),
    body("password").trim().isStrongPassword(),
    body("address").custom(validateAddress), // Custom validation for address
    // body("roleOf").trim().isIn(["landlord", "tenant", "broker"]),
];

module.exports = validateRegisterFields;