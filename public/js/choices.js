//removing query strings on page refresh
if (performance.navigation.type == 1) {
    window.location.href='/choices';
}

const selectCollege=document.querySelector('#collegeCode');

//getting entered choices on loading of page and add to html
document.addEventListener('DOMContentLoaded',async (e)=>{

    //get entered choices
    const response=await fetch('/db/getChoices');
    const choices=await response.json();

    //creating of html using choices
    let html=``;
    if(choices.length===0){
        html+=`<div class="lead">There is no Choices available</div>`;
    }
    else{
        choices.forEach(choice=>{
            html+=`
                <div class="card mt-3">
                    <h5 class="card-header text-center p-2"><span class="badge badge badge-primary">${choice.choiceno}</span> ${choice.collegename}</h5>
                    <div class="card-body text-center p-1">${choice.coursename}</div>
                </div>`;
        });

        //checking for whether to add lock choice based on already locked or not
        if(!document.querySelector('.finalList')){
            html+=`
                <form action="/db/choiceModify" class="mt-3 p-3 border" method="POST">
                    <div class="form-row">
                        <strong class="lead pb-3">Lock The Choices to confirm it. Delete The Choices to re-enter it</strong>
                        <div class="col-6 mx-auto">
                            <button type="submit" name="delete" value="1" class="btn btn-outline-danger btn-block"><i class="fas fa-check"></i> Delete Choices</button>
                        </div>
                        <div class="col-6 mx-auto">
                            <button type="submit" name="delete" value="0" class="btn btn-outline-success btn-block"><i class="fas fa-times"></i> Lock Choices</button>
                        </div>
                    </div>
                </form>`;
        }
    }

    //adding choices to document
    document.querySelector('#choices').innerHTML=html;
})

//getting remaining courses for the college to be set as choice for select option
selectCollege.addEventListener('change',async (e)=>{

    //getting available courses for the college as a choice
    const response=await fetch(`/db/choiceAvailableCourses/${selectCollege.value}`);
    const courses=await response.json();

    //creating select option using courses
    let selectOption='';

    //if courses are available
    if(courses.length!==0){
        selectOption+=`
        <label for="courseCode" class="lead">&nbsp;Select Your Course</label>
        <select name="coursecode" class="form-control" id="courseCode">
            <option disabled selected>Select Your Course</option>`;
        courses.forEach(course=>{
            selectOption+=`<option value=${course.coursecode}>${course.coursename}</option>`;
        })
        selectOption+=`</select>`;
    }
    else{
        //if no courses are available no select option
        selectOption+=`<div class="text-center lead">There is no Courses left in this College</div>`
    }

    //adding select option to document
    document.querySelector('#courses').innerHTML=selectOption;
})

