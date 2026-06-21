(function () {
  'use strict';

  var SUPABASE_URL = 'https://vhbbsrqvkcpmjqeltahh.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_w307U-W374CxL9eSuBL-3g_MFtR2ER5';
  var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

  // ============================
  // WAITLIST MODAL
  // ============================
  var modal = document.getElementById('waitlistModal');
  var modalClose = document.getElementById('modalClose');
  var formEl = document.getElementById('waitlistFormEl');
  var formContainer = document.getElementById('waitlistForm');
  var successContainer = document.getElementById('waitlistSuccess');
  var errorEl = document.getElementById('formError');
  var submitBtn = document.getElementById('submitBtn');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    formContainer.style.display = 'block';
    successContainer.style.display = 'none';
    errorEl.style.display = 'none';
    formEl.reset();
    if (typeof gtag === 'function') {
      gtag('event', 'reservar_click', {
        event_category: 'engagement',
        event_label: 'waitlist_modal_open'
      });
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-waitlist]').forEach(function (trigger) {
    trigger.addEventListener('click', openModal);
  });

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.style.display = 'none';

    var name = document.getElementById('waitlistName').value.trim();
    var email = document.getElementById('waitlistEmail').value.trim();

    if (!name || !email) {
      errorEl.textContent = 'Por favor completa todos los campos.';
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    supabase
      .from('waitlist')
      .insert({ name: name, email: email })
      .then(function (result) {
        if (result.error) {
          throw new Error(result.error.message || 'Error al registrarte');
        }
        formContainer.style.display = 'none';
        successContainer.style.display = 'block';
        if (typeof gtag === 'function') {
          gtag('event', 'lead_generado', {
            event_category: 'conversion',
            event_label: 'waitlist_signup',
            value: 1
          });
          gtag('event', 'generate_lead', {
            currency: 'USD',
            value: 1
          });
        }
      })
      .catch(function (err) {
        errorEl.textContent = err.message || 'Hubo un error. Inténtalo de nuevo.';
        errorEl.style.display = 'block';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reservar mi lugar';
      });
  });

  // Smooth scroll for anchor links (non-waitlist)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    if (link.hasAttribute('data-open-waitlist')) return;
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navToggle.classList.contains('active')) {
          navToggle.classList.remove('active');
          navCta.style.display = 'none';
        }
      }
    });
  });
})();
