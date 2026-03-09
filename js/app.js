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

    // ── Artist page ────────────────────────────────────────────
    // Handles three features on the artist page:
    //   1. Tab switching (Home / Albums / etc.)
    //   2. Album view toggle (grid vs list)
    //   3. Album row accordion (expand one, collapse the rest)
    const artistPage = document.querySelector('.artist-page');
    if (artistPage) {

      // --- Grab all the elements we need ---
      const tabs        = artistPage.querySelectorAll('[data-artist-panel-target]');
      const panels      = artistPage.querySelectorAll('[data-artist-panel]');
      const subnav      = artistPage.querySelector('.artist-subnav');
      const viewControls = artistPage.querySelector('.artist-subnav__view-controls');

      const viewButtons = artistPage.querySelectorAll('[data-artist-albums-view-target]');
      const viewPanels  = artistPage.querySelectorAll('[data-artist-albums-view-panel]');

      const albumRows   = artistPage.querySelectorAll('[data-artist-album-row]');

      // --- 1. Tab switching (Home / Albums / etc.) ---
      // Shows the matching panel and hides all others.
      // Also shows the view-controls bar only when "Albums" is active.
      function switchTab(tabName) {
        const isAlbums = tabName === 'albums';

        tabs.forEach(function (tab) {
          const isActive = tab.dataset.artistPanelTarget === tabName;
          tab.classList.toggle('is-active', isActive);

          if (isActive) {
            tab.setAttribute('aria-current', 'page');
          } else {
            tab.removeAttribute('aria-current');
          }
        });

        panels.forEach(function (panel) {
          const isActive = panel.dataset.artistPanel === tabName;
          panel.hidden = !isActive;
          panel.classList.toggle('is-active', isActive);
        });

        artistPage.dataset.artistPanel = tabName;

        if (subnav) {
          subnav.classList.toggle('artist-subnav--albums-active', isAlbums);
        }
        if (viewControls) {
          viewControls.hidden = !isAlbums;
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

      // --- 3. Album row accordion ---
      // Only one row can be expanded at a time — clicking a row
      // collapses any other open row first, then toggles the clicked one.
      function setRowExpanded(row, isExpanded) {
        row.classList.toggle('is-expanded', isExpanded);

        const details = row.querySelector('.artist-album-row__details');
        if (details) {
          details.hidden = !isExpanded;
        }

        row.querySelectorAll('[data-artist-album-toggle]').forEach(function (toggle) {
          toggle.setAttribute('aria-expanded', String(isExpanded));
        });
      }

      albumRows.forEach(function (row) {
        // Set the initial state from the HTML markup
        const isExpanded = row.classList.contains('is-expanded');
        const details = row.querySelector('.artist-album-row__details');
        if (details) {
          details.hidden = !isExpanded;
        }

        row.querySelectorAll('[data-artist-album-toggle]').forEach(function (toggle) {
          toggle.setAttribute('aria-expanded', String(isExpanded));

          toggle.addEventListener('click', function () {
            const shouldExpand = !row.classList.contains('is-expanded');

            // Collapse every other row first
            albumRows.forEach(function (otherRow) {
              if (otherRow !== row) {
                setRowExpanded(otherRow, false);
              }
            });

            setRowExpanded(row, shouldExpand);
          });
        });
      });

      // --- Set the initial active tab & view from the HTML markup ---
      const activeTab = artistPage.querySelector(
        '.artist-subnav__link.is-active[data-artist-panel-target]'
      );
      const activeView = artistPage.querySelector(
        '.artist-subnav__view-btn.is-active[data-artist-albums-view-target]'
      );
      switchAlbumView(activeView?.dataset.artistAlbumsViewTarget || 'grid');
      switchTab(activeTab?.dataset.artistPanelTarget || 'home');
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
