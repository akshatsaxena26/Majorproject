 const express = require("express")
 const app = express();
 const mongoose=require("mongoose")
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate= require("ejs-mate")


 const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust"


 main()
 .then(()=>{
    console.log("connected to db")

 }).catch(err=>{
    console.log("err");
 })

  async function main(){
     await mongoose.connect(MONGO_URL)
 }

 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"views"));
 app.use(express.urlencoded({extended:true}));
 app.use(methodOverride("_method"));
 app.engine('ejs',ejsMate);
 app.use(express.static(path.join(__dirname,"/public")));

 app.get("/",(req,res)=>{
    res.send("hi i am doing a major project");
 })
//Index Route
 app.get("/listings",async(req,res)=>{
   const allListings=await Listing.find({})
   res.render("listings/index",{allListings});
 })


//New Route
app.get("/listings/new", (req,res)=>{
   res.render("listings/new.ejs")
})

//Show Route
app.get("/listings/:id", async(req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
   res.render("listings/show.ejs",{listing})
})

//Create Route

app.post("/listings", async (req, res) => {
 

  // ✅ If user leaves image field blank, set default image
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
      url: "https://via.placeholder.com/300x200?text=No+Image",
      filename: "default"
    };
  }

  const newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
});



//Edit Route
app.get("/listings/:id/edit", async(req,res)=>{
  let {id} =req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
})
//Update Route
app.put("/listings/:id",async (req,res)=>{
   let{id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect(`/listings/${id}`);
})


//Delete Route
app.delete("/listings/:id", async(req,res)=>{
    let {id} =req.params;
  let deleteListing= await Listing.findByIdAndDelete(id)
  console.log(deleteListing);
  res.redirect("/listings");
})



//  app.get("/testlisting", async(req,res)=>{

//    let sampleListing = new Listing({
//       title:"my new villa ",
//       description:"By the beach",
//       price:1200,
//       location:"Calangute,Goa",
//       country:"India",

//    });

// await sampleListing.save();
// console.log("sample was saved");
// res.send("sucessful testing");
  
//  });

 app.listen(8080,()=>{
    console.log("server is listening to port 8080")
 });
