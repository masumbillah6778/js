let currentTrack = 0;
let isShuffleEnabled = false;

const audio = new Audio();

$(document).ready(function () {
  const playlist = [
    {
      name: "অডিওটি শুধুমাত্র একবার শুনতে পারবেন",
      artist: "One Time Audio",
      src: "https://masumbillah6778bd.github.io/bangladesh-mix-music/biye-kora-mane.mp3"
    }
  ];

  let currentTrack = 0;
  let audio = new Audio(playlist[currentTrack].src);
  let isShuffle = false;

  const updateSongDetails = () => {
    const song = playlist[currentTrack];

    // Update UI text
    $(".song-name").text(song.name);
    $(".artist-name").text(song.artist);

    // Scroll animation for long names
    if (song.name.split(" ").length > 5 || song.name.length > 30) {
      $(".song-name").addClass("scroll");
    } else {
      $(".song-name").removeClass("scroll");
    }

    // Only update src if it's a new track (prevent reset)
    if (!audio.src.includes(song.src)) {
      audio.src = song.src;
      audio.load(); // only when new track
    }

    // If you’re using manual cover art:
    if (song.cover) {
      $(".album").css(
        "background-image",
        `linear-gradient(rgba(54, 79, 60, 0.25), rgba(73, 101, 77, 0.55)), url('${song.cover}')`
      );
    }
  };

  const playTrack = () => {
    updateSongDetails();
    audio.play();
    $(".play").hide();
    $(".pause").show();
  };

  $(".pause").hide();
  updateSongDetails();

  $(".thunderbolt").click(() => $(".thunderbolt").toggleClass("clicked"));

  $(".shuffle").on("click", function () {
    $(this).toggleClass("clicked");
    isShuffleEnabled = $(this).hasClass("clicked");
  });

  $("#player").hover(() => $(".info").toggleClass("up"));

  $(".play").click(() => playTrack());

  $(".pause").click(() => {
    audio.pause();
    $(".play").show();
    $(".pause").hide();
  });

  $(".next").click(() => {
    currentTrack = isShuffle
      ? Math.floor(Math.random() * playlist.length)
      : (currentTrack + 1) % playlist.length;
    playTrack();
  });

  function shuffleTrack() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * playlist.length);
    } while (randomIndex === currentTrack); // avoid current repeat

    currentTrack = randomIndex;
    updateSongDetails();
    audio.play();
    $(".play").hide();
    $(".pause").show();
  }

  $(".previous").click(() => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack();
  });

  //Automatic track behavior
  window.addEventListener("load", () => {
    if (playlist.length > 0) {
      // Pick a random track
      currentTrack = Math.floor(Math.random() * playlist.length);
      const song = playlist[currentTrack];

      // Set up audio
      audio.src = song.src;

      // Update UI
      $(".song-name").text(song.name);
      $(".artist-name").text(song.artist);

      //Name's too long
      //Too long name of a song

      function applyScrollingTitle() {
        const $song = $(".song-name");
        const songText = $song.text();
        const wordCount = songText.trim().split(/\s+/).length;

        if (wordCount >= 20) {
          $song.addClass("scroll-song-name");
        } else {
          $song.removeClass("scroll-song-name");
        }
      }

      applyScrollingTitle();

      // Attempt autoplay
      audio
        .play()
        .then(() => {
          $(".play").hide();
          $(".pause").show();
        })
        .catch((err) => {
          console.warn("Autoplay failed due to browser policy:", err);

          // Fallback: wait for user interaction
          $(document).one("click", () => {
            audio.play();
            $(".play").hide();
            $(".pause").show();
          });
        });
    }
  });

  // Progress bar
  // Time formatting helper
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  // Update progress bar
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      $(".fill").css("width", `${percent}%`);
      $(".time--current").text(formatTime(audio.currentTime));
      $(".time--total").text(
        `-${formatTime(audio.duration - audio.currentTime)}`
      );
    }
  });

  //Scrubber functionality
  let isScrubbing = false;
  let scrubPreviewTime = 0;

  const progressBar = $(".progress-bar");
  const fillBar = $(".fill");

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  // On mousedown: start scrubbing
  progressBar.on("mousedown", function (e) {
    isScrubbing = true;
    updateScrubPreview(e); // initial preview
  });

  // While moving: show fill and preview time (only visual)
  $(document).on("mousemove", function (e) {
    if (isScrubbing) {
      updateScrubPreview(e);
    }
  });

  // On mouseup: commit the seek
  $(document).on("mouseup", function () {
    if (isScrubbing && audio.duration) {
      audio.currentTime = scrubPreviewTime;
    }
    isScrubbing = false;
  });

  // Update the preview fill and time
  function updateScrubPreview(e) {
    const offset = progressBar.offset();
    const width = progressBar.width();
    const x = e.pageX - offset.left;
    const percent = Math.max(0, Math.min(1, x / width));
    scrubPreviewTime = percent * audio.duration;

    fillBar.css("width", `${percent * 100}%`);
    $(".time--current").text(formatTime(scrubPreviewTime));
    $(".time--total").text(`-${formatTime(audio.duration - scrubPreviewTime)}`);
  }

  // Keep progress bar updated in real-time when not scrubbing
  audio.addEventListener("timeupdate", () => {
    if (!isScrubbing && audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      fillBar.css("width", `${percent}%`);
      $(".time--current").text(formatTime(audio.currentTime));
      $(".time--total").text(
        `-${formatTime(audio.duration - audio.currentTime)}`
      );
    }
  });
  // Time formatting helper
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  // Volume scrubbing
  $(".volume-slider").on("input change", function () {
    const value = parseFloat($(this).val());
    audio.volume = value;

    const icon = $(".volume i");

    if (value === 0) {
      icon.removeClass().addClass("fas fa-volume-mute");
    } else if (value < 0.5) {
      icon.removeClass().addClass("fas fa-volume-down");
    } else {
      icon.removeClass().addClass("fas fa-volume-up");
    }
  });

  // Toggle volume slider when clicking the icon
  $(".volume i").on("click", function (e) {
    e.stopPropagation(); // prevent bubbling
    $(".volume").toggleClass("active");
  });

  // Hide slider if click outside
  $(document).on("click", function () {
    $(".volume").removeClass("active");
  });

  //Options
  let optionsTimeout;

  $(".option").click(function () {
    const panel = $(".options-panel");

    panel.stop(true, true).slideDown(100);

    clearTimeout(optionsTimeout);
    optionsTimeout = setTimeout(() => {
      panel.slideUp(300);
    }, 5000); // hides after 5s of no interaction
  });

  //Populates Songs Scalable
  playlist.forEach((song, index) => {
    $(".song-list").append(
      `<li data-index="${index}">${song.name} - ${song.artist}</li>`
    );
  });

  $(".song-list").on("click", "li", function () {
    currentTrack = parseInt($(this).data("index"));
    updateSongDetails();
    playTrack();
  });

  // Seek functionality: clicking progress bar
  $(".progress-bar").click(function (e) {
    const offset = $(this).offset();
    const width = $(this).width();
    const clickX = e.pageX - offset.left;
    const percent = clickX / width;
    audio.currentTime = percent * audio.duration;
  });

  $(".fill").css("width", "0%");
  $(".time--current").text("0:00");
  $(".time--total").text("-0:00");

  // Playlist View Toggle (Options Button)
  // let playlistVisible = false;
  // let hideTimer;

  // $('.option').click(() => {
  //   if (!playlistVisible) {
  //     let listHtml = '<ul>';
  //     playlist.forEach((song, i) => {
  //       listHtml += `<li data-index="${i}">${song.name}</li>`;
  //     });
  //     listHtml += '</ul>';

  //     const $list = $('<div class="playlist-popup"></div>').html(listHtml);
  //     $('#player').append($list);
  //     $list.slideDown(200);
  //     playlistVisible = true;

  //     // Handle click on song
  //     $('.playlist-popup li').click(function () {
  //       currentTrack = parseInt($(this).attr('data-index'));
  //       playTrack();
  //       $('.playlist-popup').slideUp(() => $(this).remove());
  //       playlistVisible = false;
  //     });

  //     // Auto-hide on mouseleave after 2 seconds
  //     $('.playlist-popup')
  //       .on('mouseleave', function () {
  //         hideTimer = setTimeout(() => {
  //           $(this).slideUp(200, () => $(this).remove());
  //           playlistVisible = false;
  //         }, 2000); // 2 seconds delay
  //       })
  //       .on('mouseenter', function () {
  //         clearTimeout(hideTimer); // Cancel auto-hide if hovered back in
  //       });

  //   } else {
  //     $('.playlist-popup').slideUp(200, function () {
  //       $(this).remove();
  //       playlistVisible = false;
  //     });
  //   }
  // });

  // Local File Uploader
  const $fileInput = $(
    '<input type="file" accept="audio/*" multiple style="display:none">'
  );
  $("body").append($fileInput);

  $(".add").click(() => $fileInput.click());

  $fileInput.on("change", (e) => {
    const files = e.target.files;
    for (let file of files) {
      const url = URL.createObjectURL(file);
      playlist.push({
        name: file.name,
        artist: "Local",
        src: url
      });
    }
    alert(`${files.length} local file(s) added.`);
  });

  $(window).on("beforeunload", () => audio.pause());
});

// Close popup when clicking outside
$(document).mouseup(function (e) {
  const $popup = $(".playlist-popup");
  if (!$popup.is(e.target) && $popup.has(e.target).length === 0) {
    $popup.slideUp(200, function () {
      $popup.remove();
    });
    playlistVisible = false;
  }
});

//Equalizer animation
const playTrack = () => {
  audio.play();
  $(".play").hide();
  $(".pause").show();
  $(".equalizer").removeClass("paused"); // 🎵 Enable animation
};

const pauseTrack = () => {
  audio.pause();
  $(".play").show();
  $(".pause").hide();
  $(".equalizer").addClass("paused");
};

//Continuous playing
// When current song ends
audio.addEventListener("ended", () => {
  if (isShuffleEnabled) {
    let nextTrack;
    do {
      nextTrack = Math.floor(Math.random() * playlist.length);
    } while (nextTrack === currentTrack && playlist.length > 1);
    currentTrack = nextTrack;
  } else {
    // Move to next track in sequence, loop to start if at end
    currentTrack = (currentTrack + 1) % playlist.length;
  }

  updateSongDetails(); // update the UI and audio.src
  playTrack(); // play the next song
});

audio.addEventListener("ended", () => {
  if (isShuffleEnabled) {
    let nextTrack;
    do {
      nextTrack = Math.floor(Math.random() * playlist.length);
    } while (nextTrack === currentTrack && playlist.length > 1);
    currentTrack = nextTrack;
  } else {
    currentTrack = (currentTrack + 1) % playlist.length;
  }

  updateSongDetails();
  playTrack();
});

//Spacebar to toggle play/pause
document.addEventListener("keydown", function (e) {
  // Prevent spacebar scrolling the page
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();

    if (audio.paused) {
      audio.play();
      $(".play").hide();
      $(".pause").show();
    } else {
      audio.pause();
      $(".play").show();
      $(".pause").hide();
    }
  }
});

//Scrubber knob
const updateProgressBar = () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  $(".fill").css("width", `${percent}%`);
  $(".thumb").css("left", `${percent}%`);
};

audio.addEventListener("timeupdate", updateProgressBar);

$(".progress-bar").on("click", function (e) {
  const barWidth = $(this).width();
  const clickX = e.offsetX;
  const newTime = (clickX / barWidth) * audio.duration;
  audio.currentTime = newTime;
});
