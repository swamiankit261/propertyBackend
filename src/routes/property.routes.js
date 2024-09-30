const express = require('express');
const { verifyJWT } = require("../middlewares/auth.middleware");
const { registerProperty, getSingleProperty, updateProperty, deleteProperty, createPropertyReview, getAllProperty, propertieRatings } = require('../controllers/property.controller');
const validateRegisterPropertieField = require('../middlewares/validatPropertieApi');
const { param } = require("express-validator");

const requireId = [
    param("id", "Please provide a ID in param").exists(),
    param("id", "Please provide a valid ID in param").matches(/^[0-9a-fA-F]{24}$/)
];


const R = express.Router();

R.route("/registerProperty").post(verifyJWT, validateRegisterPropertieField, registerProperty);

R.route("/allProperty").get(getAllProperty);

R.route("/property/:id").get(requireId, getSingleProperty);

R.route("/updateProperty/:id").patch(verifyJWT, requireId, updateProperty);

R.route("/deleteProperty/:id").delete(verifyJWT, deleteProperty);

R.route("/propertieRatings/:id").put(verifyJWT, requireId, propertieRatings)


// R.route("/review").put(verifyJWT, createPropertyReview)



module.exports = R;