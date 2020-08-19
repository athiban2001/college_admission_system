//requiring database connection
const pool=require('../connection');

class adminDB{

//ADMIN FUNCTIONS

    //checking for login credentials
    static async adminLogin(name,password){
        const result=await pool.query('SELECT * FROM admin WHERE adminname=? AND pwd=?',[name,password]);
        return result;
    }

    //validation of tasks using adminname
    static async validate(adminname){
        const result=await pool.query('SELECT COUNT(adminid) AS count FROM admin WHERE adminname=?',adminname);
        if(result[0].count>0){
            return true;
        }
        else{
            return false;
        }
    }

    //update webdata table values
    static async updateWebData(id){
        await pool.query('UPDATE webdata SET value=1 WHERE id=?',id);
    }

    //get views count
    static async countViews(){
        const result=await pool.query('SELECT SUM(view) AS count FROM views');
        return result[0].count;
    }
     
    //call allocation procedure
    static async callAllocation(){
        await pool.query('CALL allocation()');
    }

    //call rejection procedure
    static async callRejection(){
        await pool.query('CALL rejected_adder()');
    }
    

    //call reset procedure
    static async callReset(param){
        await pool.query('CALL reset(?)',param);
    }

/* Students related Functions */

//ALL STUDENTS

    //finding the count of students
    static async countStudents(){
        const studentsCount=await pool.query('SELECT COUNT(studentid) AS count FROM student');
        return studentsCount[0].count;
    }

    //finding all data from students by limit and offsert
    static async allStudents(limit,offset){
        const results=await pool.query('SELECT * FROM student,studdata WHERE student.email=studdata.email ORDER BY studentid LIMIT ?,?',[Number(offset),Number(limit)]);
        return results;
    }

    //finding student profiles using string
    static async findProfile(string){
        const result=await pool.query("select *,LOWER(fname),INSTR(LOWER(fname),?) FROM student,studdata WHERE INSTR(LOWER(fname),?)>0 AND student.email=studdata.email ORDER BY INSTR(LOWER(fname),?);",[string,string,string]);
        return result;
    }

//PARTICULAR STUDENT FUNCTIONS

    //finding student by id
    static async findByID(id){
        const studData=await pool.query('SELECT * FROM student,studdata WHERE studentid=? AND student.email=studdata.email',id);
        return studData;
    }

//OTHER STUDENT FUNCTIONS

    //finding marks of students by id
    static async findMarks(id){
        const result=await pool.query('SELECT * FROM academics WHERE studentid=?',id);
        return result;
    }

    //delete student data by id
    static async deleteStudent(id){
        await pool.query('CALL delete_student(?)',id);
    }

/* Cours Related Functions */

//ALL COURSES

    //finding the count of courses
    static async countCourses(){
        const result=await pool.query('SELECT COUNT(coursecode) AS count FROM course');
        return result[0].count;
    }

    //finding all data of courses by limit and offset
    static async allCourses(limit,offset){
        const result=await pool.query('SELECT * FROM course ORDER BY coursecode LIMIT ?,?',[Number(offset),Number(limit)]);
        return result;
    }

//ADDING COURSE

    //course code for next course to be added
    static async nextCourseCode(){
        const result = await pool.query('SELECT COUNT(coursecode) AS count FROM course');
        let courseCode=String((result[0].count+1));
        while(courseCode.length<3){
            courseCode='0'+courseCode;
        }
        courseCode='CRS'+courseCode;
        return courseCode;
    }

    //validation of course details to be added
    static async validateCourse(courseName,courseTag,courseDescription){
        if(courseTag.length<2||courseTag.length>3){
            return 'Course Tag is Invalid';
        }
        if(courseName.length<10||courseName.length>50){
            return 'Course Name is Invalid';
        }
        if(courseDescription.length<20||courseDescription.length>70){
            return 'Course Description is Invalid';
        }
        const result=await pool.query('SELECT COUNT(coursecode) AS count FROM course WHERE coursetag=?',courseTag);
        if(result[0].count>0){
            return 'The Course is Already Available';
        }
        return '';
    }

    //adding course to the database
    static async addCourse(courseName,courseTag,courseDescription){
        const courseCode=await adminDB.nextCourseCode();
        await pool.query('INSERT INTO course VALUES(?,?,?,?)',[courseCode,courseName,courseTag,courseDescription]);
    }

//FIND COURSES ON CRITERIA

    //find courses based on coursename string
    static async findCourse(string){
        const result=await pool.query('SELECT *,LOWER(coursename),INSTR(LOWER(coursename),?) FROM course WHERE INSTR(LOWER(coursename),?)>0 ORDER BY INSTR(LOWER(coursename),?);',[string,string,string]);
        return result;
    }

    //get string that contains all the details for pagination
    static async findCoursesString(collegeCode){
        const result=await pool.query('SELECT course_details(?) AS course_string',collegeCode);
        return result[0].course_string;
    }

    //find course by coursecode
    static async findCourseByCode(courseCode){
        const result=await pool.query('SELECT * FROM course WHERE coursecode=?',courseCode);
        return result;
    }

    //find courses available on a particular college
    static async findAvailableCourses(collegeCode){
        const result=await pool.query('SELECT course.coursecode,coursename,coursetag,coursedescription,has.available FROM has,course WHERE has.collegecode=? AND has.coursecode=course.coursecode',collegeCode);
        return result;
    }

    //find courses that are not available on a particular college
    static async allRemainingCourses(collegeCode){
        const result=await pool.query('SELECT course.coursecode,coursename,coursetag,coursedescription FROM course WHERE course.coursecode NOT IN (SELECT coursecode FROM has WHERE collegecode=?);',collegeCode);
        return result;
    }

//DELETE COURSE FUNCTIONS

    //delete course based on course code
    static async deleteCourse(courseCode){
        await pool.query('DELETE FROM has WHERE coursecode=?',courseCode);
        await pool.query('DELETE FROM course WHERE coursecode=?',courseCode);
    }

//College Related Functions

//ALL COLLEGE FUNCTIONS

    //count the number of colleges from database
    static async countColleges(){
        const result=await pool.query('SELECT COUNT(collegecode) AS count FROM college');
        return result[0].count;
    }

    //finding all data from college based on limit and offset
    static async allColleges(limit,offset){
        const result=await pool.query('SELECT * FROM college ORDER BY collegecode LIMIT ?,?',[Number(offset),Number(limit)]);
        return result;
    }

//ADD COLLEGE FUNCTIONS

    //next college code for the college to be added
    static async nextCollegeCode(){
        const result=await pool.query('SELECT COUNT(collegecode) AS count FROM college');
        let collegeCode=String((result[0].count+1));
        while(collegeCode.length<3){
            collegeCode='0'+collegeCode;
        }
        collegeCode='CLG'+collegeCode;
        return collegeCode;
    }

    //validate college details of the college to be added
    static async validateCollege(collegeName,collegeDean,collegeCity){
        if(collegeName.length<10||collegeName.length>50){
            return 'College Name is invalid';
        }
        if(collegeDean.length<5||collegeDean.length>30){
            return 'College Dean Name is invalid';
        }
        if(collegeCity.length<5||collegeCity.length>50){
            return 'College Loaction is Invalid';
        }
        const result=await pool.query('SELECT COUNT(collegecode) AS count FROM college WHERE collegename=?',collegeName);
        if(result[0].count>0){
            return 'College with that name already exists';
        }
        return '';
    }

    //add college to the database
    static async addCollege(collegeName,collegeDean,collegeCity){
        const collegeCode=await adminDB.nextCollegeCode();
        await pool.query('INSERT INTO college VALUES(?,?,?,?)',[collegeCode,collegeName,collegeDean,collegeCity]);
    }

    //validate course to be added to the college
    static async validateCourseCollege(collegeCode,courseCode,totalSeats){
        if(typeof collegeCode==='undefined'){
            return 'College Name is Empty';
        }
        if(typeof courseCode==='undefined'){
            return 'Course Name is Empty';
        }
        if(parseInt(totalSeats)<12&&parseInt(totalSeats)>300){
            return 'Total Seats is Invalid';
        }
        return '';
    }

    //insert course to the college in database
    static async insertCourseToCollege(collegeCode,courseCode,totalSeats){
        await pool.query('INSERT INTO has VALUES(?,?,?,?)',[collegeCode,courseCode,totalSeats,totalSeats]);
    }

//FIND COLLEGE FUNCTIONS

    //find colleges by string of collegename
    static async findCollege(string){
        const result=await pool.query('SELECT *,LOWER(collegename),INSTR(LOWER(collegename),?) FROM college WHERE INSTR(LOWER(collegename),?)>0 ORDER BY INSTR(LOWER(collegename),?)',[string,string,string]);
        return result;
    }
    //find colleges based on coursecode
    static async availableColleges(courseCode){
        const result=await pool.query('SELECT collegename,dean,city FROM college,has WHERE has.coursecode=? AND has.collegecode=college.collegecode',courseCode);
        return result;
    }
    
    //find all the details from the college
    static async collegeList(){
        const result=await pool.query('SELECT * FROM college');
        return result;
    }

    //finding the string of college details for pagination
    static async findCollegesString(courseCode){
        const result=await pool.query('SELECT college_details(?) AS college_string',courseCode);
        return result[0].college_string;
    }

    //finding college by code
    static async findCollegeByCode(code){
        const result=await pool.query('SELECT * FROM college WHERE collegecode=?',code);
        return result;
    }
    
//DELETE COLLEGE FUNCTIONS

    //delete college by collegecode
    static async deleteCollege(collegeCode){
        await pool.query('DELETE FROM has WHERE collegecode=?',collegeCode);
        await pool.query('DELETE FROM college WHERE collegecode=?',collegeCode);
    }

    //delete course and college from college code
    static async deleteCourseCollege(collegeCode,courseCode){
        await pool.query('DELETE FROM has WHERE collegecode=? AND coursecode=?',[collegeCode,courseCode]);
    }

/*Admitted Student Functions*/

//ALL ADMITTED

    //count the number of admitted students
    static async countAdmitted(){
        const result=await pool.query('SELECT COUNT(studentid) AS count FROM admitted');
        return result[0].count;
    }

    //getting all admitted data by using limit and offset
    static async allAdmitted(limit,offset){
        const result=await pool.query('SELECT student.studentid,grade.rank,studdata.fname,studdata.lname,college.collegename,course.coursename FROM student,studdata,grade,course,college,admitted WHERE student.studentid=admitted.studentid AND college.collegecode=admitted.collegecode AND grade.studentid=student.studentid AND course.coursecode=admitted.coursecode AND student.email=studdata.email ORDER BY grade.rank LIMIT ?,?',[Number(offset),Number(limit)]);
        return result;
    }

//ALL REJECTED

    //count the number of rejected students
    static async countRejected(){
        const result=await pool.query('SELECT COUNT(studentid) AS count FROM rejected');
        return result[0].count;
    }

    //getting all rejected data by using limit and offset
    static async allRejected(limit,offset){
        const result=await pool.query('SELECT rejected.rank,rejected.studentid,studdata.fname,studdata.lname,academics.cutoff FROM rejected,student,studdata,academics WHERE rejected.studentid=student.studentid AND student.email=studdata.email ORDER BY rejected.rank LIMIT ?,?',[Number(offset),Number(limit)]);
        return result;
    }
}

module.exports=adminDB;