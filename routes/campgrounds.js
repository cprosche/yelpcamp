//requires
const express = require("express");
const router = express.Router();

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgroundsController = require("../controllers/campgrounds");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
    .route("/")
    .get(campgroundsController.index)
    .post(
        isLoggedIn,
        validateCampground,
        campgroundsController.createCampground
    );

router.get("/new", isLoggedIn, campgroundsController.renderNewForm);

router
    .route("/:id")
    .get(campgroundsController.renderCampgroundDetails)
    .put(
        isLoggedIn,
        isAuthor,
        validateCampground,
        campgroundsController.saveEditCampground
    )
    .delete(isLoggedIn, campgroundsController.deleteCampground);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    campgroundsController.renderEditCampground
);

module.exports = router;
