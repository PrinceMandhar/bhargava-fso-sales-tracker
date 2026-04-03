// GOOGLE APPS SCRIPT WEB APP URL
const API_URL = "https://script.google.com/macros/s/AKfycbz3mUf7n0Ls3KRWQmCx2WugrmvFv6ZzHnICEFhixW5fNlzsNlGphSxlKqm01YFsnz3n/exec"


let userRow=null;

async function login(){

let name=document.getElementById("name").value
let emp=document.getElementById("emp").value

let res=await fetch(API_URL+"?action=login&name="+name+"&emp="+emp)
let data=await res.json()

if(data.status=="success"){

userRow=data.row

document.getElementById("loginPage").style.display="none"
document.getElementById("appPage").style.display="block"

document.getElementById("fsoName").innerText=data.name
document.getElementById("empCode").innerText=data.emp
document.getElementById("hq").innerText=data.hq

loadAchieved(data.sales)
loadStock(data.stock)

}else{
alert("Invalid Login")
}

}


function loadAchieved(sales){

let achieved=document.querySelectorAll(".achieved")

for(let i=0;i<achieved.length;i++){
achieved[i].innerText=sales[i] || 0
}

updateDeficit()
}


function loadStock(stock){

let stockInputs=document.querySelectorAll(".stock")

for(let i=0;i<stockInputs.length;i++){
stockInputs[i].value=stock[i] || 0
}

}


function enableStockEdit(btn){
let row=btn.parentElement.parentElement
let stockInput=row.querySelector(".stock")

stockInput.disabled=false
stockInput.focus()
}


function updateDeficit(){

let targets=document.querySelectorAll(".target")
let achieved=document.querySelectorAll(".achieved")
let deficit=document.querySelectorAll(".deficit")

for(let i=0;i<targets.length;i++){

let t=parseInt(targets[i].innerText)
let a=parseInt(achieved[i].innerText)

let d=t-a

deficit[i].innerText=d

if(a<t){
achieved[i].style.color="red"
}else{
achieved[i].style.color="green"
}

}

}


async function submitSales(){

let inputs=document.querySelectorAll(".entry")
let achieved=document.querySelectorAll(".achieved")

let arr=[]

for(let i=0;i<inputs.length;i++){

let add=parseInt(inputs[i].value || 0)
let old=parseInt(achieved[i].innerText || 0)

let total=old+add

achieved[i].innerText=total

arr.push(total)

inputs[i].value=""
}

updateDeficit()

await fetch(API_URL+"?action=submit&row="+userRow+"&data="+JSON.stringify(arr))

alert("Sales Updated Successfully")

}


async function submitStock(){

let stock=document.querySelectorAll(".stock")
let arr=[]

for(let i=0;i<stock.length;i++){
arr.push(parseInt(stock[i].value || 0))
}

await fetch(API_URL+"?action=stock&emp="+document.getElementById("empCode").innerText+"&data="+JSON.stringify(arr))

alert("Stock Updated Successfully")
}

window.onload=function(){
updateDeficit()
}
/* ================= IMAGE SLIDER ================= */

.image-slider{
  position:relative;
  width:100%;
  max-width:500px;
  margin:30px auto;
  overflow:hidden;
  border-radius:15px;
  box-shadow:0 0 15px rgba(255,75,92,0.5);
}

.slider-wrapper{
  display:flex;
  transition:transform 0.5s ease-in-out;
}

.slide{
  min-width:100%;
  text-align:center;
  background:#000;
}

.slide img{
  width:100%;
  height:250px;
  object-fit:contain;
}

/* Buttons */
.slide-btn{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  background:rgba(0,0,0,0.6);
  border:none;
  color:white;
  font-size:25px;
  padding:5px 10px;
  cursor:pointer;
  border-radius:50%;
}

.prev{ left:10px; }
.next{ right:10px; }

.slide-btn:hover{
  background:#ff4b5c;
}
