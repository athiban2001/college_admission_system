//removing query string on reloading
if (performance.navigation.type == 1) {
    window.location.href='/academics';
}

//creation of circular progress bars on loading page
if(document.querySelector('#progress-1')){
    document.addEventListener('DOMContentLoaded', function () {

        //for progress bars animation
        ToxProgress.create();
        ToxProgress.animate();
    });
}

//checking for marks entry stage and applying events
if(document.querySelector('#inputMaths')){


    const maths=document.querySelector('#inputMaths');

    //validation of maths marks event limit(70,200)
    //and adding class to show that its vaild or not
    maths.addEventListener('blur',(e)=>{
        if(e.target.value<=200 && e.target.value>=70){
            if(maths.classList.contains('is-invalid'))
                maths.classList.remove('is-invalid');
            maths.classList.add('is-valid');
        }
        else{
            if(maths.classList.contains('is-valid'))
                maths.classList.remove('is-valid');
            maths.classList.add('is-invalid');
        }
    })

    const physics=document.querySelector('#inputPhysics');

    //validation of physics marks event limit(70,200)
    //and adding class to show that its vaild or not
    physics.addEventListener('blur',(e)=>{
        if(e.target.value<=200 && e.target.value>=70){
            if(physics.classList.contains('is-invalid'))
                physics.classList.remove('is-invalid');
            physics.classList.add('is-valid');
        }
        else{
            if(physics.classList.contains('is-valid'))
                physics.classList.remove('is-valid');
            physics.classList.add('is-invalid');
        }
    })

    const chemistry=document.querySelector('#inputChemistry');

    //validation of chemistry marks event limit(70,200)
    //and adding class to show that its vaild or not
    chemistry.addEventListener('blur',(e)=>{
        if(e.target.value<=200 && e.target.value>=70){
            if(chemistry.classList.contains('is-invalid'))
                chemistry.classList.remove('is-invalid');
            chemistry.classList.add('is-valid');
        }
        else{
            if(chemistry.classList.contains('is-valid'))
                chemistry.classList.remove('is-valid');
            chemistry.classList.add('is-invalid');
        }
    })
}