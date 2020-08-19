//removing query strings on page refresh
if (performance.navigation.type == 1) {
    window.location.href='/addCourseToCollege';
}

const selectCollege=document.querySelector('#collegeList');
const totalSeats=document.querySelector('#totalSeats');

//validating total seats field limit(12,300)
//and adding class to notify users
totalSeats.addEventListener('blur',(e)=>{
    if(parseInt(e.target.value)>=12 && parseInt(e.target.value)<=300){
        if(totalSeats.classList.contains('is-invalid'))
            totalSeats.classList.remove('is-invalid');
        totalSeats.classList.add('is-valid');
    }
    else{
        if(totalSeats.classList.contains('is-valid'))
            totalSeats.classList.remove('is-valid');
        totalSeats.classList.add('is-invalid');
    }
})

//adding courses select option on changing of college
//using fetch api and html code
selectCollege.addEventListener('change',async (e)=>{

    //getting available courses for that college
    const response1=await fetch(`/db/availableCourses/${selectCollege.value}`);
    const courses=await response1.json();

    //getting remaining courses to be addeed for that college
    const response2=await fetch(`/db/courses/${selectCollege.value}`);
    const remainingCourses=await response2.json();

    //if there is no remaining courses no select option
    if(remainingCourses.length===0){
        document.querySelector('#courseList').innerHTML=`
        <p class="lead m-4">
            All Courses are added to the College
        </p>`;
    }
    else{

        //creating select option using available data
        let selectOption='';
        selectOption+=`
        <label for="courseList" class="lead mt-2">Select the Course</label>
        <select class="form-control" name="coursecode" required>
            <option selected disabled>Select the Course</option>
        `;
        remainingCourses.forEach(course=>{
            selectOption+=`
            <option value="${course.coursecode}">${course.coursename}</option>
            `;
        })
        selectOption+='</select>';

        //adding select option to document
        document.querySelector('#courseList').innerHTML=selectOption;
    }

    //if no available courses no table
    if(courses.length===0){
        return document.querySelector('#availableCourses').innerHTML=`
        <p class="lead m-4 text-center">
            There is currently no Courses Available
        </p>`;
    }

    //creating table using courses data
    let html=`
    <div class="col-12">
        <h5 class="lead m-5 text-center">Registered Courses on this College</h5>
        <table class="table table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Course Tag</th>
                </tr>
            </thead>
    `;
    courses.forEach(course=>{
        html+=`
        <tr>
            <td>${course.coursecode}</td>
            <td>${course.coursename}</td>
            <td>${course.coursetag}</td>
        </tr>
        `;
    })
    html+=`
        </table>
    </div>`;

    //adding table to document
    document.querySelector('#availableCourses').innerHTML=html;
})