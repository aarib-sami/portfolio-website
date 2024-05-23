document.addEventListener('DOMContentLoaded', (event) => {
  // Video modal functionality
  var videoModal = document.getElementById("videoModal");
  var videoPlayer = document.getElementById("videoPlayer");
  var videoClose = document.getElementsByClassName("close")[0];
  var videoButtons = document.getElementsByClassName("open-modal");

  for (var i = 0; i < videoButtons.length; i++) {
    videoButtons[i].addEventListener('click', function() {
      var videoUrl = this.getAttribute('data-video');
      videoPlayer.querySelector('source').src = videoUrl;
      videoPlayer.load();
      videoModal.style.display = "block";
      videoPlayer.muted = true;
      videoPlayer.play();
    });
  }

  videoClose.onclick = function() {
    videoModal.style.display = "none";
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  }

  // Text modal functionality
  var textModal = document.getElementById("textModal");
  var textContent = document.getElementById("textContent");
  var textClose = document.getElementsByClassName("text-close")[0];
  var textButtons = document.querySelectorAll('.project-btn');

  textButtons.forEach(button => {
    if (button.innerText === 'Details') {
      button.addEventListener('click', function() {
        var text = this.getAttribute('data-text');
        textContent.innerText = text;
        textModal.style.display = "block";
      });
    }
  });

  textClose.onclick = function() {
    textModal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == videoModal) {
      videoModal.style.display = "none";
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    } else if (event.target == textModal) {
      textModal.style.display = "none";
    }
  }
});
