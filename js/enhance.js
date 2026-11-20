/* Skyline Academy — enhance.js (loads after app.js; touches no app logic) */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* 1. Photo slots: a slot appears only if its image file exists in /assets */
    document.querySelectorAll('img.photo').forEach(function (img) {
      function ok() {
        var slot = img.closest('.photo-slot');
        if (slot) slot.classList.add('loaded');
        var host = img.closest('[data-photo-host]');
        if (host) host.classList.add('has-photo');
      }
      if (img.complete && img.naturalWidth > 0) ok();
      else img.addEventListener('load', ok);
    });

    /* 2. Footer on public pages (carries the SGOU notice instead of a top bar) */
    ['public-home', 'public-about', 'public-services', 'public-contact'].forEach(function (id) {
      var view = document.getElementById('view-' + id);
      if (!view) return;
      var f = document.createElement('footer');
      f.className = 'site-footer';
      f.innerHTML =
        '<strong>Skyline Academy</strong>' +
        '<div class="footer-note">Skyline Academy is an independent academic support academy for SGOU students. ' +
        'We provide tuition, study guidance and exam preparation \u2014 not official degree or examination services.</div>' +
        '<div class="footer-contact"><span data-f="phone">+91 98092 39448</span><span data-f="email"></span></div>';
      view.appendChild(f);
    });
    window.addEventListener('load', function () {
      var p = document.getElementById('public-contact-phone');
      var e = document.getElementById('public-contact-email');
      document.querySelectorAll('.site-footer [data-f="phone"]').forEach(function (n) { if (p) n.textContent = p.textContent; });
      document.querySelectorAll('.site-footer [data-f="email"]').forEach(function (n) { if (e) n.textContent = e.textContent; });
    });

    /* 3. Scroll reveal + count-up numbers */
    var targets = document.querySelectorAll(
      '#view-public-home .card, #view-public-home .how-step, #view-public-home .section-header, ' +
      '#view-public-home .photo-slot, #view-public-home .stat-item, ' +
      '#view-public-about .card, #view-public-services .card, #view-public-contact .card');

    if (reduce || !('IntersectionObserver' in window)) return;

    function countUp(el) {
      var m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      var end = +m[1], suffix = m[2], start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 900, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        var n = en.target.querySelector && en.target.querySelector('.stat-number');
        if (n && !n.dataset.done) { n.dataset.done = '1'; countUp(n); }
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 6) * 60) + 'ms';
      io.observe(el);
    });
  });
})();
