const express = require("express");
const router = express.Router();
const users = require("./users");
const dblib =require('../db/dblib');
const dbapi =require('../db/dbapi');

/* GET leaderboard page. */
router.get("/", (req, res, next) => {
  // res.render('leaderboard', { title: 'Leaderboard' });
  try {
    const userSessionID = req.headers.cookie.split("=")[1];
    console.log("Received sessionID: " + userSessionID);
    users.VerifyUserSession(userSessionID, leaderboardHandler);
  } catch {
    res.status(500).send();
    console.log("/dashboard: Internal Server Error");
  }
  async function leaderboardHandler(err, row) {
    console.log("leaderboard Callback called:");
    if (err) {
      //If any error while DB user verification
      console.error(err);
      console.log("/leaderboard : Bad user sessionID ");
      return res.status(401).send("Not  Bad user session");
    }
    //userID,isValid,timer,createdTime
    //Need to calculate on the fly or timertik will make dbIsValid=false
    //logout must remove sessionID from sessions table
     var userID = row.userID;
    var dbIsValid = row.isValid;
    var dbTimer = row.timer;
    var dbCreatedTime = row.createdTime;
    var data= await dbapi.getLeaderboardDeatils(userID);
    console.log(data);
    res.render("leaderboard", {
      title: "leaderboard",
      data: data,
    });
  }
});

module.exports = router;
