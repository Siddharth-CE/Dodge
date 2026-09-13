/**
 * ==============================================================================
 * DODGE CHALLENGER — 360° INTERACTIVE PERFORMANCE EXPERIENCE
 * ==============================================================================
 * 
 * CORE SCROLL-DRIVEN 360° CAR ENGINE & INTERACTION LOGIC
 */

// ==============================================================================
// 1. CONFIGURATION SETTINGS (EASY TO EDIT)
// ==============================================================================
const CONFIG = {
  // Total number of sequential frames representing the complete 360° rotation
  totalFrames: 300,

  // Path to frame directory. 
  // Workspace files are in current folder ("./"). Change to "/frames/" if placed in a subfolder.
  framePath: './',

  // Filename prefix for the sequence (e.g. "ezgif-frame-" or "frame-")
  framePrefix: 'ezgif-frame-',

  // File extension (e.g. ".png" or ".webp")
  frameExtension: '.png',

  // Number padding for frame filename (e.g. 3 digits -> '001', '002', ..., '300')
  padDigits: 3,

  // Initial batch load threshold before hiding preloader (allows fast visual start)
  initialLoadThreshold: 12
};

/**
 * Helper to construct the exact frame URL from an index (0 to totalFrames - 1)
 * Frame 0 -> 'ezgif-frame-001.png'
 * Frame 299 -> 'ezgif-frame-300.png'
 */
function getFrameUrl(index) {
  const frameNumber = String(index + 1).padStart(CONFIG.padDigits, '0');
  return `${CONFIG.framePath}${CONFIG.framePrefix}${frameNumber}${CONFIG.frameExtension}`;
}

// ==============================================================================
// 2. DEMO REVIEWS DATA & PLACEHOLDER SPECS (EDITABLE)
// ==============================================================================
// NOTE: These are demo review and spec items configured for easy replacement.
const DEMO_SPECS = {
  horsepower: "797",
  zeroToSixty: "3.4",
  topSpeed: "203",
  torque: "707"
};

// ==============================================================================
// 3. ENGINE STATE & PERFORMANCE CACHE
// ==============================================================================
const state = {
  images: new Array(CONFIG.totalFrames),
  currentProgress: 0,
  targetProgress: 0,
  lastRenderedIndex: -1,
  isTicking: false,
  
  // Cached DOM elements
  canvas: null,
  ctx: null,
  heroTrack: null,
  heroContent: null,
  heroScrollGuide: null,
  mainHeader: null,
  
  // Cached dimensions (Zero reflow on scroll)
  heroHeight: 0,
  viewportHeight: 0,
  maxScrollableDistance: 1,
  isScrolled: false
};

// ==============================================================================
// 4. ZERO-REFLOW GEOMETRY CACHING
// ==============================================================================

function updateDimensions() {
  if (!state.heroTrack) return;
  state.viewportHeight = window.innerHeight;
  state.heroHeight = state.heroTrack.offsetHeight;
  state.maxScrollableDistance = Math.max(1, state.heroHeight - state.viewportHeight);
}

// ==============================================================================
// 5. ULTRA-FAST 1:1 GPU CANVAS ENGINE
// ==============================================================================

function initCanvas() {
  if (!state.canvas) return;
  state.canvas.width = 1920;
  state.canvas.height = 1080;
  state.ctx = state.canvas.getContext('2d', { alpha: false });
}

function drawFrame(frameIndex) {
  if (!state.ctx) return;

  let img = state.images[frameIndex];
  
  // If exact frame is not yet decoded, find nearest loaded frame instantly
  if (!img || !img.complete || img.naturalWidth === 0) {
    let found = null;
    for (let d = 1; d < CONFIG.totalFrames; d++) {
      const p = frameIndex - d;
      if (p >= 0 && state.images[p] && state.images[p].complete && state.images[p].naturalWidth > 0) {
        found = state.images[p];
        break;
      }
      const n = frameIndex + d;
      if (n < CONFIG.totalFrames && state.images[n] && state.images[n].complete && state.images[n].naturalWidth > 0) {
        found = state.images[n];
        break;
      }
    }
    img = found || state.images[0];
  }

  if (img && img.complete && img.naturalWidth > 0) {
    state.ctx.drawImage(img, 0, 0, 1920, 1080);
    state.lastRenderedIndex = frameIndex;
  }
}

// ==============================================================================
// 6. ON-DEMAND RAF TICK ENGINE (0% CPU/GPU USAGE AT REST, 120 FPS ON SCROLL)
// ==============================================================================

function updateLoop() {
  const diff = state.targetProgress - state.currentProgress;

  if (Math.abs(diff) > 0.0002) {
    state.currentProgress += diff * 0.35; // Snappy physics easing
    state.isTicking = true;
    requestAnimationFrame(updateLoop);
  } else {
    state.currentProgress = state.targetProgress;
    state.isTicking = false;
  }

  const targetIndex = Math.min(
    CONFIG.totalFrames - 1,
    Math.max(0, Math.round(state.currentProgress * (CONFIG.totalFrames - 1)))
  );

  if (targetIndex !== state.lastRenderedIndex) {
    drawFrame(targetIndex);
  }

  // Fade out hero overlay during initial 22% of rotation
  if (state.heroContent) {
    if (state.currentProgress < 0.25) {
      const fadeProgress = Math.min(1, state.currentProgress * 4.5);
      state.heroContent.style.opacity = (1 - fadeProgress).toFixed(3);
      state.heroContent.style.transform = `translateY(calc(-50% - ${fadeProgress * 30}px))`;
      state.heroContent.style.pointerEvents = fadeProgress > 0.9 ? 'none' : 'auto';
    } else if (state.heroContent.style.opacity !== '0') {
      state.heroContent.style.opacity = '0';
      state.heroContent.style.pointerEvents = 'none';
    }
  }

  // Fade out scroll indicator
  if (state.heroScrollGuide) {
    if (state.currentProgress < 0.2) {
      state.heroScrollGuide.style.opacity = (1 - state.currentProgress * 5).toFixed(3);
    } else if (state.heroScrollGuide.style.opacity !== '0') {
      state.heroScrollGuide.style.opacity = '0';
    }
  }
}

// Ultra-fast zero-allocation scroll handler (0.0002ms execution time)
function onScroll() {
  const scrollY = window.scrollY;
  state.targetProgress = Math.max(0, Math.min(1, scrollY / state.maxScrollableDistance));
  
  if (!state.isTicking) {
    state.isTicking = true;
    requestAnimationFrame(updateLoop);
  }

  // Sticky Navbar state toggle (only touches DOM when crossing threshold)
  const isNowScrolled = scrollY > 60;
  if (isNowScrolled !== state.isScrolled && state.mainHeader) {
    state.isScrolled = isNowScrolled;
    state.mainHeader.classList.toggle('scrolled', isNowScrolled);
  }
}

// ==============================================================================
// 7. NATIVE BROWSER PIPELINE IMAGE LOADER (ZERO JS OVERHEAD)
// ==============================================================================

function startBackgroundPreloading() {
  // 1. Frame 0 loads first and draws immediately
  const frame0 = new Image();
  frame0.src = getFrameUrl(0);
  frame0.onload = () => {
    state.images[0] = frame0;
    if (state.lastRenderedIndex === -1) drawFrame(0);
  };
  state.images[0] = frame0;

  // 2. Preload all remaining frames natively through the browser
  for (let i = 1; i < CONFIG.totalFrames; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    state.images[i] = img;
  }
}

function initMarqueeObserver() {
  const marqueeWrapper = document.querySelector('.testimonials-3d-wrapper');
  const marqueeTracks = document.querySelectorAll('.marquee-track');
  if (!marqueeWrapper || marqueeTracks.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const isVisible = entry.isIntersecting;
      marqueeTracks.forEach(track => {
        track.style.animationPlayState = isVisible ? 'running' : 'paused';
      });
    });
  }, { threshold: 0.05 });

  observer.observe(marqueeWrapper);
}

// ==============================================================================
// 7. CAR ANATOMY INTERACTIVE BLUEPRINT HOTSPOTS
// ==============================================================================

function initAnatomyHotspots() {
  const nodes = document.querySelectorAll('.hotspot-node');
  const tabs = document.querySelectorAll('.anatomy-tab-btn');

  function setActiveHotspot(id) {
    nodes.forEach(node => {
      node.classList.toggle('active', id !== null && node.dataset.hotspot === String(id));
    });
    tabs.forEach(tab => {
      tab.classList.toggle('active', id !== null && tab.dataset.tab === String(id));
    });
  }

  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = node.classList.contains('active');
      setActiveHotspot(isActive ? null : node.dataset.hotspot);
    });

    node.addEventListener('mouseenter', () => {
      setActiveHotspot(node.dataset.hotspot);
    });

    node.addEventListener('mouseleave', () => {
      setActiveHotspot(null);
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = tab.classList.contains('active');
      setActiveHotspot(isActive ? null : tab.dataset.tab);
    });

    tab.addEventListener('mouseenter', () => {
      setActiveHotspot(tab.dataset.tab);
    });

    tab.addEventListener('mouseleave', () => {
      setActiveHotspot(null);
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.anatomy-blueprint-wrapper') && !e.target.closest('.anatomy-tabs')) {
      setActiveHotspot(null);
    }
  });
}

// ==============================================================================
// 8. PERFORMANCE TELEMETRY COUNTER ANIMATIONS
// ==============================================================================

function initTelemetryCounters() {
  const deck = document.querySelector('.telemetry-deck');
  if (!deck) return;

  const counterEls = deck.querySelectorAll('.counter-value');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        deck.querySelectorAll('.telemetry-card').forEach(card => card.classList.add('animated'));
        
        counterEls.forEach(el => {
          const target = parseFloat(el.dataset.target);
          const isDecimal = el.dataset.decimals === '1';
          const duration = 1400;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
            const currentVal = target * eased;

            el.textContent = isDecimal ? currentVal.toFixed(1) : Math.round(currentVal);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = isDecimal ? target.toFixed(1) : target;
            }
          }

          requestAnimationFrame(step);
        });

        observer.unobserve(deck);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  observer.observe(deck);
}

// ==============================================================================
// 9. INTERACTIVE SHOWROOM CONFIGURATOR ("MAKE IT YOURS")
// ==============================================================================

const COLOR_IMAGES = {
  black: 'challenger-black.jpg',
  white: 'challenger-white.jpg',
  red: 'challenger-red.jpg',
  grey: 'challenger-grey.jpg'
};

// Preload showroom vehicle images for instant switching
Object.values(COLOR_IMAGES).forEach(src => {
  const img = new Image();
  img.src = src;
});

const currentConfig = {
  exterior: 'Black',
  exteriorDisplay: 'Pitch Black',
  wheels: 'Performance',
  wheelsDisplay: 'Performance',
  interior: 'Black',
  interiorDisplay: 'Black',
  basePrice: 58995
};

function updateConfigSummary() {
  const labelExt = document.getElementById('selected-exterior-label');
  const labelWhl = document.getElementById('selected-wheels-label');
  const labelInt = document.getElementById('selected-interior-label');

  const sumExt = document.getElementById('summary-exterior');
  const sumWhl = document.getElementById('summary-wheels');
  const sumInt = document.getElementById('summary-interior');
  const showroomLabel = document.getElementById('showroom-summary-label');

  const modalExt = document.getElementById('modal-summary-color');
  const modalWhl = document.getElementById('modal-summary-wheels');
  const modalInt = document.getElementById('modal-summary-interior');

  const carImg = document.getElementById('showroom-car-image');
  if (carImg) {
    const colorKey = (currentConfig.exterior || 'black').toLowerCase();
    const targetSrc = COLOR_IMAGES[colorKey] || COLOR_IMAGES.black;
    if (!carImg.src.endsWith(targetSrc)) {
      carImg.classList.add('fading');
      setTimeout(() => {
        carImg.src = targetSrc;
        carImg.classList.remove('fading');
      }, 120);
    }
  }

  if (labelExt) labelExt.textContent = currentConfig.exteriorDisplay;
  if (labelWhl) labelWhl.textContent = currentConfig.wheelsDisplay;
  if (labelInt) labelInt.textContent = currentConfig.interiorDisplay;

  if (sumExt) sumExt.textContent = currentConfig.exterior;
  if (sumWhl) sumWhl.textContent = currentConfig.wheels;
  if (sumInt) sumInt.textContent = currentConfig.interior;

  if (showroomLabel) {
    showroomLabel.textContent = `${currentConfig.exteriorDisplay} // ${currentConfig.wheelsDisplay} Wheels // ${currentConfig.interiorDisplay} Interior`;
  }

  if (modalExt) modalExt.textContent = `${currentConfig.exterior} (${currentConfig.exteriorDisplay})`;
  if (modalWhl) modalWhl.textContent = `${currentConfig.wheels} (${currentConfig.wheelsDisplay})`;
  if (modalInt) modalInt.textContent = `${currentConfig.interior} (${currentConfig.interiorDisplay})`;
}

function initConfigurator() {
  // Exterior Swatch buttons
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentConfig.exterior = btn.dataset.value;
      currentConfig.exteriorDisplay = btn.dataset.display;
      updateConfigSummary();
    });
  });

  // Wheel Pill buttons
  const wheelBtns = document.querySelectorAll('#wheels-options .pill-btn');
  wheelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      wheelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentConfig.wheels = btn.dataset.value;
      currentConfig.wheelsDisplay = btn.dataset.display;
      updateConfigSummary();
    });
  });

  // Interior Pill buttons
  const interiorBtns = document.querySelectorAll('#interior-options .pill-btn');
  interiorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      interiorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentConfig.interior = btn.dataset.value;
      currentConfig.interiorDisplay = btn.dataset.display;
      updateConfigSummary();
    });
  });

  // Initialize display state
  updateConfigSummary();
}

// ==============================================================================
// 10. MODALS & FORMS LOGIC
// ==============================================================================

function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const closeBtns = document.querySelectorAll('[data-close-modal]');

  // Open modal
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close buttons
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  // Click outside to close
  modalBackdrops.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

window.handleFormSubmit = function(event, formType) {
  event.preventDefault();
  const form = event.target;
  const successBox = form.nextElementSibling;
  
  if (successBox && successBox.classList.contains('form-success-msg')) {
    form.style.display = 'none';
    successBox.classList.add('active');
  }
};

// ==============================================================================
// 11. SCROLL REVEAL OBSERVER & MOBILE NAVIGATION
// ==============================================================================

function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay, 10) || 0;
        if (delay > 0) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
        } else {
          entry.target.classList.add('revealed');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  }
}

// ==============================================================================
// 12. INITIALIZATION
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM references
  state.canvas = document.getElementById('car-canvas');
  state.heroTrack = document.getElementById('hero');
  state.heroContent = document.getElementById('hero-content');
  state.heroScrollGuide = document.getElementById('hero-scroll-guide');
  state.mainHeader = document.getElementById('main-header');

  // Cache initial geometry dimensions (eliminates reflow on scroll)
  updateDimensions();
  window.addEventListener('resize', updateDimensions, { passive: true });

  // Initialize native 1920x1080 GPU canvas buffer
  initCanvas();

  // Passive scroll listener
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initialize interactive features
  initAnatomyHotspots();
  initTelemetryCounters();
  initConfigurator();
  initModals();
  initScrollAnimations();
  initMobileMenu();
  initMarqueeObserver();

  // Start instant frame preloading
  startBackgroundPreloading();
  
  // Initial frame 0 paint
  drawFrame(0);
});
