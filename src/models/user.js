const mongoose = require("mongoose");
const validator=require("validator");
const bcrypyjs=require("bcryptjs");
const fs=require("fs");
const onjectId=require("mongodb").ObjectId;
const path=require("path");

const userSchema=mongoose.Schema({
    name :{
       type:String,
       required:true,
       trim:true
    },
    age :{
        type:Number,
        min:0,
        default:0
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate:(value)=>{
            if(!validator.isEmail(value))
            {
                throw new Error ("invalid email");
            }
        }
    },
    password:{
        type:String,
        min:7,
        trim:true,
        validate:(value)=>{
            if(value.toLowerCase().includes("password"))
            {
                throw new Error("password not be incoude key password")
            }
        }
    },
    imagePath:{
        type:String,
        default:"1.JPG"
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    secret:{
        type:String
    }
});

userSchema.pre("save",async function(next){

    const user=this;
if(user.isModified("password"))
{

    user.password=await bcrypyjs.hash(user.password,8);
}
next();
});
userSchema.statics.findByCredentials=async(email,password)=>{

    
    const user=await User.findOne({email:email});
     
    if(!user)
    {
        return {error:"Invalid credentials"};
    }
    const isMath=await bcrypyjs.compare(password,user.password);
    if(!isMath)
    {
        return {error:"Invalid credentials"};
    }
    if(!user.confirmed)
    {
        return {error:"Please confirm your account"};
    }
    return user;
};

userSchema.statics.uploadAvatar=(file)=>
{
    const fileName=file.name;
    const allowedFiles=["jpg","jpeg","JPEG","png"];
   
    const fileExtension=fileName.split(".").pop();
   

    if(!allowedFiles.includes(fileExtension))
    {
      return  {error:"file not match"};
    }
    const newFilename=new onjectId().toHexString()+"."+fileExtension;
        var results={fileName:newFilename};
    file.mv(path.resolve("./public/images/"+newFilename),(e)=>{
       
        if(e)
        {
            return  results.error="something went wrong";
        }

       
    });
     return results;
}
userSchema.statics.deleteAvatar= async (fileName)=>{
    if(fileName=="1.JPG")
    {
        return "";
    }
    var result="Image removed suscessfully";

    await fs.unlink("./public/images/"+fileName,(e)=>{
        if(e)
        {
            result="Unable to remove file";
        }
        return result;
    });
}
userSchema.statics.getUserPublicData=(user)=>{
   return {
            _id:user._id,
            name:user.name,
            age:user.age,
            email:user.email,
            imagePath:user.imagePath
    }
}

const User=mongoose.model("user",userSchema);

module.exports=User;