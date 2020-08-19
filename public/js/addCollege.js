//removing query string on page refresh
if (performance.navigation.type == 1) {
    window.location.href='/addCollege';
}

const collegeName=document.querySelector('#collegeName');
const collegeCity=document.querySelector('#collegeCity');
const collegeDean=document.querySelector('#collegeDean');

//validating college name field limit(10,50)
//and adding class to notify users
collegeName.addEventListener('blur',(e)=>{
    if(e.target.value.length>=10 && e.target.value.length <=50){

        if(collegeName.classList.contains('is-invalid'))
            collegeName.classList.remove('is-invalid');
        collegeName.classList.add('is-valid');
    }
    else{
        if(collegeName.classList.contains('is-valid'))
            collegeName.classList.remove('is-valid');
        collegeName.classList.add('is-invalid');
    }
})

//validating college city field limit(5,50)
//and adding class to notify users
collegeCity.addEventListener('blur',(e)=>{
    if(e.target.value.length>=5 && e.target.value.length <=50){

        if(collegeCity.classList.contains('is-invalid'))
            collegeCity.classList.remove('is-invalid');
        collegeCity.classList.add('is-valid');
    }
    else{
        if(collegeCity.classList.contains('is-valid'))
            collegeCity.classList.remove('is-valid');
        collegeCity.classList.add('is-invalid');
    }
})

//validating college dean field limit(5,30)
//and adding class to notify users
collegeDean.addEventListener('blur',(e)=>{
    if(e.target.value.length>=5 && e.target.value.length <=30){

        if(collegeDean.classList.contains('is-invalid'))
            collegeDean.classList.remove('is-invalid');
        collegeDean.classList.add('is-valid');
    }
    else{
        if(collegeDean.classList.contains('is-valid'))
            collegeDean.classList.remove('is-valid');
        collegeDean.classList.add('is-invalid');
    }
})