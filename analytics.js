// ========================================
// ANALYTICS.JS - Google Analytics Integration
// ========================================

(function() {
  'use strict';
  
  // Analytics configuration
  const ANALYTICS_CONFIG = {
    trackingId: 'G-XXXXXXXXXX', // Replace with your Google Analytics ID
    enabled: false, // Set to true when ready to track
    debug: true // Set to false in production
  };
  
  // ========================================
  // GOOGLE ANALYTICS SETUP
  // ========================================
  
  function initGoogleAnalytics() {
    if (!ANALYTICS_CONFIG.enabled) {
      if (ANALYTICS_CONFIG.debug) {
        console.log('[Analytics] Tracking disabled. Set ANALYTICS_CONFIG.enabled = true to activate.');
      }
      return;
    }
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.trackingId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.trackingId);
    
    if (ANALYTICS_CONFIG.debug) {
      console.log('[Analytics] Google Analytics initialized with ID:', ANALYTICS_CONFIG.trackingId);
    }
  }
  
  // ========================================
  // EVENT TRACKING FUNCTIONS
  // ========================================
  
  function trackEvent(eventName, eventParams = {}) {
    if (ANALYTICS_CONFIG.debug) {
      console.log('[Analytics] Event:', eventName, eventParams);
    }
    
    if (ANALYTICS_CONFIG.enabled && window.gtag) {
      gtag('event', eventName, eventParams);
    }
  }
  
  function trackPageView(pageName) {
    trackEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
  
  function trackNavigation(sectionName) {
    trackEvent('navigation', {
      section: sectionName,
      event_category: 'Navigation',
      event_label: sectionName
    });
  }
  
  function trackButtonClick(buttonName, buttonLocation) {
    trackEvent('button_click', {
      button_name: buttonName,
      button_location: buttonLocation,
      event_category: 'Engagement'
    });
  }
  
  function trackFormSubmission(formName, success) {
    trackEvent('form_submission', {
      form_name: formName,
      success: success,
      event_category: 'Form',
      event_label: success ? 'Success' : 'Error'
    });
  }
  
  function trackGameStart() {
    trackEvent('game_start', {
      event_category: 'Game',
      event_label: 'Mushin Slash Challenge'
    });
  }
  
  function trackGameEnd(score) {
    trackEvent('game_end', {
      score: score,
      event_category: 'Game',
      event_label: 'Mushin Slash Challenge',
      value: score
    });
  }
  
  function trackVideoPlay(videoTitle) {
    trackEvent('video_play', {
      video_title: videoTitle,
      event_category: 'Video',
      event_label: videoTitle
    });
  }
  
  function trackThemeChange(theme) {
    trackEvent('theme_change', {
      theme: theme,
      event_category: 'Settings',
      event_label: theme
    });
  }
  
  function trackEasterEgg(easterEggName) {
    trackEvent('easter_egg', {
      easter_egg: easterEggName,
      event_category: 'Engagement',
      event_label: easterEggName
    });
  }
  
  // ========================================
  // AUTO-TRACKING SETUP
  // ========================================
  
  function setupAutoTracking() {
    // Track navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const section = link.getAttribute('data-section');
        trackNavigation(section);
      });
    });
    
    // Track CTA buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const buttonText = button.textContent.trim();
        const buttonLocation = button.closest('section')?.id || 'unknown';
        trackButtonClick(buttonText, buttonLocation);
      });
    });
    
    // Track contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', () => {
        // Track attempt
        trackEvent('form_attempt', {
          form_name: 'contact_form',
          event_category: 'Form'
        });
      });
    }
    
    // Track video plays
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
      const placeholder = card.querySelector('.video-placeholder');
      if (placeholder) {
        placeholder.addEventListener('click', () => {
          const videoTitle = card.querySelector('.video-info h3')?.textContent || 'Unknown';
          trackVideoPlay(videoTitle);
        });
      }
    });
    
    // Track game starts
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        trackGameStart();
      });
    }
    
    // Track theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        trackThemeChange(currentTheme);
      });
    }
    
    // Track external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        trackEvent('outbound_link', {
          link_url: link.href,
          link_text: link.textContent.trim(),
          event_category: 'Outbound'
        });
      });
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollTracked = false;
    
    window.addEventListener('scroll', () => {
      const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      
      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;
        
        // Track at 25%, 50%, 75%, and 100%
        if (!scrollTracked) {
          if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
            trackEvent('scroll_depth', { depth: '25%', event_category: 'Engagement' });
            scrollTracked = true;
            setTimeout(() => { scrollTracked = false; }, 1000);
          } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
            trackEvent('scroll_depth', { depth: '50%', event_category: 'Engagement' });
            scrollTracked = true;
            setTimeout(() => { scrollTracked = false; }, 1000);
          } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
            trackEvent('scroll_depth', { depth: '75%', event_category: 'Engagement' });
            scrollTracked = true;
            setTimeout(() => { scrollTracked = false; }, 1000);
          } else if (maxScrollDepth >= 100) {
            trackEvent('scroll_depth', { depth: '100%', event_category: 'Engagement' });
            scrollTracked = true;
          }
        }
      }
    });
  }
  
  // ========================================
  // INITIALIZATION
  // ========================================
  
  function init() {
    // Initialize Google Analytics
    initGoogleAnalytics();
    
    // Setup auto-tracking
    setupAutoTracking();
    
    // Track initial page load
    trackPageView('Portfolio Home');
    
    if (ANALYTICS_CONFIG.debug) {
      console.log('[Analytics] Auto-tracking setup complete');
      console.log('[Analytics] Available tracking functions:', {
        trackEvent,
        trackPageView,
        trackNavigation,
        trackButtonClick,
        trackFormSubmission,
        trackGameStart,
        trackGameEnd,
        trackVideoPlay,
        trackThemeChange,
        trackEasterEgg
      });
    }
  }
  
  // Make tracking functions available globally for manual tracking
  window.portfolioAnalytics = {
    trackEvent,
    trackPageView,
    trackNavigation,
    trackButtonClick,
    trackFormSubmission,
    trackGameStart,
    trackGameEnd,
    trackVideoPlay,
    trackThemeChange,
    trackEasterEgg
  };
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();