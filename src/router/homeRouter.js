//require express for creating routes
const express=require('express');

//require db files
const UIdetails=require('../db/UIfunctions/UIdetails');

//creating new routers
const router=new express.Router();

//response for home page
router.get('/',async (req,res)=>{
    
    //update views
    await UIdetails.views('index');
    res.render('index',{title:'home'});
})

router.get('/login',async (req,res)=>{

    //update views
    await UIdetails.views('login');

    //check for query string error
    if(req.query.error){
        res.render('login',{title:'login',error:{title:'Login Unsuccessful!',content:req.query.error}});
    }
    else{
        res.render('login',{title:'login',error:{title:'',content:''}});
    }
})

router.get('/register',async (req,res)=>{

    //update views
    await UIdetails.views('register');

    //get admin state
    const taskNumber=await UIdetails.adminTaskNumber();

    //check for query string error
    if(req.query.error){
        res.render('register',{title:'register',taskNumber,error:{title:'Registration Unsuccessful',content:req.query.error}});
    }
    else{
        res.render('register',{title:'register',taskNumber,error:{title:'',content:''}});
    } 
})

router.get('/admin',async (req,res)=>{

    //check for query string error
    if(req.query.error){
        res.render('admin',{title:'admin',error:{title:'Login Unsuccessful',content:req.query.error}});
    }
    else{
        res.render('admin',{title:'admin'});
    } 
})

//exports the main home page router
module.exports=router;