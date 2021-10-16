const authapi=(req,res ,next)=>
{
    if(!req.session.user)
    {
        return res.send({error:"You are not authorized"});
    }
    next();
}
module.exports=authapi;