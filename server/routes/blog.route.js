import { UplaodCloudinary } from "../controller/blog.controller.js";

import express from "express";


const BlogRouter=express.Router();


BlogRouter
.post('/get-image-url',UplaodCloudinary)


export default BlogRouter