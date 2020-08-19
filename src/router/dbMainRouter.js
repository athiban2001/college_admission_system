//require npm package
const express=require('express');

//require db files
const student=require('../db/student/student');
const admin=require('../db/admin/admin');

const router=new express.Router();

//route for /db/register (insert student to database)
router.post('/db/register',express.urlencoded({extended:false}),async (req,res)=>{

    //validation of register
    const [err,studData]=await student.validateRegister(req.body);

    //check for error
    if(err){
        return res.redirect('/register?error='+err);
    }

    //insert student
    const result=await student.insertStudent(studData);

    //setup session
    const sessionData=req.session;
    sessionData.user={};
    sessionData.user.id=result.result.insertId;
    sessionData.user.email=result.email;
    sessionData.user.dob=result.dob;

    //redirection to /profile
    res.redirect('/profile');
})

//route for /db/admin (admin login page validation)
router.post('/db/admin',express.urlencoded({extended:false}),async (req,res)=>{

    //check for admin with the credentials
    const adminData=await admin.adminLogin(req.body.name,req.body.password);

    //if not exists
    if(adminData.length===0){
        let error='Incorrect Login Credentials';
        res.redirect('/admin?error='+error);
    }
    else{

        //setup session
        const sessionData=req.session;
        sessionData.admin={};
        sessionData.admin.name=adminData[0].adminname;
        sessionData.admin.adminid=adminData[0].adminid;

        //redirect to /adminHome
        res.redirect('/adminHome');
    }
})

//route get /db/login (student login validation)
router.post('/db/login',express.urlencoded({extended:false}),async (req,res)=>{

    //find student by email
    const studData=await student.findByEmailOrID(req.body.email);

    //if no student was found
    if(studData.length===0){
        let error='No Account was found';
        res.redirect('/login?error='+error);
    }
    else{

        //check for password match
        if(studData[0].pwd===req.body.password){

            //setup session
            const sessionData=req.session;
            sessionData.user={};
            sessionData.user.id=studData[0].studentid;
            sessionData.user.email=studData[0].email;
            sessionData.user.dob=studData[0].dob;

            //redirect to /profile
            res.redirect('/profile');
        }
        else{

            //redirection to /login
            let error='Incorrect Login Details';
            res.redirect('/login?error='+error);
        }
    }
})

module.exports=router;