// GOOGLE APPS SCRIPT WEB APP URL
const API_URL = "https://script.google.com/macros/s/AKfycbyce_NtZ8ggOdGsDWsuKsOcrSqqe42BJ25mt_-kMvyYg1XiHWVgRo-w2JAH7-C8Wr3hFg/exec"

let userRow = null;

// ================= LOGIN =================
async function login(){

let name = encodeURIComponent(document.getElementById("name").value)
let emp = encodeURIComponent(document.getElementById("emp").value)
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

}else{
alert("Invalid Login")
}

}

// ================= LOAD ACHIEVED =================
function loadAchieved(sales){

let achieved = document.querySelectorAll(".achieved")

for(let i=0;i<achieved.length;i++){

let val = sales[i] || 0

achieved[i].innerText = val

// store original value (IMPORTANT)
achieved[i].setAttribute("data-base", val)

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

// ================= ENABLE STOCK EDIT =================
function enableStockEdit(btn){
let row = btn.parentElement.parentElement
let stockInput = row.querySelector(".stock")

stockInput.disabled = false
stockInput.focus()
}

// ================= DEFICIT UPDATE =================
function updateDeficit(){

let targets = document.querySelectorAll(".target")
let achieved = document.querySelectorAll(".achieved")
let deficit = document.querySelectorAll(".deficit")

for(let i=0;i<targets.length;i++){

let t = parseInt(targets[i].innerText)
let a = parseInt(achieved[i].innerText)

let d = t - a

deficit[i].innerText = d

if(a < t){
achieved[i].style.color="red"
}else{
achieved[i].style.color="green"
}

}

}

// ================= LIVE CALCULATION (ENTRY + STOCK) =================
function calculateRow(input){

let row = input.closest("tr")

let entry = parseInt(row.querySelector(".entry").value) || 0
let stock = parseInt(row.querySelector(".stock").value) || 0

let achievedEl = row.querySelector(".achieved")
let baseAchieved = parseInt(achievedEl.getAttribute("data-base")) || 0

let target = parseInt(row.querySelector(".target").innerText)
let deficit = row.querySelector(".deficit")
let stockAvailable = row.querySelector(".stock-available")

// preview = old + entry
let newAchieved = baseAchieved + entry

achievedEl.innerText = newAchieved

// deficit update
deficit.innerText = target - newAchieved

// stock available update
if(stockAvailable){
stockAvailable.innerText = stock - newAchieved
}

}

// ================= UPDATE ALL STOCK AVAILABLE =================
function updateAllStockAvailable(){

let rows = document.querySelectorAll("table tr")

rows.forEach((row,index)=>{

if(index===0) return

let achievedEl = row.querySelector(".achieved")
let achieved = parseInt(achievedEl?.innerText) || 0

let stock = parseInt(row.querySelector(".stock")?.value) || 0

let stockAvailable = row.querySelector(".stock-available")

if(stockAvailable){
stockAvailable.innerText = stock - achieved
}

})

}

// ================= SUBMIT SALES =================
async function submitSales(){

let rows = document.querySelectorAll("table tr")
let arr = []

rows.forEach((row,index)=>{

if(index===0) return

let entryInput = row.querySelector(".entry")
let achievedEl = row.querySelector(".achieved")

let entry = parseInt(entryInput.value) || 0
let base = parseInt(achievedEl.getAttribute("data-base")) || 0

let finalVal = base + entry

// permanent update
achievedEl.innerText = finalVal
achievedEl.setAttribute("data-base", finalVal)

arr.push(finalVal)

// clear entry
entryInput.value = ""

})

updateDeficit()
updateAllStockAvailable()

await fetch(API_URL+"?action=submit&row="+userRow+"&data="+JSON.stringify(arr))

alert("Sales Updated Successfully")

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

alert("Stock Updated Successfully")

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
