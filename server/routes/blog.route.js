import { CreateBlog, UplaodCloudinary } from "../controller/blog.controller.js";
import express from "express";
import { verifyJWT } from "../utils/jwt.verification.js";


const BlogRouter=express.Router();


BlogRouter
.post('/get-image-url',UplaodCloudinary)
.post('/create-blog',verifyJWT,CreateBlog)


export default BlogRouter