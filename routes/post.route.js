const mongoose = require("mongoose");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
app.use(express.json())

const {PostModel}= require("../models/post.model")
const postRouter = express.Router()

postRouter.post("/add",async (req,res)=>{

  const {title,body,device,no_of_comments}=req.body
  console.log(req.body)
  try {
    
    const post = new PostModel(req.body)
    await post.save()

    res.status(200).json({msg:"post has been posted.."})

  } catch (error) {
    
     res.status(500).json({msg:"something went worng please try again later"})
  
 }

})

postRouter.get("/",async (req,res)=>{
    const {userID} = req.body;
   const {page,min,max}=req.query;
   filter={userID}
   if(page){
    skip=(page-1)*limit
   }
   if(min && max){
    filter.$and=[{no_of_comments:{$gt:min}},{no_of_comments:{$lt:max}}]
   }else  if(min){
    filter.no_of_comments={$gt:min}
   }else if(max){
    filter.no_of_comments={$lt:max}
   }
    try {

       
        console.log(userID)
        const posts = await PostModel.find(filter).skip(skip).limit(3)
        res.status(200).send(posts)
      
    } catch (error) {
        res.status(400).send({msg:"something went worng please try again later..."})
    }





})

postRouter.get("/top",async (req,res)=>{

const {userID} = req.body
const {page} = req.query;
if(page){
    skip = (page-1)*3
}

   try {
    
   const posts = await PostModel.find({userID}).sort({no_of_comments:1}).skip(skip).limit(3)
  
   res.status(200).send(posts)


   } catch (error) {
     
  
   }

})

postRouter.patch("/update/:postID",async (req,res)=>{


    try {

    var decoded = jwt.verify(token, 'IamYourSuperMan');
    const {postID} = req.params
    const post = await PostModel.findOne(postID)

    if(decoded.userID===post.userID){
        await PostModel.findByIdAndUpdate({_id:postID},req.body)
        res.status(200).send({msg:"post has been updated..."})
    }else{
        res.status(400).send({msg:"You are not allowed to update this post.."})

    }


    } catch (error) {

        res.status(500).send({msg:"something went wrong please try again later..."})
        
    }

    


})

postRouter.delete("/delete/:postID",async (req,res)=>{


    
    try {

        var decoded = jwt.verify(token, 'IamYourSuperMan');
        const {postID} = req.params
        const post = await PostModel.findOne(postID)
    
        if(decoded.userID===post.userID){
            await PostModel.findByIdAndDelete({_id:postID})
            res.status(200).send({msg:"post has been updated..."})
        }else{
            res.status(400).send({msg:"You are not allowed to delete this post.."})
    
        }
    
    
        } catch (error) {
    
            res.status(500).send({msg:"something went wrong please try again later..."})
            
        }
    
        
    
})

module.exports = {

    postRouter
    
}