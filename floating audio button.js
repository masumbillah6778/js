    var clicked_id;
    var audio_var = new Audio();
    
    
    $('.ppbutton').on("click",function(){
      var datasrc = $(this).attr('data-src');
      clicked_id= $(this).attr('id');
      console.log(clicked_id);
      audio_var.pause();
      
      $('.ppbutton').not(this).each(function(){
          $(this).removeClass('fa-pause');
           $(this).addClass('fa-play');
      });
      
      if($(this).hasClass('fa-play')){
         console.log('play_click');
         audio_var.src=datasrc;
         $(this).removeClass('fa-play');
         $(this).addClass('fa-pause');
         console.log(audio_var);
         audio_var.play();
       } else {
         console.log('pause_click');
         $(this).removeClass('fa-pause');
         $(this).addClass('fa-play');
         console.log(audio_var);
         audio_var.pause();
         //audio_var.src='';
         //audio_var.load();
         console.log(audio_var);
       }
    
      
    });
    
      audio_var.onended = function() {
         $("#"+clicked_id).removeClass('fa-pause');
         $("#"+clicked_id).addClass('fa-play');
      };
      
      
      
      
      
      
      
      
      
    //JS
    function play(sound){
        var audio = document.getElementById("audio");
        audio.setAttribute('src', sound);
        audio.play();
    }
