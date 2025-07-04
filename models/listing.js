const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
  title: String,
  description: String,


image: {
  url: { type: String, default: "https://via.placeholder.com/300x200?text=No+Image" },
  filename: String
},
 price: Number,
  location: String,
  country: String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
