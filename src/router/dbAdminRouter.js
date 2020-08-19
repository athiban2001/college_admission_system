//requiring npm packages
const express=require('express');

//requiring db files
const admin=require('../db/admin/admin');
const UIdetails=require('../db/UIfunctions/UIdetails');

const router=new express.Router();

//HOME ROUTES

//route for /db/showRank (update showRank value in webdata)
router.post('/db/showRank',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get admin state
        const taskNumber=await UIdetails.adminTaskNumber();

        //check for admin state 1
        if(taskNumber===1){

            //update webdata
            await admin.updateWebData('showRank');

            //redirecttion to adminhome
            let success='Registration has been closed And Ranks are calculated';
            res.redirect('/adminHome?success='+success);
        }
        else{

            //redirecttion to admin home
            let error='You cannot do this right now!';
            res.redirect('/adminHome?error='+error);
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/getChoices (updation of getChoices value in webdata)
router.post('/db/getChoices',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get admin state
        const taskNumber=await UIdetails.adminTaskNumber();

        //check for admin state 2
        if(taskNumber===2){

            //update webdata
            await admin.updateWebData('getChoices');

            //redirection to /adminHome
            let success='We are getting Choices from The students';
            res.redirect('/adminHome?success='+success);
        }
        else{

            //redirection to /adminHome
            let error='You cannot do this right now!';
            res.redirect('/adminHome?error='+error);
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/allocation (update allocation value in webdata)
router.post('/db/allocation',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get admin state
        const taskNumber=await UIdetails.adminTaskNumber();

        //check for admin state 3
        if(taskNumber===3){

            //update webdata
            await admin.updateWebData('allocation');

            //call allocation
            await admin.callAllocation();

            //call rejection
            await admin.callRejection();

            //redirection to /adminHome
            let success='We are allocating Colleges to Students';
            res.redirect('/adminHome?success='+success);
        }
        else{

            //redirection to /adminHome
            let error='You cannot do this right now!';
            res.redirect('/adminHome?error='+error);
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/admitted (get admitted students data)
router.post('/db/admitted',express.json(),async (req,res)=>{

    const validation=await admin.validate(req.body.id);

    //check for validation of admin
    if(validation){

        //get limit and skip value from query string
        const limit=req.query.limit || 5;
        const skip=req.query.skip || 0;

        //find number of admitted
        const count=await admin.countAdmitted();

        //check for offset value greater than count
        if(skip>=count){
            return res.send({error:'Invalid Offset Value'});
        }

        //get admitted data
        const students=await admin.allAdmitted(limit,skip);

        //send studentdata and count
        res.send({students,count});
    }
    else{
        res.redirect({error:'Invalid Authorisation'});
    }
})

//route for /db/rejected (get rejected students data)
router.post('/db/rejected',express.json(),async (req,res)=>{
    const validation=await admin.validate(req.body.id);

    //check for validation of admin
    if(validation){

        //get limit and skip from query string
        const limit=req.query.limit || 5;
        const skip=req.query.skip || 0;

        //count rejected students
        const count=await admin.countRejected();

        //check for offset value greater than count
        if(skip>=count){
            return res.send({error:'Invalid Offset Value'});
        }

        //get rejected students
        const students=await admin.allRejected(limit,skip);

        //send students and count
        res.send({students,count});
    }
    else{
        res.redirect({error:'Invalid Authorisation'});
    }
})

//route for /db/reset (reset all data from the database)
router.post('/db/reset',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //check for checkbox checked or not
        if(req.body.college=='true'){

            //call reset function
            await admin.callReset(1);
        }
        else{

            //call reset function
            await admin.callReset(0);
        }
        res.redirect('/adminlogout');
    }
    else{
        res.redirect('/admin');
    }
})

//STUDENT DROPDOWN ROUTES

//route for /db/searchStudent (get data for searchStudent route)
router.get('/db/searchStudent',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get students from string
        const result=await admin.findProfile(req.query.string);

        //each student add marks property
        for(let student of result){
            const marks=await admin.findMarks(student.studentid);
            if(marks.length===1){
                student.marks=marks;
            }
        }

        //send result
        res.send(result);
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/profileById (send profile of student by id)
router.get('/db/profileById',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //finding student
        const studData=await admin.findByID(req.query.id);

        //finding marks
        const marks=await admin.findMarks(req.query.id);

        //adding marks property
        if(marks.length===1){
            studData[0].marks=marks;
        }

        //send studentdata
        res.send(studData);
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/deleteStudent/1 (delete student  by id 1)
router.post('/db/deleteStudent/:id',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //check for delete button value
        if(req.body.delete==1){

            //delte student
            await admin.deleteStudent(req.params.id);
            let success="Student Deleted Successfully";
            res.redirect('/deleteStudent?success='+success);
        }
        else{
            //redirection to /deleteStudent
            res.redirect('/deleteStudent');
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/students (get all students data)
router.post('/db/students',express.json(),async (req,res)=>{
    const validation=await admin.validate(req.body.id);

    //check for validation of admin
    if(validation){

        //get limit and skip value from query string
        const limit=req.query.limit || 5;
        const skip=req.query.skip || 0;

        //count number of students
        const count=await admin.countStudents();

        //check for offset value greater than count
        if(skip>=count){
            return res.send({error:'Invalid Offset Value'});
        }

        //get all students data
        const students=await admin.allStudents(limit,skip);

        //send students and count
        res.send({students,count});
    }
    else{
        res.redirect('/admin');
    }
})

//COURSE DROPDOWN ROUTES

//route for /db/addCourse (add course to the table)
router.post('/db/addCourse',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){
        const courseValidation=await admin.validateCourse(req.body.coursename,req.body.coursetag,req.body.coursedescription);
        
        //check for course validation
        if(courseValidation===''){

            //add course
            await admin.addCourse(req.body.coursename,req.body.coursetag,req.body.coursedescription);

            //redirection to /addCourse
            let success=req.body.coursename+' is added'
            res.redirect('/addCourse?success='+success);
        }
        else{

            //redirection to /addCourse
            res.redirect('/addCourse?error='+courseValidation);
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/searchCourse (search course by course name)
router.get('/db/searchCourse',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //check for query string existence
        if(req.query.string){

            //find course by string
            const courses=await admin.findCourse(req.query.string);

            //add available colleges of each course as a property
            for(const course of courses){
                const availableColleges=await admin.availableColleges(course.coursecode);
                if(availableColleges.length!==0){
                    course.colleges=availableColleges;
                }
            }

            //send courses
            res.send(courses);
        }
        else{

            //send error message
            res.send({error:'Invalid Query String'});
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/courses (get all courses data)
router.post('/db/courses',express.json(),async (req,res)=>{
    const validation=await admin.validate(req.body.id);

    //check for validation of admin
    if(validation){

        //get limit and skip from query string
        const limit=req.query.limit||5;
        const skip=req.query.skip||0;

        //get count of courses
        const count=await admin.countCourses();

        //check for skip greater than count
        if(skip>=count){
            return res.send({error:'Invalid Offset Value'});
        }

        //get all courses using limit and skip
        const courses=await admin.allCourses(limit,skip);

        //for each course get college string
        for(let course of courses){
            const collegeString=await admin.findCollegesString(course.coursecode);

            //split by ;
            let subarray=collegeString.split(';');

            let data=[];

            //for each subarraysplit by : and push to data
            subarray.forEach((substring)=>{
                if(substring.split(':')[0]!==''){
                    data.push({collegecode:substring.split(':')[0],collegename:substring.split(':')[1]});
                }
            })

            //add colleges property to course
            course.colleges=data;
        }

        //send courses and count
        res.send({courses,count});
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/courseByCode/CRS001 (get course with coursecode CRS001)
router.get('/db/courseByCode/:courseCode',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //find course by code
        const course=await admin.findCourseByCode(req.params.courseCode);

        //check for availablility
        if(course.length!==0){

            //find available colleges
            const colleges=await admin.availableColleges(course[0].coursecode);

            //add colleges property
            course[0].colleges=colleges;
        }

        //send courses
        res.send(course);
    }
    else{

        //send error
        res.send({error:'Invalid Authentication'});
    }
})

//route for /db/deleteCourse/CRS001 (delete course with code CRS001)
router.post('/db/deleteCourse/:courseCode',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //check for delete button value
        if(req.body.delete==1){

            //delete course
            await admin.deleteCourse(req.params.courseCode);

            //redirection to /deleteCourse
            let success=req.params.courseCode+' course deleted successfully';
            res.redirect('/deleteCourse?success='+success);
        }
        else{

            //redirection to /deleteCourse
            res.redirect('/deleteCourse');
        }
    }
    else{
        res.redirect('/admin');
    }
})

//COLLEGE DROPDOWN ROUTES

//route for /db/addCollege (add college to the table)
router.post('/db/addCollege',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){
        const validation=await admin.validateCollege(req.body.collegename,req.body.collegedean,req.body.collegecity);

        //check for college validation
        if(validation===''){

            //add college
            await admin.addCollege(req.body.collegename,req.body.collegedean,req.body.collegecity);

            //redirection to /addCollege
            let success=req.body.collegename+' added to Colleges';
            res.redirect('/addCollege?success='+success);
        }
        else{

            //redirection to /addCollege
            res.redirect('/addCollege?error='+validation);
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/availableCourses/CLG001 (get available courses in the college CLG001)
router.get('/db/availableCourses/:collegeCode',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get available courses
        const courses=await admin.findAvailableCourses(req.params.collegeCode);

        //send courses
        res.send(courses);
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/addCourseToCollege (add course to college)
router.post('/db/addCourseToCollege',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){
        const validation=await admin.validateCourseCollege(req.body.collegecode,req.body.coursecode,req.body.totalseats);

        //check for validation of course college
        if(validation===''){

            //insert course college
            await admin.insertCourseToCollege(req.body.collegecode,req.body.coursecode,req.body.totalseats);

            //redirection to /addCourseToCollege
            let success='Course added to the College with '+req.body.totalseats+' seats';
            res.redirect('/addCourseToCollege?success='+success);
        }
        else{

            //redirection to /addCourseToCollege
            res.redirect('/addCourseToCollege?error='+validation);
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/courses/CLG001 (all remaining courses not available in college CLG001)
router.get('/db/courses/:collegeCode',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //get remaining courses
        const courses=await admin.allRemainingCourses(req.params.collegeCode);

        //send courses
        res.send(courses);
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/colleges (get all colleges data for pagination)
router.post('/db/colleges',express.json(),async (req,res)=>{
    const validation=await admin.validate(req.body.id);

    //check for admin validation
    if(validation){

        //get limit and offset from query string
        const limit=req.query.limit||5;
        const skip=req.query.skip||0;

        //count the number of colleges
        const count=await admin.countColleges();

        //check for offset greater than cout
        if(skip>=count){
            return res.send({error:'Invalid Offset Value'});
        }

        //get all colleges
        const colleges=await admin.allColleges(limit,skip);

        //get available courses string for each college
        for(let college of colleges){

            //find course string
            const courseDetails=await admin.findCoursesString(college.collegecode);

            //split by ;
            let subarray=courseDetails.split(';');

            let data=[];

            //foreach element in subarray split by :
            subarray.forEach((substring)=>{
                if(substring.split(':')[0]!==''){
                    data.push({coursetag:substring.split(':')[0],coursename:substring.split(':')[1]});
                }
            })

            //add data as a property
            college.courses=data;
        }

        //send colleges and count
        res.send({colleges,count});
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/searchCollege (search college by college name)
router.get('/db/searchCollege',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //find college by string
        const colleges=await admin.findCollege(req.query.string);

        //for each college add available courses
        for(let college of colleges){
            const courses=await admin.findAvailableCourses(college.collegecode);
            college.courses=courses;
        }

        //send colleges
        res.send(colleges);
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/collegeByCode/1 (get college data of college CLG001)
router.get('/db/collegeByCode/:collegeCode',async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //find college by code
        const college=await admin.findCollegeByCode(req.params.collegeCode);

        //check for college availability
        if(college.length!==0){

            //find available courses of that collegecode
            const availableCourses=await admin.findAvailableCourses(college[0].collegecode);

            //add property courses as availableCourses
            college[0].courses=availableCourses;
        }

        //send college
        res.send(college);
    }
    else{
        res.send({error:'Not Authorised'});
    }
})

//route for /db/deleteCollege/CLG001 (delete college with code CLG001)
router.post('/db/deleteCollege/:collegeCode',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //check for delete button value
        if(req.body.delete==1){

            //delete college
            await admin.deleteCollege(req.params.collegeCode);

            //redirection to /deleteCollege
            let success=req.params.collegeCode+' deleted Successfully';
            res.redirect('/deleteCollege?success='+success);
        }
        else{

            //redirection to /deleteCollege
            res.redirect('/deleteCollege');
        }
    }
    else{
        res.redirect('/admin');
    }
})

//route for /db/deleteCourseCollege (delete course in a college)
router.post('/db/deleteCourseCollege',express.urlencoded({extended:true}),async (req,res)=>{

    //check for session variable admin
    if(req.session.admin){

        //check for coursecode
        if(req.body.coursecode){

            //delete course of college
            await admin.deleteCourseCollege(req.body.collegecode,req.body.coursecode);

            //redirection to /deleteCourseCollege
            let success=`Course(${req.body.coursecode}) deleted from College(${req.body.collegecode})`;
            res.redirect('/deleteCourseCollege?success='+success);
        }
        else{

            //redirection to /deleteCourseCollege
            let error='Course Name not specified';
            res.redirect('/deleteCourseCollege?error='+error);
        }
    }
    else{
        res.redirect('/admin');
    }
})

module.exports=router;