const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetail, updatePassword, updateProfie, getAllUser, getSingleUser, updateUserRole } = require('../controller/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get( isAuthenticatedUser , getUserDetail)
router.route("/password/update").put( isAuthenticatedUser , updatePassword)
router.route("/me/update").put( isAuthenticatedUser , updateProfie)
router.route("/admin/users").get( isAuthenticatedUser , authorizeRoles("admin") , getAllUser)
router.route("/admin/user/:id").get( isAuthenticatedUser , authorizeRoles("admin") , getSingleUser).put(isAuthenticatedUser , authorizeRoles("admin") , updateUserRole )

 module.exports = router;