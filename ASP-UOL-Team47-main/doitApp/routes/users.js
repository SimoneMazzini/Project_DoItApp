const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const config =require('../db/config');




/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

const AddUser = (email,userName,password) =>{
  const db = new sqlite3.Database(config.dbName);
  db.serialize(() => {
        db.run(`INSERT INTO users(userName,email,password) 
                  VALUES ('${userName}','${email}', '${password}')`, (err) =>{
                    if (err) {
                      console.log(err);
                      throw err;
                  }
        });
  });
  db.close((err) => {
    if (err) {
        console.error(err.message);
    }

  });
}
// first row read

const VerifyUser = (userName) =>{
    return new Promise((resolve, reject) => {
      console.log("TEST1");
      let db = new sqlite3.Database(config.dbName, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          return reject(err);
        }
        db.get(`SELECT COUNT(*) as count FROM users WHERE username = ?`, [userName], (err, row) => {
          if (err) {
            return reject(err);
          }
          console.log("Found:" + row.count );
          resolve(row.count);
          db.close();
        });
      });
    });
}
const VerifyPassword =(username, callback) => {  
    let db = new sqlite3.Database(config.dbName, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(err.message);
        return callback(err); //If any connection error
      }
    });

    let sql = `SELECT username, password,userID FROM users WHERE username = ?`;

    db.get(sql, [username], (err, row) => {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      if (!row) {
        let error = new Error(`User with username '${username}' not found.`);
        return callback(error);
      }
      callback(null, row);
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      
    });
}


const addUserSession = (userId,sessionId, isValid,timer,createdTime, callback) => {
    let db = new sqlite3.Database(config.dbName, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
    });

    //let sql = `UPDATE sessions SET userId= ? , cookies = ? , isValid = ? , timer = ? , createdTime = ? WHERE userId = ?`;
    let sql = `INSERT INTO sessions (userID,cookies,isValid,timer, createdTime) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [userId, sessionId,isValid,timer,createdTime], (err) => {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`UserID: ${userId} and Session  ID ${sessionId} was updated successfully.`);
      callback(null);
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
    });
}

const VerifyUserSession =(sessionID, callback) => {  
    let db = new sqlite3.Database(config.dbName, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(err.message);
        return callback(err); //If any connection error
      }
    });

    let sql = `SELECT userID,isValid,timer,createdTime,cookies FROM sessions WHERE cookies = ?`;

    db.get(sql, [sessionID], (err, row) => {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      if (!row) {
        let error = new Error(`User session '${sessionID}' not found.`);
        return callback(error);
      }
      callback(null, row);
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      
    });
}



//module.exports = router;
module.exports = {
  VerifyUser,
  VerifyPassword,
  AddUser,
  addUserSession,
  VerifyUserSession,

   
};