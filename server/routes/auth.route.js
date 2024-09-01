import express from "express";
import { getUserBySearch, userSignIn, userSignUp } from "../controller/auth.controller.js";

const userAuthRouter=express.Router();



userAuthRouter
.post('/signup',userSignUp)
.post('/signin',userSignIn)
.post('/search-users',getUserBySearch)

export default userAuthRouter;