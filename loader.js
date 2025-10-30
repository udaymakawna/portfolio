// ========================================
// LOADER.JS - Loading Screen Animation
// ========================================

(function() {
  'use strict';
  
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar');
  const loadingPercentage = document.querySelector('.loading-percentage');
  
  let progress = 0;
  const loadingDuration = 3000; // 3 seconds
  const updateInterval = 30;
  const progressIncrement = (100 / (loadingDuration / updateInterval));
  
  // Simulate loading progress
  const loadingInterval = setInterval(() => {
    progress += progressIncrement;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Hide loading screen after a brief delay
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Trigger home section animation
        const homeSection = document.getElementById('home');
        if (homeSection) {
          homeSection.classList.add('active');
        }
      }, 500);
    }
    
    // Update loading bar and percentage
    loadingBar.style.width = progress + '%';
    loadingPercentage.textContent = Math.floor(progress) + '%';
  }, updateInterval);
  
  // Prevent scrolling during loading
  document.body.style.overflow = 'hidden';
  
  // Samurai quotes rotation
  const quotes = [
    '"The way of the warrior is found in death..."',
    '"Honor the code, master the craft..."',
    '"In stillness, power awaits..."',
    '"The blade reflects the soul..."',
    '"Every journey begins with courage..."'
  ];
  
  const quoteElement = document.querySelector('.loading-quote');
  if (quoteElement) {
    // Randomly select a quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = randomQuote;
  }
  
})();