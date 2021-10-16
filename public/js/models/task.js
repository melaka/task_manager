const getTask=async(searchText)=>{

    var url="/api/tasks";
    if(searchText=="" || searchText)
    {
      url="/api/tasks?search="+searchText;
    }
  const response= await  fetch(url);
  const task= await response.json();

  var taskHTML="";
  task.forEach((task)=>{
      taskHTML +=CreateTaskCard(task)
  });
  $("#taskwraper").html(taskHTML);
}
const createTask=async()=>{
    try
    {
      const url="/api/tasks";
  
      const data={
        
         // "description":$("#desciption").val(),
        //  "Completed":$("#competed").val()
        
        description:document.querySelector("#desciption").value,
        Completed:document.querySelector("#competed").checked
      }
     
      showLoader("#btn-add-task",{content:loader});
        if(data.description.length===0)
        {
          
          return console.log("No description to save");
        }
  
      const response=await fetch(url,{
        method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
      });
      const task=await response.json();
     if(!task)
     {
       return console.log("Unable to crate task")
     }
     const taskCard=CreateTaskCard(task);
     const taskList=document.querySelector("#taskwraper");
     taskList.innerHTML=taskList.innerHTML+taskCard;
     
     showSucses("Saved successfully");
     hideModel("createModal");
     
    }
    catch
    {
  
    }
    finally{
      hideLoader("#btn-add-task",{content:"Add +"});
    }
  }
  
  
    const initiateUpdate=async(id)=>{
      try
      {
          const url="/api/tasks/"+id;
          updateValidation.resetForm();
          const desvInput=document.querySelector("#Update-desciption");
          desvInput.classList.remove("error");
  
          const response =await fetch(url);
        
          const task=await response.json();
         
          if(!task)
          {
          return  console.log("no task found");
          }
          document.querySelector("#Update-desciption").value=task.description;
          document.querySelector("#update-competed").checked=task.Completed;
          document.querySelector("#taskid").value=task._id;
        // console.log(id);
        // $('#updateModal').modal();
         showModel("updateModal")
      }
      catch(e)
      {
        console.log(e);
      }
  
  }
  
  const initiateDelete=(id)=>{
  try
  {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        deleteTask(id);
  
  
      } 
    });
  }
  catch(e)
  {
    console.log(e)
  }
  }
  
  const deleteTask=async (id)=>{
    const taskid= id;
      try{
    
      const url="/api/tasks/"+id;
  
      const response= await  fetch(url,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        }
       
      });
      showLoader("#task-"+id+" .btn-danger",{content:generalLoader});
      console.log(id);
      const task= await response.json();
      if(!task)
      {
        return console.log("no task found");
      }
      document.querySelector("#task-"+id).remove();
      showSucses("Delete successfully");
    }
    catch(e)
    {
      console.log(e);
    }
    
    finally{
     console.log(taskid);
    }
  }
  
  const updateTask =async ()=>
    {
      const taskid=document.querySelector("#taskid").value;
    try
    {
      const data={
        
       
       description:document.querySelector("#Update-desciption").value,
       Completed:document.querySelector("#update-competed").checked
     }
  
      
      const url="/api/tasks/"+taskid;
  
      showLoader("#task-"+taskid+" .btn-primary",{content:generalLoader});
  
      const response= await  fetch(url,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      });
      const task= await response.json();
      if(!task)
      {
        return console.log("no task found");
      }
      document.querySelector("#task-"+task._id+" "+"h5").textContent=task.description;
      document.querySelector("#task-"+task._id).classList.remove("bg-color");
if(task.Completed)
{
    document.querySelector("#task-"+task._id).classList.add("bg-color");
}

      showSucses("Update successfully");
      hideModel("updateModal");
    }
    catch(e)
    {
      console.log(e);
    }
    finally{
      hideLoader("#task-"+taskid+" .btn-primary",{content:`<i class="far fa-edit"></i>`});
    }
  
  }
  
  const CreateTaskCard=(task)=>{

    var color="";
    if(task.Completed)
    {
        color="bg-color";
    }
  return`
     
     <div class="task-card ${color}" id="task-${task._id}">
     <h5>${task.description}</h5>
     <div class="curd-buttons">
       <button type="button" class="btn btn-primary btn-sm" onclick="initiateUpdate('${task._id}')"><i class="far fa-edit"></i></button>
       <button type="button" class="btn btn-danger btn-sm" onclick="initiateDelete('${task._id}')"><i class="fas fa-minus-circle"></i></button>
     </div>
  </div>`
     
  }
  getTask();

  
const createForm=$("#create-task-form");
const updateForm=$("#update-task-form");
const searchForm=$("#searh-fom");

createForm.validate({
  rules : {
    desciption:{
      required:true
    }
  }
});

const updateValidation= updateForm.validate({
  rules : {
    updateDes:{
      required:true
    }
  }
});

createForm.on("submit",(e)=>
{
  e.preventDefault();
if(createForm.valid())
{
  createTask();
  createForm[0].reset();
}

  
});

updateForm.on("submit",(e)=>{
  e.preventDefault();

  if(updateForm.valid())
  {
    updateTask();
  }
});

searchForm.on("submit",(e)=>{
  e.preventDefault();

  const searchText=$("#searh-fom input").val();
 

  getTask(searchText);
});