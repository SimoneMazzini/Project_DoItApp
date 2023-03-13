/**
 * To generate a new doitApp/db/doit.db database file
 * @config conigurations are taken from config.js file
 * To create a new database , remove old database file manually and run
 *  cd doitApp
 *  npm run setup
 */
const config =require('./config');
const sqlite3 =require('sqlite3').verbose();

console.log("Creating database:" + config.dbName);
const db = new sqlite3.Database(config.dbName);
var completetionTableCount=0;
db.serialize(() =>{
    var errors=0;
    for(var i=0; i< config.tables.length;i++) // Loop to create each table in the database
    {   let tableDetails= config.tables[i] // For Each table, there are two fields table , sql
        let sqlStmt= tableDetails.sql; //Initialize Create table sql statement from config
        db.run(sqlStmt,(err)=>{
           if(err){
            console.log("\t" + tableDetails.table +" [Failed]");
            errors++;
           }
           else
           {
            console.log("\t" + tableDetails.table +" [Created]");
           }
        });
        
    }
    for(var j=0; j< config.defaultRows.length; j++)
    {   let tmpTableName=config.defaultRows[j].table;
        for(var k=0; k< config.defaultRows[j].sql.length ;k++)
        {  let tmpSqlStmt=config.defaultRows[j].sql[k];
            //console.log(tmpTableName + "-->" + tmpSqlStmt );
            db.run(tmpSqlStmt,(err)=>{
                if(err){
                 console.log("\t" + tmpTableName + "-->" + tmpSqlStmt +" [Failed]");
                 errors++;
                }
                else
                {
                 console.log("\t" + tmpTableName + "-->" + tmpSqlStmt +" [Row Added]");
                }
             });

        }

    }
    if(errors >0) //If any errors while creating tables
    {
        console.log("Database creation failed.");
    }
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Database closed sucessfuly.');
});