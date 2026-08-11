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
  });

})();
