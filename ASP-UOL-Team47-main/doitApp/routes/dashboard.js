const express = require("express");
const router = express.Router();
const users = require("./users");
const config = require("../db/config");
const sqlite3 = require("sqlite3").verbose();
const dblib = require("../db/dblib");
const dbapi = require("../db/dbapi");

/* GET dashboard page. */
router.get("/", (req, res, next) => {
  //res.render('dashboard', { title: 'Dashboard' });
  try {
    const userSessionID = req.headers.cookie.split("=")[1];

    users.VerifyUserSession(userSessionID, dashboardHandler);
  } catch {
    res.status(500).send();
  }
  async function dashboardHandler(err, row) {
    if (err) {
      //If any error while DB user verification

      return res.status(401).send("Bad user session");
    }
    //userID,isValid,timer,createdTime
    //Need to calculate on the fly or timertik will make dbIsValid=false
    //logout must remove sessionID from sessions table
    var userID = row.userID;
    var dbIsValid = row.isValid;
    var dbTimer = row.timer;
    var dbCreatedTime = row.createdTime;
    var cookies = row.cookies;

    var rowData = await getModuleInfo(userID); //Example rowData content : { [moduleID: 30,    moduleCode: 'CM3070',    level: 'Level 6',    moduleShortCode: 'FP',    taskStatus: -1,    status: false,    percentageCompleted: 0 ],      }

    const groupData = await getLevelInfo(rowData); //Example of groupData Content: [ 'Level 4', 'Level 5', 'Level 6' ]
    var totalPercentage = await calculateTotalModulePercentage(rowData);
    totalPercentage = Math.ceil(totalPercentage);

    var totalPoints = await dbapi.getMaxPointDetails(userID);
    totalPoints = Math.ceil(totalPoints);
    var badgeDetails = await dbapi.getAllBadge(userID);

    var usrURL = req.protocol + "://" + req.get("host") + req.originalUrl;
    res.render("dashboard", {
      title: "Dashboard",
      coursedata: rowData,
      data: groupData,
      url: usrURL,
      totalPercentage: totalPercentage,
      totalPoints: totalPoints,
      badgeDetails: badgeDetails,
    });
  }
});

/**
 *
 * @param {*} dbRowData contains array of all module information if taskStatus >=0 or status=true then module percentageCompleted can be calculated for total
 *
 * [
 *     {
 *       moduleID: 1,
 *       moduleCode: 'CM1005',
 *       level: 'Level 4',
 *       moduleShortCode: 'ITP1',
 *       taskStatus: 0,
 *       status: true,
 *       percentageCompleted: 0
 *     },
 *     {
 *     }
 * ]
 */
async function calculateTotalModulePercentage(dbRowData) {
  var totalPercentage = 0;
  var totalPoint = 0;
  var totalModule = 0;

  for (var i = 0; i < dbRowData.length; i++) {
    let eachRow = dbRowData[i];
    if (eachRow.taskStatus >= 1) {
      //task.taskStatus field 0= just created 1= subtask or weeks has been created 2=all modules are 100% completed
      totalPoint = totalPoint + eachRow.percentageCompleted;
      totalModule++;
    }
  }
  if (totalModule > 0) {
    totalPercentage = totalPoint / totalModule;
  }

  return totalPercentage;
}
async function getLevelInfo() {
  let sqlStr = "select distinct(level)as lev  from module";
  const db = new sqlite3.Database(config.dbName);
  var retData = [];

  rs = await dblib.getSqlData(db, sqlStr, []);
  rs.forEach(function (row) {
    retData.push(row.lev);
  });

  db.close((err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "DB resource error:", status: true });
    }
  });
  return retData;
}

async function getModuleInfo(userId) {
  let sqlStr =
    "select moduleID,userID,moduleCode,level,moduleShortCode,taskStatus  from task t1, ( select moduleID as mid,moduleCode,level,moduleShortCode from module ) t2  where  userID=" +
    userId +
    " and t1.moduleID=t2.mid";
  let sqlStr2 = "select moduleID,moduleCode,level,moduleShortCode from module";
  let sqlStrPercentage =
    "SELECT  moduleID,  100 * SUM(CASE WHEN status = 100 THEN 1 ELSE 0 END) / COUNT(*) AS percentage_completed FROM (select TID,moduleID,status  from taskDetails A, (select t1.taskID as TID,moduleID,subTaskID from task t1,subtask t2 where t1.taskID=t2.taskID and userID=" +
    userId +
    " ) B Where A.subTaskID=B.subTaskID) C group by c.moduleID";
  const db = new sqlite3.Database(config.dbName);

  /**
   * GET STATUS OF CURRENTLY ASSIGNED MODULE NAME AND CODE
   */
  //Get percentage of each module

  var percentageDataEachModule = [];
  rs3 = await dblib.getSqlData(db, sqlStrPercentage, []);
  rs3.forEach(function (row) {
    percentageDataEachModule.push({
      moduleID: row.moduleID,
      modulePercentage: row.percentage_completed,
    });
  });
  //End of percentage of each module

  var retData = [];
  var doNotIncludeTaskStr = "0";
  rs = await dblib.getSqlData(db, sqlStr, []);
  rs.forEach(function (row) {
    doNotIncludeTaskStr = doNotIncludeTaskStr + "," + row.moduleID;
    var modCode = row.moduleCode;
    var modCodeID = row.moduleID;
    var percentage = 0;
    for (var t = 0; t < percentageDataEachModule.length; t++) {
      if (modCodeID == percentageDataEachModule[t].moduleID) {
        percentage = percentageDataEachModule[t].modulePercentage;
        break;
      }
    }
    retData.push({
      moduleID: row.moduleID,
      moduleCode: row.moduleCode,
      level: row.level,
      moduleShortCode: row.moduleShortCode,
      taskStatus: row.taskStatus,
      status: true,
      percentageCompleted: percentage,
    });
  });
  var result = rs.length;
  sqlStr2 = sqlStr2 + " where moduleID not in (" + doNotIncludeTaskStr + ")";
  rs1 = await dblib.getSqlData(db, sqlStr2, []);
  rs1.forEach(function (row) {
    doNotIncludeTaskStr = doNotIncludeTaskStr + "," + row.moduleID;
    var moduleID = row.moduleID;
    var moduleCode = row.moduleCode;
    var level = row.level;

    retData.push({
      moduleID: moduleID,
      moduleCode: moduleCode,
      level: level,
      moduleShortCode: row.moduleShortCode,
      taskStatus: -1,
      status: false,
      percentageCompleted: 0,
    });
  });
  db.close((err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "DB resource error:", status: true });
    }
  });
  retData.sort(function (a, b) {
    return a.moduleID - b.moduleID;
  });
  return retData;
}
/**
 * addmodule RESTAPI handler
 * req: J
 * res:
 */
router.post("/addmodule", async (req, res) => {
  try {
    const userSessionID = req.headers.cookie.split("=")[1];

    users.VerifyUserSession(userSessionID, dashboardHandler);
  } catch {
    return res.status(500).json({ error: "Internal error:", status: true });
  }
  /**
   * Function is a call back function if user session key has been  verified then callback to this function
   * for insertion of post data
   * @param {*} err
   * @param {*} row
   * @returns
   */
  async function dashboardHandler(err, row) {
    const db = new sqlite3.Database(config.dbName);
    try {
      var userID = row.userID;
      var dbIsValid = row.isValid;
      var dbTimer = row.timer;
      var dbCreatedTime = row.createdTime;
      var tmpArr = req.body;
      var sqlParamStr = "'invalid'";
      var returnStr = [];
      for (var j = 0; j < tmpArr.length; j++) {
        sqlParamStr = sqlParamStr + ",'" + tmpArr[j].moduleName + "'";
      }

      if (err) {
        //If any error while DB user verification
        return res.status(401).send("Not  Bad user session");
      }
      //userID,isValid,timer,createdTime
      //Need to calculate on the fly or timertik will make dbIsValid=false
      //logout must remove sessionID from sessions table
      /**
       * task.taskStatus=0 CREATED
       *                 1 IN-PROGRESS
       *                 2 COMPLETED
       */
      /*###############################################
            FIND IF MODULE IS ALREADY ASSIGNED TO STUDENT
            ###############################################*/
      //let sqlStr="select * from task  where moduleID in  (select moduleID from module where moduleCode in ("+sqlParamStr +")) and userID=" + userID;

      let sqlStr =
        "select * from task t1, ( select moduleID as mid,moduleCode from module where moduleCode in (" +
        sqlParamStr +
        ")) t2  where  userID=" +
        userID +
        " and t1.moduleID=t2.mid";

      let doNotIncludeTaskStr = "0";

      rs = await dblib.getSqlData(db, sqlStr, []);
      rs.forEach(function (row) {
        doNotIncludeTaskStr = doNotIncludeTaskStr + "," + row.moduleID;
        var modCode = row.moduleCode;
        returnStr.push({ moduleName: modCode, status: false });
      });
      var result = rs.length;

      /*###############################################################################
            FIND  MODULEID FROM DB module table, Module Code by student from add module GUI
            ###############################################################################*/
      sqlStr =
        "select moduleID,moduleCode from module where moduleCode in (" +
        sqlParamStr +
        ") and moduleId not in (" +
        doNotIncludeTaskStr +
        ")";

      let doIncludeTaskStr = "";

      var moduleid = [];
      var moduleCode = [];
      rs1 = await dblib.getSqlData(db, sqlStr, []);
      rs1.forEach(function (row) {
        moduleid.push(row.moduleID);
        moduleCode.push(row.moduleCode);
      });
      var resultUserModGiven = rs1.length;

      let date = new Date().toISOString();

      for (var t = 0; t < moduleid.length; t++) {
        //taskStatus=0 created and there is no subtask now
        let insertSqlStr = `INSERT INTO task(moduleID,userID,taskStatus,createDate) VALUES ('${moduleid[t]}' , '${userID}' ,0,  '${date}' )`;

        rs2 = await dblib.rundb(db, insertSqlStr);
        if (rs2) {
          returnStr.push({ moduleName: moduleCode[t], status: true });
        } else {
          returnStr.push({ moduleName: moduleCode[t], status: false });
        }
      }
      db.close((err) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "DB resource error:", status: true });
        }
      });
      return res.status(201).json(returnStr);
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Exception while inserting:", status: true });
    }
  }
});
module.exports = router;
