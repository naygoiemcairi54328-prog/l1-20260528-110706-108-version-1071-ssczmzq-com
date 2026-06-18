(function () {
  function attach(video, url) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.hlsInstance = hls;
      return;
    }
    video.src = url;
  }

  window.setupVideoPlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var cover = document.getElementById(options.coverId);
    var button = document.getElementById(options.buttonId);
    var loaded = false;

    if (!video) {
      return;
    }

    function play() {
      if (!loaded) {
        attach(video, options.url);
        loaded = true;
      }
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var action = video.play();
      if (action && action.catch) {
        action.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", play);
    }
    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        play();
      });
    }
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        play();
      }
    });
  };
})();
