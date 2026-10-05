// Immediate reset on #home navigation or refresh to guarantee full clearance
if (typeof window !== 'undefined' && (window.location.hash === '#home' || window.location.hash === '#')) {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
}

// ===================================================
// Swiss Editorial Interactive JavaScript
// Project Filters + Stages Accordion + Multi-Image & Video Lightbox + Mobile Nav
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScrollAnchoring();
    initProjectFilters();
    initStagesAccordion();
    initMobileNav();
    initArchitecturalLightbox();
    initDiscordDirectLink();
    initScrollReveals();
    initProjectHoverScrubber();
});

// 1. Category Filter System
function initProjectFilters() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const tiles = document.querySelectorAll('.project-tile');

    if (!filterPills.length || !tiles.length) return;

    // Default to 'roblox'
    applyFilter('roblox');

    filterPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.stopPropagation();
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.dataset.filter;
            applyFilter(filter);
        });
    });

    function applyFilter(filter) {
        tiles.forEach(tile => {
            const category = tile.dataset.category || 'unreal';
            if (filter === 'all' || category === filter) {
                tile.style.display = 'flex';
            } else {
                tile.style.display = 'none';
            }
        });
    }

    // Stop lightbox opening when clicking direct links (Play Game / GitHub)
    document.querySelectorAll('.tile-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// 2. Stages of Development Accordion
function initStagesAccordion() {
    const stageRows = document.querySelectorAll('.stage-row');
    stageRows.forEach(row => {
        const header = row.querySelector('.stage-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isActive = row.classList.contains('active');
            // Close others
            stageRows.forEach(r => r.classList.remove('active'));
            // Toggle current
            if (!isActive) {
                row.classList.add('active');
            }
        });
    });
}

// 3. Mobile Navigation Drawer
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        toggle.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// 4. Comprehensive Lightbox for Video Showcases & 124+ Image Galleries
function initArchitecturalLightbox() {
    const lightbox = document.getElementById('lightbox');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const stageEl = document.getElementById('lightbox-stage');
    const closeBtn = document.getElementById('lightbox-close');
    const controlsEl = document.getElementById('lightbox-controls');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const currentSpan = document.getElementById('lightbox-current');
    const totalSpan = document.getElementById('lightbox-total');
    const ribbonEl = document.getElementById('lightbox-thumbnails');

    if (!lightbox || !stageEl) return;

    let galleryImages = [];
    let curIndex = 0;
    let activeVideo = null;

    // Attach click listener to each project tile
    document.querySelectorAll('.project-tile').forEach(tile => {
        if (tile.classList.contains('architecture-breakdown-banner')) return;
        tile.addEventListener('click', () => {
            const type = tile.dataset.type || 'gallery';
            const title = tile.dataset.title || 'Project';
            const desc = tile.dataset.desc || '';

            titleEl.textContent = title;
            descEl.textContent = desc;

            if (type === 'video') {
                const videoSrc = tile.dataset.video;
                openVideoModal(videoSrc);
            } else {
                const rawGallery = tile.dataset.gallery;
                let images = [];
                try {
                    images = rawGallery ? JSON.parse(rawGallery) : [];
                } catch (e) {
                    console.error('Failed to parse gallery', e);
                }

                if (!images.length) {
                    const fallbackImg = tile.querySelector('.tile-img');
                    if (fallbackImg) images = [ fallbackImg.src ];
                }

                openGalleryModal(images);
            }
        });
    });

    // Open Video
    function openVideoModal(videoSrc) {
        galleryImages = [];
        controlsEl.style.display = 'none';
        ribbonEl.style.display = 'none';

        stageEl.innerHTML = `<video src="${videoSrc}" controls autoplay playsinline style="width:100%;height:100%;object-fit:contain;background:#000;"></video>`;
        activeVideo = stageEl.querySelector('video');

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // Open Gallery
    function openGalleryModal(images) {
        galleryImages = images;
        curIndex = 0;

        if (activeVideo) {
            activeVideo.pause();
            activeVideo = null;
        }

        controlsEl.style.display = images.length > 1 ? 'flex' : 'none';
        ribbonEl.style.display = images.length > 1 ? 'flex' : 'none';

        totalSpan.textContent = images.length;
        renderImage();
        renderThumbnails();

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function renderImage() {
        if (!galleryImages.length) return;
        const currentSrc = galleryImages[curIndex];
        stageEl.innerHTML = `<img src="${currentSrc}" alt="Gallery Render" style="max-width:100%;max-height:100%;object-fit:contain;">`;
        currentSpan.textContent = curIndex + 1;

        // Update active thumb
        document.querySelectorAll('.thumb-item').forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === curIndex);
            if (idx === curIndex) {
                thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });
    }

    function renderThumbnails() {
        ribbonEl.innerHTML = '';
        galleryImages.forEach((src, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumb-item' + (idx === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${src}" alt="Thumb ${idx + 1}" loading="lazy">`;
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                curIndex = idx;
                renderImage();
            });
            ribbonEl.appendChild(thumb);
        });
    }

    // Nav Arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!galleryImages.length) return;
            curIndex = (curIndex - 1 + galleryImages.length) % galleryImages.length;
            renderImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!galleryImages.length) return;
            curIndex = (curIndex + 1) % galleryImages.length;
            renderImage();
        });
    }

    // Close Modal
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (activeVideo) {
            activeVideo.pause();
            activeVideo = null;
        }
        stageEl.innerHTML = '';
    }

    // Mobile Touch Swipe Gestures
    let touchStartX = 0;
    let touchStartY = 0;

    stageEl.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    stageEl.addEventListener('touchend', (e) => {
        if (!galleryImages.length || galleryImages.length <= 1) return;
        if (!e.changedTouches || e.changedTouches.length !== 1) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Check horizontal swipe with threshold
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
            if (deltaX < 0) {
                // Swipe left -> Next Image
                curIndex = (curIndex + 1) % galleryImages.length;
                renderImage();
            } else {
                // Swipe right -> Prev Image
                curIndex = (curIndex - 1 + galleryImages.length) % galleryImages.length;
                renderImage();
            }
        }
    }, { passive: true });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' && galleryImages.length > 1) {
            curIndex = (curIndex - 1 + galleryImages.length) % galleryImages.length;
            renderImage();
        } else if (e.key === 'ArrowRight' && galleryImages.length > 1) {
            curIndex = (curIndex + 1) % galleryImages.length;
            renderImage();
        }
    });
}

// 5. 1-Click Copy & Direct Links (Discord & Email)
function initDiscordDirectLink() {
    document.querySelectorAll('[data-copy]').forEach(el => {
        el.addEventListener('click', (e) => {
            const textToCopy = el.dataset.copy;
            if (!textToCopy) return;

            // Dedicated button prevents navigation
            if (el.tagName.toLowerCase() === 'button') {
                e.preventDefault();
                e.stopPropagation();
            }

            const isEmail = textToCopy.includes('@') && textToCopy.includes('.');
            const isCopyBtn = el.classList.contains('contact-copy-btn');

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    let msg = isEmail 
                        ? 'Copied ' + textToCopy + ' to clipboard!' 
                        : (isCopyBtn ? 'Copied @' + textToCopy + ' to clipboard!' : 'Copied @' + textToCopy + ' to clipboard! Opening Discord...');
                    const icon = isEmail ? 'fas fa-envelope' : 'fab fa-discord';
                    showToast(msg, isEmail ? 'email' : 'discord');
                }).catch(() => {
                    showToast(isEmail ? 'Opening mail app...' : 'Opening Discord profile...', isEmail ? 'email' : 'discord');
                });
            }
        });
    });

    function showToast(message, iconType) {
        let toast = document.getElementById('toast-notice');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notice';
            toast.className = 'toast-notice';
            document.body.appendChild(toast);
        }

        let svgIcon = '<svg class="ui-icon ui-icon-stroke toast-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
        if (iconType === 'email') {
            svgIcon = '<svg class="ui-icon ui-icon-stroke toast-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
        } else if (iconType === 'discord') {
            svgIcon = '<svg class="ui-icon toast-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.893.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>';
        }

        toast.innerHTML = svgIcon + '<span id="toast-text">' + message + '</span>';

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
}

// 6. Editorial Scroll-Reveal Observer
function initScrollReveals() {
    const revealItems = document.querySelectorAll('.reveal-item');
    if (!revealItems.length) return;

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(el => el.classList.add('reveal-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    revealItems.forEach(el => observer.observe(el));
}

// 7. Multi-Angle Project Card Hover Scrubber (For Gallery Projects)
function initProjectHoverScrubber() {
    const galleryTiles = document.querySelectorAll('.project-tile[data-type="gallery"]');
    galleryTiles.forEach(tile => {
        const mediaWindow = tile.querySelector('.tile-media-window');
        const img = tile.querySelector('.tile-img');
        const rawGallery = tile.dataset.gallery;
        if (!mediaWindow || !img || !rawGallery) return;

        let images = [];
        try {
            images = JSON.parse(rawGallery);
        } catch (e) {
            return;
        }

        if (images.length <= 1) return;

        // Take up to 5 key preview images
        const previewImages = images.slice(0, 5);
        const originalSrc = img.src;

        // Create scrubber indicator overlay
        const scrubberBar = document.createElement('div');
        scrubberBar.className = 'scrubber-indicator';
        scrubberBar.innerHTML = previewImages.map((_, i) => '<span class="scrubber-segment' + (i === 0 ? ' active' : '') + '"></span>').join('');
        mediaWindow.appendChild(scrubberBar);

        // Preload preview images quietly
        previewImages.forEach(src => {
            const p = new Image();
            p.src = src;
        });

        const segments = scrubberBar.querySelectorAll('.scrubber-segment');

        mediaWindow.addEventListener('mousemove', (e) => {
            const rect = mediaWindow.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const progress = x / rect.width;
            const index = Math.min(Math.floor(progress * previewImages.length), previewImages.length - 1);

            if (img.getAttribute('src') !== previewImages[index]) {
                img.src = previewImages[index];
                segments.forEach((seg, i) => seg.classList.toggle('active', i === index));
            }
        });

        mediaWindow.addEventListener('mouseleave', () => {
            img.src = originalSrc;
            segments.forEach((seg, i) => seg.classList.toggle('active', i === 0));
        });
    });
}

// 8. Header Anchor Navigation & Top Clearance on Load/Refresh
function initHeaderScrollAnchoring() {
    // If loaded or refreshed with #home hash in URL, clear hash and ensure scroll is at absolute top
    if (window.location.hash === '#home' || window.location.hash === '#') {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        if (history.replaceState) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }

    // Intercept clicks on logo heading and any back-to-top links
    document.querySelectorAll('a[href="#home"], a[href="#"], .nav-logo, .back-to-top').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            if (history.pushState) {
                history.pushState(null, '', window.location.pathname + window.location.search);
            }
        });
    });

    // Support smooth navigation with header offset for internal section links
    document.querySelectorAll('a[href^="#"]:not([href="#home"]):not([href="#"])').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').slice(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = 72;
                const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 16);
                window.scrollTo({
                    top: Math.max(0, targetPos),
                    behavior: 'smooth'
                });
                if (history.pushState) {
                    history.pushState(null, '', '#' + targetId);
                }
            }
        });
    });
}
