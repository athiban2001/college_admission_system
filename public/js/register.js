//Form Validation
if (performance.navigation.type == 1) {
    window.location.href='/register';
}

//validating first name component during blur event
const firstNameInput=document.querySelector('#inputFirstName');
firstNameInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for first name length and validating it
    if(e.target.value.length>=5 && e.target.value.length <=40){

        if(firstNameInput.classList.contains('is-invalid'))
            firstNameInput.classList.remove('is-invalid');
        firstNameInput.classList.add('is-valid');
    }
    else{
        if(firstNameInput.classList.contains('is-valid'))
            firstNameInput.classList.remove('is-valid');
        firstNameInput.classList.add('is-invalid');
    }
})

//validating last name component during blur event
const lastNameInput=document.querySelector('#inputLastName');
lastNameInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for last name length and validating it
    if(e.target.value.length>=1 && e.target.value.length <=20){

        if(lastNameInput.classList.contains('is-invalid'))
            lastNameInput.classList.remove('is-invalid');
        lastNameInput.classList.add('is-valid');
    }
    else{
        if(lastNameInput.classList.contains('is-valid'))
            lastNameInput.classList.remove('is-valid');
        lastNameInput.classList.add('is-invalid');
    }
})

//validating address component during blur event
const addressInput=document.querySelector('#inputAddress');
addressInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for address length and validating it
    if(e.target.value.length>=10 && e.target.value.length <=50){

        if(addressInput.classList.contains('is-invalid'))
            addressInput.classList.remove('is-invalid');
        addressInput.classList.add('is-valid');
    }
    else{
        if(addressInput.classList.contains('is-valid'))
            addressInput.classList.remove('is-valid');
        addressInput.classList.add('is-invalid');
    }
})

//validating phone component during blur event
const phoneInput=document.querySelector('#inputPhone');
phoneInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for phone length and validating it
    if(e.target.value.length===10){

        if(phoneInput.classList.contains('is-invalid'))
            phoneInput.classList.remove('is-invalid');
        phoneInput.classList.add('is-valid');
    }
    else{
        if(phoneInput.classList.contains('is-valid'))
            phoneInput.classList.remove('is-valid');
        phoneInput.classList.add('is-invalid');
    }
})

//validating email component during blur event
const emailInput=document.querySelector('#inputEmail');
emailInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for email regular expression and validating it
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value))){
        emailInput.classList.add('is-invalid');
        if(emailInput.classList.contains('is-valid'))
            emailInput.classList.remove('is-valid');
    }
    else{
        if(emailInput.classList.contains('is-invalid'))
            emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    }
})

//validating age component during blur event
const ageInput=document.querySelector('#inputAge');
ageInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for age value and validating it
    if(parseInt(e.target.value)>=18 && parseInt(e.target.value)<=22){

        if(ageInput.classList.contains('is-invalid'))
            ageInput.classList.remove('is-invalid');
        ageInput.classList.add('is-valid');
    }
    else{
        if(ageInput.classList.contains('is-valid'))
            ageInput.classList.remove('is-valid');
        ageInput.classList.add('is-invalid');
    }
})

//validating address component during blur event
const nationInput=document.querySelector('#inputNation');
nationInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for address length and validating it
    if(e.target.value.length>=4 && e.target.value.length <=30){

        if(nationInput.classList.contains('is-invalid'))
            nationInput.classList.remove('is-invalid');
        nationInput.classList.add('is-valid');
    }
    else{
        if(nationInput.classList.contains('is-valid'))
            nationInput.classList.remove('is-valid');
        nationInput.classList.add('is-invalid');
    }
})

const passwordInput=document.querySelector('#inputPassword');
passwordInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for address length and validating it
    if(e.target.value.length>=8 && e.target.value.length <=20){

        if(passwordInput.classList.contains('is-invalid'))
            passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
    }
    else{
        if(passwordInput.classList.contains('is-valid'))
            passwordInput.classList.remove('is-valid');
        passwordInput.classList.add('is-invalid');
    }
})

const passwordConInput=document.querySelector('#inputPasswordCon');
passwordConInput.addEventListener('blur',(e)=>{
    //using bootstrap classes is-valid and is-invalid to create error messages

    //checking for address length and validating it
    if(e.target.value===passwordInput.value){

        if(passwordConInput.classList.contains('is-invalid'))
            passwordConInput.classList.remove('is-invalid');
        passwordConInput.classList.add('is-valid');
    }
    else{
        if(passwordConInput.classList.contains('is-valid'))
            passwordConInput.classList.remove('is-valid');
        passwordConInput.classList.add('is-invalid');
    }
})
