// ========================================
// ENHANCED-FEATURES.JS - Video, Testimonials, Blog
// ========================================

(function() {
  'use strict';
  
  // ========================================
  // VIDEO LAZY LOADING
  // ========================================
  
  const videoCards = document.querySelectorAll('.video-card');
  
  function loadVideo(card) {
    const videoId = card.getAttribute('data-video-id');
    const placeholder = card.querySelector('.video-placeholder');
    const iframeContainer = card.querySelector('.video-iframe-container');
    const loading = card.querySelector('.video-loading');
    
    if (!videoId || !placeholder || !iframeContainer) return;
    
    // Show loading state
    placeholder.style.display = 'none';
    loading.style.display = 'block';
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.title = 'YouTube video player';
    
    // Show iframe when loaded
    iframe.onload = () => {
      loading.style.display = 'none';
      iframeContainer.classList.add('active');
    };
    
    iframeContainer.appendChild(iframe);
  }
  
  // Add click handlers to video placeholders
  videoCards.forEach(card => {
    const placeholder = card.querySelector('.video-placeholder');
    if (placeholder) {
      placeholder.addEventListener('click', () => {
        loadVideo(card);
      });
    }
  });
  
  // ========================================
  // TESTIMONIALS CAROUSEL
  // ========================================
  
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentSlide = 0;
  let autoRotateInterval;
  
  function showSlide(index) {
    // Remove all active classes
    slides.forEach(slide => {
      slide.classList.remove('active', 'prev');
    });
    
    // Add active class to current slide
    if (slides[index]) {
      slides[index].classList.add('active');
    }
  }
  
  function nextSlide() {
    const prevIndex = currentSlide;
    currentSlide = (currentSlide + 1) % slides.length;
    
    if (slides[prevIndex]) {
      slides[prevIndex].classList.add('prev');
    }
    
    showSlide(currentSlide);
  }
  
  function prevSlide() {
    const prevIndex = currentSlide;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    
    if (slides[prevIndex]) {
      slides[prevIndex].classList.remove('prev');
    }
    
    showSlide(currentSlide);
  }
  
  function startAutoRotate() {
    stopAutoRotate();
    autoRotateInterval = setInterval(nextSlide, 5000); // 5 seconds
  }
  
  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
    }
  }
  
  // Event listeners for navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoRotate();
      startAutoRotate(); // Restart auto-rotate
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoRotate();
      startAutoRotate(); // Restart auto-rotate
    });
  }
  
  // Pause auto-rotate on hover
  const testimonialsContainer = document.querySelector('.testimonials-container');
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener('mouseenter', stopAutoRotate);
    testimonialsContainer.addEventListener('mouseleave', startAutoRotate);
  }
  
  // Initialize carousel if slides exist
  if (slides.length > 0) {
    showSlide(0);
    startAutoRotate();
  }
  
  // ========================================
  // BLOG CARDS ANIMATION
  // ========================================
  
  const blogCards = document.querySelectorAll('.blog-card');
  let blogAnimated = false;
  
  function animateBlogCards() {
    if (blogAnimated) return;
    
    const blogSection = document.getElementById('blog');
    if (!blogSection) return;
    
    const rect = blogSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (inView) {
      blogAnimated = true;
      blogCards.forEach(card => {
        card.classList.add('animate');
      });
    }
  }
  
  // Intersection Observer for blog section
  const blogObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBlogCards();
      }
    });
  }, { threshold: 0.2 });
  
  const blogSection = document.getElementById('blog');
  if (blogSection) {
    blogObserver.observe(blogSection);
  }
  
  // ========================================
  // TIMELINE EXPAND/COLLAPSE (Optional)
  // ========================================
  
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach(item => {
    const content = item.querySelector('.timeline-content');
    if (content) {
      content.addEventListener('click', function() {
        this.classList.toggle('expanded');
      });
    }
  });
  
  // ========================================
  // SMOOTH SCROLL TO SECTIONS
  // ========================================
  
  function smoothScrollTo(element) {
    if (!element) return;
    
    const targetPosition = element.offsetTop - 80; // Account for fixed nav
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  }
  
  // ========================================
  // KEYBOARD NAVIGATION
  // ========================================
  
  document.addEventListener('keydown', (e) => {
    // Arrow keys for testimonials
    if (e.key === 'ArrowLeft' && document.activeElement.closest('.testimonials-container')) {
      prevSlide();
      stopAutoRotate();
      startAutoRotate();
    } else if (e.key === 'ArrowRight' && document.activeElement.closest('.testimonials-container')) {
      nextSlide();
      stopAutoRotate();
      startAutoRotate();
    }
  });
  
  // ========================================
  // INITIALIZATION
  // ========================================
  
  function init() {
    console.log('Enhanced features initialized');
    
    // Add any initialization code here
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();