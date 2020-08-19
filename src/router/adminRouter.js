//requiring npm packages
const express=require('express');
const fetch=require('node-fetch');

//requiring db files
const admin=require('../db/admin/admin');
const UIdetails=require('../db/UIfunctions/UIdetails');

const router=new express.Router();

//HOME ROUTES

//router for /adminHome (Admin Home Page)
router.get('/adminHome',async (req,res)=>{
    
    //checking for session variable admin
    if(req.session.admin){
        const studentsCount=await admin.countStudents();
        const coursesCount=await admin.countCourses();
        const collegesCount=await admin.countColleges();
        const taskNumber=await UIdetails.adminTaskNumber();
        const viewsCount=await admin.countViews();

        //checking for query string error
        if(req.query.error){
            res.render('adminHome',{title:'home',studentsCount,viewsCount,coursesCount,collegesCount,taskNumber,error:{title:'Not Now !',content:req.query.error}});
        }
        else{

            //checking for query string success
            if(req.query.success){
                res.render('adminHome',{title:'home',studentsCount,viewsCount,coursesCount,collegesCount,taskNumber,success:{title:'Task Accomplished ! ',content:req.query.success}});
            }
            else{
                res.render('adminHome',{title:'home',studentsCount,viewsCount,coursesCount,collegesCount,taskNumber});
            }
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /admitted (all admitted stduents pagination)
router.get('/admitted',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get page from query string
        let page=0;
        if(req.query.page){
            page=req.query.page-1;
        }

        //calculating limit and skip from page
        const limit=5;
        const skip=page*limit;

        //data for validating admin
        const data={id:req.session.admin.name};

        //fetch data from /db/admitted using limit and skip
        const response=await fetch('http://localhost:3000/db/admitted?limit='+limit+'&skip='+skip,{
            method:'post',
            body:JSON.stringify(data),
            headers:{'Content-type':'application/json'}
        });
        const responseData=await response.json();

        //calculating total pages using count of admitted
        const totalPages=Math.ceil(responseData.count/limit);

        res.render('admitted',{title:'home',totalPages,students:responseData.students,page:(page+1)});
    }
    else{
        res.redirect('/admin');
    }
})

//route for /rejected (all rejected students pagination) 
router.get('/rejected',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get page from query string
        let page=0;
        if(req.query.page){
            page=req.query.page-1;
        }

        //get limit and skip from page value
        const limit=5;
        const skip=page*limit;

        //data for validating admin
        const data={id:req.session.admin.name};

        //fetch data from /db/rejected using limit and skip
        const response=await fetch('http://localhost:3000/db/rejected?limit='+limit+'&skip='+skip,{
            method:'post',
            body:JSON.stringify(data),
            headers:{'Content-type':'application/json'}
        });
        const responseData=await response.json();

        //calculating total pages using count of all rejected
        const totalPages=Math.ceil(responseData.count/limit);
        res.render('rejected',{title:'home',totalPages,students:responseData.students,page:(page+1)});
    }
    else{
        res.redirect('/admin');
    }
})

router.get('/adminlogout',async (req,res)=>{
    const sessionData=req.session;
    sessionData.destroy((err)=>{
        res.redirect('/admin');
    })
})

//STUDENT DROPDOWN ROUTES

//route for /searchStudent (Searching a student by the name)
router.get('/searchStudent',async (req,res)=>{
    
    //checking for session variable admin
    if(req.session.admin){
        res.render('searchStudent',{title:'students'});
    }
    else{
        res.redirect('/admin');
    }
})

//route for /students (All students pagination)
router.get('/students',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //getting page from query string
        let page=0;
        if(req.query.page){
            page=req.query.page-1;
        }

        //calculating limit and offset from page number
        const limit=5;
        const skip=page*limit;

        //data for validation of admin
        const data={id:req.session.admin.name};

        //fetch data from /db/students with limit and skip data
        const response=await fetch('http://localhost:3000/db/students?limit='+limit+'&skip='+skip,{
            method:'post',
            body:JSON.stringify(data),
            headers:{'Content-type':'application/json'}
        });
        const responseData=await response.json();

        //find totalpages needed based on count
        const totalPages=Math.ceil(responseData.count/limit);

        res.render('students',{title:'students',students:responseData.students,page:(page+1),totalPages:totalPages});
    }
    else{
        res.redirect('/admin');
    }
})

//route for /deleteStudent (Delete a student by ID)
router.get('/deleteStudent',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){
        if(req.query.success){
            res.render('deleteStudent',{title:'students',success:{title:'Deleted ! ',content:req.query.success}});
        }
        else{
            res.render('deleteStudent',{title:'students'});
        }
    }
    else{
        res.redirect('/admin');
    }
})

//COURSE DROPDOWN ROUTES

//route for /addCourse (Add a Course to List)
router.get('/addCourse',async (req,res)=>{

    //checking for session variable admin
    if(req.session.admin){

        //check for query string error
        if(req.query.error){
            res.render('addCourse',{title:'courses',error:{title:'Course Not Registered',content:req.query.error}});
        }
        else{

            //check for query string success
            if(req.query.success){
                res.render('addCourse',{title:'courses',success:{title:'Course registered Successfully',content:req.query.success}});
            }
            else{
                res.render('addCourse',{title:'courses'});
            }
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /searchCourse (Search for a course by course name)
router.get('/searchCourse',async (req,res)=>{
    
    //check for session variable admin
    if(req.session.admin){
        res.render('searchCourse',{title:'courses'});
    }
    else{
        res.redirect('/admin');
    }
})

//route for /courses (All courses pagination)
router.get('/courses',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get page value from query string
        let page=0;
        if(req.query.page){
            page=req.query.page-1;
        }

        //calculating limit and offset from page
        const limit=5;
        const skip=page*limit;

        //data for validating admin
        const data={id:req.session.admin.name};

        //fetch data from /db/courses
        const response=await fetch('http://localhost:3000/db/courses?limit='+limit+'&skip='+skip,{
            method:'post',
            body:JSON.stringify(data),
            headers:{'Content-type':'application/json'}
        });
        const responseData=await response.json();

        //calculating total pages using count of courses
        const totalPages=Math.ceil(responseData.count/limit);
        res.render('courses',{title:'courses',totalPages,courses:responseData.courses,page:(page+1)});
    }
    else{
        res.redirect('/admin');
    }
})

//route for /deleteCourse (Delete a course by id)
router.get('/deleteCourse',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get admin state
        const taskNumber=await UIdetails.adminTaskNumber();

        //check for query string success
        if(req.query.success){
            res.render('deleteCourse',{title:'courses',taskNumber,success:{title:'Course Deleted ! ',content:req.query.success}});
        }
        else{
            res.render('deleteCourse',{title:'courses',taskNumber});
        }
    }
    else{
        res.redirect('/admin');
    }
})

//COLLEGE DROPDOWN ROUTES

//route for /addCollege (Add a College to the list)
router.get('/addCollege',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //check for query string error
        if(req.query.error){
            res.render('addCollege',{title:'colleges',error:{title:'College Not Added',content:req.query.error}});
        }
        else{

            //check for query string success
            if(req.query.success){
                res.render('addCollege',{title:'colleges',success:{title:'College Added Successfully !',content:req.query.success}});
            }
            else{
                res.render('addCollege',{title:'colleges'});
            }
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /addCourseToCollege (Add a Course to College)
router.get('/addCourseToCollege',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get all colleges list
        const collegeList=await admin.collegeList();

        //check for query string error
        if(req.query.error){
            res.render('addCourseToCollege',{title:'colleges',collegeList,error:{title:'Course Not Added',content:req.query.error}});
        }
        else{

            //check for query string success
            if(req.query.success){
                res.render('addCourseToCollege',{title:'colleges',collegeList,success:{title:'Course Added Successfully !',content:req.query.success}});
            }
            else{
                res.render('addCourseToCollege',{title:'colleges',collegeList});
            }
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /colleges (All colleges pagination)
router.get('/colleges',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get page value from query string
        let page=0;
        if(req.query.page){
            page=req.query.page-1;
        }

        //calculating limit and offset from page
        const limit=5;
        const skip=page*limit;

        //data for validating admin
        const data={id:req.session.admin.name};

        //fetch data from /db/colleges using limit and skip
        const response=await fetch('http://localhost:3000/db/colleges?limit='+limit+'&skip='+skip,{
            method:'post',
            body:JSON.stringify(data),
            headers:{'Content-type':'application/json'}
        });
        const responseData=await response.json();

        //calculating total pages using count of colleges
        const totalPages=Math.ceil(responseData.count/limit);

        res.render('colleges',{title:'colleges',colleges:responseData.colleges,page:(page+1),totalPages});
    }
    else{
        res.redirect('/admin');
    }
})

//route for /collegeCourses (Show all courses of a college)
router.get('/collegeCourses',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){
        res.render('collegeCourses',{title:'colleges'});
    }
    else{
        res.redirect('/admin');
    }
})


//route for /deleteCollege (delete a college by id)
router.get('/deleteCollege',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get admin state
        const taskNumber=await UIdetails.adminTaskNumber();

        //check for query string success
        if(req.query.success){
            res.render('deleteCollege',{title:'colleges',taskNumber,success:{title:'College Deleted ! ',content:req.query.success}});
        }
        else{
            res.render('deleteCollege',{title:'colleges',taskNumber});
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /deleteCourseCollege (Delete a course from a college)
router.get('/deleteCourseCollege',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){
        
        //get admin state
        const taskNumber=await UIdetails.adminTaskNumber();

        //get all colleges list
        const colleges=await admin.collegeList();

        //check for query string error
        if(req.query.error){
            res.render('deleteCourseCollege',{title:'colleges',taskNumber,colleges,error:{title:'Course Not Deleted ! ',content:req.query.error}});
        }
        else{

            //check for query string success
            if(req.query.success){
                res.render('deleteCourseCollege',{title:'colleges',taskNumber,colleges,success:{title:'Course Deleted ! ',content:req.query.success}});
            }
            else{
                res.render('deleteCourseCollege',{title:'colleges',taskNumber,colleges});
            }
        }
    }
    else{
        res.redirect('/admin');
    }
})


module.exports=router;