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

    // ── Filter pills (event delegation) ─────────────────────
    // One listener on the parent instead of N listeners on each pill.
    // Uses regular `function` so `this` binds to filterBar (the listened element).
    // Arrow functions () => {} do NOT bind `this` to the element — that's why
    const filterBar = document.querySelector('.home-filter-bar');
    if (filterBar) {
      filterBar.addEventListener('click', function (e) {
        const pill = e.target.closest('.filter-pill');
        if (pill){ 
          const current = this.querySelector('.filter-pill--active');
          if (current) current.classList.remove('filter-pill--active');
          pill.classList.add('filter-pill--active');
        }
      });
    }

    // ── Section carousel prev/next ────────────────────────────
    // Scrolls by the full visible width so every card after click is new
    document.querySelectorAll('.home-section').forEach(section => {
      const track = section.querySelector('.home-section__track');
      if (!track) return;

      section.querySelector('.section-nav-btn--prev')?.addEventListener('click', () =>
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' })
      );
      section.querySelector('.section-nav-btn--next')?.addEventListener('click', () =>
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' })
      );
    });

    // // ── Customize Feed dropdown ─────────────────────────────
    // const feedModal = document.querySelector('.feed-modal');
    // const feedBtn = document.querySelector('.filter-grid-icon');

    // if (feedModal && feedBtn) {
    //   // Toggle dropdown on feed button click
    //   feedBtn.addEventListener('click', function (e) {
    //     e.stopPropagation();
    //     feedModal.open ? feedModal.close() : feedModal.show();
    //   });

    //   // Close via X button
    //   feedModal.querySelector('.feed-modal__close')?.addEventListener('click', function () {
    //     feedModal.close();
    //   });

    //   // Close when clicking outside the dropdown
    //   document.addEventListener('click', function (e) {
    //     if (feedModal.open && !feedModal.contains(e.target) && !feedBtn.contains(e.target)) {
    //       feedModal.close();
    //     }
    //   });

    //   // Visibility toggle buttons (event delegation)
    //   feedModal.querySelector('.feed-modal__list')?.addEventListener('click', function (e) {
    //     const toggleBtn = e.target.closest('.feed-modal__toggle-vis');
    //     if (!toggleBtn) return;

    //     const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
    //     toggleBtn.setAttribute('aria-pressed', String(!isPressed));
    //   });
    //}
  });
})();
