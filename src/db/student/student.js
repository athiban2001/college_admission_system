//require database connection
const pool=require('../connection');

//require validator package
const validator=require('validator');

class studentDB{

//STUDENT HOME FUNCTIONS

    //validate register data before inserting
    static async validateRegister(student){
        if(!validator.isEmail(student.email)){
            return ['Invalid Email',undefined];
        }
        if(!validator.isAfter(student.dateOfBirth,'1998-01-01')){
            return['Invalid Date',undefined];
        }
        if(!(parseInt(student.age)>=18 && parseInt(student.age)<=22)){
            return['Invalid Age',undefined];
        }
        if(student.password!==student.confirmPassword){
            return['Password does not match',undefined];
        }
        student.age=parseInt(student.age);
        student.phone=parseInt(student.phone);

        const alreadyExists=await studentDB.findByEmailOrID(student.email);
        if(alreadyExists.length!==0){
            return['An account with that email already exists',undefined];
        }

        return[undefined,student];
    }
    
    //insert student into database
    static async insertStudent(studData){
        const student={
            fname:studData.firstName,
            lname:studData.lastName,
            gender:studData.gender,
            address:studData.address,
            email:studData.email,
            age:studData.age,
            dob:studData.dateOfBirth,
            phone:studData.phone,
            nationality:studData.nationality,
            pwd:studData.password
        };
        await pool.query("INSERT INTO studdata VALUES(?,?,?,?,?,?,?,?,?,?)",[student.email,student.fname,student.lname,student.address,student.gender,student.age,student.dob,student.phone,student.nationality,student.pwd]); 
        const result=await pool.query("INSERT INTO student(email) VALUES (?)",student.email);
        return {result,email:student.email,dob:student.dob};
    }

//FIND FUNCTIONS

    //find profile by email or ID
    static async findByEmailOrID(string){
        const result=await pool.query('SELECT studentid,studdata.email,fname,lname,address,gender,age,dob,phone,nationality,pwd FROM studdata,student WHERE studdata.email=(select email FROM student WHERE studentid=? or email=?)',[string,string]);
        return result;
    }

//IMAGE FUNCTIONS

    //find image upload status and imagename
    static async findImageName(id){
        const result=await pool.query('SELECT imagename,status FROM image WHERE studentid=?',id);
        return result;
    }

    //update image table with name
    static async updateImage(id){
        let imgName=String(id)+'.jpg';
        const result=await pool.query('UPDATE image SET imagename=?,status=1 WHERE studentid=?',[imgName,id]);
        return result;
    }

//ACADEMICS FUNCTION

    //find academics marks by id
    static async findAcademics(id){
        const result=await pool.query('SELECT * FROM academics WHERE studentid=?',id);
        return result;
    }

    //validate marks before insertion
    static async validateMarks(maths,physics,chemistry){
        if(maths>=70 && maths<=200 && physics>=70 && physics<=200 && chemistry>=70 && chemistry<=200){
            return true;
        }
        else{
            return false;
        }
    }

    //add marks to the table
    static async addMarks(id,dob,maths,physics,chemistry){
        let cutoff=(maths/2+physics/4+chemistry/4);
        const result=await pool.query('INSERT INTO academics VALUE(?,?,?,?,?,?)',[id,dob,maths,physics,chemistry,cutoff]);
        return result;
    }

//RANK FUNCTIONS

    //get the rank of student
    static async getRank(id){
        const result=await pool.query('SELECT * FROM grade WHERE studentid=?',id);
        return result[0].rank;
    }

    //count the number of students in the table
    static async countStudents(){
        const result=await pool.query('SELECT COUNT(studentid) AS count FROM student');
        return result[0].count;
    }

//CHOICE FUNCTIONS

    //find the colleges available for choice entry
    static async availableChoiceColleges(){
        const result=await pool.query('SELECT college.collegecode,college.collegename FROM has,college WHERE has.collegecode=college.collegecode');
        return result;
    }

    //count the number of choices entered by a student
    static async countChoices(id){
        const result=await pool.query('SELECT COUNT(*) AS count FROM choice WHERE studentid=?',id);
        return result[0].count;
    }

    //find the course details of college that were not entered by student before
    static async findAvailableCourses(id,collegeCode){
        const result=await pool.query('SELECT course.coursecode,course.coursename FROM has,course WHERE has.collegecode=? AND has.coursecode=course.coursecode AND has.coursecode NOT IN(SELECT coursecode FROM choice WHERE collegecode=? AND studentid=?);',[collegeCode,collegeCode,id]);
        return result;
    }

    //get choices of students
    static async getChoices(id){
        const result=await pool.query('SELECT college.collegename,course.coursename,choice.choiceno FROM college,course,choice WHERE course.coursecode=choice.coursecode AND college.collegecode=choice.collegecode AND choice.studentid=?',id);
        return result;
    }

    //insert choice of a student
    static async insertChoice(id,collegeCode,courseCode,choiceNo){
        await pool.query('INSERT INTO choice VALUES (?,?,?,?)',[id,collegeCode,courseCode,choiceNo]);
    }

    //get lock choice data of a student
    static async getLockChoice(id){
        const result=await pool.query('SELECT lockchoice FROM lockchoices WHERE studentid=?',id);
        return result[0].lockchoice;
    }

    //delete all choices of a student
    static async deleteChoices(id){
        await pool.query('DELETE FROM choice WHERE studentid=?',id);
    }

    //lock choices of a student
    static async lockChoice(id){
        await pool.query('UPDATE lockchoices SET lockchoice=1 WHERE studentid=?',id);
    }

    //check whether student is admitted or not
    static async isAdmitted(id){
        const result=await pool.query('SELECT * FROM rejected WHERE studentid=?',id);
        if(result.length===0){
            return true;
        }
        else{
            return false;
        }
    }

    //get admitted college,course information of a student
    static async getAdmitted(id){
        const result=await pool.query('SELECT student.studentid,college.collegename,course.coursename FROM student,studdata,course,college,admitted WHERE student.studentid=admitted.studentid AND college.collegecode=admitted.collegecode AND course.coursecode=admitted.coursecode AND student.email=studdata.email AND student.studentid=?',id);
        return result;
    }
}

module.exports=studentDB;