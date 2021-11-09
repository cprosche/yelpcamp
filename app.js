// setup
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

//routes
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

//connect to db
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

// setting up view
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// routing
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)

app.get("/", (req, res) => {
    res.render("home");
})

//If no route is hit, return a 404
app.all("*", (req, res, next) => {
    next(new ExpressError("404 Page Not Found", 404));
})

// error handling
app.use((err, req, res, next) => {
    //const {statusCode = 500, message = "Something went wrong!"} = err;
    if(!err.message) err.message = "Something went wrong!";
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).render("error", {err});
})

// this stays at the bottom
app.listen(3000, () => {
    console.log("Live on port 3000");
})