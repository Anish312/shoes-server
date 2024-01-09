const express = require('express');
const { getAllProducts, createProduct, updateProduct, getProductDetails, createProductReview, getAllReviews, deleteReview } = require('../controller/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { getUserDetails } = require('../controller/userController');

const router = express.Router();
router.route("/products").get( getAllProducts)
router.route("/admin/product/:id").get( isAuthenticatedUser, authorizeRoles("admin")  ,getProductDetails)
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin") , updateProduct)
router.route("/admin/product/new").post( isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router.route("/product/:id").get(getProductDetails)

router.route("/review").put( isAuthenticatedUser, authorizeRoles("admin"), createProductReview)

router.route("/reviews").get( getAllReviews).delete(isAuthenticatedUser ,deleteReview)

module.exports = router;