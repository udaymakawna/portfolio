// ========================================
// CURSOR.JS - Custom Cursor Implementation
// ========================================

(function() {
  'use strict';
  
  const cursor = document.getElementById('custom-cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  
  if (!cursor || !cursorTrail) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let trailX = 0;
  let trailY = 0;
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Smooth cursor animation
  function animateCursor() {
    // Main cursor follows mouse with slight delay
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Trail follows cursor with more delay
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Change cursor style based on element type
  function updateCursorStyle() {
    // Interactive elements (buttons, links, clickable items)
    const interactiveElements = document.querySelectorAll('button, a, .btn, .nav-link, .skill-node, .project-card, input, textarea, select');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.remove('cursor-sword', 'cursor-pointer');
        cursor.classList.add('cursor-brush');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-brush', 'cursor-pointer');
        cursor.classList.add('cursor-sword');
      });
    });
    
    // Text elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li');
    
    textElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.remove('cursor-sword', 'cursor-brush');
        cursor.classList.add('cursor-pointer');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-brush', 'cursor-pointer');
        cursor.classList.add('cursor-sword');
      });
    });
  }
  
  // Initialize after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCursorStyle);
  } else {
    updateCursorStyle();
  }
  
  // Update cursor styles when new elements are added (for game elements)
  const observer = new MutationObserver(() => {
    updateCursorStyle();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '0.5';
  });
  
})();