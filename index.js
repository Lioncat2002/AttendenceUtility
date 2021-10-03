const allStudents = document.getElementById('allstudents')
const presentStudents=document.getElementById('attendeesheet')
const allstudentsrollcol=document.getElementById('allrollcol')
const presenteerollcol=document.getElementById('presenteerollcol')
const viewArea=document.getElementById('absentees')
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
      
            presentees.push(rows[i][presenteeIndex])
            
        }
       console.log(presentees)
         })
}



function check(){
    absentees=[];

    
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

    
    allStudents.value="";
    presentStudents.value="";
}

