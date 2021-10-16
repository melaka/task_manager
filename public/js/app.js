// globale reusable variable

const loader=` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
Loading...`;

const generalLoader=` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>`;

const showModel=(id,data)=>
{
  $("#desciption-error").hide();
  $(".error").removeClass("error");
  $('#'+id).modal();
}
const hideModel=(id,data)=>
{
  $('#'+id).modal("hide");
}
const showError=(message,option)=>{
  toastr.error(message);
};
const showSucses=(message,option)=>{
  toastr.success(message);
};

const showLoader=(selector,data)=>{
 
  document.querySelector(selector).innerHTML=data.content;
  document.querySelector(selector).disabled=true;
}
const hideLoader=(selector,data)=>{
  document.querySelector(selector).innerHTML=data.content;
  document.querySelector(selector).disabled=false;
}


