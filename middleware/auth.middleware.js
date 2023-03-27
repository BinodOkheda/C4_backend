const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
app.use(express.json())

const auth = (req,res,next)=>{

    const token = req.headers.authorization;

    try {
        var decoded = jwt.verify(token, 'IamYourSuperMan');
        if(decoded.userID){
          req.body.userID = decoded.userID
          return  next()
        }else{
          res.status(400).send({msg:"Login required...!"})
        }
        
      } catch(err) {
        // err
        res.send(err.message)
      }

}

module.exports = {
    auth
}