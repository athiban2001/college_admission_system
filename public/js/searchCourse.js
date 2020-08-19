const inputCourse=document.querySelector('#courseName');

//function for showing error message
const showAlert=(msg)=>{

    //checking for existing alert and removing it
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

    //inserting alert into document
    const mainHeader=document.querySelector('.mainHeader');
    const mainCard=document.querySelector('.mainCard');
    mainCard.insertBefore(alert,mainHeader);
}

//getting courses details for every key pressing in the field
inputCourse.addEventListener('keyup',async (e)=>{

    //getting string and checking for empty
    const string=e.target.value;
    if(string.length===0){
        document.querySelector('#courses').innerHTML='';
    }

    //getting courses based on string
    const response=await fetch('/db/searchCourse?string='+string);
    const courses=await response.json();

    //checking if courses available or not
    if(courses.length===0){
        document.querySelector('#courses').innerHTML='';
        return showAlert('No Courses with the name '+string);
    }

    //creating html
    let html='';
    courses.forEach(course=>{
        html+=`
        <div class="card m-5">
            <div class="card-header text-center text-white rounded bg-dark lead m-3 p-2">
                <i class="fa fa-graduation-cap"></i> ${course.coursename} 
            </div>
            <div class="card-body">
                <div class="m-1 row">
                    <div class="col-4">
                        <div class="border-bottom p-2">
                            <strong>Course Code</strong>
                            <span class="float-right mr-1" id="studentID">${course.coursecode}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Course Tag</strong>
                            <span class="float-right mr-1" id="studentID">${course.coursetag}</span>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="border-bottom p-2">
                            <strong>Course Name</strong>
                            <span class="float-right mr-1" id="studentID">${course.coursename}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Description</strong>
                            <span class="float-right text-truncate mr-1" id="studentID">${course.coursedescription}</span>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-4">
                        <div class="font-weight-bold border-bottom text-center lead p-2">
                            <i class="fa fa-university"></i> Available Colleges <span class="float-right"><i class="fa fa-arrow-right"></i></span>
                        </div>
                    </div>
                    <div class="col-8">
                    <ul class="list-group">`;
        //checking for college available and adding them
        if(course.colleges){
            course.colleges.forEach(college=>{
                html+=`<li class="list-group-item border-top-0 border-left-0 border-right-0">${college.collegename}<span class="float-right">${college.city}</span></li>`;
            })
        }
        else{
            //if no colleges were available 
            html+=`<li class="list-group-item border-top-0 border-left-0 border-right-0">There is currently no colleges with this Course</li>`;
        }
        html+=`
                </ul>
                </div>
            </div>
            </div>
        </div>`;
    })

    //adding html to document
    document.querySelector('#courses').innerHTML=html;
})