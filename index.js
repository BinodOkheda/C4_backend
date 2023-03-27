const express =  require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json())
require("dotenv").config()
const cors = require("cors");
const { userRouter } = require("./routes/user.route");
app.use(cors())
const {auth}= require("./middleware/auth.middleware");
const { postRouter } = require("./routes/post.route");

app.use("/users",userRouter)

app.use(auth)
app.use("/posts",postRouter)


app.listen(process.env.port,async()=>{
   try {
    await mongoose.connect(process.env.mongoURL)
    console.log("connected to DB")
    
   } catch (error) {
     
      console.log(error.message)
   }

   console.log(`server is running at ${process.env.port}`)
})