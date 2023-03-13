const deleteTask = document.querySelectorAll(".flex-list-item-delete-img");
const editTask = document.querySelectorAll(".flex-list-item-edit-img");
const percentageGraphID = document.querySelector("#percentageGraph");
const percentageValueID = document.querySelector("#percentageValue");
const moduleShortCodeID = document.querySelector("#moduleShortCodeID");

function reFreash() {
  location.reload(true); //on successful case
}

function reDirectDashboard() {
  window.location.href = "/dashboard";
}

/**
 * Add event listener to module button
 */
deleteTask.forEach((deleteTaskEach) => {
  deleteTaskEach.addEventListener("click", function () {
    console.log("Delete Task Handler");
    console.log(deleteTaskEach.dataset.item);
    const taskdetailID = deleteTaskEach.dataset.item;
    const xhr = new XMLHttpRequest();
    const url = "/task/delete"; // Task delete API
    const data = { taskdetailID: taskdetailID }; // Initialise JSON InputData

    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function () {
      if (xhr.status === 200) {
        // Request was successful
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        showAlert("Task removed!", "success");
        setTimeout(reFreash, 1000); // delay for 2 seconds
      } else {
        // Request failed
        console.error(xhr.statusText);
        showAlert("http connection error!", "failure");
      }
    };

    xhr.onerror = function () {
      // http connection error
      console.error("http connection error");
      showAlert("http connection error!", "failure");
    };

    xhr.send(JSON.stringify(data));
  });
});

function showAlert(message, type) {
  const alertBox = document.createElement("div");
  alertBox.classList.add("alert-box");
  alertBox.classList.add(type);
  alertBox.textContent = message;
  document.body.appendChild(alertBox);

  setTimeout(function () {
    alertBox.remove();
  }, 3000);
}

/**
 * Add event listener to module button
 */

const editTaskDialogueBox = document.querySelector("#edit-task-dialogue-box");
const editTaskBtnID = document.getElementById("editTaskButtonID");
const cancelEditTaskBtnID = document.getElementById("cancelEditTaskBtnID");
var editTaskFormID = document.getElementById("editTaskFormID");
var editTaskWeekID = document.getElementById("editTaskWeek");
var editTaskNameID = document.getElementById("editTaskName");
var editTaskDescriptionID = document.getElementById("editTaskDescription");

editTask.forEach((editTaskEach) => {
  editTaskEach.addEventListener("click", function () {
    console.log("Edit Task Handler");

    editTaskDialogueBox.style.display = "flex";
    var taskDetailID = this.dataset.item;
    console.log("Update form open for taskDetailID:" + taskDetailID);

    // Prepare Update to complete this task
    let dateOfCompletion = new Date().toISOString();
    let moduleShortCodeIDStr = moduleShortCodeID.dataset.item;

    var data = {
      taskDetailID: taskDetailID,
    };

    // Prepare XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Target URL
    xhr.open("PUT", "/task/taskdetails");

    // Set the Content-Type header for JSON data
    xhr.setRequestHeader("Content-Type", "application/json");

    // Callback function  for response handler
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log("Received data:");
        console.log(xhr.responseText);
        var data = JSON.parse(this.response); //Example Response data set: [{"data":[{"taskDetailID":65,"taskID":56,"subTaskID":1,"taskName":"Another Test","taskDesc":"Test Edit and Del","subTaskDueDate":"2023-02-15T04:59:59.000Z","priorityID":1,"taskDetails_Status":0,"subTaskCompletionDate":null,"task_taskID":56,"description":"Week-1","subTask_Status":0,"moduleID":2,"moduleShortCode":"ITP2","task_status":1,"userID":19}],"status":true}]
        if (data.length > 0) {
          var taskStatus = data[0].status;
          //console.log(taskDetailsData);
          /*
                       [{"taskDetailID":65,"taskID":56,"subTaskID":1,"taskName":"Another Test","taskDesc":"Test Edit and Del","subTaskDueDate":"2023-02-15T04:59:59.000Z","priorityID":1,"taskDetails_Status":0,"subTaskCompletionDate":null,"task_taskID":56,"description":"Week-1","subTask_Status":0,"moduleID":2,"moduleShortCode":"ITP2","task_status":1,"userID":19}]
                    */
          var resData = data[0].data;
          var taskDetailID = resData.taskDetailID;
          var taskName = resData.taskName;
          var taskDesc = resData.taskDesc;
          var subTaskDueDate = resData.subTaskDueDate;
          var priorityID = resData.priorityID;
          var priorityIDStr = "High";
          if (priorityID == 2) priorityIDStr = "Medium";
          if (priorityID == 3) priorityIDStr = "Low";
          var week = resData.description;

          if (taskStatus == false) {
            //update for completion has failed
          } else {
            //var editFormID=  fillEditForm(editTaskFormID);
            fillEditForm(resData, editTaskFormID);
          }
        }
      } else {
        console.log("Error updating message");
      }
    };

    //Send data to doitApp server
    xhr.send(JSON.stringify(data));
  });
});
function fillEditForm(resData, formID) {
  editTaskNameID.dataset.item = resData[0].taskID;
  editTaskWeekID.dataset.item = resData[0].subTaskID;
  editTaskDescriptionID.dataset.item = resData[0].moduleID;
  formID.dataset.item = resData[0].taskDetailID;
  var taskDetailID = resData[0].taskDetailID;
  var taskName = resData[0].taskName;
  var taskDesc = resData[0].taskDesc;
  var subTaskDueDate = resData[0].subTaskDueDate;
  var locatDateTime = getLocalDateStringFromUTC(subTaskDueDate);
  var priorityID = resData[0].priorityID;
  var priorityIDStr = "High";
  if (priorityID == 2) priorityIDStr = "Medium";
  if (priorityID == 3) priorityIDStr = "Low";
  var week = resData[0].description;

  // Set the value of each form field
  formID.week.value = week;
  formID.editTaskName.value = taskName;
  formID.description.value = taskDesc;
  formID.dueDate.value = locatDateTime;
  formID.priority.value = priorityIDStr;
}

function getLocalDateStringFromUTC(dateTimeUTCStr) {
  // Define Date object from input UTC date and time (dateTimeUTCStr)
  const utcDate = new Date(dateTimeUTCStr);

  // Get each values from date Object
  const year = utcDate.getFullYear();
  const month = utcDate.getMonth() + 1;
  const day = utcDate.getDate();

  // Convert to ISO string
  const isoDateString = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  return isoDateString;
}
/**
 * Display Modal update task dialog box
 */

cancelEditTaskBtnID.addEventListener("click", function () {
  editTaskDialogueBox.style.display = "none";
  location.reload(true);
});

editTaskBtnID.addEventListener("click", function () {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/task/edittask");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log("Received data:");
      console.log(xhr.responseText);
    }
  };
  var formData = new FormData(editTaskFormID);
  var jsonObject = {};
  for (var pair of formData.entries()) {
    if (pair[0] === "dueDate") {
      //Calculate and build
      //given date (local time zone ) to UTC format , we will send equivalent UTC time to server
      //
      console.log(pair[1]);
      const buidDateStringUTC = pair[1] + ", 23:59:59";
      const localTime = new Date(buidDateStringUTC); // assuming the local time is in the format "DD/MM/YYYY, HH:mm:ss"
      const utcString = localTime.toISOString();
      pair[1] = utcString;
      console.log(utcString); // Output: "2023-02-14T18:29:59.000Z"
    }
    jsonObject[pair[0]] = pair[1];
  }
  jsonObject["taskDetailID"] = editTaskFormID.dataset.item;
  jsonObject["subTaskID"] = editTaskWeekID.dataset.item; //This information is stored in Form select(week) button while double click on edit button
  jsonObject["taskID"] = editTaskNameID.dataset.item; //Contains TaskID if week name association required to change or create
  jsonObject["moduleID"] = editTaskDescriptionID.dataset.item; // For CASE-3 module ID is need when a new week is requested by user
  console.log("FormData: " + editTaskFormID.dataset.item);
  var jsonData = JSON.stringify(jsonObject);
  xhr.send(jsonData);
});

//#################################End of Update Task #################################
//#################################DELETE MODULE ######################################

const deleteModuleBtn = document.querySelector("#add-delete-module");
deleteModuleBtn.addEventListener("click", function () {
  console.log("Deleting Module");
  console.log("ModuleInfo: " + this.dataset.item);
  var moduleShortCodeID = this.dataset.item;
  const xhr = new XMLHttpRequest();
  const url = "/task/deletemodule"; // Module delete API
  const data = { moduleShortCodeID: moduleShortCodeID }; // Initialise JSON InputData with moduleCode

  xhr.open("DELETE", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onload = function () {
    if (xhr.status === 200) {
      // Request was successful
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      showAlert("Module removed!", "success");
      setTimeout(reDirectDashboard, 1000); // delay for 2 seconds
    } else {
      // Request failed
      console.error(xhr.statusText);
      showAlert("http connection error!", "failure");
    }
  };

  xhr.onerror = function () {
    // http connection error
    console.error("http connection error");
    showAlert("http connection error!", "failure");
  };

  xhr.send(JSON.stringify(data));
});

//####################################################################################

/**
 * Add task event listner and handler
 */
const addTaskDialogueBox = document.querySelector("#add-task-dialogue-box");

const addTaskBtn = document.querySelector("#add-task-btn");
const cancelAddTaskBtnID = document.getElementById("cancelAddTaskBtnID");
/**
 * Display Modal Add task dialog box
 */
addTaskBtn.addEventListener("click", function () {
  addTaskDialogueBox.style.display = "flex";
});
cancelAddTaskBtnID.addEventListener("click", function () {
  addTaskDialogueBox.style.display = "none";
  location.reload(true); //Reload the page
});

/**
 * Add a task to a module by html form
 *
 */

const taskButtonID = document.getElementById("taskButtonID");
var addTaskFormID = document.getElementById("addTaskFormID");
taskButtonID.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Submitting a new task");
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 201) {
      console.log("Received data:");
      console.log(xhr.responseText);
      /*Sample Response data after Task insertion
                 [{"data":[{"taskID":68,"subTaskID":29,"taskName":"Quiz 2 ","taskDesc":"ioiu","subTaskAssignDate":"2023-02-15T13:15:31.453Z","subTaskDueDate":"2023-02-23T04:59:59.000Z","priorityID":1,"status":0,"taskDetailUUID":"4f4bc06e-f691-4e84-bf4b-2c49894573d2"}],"week":"Week-1","status":true,"IsNewWeek":false,"IsNewWeek"}]
               */
      var data = JSON.parse(this.response);
      // Process the JSON data
      var errorHtml = "";
      var errorCnt = 0;
      var sucessCnt = 0;
      var sucessHtml = "";

      if (data.length > 0) {
        var taskData = data[0].data;
        var IsNewWeek = data[0].IsNewWeek;
        var weekName = data[0].week;
        var taskStatus = data[0].status;
        var IsAlreadyWeekIncomplete = data[0].IsAlreadyWeekIncomplete;
        var percentage = data[0].percentage;

        if (taskStatus == false) {
          //Task Insertion has failed
        } else {
          //Update Task GUI
          insertNewTaskGUI(
            taskData,
            IsNewWeek,
            IsAlreadyWeekIncomplete,
            weekName,
            taskStatus
          );
          updateGUIPercentage(percentage);
        }
      }
    }
  };

  xhr.open("POST", "/task/addtask");
  xhr.setRequestHeader("Content-Type", "application/json");

  var formData = new FormData(addTaskFormID);
  var jsonObject = {};

  for (var pair of formData.entries()) {
    if (pair[0] === "dueDate") {
      //Calculate and build
      //given date (local time zone ) to UTC format , we will send equivalent UTC time to server

      const buidDateStringUTC = pair[1] + ", 23:59:59";
      const localTime = new Date(buidDateStringUTC); // assuming the local time is in the format "DD/MM/YYYY, HH:mm:ss"
      const utcString = localTime.toISOString();
      pair[1] = utcString;
    }
    jsonObject[pair[0]] = pair[1];
  }
  jsonObject["moduleShortCode"] = addTaskFormID.dataset.item;
  console.log("FormData: " + addTaskFormID.dataset.item);
  var jsonData = JSON.stringify(jsonObject);

  xhr.send(jsonData);
});

var taskName = document.getElementById("taskName");
var taskDueDate = document.getElementById("taskDueDate");

function validateForm() {
  var isValidTaskName = taskName.value.trim();
  var isValidTaskDueDate = taskDueDate.value.trim();

  if (!isValidTaskName || !isValidTaskDueDate) {
    taskButtonID.disabled = true;
  } else {
    taskButtonID.disabled = false;
  }
}
taskName.addEventListener("input", validateForm);
taskDueDate.addEventListener("input", validateForm);

function validateDueDate() {
  const utcTimestamp = "2023-02-19T04:59:59.000Z"; //Example  Due date stored in DB
  const epochDueDateTime = new Date(utcTimestamp).getTime();

  console.log(epochDueDateTime); // Output: 1674245999000

  const currentTime = new Date();
  const epochUserTime = currentTime.getTime();

  console.log(epochUserTime); // Local browser current time in epoch time

  if (epochUserTime > epochDueDateTime) {
    //Task is over due
  } else {
    //Task is before due date
  }
}

/**
 * Function updateGUIPercentage
 * @param {*} percentage
 */
function updateGUIPercentage(percentage) {
  percentageGraphID.style.width = percentage + "%";
  percentageValueID.textContent = percentage + "%";
}
/**
 * Function insertNewTaskGUI
 * @param {*} taskData
 * @param {*} IsNewWeek
 * @param {*} weekName
 * @param {*} taskStatus
 */
function insertNewTaskGUI(
  taskData,
  IsNewWeek,
  IsAlreadyWeekIncomplete,
  weekName,
  taskStatus
) {
  console.log("Inside Function:");
  console.log(taskData);
  console.log(IsNewWeek);

  if (taskStatus == true) {
    //Task Insertion has failed
    //Update Task GUI
    if (IsNewWeek == true || IsAlreadyWeekIncomplete == false) {
      //Child div needs to be create under element ID "WeekContainerID"
      newHtmlStr = `<div id="{weekName}" class="flex-task-list-container  task-bg-color"> <!--RED BOX-->
                                       <!-- PER SUBTASK-->
                                       <div class="flex-week-container"> <!--WEEK INFO CONTAINER-->
                                               <p>{weekName}</p>
                                       </div>
                           </div>`;
      let div = document.createElement("div");
      div.classList.add("flex-task-list-container");
      div.classList.add("task-bg-color");
      div.id = weekName;
      let containerDiv = document.getElementById("WeekContainerID");
      containerDiv.appendChild(div);

      var newHtmlStr = `                          <div class="flex-week-container"> <!--WEEK INFO CONTAINER-->
                                                                         <p>${weekName}</p>
                                                           </div>`;

      div.insertAdjacentHTML("beforeend", newHtmlStr);
    }
    //Insert child div under elementID  IsNewWeek
    let duedateLocal = convertUTCtoLocal(taskData[0].subTaskDueDate);
    let divWeekInfo = document.createElement("div");
    divWeekInfo.classList.add("flex-list-items-container");
    let priorityFlag = taskData[0].priorityID;
    var flagName = "white.png";
    if (priorityFlag == 1) {
      flagName = "red.png";
    }
    if (priorityFlag == 2) {
      flagName = "blue.png";
    }
    let containerDiv = document.getElementById(weekName);
    containerDiv.appendChild(divWeekInfo);
    var htmlStr = `                                             <div class="flex-each-list-items-container"> <!--Container for each row from list-->        
                                                                            <div class="flex-list-item-icon" title="Click here to delete this task"> <!--Column Item-1 delete icon-->
                                                                                <a herf="#">
                                                                                    <img class="flex-list-item-delete-img" src="../images/delete.png" alt="delete icon" data-item="${taskData[0].taskDetailID}">
                                                                                </a>
                                                                            </div>
                                                                            <div class="flex-list-item-icon" title="Click here to edit this task"><!--Column Item-2 edit icon-->
                                                                                <a herf="#">
                                                                                    <img class="flex-list-item-edit-img" src="../images/edit.png" alt="Edit Icon" data-item="${taskData[0].taskDetailID}">
                                                                                </a>
                                                                            </div>
                                                                            <div class="flex-list-item-icon"><!--Column Item 3 Priority icon-->
                                                                                
                                                                                    <img class="flex-list-item-priority-img" src="../images/${flagName}" alt="priority flag" data-item="${taskData[0].taskDetailID}">
                                                                                
                                                                            </div>
                                                                            <div class="flex-list-item-icon"><!--Column Item 4 Place holder-->
                                                                                <div  class="flex-list-item-placeholder" data-item="${taskData[0].taskDetailID}" title="Click here to completion of this task" ></div>
                                                                            </div>
                                                                            <div class="flex-list-item-text"><!--Column Item 5 Task description, duedate etc-->
                                                                                <div class="flex-list-item-taskDetails"> <!--Task descriptions-->
                                                                                    <p id="task-details-descr-${taskData[0].taskDetailID}" class="flex-list-item-task-details-descr"> ${taskData[0].taskName} (${taskData[0].taskDesc})</p>
                                                                                </div>
                                                                                <div class="flex-list-item-taskDetails"> <!--task Due date-->
                                                                                    <p class="flex-list-item-task-due-date" data-item="${taskData[0].taskDetailID}"> Due date:${duedateLocal}</p>
                                                                                </div>
                                                                            </div>
                                                                    </div>`;
    divWeekInfo.insertAdjacentHTML("beforeend", htmlStr);
  }
}

/**
 * Code To change or verify Completion state
 */
const completionStateDiv = document.querySelectorAll(
  ".flex-list-item-placeholder"
);

completionStateDiv.forEach(function (completionStateDivID) {
  completionStateDivID.addEventListener("click", function () {
    console.log("Changing Completion State");
    const backgroundColor = window
      .getComputedStyle(completionStateDivID)
      .getPropertyValue("background-color");
    console.log(hexColor(backgroundColor));
    if (hexColor(backgroundColor) === "008000") {
      console.log("Task is already 100% completed");
    } else {
      var dataItemValue = completionStateDivID.getAttribute("data-item");
      console.log(dataItemValue);
      postCompleteTask(dataItemValue);
    }

    completionStateDivID.style.backgroundColor = "green";
  });
});

/**
 * Function convertUTCtoLocal
 * @param {*} utcDateTime , Probably due date which always stored in UTC
 * @returns  Converted UTC duedate to local time duedate
 */
function convertUTCtoLocal(utcDateTime) {
  // Create a new Date object  given input utcDateTime
  var utcDate = new Date(utcDateTime);

  const retDateTimStr = utcDate.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  return retDateTimStr;
}

window.addEventListener("load", (event) => {
  // Get all the elements with the class name 'flex-list-item-task-due-date'
  const dueDateElements = document.getElementsByClassName(
    "flex-list-item-task-due-date"
  );
  console.log("Intitail Processing After Page Load:");
  var listOdDueDate = [];
  var IsFoundOverDue = false;
  // Loop through each element and modify its innerHTML property
  for (let i = 0; i < dueDateElements.length; i++) {
    //dueDateElements[i].innerHTML = 'New due date: June 30, 2023';
    //date_string = input_string.split('Due Date:')[1]
    //console.log(dueDateElements[i].innerHTML);
    var dateStr = dueDateElements[i].innerHTML;
    //console.log(dateStr.split('ate:'));
    var dateUTCStr = dateStr.split("ate:")[1];
    //console.log("Date needs to convert:'" + dateUTCStr +"'");
    var dateLocalStr = convertUTCtoLocal(dateUTCStr);
    dueDateElements[i].innerHTML = "Due Date:" + dateLocalStr;
    var dataItemValue = dueDateElements[i].getAttribute("data-item");
    console.log(dataItemValue);

    var dueDateDescElementIDStr = "task-details-descr-" + dataItemValue;
    IsFoundOverDue = true;

    if (isOverDue(dateUTCStr)) {
      listOdDueDate.push(dueDateDescElementIDStr);
    }
  }
  if (IsFoundOverDue) {
    if (dueDateDescElementIDStr.length > 0) {
      //clearDueDateGUIEntries();
      updateTaskDuedateGUI(listOdDueDate);
    }
  }
});

function isOverDue(utcDateStr) {
  // Create a Date object from UTC date TimeString e.g utcDateStr='2023-02-24T04:59:59.000Z'
  const datevalue = new Date(utcDateStr);

  // Get the epoch time value in seconds
  const epochTimeValue = datevalue.getTime() / 1000;
  const epochBrowserTime = new Date().getTime() / 1000;
  console.log(
    "FromDB:" + epochTimeValue + "  Browser Time:" + epochBrowserTime
  );
  if (epochBrowserTime > epochTimeValue) {
    return true;
  } else {
    return false;
  }
}
function updateTaskDuedateGUI(listOdDueDate) {
  clearDueDateGUIEntries();
  //<div class="flex-each-comp-due-list-items-container "> <!--Container for each row from list--></div>
  if (listOdDueDate.length > 0) {
    let div = document.createElement("div");
    div.classList.add("flex-list-items-comp-due-container");
    let containerDiv = document.getElementById("dueDateParentContainerID");
    containerDiv.appendChild(div);
    for (i = 0; i < listOdDueDate.length; i++) {
      let timpID = document.getElementById(listOdDueDate[i]);
      var moduleDesc = timpID.innerHTML;

      let html = `                                                  <div class="flex-each-comp-due-list-items-container"> <!--Container for each row from list-->
                                                                                    <div class="flex-list-item-icon"><!--Column Item 4 Place holder-->
                                                                                        <div class="flex-list-item-overdue-placeholder">
                                                                                        <div class="flex-list-item-icon"><!--Tick mark icon-->
                                                                                            <img class="flex-list-item-priority-img" src="../images/tick.png" alt="priority flag" data-item="taskDetailID-Flag">
                                                                                        </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="flex-list-item-text"><!--Column Item 5 Task description, duedate etc-->
                                                                                            <div class="flex-list-item-comp-due"> <!--Task descriptions-->
                                                                                                    <p class="flex-list-item-task-details-descr">${moduleDesc}</p>
                                                                                            </div>
                                                                                        
                                                                                    </div>
                                                                            </div>`;

      div.insertAdjacentHTML("beforeend", html);
    }
  }
}
function clearDueDateGUIEntries() {
  // Find parent div element
  const dueDateContainerID = document.getElementById(
    "dueDateParentContainerID"
  );

  // Remove all child div elements
  while (dueDateContainerID.firstChild) {
    dueDateContainerID.removeChild(dueDateContainerID.firstChild);
  }
}

function postCompleteTask(taskDetailID) {
  // Prepare Update to complete this task
  let dateOfCompletion = new Date().toISOString();
  let moduleShortCodeIDStr = moduleShortCodeID.dataset.item;

  var data = {
    taskDetailID: taskDetailID,
    subTaskCompletionDate: dateOfCompletion,
    status: 100,
    moduleShortCode: moduleShortCodeIDStr,
  };

  // Prepare XMLHttpRequest object
  var xhr = new XMLHttpRequest();
  // Target URL
  xhr.open("PUT", "/task/complete");

  // Set the Content-Type header for JSON data
  xhr.setRequestHeader("Content-Type", "application/json");

  // Callback function  for response handler
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log("Received data:");
      console.log(xhr.responseText);
      var data = JSON.parse(this.response);
      if (data.length > 0) {
        var percentage = data[0].percentage;
        var taskStatus = data[0].status;

        if (taskStatus == false) {
          //update for completion has failed
        } else {
          updateGUIPercentage(percentage);
        }
      }
    } else {
      console.log("Error updating message");
    }
  };

  //Send data to doitApp server
  xhr.send(JSON.stringify(data));
}

// Reload the page when user Insert or Update a task
//Try to keep open the edit or insert modal
function reloadTaskPage() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      // Reopen the Modal we may keep last open details to make it real]
      //End of Modal refresh
    }
  };
  xmlhttp.open("GET", window.location.href, true);
  xmlhttp.send();
}
