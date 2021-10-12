const allStudents = document.getElementById('allstudents')
const presentStudents=document.getElementById('attendeesheet')
const allstudentsrollcol=document.getElementById('allrollcol')
const presenteerollcol=document.getElementById('presenteerollcol')
const viewArea=document.getElementById('absentees')
const absenteecount=document.getElementById('absenteecount')
const mappings={
    'A':0,
    'B':1,
    'C':2,
    'D':3,
    'E':4,
    'F':5,
    'G':6,
    'H':7,
    'I':8,
    'J':9,
    'K':10,
}

var absentcount=0
var totalStudents=[]
var presentees=[]
var totalStudentsjson;
var totalStudentsIndex;
var presenteeIndex;
allstudentsrollcol.addEventListener('keyup', function() {
    totalStudentsIndex=mappings[allstudentsrollcol.value.toUpperCase()]
    allStudentsChange();
    })

presenteerollcol.addEventListener('keyup', function() {
        presenteeIndex=mappings[presenteerollcol.value.toUpperCase()]
        presentStudentChange();
        })

function allStudentsChange(){
    totalStudents=[]
    var temparr=[];
    if(totalStudentsIndex==null){
        alert("Error! registration number column not defined")
        return;
    }
    readXlsxFile(allStudents.files[0]).then(function(rows) {
        for(var i =0;i<rows.length;i++){
            temparr.push(rows[i]);
            totalStudents.push(rows[i][totalStudentsIndex])
            
        }
        totalStudentsjson=JSON.parse(JSON.stringify(Object.assign({},temparr)))
        console.log(totalStudents)
      })
}


function presentStudentChange(){
    presentees=[]
    if(presenteeIndex==null){
        alert("Error! registration number column not defined")
        return;
    }
    readXlsxFile(presentStudents.files[0]).then(function(rows) {
        for(var i =0;i<rows.length;i++){
      
            presentees.push(rows[i][presenteeIndex]?.toUpperCase())
            
        }
       console.log(presentees)
         })
}

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function check(){
    absentees=[];
    csvOutput=[];
    let csvContent;
    if(presentees.length==0){
        alert("Error Code: 403 \n Spreadsheet access forbidden \n Please open the attendence sheet and click on enable editing")
        window.location.reload()
        return
    }

   if(totalStudentsIndex!=null && presenteeIndex!=null){
    for(var i=0;i<totalStudents.length;i++){
        absentees.push(!presentees.includes(totalStudents[i])?totalStudentsjson[i]:null)
        console.log(!presentees.includes(totalStudents[i])?totalStudentsjson[i]:null)
    }
    
    viewArea.innerHTML=`<tr>
    <th>Reg. No.</th>
    <th>Name</th>
    <th>Email</th>
</tr>`
    for(var i=0;i<absentees.length;i++){
        if(absentees[i]!=null){
            absentcount+=1;
            csvOutput.push(absentees[i])
            
            viewArea.innerHTML+=
            `<tr>
                <th>${absentees[i][0]}</th>
                <th>${absentees[i][1]}</th>
                <th>${absentees[i][2]}</th>
            </tr>`
        }
        
    }

   }else{
       alert("Error! registration number columns not defined")
   }
   absenteecount.innerHTML+=absentcount
   csvContent = "data:text/csv;charset=utf-8," 
    + csvOutput.map(e => e.join(",")).join("\n");
   var encodedUri = encodeURI(csvContent);
   var downloadLink = document.createElement("a");
downloadLink.href = encodedUri;
downloadLink.download = `absentees_${Date.now()}.csv`;

document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);

    allStudents.value="";
    presentStudents.value="";
}

