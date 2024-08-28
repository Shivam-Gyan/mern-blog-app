import express from "express";
import { userSignIn, userSignUp } from "../controller/auth.controller.js";

const userAuthRouter=express.Router();



userAuthRouter
.post('/signup',userSignUp)
.post('/signin',userSignIn)

export default userAuthRouter;