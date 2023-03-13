
/**
 * To upgrade a existing doitApp/db/doit.db database file
 * @config conigurations are taken from config.js file
 * To upgrade table schema or default values, run following command.
 * If patch is already applied script will skipped
 *  cd doitApp
 *  node ./db/dbUpgrade 
 */
const config =require('./config');
const sqlite3 =require('sqlite3').verbose();

 

async function upgradeDB() {
    const db = new sqlite3.Database(config.dbName);
    var errors=0;
    var listOfPatch= [];

    for(var i=0; i< config.upgradeDB.length;i++) // Loop to create each table in the database
    {   let upgradeDB= config.upgradeDB[i] // For Each table, there are two fields table , sql
        
        console.log("Patch Name:" + upgradeDB[0].patch ) ;
        const patchStr = upgradeDB[0].patch
        let sqlStr="select * from relInfo where releaseDescr like '" + upgradeDB[0].patch +"'";
        rs = await getSqlData(db,sqlStr, [])
        rs.forEach(function(row) {
            console.log("SqlData", row.releaseDescr)    ;
        })  
        var result=rs.length;
         
        if (result<=0)
         {  let date = new Date().toISOString();
            
            let sqlRelInfo = `INSERT INTO relInfo (releaseDescr, releaseDate) VALUES ('${patchStr}', '${date}')`;
            console.log("Total Length" + upgradeDB.length);
            for(var j=1; j< upgradeDB.length;j++ )
            {   let tmpTableName=upgradeDB[j].table;
                
                let sqlArrys=upgradeDB[j].sql; //get each set of sqlStatements
                if( j==1)
                {
                    sqlArrys[0]=sqlRelInfo; //Special case for db upgrade patch insertion ID
                }
                for(var k=0; k < sqlArrys.length ; k++)
                {  
                    console.log("Each sql:" + sqlArrys[k]);
                    let tmpSqlStmt=sqlArrys[k];
                    try{
                    tmpRS = await  rundb(db,tmpSqlStmt);
                    if(tmpRS) console.log("\t" + tmpTableName + "-->" + tmpSqlStmt +" [executed successfully]");
                    }
                    catch(err){
                        console.log("\t" + tmpTableName + "-->" + tmpSqlStmt +" [executed Failed]");
                    }
                    
                }
                
            }
         }
         else
         {
            console.log("Skipped Patch :" + upgradeDB[0].patch  + "already exists");
         }



    }
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
    
      });
}
upgradeDB();
/*Async function implementation */

function opendb(dbName) {
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
function closedb(dbName) {
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
function rundb(dbName , query) {
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
function getSqlData(dbName,query, params) {
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
