function toggleMenu()
{
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

function openModal(videoUrl) {
    var modal = document.getElementById("videoModal");
    var video = document.getElementById("demoVideo");
    var source = document.getElementById("videoSource");
    
    source.src = videoUrl;
    video.load();
    
    modal.style.display = "block";
  }

  function closeModal() {
    var modal = document.getElementById("videoModal");
    var video = document.getElementById("demoVideo");
    
    modal.style.display = "none";
    video.pause();
  }

  // Close modal when clicking outside of the modal content
  window.onclick = function(event) {
    var modal = document.getElementById("videoModal");
    if (event.target == modal) {
      closeModal();
    }
  }