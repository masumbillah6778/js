// Converting string to required date format 


// To call defined fuction every second
let x = setInterval(function () {
  
  // Getting current time in required format
  let now = new Date().getTime();
  
  // Calculating the difference
  let t = deadline - now;
  
  // Getting value of days, hours, minutes, seconds
  let hours = Math.floor(
    (t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor(
    (t % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor(
    (t % (1000 * 60)) / 1000);
  
  // Output the remaining time
  document.getElementById("sehari").innerHTML =
    hours + "h " + 
    minutes + "m " +
    seconds + "s ";
  
  // Output for over time
  if (t < 0) {
    clearInterval(x);
    document.getElementById("sehari")
      .innerHTML = "সময় শেষ";
  }
}, 1000);