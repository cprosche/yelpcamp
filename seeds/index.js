const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: "619074a00e59a9588c1e2449",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: { type: "Point", coordinates: [-122.3301, 47.6038] },
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/duc1s22gu/image/upload/v1642255841/YelpCamp/mxloqh8twxe3lwllsvw8.jpg",
          filename: "YelpCamp/mxloqh8twxe3lwllsvw8"
        }
      ],
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique debitis provident ea in velit officia voluptatum voluptatem eveniet assumenda dicta error ab repudiandae, laborum corrupti explicabo? Nemo quam quos molestiae? Unde ea possimus pariatur ad qui eligendi dolorum eaque, ullam quos animi labore architecto expedita alias error illum a non accusantium porro in corrupti suscipit dolorem. Reiciendis alias unde provident.",
      price: Math.floor(Math.random() * 20) + 10
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
