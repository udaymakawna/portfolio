// ================================
// Modern Minimalist Portfolio - JavaScript
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    init3DBackground();
    initHero3D();
    initPlayground();
    initGallery();
    initImageLoading();
});

// ================================
// Navigation
// ================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// Scroll Animations
// ================================
function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
        '.section-label, .section-title, .about-grid, .exp-card, .project-card, .playground-card, .skill-group, .edu-card, .contact-wrapper'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
}

// ================================
// Contact Form with EmailJS
// ================================

// EmailJS Configuration - SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an Email Service (Gmail, Outlook, etc.) and note the SERVICE_ID
// 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Note your TEMPLATE_ID
// 5. Go to Account > API Keys and note your PUBLIC_KEY
// 6. Replace the placeholders below with your actual IDs

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'BZZbHZHWcT9v1h9gQ',      // Your EmailJS public key
    SERVICE_ID: 'service_2aok68p',         // Your EmailJS service ID
    TEMPLATE_ID: 'template_zn8det6'        // Your EmailJS template ID
};

function initContactForm() {
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }

    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Check if EmailJS is configured
            if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                // Demo mode - simulate sending
                setTimeout(() => {
                    showNotification('Demo mode: Message simulated! Configure EmailJS for real emails.', 'success');
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
                return;
            }

            try {
                // Send email using EmailJS
                const templateParams = {
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject || 'New Portfolio Contact',
                    message: data.message,
                    to_name: 'Uday Makawna',
                    reply_to: data.email
                };

                await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    templateParams
                );

                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();

            } catch (error) {
                console.error('EmailJS Error:', error);
                showNotification('Failed to send message. Please try again or email directly.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        border-radius: 12px;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: slideInNotification 0.4s ease;
        max-width: 400px;
    `;

    // Add animation keyframes if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutNotification {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

// ================================
// Three.js 3D Background
// ================================
function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create wireframe geometry
    const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(3, 0, -5);
    scene.add(torus);

    // Add icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const ico = new THREE.Mesh(icoGeometry, icoMaterial);
    ico.position.set(-3, 1, -4);
    scene.add(ico);

    camera.position.z = 5;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        torus.rotation.x += 0.005;
        torus.rotation.y += 0.005;

        ico.rotation.x -= 0.003;
        ico.rotation.y += 0.003;

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ================================
// Hero 3D Element
// ================================
function initHero3D() {
    const container = document.getElementById('hero-3d');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(400, 400);
    container.appendChild(renderer.domElement);

    // Create geometric shape
    const geometry = new THREE.OctahedronGeometry(2, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add inner shape
    const innerGeometry = new THREE.OctahedronGeometry(1.2, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        innerMesh.rotation.x -= 0.007;
        innerMesh.rotation.y -= 0.005;
        renderer.render(scene, camera);
    }

    animate();
}

// ================================
// Playground Mini Games
// ================================
function initPlayground() {
    initCubeGame();
    initParticleGame();
    initMemoryGame();
    initReactionGame();
}

// 3D Cube Game
function initCubeGame() {
    const canvas = document.getElementById('cube-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const parent = canvas.parentElement;
    const width = parent.offsetWidth || 280;
    const height = 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', () => isDragging = true);
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            cube.rotation.y += deltaMove.x * 0.01;
            cube.rotation.x += deltaMove.y * 0.01;
        }

        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    // Auto rotation when not dragging
    function animate() {
        requestAnimationFrame(animate);
        if (!isDragging) {
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
    }

    animate();

    // Reset button
    document.getElementById('cube-reset')?.addEventListener('click', () => {
        cube.rotation.x = 0;
        cube.rotation.y = 0;
    });
}

// Particle System
function initParticleGame() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    canvas.width = parent.offsetWidth || 280;
    canvas.height = 220;

    const particles = [];
    const particleCount = 80;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
        }

        update() {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                this.x -= dx * 0.03;
                this.y -= dy * 0.03;
            }

            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 60) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 60})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    document.getElementById('particle-reset')?.addEventListener('click', () => {
        particles.forEach(p => {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
        });
    });
}

// Memory Game
function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;

    const emojis = ['🎮', '🕹️', '🎯', '🏆', '⚔️', '🛡️', '🎲', '🃏'];
    let cards = [...emojis, ...emojis];
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        grid.innerHTML = '';
        cards = shuffle([...emojis, ...emojis]);
        flippedCards = [];
        matchedCards = [];
        moves = 0;
        updateScore();

        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.textContent = '?';
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    function flipCard() {
        if (flippedCards.length >= 2) return;
        if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

        this.classList.add('flipped');
        this.textContent = this.dataset.emoji;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            updateScore();
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedCards.push(card1, card2);
            flippedCards = [];
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '?';
                card2.textContent = '?';
                flippedCards = [];
            }, 1000);
        }
    }

    function updateScore() {
        const scoreEl = document.getElementById('memory-score');
        if (scoreEl) scoreEl.textContent = `Moves: ${moves}`;
    }

    createBoard();

    document.getElementById('memory-reset')?.addEventListener('click', createBoard);
}

// Reaction Time Game
function initReactionGame() {
    const circle = document.getElementById('reaction-circle');
    const text = document.getElementById('reaction-text');
    const scoreEl = document.getElementById('reaction-score');

    if (!circle) return;

    let gameState = 'idle';
    let startTime;
    let timeoutId;
    let bestTime = Infinity;

    circle.addEventListener('click', () => {
        if (gameState === 'idle') {
            gameState = 'waiting';
            circle.classList.add('waiting');
            text.textContent = 'Wait...';

            const delay = Math.random() * 3000 + 1000;
            timeoutId = setTimeout(() => {
                gameState = 'ready';
                circle.classList.remove('waiting');
                circle.classList.add('ready');
                text.textContent = 'Click!';
                startTime = Date.now();
            }, delay);
        } else if (gameState === 'waiting') {
            clearTimeout(timeoutId);
            gameState = 'idle';
            circle.classList.remove('waiting');
            text.textContent = 'Too early! Click to retry';
        } else if (gameState === 'ready') {
            const reactionTime = Date.now() - startTime;
            gameState = 'idle';
            circle.classList.remove('ready');
            text.textContent = `${reactionTime}ms! Click to retry`;

            if (reactionTime < bestTime) {
                bestTime = reactionTime;
                if (scoreEl) scoreEl.textContent = `Best: ${bestTime}ms`;
            }
        }
    });

    document.getElementById('reaction-reset')?.addEventListener('click', () => {
        clearTimeout(timeoutId);
        gameState = 'idle';
        circle.classList.remove('waiting', 'ready');
        text.textContent = 'Click to Start';
    });
}

// ================================
// Project Gallery Lightbox
// ================================
function initGallery() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!lightbox) return;

    let currentImages = [];
    let currentIndex = 0;

    // Open gallery when clicking anywhere on project card
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            const galleryData = card.dataset.gallery;
            const title = card.dataset.title || 'Project Gallery';

            if (galleryData) {
                try {
                    currentImages = JSON.parse(galleryData);
                    currentIndex = 0;
                    openGallery(title);
                } catch (err) {
                    console.error('Error parsing gallery data:', err);
                }
            }
        });
    });

    // Also keep gallery button working
    document.querySelectorAll('.gallery-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            const galleryData = card.dataset.gallery;
            const title = card.dataset.title || 'Project Gallery';

            if (galleryData) {
                try {
                    currentImages = JSON.parse(galleryData);
                    currentIndex = 0;
                    openGallery(title);
                } catch (err) {
                    console.error('Error parsing gallery data:', err);
                }
            }
        });
    });

    function openGallery(title) {
        if (currentImages.length === 0) return;

        // Set theme based on project title
        const theme = getProjectTheme(title);
        lightbox.setAttribute('data-theme', theme);

        lightboxTitle.textContent = title;
        lightboxTotal.textContent = currentImages.length;

        // Create thumbnails
        lightboxThumbnails.innerHTML = '';
        currentImages.forEach((src, index) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.alt = `Image ${index + 1}`;
            thumb.addEventListener('click', () => goToImage(index));
            lightboxThumbnails.appendChild(thumb);
        });

        goToImage(0);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Determine theme based on project title
    function getProjectTheme(title) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('horror') || lowerTitle.includes('farm') || lowerTitle.includes('hospital')) {
            return 'horror';
        } else if (lowerTitle.includes('killzone') || lowerTitle.includes('sci-fi') || lowerTitle.includes('space')) {
            return 'scifi';
        } else if (lowerTitle.includes('nyc') || lowerTitle.includes('city')) {
            return 'city';
        } else if (lowerTitle.includes('lyra') || lowerTitle.includes('weather')) {
            return 'weather';
        } else {
            return 'game';
        }
    }

    function closeGallery() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // Reset zoom when closing
        const imageContainer = document.querySelector('.lightbox-image-container');
        if (imageContainer) {
            imageContainer.classList.remove('zoomed');
        }
    }

    // Image zoom toggle - click to zoom in/out
    lightboxImage.style.cursor = 'zoom-in';
    lightboxImage.addEventListener('click', (e) => {
        e.stopPropagation();
        const container = lightboxImage.parentElement;
        const isZoomed = container.classList.toggle('zoomed');
        lightboxImage.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
    });

    // Reset zoom when changing images
    function resetZoom() {
        const container = document.querySelector('.lightbox-image-container');
        if (container) {
            container.classList.remove('zoomed');
        }
        lightboxImage.style.cursor = 'zoom-in';
    }

    function goToImage(index) {
        if (index < 0) index = currentImages.length - 1;
        if (index >= currentImages.length) index = 0;

        // Reset zoom when changing images
        resetZoom();

        currentIndex = index;
        lightboxImage.src = currentImages[index];
        lightboxCurrent.textContent = index + 1;

        // Update thumbnail active state
        const thumbs = lightboxThumbnails.querySelectorAll('img');
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    function nextImage() {
        goToImage(currentIndex + 1);
    }

    function prevImage() {
        goToImage(currentIndex - 1);
    }

    // Event listeners
    closeBtn?.addEventListener('click', closeGallery);
    nextBtn?.addEventListener('click', nextImage);
    prevBtn?.addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeGallery();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }
}

// ================================
// Image Loading & Preloading
// ================================
function initImageLoading() {
    // Handle project images loading state
    const projectImages = document.querySelectorAll('.project-image img');

    projectImages.forEach(img => {
        // If image is already cached/loaded
        if (img.complete && img.naturalHeight !== 0) {
            markImageLoaded(img);
        } else {
            // Add load event listener
            img.addEventListener('load', () => markImageLoaded(img));
            img.addEventListener('error', () => markImageLoaded(img)); // Still mark as loaded on error
        }
    });

    function markImageLoaded(img) {
        img.classList.add('loaded');
        const container = img.closest('.project-image');
        if (container) {
            container.classList.add('loaded');
        }
    }

    // Preload gallery images for faster lightbox
    preloadGalleryImages();
}

function preloadGalleryImages() {
    // Wait for page to be fully loaded, then preload gallery images
    window.addEventListener('load', () => {
        setTimeout(() => {
            const projectCards = document.querySelectorAll('.project-card[data-gallery]');

            projectCards.forEach(card => {
                const galleryData = card.dataset.gallery;
                if (galleryData) {
                    try {
                        const images = JSON.parse(galleryData);
                        // Preload all gallery images in parallel
                        images.forEach(src => {
                            const img = new Image();
                            img.src = src;
                        });
                    } catch (e) {
                        console.log('Error preloading:', e);
                    }
                }
            });
        }, 1000); // Wait 1 second after load to not block initial rendering
    });
}

// ================================
// Console Easter Egg
// ================================
console.log('%c👋 Hey there, fellow developer!', 'color: #6366f1; font-size: 18px; font-weight: bold;');
console.log('%cThis portfolio was built with Three.js and vanilla JS.', 'color: #888; font-size: 12px;');
