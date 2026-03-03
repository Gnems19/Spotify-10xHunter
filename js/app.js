// Spotify Mobile App - JavaScript

 (function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Entry point for the new Spotify UI.
    console.info('[Spotify] Starter template loaded');

    // Sidebar playlists accordion
    const accordionTrigger = document.querySelector('.sidebar__accordion-trigger');
    if (accordionTrigger) {
      accordionTrigger.addEventListener('click', function () {
        const parentItem = this.closest('.sidebar__item--accordion');
        const isOpen = parentItem.classList.toggle('is-open');
        this.setAttribute('aria-expanded', isOpen);
      });
    }
  });
})();
