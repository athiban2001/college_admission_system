const collegeName=document.querySelector('#collegeName');

//function for showing alert message
const showAlert=(msg)=>{

    //checking for existing alert and removing them
    if(document.querySelector('.alert')){
        document.querySelector('.alert').remove();
     }

     //creating alert
     const alert=document.createElement('div');
     alert.innerHTML=`
     <div class="alert alert-danger alert-dismissible m-3 fade show" role="alert">
         <strong>Profile Not Found! </strong> | ${msg}
         <button type="button" class="close" data-dismiss="alert" aria-label="Close">
         <span aria-hidden="true">&times;</span>
         </button>
     </div>
     `;

    //inserting alert to document
    const mainHeader=document.querySelector('.mainHeader');
    const mainCard=document.querySelector('.mainCard');
    mainCard.insertBefore(alert,mainHeader);
}

//finding college details for college name for every letter typed in the field
collegeName.addEventListener('keyup',async (e)=>{

    //getting value and checking for empty string
    const name=collegeName.value;
    if(name.length===0){
        return document.querySelector('#colleges').innerHTML='';
    }

    //getting college details from the string
    const response=await fetch('/db/searchCollege?string='+name);
    const colleges=await response.json();

    //creating html
    let html='';

    //showing alert if no college was found with the value
    if(colleges.length===0){
        document.querySelector('#colleges').innerHTML='';
        return showAlert('No Colleges with the name '+name);
    }

    //adding college detail to html
    colleges.forEach(college=>{
        html+=`
        <div class="card m-5">
            <div class="card-header text-center text-white rounded bg-dark lead m-3 p-2">
                <i class="fa fa-university"></i> ${college.collegename} 
            </div>
            <div class="card-body">
                <div class="m-1 row">
                    <div class="col-4">
                        <div class="border-bottom p-2">
                            <strong>College Code</strong>
                            <span class="float-right mr-1" id="studentID">${college.collegecode}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>College Dean</strong>
                            <span class="float-right mr-1" id="studentID">${college.dean}</span>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="border-bottom p-2">
                            <strong>College Name</strong>
                            <span class="float-right mr-1" id="studentID">${college.collegename}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>College Location</strong>
                            <span class="float-right text-truncate mr-1" id="studentID">${college.city}</span>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-4">
                        <div class="font-weight-bold border-bottom text-center lead p-2">
                            <i class="fa fa-graduation-cap"></i> Available Courses <span class="float-right"><i class="fa fa-arrow-right"></i></span>
                        </div>
                    </div>
                    <div class="col-8">
                    <ul class="list-group">`;
        
        //checking for course availablility for that college and adding courses
        if(college.courses){
            college.courses.forEach(course=>{
                html+=`<li class="list-group-item border-top-0 border-left-0 border-right-0">${course.coursename}<span class="float-right">${course.coursetag}</span></li>`;
            })
        }
        else{
            //if no courses were available
            html+=`<li class="list-group-item border-top-0 border-left-0 border-right-0">There is currently no Courses in this College</li>`;
        }
        html+=`
                </ul>
                </div>
            </div>
            </div>
        </div>`;
    })

    //adding html to document
    document.querySelector('#colleges').innerHTML=html;
})