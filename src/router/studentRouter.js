//requiring npm packages
const express=require('express');
const puppeteer=require('puppeteer');

//requiring db files
const student=require('../db/student/student');
const UIdetails=require('../db/UIfunctions/UIdetails');

const router=new express.Router();

//PDF FUNCTION

//function to get pdf format of a webpage
async function printPDF(id){

    //open browser
    const browser=await puppeteer.launch({headless:true});
    const page=await browser.newPage();
    
    //pdf webpage
    await page.goto(`http://localhost:3000/pdf/${id}`,{waitUntil:'networkidle0'});
    const pdf=await page.pdf({format:'A4'});

    //close browser
    await browser.close();

    //return pdf buffer
    return pdf;
}

//PDF ROUTE

//route for /getPDF (get PDF from the file)
router.get('/getPDF',async (req,res)=>{

    //call pdf function
    printPDF(req.session.user.id).then(pdf => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length,'Content-Disposition':'attachment;filename="allotment-order.pdf"' })
        res.send(pdf)
    })
})

//route for /pdf/1 (pdf page of student 1) 
router.get('/pdf/:studentId',async (req,res)=>{

    
    //get all the necessary data
    const studData=await student.findByEmailOrID(req.params.studentId);
    if(studData.length!==0){
    const academics=await student.findAcademics(req.params.studentId);
    const rank=await student.getRank(req.params.studentId);
    const admitted=await student.getAdmitted(req.params.studentId);

    res.render('pdf',{student:studData,academics,rank,admitted});
    }
    else{
        res.send({error:'Invalid ID'});
    }
})

//HOME ROUTE

//route for /profile (show data of a student)
router.get('/profile',async (req,res)=>{

    //check for session variable user
    if(req.session.user){

        //check for image upload
        const imageResult=await student.findImageName(req.session.user.id);

        if(imageResult[0].status==0){
            if(req.query.error){
                res.render('loginHome',
                    {title:'home',
                    imageName:imageResult[0].imagename,
                    showProfile:0,
                    error:{title:'Upload Unsuccessful ',content:req.query.error},
                    success:{title:'',content:''}});
            }
            else{
                res.render('loginHome',
                    {title:'home',
                    imageName:imageResult[0].imagename,
                    showProfile:0,
                    error:{title:'',content:''},
                    success:{title:'',content:''}});
            }
        }
        else{

            //check for state 5 and getting admitted data
            const studData=await student.findByEmailOrID(req.session.user.id);
            const taskNumber=await UIdetails.findTaskNumber(req.session.user.id);

            if(taskNumber===5){

                //check for admitted or rejected
                const isAdmitted=await student.isAdmitted(req.session.user.id);
                if(isAdmitted){

                    //get admitted data
                    const getAdmitted=await student.getAdmitted(req.session.user.id);

                    res.render('loginHome',
                    {title:'home',
                    imageName:imageResult[0].imagename,
                    showProfile:1,
                    student:studData,
                    taskNumber:taskNumber,
                    isAdmitted,
                    getAdmitted,
                    error:{title:'',content:''},
                    success:{title:'',content:''}});
                }
                else{

                    res.render('loginHome',
                    {title:'home',
                    imageName:imageResult[0].imagename,
                    showProfile:1,
                    student:studData,
                    taskNumber:taskNumber,
                    isAdmitted,
                    error:{title:'',content:''},
                    success:{title:'',content:''}});
                }
            }
            else{

                //check for query string success
                if(req.query.success){

                    res.render('loginHome',
                        {title:'home',
                        imageName:imageResult[0].imagename,
                        showProfile:1,
                        student:studData,
                        taskNumber:taskNumber,
                        error:{title:'',content:''},
                        success:{title:'Upload Successful',content:req.query.success}});
                }
                else{

                    res.render('loginHome',
                        {title:'home',
                        imageName:imageResult[0].imagename,
                        showProfile:1,
                        student:studData,
                        taskNumber:taskNumber,
                        error:{title:'',content:''},
                        success:{title:'',content:''}});
                }
            }
        }
    }
    else{
        res.redirect('/login');
    }
})

//ACADEMICS ROUTE

//route for /academics (show and get marks of students)
router.get('/academics',async (req,res)=>{

    //check for session variable user
    if(req.session.user){

        //get imagename and marks
        let imageName=String(req.session.user.id)+'.jpg';
        let marks=0;

        //get state
        const taskNumber=await UIdetails.findTaskNumber(req.session.user.id);

        //check for state !=1
        if(taskNumber!==1){
            marks=await student.findAcademics(req.session.user.id);
        }

        //check for query string success
        if(req.query.success){
            res.render('academics',{title:'academics',imageName:imageName,taskNumber:taskNumber,marks:marks,success:{title:'Successful',content:req.query.success}});
        }
        else{
            //check for query string error
            if(req.query.error){
                res.render('academics',{title:'academics',imageName:imageName,taskNumber:taskNumber,marks:marks,error:{title:'Unsuccessful',content:req.query.error}});
            }
            else{
                res.render('academics',{title:'academics',taskNumber:taskNumber,marks:marks,imageName:imageName});
            }
        }
    }
    else{
        res.redirect('/login');
    }
})

//RANK ROUTE

//route for /rank (show rank of students)
router.get('/rank',async (req,res)=>{

    //check for session variable user
    if(req.session.user){

        //get state
        const taskNumber=await UIdetails.findTaskNumber(req.session.user.id);

        //get imagename
        let imageName=String(req.session.user.id)+'.jpg';

        //check for state <=2
        if(taskNumber<=2){
            res.render('rank',{title:'rank',imageName:imageName,taskNumber:taskNumber});
        }
        else{

            //get rank and academic details
            const rank=await student.getRank(req.session.user.id);
            const marks=await student.findAcademics(req.session.user.id);
            const count=await student.countStudents();

            res.render('rank',{title:'rank',imageName:imageName,taskNumber,rank,count,marks});
        }
    }
    else{
        res.redirect('/login');
    }
})

//CHOICE ROUTE

//route for /choices (get and show choices of students)
router.get('/choices',async (req,res)=>{

    //check for session variable user
    if(req.session.user){

        //get state
        const taskNumber=await UIdetails.findTaskNumber(req.session.user.id);

        //get image name
        let imageName=String(req.session.user.id)+'.jpg';

        //check for state <=3
        if(taskNumber<=3){
            res.render('choices',{title:'choices',taskNumber,imageName});
        }
        else{

            //get college and choice details
            const colleges=await student.availableChoiceColleges();
            const choiceCount=await student.countChoices(req.session.user.id);
            const lockChoice=await student.getLockChoice(req.session.user.id);

            //check for query string success
            if(req.query.success){
                res.render('choices',{title:'choices',taskNumber,lockChoice,colleges,choiceCount,imageName,success:{title:'Choice Added ! ',content:req.query.success}});
            }
            else{

                //check for query string error
                if(req.query.error){
                    res.render('choices',{title:'choices',taskNumber,lockChoice,colleges,choiceCount,imageName,error:{title:'Choice Not Added ! ',content:req.query.error}})
                }
                else{
                    res.render('choices',{title:'choices',colleges,lockChoice,choiceCount,taskNumber,imageName});
                }
            }
        }
    }
    else{
        res.redirect('/login');
    }
})

//LOGOUT ROUTE

//route for /logout (destroying session variables)
router.get('/logout',async (req,res)=>{
    const sessionData=req.session;
    sessionData.destroy((err)=>{
        res.redirect('/login');
    })
})

module.exports=router;