// GOOGLE APPS SCRIPT WEB APP URL
const API_URL = "https://script.google.com/macros/s/AKfycbxjv6K3_Q7_gv7zy6N8bs4JhdpiDuqjiv8Mk1ZFfbJ1jVZvf9b67312-N28VwY3T98pIA/exec"


let userRow=null;

async function login(){

let name=document.getElementById("name").value;
let emp=document.getElementById("emp").value;

let res=await fetch(API_URL+"?action=login&name="+name+"&emp="+emp);

let data=await res.json();

if(data.status=="success"){

userRow=data.row;

document.getElementById("loginPage").style.display="none";
document.getElementById("appPage").style.display="block";

document.getElementById("fsoName").innerText=data.name;
document.getElementById("empCode").innerText=data.emp;
document.getElementById("hq").innerText=data.hq;

loadAchieved(data.sales);

}
else{

alert("Invalid Login");

}

}


function loadAchieved(sales){

let achieved=document.querySelectorAll(".achieved");

for(let i=0;i<achieved.length;i++){

achieved[i].innerText=sales[i] || 0;

}

}



async function submitSales(){

let inputs=document.querySelectorAll(".unit");
let achieved=document.querySelectorAll(".achieved");

let arr=[];

for(let i=0;i<inputs.length;i++){

let add=parseInt(inputs[i].value||0);
let old=parseInt(achieved[i].innerText||0);

let total=old+add;

achieved[i].innerText=total;

arr.push(total);

inputs[i].value="";

}

await fetch(API_URL+"?action=submit&row="+userRow+"&data="+JSON.stringify(arr));

alert("Sales Updated");

}