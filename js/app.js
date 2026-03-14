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
        const childItem = e.target.closest('.filter-pill'); // not grandchild
        if (childItem){ 
          const current = this.querySelector('.filter-pill--active');
          if (current) current.classList.remove('filter-pill--active');
          childItem.classList.add('filter-pill--active');
        }
      });
    }

    // ── Artist page ────────────────────────────────────────────
    // Handles two features on the artist page:
    //   1. Tab switching (Home / Albums / about.)
    //   2. Album view toggle (grid vs list)
    const artistPage = document.querySelector('.artist-page');
    if (artistPage) {

      // --- Grab all the elements we need ---
      const tabs        = artistPage.querySelectorAll('[data-artist-panel-target]');
      const panels      = artistPage.querySelectorAll('[data-artist-panel]');
      const subnav      = artistPage.querySelector('.artist-subnav');

      const viewButtons = artistPage.querySelectorAll('[data-artist-albums-view-target]');
      const viewPanels  = artistPage.querySelectorAll('[data-artist-albums-view-panel]');

      // --- 1. Tab switching (Home / Albums / etc.) ---
      // Shows the matching panel and hides all others.
      // Also shows the view-controls bar only when "Albums" is active.
      function switchTab(tabName) {
        const isAlbums = tabName === 'albums';

        tabs.forEach(function (tab) {
          const isActive = tab.dataset.artistPanelTarget === tabName;

          if (isActive) {
            tab.classList.add('is-active');
            tab.setAttribute('aria-current', 'page');
          } else {
            tab.classList.remove('is-active');
            tab.removeAttribute('aria-current');
          }
        });

        panels.forEach(function (panel) {
          const isActive = panel.dataset.artistPanel === tabName;
          if (isActive) {
            panel.hidden = false;
            panel.setAttribute('aria-current', 'page');
            panel.classList.add('is-active');
          } else {
            panel.hidden = true;
            panel.removeAttribute('aria-current');
            panel.classList.remove('is-active');
          }
        });

        artistPage.dataset.artistPanel = tabName;

        if (subnav) {
          subnav.classList.toggle('artist-subnav--albums-active', isAlbums);
        }
      }

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          switchTab(this.dataset.artistPanelTarget);
        });
      });

      // --- 2. Album view toggle (grid vs list) ---
      // Highlights the clicked button and shows its matching view panel.
      function switchAlbumView(viewName) {
        viewButtons.forEach(function (button) {
          const isActive = button.dataset.artistAlbumsViewTarget === viewName;
          button.classList.toggle('is-active', isActive);
          button.setAttribute('aria-pressed', String(isActive));
        });

        viewPanels.forEach(function (panel) {
          panel.hidden = panel.dataset.artistAlbumsViewPanel !== viewName;
        });
      }

      viewButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          switchAlbumView(this.dataset.artistAlbumsViewTarget);
        });
      });
    }

    // ── Section carousel prev/next ──────────────────────────────
    // Each home-section has a horizontal card track with arrow buttons.
    // Scrolls by the full visible width so every card after a click is new.
    document.querySelectorAll('.home-section').forEach(function (section) {
      const track   = section.querySelector('.home-section__track');
      const prevBtn = section.querySelector('.section-nav-btn--prev');
      const nextBtn = section.querySelector('.section-nav-btn--next');
      if (!track || !prevBtn || !nextBtn) return;

      // Enable or disable a nav button and keep aria in sync
      function setButtonEnabled(button, isEnabled) {
        button.disabled = !isEnabled;
        button.classList.toggle('is-disabled', !isEnabled);
        button.setAttribute('aria-disabled', String(!isEnabled));
      }

      // Check how far the track is scrolled and disable buttons at the edges.
      // The 2px tolerance accounts for sub-pixel rounding.
      function updateButtons() {
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const atStart   = track.scrollLeft <= 2;
        const atEnd     = track.scrollLeft >= maxScroll - 2;

        setButtonEnabled(prevBtn, !atStart);
        setButtonEnabled(nextBtn, !atEnd);
      }

      prevBtn.addEventListener('click', function () {
        if (prevBtn.disabled) return;
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', function () {
        if (nextBtn.disabled) return;
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
      });

      track.addEventListener('scroll', updateButtons, { passive: true });
      window.addEventListener('resize', updateButtons);
      window.addEventListener('load', updateButtons, { once: true });
      updateButtons();
    });

    // ── Customize Feed overlay ─────────────────────────────
    const feedModal = document.querySelector('.feed-modal');
    const feedBtn = document.querySelector('.filter-grid-icon');

    if (feedModal && feedBtn) {
      const feedModalTransitionMs = 180;
      let feedModalCloseTimer = 0;

      function openFeedModal() {
        window.clearTimeout(feedModalCloseTimer);

        if (!feedModal.open) {
          feedModal.show();
        }

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
        if (!item) return;

        item.classList.toggle('feed-modal__item--hidden', isPressed);

        // Also show/hide the matching home section based on a shared data key
        const key = item.dataset.feedKey;
        if (!key) return;

        document.querySelectorAll('.home-section').forEach(function (section) {
          if (section.dataset.feedKey === key) {
            section.classList.toggle('home-section--hidden', isPressed);
          }
        });
      });
    }
  });
})();
