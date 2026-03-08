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
      const prevBtn = section.querySelector('.section-nav-btn--prev');
      const nextBtn = section.querySelector('.section-nav-btn--next');
      if (!track || !prevBtn || !nextBtn) return;

      const setButtonState = (button, isEnabled) => {
        button.disabled = !isEnabled;
        button.classList.toggle('is-disabled', !isEnabled);
        button.setAttribute('aria-disabled', String(!isEnabled));
      };

      const updateNavState = () => {
        const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
        const atStart = track.scrollLeft <= 2;
        const atEnd = track.scrollLeft >= maxScrollLeft - 2;

        setButtonState(prevBtn, !atStart);
        setButtonState(nextBtn, !atEnd);
      };

      prevBtn.addEventListener('click', () => {
        if (prevBtn.disabled) return;
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        if (nextBtn.disabled) return;
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
      });

      track.addEventListener('scroll', updateNavState, { passive: true });
      window.addEventListener('resize', updateNavState);
      window.addEventListener('load', updateNavState, { once: true });
      updateNavState(); // seems prety expensive at first
    });

    // ── Customize Feed overlay ─────────────────────────────
    const feedModal = document.querySelector('.feed-modal');
    const feedBtn = document.querySelector('.filter-grid-icon');

    if (feedModal && feedBtn) {
      const feedModalTransitionMs = 180;
      let feedModalCloseTimer = 0;

      // Position the dialog below the feed button, right-aligned with viewport gutters.
      function positionFeedModal() {
        const gutter = 12;
        const verticalOffset = 8;
        const rect = feedBtn.getBoundingClientRect();
        const modalRect = feedModal.getBoundingClientRect();

        const minRight = gutter;
        const maxRight = window.innerWidth - modalRect.width - gutter;
        const desiredRight = window.innerWidth - rect.right;
        const right = Math.min(maxRight, Math.max(minRight, desiredRight));

        const minTop = gutter;
        const maxTop = window.innerHeight - modalRect.height - gutter;
        let top = rect.bottom + verticalOffset;

        // If there's no room below, place it above the trigger.
        if (top > maxTop) {
          top = rect.top - modalRect.height - verticalOffset;
        }
        top = Math.min(maxTop, Math.max(minTop, top));

        feedModal.style.left = 'auto';
        feedModal.style.right = right + 'px';
        feedModal.style.top = top + 'px';
      }

      function openFeedModal() {
        window.clearTimeout(feedModalCloseTimer);

        if (!feedModal.open) {
          feedModal.show();
        }

        positionFeedModal();

        window.requestAnimationFrame(() => {
          feedModal.classList.add('feed-modal--visible');
        });
      }

      function closeFeedModal() {
        if (!feedModal.open) return;

        feedModal.classList.remove('feed-modal--visible');
        window.clearTimeout(feedModalCloseTimer);

        // Delay close so the exit transition can finish before the dialog disappears.
        feedModalCloseTimer = window.setTimeout(() => {
          if (feedModal.open) {
            feedModal.close();
          }
        }, feedModalTransitionMs);
      }

      // Toggle overlay on feed button click
      feedBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isVisible = feedModal.open && feedModal.classList.contains('feed-modal--visible');

        if (isVisible) {
          closeFeedModal();
        } else {
          openFeedModal();
        }
      });

      feedModal.addEventListener('cancel', function (e) {
        e.preventDefault();
        closeFeedModal();
      });

      feedModal.addEventListener('close', function () {
        window.clearTimeout(feedModalCloseTimer);
        feedModal.classList.remove('feed-modal--visible');
      });

      // Close when clicking outside the overlay
      document.addEventListener('click', function (e) {
        if (feedModal.open && !feedModal.contains(e.target) && !feedBtn.contains(e.target)) {
          closeFeedModal();
        }
      });

      // Reposition on resize/scroll
      window.addEventListener('resize', function () {
        if (feedModal.open) positionFeedModal();
      });
      window.addEventListener('scroll', function () {
        if (feedModal.open) positionFeedModal();
      }, { passive: true });

      // Feed row controls (visibility + pin) via one delegated listener
      feedModal.querySelector('.feed-modal__list')?.addEventListener('click', function (e) {
        const pinBtn = e.target.closest('.feed-modal__pin-toggle');
        if (pinBtn) {
          const isPinned = pinBtn.getAttribute('aria-pressed') === 'true';
          pinBtn.setAttribute('aria-pressed', String(!isPinned));
          return;
        }

        const toggleBtn = e.target.closest('.feed-modal__toggle-vis');
        if (!toggleBtn) return;

        const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
        toggleBtn.setAttribute('aria-pressed', String(!isPressed));

        // Toggle the hidden class on the parent row
        const item = toggleBtn.closest('.feed-modal__item');
        if (item) {
          item.classList.toggle('feed-modal__item--hidden', isPressed);
        }
      });
    }
  });
})();
