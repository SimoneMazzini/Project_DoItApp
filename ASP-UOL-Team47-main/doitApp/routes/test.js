
var  totalPercentageAfter=100;
var totalPercentageBefore=40;
console.log("Before Val:" + totalPercentageBefore );
console.log("After Val:" + totalPercentageAfter);

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
     console.log("Total Point:" + (factorVal*10));


}
var taskDetails=[];
var earnDate="10/10/2023";
var totalPointToBeAdd=0;
var maxPointEarnedYet=100;
var epochDate=1111;
var moduleID=10;
var UUID="jhd";



taskDetails.push({userID:10,taskDetailID:11});
var sqlStrAddPoint="INSERT INTO TASKDETAILS (userID,taskID,earnPoint,earnDate,totalEarnPoint,epochDate,moduleID,UUID) VALUES ( " +
taskDetails[0].userID  +", " +
taskDetails[0].taskDetailID  +", " +
totalPointToBeAdd  +" , '" +
                 earnDate  +"' , " +
                 maxPointEarnedYet  +" , " +
                 epochDate  +" ," +
                 moduleID  +" , '" +    
                   UUID  +"' )"
console.log(sqlStrAddPoint);