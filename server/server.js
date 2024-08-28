import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'

const server = express();

server.use(express.json());


// await mongoose.connect(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_COMPASS)

server.post('/no', async(req, res) => {
    console.log("hello");
    console.log(req.body)
    res.json(req.body)
    
})


server.listen(process.env.PORT, () => {
    console.log("server Started on port " + (process.env.PORT));

})