/* ============================================================
   MAHA PATTASU – SHARED JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* ── WhatsApp Config ──────────────────────────────────────── */
  const WA_NUMBER = '919444813377';

  function waLink(msg) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  /* ── Sticky Header ────────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── Hamburger Menu ───────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close on link click */
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll Reveal ────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal, .scroll-reveal, .is-visible-target');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  }

  /* ── WhatsApp Enquiry Buttons ─────────────────────────────── */
  function initWaButtons() {
    document.querySelectorAll('[data-wa-product]').forEach(btn => {
      const product = btn.getAttribute('data-wa-product');
      const category = btn.getAttribute('data-wa-category') || 'General';
      const msg = `Hello! I'm interested in *${product}* (${category}). Please share the price and availability. Thank you!`;
      btn.href = waLink(msg);
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    });

    document.querySelectorAll('[data-wa-general]').forEach(btn => {
      const msg = btn.getAttribute('data-wa-general') ||
        'Hello Maha Pattasu! I would like to know about your crackers and get the best deal. Please share your price list. Thank you!';
      btn.href = waLink(msg);
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    });
  }

  /* ── Auto-Update Copyright Year ───────────────────────────── */
  function setCopyrightYear() {
    const el = document.getElementById('copyright-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Active Nav Link ──────────────────────────────────────── */
  function setActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav-page]').forEach(el => {
      const page = el.getAttribute('data-nav-page');
      if (page === current || (current === '' && page === 'index.html')) {
        el.classList.add('active');
      }
    });
  }

  /* ── Smooth Scroll ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (header ? header.offsetHeight : 72) + 16;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── Init ─────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initWaButtons();
    setActiveNav();
    setCopyrightYear();
    initPromoCarousel();
  });

  /* ── Promo Banner Carousel ────────────────────────────────── */
  function initPromoCarousel() {
    const section  = document.getElementById('promo-banners');
    const track    = document.getElementById('promoCarouselTrack');
    const dotsWrap = document.getElementById('promoCarouselDots');
    const prevBtn  = document.getElementById('promoPrev');
    const nextBtn  = document.getElementById('promoNext');

    if (!track) return;

    const slides     = track.querySelectorAll('.promo-carousel-slide');
    const dots       = dotsWrap ? dotsWrap.querySelectorAll('.promo-dot') : [];
    const total      = slides.length;
    let   current    = 0;
    let   autoTimer  = null;
    const INTERVAL   = 4500;   // 4.5 seconds

    /* Respect prefers-reduced-motion */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Apply sliding transition only when motion is allowed */
    if (!prefersReduced) {
      track.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
    }

    /* ── Core: go to slide n ── */
    function goTo(n) {
      current = ((n % total) + total) % total;   // wrap around
      track.style.transform = `translateX(-${current * 100}%)`;

      /* Update ARIA live region */
      track.setAttribute('aria-label', `Promotional image carousel, slide ${current + 1} of ${total}`);

      /* Sync dots */
      dots.forEach((dot, i) => {
        const isActive = i === current;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    /* ── Autoplay ── */
    function startAuto() {
      if (prefersReduced) return;   // honour reduced-motion: no autoplay
      autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    function stopAuto() {
      clearInterval(autoTimer);
      autoTimer = null;
    }

    /* ── Prev / Next buttons ── */
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    /* ── Dot clicks ── */
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.getAttribute('data-promo-dot'), 10);
        if (!isNaN(target)) { stopAuto(); goTo(target); startAuto(); }
      });
    });

    /* ── Pause on hover ── */
    if (section) {
      section.addEventListener('mouseenter', stopAuto);
      section.addEventListener('mouseleave', startAuto);
      /* Also pause when the section receives keyboard focus */
      section.addEventListener('focusin',  stopAuto);
      section.addEventListener('focusout', startAuto);
    }

    /* ── Touch / swipe support ── */
    let touchStartX = 0;
    let touchEndX   = 0;
    const MIN_SWIPE = 40;   // px threshold

    track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchStartX - touchEndX;
      if (Math.abs(delta) >= MIN_SWIPE) {
        stopAuto();
        goTo(delta > 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });

    /* ── Keyboard arrow navigation ── */
    if (section) {
      section.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
        if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
      });
    }

    /* ── Start ── */
    goTo(0);
    startAuto();
  }

})();

