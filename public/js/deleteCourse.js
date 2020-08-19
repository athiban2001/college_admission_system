//removing query strings on page refresh
if (performance.navigation.type == 1) {
    window.location.href='/deleteCourse';
}

const courseCode=document.querySelector('#courseCode');
const deleteBtn=document.querySelector('#delete');

//function to show alert message
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

//checking for clicking of delete button and get course details
deleteBtn.addEventListener('click',async (e)=>{
    e.preventDefault();

    //checking for empty course value
    if(courseCode.value===''){
        document.querySelector('#course').innerHTML='';
        return showAlert('Please Enter the Course Code');
    }

    //getting course details by code
    const response=await fetch(`/db/courseByCode/${courseCode.value}`);
    const courses=await response.json();

    //checking if courses were available and show alert
    if(courses.length===0){
        document.querySelector('#course').innerHTML='';
        return showAlert(`There is no course with that Code(${courseCode.value})`);
    }

    //creating html
    let html='';
    courses.forEach(course=>{
        html+=`
            <div class="card m-5">
                <div class="card-header text-center text-white rounded bg-dark lead m-3 p-2">
                    <i class="fa fa-university"></i> ${course.coursename} 
                </div>
                <div class="card-body">
                    <form action="/db/deleteCourse/${course.coursecode}" class="m-1 p-3 border" method="post">
                        <div class="form-row mx-auto">
                            <div class="col-10 font-weight-bold lead">
                                Are You Sure You Want To Delete This College?
                            </div>
                            <div class="col-1">
                                <button type="submit" name="delete" value="1" class="btn btn-outline-danger btn-block"><i class="fas fa-check"></i> Yes</button>
                            </div>
                            <div class="col-1">
                                <button type="submit" name="delete" value="0" class="btn btn-outline-success btn-block"><i class="fas fa-times"></i> No</button>
                            </div>
                        </div>
                    </form>
                    <div class="m-2 row">
                        <div class="col-3">
                            <div class="border-bottom p-2">
                                <strong>Course Code</strong>
                                <span class="float-right mr-1" id="studentID">${course.coursecode}</span>
                            </div>
                            <div class="border-bottom p-2">
                                <strong>Course Tag</strong>
                                <span class="float-right mr-1" id="studentID">${course.coursetag}</span>
                            </div>
                        </div>
                        <div class="col-9">
                            <div class="border-bottom p-2">
                                <strong>Course Name</strong>
                                <span class="float-right mr-1" id="studentID">${course.coursename}</span>
                            </div>
                            <div class="border-bottom p-2">
                                <strong>Course Description</strong>
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

        //checking for available colleges and adding them
        if(course.colleges.length!==0){
            course.colleges.forEach(college=>{
                html+=`<li class="list-group-item border-top-0 border-left-0 border-right-0">${college.collegename}<span class="float-right">${college.city}</span></li>`;
            })
        }
        else{
            //if no college was found
            html+=`<li class="list-group-item border-top-0 border-left-0 border-right-0">There is currently no Colleges with this Course</li>`;
        }
        html+=`
                </ul>
                </div>
            </div>
            </div>
        </div>`;
    });

    //adding html to document
    document.querySelector('#course').innerHTML=html;
})