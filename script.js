// ================= API =================
const API_URL = "https://script.google.com/macros/s/AKfycbzUjj3ANQ0DdffWfqT5uq67fBebj2xcrrgc2wIZ-t2SN3tXoWF9Aqra_I2ZEXkLuVS78Q/exec"

let userRow = null;


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
loadDistributor(data.dist) // NEW

}else{
alert("Invalid Login")
}

}


// ================= LOAD ACHIEVED =================
function loadAchieved(sales){

let achieved = document.querySelectorAll(".achieved")

for(let i=0;i<achieved.length;i++){
achieved[i].innerText = sales[i] || 0
}

updateDeficit()
updateAllStockAvailable()

}


// ================= LOAD STOCK =================
function loadStock(stock){

let stockInputs = document.querySelectorAll(".stock")

for(let i=0;i<stockInputs.length;i++){
stockInputs[i].value = stock[i] || 0
}

updateAllStockAvailable()

}


// ================= LOAD DISTRIBUTOR =================
function loadDistributor(dist){

let distInputs = document.querySelectorAll(".dist-entry")

for(let i=0;i<distInputs.length;i++){
distInputs[i].value = dist[i] || 0
}

updateAllStockAvailable()

}


// ================= ENABLE STOCK EDIT =================
function enableStockEdit(btn){
let row = btn.parentElement.parentElement
let stockInput = row.querySelector(".stock")

stockInput.disabled = false
stockInput.focus()
}


// ================= DEFICIT =================
function updateDeficit(){

let targets = document.querySelectorAll(".target")
let achieved = document.querySelectorAll(".achieved")
let deficit = document.querySelectorAll(".deficit")

for(let i=0;i<targets.length;i++){

let t = parseInt(targets[i].innerText) || 0
let a = parseInt(achieved[i].innerText) || 0

let d = t - a

deficit[i].innerText = d

if(a < t){
achieved[i].style.color="red"
}else{
achieved[i].style.color="green"
}

}

}


// ================= LIVE CALCULATION =================
function calculateRow(input){

let row = input.closest("tr")

let entry = parseInt(row.querySelector(".entry").value) || 0
let dist  = parseInt(row.querySelector(".dist-entry").value) || 0
let stock = parseInt(row.querySelector(".stock").value) || 0

let achieved = parseInt(row.querySelector(".achieved").innerText) || 0
let target = parseInt(row.querySelector(".target").innerText) || 0

let deficit = row.querySelector(".deficit")
let stockAvailable = row.querySelector(".stock-available")

// preview achieved
let previewAchieved = achieved + entry

// update deficit
deficit.innerText = target - previewAchieved

// stock available = stock - achieved - distributor
let available = stock - previewAchieved - dist

stockAvailable.innerText = available

// color
if(available < 0){
stockAvailable.style.color = "red"
}else{
stockAvailable.style.color = "green"
}

}


// ================= UPDATE ALL =================
function updateAllStockAvailable(){

let rows = document.querySelectorAll("table tr")

rows.forEach((row,index)=>{

if(index===0) return

let achieved = parseInt(row.querySelector(".achieved")?.innerText) || 0
let dist  = parseInt(row.querySelector(".dist-entry")?.value) || 0
let stock = parseInt(row.querySelector(".stock")?.value) || 0

let stockAvailable = row.querySelector(".stock-available")

if(stockAvailable){

let available = stock - achieved - dist

stockAvailable.innerText = available

if(available < 0){
stockAvailable.style.color = "red"
}else{
stockAvailable.style.color = "green"
}

}

})

}


// ================= SUBMIT SALES =================
async function submitSales(){

let entryInputs = document.querySelectorAll(".entry")
let distInputs  = document.querySelectorAll(".dist-entry")
let achieved    = document.querySelectorAll(".achieved")

let salesArr = []
let distArr  = []

for(let i=0;i<entryInputs.length;i++){

let entry = parseInt(entryInputs[i].value) || 0
let dist  = parseInt(distInputs[i].value) || 0
let old   = parseInt(achieved[i].innerText) || 0

let total = old + entry

achieved[i].innerText = total

salesArr.push(total)
distArr.push(dist)

entryInputs[i].value = ""
distInputs[i].value = ""
}

updateDeficit()
updateAllStockAvailable()

// SAVE BOTH
await fetch(API_URL+"?action=submit&row="+userRow+"&data="+JSON.stringify(salesArr))
await fetch(API_URL+"?action=dist&emp="+document.getElementById("empCode").innerText+"&data="+JSON.stringify(distArr))

alert("Sales + Distributor Saved")

}


// ================= SUBMIT STOCK =================
async function submitStock(){

let stock = document.querySelectorAll(".stock")
let arr = []

for(let i=0;i<stock.length;i++){
arr.push(parseInt(stock[i].value || 0))
}

await fetch(API_URL+"?action=stock&emp="+document.getElementById("empCode").innerText+"&data="+JSON.stringify(arr))

updateAllStockAvailable()

alert("Stock Updated")

}


// ================= PAGE LOAD =================
window.onload=function(){
updateDeficit()
updateAllStockAvailable()
}


// ================= SLIDER =================
let index = 0;

function updateSlider(){
const track = document.getElementById("sliderTrack")
track.style.transform = "translateX(-" + (index * 100) + "%)"
}

function nextSlide(){
const slides = document.querySelectorAll(".slide")
index++
if(index >= slides.length){
index = 0
}
updateSlider()
}

function prevSlide(){
const slides = document.querySelectorAll(".slide")
index--
if(index < 0){
index = slides.length - 1
}
updateSlider()
}

setInterval(() => {
nextSlide()
}, 3000)
