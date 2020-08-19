//removing query strings on page reload
if (performance.navigation.type == 1) {
    window.location.href='/addCourse';
}

const inputCourseName=document.querySelector('#courseName');
const inputCourseTag=document.querySelector('#courseTag');
const inputCourseDescription=document.querySelector('#courseDescription');

//validating course name field limit(10,50)
//and adding class to notify users
inputCourseName.addEventListener('blur',(e)=>{
    if(e.target.value.length>=10 && e.target.value.length<=50){
        if(inputCourseName.classList.contains('is-invalid'))
            inputCourseName.classList.remove('is-invalid');
        inputCourseName.classList.add('is-valid');
    }
    else{
        if(inputCourseName.classList.contains('is-valid'))
            inputCourseName.classList.remove('is-valid');
        inputCourseName.classList.add('is-invalid');
    }
})

//validating college tag field limit(2,3)
//and adding class to notify users
inputCourseTag.addEventListener('blur',(e)=>{
    if(e.target.value.length>=2 && e.target.value.length<=3){
        e.target.value=e.target.value.toUpperCase();
        if(inputCourseTag.classList.contains('is-invalid'))
            inputCourseTag.classList.remove('is-invalid');
        inputCourseTag.classList.add('is-valid');
    }
    else{
        if(inputCourseTag.classList.contains('is-valid'))
            inputCourseTag.classList.remove('is-valid');
        inputCourseTag.classList.add('is-invalid');
    }
})

//validating college description field limit(20,70)
//and adding class to notify users
inputCourseDescription.addEventListener('blur',(e)=>{
    if(e.target.value.length>=20 && e.target.value.length<=70){
        if(inputCourseDescription.classList.contains('is-invalid'))
            inputCourseDescription.classList.remove('is-invalid');
        inputCourseDescription.classList.add('is-valid');
    }
    else{
        if(inputCourseDescription.classList.contains('is-valid'))
            inputCourseDescription.classList.remove('is-valid');
        inputCourseDescription.classList.add('is-invalid');
    }
})