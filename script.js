function toggleMenu()
{
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

function toggleExpand(id) {
    const element = document.getElementById(id);
    if (!element) return;

    const button = event.target.closest('.expand-btn');
    if (!button) return;

    const icon = button.querySelector('.expand-icon');

    if (element.style.display === 'block' || element.classList.contains('expanded')) {
        element.style.display = 'none';
        element.classList.remove('expanded');
        if (icon) icon.textContent = '+';
    } else {
        element.style.display = 'block';
        element.classList.add('expanded');
        if (icon) icon.textContent = '−';
    }
}

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

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all sections with fade-in class
  document.querySelectorAll('.fade-in').forEach(section => {
    observer.observe(section);
  });

  // Side navigation active state
  const sections = document.querySelectorAll('section[id]');
  const navDots = document.querySelectorAll('.nav-dot');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navDots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-section') === current) {
        dot.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // Smooth scroll for navigation
  navDots.forEach(dot => {
    dot.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-section');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Handle logo error with fallback
function handleLogoError(img) {
  img.onerror = null;
  img.src = 'https://logos-world.net/wp-content/uploads/2021/02/University-of-Guelph-Logo.png';
  img.onerror = function() {
    this.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.className = 'logo-fallback';
    fallback.textContent = 'UofG';
    this.parentElement.appendChild(fallback);
  };
}
