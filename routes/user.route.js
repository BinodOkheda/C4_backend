const mongoose = require("mongoose");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
app.use(express.json())
const bcrypt = require("bcrypt")
const {UserModel}= require("../models/user.model")
const userRouter = express.Router();

userRouter.post("/register", async (req,res)=>{
    console.log(req.body)
    const {name,email,gender,password,age,city,is_married} = req.body
 
    try {
        
        const hash = bcrypt.hashSync(password,5);
        const user = new UserModel({name,email,gender,password:hash,age,city,is_married})
        await user.save()
        res.status(200).json({msg:"User has been registered...."})

    } catch (error) {
        
        res.status(400).json({msg:"User already exist, please login.."})
    }


})


userRouter.post("/login", async (req,res)=>{


    const {email,password}= req.body
    try {
        const user = await UserModel.findOne({email})
        const hash = user.password
        const result=bcrypt.compareSync(password, hash)
        if(result){
             res.status(200).send({msg:"login successful..", token: jwt.sign({ userID:user._id }, 'IamYourSuperMan')})
             
        }else{
            res.status(400).send({msg:"wrong credential...!!"})
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({msg:error.message})
    }


})

module.exports={
    userRouter
}