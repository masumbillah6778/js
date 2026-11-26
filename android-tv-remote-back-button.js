    /*-- ==================================================
         TV REMOTE BACK BUTTON
         ================================================== --*/


      document.addEventListener("keydown", function (event) {

        const backKeys = [

          "Escape",
          "Backspace",
          "BrowserBack",
          "GoBack"

        ];


        if (

          backKeys.includes(event.key) ||

          event.keyCode === 4 ||

          event.keyCode === 10009

        ) {

          event.preventDefault();


          if (window.history.length > 1) {

            window.history.back();

          }

          else {

            window.location.href = "index.html";

          }

        }

      });
