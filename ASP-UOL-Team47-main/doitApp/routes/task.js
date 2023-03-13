const express = require("express");
const router = express.Router();
const users = require("./users");
const url = require("url");
const config = require("../db/config");
const sqlite3 = require("sqlite3").verbose();
const dblib = require("../db/dblib");
const dbapi = require("../db/dbapi");
const uuid = require("uuid").v4;

/* GET task page. */
router.get("/", (req, res, next) => {
  //res.render('task', { title: 'Dashboard' });
  try {
    const userSessionID = req.headers.cookie.split("=")[1];
    console.log("Received sessionID: " + userSessionID);
    users.VerifyUserSession(userSessionID, getTaskHandler);
  } catch {
    res.status(500).send();
    console.log("/task: Internal Server Error");
  }
  async function getTaskHandler(err, row) {
    console.log("Task Callback called:");
    try {
      const db = new sqlite3.Database(config.dbName);
      if (err) {
        //If any error while DB user verification
        console.error(err);
        console.log("/task : Bad user sessionID ");
        return res.status(401).send("Not a valid user session");
      }
      //userID,isValid,timer,createdTime
      //Need to calculate on the fly or timertik will make dbIsValid=false
      //logout must remove sessionID from sessions table
      var userID = row.userID;
      var dbIsValid = row.isValid;
      var dbTimer = row.timer;
      var dbCreatedTime = row.createdTime;
      var returnStr = [];
      var weeks = [];
      var modulePercentage = [];
      var moduleShortCode = "NONE";
      var moduleIDTmp = 0;
      console.log("Incomming URL: " + req.url.indexOf("/"));
      if (req.method === "GET" && req.url.indexOf("/") === 0) {
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query;

        // Access query parameters using their keys, e.g. query.id, query.name, etc.
        moduleShortCode = query.moduleShortCode;
        console.log("Requested for module:" + moduleShortCode);
        //Sql to get taskDetails, module details information
        var sqlStr =
          "select taskID, a1.subTaskID as subTask_SubTaskID,taskName,taskDesc,subTaskDueDate,priorityID,a1.status as taskDetails_Status,subTaskCompletionDate,taskTaskID as task_taskID,description,subTaskStatus as subTask_Status,moduleID,moduleShortCode,taskTaskStatus as task_status,userID,taskDetailID from taskDetails a1, (select taskTaskID,subTaskID,description,status as subTaskStatus,moduleID,moduleShortCode,taskTaskStatus,userID from subTask s1, (select t1.taskID as taskTaskID,t1.moduleID as moduleID,moduleShortCode,taskStatus as taskTaskStatus,userID from task t1,module m1 where userID=" +
          userID +
          " and m1.moduleID=t1.moduleID) s2 where s1.taskID=s2.taskTaskID) b1 where a1.subTaskID=b1.subTaskID and moduleShortCode like '" +
          moduleShortCode +
          "'";
        rs = await dblib.getSqlData(db, sqlStr, []);
        rs.forEach(function (row) {
          moduleIDTmp = row.moduleID;
          let priorityFlag = row.priorityID;
          var flagName = "white.png";
          if (priorityFlag == 1) {
            flagName = "red.png";
          }
          if (priorityFlag == 2) {
            flagName = "blue.png";
          }
          returnStr.push({
            taskID: row.taskID,
            subTask_SubTaskID: row.subTask_SubTaskID,
            taskName: row.taskName,
            taskDesc: row.taskDesc,
            subTaskDueDate: row.subTaskDueDate,
            priorityID: row.priorityID,
            taskDetails_Status: row.taskDetails_Status,
            subTaskCompletionDate: row.subTaskCompletionDate,
            task_taskID: row.task_taskID,
            description: row.description,
            subTask_Status: row.subTask_Status,
            moduleID: row.moduleID,
            moduleShortCode: row.moduleShortCode,
            task_status: row.task_status,
            userID: row.userID,
            taskDetailID: row.taskDetailID,
            priorityFlag: flagName,
          });
        });

        var sqlStrListOfWeek =
          "select DISTINCT(description) as weeks FROM (select taskTaskID,subTaskID,description,status as subTaskStatus,moduleID,moduleShortCode,taskTaskStatus,userID from subTask s1, (select t1.taskID as taskTaskID,t1.moduleID as moduleID,moduleShortCode,taskStatus as taskTaskStatus,userID from task t1,module m1 where userID=" +
          userID +
          " and m1.moduleID=t1.moduleID) s2 where s1.taskID=s2.taskTaskID) A where A.moduleShortCode like '" +
          moduleShortCode +
          "'";
        rs1 = await dblib.getSqlData(db, sqlStrListOfWeek, []);
        rs1.forEach(function (row) {
          var weekStr = row.weeks;
          var found = false;
          for (var p = 0; p < returnStr.length; p++) {
            if (
              weekStr == returnStr[p].description &&
              returnStr[p].taskDetails_Status < 100
            ) {
              found = true;
              break;
            }
          }
          if (found == true) {
            weeks.push({ week: row.weeks });
          }
        });
        /*##################################################################################
         *   Calculate Module Percentage based on attempated and even not created any sub task
         *#################################################################################*/
        var countPerCent = 0;
        var sqlStrModulePercentage =
          "select B.moduleID as moduleID,moduleShortCode,percentage_completed from (SELECT  moduleID,  100 * SUM(CASE WHEN status = 100 THEN 1 ELSE 0 END) / COUNT(*) AS percentage_completed FROM (select TID,moduleID,status  from taskDetails A, (select t1.taskID as TID,moduleID,subTaskID from task t1,subtask t2 where t1.taskID=t2.taskID and userID=" +
          userID +
          ") B Where A.subTaskID=B.subTaskID) C group by c.moduleID) A, Module B where B.moduleID=A.moduleID and moduleShortCode like '" +
          moduleShortCode +
          "'";
        rs2 = await dblib.getSqlData(db, sqlStrModulePercentage, []);
        rs2.forEach(function (row) {
          countPerCent++;
          modulePercentage.push({
            moduleID: row.moduleID,
            moduleShortCode: row.moduleShortCode,
            percentage: row.percentage_completed,
          });
        });
        if (countPerCent == 0) {
          //User has not created any subtask , percent should be zero
          modulePercentage.push({
            moduleID: moduleIDTmp,
            moduleShortCode: moduleShortCode,
            percentage: 0,
          });
        }

        // ... Use the query parameters to retrieve data, send the response, etc.
      } else {
        console.error(err.message);
        return res.status(404).json({ error: "Page not found", status: true });
      }

      var usrURL = req.protocol + "://" + req.get("host") + req.originalUrl;
      //res.render('dashboard', { title: 'Dashboard',coursedata: rowData, data: groupData,url:usrURL,totalPercentage:totalPercentage,totalPoints:totalPoints});

      db.close((err) => {
        if (err) {
          console.error(err.message);
          return res
            .status(400)
            .json({ error: "DB resource error:", status: true });
        }
      });
      console.log(returnStr);
      console.log(modulePercentage);
      res.render("task", {
        title: "Dashboard",
        data: returnStr,
        weeks: weeks,
        moduleShortCode: moduleShortCode,
        modulePercentage: modulePercentage,
      });
    } catch (err) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(400)
        .json({ error: "Exception while accessing the data:", status: true });
    }
  }
});

/**
 * Add Task RESTAPI handler
 * req: J
 * res:
 */
router.post("/addtask", async (req, res) => {
  try {
    const userSessionID = req.headers.cookie.split("=")[1];
    console.log("Received sessionID: " + userSessionID);
    users.VerifyUserSession(userSessionID, addTaskHandler);
  } catch {
    return res.status(500).json({ error: "Internal error:", status: true });
  }

  /**
   * Function is a call back function if user session key has been  verified then callback to this function
   * for insertion of post data
   * Form input must be: as follows:
   *   {
   *     week: 'Week 1',
   *     taskName: 'hgjg',
   *     description: 'hgjhg',
   *     dueDate: '2023-02-19T04:59:59.000Z',
   *     priority: 'high'
   *   }
   * @param {*} err
   * @param {*} row
   * @returns
   */
  async function addTaskHandler(err, row) {
    const db = new sqlite3.Database(config.dbName);
    try {
      console.log("Test");
      console.log(req.body);
      var userID = row.userID;
      var dbIsValid = row.isValid;
      var dbTimer = row.timer;
      var dbCreatedTime = row.createdTime;
      var argsArr = req.body;
      var sqlParamStr = "'invalid'";
      var returnStr = [];
      var outputTaskDetailsData = [];
      var errorCount = 0;
      var errorStr = "Error:";
      var moduleID = 0;

      var weekInfo = argsArr.week;
      var IsNewWeek = false;
      var IsAlreadyWeekIncomplete = false;
      var taskDescription = argsArr.description;
      var taskNameInfo = argsArr.taskName;
      var taskDueDateInfo = argsArr.dueDate;
      var moduleShortCode = argsArr.moduleShortCode;
      let createDate = new Date().toISOString();

      if (taskDescription.length <= 0) {
        //No task description has given
        taskDescription = "Not provided by user";
      }
      var priorityList = await dbapi.getPriority(argsArr.priority);
      if (priorityList.length <= 0) {
        errorCount++;
        errorStr = errorStr + " (Invalid Priority Input by User) ";
      }

      var moduleIDList = await dbapi.getModuleID(argsArr.moduleShortCode);
      if (moduleIDList.length <= 0) {
        errorCount++;
        errorStr = errorStr + " (Invalid module code given by User) ";
      } else moduleID = moduleIDList[0].moduleID;
      if (moduleID > 0) {
        var assignedTaskList = await dbapi.getTask(moduleID, userID);
        console.log(assignedTaskList);
        if (assignedTaskList.length <= 0) {
          //No task has been assigned yet, generate the task->taskID and associate with moduleID
          var inputTaskData = [];
          inputTaskData.push({
            taskID: 0,
            moduleID: moduleID,
            userID: userID,
            taskDescription: taskDescription,
            taskStatus: 1,
            createDate: createDate,
          });
          assignedTaskList = await dbapi.createModuleTask(inputTaskData);
          console.log(assignedTaskList);
        }
        if (assignedTaskList.length > 0) {
          //Task given by user needs to be insert in DB
          var inputTaskData = [];
          inputTaskData.push({
            taskID: 0,
            moduleID: moduleID,
            userID: userID,
            taskDescription: taskDescription,
            taskStatus: 1,
            createDate: createDate,
          });
          var updateTaskStatus = await dbapi.updateModuleTask(inputTaskData);
          console.log("Task->taskStatus Has been update:");
          console.log(updateTaskStatus);
          var outputSubTaskData = [];
          //VERIFY IF WEEK EXISTS BUT ANY MODULE NOT COMPLETED 100%
          var weekInfoListNotCompletedModule =
            await dbapi.getWEEKINFONotCompletedModule(
              assignedTaskList[0].taskID,
              weekInfo
            );
          if (weekInfoListNotCompletedModule.length > 0) {
            IsAlreadyWeekIncomplete = true;
          }

          //VERIFY IF WEEK EXISTS OF USER MODULE
          var weekInfoList = await dbapi.getWEEKINFO(
            assignedTaskList[0].taskID,
            weekInfo
          );
          if (weekInfoList.length > 0) {
            //WEEK EXISTS
            console.log(
              "Week info already exists, skiping entries for module week."
            );
            outputSubTaskData = weekInfoList;
          } //IF WEEK INFO INSERTION REQUIRED
          else {
            console.log(
              "Week info insert required, first time assigned the week#no"
            );
            var inputSubTaskData = [];
            const taskUUID = uuid();
            console.log(
              "Before sending data" + assignedTaskList[0].taskDescription
            );
            inputSubTaskData.push({
              taskID: assignedTaskList[0].taskID,
              description: weekInfo,
              subTaskCreateDate: assignedTaskList[0].createDate,
              status: 1,
              UUID: taskUUID,
            });
            console.log(inputSubTaskData);
            outputSubTaskData = await dbapi.createSubTask(inputSubTaskData); //CREATE SUBTASK row in subtask table WEEK INFO INSERTION
            IsNewWeek = true;
          }
          if (outputSubTaskData.length > 0 && errorCount == 0) {
            //QUALIFIED TO INSERT TASK DETAILS
            console.log("Subtask Identified");
            console.log(outputSubTaskData);
            var inputTaskDetails = [];

            const taskDetailUUID = uuid();
            inputTaskDetails.push({
              taskID: outputSubTaskData[0].taskID,
              subTaskID: outputSubTaskData[0].subTaskID,
              taskName: taskNameInfo,
              taskDesc: taskDescription,
              subTaskAssignDate: createDate,
              subTaskDueDate: taskDueDateInfo,
              priorityID: priorityList[0].priorityID,
              status: 0,
              taskDetailUUID: taskDetailUUID,
            });
            console.log("TaskDetails info need to be enter:");
            console.log(inputTaskDetails);
            outputTaskDetailsData = await dbapi.insertTaskDetails(
              inputTaskDetails
            ); //CREATE subTask->taskDetails row  based on subTaskID
            console.log("After Insertion in task Details table:");
            console.log(outputTaskDetailsData);
          }
        }
      } else {
        errorCount++;
        errorStr = errorStr + " (Invalid module code given by User) ";
      }

      var modulePercentage = await dbapi.getModulePercentage(
        userID,
        moduleShortCode
      );
      var percentage = 0;
      if (modulePercentage.length > 0) {
        percentage = modulePercentage[0].percentage;
      }
      if (errorCount > 0) {
        //INSERTION FAILED DUE TO USER INPUT OR INCONSISTNET DATA
        returnStr.push({
          error: errorStr,
          status: false,
          IsNewWeek: false,
          IsAlreadyWeekIncomplete: false,
          percentage: percentage,
        });
        return res.status(400).json(returnStr);
      } //SUCESSFUL TASK INSERTION
      else {
        returnStr.push({
          data: outputTaskDetailsData,
          week: weekInfo,
          status: true,
          IsNewWeek: IsNewWeek,
          IsAlreadyWeekIncomplete: IsAlreadyWeekIncomplete,
          percentage: percentage,
        });
        return res.status(201).json(returnStr);
      }
    } catch (
      err //FAILURE OF TASK INSERTION DUE TO EXCEPTION
    ) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(400)
        .json({
          error: "Exception while inserting:",
          status: false,
          IsNewWeek: false,
          IsAlreadyWeekIncomplete: false,
          percentage: 0,
        });
    }
  }
});

/**
 * #######################################################################
 *PUT task page. completion of task
 *Request data must be with following format
 *{
 *  taskDetailID: '38',
 *  subTaskCompletionDate: '2023-02-15T19:04:04.868Z',
 *  status: 100
 *}
 *#########################################################################
 */

router.put("/complete", (req, res, next) => {
  //res.render('task', { title: 'Dashboard' });
  try {
    const userSessionID = req.headers.cookie.split("=")[1];
    console.log("Received sessionID: " + userSessionID);
    users.VerifyUserSession(userSessionID, taskCompleteHandler);
  } catch {
    console.error(err.message);
    console.error(err.stack);
    return res
      .status(500)
      .json({
        error: "/task/complete: Internal Server Error",
        status: true,
        IsNewWeek: false,
      });
  }
  async function taskCompleteHandler(err, row) {
    const db = new sqlite3.Database(config.dbName);
    try {
      console.log("Received completion request with Following arguments:");
      console.log(req.body);
      var userID = row.userID;
      var argsArr = req.body;
      var taskDetailID = argsArr.taskDetailID;
      var subTaskCompletionDate = argsArr.subTaskCompletionDate;
      var status = argsArr.status;
      var moduleShortCode = argsArr.moduleShortCode;
      //var outputTaskDetailsData=await dbapi.updateCompletionTaskDetails({taskDetailID:taskDetailID,status:status,subTaskCompletionDate:subTaskCompletionDate,userID:userID,moduleShortCode:moduleShortCode});
      var outputTaskDetailsData =
        await dbapi.updateCompletionTaskDetailsApplyPoints({
          taskDetailID: taskDetailID,
          status: status,
          subTaskCompletionDate: subTaskCompletionDate,
          userID: userID,
          moduleShortCode: moduleShortCode,
        });

      var returnStr = [];

      console.log("moduleShortCode:" + moduleShortCode);
      var modulePercentage = await dbapi.getModulePercentage(
        userID,
        moduleShortCode
      );

      var percentage = 0;
      if (modulePercentage.length > 0) {
        percentage = modulePercentage[0].percentage;
      }
      returnStr.push({
        data: outputTaskDetailsData,
        status: true,
        percentage: percentage,
      });
      return res.status(200).json(returnStr);
    } catch (
      err //FAILURE OF TASK UPDATE DUE TO EXCEPTION
    ) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(400)
        .json({
          error: "Exception while updating:",
          status: false,
          percentage: 0,
        });
    }
  }
});

/**
 * put taskdetails
 */

router.put("/taskdetails", (req, res, next) => {
  //res.render('task', { title: 'Dashboard' });
  try {
    const userSessionID = req.headers.cookie.split("=")[1];
    console.log("Received sessionID: " + userSessionID);
    users.VerifyUserSession(userSessionID, taskUpdateTaskDetailsHandler);
  } catch {
    console.error(err.message);
    console.error(err.stack);
    return res
      .status(500)
      .json({
        error: "/task/taskdetails: Internal Server Error",
        status: true,
        IsNewWeek: false,
      });
  }
  async function taskUpdateTaskDetailsHandler(err, row) {
    const db = new sqlite3.Database(config.dbName);
    try {
      console.log(
        "Received get request for taskDetails with Following arguments:"
      );
      console.log(req.body);
      var userID = row.userID;
      var argsArr = req.body;
      var taskDetailID = argsArr.taskDetailID;
      var outputTaskDetailsData = await dbapi.getTaskDetails({
        taskDetailID: taskDetailID,
      });
      var returnStr = [];

      returnStr.push({ data: outputTaskDetailsData, status: true });
      return res.status(200).json(returnStr);
    } catch (
      err //FAILURE OF TASK UPDATE GET  REQUEST DUE TO EXCEPTION
    ) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(400)
        .json({ error: "Exception while updating:", status: false });
    }
  }
});

/**
 *
 * Following example input arguments includes in post JSON object
 * {
 *  week: 'Week-1',
 *  editTaskName: 'Another Test',
 *  description: 'yuiy',
 *  dueDate: '2023-02-14T04:59:59.000Z',
 *  priority: 'High',
 *  taskDetailID: '75'
 *  subTaskID: '1'
 *  taskID: '56',
 *  moduleID: '2'
 * }
 */
router.post("/edittask", async (req, res) => {
  try {
    const userSessionID = req.headers.cookie.split("=")[1];
    console.log("Received sessionID: " + userSessionID);
    users.VerifyUserSession(userSessionID, editTaskHandler);
  } catch {
    console.error(err.message);
    console.error(err.stack);
    return res
      .status(500)
      .json({
        error: "/task/edittask: Internal Server Error",
        status: true,
        IsNewWeek: false,
      });
  }
  async function editTaskHandler(err, row) {
    try {
      console.log(
        "Received get request for taskDetails with Following arguments:"
      );
      console.log(req.body);
      var userID = row.userID;
      var argsArr = req.body;
      var taskDetailID = argsArr.taskDetailID;
      var weekInfo = argsArr.week;
      var taskName = argsArr.editTaskName;
      var taskDesc = argsArr.description;
      var subTaskDueDate = argsArr.dueDate;
      var priorityStr = argsArr.priority;
      var priorityID = 1;
      var subTaskID = argsArr.subTaskID;
      var taskID = argsArr.taskID;
      var moduleID = argsArr.moduleID;
      if (priorityStr === "Medium") priorityID = 2;
      if (priorityStr === "Low") priorityID = 3;
      var inputSubTaskData = [];
      const taskUUID = uuid();
      inputSubTaskData.push({
        taskDetailID: taskDetailID,
        week: weekInfo,
        taskName: taskName,
        taskDesc: taskDesc,
        subTaskDueDate: subTaskDueDate,
        priorityID: priorityID,
        subTaskID: subTaskID,
        taskID: taskID,
        moduleID: moduleID,
        userID: userID,
        UUID: taskUUID,
      });
      var outputTaskDetailsData = await dbapi.updateTaskDetails(
        inputSubTaskData
      );

      var returnStr = [];

      returnStr.push({ data: outputTaskDetailsData, status: true });
      return res.status(200).json(returnStr);
    } catch (
      err //FAILURE OF TASK UPDATE GET  REQUEST DUE TO EXCEPTION
    ) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(400)
        .json({
          error: "/task/edittask Exception while updating:",
          status: false,
        });
    }
  }
});

/**
 * DELETE RESTAPI call to delete a TaskID
 */

router.delete("/delete", async (req, res) => {
  try {
    const userSessionID = req.headers.cookie.split("=")[1];
    console.log("Received sessionID: " + userSessionID);
    users.VerifyUserSession(userSessionID, editDeleteHandler);
  } catch {
    console.error(err.message);
    console.error(err.stack);
    return res
      .status(500)
      .json({ error: "/task/delete: Internal Server Error", status: false });
  }
  async function editDeleteHandler(err, row) {
    try {
      console.log("Received delete request for Following arguments:");
      console.log(req.body);
      var argsArr = req.body;
      var taskDetailID = argsArr.taskdetailID;

      var outputTaskDetailsData = await dbapi.deleteTaskDetails(taskDetailID);
      var returnStr = [];
      if (outputTaskDetailsData.length > 0) {
        // Delete unsuccessful
        returnStr.push({ taskDetailID: taskDetailID, status: false });
      } //Delete successful
      else {
        returnStr.push({ taskDetailID: taskDetailID, status: false });
      }

      return res.status(200).json(returnStr);
    } catch (
      err //FAILURE OF TASK UPDATE GET  REQUEST DUE TO EXCEPTION
    ) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(400)
        .json({
          error: "/task/delete Exception while updating:",
          status: false,
        });
    }
  }
});

router.delete("/deletemodule", async (req, res) => {
  try {
    const userSessionID = req.headers.cookie.split("=")[1];
    console.log("Received sessionID: " + userSessionID);
    users.VerifyUserSession(userSessionID, moduleDeleteHandler);
  } catch {
    console.error(err.message);
    console.error(err.stack);
    return res
      .status(500)
      .json({ error: "/task/delete: Internal Server Error", status: false });
  }
  async function moduleDeleteHandler(err, row) {
    try {
      console.log("Received delete request for Following arguments:");
      console.log(req.body);
      var argsArr = req.body;
      var userID = row.userID;
      var moduleShortCodeID = argsArr.moduleShortCodeID;

      var outputTaskDetailsData = await dbapi.deleteModule(
        moduleShortCodeID,
        userID
      );
      var returnStr = [];
      if (outputTaskDetailsData.length > 0) {
        // Delete unsuccessful
        returnStr.push({ moduleShortCodeID: moduleShortCodeID, status: false });
      } //Delete successful
      else {
        returnStr.push({ moduleShortCodeID: moduleShortCodeID, status: false });
      }

      return res.status(200).json(returnStr);
    } catch (
      err //FAILURE OF TASK UPDATE GET  REQUEST DUE TO EXCEPTION
    ) {
      console.error(err.message);
      console.error(err.stack);
      return res
        .status(400)
        .json({
          error: "/task/deletemodule Exception while updating:",
          status: false,
        });
    }
  }
});

module.exports = router;
