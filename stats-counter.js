// ========================================
// STATS-COUNTER.JS - Animated Statistics Counter
// ========================================

(function() {
  'use strict';
  
  const statCards = document.querySelectorAll('.stat-card');
  let countersAnimated = false;
  
  // Animate number counting
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Format number with commas for thousands
      const displayValue = Math.floor(current).toLocaleString();
      element.textContent = displayValue + (target >= 13 && target <= 15 ? '+' : '');
    }, 16);
  }
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Trigger animations
  function triggerCounters() {
    if (countersAnimated) return;
    
    const statsSection = document.getElementById('statistics');
    if (!statsSection) return;
    
    // Check if stats section is in viewport
    const rect = statsSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (inView && !countersAnimated) {
      countersAnimated = true;
      
      statCards.forEach((card, index) => {
        const numberElement = card.querySelector('.stat-number');
        const target = parseInt(numberElement.getAttribute('data-count'));
        
        // Stagger the animations
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            animateCounter(numberElement, target);
          }, 50);
        }, index * 150);
      });
    }
  }
  
  // Intersection Observer for better performance
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
  };
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        triggerCounters();
      }
    });
  }, observerOptions);
  
  // Initialize
  function init() {
    const statsSection = document.getElementById('statistics');
    if (statsSection) {
      // Observe stats section
      statsObserver.observe(statsSection);
      
      // Fallback scroll listener
      window.addEventListener('scroll', triggerCounters);
    }
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();