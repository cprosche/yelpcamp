const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");

const ex = module.exports;

ex.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

ex.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

ex.createCampground = catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}) );
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
});

ex.renderCampgroundDetails = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("author");
    // console.log(campground);
    if (!campground) {
        req.flash("error", "Invalid campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
});

ex.renderEditCampground = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Invalid campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
});

ex.saveEditCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
});

ex.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
});
