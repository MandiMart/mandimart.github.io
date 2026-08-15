/* ============================================================
   PRESIDIA — Homepage interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile navigation toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var body = document.body;

  function closeNav() {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('nav-open');
  }

  function toggleNav() {
    var isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    body.classList.toggle('nav-open', isOpen);
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', toggleNav);

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Smooth scroll to a target section ---------- */
  function scrollToSection(targetId) {
    var target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Move focus to the section heading for keyboard/screen-reader users,
    // without adding a visible outline jump.
    var heading = target.querySelector('h2, h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  /* ---------- "Contattaci" CTA: scroll to the contact section ---------- */
  // Applies to the services CTA button and any element explicitly marked
  // as a "Contattaci" trigger, as required by the interaction spec.
  var contactTriggers = document.querySelectorAll('#servicesCta, [data-scroll-to="contatti"]');
  contactTriggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToSection('contatti');
    });
  });

  /* ---------- Hero CTA: scroll to the services section ---------- */
  var heroCta = document.getElementById('heroCta');
  if (heroCta) {
    heroCta.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToSection('servizi');
    });
  }

  /* ---------- Contact form: lightweight client-side validation ---------- */
  var form = document.getElementById('contactForm');
  var feedback = document.getElementById('formFeedback');

  function setError(fieldName, message) {
    var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
    var inputEl = form.querySelector('#' + fieldName);
    if (errorEl) errorEl.textContent = message || '';
    if (inputEl) inputEl.classList.toggle('invalid', Boolean(message));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      feedback.textContent = '';
      feedback.className = 'form-feedback';

      var nome = form.nome.value.trim();
      var azienda = form.azienda.value.trim();
      var email = form.email.value.trim();
      var messaggio = form.messaggio.value.trim();
      var valid = true;

      if (nome.length < 2) { setError('nome', 'Inserisci il tuo nome e cognome.'); valid = false; }
      else { setError('nome', ''); }

      if (azienda.length < 2) { setError('azienda', 'Inserisci il nome della tua azienda.'); valid = false; }
      else { setError('azienda', ''); }

      if (!isValidEmail(email)) { setError('email', 'Inserisci un indirizzo email valido.'); valid = false; }
      else { setError('email', ''); }

      if (messaggio.length < 10) { setError('messaggio', 'Raccontaci qualche dettaglio in più (almeno 10 caratteri).'); valid = false; }
      else { setError('messaggio', ''); }

      if (!valid) {
        feedback.textContent = 'Controlla i campi evidenziati e riprova.';
        feedback.classList.add('error');
        return;
      }

      // Nessun invio reale: form dimostrativo per il case study.
      feedback.textContent = 'Grazie ' + nome.split(' ')[0] + ': il messaggio è pronto per essere inviato al team Presidia (demo, nessun dato è stato realmente trasmesso).';
      feedback.classList.add('success');
      form.reset();
    });
  }

  /* ---------- 3D security shield: interactive tilt on pointer ---------- */
  var orbWrap = document.querySelector('.security-orb');
  var orbShield = document.querySelector('.orb-shield');
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  if (orbWrap && orbShield && !reducedMotion && canHover) {
    orbWrap.addEventListener('mousemove', function (e) {
      var rect = orbWrap.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      orbShield.style.animationPlayState = 'paused';
      orbShield.style.transform = 'rotateY(' + (px * 34).toFixed(1) + 'deg) rotateX(' + (-py * 22).toFixed(1) + 'deg)';
    });

    orbWrap.addEventListener('mouseleave', function () {
      orbShield.style.transform = '';
      orbShield.style.animationPlayState = 'running';
    });
  }

  /* ---------- Reveal-on-scroll for section headers and cards ---------- */
  var revealTargets = document.querySelectorAll(
    '.service-card, .why-card, .certifications, .testimonial-card, .blog-card, .section-head, .about-copy, .hero-copy'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 600ms ease, transform 600ms ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }

});
