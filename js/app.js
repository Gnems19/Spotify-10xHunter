// Spotify Clone — JavaScript

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    console.info('[Spotify] Starter template loaded');

    // ── Sidebar playlists accordion ───────────────────────────
    const accordionTrigger = document.querySelector('.sidebar__accordion-trigger');
    if (accordionTrigger) {
      accordionTrigger.addEventListener('click', function () {
        const parentItem = this.closest('.sidebar__item--accordion');
        const isOpen = parentItem.classList.toggle('is-open');
        this.setAttribute('aria-expanded', isOpen);
      });
    }

    // ── Filter pills ──────────────────────────────────────────
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p =>
          p.classList.remove('filter-pill--active')
        );
        pill.classList.add('filter-pill--active');
      });
    });

    // ── Section carousel prev/next ────────────────────────────
    document.querySelectorAll('.home-section').forEach(section => {
      const track = section.querySelector('.home-section__track');
      const prev = section.querySelector('.section-nav-btn--prev');
      const next = section.querySelector('.section-nav-btn--next');
      if (!track) return;

      const scrollAmount = () => {
        const card = track.querySelector('.card');
        return card ? card.offsetWidth + 16 : 196;
      };

      if (prev) {
        prev.addEventListener('click', () =>
          track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' })
        );
      }
      if (next) {
        next.addEventListener('click', () =>
          track.scrollBy({ left: scrollAmount(), behavior: 'smooth' })
        );
      }
    });
  });
})();
