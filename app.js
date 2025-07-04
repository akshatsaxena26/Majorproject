 const express = require("express")
 const app = express();
 const mongoose=require("mongoose")
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate= require("ejs-mate")
const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const {listingSchema}=require("./schema.js")


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

const validateListing =(req,res,next)=>{
   
     let {error}= listingSchema.validate(req.body);
     if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
     }
   
   if(error){
      throw new ExpressError(400,result.error);
   }else{
      next();
   }
}





//Index Route

 app.get("/listings",  wrapAsync(async(req,res)=>{
   const allListings=await Listing.find({})
   res.render("listings/index",{allListings});
 }));


//New Route


app.get("/listings/new", (req,res)=>{
   res.render("listings/new.ejs")
})


// //Show Route


// app.get("/listings/:id",  wrapAsync(async(req,res)=>{
//     let {id} =req.params;
//     const listing = await Listing.findById(id);
//       console.log("📸 Listing data:", listing);  
//    res.render("listings/show.ejs",{listing})
// }));


// Show Route

app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    console.log("📸 Listing data:", listing);

    if (!listing) {
        // Agar koi listing nahi mili to error throw karo
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listings/show.ejs", { listing });
}));




//Create Route


app.post("/listings",
   validateListing,
   wrapAsync( async (req, res,next) => {
 
const newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
})
  

);



//Edit Route


app.get("/listings/:id/edit",   wrapAsync(async(req,res)=>{
  let {id} =req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
}));


//Update Route


app.put("/listings/:id", 
   validateListing,
    wrapAsync(async (req,res)=>{
   let{id} = req.params;
     // Fallback image
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
      url: "https://via.placeholder.com/300x200?text=No+Image"
    };
  }
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect(`/listings/${id}`);
}));
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;

  // Safely normalize image data
  if (typeof req.body.listing.image === "string") {
    req.body.listing.image = { url: req.body.listing.image };
  }

  // Fallback if no image provided
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
      url: "https://via.placeholder.com/300x200?text=No+Image"
    };
  }

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));



//Delete Route


app.delete("/listings/:id",  wrapAsync( async(req,res)=>{
    let {id} =req.params;
  let deleteListing= await Listing.findByIdAndDelete(id)
  console.log(deleteListing);
  res.redirect("/listings");
}));



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


app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found!"));
});


app.use((err, req, res, next) => {
   
   const { statusCode = 500, message = "Something went wrong!" } = err;
   //res.status(statusCode).send(message);
   res.status(statusCode).render("error.ejs",{message});
});


 app.listen(8080,()=>{
    console.log("server is listening to port 8080")
 });
