const API_URL = "https://script.google.com/macros/s/AKfycbzs12ztY9VDyX5kntBoBukpy4aCX2w0QEsIm2vK8u8JQd-ro8gY2-S-BiKJ8m1nzykrWA/exec"



let userRow = null

// ================= LOGIN =================
async function login(){

let name = document.getElementById("name").value
let emp = document.getElementById("emp").value

let res = await fetch(API_URL+"?action=login&name="+name+"&emp="+emp)
let data = await res.json()

if(data.status=="success"){

userRow = data.row

document.getElementById("loginPage").style.display="none"
document.getElementById("appPage").style.display="block"

document.getElementById("fsoName").innerText=data.name
document.getElementById("empCode").innerText=data.emp
document.getElementById("hq").innerText=data.hq

loadAchieved(data.sales)
loadStock(data.stock)
loadDistributor(data.dist)

}else{
alert("Invalid Login")
}
}


// ================= LOAD =================
function loadAchieved(sales){
document.querySelectorAll(".achieved").forEach((el,i)=>{
el.innerText = sales[i] || 0
})
updateAll()
}

function loadStock(stock){
document.querySelectorAll(".stock").forEach((el,i)=>{
el.value = stock[i] || 0
})
updateAll()
}

function loadDistributor(dist){
document.querySelectorAll(".dist-entry").forEach((el,i)=>{
el.value = dist[i] || 0
})
updateAll()
}


// ================= EDIT STOCK =================
function enableStockEdit(btn){
let row = btn.closest("tr")
let input = row.querySelector(".stock")
input.disabled = false
input.focus()
}


// ================= CALCULATION =================
function calculateRow(input){

let row = input.closest("tr")

let entry = parseInt(row.querySelector(".entry").value)||0
let dist  = parseInt(row.querySelector(".dist-entry").value)||0
let stock = parseInt(row.querySelector(".stock").value)||0
let achieved = parseInt(row.querySelector(".achieved").innerText)||0
let target = parseInt(row.querySelector(".target").innerText)||0

let preview = achieved + entry

// deficit
row.querySelector(".deficit").innerText = target - preview

// achieved color
row.querySelector(".achieved").style.color = (preview>=target)?"green":"red"

// stock available
let available = stock - preview - dist

let cell = row.querySelector(".stock-available")
cell.innerText = available
cell.style.color = (available<0)?"red":"green"
}


// ================= UPDATE ALL =================
function updateAll(){

document.querySelectorAll("table tr").forEach((row,i)=>{

if(i==0) return

let achieved = parseInt(row.querySelector(".achieved")?.innerText)||0
let dist  = parseInt(row.querySelector(".dist-entry")?.value)||0
let stock = parseInt(row.querySelector(".stock")?.value)||0
let target = parseInt(row.querySelector(".target")?.innerText)||0

// deficit
row.querySelector(".deficit").innerText = target - achieved

// achieved color
row.querySelector(".achieved").style.color = (achieved>=target)?"green":"red"

// stock available
let available = stock - achieved - dist

let cell = row.querySelector(".stock-available")
cell.innerText = available
cell.style.color = (available<0)?"red":"green"

})
}


// ================= SUBMIT SALES =================
async function submitSales(){

let entries = document.querySelectorAll(".entry")
let dists   = document.querySelectorAll(".dist-entry")
let achieved = document.querySelectorAll(".achieved")

let salesArr=[]
let distArr=[]

for(let i=0;i<entries.length;i++){

let entry = parseInt(entries[i].value)||0
let dist  = parseInt(dists[i].value)||0
let old   = parseInt(achieved[i].innerText)||0

let newAch = old + entry

achieved[i].innerText = newAch

salesArr.push(newAch)
distArr.push(dist)

entries[i].value=""
}

updateAll()

// SAVE SALES
await fetch(API_URL+"?action=submit&row="+userRow+"&data="+JSON.stringify(salesArr))

// SAVE DISTRIBUTOR
await fetch(API_URL+"?action=dist&emp="+document.getElementById("empCode").innerText+"&data="+JSON.stringify(distArr))

alert("Saved Successfully")
}


// ================= STOCK SAVE =================
async function submitStock(){

let stock = document.querySelectorAll(".stock")
let arr=[]

stock.forEach(el=>{
arr.push(parseInt(el.value)||0)
})

await fetch(API_URL+"?action=stock&emp="+document.getElementById("empCode").innerText+"&data="+JSON.stringify(arr))

updateAll()

alert("Stock Updated")
}


// ================= SLIDER =================
let index = 0

function updateSlider(){
const track = document.getElementById("sliderTrack")
track.style.transform = "translateX(-"+(index*100)+"%)"
}

function nextSlide(){
const slides = document.querySelectorAll(".slide")
index++
if(index>=slides.length) index=0
updateSlider()
}

function prevSlide(){
const slides = document.querySelectorAll(".slide")
index--
if(index<0) index=slides.length-1
updateSlider()
}

// AUTO SLIDE (4 sec)
setInterval(()=>{
nextSlide()
},4000)


// ================= INIT =================
window.onload=function(){
updateAll()
}
