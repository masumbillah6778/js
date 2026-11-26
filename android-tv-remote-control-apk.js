<!-- ==================================================
         TV REMOTE CONTROL
         Play / Pause + Existing Remote Controls
         ================================================== -->

    <script>

      (function () {

        const player = document.querySelector(".player video");

        if (!player) return;


        /* ------------------------------------------
           Player Focus
           ------------------------------------------ */

        player.setAttribute("tabindex", "0");

        player.setAttribute(
          "aria-label",
          "গান চালানো ও নিয়ন্ত্রণ"
        );


        player.addEventListener("click", function () {

          player.focus();

        });


        function isPlayerFocused() {

          const active = document.activeElement;

          return (
            active === player ||
            (active && player.contains(active))
          );

        }


        /* ------------------------------------------
           Play / Pause
           ------------------------------------------ */

        function togglePlayPause() {

          if (player.paused) {

            const promise = player.play();

            if (promise && typeof promise.catch === "function") {

              promise.catch(function () {});

            }

          } else {

            player.pause();

          }

        }


        /* ------------------------------------------
           Remote Key Detection
           ------------------------------------------ */

        document.addEventListener("keydown", function (event) {

          const key = event.key || "";

          const code = event.code || "";

          const keyCode = event.keyCode || event.which || 0;


          /* ==========================================
             Play / Pause Remote Keys
             ========================================== */

          const isPlayPauseKey = (

            key === "MediaPlayPause" ||

            key === "MediaPlay" ||

            key === "MediaPause" ||

            code === "MediaPlayPause" ||

            code === "MediaPlay" ||

            code === "MediaPause" ||

            keyCode === 85 ||

            keyCode === 179 ||

            keyCode === 126 ||

            keyCode === 127

          );


          /* ==========================================
             Play Button
             ========================================== */

          const isPlayKey = (

            key === "MediaPlay" ||

            code === "MediaPlay" ||

            keyCode === 126

          );


          /* ==========================================
             Pause Button
             ========================================== */

          const isPauseKey = (

            key === "MediaPause" ||

            code === "MediaPause" ||

            keyCode === 127

          );


          /* ------------------------------------------
             Media Play / Pause
             ------------------------------------------ */

          if (isPlayPauseKey) {

            event.preventDefault();

            event.stopPropagation();

            event.stopImmediatePropagation();


            if (isPlayKey) {

              const promise = player.play();

              if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
              }

            }

            else if (isPauseKey) {

              player.pause();

            }

            else {

              togglePlayPause();

            }

            return;

          }


          /* ------------------------------------------
             D-Pad / OK
             ------------------------------------------ */

          if (!isPlayerFocused()) return;


          /* OK / Enter / Select = Play/Pause */

          if (

            key === "Enter" ||

            key === " " ||

            key === "Select" ||

            code === "Enter" ||

            code === "NumpadEnter" ||

            keyCode === 13 ||

            keyCode === 23

          ) {

            event.preventDefault();

            event.stopPropagation();

            togglePlayPause();

          }


          /* ------------------------------------------
             Left = Existing Seek
             ------------------------------------------ */

          else if (

            key === "ArrowLeft" ||

            keyCode === 21

          ) {

            event.preventDefault();

            player.currentTime =
              Math.max(
                0,
                player.currentTime - 10
              );

          }


          /* ------------------------------------------
             Right = Existing Seek
             ------------------------------------------ */

          else if (

            key === "ArrowRight" ||

            keyCode === 22

          ) {

            event.preventDefault();


            if (Number.isFinite(player.duration)) {

              player.currentTime =
                Math.min(
                  player.duration,
                  player.currentTime + 10
                );

            }

          }


          /* ------------------------------------------
             Up = Volume +
             ------------------------------------------ */

          else if (

            key === "ArrowUp" ||

            keyCode === 19

          ) {

            event.preventDefault();

            player.volume =
              Math.min(
                1,
                player.volume + 0.1
              );

            player.muted = false;

          }


          /* ------------------------------------------
             Down = Volume -
             ------------------------------------------ */

          else if (

            key === "ArrowDown" ||

            keyCode === 20

          ) {

            event.preventDefault();

            player.volume =
              Math.max(
                0,
                player.volume - 0.1
              );

          }

        }, true);


        /* ------------------------------------------
           Page Open হলে Player Focus
           ------------------------------------------ */

        window.addEventListener("load", function () {

          setTimeout(function () {

            player.focus({
              preventScroll: true
            });

          }, 300);

        });


      })();
