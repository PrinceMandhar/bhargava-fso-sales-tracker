
function doPost(e){

var ss = SpreadsheetApp.getActiveSpreadsheet()

var salesSheet = ss.getSheetByName("SALES")
var attSheet = ss.getSheetByName("ATTENDANCE")

var data = JSON.parse(e.postData.contents)

var name = data.name
var sales = data.sales

var today = new Date()
var day = today.getDate()

var rows = salesSheet.getDataRange().getValues()

for(var i=1;i<rows.length;i++){

if(rows[i][0]==name){

for(var j=0;j<sales.length;j++){

var cell = salesSheet.getRange(i+1,j+2)
cell.setValue(cell.getValue()+sales[j])

}

}

}

var att = attSheet.getDataRange().getValues()

for(var i=1;i<att.length;i++){

if(att[i][0]==name){

attSheet.getRange(i+1,day+1).setValue("YES")

}

}

return ContentService.createTextOutput("success")

}
