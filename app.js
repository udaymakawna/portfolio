// ========================================
// APP.JS - Main Application Logic
// ========================================

(function() {
  'use strict';
  
  // Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mainNav = document.getElementById('main-nav');
  
  // Section navigation
  function navigateToSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Smooth scroll to top of section
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update active nav link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
    
    // Close mobile menu
    if (navMenu) {
      navMenu.classList.remove('active');
    }
  }
  
  // Nav link click handlers
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      navigateToSection(sectionId);
    });
  });
  
  // Mobile menu toggle
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Hero CTA button navigation
  const ctaButtons = document.querySelectorAll('[data-navigate]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetSection = button.getAttribute('data-navigate');
      navigateToSection(targetSection);
    });
  });
  
  // Scroll effects
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow to nav on scroll
    if (currentScroll > 100) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Intersection Observer for section animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all sections except home (already active)
  sections.forEach((section, index) => {
    if (index > 0) { // Skip home section
      sectionObserver.observe(section);
    }
  });
  
  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      // Simulate form submission (replace with actual API call)
      formStatus.textContent = 'Sending message...';
      formStatus.className = 'form-status';
      formStatus.style.display = 'block';
      
      setTimeout(() => {
        formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }
  
  // Easter Egg - Legendary Mode
  let keySequence = [];
  const secretCode = ['j', 'i', 'n'];
  const legendaryOverlay = document.getElementById('legendary-overlay');
  let isLegendaryMode = false;
  
  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keySequence.push(key);
    
    // Keep only last 3 keys
    if (keySequence.length > 3) {
      keySequence.shift();
    }
    
    // Check if secret code matches
    if (keySequence.join('') === secretCode.join('') && !isLegendaryMode) {
      activateLegendaryMode();
    } else if (e.key === 'Escape' && isLegendaryMode) {
      deactivateLegendaryMode();
    }
  });
  
  function activateLegendaryMode() {
    isLegendaryMode = true;
    document.body.classList.add('legendary-mode');
    legendaryOverlay.classList.remove('hidden');
    
    // Show notification
    showNotification('🏆 LEGENDARY MODE ACTIVATED 🏆', 'You have unlocked the Ghost\'s true power!');
  }
  
  function deactivateLegendaryMode() {
    isLegendaryMode = false;
    document.body.classList.remove('legendary-mode');
    legendaryOverlay.classList.add('hidden');
  }
  
  function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(10, 10, 10, 0.98);
      border: 2px solid #FFD700;
      border-radius: 12px;
      padding: 2rem;
      z-index: 10000;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 10px 50px rgba(255, 215, 0, 0.4);
      animation: fadeInUp 0.5s ease;
    `;
    
    notification.innerHTML = `
      <h3 style="font-family: 'Crimson Text', serif; color: #FFD700; margin-bottom: 1rem; font-size: 1.8rem;">${title}</h3>
      <p style="color: #F5F1DE; margin: 0;">${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
  
  // Parallax effect on hero section
  const heroSection = document.getElementById('home');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
      }
    });
  }
  
  // Skill nodes interaction
  const skillNodes = document.querySelectorAll('.skill-node');
  skillNodes.forEach(node => {
    node.addEventListener('click', () => {
      // Add pulse animation on click
      node.style.animation = 'pulse 0.5s ease';
      setTimeout(() => {
        node.style.animation = '';
      }, 500);
    });
  });
  
  // Project cards hover effect enhancement
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Add glow effect to nearby cards
      projectCards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.style.opacity = '0.7';
        }
      });
    });
    
    card.addEventListener('mouseleave', () => {
      projectCards.forEach(otherCard => {
        otherCard.style.opacity = '1';
      });
    });
  });
  
  // Achievement cards stagger animation
  const achievementCards = document.querySelectorAll('.achievement-card');
  achievementCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
  
  // Initialize page
  function init() {
    // Ensure home section is active on load
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.classList.add('active');
    }
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
    
    console.log('%c🎮 Welcome to Uday Makawna\'s Portfolio', 'font-size: 20px; color: #FFD700; font-weight: bold;');
    console.log('%cType "Jin" to unlock Legendary Mode 🏆', 'font-size: 14px; color: #8B0000;');
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();