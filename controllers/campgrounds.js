const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

const ex = module.exports;

ex.index = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

ex.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

ex.createCampground = catchAsync(async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  campground.author = req.user._id;
  await campground.save();
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
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  campground.images.push(...imgs);
  await campground.save();
  1;
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
});

ex.deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
});
