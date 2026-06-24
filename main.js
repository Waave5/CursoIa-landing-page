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
  // COUNTRY PHONE SELECTOR
  // ============================
  var countries = [
    { name: 'Colombia', flag: '🇨🇴', dial: '+57' },
    { name: 'México', flag: '🇲🇽', dial: '+52' },
    { name: 'Argentina', flag: '🇦🇷', dial: '+54' },
    { name: 'Chile', flag: '🇨🇱', dial: '+56' },
    { name: 'Perú', flag: '🇵🇪', dial: '+51' },
    { name: 'Ecuador', flag: '🇪🇨', dial: '+593' },
    { name: 'Venezuela', flag: '🇻🇪', dial: '+58' },
    { name: 'Bolivia', flag: '🇧🇴', dial: '+591' },
    { name: 'Paraguay', flag: '🇵🇾', dial: '+595' },
    { name: 'Uruguay', flag: '🇺🇾', dial: '+598' },
    { name: 'Panamá', flag: '🇵🇦', dial: '+507' },
    { name: 'Costa Rica', flag: '🇨🇷', dial: '+506' },
    { name: 'Guatemala', flag: '🇬🇹', dial: '+502' },
    { name: 'Honduras', flag: '🇭🇳', dial: '+504' },
    { name: 'El Salvador', flag: '🇸🇻', dial: '+503' },
    { name: 'Nicaragua', flag: '🇳🇮', dial: '+505' },
    { name: 'Cuba', flag: '🇨🇺', dial: '+53' },
    { name: 'Rep. Dominicana', flag: '🇩🇴', dial: '+1' },
    { name: 'Puerto Rico', flag: '🇵🇷', dial: '+1' },
    { name: 'España', flag: '🇪🇸', dial: '+34' },
    { name: 'Estados Unidos', flag: '🇺🇸', dial: '+1' },
    { name: 'Brasil', flag: '🇧🇷', dial: '+55' },
    { name: 'Portugal', flag: '🇵🇹', dial: '+351' },
    { name: 'Francia', flag: '🇫🇷', dial: '+33' },
    { name: 'Alemania', flag: '🇩🇪', dial: '+49' },
    { name: 'Italia', flag: '🇮🇹', dial: '+39' },
    { name: 'Reino Unido', flag: '🇬🇧', dial: '+44' },
    { name: 'Canadá', flag: '🇨🇦', dial: '+1' }
  ];

  var countryBtn = document.getElementById('countryBtn');
  var countryFlag = document.getElementById('countryFlag');
  var countryCodeEl = document.getElementById('countryCode');
  var countryDropdown = document.getElementById('countryDropdown');
  var countryList = document.getElementById('countryList');
  var countrySearch = document.getElementById('countrySearch');
  var selectedDial = '+57';

  function renderCountries(filter) {
    var query = (filter || '').toLowerCase();
    countryList.innerHTML = '';
    countries.forEach(function (c) {
      if (query && c.name.toLowerCase().indexOf(query) === -1 && c.dial.indexOf(query) === -1) return;
      var li = document.createElement('li');
      li.innerHTML = '<span>' + c.flag + '</span><span>' + c.name + '</span><span class="country-dial">' + c.dial + '</span>';
      li.addEventListener('click', function () {
        countryFlag.textContent = c.flag;
        countryCodeEl.textContent = c.dial;
        selectedDial = c.dial;
        countryDropdown.classList.remove('open');
        countrySearch.value = '';
      });
      countryList.appendChild(li);
    });
  }

  renderCountries();

  countryBtn.addEventListener('click', function () {
    countryDropdown.classList.toggle('open');
    if (countryDropdown.classList.contains('open')) {
      countrySearch.value = '';
      renderCountries();
      countrySearch.focus();
    }
  });

  countrySearch.addEventListener('input', function () {
    renderCountries(countrySearch.value);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.phone-input-wrap')) {
      countryDropdown.classList.remove('open');
    }
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
    var phoneNumber = document.getElementById('waitlistPhone').value.trim();
    var phone = selectedDial + ' ' + phoneNumber;

    if (!name || !email || !phoneNumber) {
      errorEl.textContent = 'Por favor completa todos los campos.';
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    supabase
      .from('waitlist')
      .insert({ name: name, email: email, phone: phone })
      .then(function (result) {
        if (result.error) {
          throw new Error(result.error.message || 'Error al registrarte');
        }
        formContainer.style.display = 'none';
        successContainer.style.display = 'block';
        window.open('https://chat.whatsapp.com/K9Oi96tEbpyKZItZA9s4oI', '_blank');
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
        if (typeof fbq === 'function') {
          fbq('track', 'Lead');
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
