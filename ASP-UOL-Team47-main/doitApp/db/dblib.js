const config =require('./config');
const sqlite3 =require('sqlite3').verbose();


/*Async function implementation */

opendb=(dbName)=> {
    return new Promise((resolve) =>{
      new sqlite3.Database(dbName, 
        function(err) {
            if(err) reject("Database Error While Openning"+ err.message)
            else    resolve(dbName + " Database is opened in async await mode")
        }
    )   
    })
}
//Function still having issue when we open with await opendb
//do not use until it is fixed
const closedb=(dbName)=> {
    return new Promise(function(resolve, reject) {
        dbName.close()
        resolve(true)
    })
}
/**
 * 
 * @param {*} dbName 
 * @param {*} query : generally update, insert, delete statement, even select statement can be pass
 * @returns  true when sucess
 */
const rundb=(dbName , query)=> {
    return new Promise(function(resolve, reject) {
        dbName.run(query, 
            function(err)  {
                if(err) reject(err.message)
                else    resolve(true)
        })
    })    
}

/**
 * 
 * @param {*} dbName: ref of sqlite db variable 
 * @param {*} query : any sql statement  
 * @param {*} params : if any parameter passed within sql statement
 * @returns array of rows, when there is no data length=0 
 */
const  getSqlData =(dbName,query, params)=> {
    return new Promise(function(resolve, reject) {
        if(params == undefined) params=[]

        dbName.all(query, params, function(err, rows)  {
            if(err) reject("Database error occured:" + err.message)
            else {
                resolve(rows)
            }
        })
    }) 
}



//module.exports = router;
module.exports = {
    getSqlData,
    rundb,
    opendb,
    closedb
  };