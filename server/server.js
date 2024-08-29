import express from 'express'
import db from './config/mongoDB.config.js';
import userAuthRouter from './routes/auth.route.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import cors from 'cors'
import { config } from 'dotenv';
config({ path: ".env" })

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors(
    {
        origin: [process.env.FRONTEND_URL],
        methods: ["PUT", "POST", "GET", "DELETE", "PATCH"],
        credentials: true
    }
));


// Authentication handling 
server.use('/api/v1/user',userAuthRouter)
server.use(errorMiddleware)



server.listen(process.env.PORT, () => {
    // database function calling 
    db();
    console.log("server Started on port " + (process.env.PORT));
})