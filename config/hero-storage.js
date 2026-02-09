const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

const heroStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "hero",
      resource_type: "auto",   
      format: "jpg",          
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});


module.exports = heroStorage;
