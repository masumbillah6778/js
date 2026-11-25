// TV remote support for the existing audio/video player.
      (function () {
        const player = document.querySelector(".player video");
        if (!player) return;

        // Make the existing player reachable by the TV remote without changing its design.
        player.setAttribute("tabindex", "0");
        player.setAttribute("aria-label", "গান চালানো ও নিয়ন্ত্রণ");
        player.addEventListener("click", function () {
          player.focus();
        });

        function isPlayerFocused() {
          const active = document.activeElement;
          return active === player || (active && player.contains(active));
        }

        document.addEventListener("keydown", function (event) {
          const key = event.key;
          const code = event.keyCode;
          const mediaKey = [
            "MediaPlayPause", "MediaPlay", "MediaPause",
            "MediaStop", "MediaTrackNext", "MediaTrackPrevious"
          ].includes(key);

          // Media keys should work even if focus has moved elsewhere.
          if (mediaKey) {
            event.preventDefault();
            if (key === "MediaPlay" ) player.play().catch(function () {});
            else if (key === "MediaPause" || key === "MediaStop") player.pause();
            else if (key === "MediaPlayPause") {
              if (player.paused) player.play().catch(function () {});
              else player.pause();
            }
            return;
          }

          // D-pad/OK controls act on the player while it is focused.
          if (!isPlayerFocused()) return;

          if (key === "Enter" || key === " " || code === 13 || code === 23) {
            event.preventDefault();
            if (player.paused) player.play().catch(function () {});
            else player.pause();
          } else if (key === "ArrowLeft" || code === 21) {
            event.preventDefault();
            player.currentTime = Math.max(0, player.currentTime - 10);
          } else if (key === "ArrowRight" || code === 22) {
            event.preventDefault();
            if (Number.isFinite(player.duration)) {
              player.currentTime = Math.min(player.duration, player.currentTime + 10);
            }
          } else if (key === "ArrowUp" || code === 19) {
            event.preventDefault();
            player.volume = Math.min(1, player.volume + 0.1);
            player.muted = false;
          } else if (key === "ArrowDown" || code === 20) {
            event.preventDefault();
            player.volume = Math.max(0, player.volume - 0.1);
          }
        });

        // Start remote navigation at the player when the page is opened.
        window.addEventListener("load", function () {
          player.focus({ preventScroll: true });
        });
      })();


      // TV remote / browser Back key: return to the previous page.
      document.addEventListener("keydown", function (event) {
        const backKeys = ["Escape", "Backspace", "BrowserBack", "GoBack"];
        if (backKeys.includes(event.key) || event.keyCode === 4 || event.keyCode === 10009) {
          event.preventDefault();
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = "index.html";
          }
        }
      });
