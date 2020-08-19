//require npm packages
const express=require('express');

//require db files
const student=require('../db/student/student');

const router=new express.Router();

//HOME ROUTE

//route for /db/img (add image to database)
router.post('/db/img',async (req,res)=>{
    
    //check for session variable user
    if(req.session.user){
    
        //search for file availability
        if(!req.files||Object.keys(req.files).length === 0){
            let error='No image was found';
            return res.redirect('/profile?error='+error);
        }

        //find the image
        let profilPicture=req.files.profileImage;

        //check for file type
        if(profilPicture.mimetype == "image/jpeg" ||profilPicture.mimetype == "image/png"||profilPicture.mimetype == "image/gif" ){

            //move picture to server location
            profilPicture.mv('public/uploads/'+req.session.user.id+'.jpg',async (err)=>{
                if(err){

                    //redirection to /profile
                    let error='Unexpected Error Occured';
                    return res.redirect('/profile?error='+error);
                }
                else{
                    
                    //update image data
                    const result=await student.updateImage(req.session.user.id);

                    //redirection to /profile
                    let success='Image Uploaded Successfully';
                    return res.redirect('/profile?success='+success);
                }
            });
        }
        else{

            //redirection to /profile
            let error='Not an image';
            return res.redirect('/profile?error='+error);
        }
    }
    else{
        res.redirect('/login');
    }
})

//ACADEMICS ROUTE

//route for /db/academics (insert mark of students)
router.post('/db/academics',express.urlencoded({extended:false}),async (req,res)=>{

    //check for session variable user
    if(req.session.user){
        const validation=await student.validateMarks(req.body.maths,req.body.physics,req.body.chemistry);

        //check for validation of marks
        if(validation){

            //insert marks
            await student.addMarks(req.session.user.id,req.session.user.dob,req.body.maths,req.body.physics,req.body.chemistry);

            //redirection to /academics
            let success='Marks Added Successfully';
            res.redirect('/academics?success='+success);
        }
        else{

            //redirection to /academics
            let error='Invalid Marks Details'
            res.redirect('/academics?error='+error);
        }
    }
    else{
        res.redirect('/login');
    }
})

//CHOICE ROUTE

//route for /db/choiceAvailableCourses/CLG001 (find courses not yet in choice list and available in college CLG001)
router.get('/db/choiceAvailableCourses/:collegeCode',async (req,res)=>{

    //check for session variable user
    if(req.session.user){

        //get available courses
        const availableCourses=await student.findAvailableCourses(req.session.user.id,req.params.collegeCode);

        //send availableCourses
        res.send(availableCourses);
    }
    else{

        //send error message
        res.send({error:'Invalid Authorisation'});
    }
})

//route for /db/getChoices (get choices of a student)
router.get('/db/getChoices',async (req,res)=>{

    //check for session variable user
    if(req.session.user){

        //get choices of a student
        const choices=await student.getChoices(req.session.user.id);

        //send choices
        res.send(choices);
    }
    else{

        //send error message
        res.send({error:'Invalid Authorisation'});
    }
})

//route for /db/addChoice (add choice to choices table)
router.post('/db/addChoice',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable user
    if(req.session.user){

        //check for value availability
        if(req.body.coursecode && req.body.collegecode && req.body.choiceno){

            //insert choice
            await student.insertChoice(req.session.user.id,req.body.collegecode,req.body.coursecode,req.body.choiceno);

            //redirection to /choices
            let success="Choice entered Successfully as Choice No: "+req.body.choiceno;
            res.redirect('/choices?success='+success);
        }
        else{

            //redirection to /choices
            let error="Choice Details Missing";
            res.redirect('/choices?error='+error);
        }
    }
    else{
        res.redirect('/login');
    }
})

//route for /db/choiceModify (lock or delete choices)
router.post('/db/choiceModify',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable user
    if(req.session.user){

        //check for button click
        if(req.body.delete){

            //check for button value
            if(req.body.delete==1){

                //delete choices
                await student.deleteChoices(req.session.user.id);

                //redirection to /choices
                let success='Choices Deleted Successfully';
                res.redirect('/choices?success='+success);
            }
            else if(req.body.delete==0){

                //lcok choice
                await student.lockChoice(req.session.user.id);

                //redirection to /choices
                let success='Choices Locked Successfully';
                res.redirect('/choices?success='+success);
            }
            else{

                //redirection to /choices
                let error='Missing Details for Choice Modification';
                res.redirect('/choices?error='+error);
            }
        }
        else{

            //redirection to /choices
            let error='Missing Details for Choice Modification';
            res.redirect('/choices?error='+error);
        }
    }
    else{
        res.redirect('/login');
    }
})

module.exports=router;