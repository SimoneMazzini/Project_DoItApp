/**
 * helper functions to get user, task related  data
 */
const config =require('./config');
const uuid =require('uuid').v4;
const dblib =require('./dblib');
const sqlite3 =require('sqlite3').verbose();

/**
 * Function: getPriority
 * @returns retrun taskPriority information from taskPriority table
 * 
 */
async function getPriority(priorityName)
{
  
  try{      const db = new sqlite3.Database(config.dbName); 
            var retData=[];
            var countPerCent=0;
            var sqlStr="select * from taskPriority where priorityName like '" +priorityName +"'";
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ priorityID:row.priorityID,priorityName:row.priorityName,flagImage:row.flagImage,priorityColor:row.priorityColor});
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getPriority(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            return retData;
    }catch(error)
    {
          // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getPriority(): Error occured');
            } else {
                throw error;
            }

    }
    
}

/**
 * Function getModuleID
 * @param {*} moduleShortCode  Input as module code from module table
 * @returns  Will return array , atleast one element with moduleID:<moduleID>
 */
async function getModuleID(moduleShortCode)
{
  
  try{      const db = new sqlite3.Database(config.dbName); 
            var retData=[];
            var countPerCent=0;
            var sqlStr="select * from module where moduleShortCode like '" +moduleShortCode +"'";
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ moduleID:row.moduleID,moduleShortCode:row.moduleShortCode});
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getModuleID(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            return retData;
    }catch(error)
    {
          // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getModuleID(): Error occured');
            } else {
                throw error;
            }

    }
    
}
/**
 * Function: getTask
 * @param {*} moduleID  input as task table module id
 * @param {*} userID  input as userID has assigned to moduleID
 * @returns 
 */

async function getTask(moduleID,userID)
{
  try{      const db = new sqlite3.Database(config.dbName); 
            var retData=[];
            var countPerCent=0;
            var sqlStr="select * from task where moduleID  =" +moduleID +" and userID=" + userID;
            console.log("getTask:" + sqlStr);
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ taskID:row.taskID,moduleID:row.moduleID,userID:row.userID,taskDescription:row.taskDescription,taskStatus:row.taskStatus,createDate:row.createDate,completionDate:row.completionDate});
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getTask(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            
            return retData;
    }catch(error)
    {
          // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getTask(): Error occured');
            } else {
                throw error;
            }

    }
    
}
/**
 * 
 * @param {*} inputTaskData Input having following filed: { taskID:0,moduleID:moduleID,userID:userID,taskDescription:taskDescription,taskStatus:0,createDate:createDate}
 */
async function createModuleTask(inputTaskData)
{
    try{      
            const db = new sqlite3.Database(config.dbName); 
            var retData=[];
       
            var countPerCent=0;
        // "INSERT INTO module(moduleName,moduleCode,level,courseID) VALUES ('Introduction to programming I' , 'CM1005','Level 4', (select courseId from course where courseName like 'BSc bsc computer science'))",
            //
            var sqlStr="INSERT INTO TASK (moduleID,userID,taskDescription,taskStatus,createDate) VALUES ( " +
                                        inputTaskData.moduleID  +", " +
                                        inputTaskData.userID  +", '" +
                                        inputTaskData.taskDescription  +"', " +
                                        inputTaskData.taskStatus  +", '" +
                                        inputTaskData.createDate  +"' )";

            console.log(sqlStr);
            rs = await dblib.rundb(db,sqlStr);
            if(rs) 
            { 
                console.log("Inserted [success]:" + sqlStr);
            
            }
            else
            {  
              console.log("Inserted [Failed]:" + sqlStr);
            }
            var retData=await getTask(inputTaskData.moduleID, inputTaskData.userID);
                       
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getTask(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
            });
            return retData;
    }catch(error)
    {
        // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getTask(): Error occured');
            } else {
                throw error;
            }

    }

}



/**
 * 
 * @param {*} updateModuleTask Input having following filed: { taskID:0,moduleID:moduleID,userID:userID,taskDescription:taskDescription,taskStatus:0,createDate:createDate}
 */
async function updateModuleTask(inputTaskData)
{
    try{      
            const db = new sqlite3.Database(config.dbName); 
            var retData=[];
 
            var sqlStr="UPDATE TASK SET taskStatus=1 where moduleID=" + inputTaskData[0].moduleID + " and userID=" +inputTaskData[0].userID;

            console.log(sqlStr);
            rs = await dblib.rundb(db,sqlStr);
            if(rs) 
            { 
                console.log("Update [success]:" + sqlStr);
            
            }
            else
            {  
              console.log("Update [Failed]:" + sqlStr);
            }
            console.log("Check Update Status:")
            var retData=await getTask(inputTaskData[0].moduleID, inputTaskData[0].userID);
            console.log("After Update Status:")           
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, updateModuleTask(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
            });
            return retData;
    }catch(error)
    {
        // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, updateModuleTask(): Error occured');
            } else {
                throw error;
            }

    }

}
/**
 * Function:createSubTask 
 * @param {*} inputSubTaskData Expected data format, for insertion as { taskID:assignedTaskList[0].taskID,description:taskDescription,subTaskCreateDate:createDate,status:1,UUID:taskUUID}
 * returns : if sucessfuly created { taskID:assignedTaskList[0].taskID,description:taskDescription,subTaskCreateDate:createDate,status:1,UUID:taskUUID}
 */
async function createSubTask(inputSubTaskData){
    try{      
        const db = new sqlite3.Database(config.dbName); 
        var retData=[];
   
        var countPerCent=0;
        console.log( "INSIDE DB" );
        console.log( inputSubTaskData  );
        var sqlStr="INSERT INTO SUBTASK (taskID,description,subTaskCreateDate,status,UUID) VALUES ( " +
                                        inputSubTaskData[0].taskID  +", '" +
                                        inputSubTaskData[0].description  +"', '" +
                                        inputSubTaskData[0].subTaskCreateDate  +"' , '" +
                                        inputSubTaskData[0].status  +"' , '" +
                                        inputSubTaskData[0].UUID  +"' )";

        console.log(sqlStr);
        rs = await dblib.rundb(db,sqlStr);
        if(rs) 
        { 
            console.log("Inserted [success]:" + sqlStr);
        
        }
        else
        {  
        console.log("Inserted [Failed]:" + sqlStr);
        }
        var retData=await getSubTaskByUUID(inputSubTaskData[0].UUID);
        console.log("Inserted data:");
        console.log(retData);
                
        db.close((error) => {
            if (error) {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, getTask(): Datadase close Error');
                } else {
                    throw error;
                }
            }
        
        });
        return retData;
    }catch(error)
    {
        // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getTask(): Error occured');
            } else {
                throw error;
            }

    }        


}

/*
{                                        taskID:outputSubTaskData[0].taskID,
                                         subTaskID:outputSubTaskData[0].subTaskID,
                                         taskName:taskNameInfo,
                                         taskDesc:taskDescription,
                                         subTaskAssignDate: createDate,
                                         subTaskDueDate:taskDueDateInfo,
                                         priorityID:priorityList[0].priorityID,
                                         status:0,
                                         taskDetailUUID:taskDetailUUID
                                        }
*/
async function insertTaskDetails(inputTaskDetails){
    try{      
        const db = new sqlite3.Database(config.dbName); 
        var retData=[];

        console.log( "INSIDE DB(TaskDetails Insert module)" );
        console.log( inputTaskDetails  );
        var sqlStr="INSERT INTO TASKDETAILS (taskID,subTaskID,taskName,taskDesc,subTaskAssignDate,subTaskDueDate,priorityID,status,taskDetailUUID) VALUES ( " +
                                            inputTaskDetails[0].taskID  +", " +
                                            inputTaskDetails[0].subTaskID  +", '" +
                                            inputTaskDetails[0].taskName  +"' , '" +
                                            inputTaskDetails[0].taskDesc  +"' , '" +
                                            inputTaskDetails[0].subTaskAssignDate  +"' , '" +
                                            inputTaskDetails[0].subTaskDueDate  +"' ," +
                                            inputTaskDetails[0].priorityID  +" , " +    
                                            inputTaskDetails[0].status  +" , '" +                    
                                            inputTaskDetails[0].taskDetailUUID  +"' )";

        console.log(sqlStr);
        rs = await dblib.rundb(db,sqlStr);
        if(rs) 
        { 
            console.log("Inserted [success]:" + sqlStr);
        
        }
        else
        {  
        console.log("Inserted [Failed]:" + sqlStr);
        }
        var retData=await getTaskDetailsByUUID(inputTaskDetails[0].taskDetailUUID);
        console.log("Inserted data:");
        console.log(retData);

        db.close((error) => {
            if (error) {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, insertTaskDetails(): Datadase close Error');
                } else {
                    throw error;
                }
            }
        
        });
   
        return retData;
    }catch(error)
    {
        // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, insertTaskDetails(): Error occured');
            } else {
                throw error;
            }

    }        


}
/**
 * 
 * @param {*} uuidStr subTask UUID user to identify newly created task with subTask ID
 * @returns Return subTask Details like { taskID:assignedTaskList[0].taskID,description:taskDescription,subTaskCreateDate:createDate,status:1,UUID:taskUUID}
 */
async function getSubTaskByUUID(uuidStr)
{
  try{      const db = new sqlite3.Database(config.dbName); 
            var retData=[];
            var countPerCent=0;
            var sqlStr="select * from subTask where UUID like '" + uuidStr + "'";
            console.log("Sql for UUID:" +sqlStr);

            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
                retData.push({ taskID:row.taskID,subTaskID:row.subTaskID,description:row.description,subTaskCreateDate:row.subTaskCreateDate,status:row.status,UUID:row.UUID});

            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getSubTaskByUUID(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            
            return retData;
    }catch(error)
    {
          // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getSubTaskByUUID(): Error occured');
            } else {
                throw error;
            }

    }
    
}



/**
 * Function:getTaskDetailsByUUID
 * @param {*} uuidStr subTask UUID user to identify newly created task with subTask ID
 * @returns Return subTask Details like {  taskID:row.taskID, subTaskID:row.subTaskID, taskName:row.taskName, taskDesc:row.taskDesc, subTaskAssignDate:row.subTaskAssignDate, priorityID:row.priorityID,  status:row.status, taskDetailUUID:row.taskDetailUUID }
 */
async function getTaskDetailsByUUID(uuidStr)
{
  try{      const db = new sqlite3.Database(config.dbName); 
            var retData=[];
            var countPerCent=0;
            var sqlStr="select * from TaskDetails where taskDetailUUID like '" + uuidStr + "'";
            console.log("Sql for UUID:" +sqlStr);

            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
                let priorityFlag=row.priorityID;
                var flagName="white.png";
                if(priorityFlag==1)
                {flagName="red.png";}
                if(priorityFlag==2)
                {flagName="blue.png";}
                retData.push({  taskID:row.taskID,
                                subTaskID:row.subTaskID,
                                taskName:row.taskName,
                                taskDesc:row.taskDesc,
                                subTaskAssignDate:row.subTaskAssignDate,
                                subTaskDueDate:row.subTaskDueDate,
                                priorityID:row.priorityID,
                                status:row.status,
                                taskDetailUUID:row.taskDetailUUID,
                                taskDetailID:row.taskDetailID,
                                priorityFlag:flagName
                 });
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getTaskDetailsByUUID(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            
            return retData;
    }catch(error)
    {
          // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getTaskDetailsByUUID(): Error occured');
            } else {
                throw error;
            }

    }
    
}

/**
 * Function:getTaskDetailsByTaskDetailID
 * @param {*} taskDetailID Is key fom Taskdetails table user to identify details about task,subTask and other details
 * @returns Return subTask Details like {  taskID:row.taskID, subTaskID:row.subTaskID, taskName:row.taskName, taskDesc:row.taskDesc, subTaskAssignDate:row.subTaskAssignDate, priorityID:row.priorityID,  status:row.status, taskDetailUUID:row.taskDetailUUID }
 */
async function getTaskDetailsByTaskDetailID(taskDetailID)
{
  try{      const db = new sqlite3.Database(config.dbName); 
            var retData=[];
            var countPerCent=0;
            var sqlStr="select * from TaskDetails where taskDetailID =" + taskDetailID + "";
            console.log("Sql for taskDetailID:" +sqlStr);

            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
                let priorityFlag=row.priorityID;
                var flagName="white.png";
                if(priorityFlag==1)
                {flagName="red.png";}
                if(priorityFlag==2)
                {flagName="blue.png";}
                retData.push({  taskID:row.taskID,
                                subTaskID:row.subTaskID,
                                taskName:row.taskName,
                                taskDesc:row.taskDesc,
                                subTaskAssignDate:row.subTaskAssignDate,
                                subTaskDueDate:row.subTaskDueDate,
                                priorityID:row.priorityID,
                                status:row.status,
                                taskDetailUUID:row.taskDetailUUID,
                                taskDetailID:row.taskDetailID,
                                priorityFlag:flagName
                 });
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getTaskDetailsByTaskDetailID(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            
            return retData;
    }catch(error)
    {
          // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getTaskDetailsByTaskDetailID(): Error occured');
            } else {
                throw error;
            }

    }
    
}
/**
 * Function getWEEKINFO
 * @param {*} taskID  taskID wich is associated to module Code and
 * @param {*} weekStr Week associated subtask which is assigned to module
 * @returns  rutuns: { taskID:row.taskID,subTaskID:row.subTaskID,description:row.description,subTaskCreateDate:row.subTaskCreateDate,status:row.status,UUID:row.UUID}
 */
async function getWEEKINFO(taskID, weekStr)
{
  try{       
 
            const db = new sqlite3.Database(config.dbName); 
            var retData=[];
            var countPerCent=0;
            var sqlStr="select * from subTask where taskID =" + taskID + " and description like '" + weekStr +"'";
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ taskID:row.taskID,subTaskID:row.subTaskID,description:row.description,subTaskCreateDate:row.subTaskCreateDate,status:row.status,UUID:row.UUID});
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getWEEKINFO(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            
            return retData;

    }catch(error)
    {
            // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getWEEKINFO(): Error occured');
            } else {
                throw error;
            }

    }
  
}     



/**
 * FUNCTION: getModulePercentage
 * @param {*} userID 
 * @param {*} moduleShortCode 
 * @returns 
 */
async function getModulePercentage(userID, moduleShortCode)
{
  try{       
 
            const db = new sqlite3.Database(config.dbName); 
            var countPerCent=0;
            var modulePercentage=[];
            var sqlStrModulePercentage="select B.moduleID as moduleID,moduleShortCode,percentage_completed from (SELECT  moduleID,  100 * SUM(CASE WHEN status = 100 THEN 1 ELSE 0 END) / COUNT(*) AS percentage_completed FROM (select TID,moduleID,status  from taskDetails A, (select t1.taskID as TID,moduleID,subTaskID from task t1,subtask t2 where t1.taskID=t2.taskID and userID="+userID+") B Where A.subTaskID=B.subTaskID) C group by c.moduleID) A, Module B where B.moduleID=A.moduleID and moduleShortCode like '"+moduleShortCode+"'";
            rs2 = await dblib.getSqlData(db,sqlStrModulePercentage, [])
            rs2.forEach(function(row) {
              countPerCent++;       
              modulePercentage.push({ moduleID:row.moduleID,moduleShortCode:row.moduleShortCode,percentage:row.percentage_completed});
            }) 
            if(countPerCent==0){ //User has not created any subtask , percent should be zero
              modulePercentage.push({ moduleID:moduleIDTmp,moduleShortCode:moduleShortCode,percentage:0});
            } 

            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getModulePercentage(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            
            return modulePercentage;

    }catch(error)
    {
            // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getModulePercentage(): Error occured');
            } else {
                throw error;
            }

    }
  
}     
/**
 * Function getWEEKINFONotCompletedModule
 * @param {*} taskID  taskID wich is associated to module Code and
 * @param {*} weekStr Week associated subtask which is assigned to module
 * @returns  rutuns: { taskID:row.taskID,subTaskID:row.subTaskID,description:row.description,subTaskCreateDate:row.subTaskCreateDate,status:row.status,UUID:row.UUID}
 */
async function getWEEKINFONotCompletedModule(taskID, weekStr)
{
  try{       
 
            const db = new sqlite3.Database(config.dbName); 
            var retData=[];
            var countPerCent=0;
            var sqlStr="select * from subTask where taskID =" + taskID + " and description like '" + weekStr +"'  and taskID in (select taskID from taskDetails where status <100)";
            console.log(sqlStr);
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ taskID:row.taskID,subTaskID:row.subTaskID,description:row.description,subTaskCreateDate:row.subTaskCreateDate,status:row.status,UUID:row.UUID});
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getWEEKINFONotCompletedModule(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            
            return retData;

    }catch(error)
    {
            // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getWEEKINFONotCompletedModule(): Error occured');
            } else {
                throw error;
            }

    }
  
}
/**
 * 
 * @param {*} taskDetails =>  {taskDetailID:taskDetailID,status:status,subTaskCompletionDate:subTaskCompletionDate}
 * @returns 
 */
async function updateCompletionTaskDetails(taskDetails)
{
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             

            console.log( "UPDATE DB(TaskDetails updateCompletionTaskDetails module)" );
            console.log( taskDetails  );
            var sqlStr="UPDATE TASKDETAILS  SET status="+ taskDetails.status +", subTaskCompletionDate='"+ taskDetails.subTaskCompletionDate+"'  where taskDetailID = " + taskDetails.taskDetailID;

            console.log(sqlStr);
            rs = await dblib.rundb(db,sqlStr);
            if(rs) 
            { 
                console.log("update [success]:" + sqlStr);
            
            }
            else
            {  
            console.log("update [Failed]:" + sqlStr);
            }
            var retData=await getTaskDetailsByTaskDetailID(taskDetails.taskDetailID);
            console.log("Inserted data:");
            console.log(retData);

        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, updateCompletionTaskDetails(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return retData;
}

/**
 * 
 * @param {*} getTaskDetails 
 * @returns 
 */
async function getTaskDetails(taskDetails)
{
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             

            console.log( "get  TaskDetails  module)" );
            console.log( taskDetails  );
            var taskDetails=taskDetails.taskDetailID;
            var sqlStr="select * from (select taskDetailID, taskID, a1.subTaskID as subTask_SubTaskID,taskName,taskDesc,subTaskDueDate,priorityID,a1.status as taskDetails_Status,subTaskCompletionDate,taskTaskID as task_taskID,description,subTaskStatus as subTask_Status,moduleID,moduleShortCode,taskTaskStatus as task_status,userID from taskDetails a1, (select taskTaskID,subTaskID,description,status as subTaskStatus,moduleID,moduleShortCode,taskTaskStatus,userID from subTask s1, (select t1.taskID as taskTaskID,t1.moduleID as moduleID,moduleShortCode,taskStatus as taskTaskStatus,userID from task t1,module m1 where userID=19 and m1.moduleID=t1.moduleID) s2 where s1.taskID=s2.taskTaskID) b1 where a1.subTaskID=b1.subTaskID) where taskDetailID="+taskDetails+"";
            var retData=[];
            console.log(sqlStr);
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ taskDetailID:row.taskDetailID,taskID:row.taskID,subTaskID:row.subTask_SubTaskID,taskName:row.taskName,taskDesc:row.taskDesc,subTaskDueDate:row.subTaskDueDate,priorityID:row.priorityID,  taskDetails_Status:row.taskDetails_Status,subTaskCompletionDate:row.subTaskCompletionDate, task_taskID:row.task_taskID,description:row.description, subTask_Status:row.subTask_Status,moduleID:row.moduleID,moduleShortCode:row.moduleShortCode, task_status:row.task_status,userID:row.userID  });
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getTaskDetails(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            
            return retData;

        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, getTaskDetails(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return retData;
}

/**
 * 
 * @param {*} getMaxPointDetails , userID as users->UserID key
 * @returns 
 */
async function getMaxPointDetails(userID)
{
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             

            console.log( "get  Max point Details  with given userID)" );
             var sqlStr="select * from earnpoint where epochDate in (select max(epochDate) from earnPoint where userID="+userID+") and userID="+userID+"";
            var retData=[];
            console.log(sqlStr);
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ totalEarnPoint:row.totalEarnPoint  });
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getMaxPointDetails(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            if(retData.length>0)
            {
                return retData[0].totalEarnPoint;
            }
            else //User doesn't have any point yet
            {
                return 0;
            }

        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, getMaxPointDetails(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return 0;
}


/**
 * 
 * @param {*} taskDetails =>  { taskDetailID:taskDetailID,week:weekInfo,taskName:taskName,taskDesc:taskDesc,subTaskDueDate:subTaskDueDate,priorityID:priorityID,subTaskID: subTaskID,taskID: taskID,UUID:taskUUID}
 * @returns 
 */
async function updateTaskDetails(taskDetails)
{  var retData=[];
   
   try{     var errCount=0; 
            var IsWeekFound=false;
            var IsWeekFoundModule=false;
            var IsWeekFoundModuleSubTaskTaskID=0;
            var newSubTaskID=0;
            var newTaskDetailID=0;

            const db = new sqlite3.Database(config.dbName); 
            sqlStrVerifyWeek="Select * from  SUBTASK where subTaskID = " + taskDetails[0].subTaskID + " and description like '" + taskDetails[0].week +"'" ;
            rs0 = await dblib.getSqlData(db,sqlStrVerifyWeek, [])
            rs0.forEach(function(row) {
                IsWeekFound=true; 
                IsWeekFoundModuleSubTaskTaskID= taskDetails[0].subTaskID;

            }) 
            sqlStrVerifyWeekModule="Select * from  SUBTASK where taskID = " + taskDetails[0].taskID + " and description like '" + taskDetails[0].week +"'" ;
            rs1 = await dblib.getSqlData(db,sqlStrVerifyWeekModule, [])
            rs1.forEach(function(row) {
                IsWeekFoundModule=true;
                IsWeekFoundModuleSubTaskTaskID=row.subTaskID;
            }) 
            //#####################################################################
            //Total Three cases we have
            //1. User did  not change week-id
            //2. User changed a week-id  and that weekId is having some other assigned task
            //3. user changed to a new week that does not exist before
            //#####################################################################
            //CASE-1
            if(IsWeekFound ==true) //CASE-1 Check If task is already havining  assigned to same week
            {
                newSubTaskID=taskDetails[0].subTaskID ;
                newTaskDetailID=taskDetails[0].taskDetailID;
                console.log("Task Update requested with same week");

            }
            else if(IsWeekFound==false && IsWeekFoundModule==true) //CASE-2
            {    
                newSubTaskID=IsWeekFoundModuleSubTaskTaskID;
                newTaskDetailID=taskDetails[0].taskDetailID;
                console.log("Task Update requested with other existing week");

            }
            else if(IsWeekFound==false && IsWeekFoundModule==false)//CASE-3  CREATE Subtask and 
            {    //CREATE subTask with the help of taskID , taskID is associated with userID and ModuleID
                 //inputSubTaskData Expected data format, for insertion as { taskID:assignedTaskList[0].taskID,description:taskDescription,subTaskCreateDate:createDate,status:1,UUID:taskUUID}
                 var inputSubTaskData=[];
                 let createDate= new Date().toISOString();
                 inputSubTaskData.push({ taskID:taskDetails[0].taskID ,description:taskDetails[0].week,subTaskCreateDate:createDate,status:1,UUID:taskDetails[0].UUID});
                 var newSubTask=await createSubTask(inputSubTaskData);
                 if(newSubTask.length >0)//New subTask has been created
                 {
                    newSubTaskID=newSubTask[0].subTaskID;
                    newTaskDetailID=taskDetails[0].taskDetailID;
                 }
                 console.log("Task Update requested with other non-existing week");
            }

            if(newSubTaskID>0) //Qualified to update taskDetails table
            {

                 
                var sqlStr2="UPDATE TASKDETAILS  SET taskName='"  + taskDetails[0].taskName +"' ," +
                                                    "taskDesc='" + taskDetails[0].taskDesc +"' ," +
                                                    "subTaskID=" + newSubTaskID +" ," +
                                                    "subTaskDueDate= '" + taskDetails[0].subTaskDueDate +"' ," +
                                                    "priorityID =" + taskDetails[0].priorityID +" " +
                                                    " where  taskDetailID=" +newTaskDetailID;

                console.log(sqlStr2);
                rs1 = await dblib.rundb(db,sqlStr2);
                if(rs1) 
                { 
                    console.log("update [success]:" + sqlStr2);
                
                }
                else
                {  
                     console.log("update [Failed]:" + sqlStr2);
                }

                retData=await getTaskDetailsByTaskDetailID(taskDetails[0].taskDetailID);
                console.log("Updated  data:");
                console.log(retData);
            }
   


        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, updateTaskDetails(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return retData;
}
 


/**
 * 
 * @param {*} taskDetailID =>  ID  must be primary Key of TaskDetails->taskDetailID
 * @returns 
 */
async function deleteTaskDetails(taskDetailID)
{
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             

            console.log( "Delete row DB(TaskDetails deleteTaskDetails module)" );
            console.log( taskDetailID  );
            var sqlStr1="DELETE  FROM TASKDETAILSPOST  where taskDetailID = " + taskDetailID;
            var sqlStr2="DELETE  FROM TASKDETAILS      where taskDetailID = " + taskDetailID;

            console.log(sqlStr1);
            rs = await dblib.rundb(db,sqlStr1);
            if(rs) 
            { 
                console.log("update [success]:" + sqlStr1);
            
            }
            else
            {  
            console.log("update [Failed]:" + sqlStr1);
            }

            console.log(sqlStr2);
            rs = await dblib.rundb(db,sqlStr2);
            if(rs) 
            { 
                console.log("update [success]:" + sqlStr2);
            
            }
            else
            {  
            console.log("update [Failed]:" + sqlStr2);
            }


            var retData=await getTaskDetailsByTaskDetailID(taskDetailID);
            console.log("Removed row(taskDetailID): " +taskDetailID );
            console.log(retData);

        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, deleteTaskDetails(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return retData;
}



/**
 * 
 * @param {*} taskDetails =>  {taskDetailID:taskDetailID,status:status,subTaskCompletionDate:subTaskCompletionDate,userID:userID,moduleShortCode:moduleShortCode}
 * @returns 
 */
async function updateCompletionTaskDetailsApplyPoints(taskDetails)
{
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             
           //Get Current Total Point As enrolled in course
           //Get before applying  completion what is the percent of the module completion, total earn point will update EarnPoint Table
           //   -------------------------------------------------------------------------
           //   |    Total Module %                                 | Total earn points |
           //   |---------------------------------------------------|                   |
           //   |    Before or current%   |     next %              |                   |
           //   |------------------------------------------------------------------------
           //   |      <50                |    50-79                |   +10             |
           //   |      50-79              |    80-99                |   +10             |
           //   |      <50                |    80-99                |   +20             |
           //   |      <50                |    100                  |   +30             |
           //   |_________________________|_________________________|___________________|
           //
           //
           //  
           //
           //
           //#######################BEFORE COMPLETION , CALCULATE TOTAL POINT##################
           var userID=taskDetails.userID;
           var moduleShortCode=taskDetails.moduleShortCode;
            
           var rowDataBefore=await getModuleInfo(userID); //Example rowData content : { [moduleID: 30,    moduleCode: 'CM3070',    level: 'Level 6',    moduleShortCode: 'FP',    taskStatus: -1,    status: false,    percentageCompleted: 0 ],      }
           console.log("Total percentage before applying the completeion:")
           console.log(rowDataBefore);
           const totalPercentageBefore=await calculateTotalModulePercentage(rowDataBefore);
 
           var maxPointEarnedYet=await getMaxPointDetails(userID);
           var oldMaxPoint=maxPointEarnedYet;
   
           

           var dataModule=await getModuleID(moduleShortCode);
           var moduleID=0;
           if(dataModule.length>0)
             moduleID=dataModule[0].moduleID;

           //###############################END OF VERIFICATION################################

            console.log( "UPDATE DB(TaskDetails updateCompletionTaskDetailsApplyPoints module)" );
            console.log( taskDetails  );
            var sqlStr="UPDATE TASKDETAILS  SET status="+ taskDetails.status +", subTaskCompletionDate='"+ taskDetails.subTaskCompletionDate+"'  where taskDetailID = " + taskDetails.taskDetailID;

            console.log(sqlStr);
            rs = await dblib.rundb(db,sqlStr);
            if(rs) 
            { 
                console.log("update [success]:" + sqlStr);
            
            }
            else
            {  
            console.log("update [Failed]:" + sqlStr);
            }
            var retData=await getTaskDetailsByTaskDetailID(taskDetails.taskDetailID);


           //#######################AFTER COMPLETION,  CALCULATE TOTAL POINT AND INSERT  INTO DB##################
        
           var rowDataAfter=await getModuleInfo(userID); //Example rowData content : { [moduleID: 30,    moduleCode: 'CM3070',    level: 'Level 6',    moduleShortCode: 'FP',    taskStatus: -1,    status: false,    percentageCompleted: 0 ],      }
           console.log(rowDataAfter);
           const totalPercentageAfter=await calculateTotalModulePercentage(rowDataAfter);

 
           console.log("totalPercentageBefore:" + totalPercentageBefore );
           console.log("totalPercentageAfter:" + totalPercentageAfter);
           
           if(totalPercentageAfter >50 &&  totalPercentageBefore <  totalPercentageAfter ) //Atleast some points need to be add to total point 
           {
                var diffPointVal=totalPercentageAfter-totalPercentageBefore;
                var deductPoint=0;
                var diffPoint=0;
                if(totalPercentageBefore <50 && totalPercentageAfter >=50)
                {
                    deductPoint=50 -totalPercentageBefore;
           
                }
                diffPoint=totalPercentageAfter-totalPercentageBefore-deductPoint;
           
                //Added 20 because every 20% increment of total Percentage , we need to add 10 points, 50-70, 70-90,90-110
                var factorVal= Math.floor(diffPoint / 20) +1;
                console.log("factor: " + factorVal)
                var totalPointToBeAdd=(factorVal*10);
                console.log("Total Point:" + totalPointToBeAdd);
                maxPointEarnedYet = maxPointEarnedYet + totalPointToBeAdd; //Newly Added Points

                
                console.log( "INSIDE DB(TaskDetails Insert module)" );
                
                let earnDate = new Date().toISOString();
                let epochDate=  Math.floor(Date.now() / 1000);
                const UUID= uuid();
                console.log(UUID);
                var sqlStrAddPoint="INSERT INTO EARNPOINT (userID,taskID,earnPoint,earnDate,totalEarnPoint,epochDate,moduleID,UUID) VALUES ( " +
                                                        taskDetails.userID  +", " +
                                                        taskDetails.taskDetailID  +", " +
                                                        totalPointToBeAdd  +" , '" +
                                                                         earnDate  +"' , " +
                                                                         maxPointEarnedYet  +" , " +
                                                                         epochDate  +" ," +
                                                                         moduleID  +" , '" +    
                                                                           UUID  +"' )";

                console.log(sqlStrAddPoint); 
                rs3 = await dblib.rundb(db,sqlStrAddPoint);
                if(rs3) 
                { 
                    console.log("Inserted [success]:" + sqlStrAddPoint);
                
                }
                else
                {  
                console.log("Inserted [Failed]:" + sqlStrAddPoint);
                } 

                //ALLOCATE BADGE ID IF NECESSARY
                var newMaxPoint=await getMaxPointDetails(userID);
                var badgeID=allocateBadge(userID,oldMaxPoint,newMaxPoint);
                if(badgeID >0)
                {
                    console.log("New Badge Has been allocated");
                }
                else
                {
                    console.log("New point does not qualified to earn a new badge!!");
                }
                
           
           }

           //###############################END OF AFTER COMPLETION,  CALCULATE TOTAL POINT AND INSERT  INTO DB################################

            console.log("Inserted data:");
            console.log(retData);

        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, updateCompletionTaskDetailsApplyPoints(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return retData;
}

async function getAllBadge(userID)
{
   
    
    
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             

            console.log( "Get  set of badge  details  with given userID)" );
             var sqlStr="select s1.badgeID as badgeID,s1.picture as picture,s2.message as message,s1.maxpoint as maxpoint,s2.userID as userID  from badge s1, badgeDetails s2 where  s1.badgeID =s2.badgeID and  s2.userID="+userID+"  order by maxPoint asc";
            var retData=[];
            console.log(sqlStr);
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ badgeID:row.badgeID, picture:row.picture, message:row.message,maxpoint:row.maxpoint,userID:row.userID});
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getAllBadge(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            return retData;
 
        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, getAllBadge(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return 0;
}

/**
 * Function: allocateBadge
 * Desc: usually called when module points added to total Points. 
 * @param {*} userID 
 * @param {*} oldPoints 
 * @param {*} newPoints 
 * @returns 
 */
async function allocateBadge(userID,oldPoints,newPoints){

    
   try{      
        var IsNewBadgeRequired=false;
        var newBadgeID=-1;
        let earnDate = new Date().toISOString();
        const congratulations = [
            { message: 'Great start! You reached' },
            { message: 'Good job! You reached ' },
            { message: 'Keep it up! You reached' },
            { message: 'You are doing well! You reached ' },
            { message: 'You are making great progress! You reached '},
            { message: 'You are halfway there! You reached ' },
            { message: 'You are on a roll! You reached '},
            { message: 'You are almost there! You reached ' },
            { message: 'You are doing amazing! You reached ' },
            { message: 'You are a superstar! You reached ' },
            { message: 'You did it!' },
            { message: 'Excellent job! You reached a milestone of '},
            { message: 'Impressive! You reached a milestone of ' },
            { message: 'Outstanding work! You reached a milestone '},
            { message: 'Wow, you are really crushing it! You reached a milestone of '},
            { message: 'Keep up the good work! You reached a milestone of ' },
            { message: 'You are a rockstar! You reached a milestone of ' },
            { message: 'You are unstoppable! You reached a milestone of ' },
            { message: 'Incredible work! You reached a milestone of ' },
            { message: 'You are a legend! You reached a milestone of '}
          ];
          
          // Remove the % characters from the message property values
          congratulations.forEach(congratulation => {
            congratulation.message = congratulation.message.replace('%', '');
          });
        var messageStr="Good job!";  
        const db = new sqlite3.Database(config.dbName); 
                        //select *  from badge where maxpoint >99 and maxpoint<= 260  and badgeid not in(13)
        //CASE-I VALID CONDITION
        var sqlStr= "select *  from badge where maxpoint >" +oldPoints+" and maxpoint<= "+newPoints+"  and badgeid not in( select badgeID from badgeDetails where userID="+ userID +")";             
        console.log("Get Badge ID SQL:" + sqlStr);
        
        rs0 = await dblib.getSqlData(db,sqlStr, [])
        rs0.forEach(function(row) {
            newBadgeID=row.badgeID;
            messageStr=congratulations[newBadgeID-1].message +" " + newPoints + " points";

        }) 
         
        console.log( "Inserting BadgeDeatils row DB(allocateBadge module)" );
        var sqlStr1="INSERT INTO badgeDetails (badgeID,userID,taskID,message,createDate) VALUES ("+newBadgeID+","+userID+",0,'"+messageStr+"','"+earnDate+"')";
        console.log(sqlStr1);
        if(newBadgeID>0) //Only If any valid insertion condition CASE-I VALID CONDITION
        {
            rs = await dblib.rundb(db,sqlStr1);
            if(rs) 
            { 
                console.log("Insert [success]:" + sqlStr1);
            
            }
            else
            {  
            console.log("Insert [Failed]:" + sqlStr1);
            }
        }
        else
        {
            console.log("Skipped to insert data into badge details.");
        }
        var sqlStr2="select * from badgeDetails where badgeID="+newBadgeID+" and userID=" +userID + "";
        console.log(sqlStr2);
        var insertedBadgeID=-1;
        rs2 = await dblib.getSqlData(db,sqlStr2, [])
        rs2.forEach(function(row) {
            insertedBadgeID=row.badgeID;

        }) 
        console.log(insertedBadgeID);
        return insertedBadgeID;

}catch(error)
{
        // handle the error
        if (error instanceof TypeError) {
            throw new Error('dbapi, deleteTaskDetails(): Error occured');
        } else {
            throw error;
        }

}

 return -1;

}

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
  async function calculateTotalModulePercentage(dbRowData){
    var totalPercentage=0;
    var totalPoint=0;
    var totalModule=0;
    console.log("Total Rec:" + dbRowData.length);
    for(var i=0; i<dbRowData.length;i++)
    {  let eachRow=dbRowData[i];
      if(eachRow.taskStatus>=1) //task.taskStatus field 0= just created 1= subtask or weeks has been created 2=all modules are 100% completed
      {
        totalPoint= totalPoint+ eachRow.percentageCompleted;
        totalModule++;
      }

    }
    if(totalModule>0)
    {
      totalPercentage= totalPoint/totalModule;

    }
    console.log("Total Module:" + totalModule );
    console.log("TotalPercentage:" + totalPercentage);
    return totalPercentage;

}
  
async function getModuleInfo(userId)
{
   let sqlStr="select moduleID,userID,moduleCode,level,moduleShortCode,taskStatus  from task t1, ( select moduleID as mid,moduleCode,level,moduleShortCode from module ) t2  where  userID="+userId+" and t1.moduleID=t2.mid";
   let sqlStr2="select moduleID,moduleCode,level,moduleShortCode from module";
   let sqlStrPercentage="SELECT  moduleID,  100 * SUM(CASE WHEN status = 100 THEN 1 ELSE 0 END) / COUNT(*) AS percentage_completed FROM (select TID,moduleID,status  from taskDetails A, (select t1.taskID as TID,moduleID,subTaskID from task t1,subtask t2 where t1.taskID=t2.taskID and userID="+userId+" ) B Where A.subTaskID=B.subTaskID) C group by c.moduleID";
   const db = new sqlite3.Database(config.dbName);  

   /**
    * GET STATUS OF CURRENTLY ASSIGNED MODULE NAME AND CODE
    */
//Get percentage of each module

  var percentageDataEachModule=[];
  rs3 = await dblib.getSqlData(db,sqlStrPercentage, []);
  rs3.forEach(function(row) {
      percentageDataEachModule.push({ moduleID:row.moduleID, modulePercentage:row.percentage_completed});
  })  
//End of percentage of each moduel

   var retData=[];
   var doNotIncludeTaskStr="0";
   rs = await dblib.getSqlData(db,sqlStr, []);
   rs.forEach(function(row) {
       console.log("SqlData", row.moduleID)    ;
       doNotIncludeTaskStr = doNotIncludeTaskStr + "," + row.moduleID;
       var modCode=row.moduleCode;
       var modCodeID=row.moduleID;
       var percentage=0;
       for(var t=0;t < percentageDataEachModule.length;t++)
       {
              if(modCodeID== percentageDataEachModule[t].moduleID)
              {
                percentage=percentageDataEachModule[t].modulePercentage;
                break;
              }
       }
       retData.push({ moduleID:row.moduleID, moduleCode:row.moduleCode,level:row.level,moduleShortCode:row.moduleShortCode,taskStatus:row.taskStatus,status:true,percentageCompleted:percentage});
   })  
   var result=rs.length;
   sqlStr2 = sqlStr2 + " where moduleID not in (" + doNotIncludeTaskStr + ")";
   rs1 = await dblib.getSqlData(db,sqlStr2, []);
   rs1.forEach(function(row) {
       console.log("SqlData", row.moduleID)    ;
       doNotIncludeTaskStr = doNotIncludeTaskStr + "," + row.moduleID;
       var moduleID=row.moduleID;
       var moduleCode=row.moduleCode;
       var level=row.level;

       retData.push({ moduleID:moduleID, moduleCode:moduleCode,level:level ,moduleShortCode:row.moduleShortCode,taskStatus:-1,status:false,percentageCompleted:0});
   })  
   db.close((err) => {
    if (err) {
        console.error(err.message);
        return res.status(400).json({ error: 'DB resource error:', status: true });
    }

    });
  retData.sort(function(a, b) {
    return a.moduleID - b.moduleID;
  });
  //console.log(retData);
  return retData;

}


async function deleteModule(moduleShortCodeID,userID)
{
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             var retData=[];

            console.log( "Delete row DB(deleteModule module)" );
            console.log( moduleShortCodeID  );
            var sqlStr="select * from task where moduleID  in(select moduleID from Module where moduleShortCode like '"+moduleShortCodeID+"') and userID="+userID+"";
            var taskID=-1;
            rs0 = await dblib.getSqlData(db,sqlStr, [])
            rs0.forEach(function(row) {
                taskID=row.taskID;
            }) 


            var delSqlStr=[ "DELETE  FROM TASKDETAILSPOST  where taskDetailID in (select taskDetailID from TASKDETAILS where taskID=" +taskID+  ")",
                          "DELETE  FROM TASKDETAILS      where taskID = " + taskID ,
                          "DELETE  FROM SUBTASK      where taskID = " + taskID,
                          "DELETE  FROM TASK       where taskID = " + taskID
                        ];
           for(var i=0;i < delSqlStr.length; i++ )
           {
               console.log("Deleting " + delSqlStr[i]);
               var sqlStr=delSqlStr[i];
               console.log(sqlStr);
               rs = await dblib.rundb(db,sqlStr);
               if(rs) 
               { 
                   console.log("update [success]:" + sqlStr);
               
               }
               else
               {  
               console.log("update [Failed]:" + sqlStr);
               }
           }
 
            console.log(retData);

        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, deleteTaskDetails(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return retData;
}
 /**
  *Function : sessionLogout to  logout usersession using sessionID
  * @param {*} sessionID 
  * @returns 
  */
async function sessionLogout(sessionID)
{
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             var retData=[];

            console.log( "Delete row sessions(sessionID or cookies)" );
            console.log( sessionID  );
            var delSqlStr=[ "DELETE  FROM SESSIONS  where cookies like '" + sessionID +"'"  ];
            var ifSuccess=false;              
           for(var i=0;i < delSqlStr.length; i++ )
           {
               console.log("Deleting " + delSqlStr[i]);
               var sqlStr=delSqlStr[i];
               console.log(sqlStr);
               rs = await dblib.rundb(db,sqlStr);
               if(rs) 
               { 
                   console.log("Delete [success]:" + sqlStr);
                   ifSuccess=true;
               }
               else
               {  
                   console.log("delete [Failed]:" + sqlStr);
                   ifSuccess=false;
               }
           }
 
            console.log(ifSuccess);
            return ifSuccess;

        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, deleteTaskDetails(): Error occured');
                } else {
                    throw error;
                }
        }

    
}


async function getAllUsers(userID)
{
   
    
    
   
   try{      
            const db = new sqlite3.Database(config.dbName); 
             

            console.log( "Get  all users userID" );
             var sqlStr="select * from users";
            var retData=[];
            console.log(sqlStr);
            rs = await dblib.getSqlData(db,sqlStr, [])
            rs.forEach(function(row) {
            retData.push({ userName:row.userName, profilePicture:row.profilePpicture, slackID:row.slackID,userID:row.userID});
            }) 
            db.close((error) => {
                if (error) {
                    // handle the error
                    if (error instanceof TypeError) {
                        throw new Error('dbapi, getAllUsers(): Datadase close Error');
                    } else {
                        throw error;
                    }
                }
            
              });
            return retData;
 
        }catch(error)
        {
                // handle the error
                if (error instanceof TypeError) {
                    throw new Error('dbapi, getAllUsers(): Error occured');
                } else {
                    throw error;
                }
    
        }

   return 0;
}
async function getLeaderboardDeatils(userID)
{
   
    
    var retdata=[];
   
   try{      
        var allUsers=await getAllUsers(userID); //{ userName:row.userName, profilePicture:row.profilePpicture, slackID:row.slackID,userID:row.userID}
        for(var i=0; i< allUsers.length; i++)
        {   var courses=[];
            var tmpUserID=allUsers[i].userID;
            var userName=allUsers[i].userName;
            if(tmpUserID !== userID)
            {    // required data [ {         points: 50,         slack: true,   courses: ["ITP1", "ADS1"],    }, ]
                var rowData=await getModuleInfo(tmpUserID);
                console.log("userID:" +tmpUserID);
                console.log("Module row set length:" +  rowData.length);
                //console.log(rowData);

                for(var j=0;j< rowData.length; j++)
                {  if(rowData[j].taskStatus>=1)
                    { 
                        courses.push(rowData[j].moduleShortCode);
                    }
                }
                var totalPercentage=await calculateTotalModulePercentage(rowData);
                totalPercentage =Math.ceil(totalPercentage);
                console.log("Total Percentage for all module:" +totalPercentage );

                var totalPoints= await  getMaxPointDetails(tmpUserID);
                totalPoints= Math.ceil(totalPoints);
                console.log(allUsers[i].slackID );
                console.log("Total Point:" + totalPoints);
                var slack=false;
                if(allUsers[i].slackID !== null)
                {
                    slack=true;
                }
                retdata.push({points:totalPoints,slack:slack,courses:courses,totalPercentage:totalPercentage,userName:userName});
            }
        }

        return retdata;
    }catch(error)
    {
            // handle the error
            if (error instanceof TypeError) {
                throw new Error('dbapi, getAllBadge(): Error occured');
            } else {
                throw error;
            }

    }

   return [];
}
//module.exports = router;
module.exports = {
    getPriority,
    getModuleID,
    getTask,
    createModuleTask,
    createSubTask,
    getSubTaskByUUID,
    getWEEKINFO,
    insertTaskDetails,
    getTaskDetailsByUUID,
    getTaskDetailsByTaskDetailID,
    updateCompletionTaskDetails,
    getWEEKINFONotCompletedModule,
    getModulePercentage,
    getTaskDetails,
    updateTaskDetails,
    deleteTaskDetails,
    updateCompletionTaskDetailsApplyPoints,
    calculateTotalModulePercentage,
    getModuleInfo,
    getMaxPointDetails,
    updateModuleTask,
    getAllBadge,
    deleteModule,
    sessionLogout, 
    getLeaderboardDeatils,

  };