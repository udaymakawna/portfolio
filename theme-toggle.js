// ========================================
// THEME-TOGGLE.JS - Dark/Light Mode Switcher
// ========================================

(function() {
  'use strict';
  
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  
  // Theme state stored in memory (not localStorage due to sandbox)
  let currentTheme = 'dark';
  
  // Check system preference
  function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }
  
  // Apply theme
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      if (themeIcon) {
        themeIcon.textContent = '☀️';
      }
    } else {
      document.body.classList.remove('light-mode');
      if (themeIcon) {
        themeIcon.textContent = '🌙';
      }
    }
    currentTheme = theme;
  }
  
  // Toggle theme
  function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    
    // Smooth transition effect
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    // Show notification
    showThemeNotification(newTheme);
  }
  
  // Show theme change notification
  function showThemeNotification(theme) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${theme === 'dark' ? 'rgba(10, 10, 10, 0.95)' : 'rgba(248, 246, 240, 0.95)'};
      border: 2px solid ${theme === 'dark' ? '#FFD700' : '#8B0000'};
      border-radius: 8px;
      padding: 1rem 1.5rem;
      z-index: 10000;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
      <p style="margin: 0; color: ${theme === 'dark' ? '#F5F1DE' : '#0d0d0d'}; font-weight: 500;">
        ${theme === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode Activated
      </p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(20px)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }
  
  // Initialize theme
  function initTheme() {
    // Use system preference as initial theme
    const initialTheme = detectSystemTheme();
    applyTheme(initialTheme);
  }
  
  // Event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      const newTheme = e.matches ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }
  
  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
  
  // Add slideInRight animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);
  
})();