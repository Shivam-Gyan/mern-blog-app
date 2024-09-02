import express from "express";
import { getUserBySearch } from "../controller/user.controller.js";

const UserRouter=express.Router();

UserRouter
.post('/search-users',getUserBySearch)


export default UserRouter;