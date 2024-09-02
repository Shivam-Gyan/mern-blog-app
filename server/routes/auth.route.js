import express from "express";
import { getProfileById, userSignIn, userSignUp } from "../controller/auth.controller.js";

const userAuthRouter=express.Router();



userAuthRouter
.post('/signup',userSignUp)
.post('/signin',userSignIn)
.post('/get-profile',getProfileById)


export default userAuthRouter;