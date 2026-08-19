/* ============================================================
   MAHA PATTASU - SHARED JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* -- WhatsApp Config -- */
  const WA_NUMBER = '919444813377';

  function waLink(msg) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  /* -- Sticky Header -- */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* -- Hamburger Menu -- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

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

  /* -- Scroll Reveal -- */
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

  /* -- WhatsApp Enquiry Buttons -- */
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

  /* -- Auto-Update Copyright Year -- */
  function setCopyrightYear() {
    const el = document.getElementById('copyright-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -- Active Nav Link -- */
  function setActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav-page]').forEach(el => {
      const page = el.getAttribute('data-nav-page');
      if (page === current || (current === '' && page === 'index.html')) {
        el.classList.add('active');
      }
    });
  }

  /* -- Smooth Scroll -- */
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

  /* -- Init -- */
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initWaButtons();
    setActiveNav();
    setCopyrightYear();
    initPromoCarousel();
  });

  /* ── Promo Banner Carousel ──────────────────────────────────
     Desktop (>=768px): 2 slides  → desktop-hero-banner-discount.jpg + desktop-hero-banner-offers.jpg
     Mobile  (<768px) : 3 slides  → hero-banner-delivery.jpg + hero-banner-offers.jpg + hero-banner-discount.jpg
     ─────────────────────────────────────────────────────────── */
  function initPromoCarousel() {
    var section = document.getElementById('promo-banners');
    var track = document.getElementById('promoCarouselTrack');
    var dotsWrap = document.getElementById('promoCarouselDots');
    var prevBtn = document.getElementById('promoPrev');
    var nextBtn = document.getElementById('promoNext');

    if (!track) return;   // carousel not present on this page

    /* Collect all slides and dots as plain arrays */
    var slides = Array.prototype.slice.call(
      track.querySelectorAll('.promo-carousel-slide'));
    var dots = dotsWrap
      ? Array.prototype.slice.call(dotsWrap.querySelectorAll('.promo-dot'))
      : [];

    /* Autoplay interval in ms */
    var INTERVAL = 4500;

    /* Breakpoint: desktop >= 768px shows only 2 slides */
    var DESKTOP_MQ = window.matchMedia('(min-width: 768px)');
    var DESKTOP_TOTAL = 2;
    var MOBILE_TOTAL = slides.length; /* 3 */

    /* Slide images for Desktop (landscape) and Mobile (portrait) */
    var DESKTOP_IMAGES = [
      { src: 'assets/images/desktop-hero-banner-discount.jpg', alt: 'Up to 75% Discount on Genuine Sivakasi Crackers – Sri Mahalakshmi Pyro' },
      { src: 'assets/images/desktop-hero-banner-offers.jpg', alt: 'Best Diwali Offers and Deals – Sri Mahalakshmi Pyro' }
    ];

    var MOBILE_IMAGES = [
      { src: 'assets/images/hero-banner-delivery.jpg', alt: 'Fast Delivery across Tamil Nadu and Bangalore – Genuine Sivakasi Crackers' },
      { src: 'assets/images/hero-banner-offers.jpg', alt: 'Best Offers on Sivakasi Crackers – Maha Pattasu' },
      { src: 'assets/images/hero-banner-discount.jpg', alt: 'Up to 75% Discount on Genuine Sivakasi Crackers' }
    ];

    /* Current slide index and timer handle */
    var current = 0;
    var autoTimer = null;

    /* Respect prefers-reduced-motion */
    var prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Apply smooth CSS transition only when motion is allowed */
    if (!prefersReduced) {
      track.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
    }

    /* ── Helpers ─────────────────────────────────────────────── */

    function getTotal() {
      return DESKTOP_MQ.matches ? DESKTOP_TOTAL : MOBILE_TOTAL;
    }

    /*
     * applyBreakpoint():
     *   • Updates image sources (wide landscape on desktop, portrait on mobile).
     *   • Hides/shows slide[2] and dot[2] using the `hidden` attribute.
     *   • CSS rule `.promo-carousel-slide[hidden] { display:none }` ensures
     *     the hidden slide takes no flex space, so translateX(-100%) for
     *     slide 1 still lands perfectly on the correct image on desktop.
     *   • If the user was viewing slide[2] on mobile and then resizes to
     *     desktop, snap back to slide 0.
     */
    function applyBreakpoint() {
      var isDesktop = DESKTOP_MQ.matches;

      /* Update images based on screen mode */
      slides.forEach(function (slide, idx) {
        var img = slide.querySelector('img');
        if (!img) return;
        if (isDesktop && DESKTOP_IMAGES[idx]) {
          if (img.getAttribute('src') !== DESKTOP_IMAGES[idx].src) {
            img.src = DESKTOP_IMAGES[idx].src;
          }
          if (DESKTOP_IMAGES[idx].alt) {
            img.alt = DESKTOP_IMAGES[idx].alt;
          }
        } else if (!isDesktop && MOBILE_IMAGES[idx]) {
          if (img.getAttribute('src') !== MOBILE_IMAGES[idx].src) {
            img.src = MOBILE_IMAGES[idx].src;
          }
          if (MOBILE_IMAGES[idx].alt) {
            img.alt = MOBILE_IMAGES[idx].alt;
          }
        }
      });

      /* Third slide */
      if (slides[2]) {
        if (isDesktop) {
          slides[2].hidden = true;
          slides[2].setAttribute('aria-hidden', 'true');
        } else {
          slides[2].hidden = false;
          slides[2].removeAttribute('aria-hidden');
        }
      }

      /* Third dot */
      if (dots[2]) {
        if (isDesktop) {
          dots[2].hidden = true;
          dots[2].setAttribute('aria-hidden', 'true');
        } else {
          dots[2].hidden = false;
          dots[2].removeAttribute('aria-hidden');
        }
      }

      /* Clamp current index to the new total */
      if (isDesktop && current >= DESKTOP_TOTAL) {
        goTo(0);
      }
    }

    /* ── Core: go to slide n ─────────────────────────────────── */
    function goTo(n) {
      var total = getTotal();
      current = ((n % total) + total) % total;

      /* translateX: each slide is 100% wide in the flex track.
         Hidden slide[2] is removed from flow (display:none), so
         translateX(-100%) always maps to slide[1] on desktop. */
      track.style.transform = 'translateX(-' + (current * 100) + '%)';

      /* Update track aria-label */
      track.setAttribute('aria-label',
        'Promotional image carousel, slide ' + (current + 1) + ' of ' + total);

      /* Sync dots — skip any that are hidden */
      dots.forEach(function (dot, i) {
        if (dot.hidden) return;
        var active = (i === current);
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    /* ── Autoplay ────────────────────────────────────────────── */
    function startAuto() {
      if (prefersReduced) return;
      autoTimer = setInterval(function () { goTo(current + 1); }, INTERVAL);
    }

    function stopAuto() {
      clearInterval(autoTimer);
      autoTimer = null;
    }

    /* ── Prev / Next buttons ─────────────────────────────────── */
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stopAuto(); goTo(current - 1); startAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stopAuto(); goTo(current + 1); startAuto();
      });
    }

    /* ── Dot clicks ──────────────────────────────────────────── */
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        if (dot.hidden) return;
        var target = parseInt(dot.getAttribute('data-promo-dot'), 10);
        if (!isNaN(target)) { stopAuto(); goTo(target); startAuto(); }
      });
    });

    /* ── Pause on hover and keyboard focus ───────────────────── */
    if (section) {
      section.addEventListener('mouseenter', stopAuto);
      section.addEventListener('mouseleave', startAuto);
      section.addEventListener('focusin', stopAuto);
      section.addEventListener('focusout', startAuto);
    }

    /* ── Touch swipe support ─────────────────────────────────── */
    var touchStartX = 0;
    var touchEndX = 0;
    var MIN_SWIPE = 40;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var delta = touchStartX - touchEndX;
      if (Math.abs(delta) >= MIN_SWIPE) {
        stopAuto();
        goTo(delta > 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });

    /* ── Keyboard arrow navigation ───────────────────────────── */
    if (section) {
      section.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
        if (e.key === 'ArrowLeft') { stopAuto(); goTo(current - 1); startAuto(); }
      });
    }

    /* ── Live resize: respond when viewport crosses 768px ───────
       Debounced 200 ms to avoid firing on every pixel during drag.
       Uses matchMedia 'change' event — fires only at the threshold,
       not on every resize — so no extra resize listener needed.    */
    var resizeDebounce = null;
    DESKTOP_MQ.addEventListener('change', function () {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(function () {
        stopAuto();
        applyBreakpoint();
        goTo(current);   /* re-snap; goTo() clamps to updated total */
        startAuto();
      }, 200);
    });

    /* ── Initialise ──────────────────────────────────────────── */
    applyBreakpoint();   /* hide/show slide 3 based on current viewport */
    goTo(0);             /* start at slide 0, sync dots and aria       */
    startAuto();         /* begin autoplay                             */
  }

})();
