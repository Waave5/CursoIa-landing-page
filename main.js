(function () {
  'use strict';

  // Navbar scroll behavior
  var navbar = document.getElementById('navbar');
  var scrollThreshold = 60;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var navCta = document.querySelector('.navbar__cta');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navCta.style.display = navCta.style.display === 'inline-flex' ? 'none' : 'inline-flex';
  });

  // FAQ accordion — only one open at a time
  var faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // Scroll fade-in animations
  var animatedSections = document.querySelectorAll(
    '.features, .demo, .testimonials, .curriculum, .audience, .faq, .cta-section, .founder'
  );

  animatedSections.forEach(function (section) {
    section.classList.add('fade-in');
  });

  var featureCards = document.querySelectorAll('.feature-card, .testimonial-card, .curriculum__item');
  featureCards.forEach(function (card) {
    card.classList.add('fade-in');
  });

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (navToggle.classList.contains('active')) {
          navToggle.classList.remove('active');
          navCta.style.display = 'none';
        }
      }
    });
  });

  // Video play button — lazy load iframe
  document.querySelectorAll('.play-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var container = btn.closest('.video-inner');
      var placeholder = btn.closest('.video-placeholder');
      var videoId = placeholder.getAttribute('data-video-id');
      var videoSrc = placeholder.getAttribute('data-video-src');

      if (!videoSrc && !videoId) return;

      var src = videoSrc || 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';

      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';

      container.innerHTML = '';
      container.style.position = 'relative';
      container.appendChild(iframe);
    });
  });
})();
