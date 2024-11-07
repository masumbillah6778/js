let expiryDateTime = "31 august 2025 12:00:00";

window.addEventListener('load', function(event){
   countdownTimer(expiryDateTime);
});

function countdownTimer(expiryDateTime){

    var countdownDateTime = new Date(expiryDateTime).getTime();
    
  
var timeInterval = setInterval(function() {

   var currentDateTime = new Date().getTime();  
  
   var remainingDayTime = countdownDateTime - currentDateTime;
 
   var totalDays = Math.floor(remainingDayTime / (1000 * 60 * 60 * 24));
   var totalHours = Math.floor((remainingDayTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
   var totalMinutes = Math.floor((remainingDayTime % (1000 * 60 * 60)) / (1000 * 60));
   var totalSeconds = Math.floor((remainingDayTime % (1000 * 60)) / 1000);
   
   document.getElementById("days").innerHTML = totalDays;
   document.getElementById("hours").innerHTML = totalHours;
   document.getElementById("minutes").innerHTML = totalMinutes;
   document.getElementById("seconds").innerHTML = totalSeconds;
  
    
  
  if (remainingDayTime < 0) {
    clearInterval(timeInterval);
    document.getElementById("countdownTimer").innerHTML = "Deal ended";
   }
  
 }, 1000);

}
