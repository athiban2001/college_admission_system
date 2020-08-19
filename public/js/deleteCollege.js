//removing query strings on page refresh
if (performance.navigation.type == 1) {
    window.location.href='/deleteCollege';
}

const collegeCode=document.querySelector('#collegeCode');
const deleteBtn=document.querySelector('#delete');

//function for showing alert message
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

    //inserting alert to document
    const mainHeader=document.querySelector('.mainHeader');
    const mainCard=document.querySelector('.mainCard');
    mainCard.insertBefore(alert,mainHeader);
}

//getting profile for clicking delete button
deleteBtn.addEventListener('click',async (e)=>{
    e.preventDefault();

    //checking for empty value
    if(collegeCode.value===''){
        document.querySelector('#college').innerHTML='';
        return showAlert('Please Enter the College Code');
    }

    //getting college by given value
    const response=await fetch(`/db/collegeByCode/${collegeCode.value}`);
    const colleges=await response.json();

    //checking for no college with that code and show alert
    if(colleges.length===0){
        document.querySelector('#college').innerHTML='';
        return showAlert(`There is no college with that Code(${collegeCode.value})`);
    }

    //creating html
    let html='';
    colleges.forEach(college=>{
        html+=`
            <div class="card m-5">
                <div class="card-header text-center text-white rounded bg-dark lead m-3 p-2">
                    <i class="fa fa-university"></i> ${college.collegename} 
                </div>
                <div class="card-body">
                    <form action="/db/deleteCollege/${college.collegecode}" class="m-1 p-3 border" method="post">
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

        //checking for courses available in the college and adding them
        if(college.courses.length!==0){
            college.courses.forEach(course=>{
                html+=`<li class="list-group-item border-top-0 border-left-0 border-right-0">${course.coursename}<span class="float-right">${course.coursetag}</span></li>`;
            })
        }
        else{
            //if no courses were found
            html+=`<li class="list-group-item border-top-0 border-left-0 border-right-0">There is currently no Courses in this College</li>`;
        }
        html+=`
                </ul>
                </div>
            </div>
            </div>
        </div>`;
    });

    //adding html to document
    document.querySelector('#college').innerHTML=html;
})