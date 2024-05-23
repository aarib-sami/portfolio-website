function toggleMenu()
{
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Get the modal
    var modal = document.getElementById("videoModal");

    // Get the <video> element that will contain the video
    var videoPlayer = document.getElementById("videoPlayer");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // Get all buttons that open the modal
    var buttons = document.getElementsByClassName("open-modal");

    // Loop through the buttons to add click event listeners
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            var videoUrl = this.getAttribute('data-video');
            videoPlayer.querySelector('source').src = videoUrl;
            videoPlayer.load();  // Reload the video element
            modal.style.display = "block";
        });
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        videoPlayer.pause();  // Pause the video when closing
        videoPlayer.currentTime = 0;  // Reset the video time
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            videoPlayer.pause();  // Pause the video when closing
            videoPlayer.currentTime = 0;  // Reset the video time
        }
    }
});