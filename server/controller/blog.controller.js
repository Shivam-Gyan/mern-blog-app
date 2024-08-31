import cloudinary from 'cloudinary'
import ErrorHandler from '../middleware/error.middleware.js';
import { nanoid } from 'nanoid'
import Blog from '../Schema/Blog.js'
import User from '../Schema/User.js'

// create Url of Uploaded image
export const UplaodCloudinary = async (req, res, next) => {

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
        success: true,
        message: "upload successfull",
        image_url: cloudinaryResponse.url
    })
}


// crating controller to create a blog and save to server on publish


export const CreateBlog = async (req, res, next) => {

    let authorId = req.user;

    let { title, banner, content, tags, des, draft } = req.body

    if (!title.length) {
        return next(new ErrorHandler("provide a title to blog", 403))
    }
    if(!draft){

        if (!des.length || des.length > 200) {
            return next(new ErrorHandler("des should be 200 words only ", 403))
        }
    
        if (!banner.length) {
            return next(new ErrorHandler("add a banner to blog to publish it", 403))
        }
        if (!content.blocks.length) {
            return next(new ErrorHandler("add blog content to publish it", 403))
        }
        if (!tags.length || tags.length > 10) {
            return next(new ErrorHandler("please add tags to publish it, Maximium 10 ", 403))
        }
    }

    // to convert tags in lowercase in other to search it 

    tags = tags.map(tag => tag.toLowerCase());

    // instead of using object _id of each block blog ,
    // we can create our own blogId which protect data from breaching

    const blogId = title.replace(/[^a-zA-z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid()


    let blog = new Blog({
        title,
        banner,
        blog_id:blogId,
        des,
        content,
        tags,
        author: authorId,
        draft: Boolean(draft)
    })

    await blog.save()
        .then(async (data) => {
            // if the post is in draft then not increment the total no of post of author else increase by 1
            let authorPosts = draft ? 0 : 1
            await User.findOneAndUpdate(
                { _id: authorId },
                {
                    $inc: { "account_info.total_posts": authorPosts },
                    $push: { "blogs": data._id }
                }
            ).then(user => {
                return res.status(200).json({
                    id: blog.blog_id
                })
            }).catch(err => {
                return next(new ErrorHandler("failed to upload post", 500))
            })

        })
        .catch(err => {
            return next(new ErrorHandler(err.message, 500))
        })

}



export const getLatestBlog=async(req,res,next)=>{
    let maxLimit=5;

    await Blog.find({draft:false})
    .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt":-1})
    .select("blog_id title des activity banner tags publishedAt -_id")
    .limit(maxLimit)
    .then(blogs=>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return next(new ErrorHandler(err.message,500))
    })
}


export const getTrendingBlog=async(req,res,next)=>{

    let maxLimit=5;

    await Blog.find({draft:false})
    .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"activity.total_likes":-1,"activity.total_reads":-1,"publishedAt":-1})
    .select("blog_id title  publishedAt -_id")
    .limit(maxLimit)
    .then(blogs=>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return next(new ErrorHandler(err.message,500))
    })
}


export const getBlogBySearch=async(req,res,next)=>{

        const {tag}=req.body
        const findQuery={tags:tag,draft:false}

        const maxLimit=5;
        
        await Blog.find(findQuery)
        .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({"publishedAt":-1})
        .select("blog_id title des activity banner tags publishedAt -_id")
        .limit(maxLimit)
        .then(blogs=>{
            return res.status(200).json({blogs})
        })
        .catch(err=>{
            return next(new ErrorHandler(err.message,500))
        })
}