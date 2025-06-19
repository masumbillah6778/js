let videoList = document.querySelectorAll('.video-list-container .list');

videoList.forEach(iframe =>{
   iframe.onclick = () =>{
      videoList.forEach(remove =>{remove.classList.remove('active')});
      iframe.classList.add('active');
      let src = iframe.querySelector('.list-video').src;
      let title = iframe.querySelector('.list-title').innerHTML;
      document.querySelector('.main-video-container .main-video').src = src;
      document.querySelector('.main-video-container .main-video').play();
      document.querySelector('.main-video-container .main-vid-title').innerHTML = title;
   };
});


let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
