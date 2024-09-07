import express from "express";
import { ChangePassword, getProfileById, userSignIn, userSignUp } from "../controller/auth.controller.js";
import {verifyJWT} from '../utils/jwt.verification.js'

const userAuthRouter=express.Router();



userAuthRouter
.post('/signup',userSignUp)
.post('/signin',userSignIn)
.post('/get-profile',getProfileById)
.post('/change-password',verifyJWT,ChangePassword)


export default userAuthRouter;