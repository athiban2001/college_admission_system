//removing query strings on page refresh
if (performance.navigation.type == 1) {
    window.location.href='/deleteStudent';
}

const deleteBtn=document.querySelector('#delete');
const inputID=document.querySelector('#studentID');

//function for show alert message
const showAlert=(msg)=>{

    //checking for existing alert message and removing it
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

//getting student profile on clicking of submit button
deleteBtn.addEventListener('click',async (e)=>{
    e.preventDefault();

    //checking for empty value
    const id=inputID.value;
    if(id===''){
        document.querySelector('#profile').innerHTML='';
        return showAlert('Enter the ID');
    }


    //getting student profile
    const response=await fetch('/db/profileById?id='+id);
    const students=await response.json();

    //checking for student available or not
    if(students.length===0){
        document.querySelector('#profile').innerHTML='';
        return showAlert('There is no Student With That ID');
    }

    //creating html
    let html='';
    students.forEach((student)=>{
        console.log(student);
        let maths='Value not been entered';
        let physics='Value not been entered';
        let chemistry='Value not been entered';
        let cutoff='Value not been calculated';
        if(student.marks){
            maths=student.marks[0].maths;
            physics=student.marks[0].physics;
            chemistry=student.marks[0].chemistry;
            cutoff=student.marks[0].cutoff;
        }
        let gender=(student.gender==='M')?'Male':'Female';
        html+=`
        <div class="card mx-5 mb-5">
            <div class="card-header bg-dark text-white lead" id="name">
                ${student.fname} ${student.lname} ,
            </div>
            <div class="card-body">
                <form action="/db/deleteStudent/${student.studentid}" class="m-1 p-3 border" method="post">
                    <div class="form-row mx-auto">
                        <div class="col-10 font-weight-bold lead">
                            Are You Sure You Want To Delete This Profile?
                        </div>
                        <div class="col-1">
                            <button type="submit" name="delete" value="1" class="btn btn-outline-danger btn-block"><i class="fas fa-check"></i> Yes</button>
                        </div>
                        <div class="col-1">
                            <button type="submit" name="delete" value="0" class="btn btn-outline-success btn-block"><i class="fas fa-times"></i> No</button>
                        </div>
                    </div>
                </form>
                <div class="row">
                    <div class="col-2 my-auto">
                        <img src="uploads/${student.studentid}.jpg" class="avatar" id="profile" alt="profilePicture" height="250px" width="187px" onerror="this.onerror=null;this.src='uploads/profiledefault.jpg';">
                        <br>
                    </div>
                    <div class="col-5">
                        <div class="border-bottom p-2">
                            <strong>Student ID</strong>
                            <span class="float-right mr-2" id="studentID">${student.studentid}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>First Name</strong>
                            <span class="float-right mr-2" id="fname">${student.fname}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Last Name</strong>
                            <span class="float-right mr-2" id="lname">${student.lname}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Email ID</strong>
                            <span class="float-right mr-2" id="email">${student.email}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Age</strong>
                            <span class="float-right mr-2 d-inline-block text-truncate" id="age">${student.age}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Maths</strong>
                            <span class="float-right mr-2 d-inline-block text-truncate" id="age">${maths}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Physics</strong>
                            <span class="float-right mr-2 d-inline-block text-truncate" id="age">${physics}</span>
                        </div>
                    </div>
                    
                    <div class="col-5">
                        <div class="border-bottom p-2">
                            <strong>Address</strong>
                            <span class="float-right mr-2" id="address">${student.address}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Gender</strong>
                            <span class="float-right mr-2" id="gender">${gender}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Date Of Birth</strong>
                            <span class="float-right mr-2" id="dob">${new Date(student.dob).toISOString().substring(0,10)}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Phone Number</strong>
                            <span class="float-right mr-2" id="phone">${student.phone}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Nationality</strong>
                            <span class="float-right mr-2 d-inline-block text-truncate" id="nation">${student.nationality}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Chemistry</strong>
                            <span class="float-right mr-2 d-inline-block text-truncate" id="age">${chemistry}</span>
                        </div>
                        <div class="border-bottom p-2">
                            <strong>Cut-Off</strong>
                            <span class="float-right mr-2 d-inline-block text-truncate" id="age">${cutoff}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        //adding html to document
        document.querySelector('#profile').innerHTML=html;
    })
})