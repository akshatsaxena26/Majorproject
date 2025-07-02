// const mongoose =require("mongoose")
// const Schema=mongoose.Schema;

// const listingSchema = new Schema({
//     title:{
//         type:String,
//         required:true,
//     },
//     description:String,
//     image:{
//         type:String,
       
//     },
//     price:Number,
//     location:String,
//     counntry:String,

// })
// const listing = mongoose.model("listing",listingSchema);
// module.exports = listing;


const mongoose = require("mongoose");

// const listingSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   image: {
//     filename: String,
//     url: String
//   },
//   price: Number,
//   location: String,
//   country: String
// });





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
