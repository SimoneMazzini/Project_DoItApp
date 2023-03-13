const express = require('express');
const router = express.Router();
const users =require('./users');
const uuid =require('uuid').v4;
const bcrypt =require('bcrypt');
const dblib =require('../db/dblib');
const dbapi =require('../db/dbapi');

const sessions ={};
/* GET logout. */
router.get('/', (req, res, next) => {
     
      try{
           const userSessionID = req.headers.cookie.split('=')[1];
           console.log("Received sessionID to logout: " +userSessionID);
           users.VerifyUserSession(userSessionID, logoutHandler);
          
      }catch{
        res.status(500).send();
        console.log("/dashboard: Internal Server Error");
  
      }
      async function logoutHandler(err,row)
      {
        console.log("Logout Callback called:"); 
        if (err  ) { //If any error while DB user verification while logout
              console.error(err);
              console.log("/logout : Bad user sessionID ");
              return res.status(401).send("logout with bad user session");
              
          }
          //userID,isValid,timer,createdTime 
          //Need to calculate on the fly or timertik will make dbIsValid=false
          //logout must remove sessionID from sessions table
          var userID=row.userID;
          var dbIsValid=row.isValid;
          var dbTimer =row.timer;
          var dbCreatedTime=row.createdTime;
          var dbCookies= row.cookies;
          console.log("DB cookies:" + dbCookies);
          
          var retStatus=await dbapi.sessionLogout(dbCookies); //retStatus =true of it is removed from db
          if(retStatus==true)
          {
            console.log("Logout sucessful userID:" + userID + " sessionID:" + dbCookies);
            return res.redirect('/login');
          }
          else
          {
            console.log("Logout failed userID:" + userID + " sessionID:" + dbCookies);
            return res.status(401).send("logout with bad user session");
          }
      } 
});
module.exports = router;