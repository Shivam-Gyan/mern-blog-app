import cloudinary from 'cloudinary'
import ErrorHandler from '../middleware/error.middleware.js';


// create Url of Uploaded image
export const UplaodCloudinary=async(req,res,next)=>{

    if (!req.files || Object.keys(req.files).length == 0) {
        return next(new ErrorHandler("Please uplaod and image", 404));
    }
    const { image } = req.files;
    
    const cloudinaryResponse = await cloudinary.uploader.upload(
        image.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error :: ", cloudinaryResponse.error || "Unknown cludinary error")
    }
    res.status(200).json({
        success:true,
        message:"upload successfull",
        image_url:cloudinaryResponse.url
    })
}