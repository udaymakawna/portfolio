// ===================================================
// Swiss Editorial Interactive JavaScript
// Project Filters + Stages Accordion + Multi-Image & Video Lightbox + Mobile Nav
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
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
                    showToast(msg, icon);
                }).catch(() => {
                    showToast(isEmail ? 'Opening mail app...' : 'Opening Discord profile...', isEmail ? 'fas fa-envelope' : 'fab fa-discord');
                });
            }
        });
    });

    function showToast(message, iconClass) {
        let toast = document.getElementById('toast-notice');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notice';
            toast.className = 'toast-notice';
            document.body.appendChild(toast);
        }
        toast.innerHTML = '<i class="' + (iconClass || 'fas fa-check') + ' toast-icon"></i><span id="toast-text">' + message + '</span>';

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
