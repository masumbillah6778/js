function updateTimer() {
// yyyy-MM-dd HH:mm:ss
  
  now     = new Date();
  diff    = now - past;
  
  years  = Math.floor( diff / (1000*60*60*24*30*12) );
  months = Math.floor( diff / (1000*60*60*24*30) );
  days   = Math.floor( diff / (1000*60*60*24) );
  hours  = Math.floor( diff / (1000*60*60) );
  mins   = Math.floor( diff / (1000*60) );
  secs   = Math.floor( diff / 1000 );

  y = years;
  M = months - years  * 12;
  d = days   - months * 30;
  h = hours  - days   * 24;
  m = mins   - hours  * 60;
  s = secs   - mins   * 60;
  document.getElementById("timer")
    .innerHTML =
      '<div>' + y + '<span> বছর </span></div>' +
      '<div>' + M + '<span> মাস </span></div>' +
      '<div>' + d + '<span> দিন </span></div>' +
      '<div>' + h + '<span> ঘন্টা </span></div>' +
      '<div>' + m + '<span> মিনিট </span></div>' +
      '<div>' + s + '<span> সেকেন্ড </span></div>' ;
}
setInterval('updateTimer()', 1000 );
