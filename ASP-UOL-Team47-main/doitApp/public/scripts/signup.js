const email=document.getElementById("signUpEmail");
const username=document.getElementById("signUpUserName");
const password=document.getElementById("signUpPassword");
const repassword=document.getElementById("signUpRPassword");
const form = document.getElementById("signUpForm");
const errFormMsgElement = document.getElementById("signUpErrMsg");

form.addEventListener('submit' , (e) =>{
    let errMsgList =[];
    if(!(password.value ===repassword.value)){
        errMsgList.push('Password did not match.');
    }
    if(email.value.length>0)
    {
        if(IsValidEmail(email)==false)
           errMsgList.push('Invalid email id.');
    }

    //There are errors detected during form validation and must not submit to backend
    if(errMsgList.length >0)
    {
        e.preventDefault();
        let errorHtml="";
        for(let i=0; i < errMsgList.length ; i++)
            errorHtml= errorHtml + '<br>' + errMsgList[i] ;
        errFormMsgElement.innerHTML=  errorHtml;
    }
})

function IsValidEmail(emailStr)
{   var retStr=false;
    let validEmailStr= /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
    if(emailStr.value.match(validEmailStr))
        retStr=true;
    return retStr;
}