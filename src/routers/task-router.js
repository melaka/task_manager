const express=require("express");

const Task=require("../models/task.js");
const auth=require("../middleware/auth.js");
const authAPI=require("../middleware/api-auth.js");

const router=express.Router();

router.get("/tasks",auth,(req,res)=>
{
    res.render("task",{user:req.session.user});
});



// Endpoint for Task
router.post("/api/tasks",authAPI,async (req,res)=>
{
    req.body.owner=req.session.user._id;
    const task=new Task(req.body)
    try
    {
        await task.save();
        res.send(task);
    }
    catch(e)
    {
        res.send(e);
    }
    

});

// Endpoint for reading all task

router.get("/api/tasks",authAPI, async(req,res)=>{
        const searchText=req.query.search;
    try
    {
       const ownerid=req.session.user._id;
        
        var task=[];

        if(searchText)
        {
            task=await Task.find({owner :ownerid,description:{ $regex:  searchText, $options:"i"  }});
            console.log(task);
        }
        else
        {
             task=await Task.find({owner :ownerid});
        }

        res.send(task);
    }
    catch(e)
    {
        res.send(e);
    }
   
});



// Endpoint for reading a task
router.get("/api/tasks/:id",authAPI, async(req,res)=>{
   
    try{
    const task=await Task.findById(req.params.id);
    if(!task)
      {
          return res.status(404).send("Task not found")
      }
        res.send(task);
    }
    catch(e)
    {
        res.send(e);
    }
   
   
});

// Endpoint for  update a task
router.patch("/api/tasks/:id",authAPI, async(req,res)=>{
    const id=req.params.id;
    const allowedFeilds=["description","Completed"];
    const updateFeilds=Object.keys(req.body);
   
    const isValid=updateFeilds.every((feilds)=>{
      
        return allowedFeilds.includes(feilds);
    });
   
    if(!isValid)
    {
        return res.status(400).send({error:"Invalid update"});
    }
    try
    {
     const task =await Task.findByIdAndUpdate(id,req.body,{new:true});
    if(!task)
    {
         return res.status(404).send("Task not found")
    }
    res.send(task);
     }
     catch(e)
    {
        res.send(e);
    }
    
});

// Endpoint for  Delete a task
router.delete("/api/tasks/:id",authAPI,async (req,res)=>{
    try
    {
        const id=req.params.id;
        const task=await Task.findByIdAndDelete(id);
        if(!task){
            return res.send("No task found");
        }
        res.send(task);
    }
    catch(e)
    {
        res.send(e);
    }
});
module.exports=router;