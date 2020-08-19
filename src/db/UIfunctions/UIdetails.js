//require connection
const pool=require('../connection');

class UIdetails{
    //find the state of website for a student
    static async findTaskNumber(id){
        const result=await pool.query('SELECT * FROM academics WHERE studentid=?',id);
        if(result.length===0){
            return 1;
        }
        else{
            let rank='showRank';
            const result=await pool.query('SELECT value FROM webdata WHERE id=?',rank);
            if(result[0].value===0){
                return 2;
            }
            else{
                let choices='getChoices';
                const result=await pool.query('SELECT value FROM webdata WHERE id=?',choices);
                if(result[0].value===0){
                    return 3;
                }
                else{
                    let allocation='allocation';
                    const result=await pool.query('SELECT value FROM webdata WHERE id=?',allocation);
                    if(result[0].value===0){
                        return 4;
                    }
                    else{
                        return 5;
                    }
                }
            }
        }
    }

    //find the state of website for admin
    static async adminTaskNumber(){
        let rank='showRank';
        const result=await pool.query('SELECT value FROM webdata WHERE id=?',rank);
        if(result[0].value===0){
            return 1;
        }
        else{
            let choices='getChoices';
            const result=await pool.query('SELECT value FROM webdata WHERE id=?',choices);
            if(result[0].value===0){
                return 2;
            }
            else{
                let allocation='allocation';
                const result=await pool.query('SELECT value FROM webdata WHERE id=?',allocation);
                if(result[0].value===0){
                    return 3;
                }
                else{
                    return 4;
                }
            }
        }
    }

    //update views of pages
    static async views(page){
        await pool.query('UPDATE views SET view=view+1 WHERE page=?',page);
    }
}

module.exports=UIdetails;