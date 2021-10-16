const express= require("express");
const path=require("path");
const User=require("../models/user.js");
const auth=require("../middleware/auth.js");
const authAPI=require("../middleware/api-auth.js");
const email=require("../email/account.js");
const objectID=require("mongodb").ObjectId;
const { findOne } = require("../models/user.js");

const router=express.Router();

// -------------- API End Points--------------

router.get("/",(req,res)=>{

    if(req.session.user)
    {
        req.session.user=undefined;
    }
    res.render("index", {msg:req.query.msg});
});
router.get("/signup",(req,res)=>{
    res.render("signup");
})

router.get("/api/user/confirm_account", async(req,res)=>{
    
    const userID=req.query.userid;
    const secret=req.query.secret;
    try
    {
       
        const user=await User.findOneAndUpdate({_id:userID,secret:secret},{confirmed:true});
        console.log(user);
        if(!user)
        {
            return res.redirect("/");
        }
        res.redirect("/?msg=E-mail confirmed please login")
    }
    catch(e)
    { 
        res.redirect("/");
    }
});
// Endpoint for loging
router.get("/profile",auth,(req,res)=>
{
    res.render("profile",{user:req.session.user});
});
router.post("/api/users/login",async(req,res)=>
{
    try
    {
      
        const user=await User.findByCredentials(req.body.email,req.body.password);
      
        if(!user)
        {

            return res.send({
                error:"Invalid Credentials"
            });
        }
        req.session.user=user;
        res.send(user);
    }
    catch(e)
    {
         res.send({
            error:"Cant log to the system"
        });
    }
});

// Endpoint for creating user
router.post("/api/users",async (req,res)=>
{
     req.body.secret=new  objectID().toHexString();
    const user=new User(req.body);
    try{
         await user.save();
         res.send(User.getUserPublicData(user));
         email.confirmMail(user);
    }catch(e)
    {
        res.send(e);
    }
  
});

// Endpoint for reading all user

router.get("/api/users",async (req,res)=>{

            try{
                const user =await User.find({},{password:0});
                res.send(User.getUserPublicData(user));
            }
            catch(e)
            {
                res.send(e);
            }
            
        });

// Endpoint for reading a user
router.get("/api/users",authAPI, async(req,res)=>{

        try{
            const user = await User.findById(req.session.user._id);
            if(!user)
            {
                return res.status(404).send("User not found")
            }
            res.send(User.getUserPublicData(user));
        }
        catch(e)
    {
        res.send(e);
    }
});

// Endpoint for  update a user
router.patch("/api/user",authAPI, async(req,res)=>{

    if(req.files)
    {
        const result=   User.uploadAvatar(req.files.profileimage);

        if(result.error)
        {
            res.send({error:result.error});
        }
        req.body.imagePath=result.fileName;
      
    }

    const id=req.session.user._id;
    const allowedFeilds=["name","email","age","password","imagePath"];
    const updateFeilds=Object.keys(req.body);
   
    const isValid=updateFeilds.every((feilds)=>{
      
        return allowedFeilds.includes(feilds);
    });
   
    if(!isValid)
    {
        return res.send({error:"Invalid update"});
    }
    try
    {
     const user =await User.findById(id);
     const PreviousImage=user.imagePath;
    if(!user)
    {
         return res.send("User not found")
    }
    updateFeilds.forEach((update)=>{
        user[update]=req.body[update];
    });
   await user.save();

   req.session.user=User.getUserPublicData(user);
   res.send(User.getUserPublicData(user));
   
        if(PreviousImage !==user.imagePath)
        {
            //delete user
            await  User.deleteAvatar(PreviousImage);
        }
     }
     catch(e)
    {
        res.send(e);
    }
    
});

// Endpoint for  Delete a user
router.delete("/api/user",authAPI,async (req,res)=>{
    try
    {
        const id=req.session.user._id;
        const user=await User.findByIdAndDelete(id);
        if(!user){
            return res.send("No user found");
        }
        res.send(User.getUserPublicData(user));
    }
    catch(e)
    {
res.send(e);
    }
});

module.exports=router;