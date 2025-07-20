function initChromecast() {
    if(typeof chrome === undefined) {
      return;
    }
		var loadCastInterval = setInterval(function() {
      if (chrome.cast.isAvailable) {
        clearInterval(loadCastInterval);
        initCastApi();
        buttonEvents();
      } else {
        // not available
      }
	  }, 1000);
}

function initCastApi() {
	cast.framework.CastContext.getInstance().setOptions({
		receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
		autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
	});
}

function connectToSession() {
	return Promise.resolve()
	.then(() => {
		var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
		if (!castSession) {
		return cast.framework.CastContext.getInstance().requestSession()
		.then(() => {
			return Promise.resolve(cast.framework.CastContext.getInstance().getCurrentSession());
		});
		}
		return Promise.resolve(castSession);
	});
}

function buttonEvents() {
  document.querySelector('.js-video').addEventListener('click', function(event) {
    if(event.target.classList.contains('js-cast')) {
      launchApp(); 
    }
    if(event.target.classList.contains('js-play')) {
      togglePlayPause(); 
    }
    if(event.target.classList.contains('js-pause')) {
      togglePlayPause(); 
    }
    if(event.target.classList.contains('js-stop')) {
      stopApp(); 
    }
  });
}

function launchApp() {

	// You could signal an is connecting message here. E.g. Connecting to Chromecast...
  
	return connectToSession()
	.then((session)=> {
		var videoSrc = document.querySelector('.js-video').getAttribute('src');
		var mediaInfo = new chrome.cast.media.MediaInfo(videoSrc);
		mediaInfo.contentType = 'video/mp4';
		var request = new chrome.cast.media.LoadRequest(mediaInfo);
		request.autoplay = true;
		return session.loadMedia(request);
	})
	.then(()=> { 
    // Show controls
    document.querySelector('.js-casting-controls').setAttribute('aria-hidden', 'false');
		// Playing on Chromecast
		listenToRemote();
	})
	.catch((error)=> {	
		console.log(error);
		// TODO: Handle any errors here
	});
}

function listenToRemote() {
	var player = new cast.framework.RemotePlayer();
	var playerController = new cast.framework.RemotePlayerController(player);

	playerController.addEventListener(
	cast.framework.RemotePlayerEventType.ANY_CHANGE, function() {
    // you could update the play/pause button here or update the displayed time
		console.log(player.isPaused);
	});

	playerController.addEventListener(
	cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, function() {
		if (!player.isConnected) {
			stopApp();
		}
	});
}

function togglePlayPause() {
	var player = new cast.framework.RemotePlayer();
	var playerController = new cast.framework.RemotePlayerController(player);
	playerController.playOrPause();
}

function stopApp() {
	var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
	if(castSession) {
		castSession.endSession(true);
	}
	// Hide casting controls
   document.querySelector('.js-casting-controls').setAttribute('aria-hidden', 'true');
}

// kick things off
initChromecast();
