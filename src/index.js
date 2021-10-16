const path=require("path");
const express=require("express");
const fileUpload=require("express-fileupload");

require("./db/mongoose.js");
const hbs=require("hbs");
const session=require("express-session");

const userRouter=require("./routers/user-router.js");
const taskRouter=require("./routers/task-router.js");

const app=express();
const port=process.env.PORT;

app.use(session({secret:"something",saveUninitialized:true,resave:true}));

app.use(express.urlencoded({extended:true}));
app.use(fileUpload());
app.use(express.json());

app.set("view engine","hbs");

const publicDerectoryPath=path.join(__dirname,"../public");
app.use(express.static(publicDerectoryPath));

app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});
