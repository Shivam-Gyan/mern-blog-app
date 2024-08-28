import express from 'express'
import db from './config/mongoDB.config.js';
import userAuthRouter from './routes/auth.route.js';
import { config } from 'dotenv';
config({ path: "./config/config.env" })

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));


// Authentication handling 
server.use('/api/v1/user',userAuthRouter)



server.listen(process.env.PORT, () => {
    // database function calling 
    db();
    console.log("server Started on port " + (process.env.PORT));
})