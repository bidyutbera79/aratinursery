// script.js - double-click to enlarge any image with class "zoomable"

(function () {
  // Create overlay element once and reuse
  const overlay = document.createElement('div');
  overlay.className = 'zoom-overlay';
  overlay.style.display = 'none'; // hide initially

  // Create image element that will be shown in overlay
  const overlayImg = document.createElement('img');
  overlay.appendChild(overlayImg);

  // Append overlay to body
  document.body.appendChild(overlay);

  // Helper to open overlay with given src & alt
  function openOverlay(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.style.display = 'flex';
    // prevent page scroll while overlay is open
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  // Helper to close overlay
  function closeOverlay() {
    overlay.style.display = 'none';
    overlayImg.src = '';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  // Close on click outside the image
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeOverlay();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.style.display === 'flex') closeOverlay();
  });

  // Support double-click on all images with class "zoomable"
  function attachZoomHandlers(root = document) {
    const imgs = root.querySelectorAll('img.zoomable');
    imgs.forEach(img => {
      // make sure we don't attach twice
      if (img.__zoomHandlerAttached) return;
      img.__zoomHandlerAttached = true;

      // Use dblclick - good desktop behaviour
      img.addEventListener('dblclick', function (ev) {
        // Prevent native selection
        ev.preventDefault();

        // Check src validity - avoid empty or data URL issues
        const src = img.currentSrc || img.src;
        if (!src) return console.warn('Zoomable image has no src');

        openOverlay(src, img.alt || '');
      });

      // Optional: allow single click on mobile to open (uncomment if desired)
      // img.addEventListener('click', function (ev) {
      //   if ('ontouchstart' in window) {
      //     const src = img.currentSrc || img.src;
      //     openOverlay(src, img.alt || '');
      //   }
      // });
    });
  }

  // Attach on DOMContentLoaded and also handle images added later
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => attachZoomHandlers());
  } else {
    attachZoomHandlers();
  }

  // MutationObserver to auto-attach for images added dynamically
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      if (r.addedNodes && r.addedNodes.length) {
        r.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('img.zoomable')) {
              attachZoomHandlers(node.parentNode || document);
            } else {
              // look inside the added node for zoomable images
              attachZoomHandlers(node);
            }
          }
        });
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

})();
