const express = require("express");
const router = express.Router({mergeParams: true});
const reviewsController = require("../controllers/reviews")
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

//routes
router.post('/', isLoggedIn, validateReview, reviewsController.newReview)

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewsController.deleteReview)

module.exports = router;