//removing query strings and removing them
if (performance.navigation.type == 1) {
    window.location.href='/deleteCourseCollege';
}

const collegeCode=document.querySelector('#collegeCode');

//get courses select option on changing of college
collegeCode.addEventListener('change',async (e)=>{

    //getting available courses for the college
    const response=await fetch(`/db/availableCourses/${collegeCode.value}`);
    const courses=await response.json();

    //creating select option
    let selectOption='';
    selectOption+=`
    <label for="courseList" class="lead mt-2">&nbsp;Select the Course</label>
    <select class="form-control" name="coursecode" required>
        <option selected disabled>Select the Course</option>
    `;
    courses.forEach(course=>{
        selectOption+=`
        <option value="${course.coursecode}">${course.coursename}</option>
        `;
    })
    selectOption+='</select>';

    //adding select option to document
    document.querySelector('#courses').innerHTML=selectOption;
})