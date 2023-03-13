const addModuleBtn = document.querySelector("#add-module-btn");
const cancelModuleBtn = document.querySelector("#cancelAdd");
const addCourseModuleBtn = document.querySelector("#addCourseModule");
const addModuleDialogueBox = document.querySelector("#add-module-dialogue-box");
const errorMsgElement = document.getElementById("errorMsg");
const successMsgElement = document.getElementById("successMsg");
const rightArrowBtnID = document.querySelector("#rightArrowBtn");
const leftArrowBtnID = document.querySelector("#leftArrowBtn");
const moduleCardBox = document.querySelector("#moduleCardBox");

/*DISBLE AND ENABLE OF MODULE BOX SCROLL HAS NOT BEEN IMPLEMENTED YET */
var leftBackgroundColor = window
  .getComputedStyle(leftArrowBtnID)
  .getPropertyValue("border-right");
var rightBackgroundColor = window
  .getComputedStyle(rightArrowBtnID)
  .getPropertyValue("border-right");

rightArrowBtnID.addEventListener("click", function () {
  moduleCardBox.scrollLeft += 200;
});

leftArrowBtnID.addEventListener("click", function () {
  moduleCardBox.scrollLeft -= 200;
});

addModuleBtn.addEventListener("click", function () {
  addModuleDialogueBox.style.display = "flex";
});

addModuleDialogueBox.addEventListener("click", function (event) {
  if (event.target === addModuleDialogueBox) {
    addModuleDialogueBox.style.display = "none";
  }
});
cancelModuleBtn.addEventListener("click", function (event) {
  addModuleDialogueBox.style.display = "none";
  location.reload(true); //on successful case
});

const moduleBoxes = document.querySelectorAll(".module-name-box");

/**
 * Add event listener to module button
 */
moduleBoxes.forEach((moduleBoxe) => {
  moduleBoxe.addEventListener("click", function () {
    this.classList.toggle("module-name-box-selected");
    ifUserSelectedModule();
    resetResposeStatusMsg();
  });
});

function hexColor(color) {
  color = color.replace(/[^\d,]/g, "").split(",");
  return (
    "" +
    color
      .slice(0, 3)
      .map((x) => ("0" + parseInt(x).toString(16)).slice(-2))
      .join("")
  );
}
/**
 * ADD MODULE AJAX REST request to assign module to the user
 *
 */
addCourseModuleBtn.addEventListener("click", function (event) {
  const addModuleUrl = window.location.href + "/addmodule";
  console.log("AddModule URL: " + addModuleUrl);
  const boxes = document.querySelectorAll(".module-name-box");
  var jsonData = [];
  for (var i = 0; i < boxes.length; i++) {
    box = boxes[i];

    const backgroundColor = window
      .getComputedStyle(box)
      .getPropertyValue("background-color");
    if (hexColor(backgroundColor) === "778899") {
      //User has selected these modules
      box.style.backgroundColor = "green";
      console.log(box.dataset.item);
      jsonData.push({ moduleName: box.dataset.item });
    }
  }
  console.log(jsonData);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", addModuleUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 201) {
      // REST API callback for a success response from doitApp backend
      var data = JSON.parse(this.response);
      // Process the JSON data
      var errorHtml = "";
      var errorCnt = 0;
      var sucessCnt = 0;
      var sucessHtml = "";
      data.forEach((item) => {
        let retMsg = `Module Name: ${item.moduleName}, Status: ${item.status}`;
        if (item.status == false) {
          errorCnt++;
          errorHtml = errorHtml + item.moduleName + " ";
        } else {
          sucessCnt++;
          sucessHtml = sucessHtml + item.moduleName + " ";
        }
      });
      sucessHtml =
        "Total [" + sucessCnt + "] successfully added: " + sucessHtml;
      errorHtml = "Total [" + errorCnt + "] failed: " + errorHtml;
      console.log(this.responseText);
      //addModuleResponseStatus();
      errorMsgElement.innerHTML = errorHtml;
      successMsgElement.innerHTML = sucessHtml;
      ifUserSelectedModule();
    }
  };
  xhr.send(JSON.stringify(jsonData));
});

function resetResposeStatusMsg() {
  errorMsgElement.innerHTML = "";
  successMsgElement.innerHTML = "";
}

function ifUserSelectedModule() {
  const boxes = document.querySelectorAll(".module-name-box");
  var count = 0;
  for (var i = 0; i < boxes.length; i++) {
    box = boxes[i];

    const backgroundColor = window
      .getComputedStyle(box)
      .getPropertyValue("background-color");
    if (hexColor(backgroundColor) === "778899") {
      //User has selected these modules
      count++;
    }
  }
  if (count > 0) {
    enableButton();
  } else {
    disableButton();
  }
}
function enableButton() {
  addCourseModuleBtn.classList.remove("command-button-disabled");
  addCourseModuleBtn.classList.add("command-button-enable");
  addCourseModuleBtn.removeAttribute("disabled");
}

function disableButton() {
  addCourseModuleBtn.classList.remove("command-button-enable");
  addCourseModuleBtn.classList.add("command-button-disabled");
  addCourseModuleBtn.setAttribute("disabled", true);
}
