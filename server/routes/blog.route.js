import { CreateBlog, getLatestBlog, getTrendingBlog, UplaodCloudinary } from "../controller/blog.controller.js";
import express from "express";
import { verifyJWT } from "../utils/jwt.verification.js";


const BlogRouter=express.Router();


BlogRouter
.post('/get-image-url',UplaodCloudinary)
.post('/create-blog',verifyJWT,CreateBlog)
.get('/latest-blogs',getLatestBlog)
.get('/trending-blogs',getTrendingBlog)


export default BlogRouter