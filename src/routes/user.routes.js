const express = require('express');
const { registerUser, loginUser, logoutUser, changeCurrentUserPassword, getCurrentUser, getAllUsers } = require('../controllers/user.controller');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const validateRegisterFields = require('../middlewares/validatUserApiRequest');

const R = express.Router();


R.route("/register").post(validateRegisterFields, registerUser)
R.route("/login").post(loginUser)

// SECURED ROUTES
R.route("/currentuser").get(verifyJWT, getCurrentUser)
R.route("/getAllUsers").get(verifyJWT, authorizeRoles("admin"), getAllUsers)
R.route("/logout").post(verifyJWT, logoutUser)
R.route("/resetPassword").patch(verifyJWT, changeCurrentUserPassword)

module.exports = R;