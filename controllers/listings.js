const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
   const allListings= await Listing.find({})
   res.render("listings/index",{allListings});
 }


 module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
    populate:{
      path:"author",
    },
  })
    .populate("owner");
     
    if (!listing) {
      req.flash("error","Listing you requested for does not exist! ");
      res.redirect("/listings");  
    }

    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
  const { path: url, filename } = req.file;

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };

  await newlisting.save();
  req.flash("success", "New Listing Created");
  res.redirect(`/listings/${newlisting._id}`);
};


module.exports.renderEditForm = async(req,res)=>{
  let {id} =req.params;
   const listing = await Listing.findById(id);
     
    if (!listing) {
      req.flash("error","Listing you requested for does not exist! ");
      res.redirect("/listings");  
    }

     let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

   res.render("listings/edit.ejs",{listing,originalImageUrl});


};




module.exports.updateListing = async (req,res)=>{
   let{id} = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if( typeof req.file !== "undefined"){
    const { path: url, filename } = req.file;
     listing.image = { url, filename };
    await listing.save();
}
   req.flash("success","Listing Updated ");
  res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req,res)=>{
    let {id} =req.params;
  let deleteListing= await Listing.findByIdAndDelete(id)
  console.log(deleteListing);
 req.flash("success","Listing deleted");
  res.redirect("/listings");
};