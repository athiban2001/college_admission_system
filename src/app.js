//require essential node modules
const express=require("express");
const path=require("path");
const session=require('express-session');
const fileUpload=require('express-fileupload');
const cors=require('cors');


//require routers for files
const homeRouter=require("./router/homeRouter");
const studentRouter=require("./router/studentRouter");
const adminRouter=require("./router/adminRouter");
const dbMainRouter=require('./router/dbMainRouter');
const dbStudentRouter=require('./router/dbStudentRouter');
const dbAdminRouter=require('./router/dbAdminRouter');

//port number
const PORT=process.env.PORT || 3000;

//directory path for public and views
const publicDirectoryPath=path.join(__dirname,'../public');
const viewPath=path.join(__dirname,'../templates/views');

//creating server
const app=express();
//converting body from json to object

//setting middleware functions
app.use(fileUpload());
app.use(express.static(publicDirectoryPath));
app.use(session({secret:'collegeAdmission',resave:true,saveUninitialized:true,maxAge: Date.now() + (30 * 86400 * 1000)}));
app.use(cors({origin: false}));

//setting templates directory for views
app.set('views',viewPath);
app.set('view engine','ejs');

//serving routers
app.use(homeRouter);
app.use(dbMainRouter);

app.use(studentRouter);
app.use(dbStudentRouter);

app.use(adminRouter);
app.use(dbAdminRouter);


//listening for requests on port 3000
app.listen(PORT,()=>{
    console.log("Server is up and running on "+PORT);
})