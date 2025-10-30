// ============================
// PORTFOLIO APP - FIXED & COMPLETE
// Ghost of Tsushima inspired with modern performance optimizations
// ============================

// State Management
let currentLanguage = 'en';
let currentTheme = 'dark';
let currentSection = 'home';
let portfolioData = {
  projects: [],
  experiences: [],
  achievements: []
};

// Performance: Cache DOM elements
const DOM = {};
let isInitialized = false;

// Weather System State
const weatherSystem = {
  particles: [],
  windDirection: 0,
  windStrength: 0.5,
  weatherMode: 'clear',
  isActive: false
};

// GSAP Setup
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================
// DATA LOADING
// ============================
async function loadPortfolioData() {
  try {
    portfolioData = {
      profile: {
        name: "Uday Makawna",
        title: "Game Designer",
        location: "Anand, Gujarat, India",
        email: "udaymakawna@gmail.com",
        phone: "+91 93138 38248"
      },
      experiences: [
        {
          id: 1,
          role: "Game Designer",
          company: "Akiyam Solutions Pvt Ltd",
          period: "06/2025 – Present",
          icon: "🎮",
          description: "Designed gameplay systems, detailed level layouts, and player progression mechanics using Unreal Engine Blueprints with focus on player engagement and challenge balance.",
          achievements: [
            "Collaborated with cross-functional teams of artists, developers, and QA to iterate on game flow, UI/UX",
            "Conducted playtests and incorporated player feedback to optimize gameplay dynamics"
          ],
          tags: ["Unreal Engine", "Level Design", "Blueprints"]
        },
        {
          id: 2,
          role: "Intern Game Designer",
          company: "Akiyam Solutions Pvt Ltd",
          period: "01/2025 – 06/2025",
          icon: "🎯",
          description: "Supported level design, mission flow development, and iterative gameplay testing to refine core mechanics.",
          achievements: [
            "Assisted in documenting game design proposals and balancing plans",
            "Improved user satisfaction through iterative testing"
          ],
          tags: ["Level Design", "QA", "Documentation"]
        },
        {
          id: 3,
          role: "Game Designer & Level Designer Intern",
          company: "Arkham Archives",
          period: "05/2024 – 07/2024",
          icon: "📚",
          description: "Developed interactive educational game modules combining gamification and storytelling.",
          achievements: [
            "Enhanced player learning engagement through interactive modules",
            "Supported community management and eSports tournament coordination"
          ],
          tags: ["Educational Games", "eSports", "Community"]
        }
      ],
      projects: [
        {
          id: 1,
          title: "Riverfront Adventure",
          description: "3D level design of a riverfront area. Blockout, terrain sculpting, and lighting inspired by natural Japanese landscapes.",
          tech: "Unreal Engine, Blueprints, Lighting",
          icon: "🏞️",
          process: "Idea sketching to playtesting, iterative blockout with focus on atmospheric storytelling",
          role: "Level Design, Lighting, Atmosphere",
          outcomes: "Implemented dynamic day-night cycle with weather transitions",
          tags: ["Level Design", "Unreal Engine", "Lighting", "Open World"]
        },
        {
          id: 2,
          title: "Townhall Puzzle",
          description: "Top-down puzzle level with adaptive AI challenges and environmental storytelling.",
          tech: "Unreal Engine, Python scripting, AI Behavior Trees",
          icon: "🏛️",
          process: "GDD, logic scripting, QA iteration with player behavior analysis",
          role: "Design, Scripting, AI Design",
          outcomes: "Improved puzzle completion by 30% in user tests through iterative design",
          tags: ["Game Design", "Python", "AI", "Puzzle Design"]
        },
        {
          id: 3,
          title: "Soulforge Prototype",
          description: "Souls-like demo level featuring custom weapon system UI and combat flow.",
          tech: "Unreal Engine, Blender, UI Design",
          icon: "⚔️",
          process: "Combat loop prototyping, UI/UX tests, player feedback iteration",
          role: "Design, UX, Playtesting, Combat Designer",
          outcomes: "Featured in student showcase with positive critical reception",
          tags: ["UI/UX", "Combat Design", "Prototyping", "Souls-like"]
        },
        {
          id: 4,
          title: "Community Server Manager",
          description: "Managed Minecraft server with 10,000+ players, organized events and XP optimization tools.",
          tech: "JavaScript, VS Code, Paper/Bukkit, API",
          icon: "⛏️",
          process: "Server optimization, event planning, player engagement analytics",
          role: "Design, Scripting, Community Management",
          outcomes: "Reduced server lag in active play, increased player retention by 25%",
          tags: ["Optimization", "Minecraft", "JavaScript", "Community"]
        }
      ],
      skills: {
        gameEngines: ["Unreal Engine (Blueprints, Level Design)", "Unity", "Godot"],
        gameDesign: ["Level Design", "Gameplay Scripting", "AI Behavior Design", "Player Experience Optimization", "Game Testing"],
        tools: ["Visual Studio Code", "Git", "Blender", "Midjourney", "Twinmotion", "Quixel Bridge"],
        soft: ["Creative Problem-Solving", "Analytical Thinking", "Team Collaboration", "Communication"]
      }
    };
    
    console.log('✓ Portfolio data loaded successfully');
  } catch (e) {
    console.error('✗ Failed to load portfolio data:', e);
  }
}

// ============================
// INITIALIZATION
// ============================
async function init() {
  if (isInitialized) return;
  
  try {
    await loadPortfolioData();
    
    // Cache DOM elements
    cacheDOMElements();
    
    // Initialize all modules
    initNavigation();
    initThemeToggle();
    initLanguageToggle();
    initWeatherSystem();
    initExperiences();
    initProjects();
    initSkills();
    initModal();
    initContactForm();
    initScrollEffects();
    initAnimations();
    
    isInitialized = true;
    console.log('🎌 Portfolio initialized - Tsushima style!');
  } catch (err) {
    console.error('✗ Portfolio initialization failed:', err);
  }
}

function cacheDOMElements() {
  DOM.navbar = document.getElementById('navbar');
  DOM.mobileMenuBtn = document.getElementById('mobileMenuBtn');
  DOM.mobileMenu = document.getElementById('mobileMenu');
  DOM.weatherCanvas = document.getElementById('weatherCanvas');
  DOM.projectModal = document.getElementById('projectModal');
  DOM.modalContent = document.getElementById('modalContent');
  DOM.closeModal = document.getElementById('closeModal');
  DOM.scrollToTop = document.getElementById('scrollToTop');
  DOM.mainContent = document.querySelector('.main-content');
}

// ============================
// WEATHER SYSTEM
// ============================
function initWeatherSystem() {
  const canvas = DOM.weatherCanvas;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  class WeatherParticle {
    constructor(type = 'sakura') {
      this.reset();
      this.type = type;
    }
    
    reset() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight - window.innerHeight;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = Math.random() * 2 + 1;
      this.size = Math.random() * 4 + 2;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
    }
    
    update() {
      this.x += this.vx + weatherSystem.windStrength * Math.cos(weatherSystem.windDirection);
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      
      if (this.y > window.innerHeight || this.x < -50 || this.x > window.innerWidth + 50) {
        this.reset();
      }
    }
    
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = this.opacity;
      
      if (this.type === 'sakura') {
        ctx.fillStyle = '#FFB7C5';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'rain') {
        ctx.strokeStyle = '#A0C4FF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.size * 3);
        ctx.stroke();
      } else if (this.type === 'fog') {
        ctx.fillStyle = '#E0E7FF';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
  
  function createParticles(count = 50, type = 'sakura') {
    weatherSystem.particles = [];
    for (let i = 0; i < count; i++) {
      weatherSystem.particles.push(new WeatherParticle(type));
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    weatherSystem.particles.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
    
    if (weatherSystem.isActive) {
      animationId = requestAnimationFrame(animate);
    }
  }
  
  window.setWeather = function(mode = 'sakura') {
    weatherSystem.weatherMode = mode;
    weatherSystem.isActive = mode !== 'clear';
    
    if (weatherSystem.isActive) {
      if (mode === 'sakura') {
        createParticles(80, 'sakura');
        weatherSystem.windStrength = 0.8;
      } else if (mode === 'rain') {
        createParticles(150, 'rain');
        weatherSystem.windStrength = 1.2;
      } else if (mode === 'fog') {
        createParticles(40, 'fog');
        weatherSystem.windStrength = 0.3;
      }
      animate();
    } else {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  window.setWeather('sakura');
}

// ============================
// NAVIGATION
// ============================
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuBtn = DOM.mobileMenuBtn;
  const mobileMenu = DOM.mobileMenu;
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetSection = e.currentTarget?.dataset.section;
      if (targetSection) {
        navigateToSection(targetSection);
        
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
  
  mobileMenuBtn?.addEventListener('click', () => {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
  });
}

function navigateToSection(sectionId) {
  const sections = document.querySelectorAll('.section-content');
  const navLinks = document.querySelectorAll('.nav-link');
  
  sections.forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  
  const target = document.getElementById(sectionId);
  if (!target) return;
  
  target.classList.remove('hidden');
  target.classList.add('active');
  
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.dataset.section === sectionId) {
      l.classList.add('active');
    }
  });
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  if (window.gsap) {
    gsap.from(target, {
      opacity: 0,
      x: 100,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
}

// ============================
// THEME & LANGUAGE
// ============================
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  themeToggle?.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
  });
}

function initLanguageToggle() {
  const langToggle = document.getElementById('langToggle');
  
  langToggle?.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'jp' : 'en';
    langToggle.textContent = currentLanguage === 'en' ? 'EN' : '日本語';
  });
}

// ============================
// EXPERIENCES
// ============================
function initExperiences() {
  const container = document.querySelector('#experience .timeline');
  if (!container || !portfolioData.experiences) return;
  
  portfolioData.experiences.forEach((exp, index) => {
    const card = document.createElement('div');
    card.className = 'glass-card timeline-item';
    
    card.innerHTML = `
      <h3>${exp.role}</h3>
      <div class="company">${exp.company}</div>
      <div class="period">${exp.period}</div>
      <p>${exp.description}</p>
      <ul>
        ${exp.achievements.map(achievement => `
          <li>${achievement}</li>
        `).join('')}
      </ul>
      <div class="tags">
        ${exp.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    `;
    
    container.appendChild(card);
    
    if (window.gsap) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  });
}

// ============================
// PROJECTS
// ============================
function initProjects() {
  const container = document.querySelector('#projects .grid');
  if (!container || !portfolioData.projects) return;
  
  portfolioData.projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'glass-card project-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View details for ${project.title}`);
    
    card.innerHTML = `
      <div class="project-image">${project.icon}</div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">${project.tech}</div>
      </div>
    `;
    
    card.addEventListener('click', () => openProjectModal(project));
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(project);
      }
    });
    
    container.appendChild(card);
    
    if (window.gsap) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power3.out'
      });
    }
  });
}

function openProjectModal(project) {
  const modal = DOM.projectModal;
  const modalContent = DOM.modalContent;
  if (!modal || !modalContent) return;
  
  modalContent.innerHTML = `
    <h2>${project.title}</h2>
    <div style="text-align: center; font-size: 3rem; margin: 1.5rem 0;">${project.icon}</div>
    <div style="space-y: 1.5rem;">
      <div>
        <h3 style="color: rgba(168, 85, 247, 1); margin-bottom: 0.75rem;">Overview</h3>
        <p>${project.description}</p>
      </div>
      <div>
        <h3 style="color: rgba(168, 85, 247, 1); margin-bottom: 0.75rem;">Technology Stack</h3>
        <p>${project.tech}</p>
      </div>
      <div>
        <h3 style="color: rgba(168, 85, 247, 1); margin-bottom: 0.75rem;">Process</h3>
        <p>${project.process}</p>
      </div>
      <div>
        <h3 style="color: rgba(168, 85, 247, 1); margin-bottom: 0.75rem;">My Role</h3>
        <p>${project.role}</p>
      </div>
      <div>
        <h3 style="color: rgba(168, 85, 247, 1); margin-bottom: 0.75rem;">Outcomes</h3>
        <p>${project.outcomes}</p>
      </div>
      <div class="tags" style="margin-top: 1.5rem;">
        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  modal.focus();
}

// ============================
// MODAL
// ============================
function initModal() {
  const modal = DOM.projectModal;
  const closeBtn = DOM.closeModal;
  
  if (!modal) return;
  
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

function closeModal() {
  const modal = DOM.projectModal;
  if (!modal) return;
  
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// ============================
// SKILLS
// ============================
function initSkills() {
  const container = document.querySelector('#skills .skills-grid');
  if (!container || !portfolioData.skills) return;
  
  const skillCategories = [
    { title: 'Game Engines', skills: portfolioData.skills.gameEngines, icon: '🎮' },
    { title: 'Game Design', skills: portfolioData.skills.gameDesign, icon: '🎯' },
    { title: 'Tools & Software', skills: portfolioData.skills.tools, icon: '🛠️' },
    { title: 'Soft Skills', skills: portfolioData.skills.soft, icon: '💡' }
  ];
  
  skillCategories.forEach((category, index) => {
    const card = document.createElement('div');
    card.className = 'glass-card skill-category';
    
    card.innerHTML = `
      <h3><span class="skill-category-icon">${category.icon}</span>${category.title}</h3>
      <ul>
        ${category.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
    `;
    
    container.appendChild(card);
    
    if (window.gsap) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: index * 0.15,
        ease: 'power3.out'
      });
    }
  });
}

// ============================
// CONTACT FORM
// ============================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    console.log('Form submitted:', data);
    showNotification('✓ Message sent successfully!');
    form.reset();
  });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  if (window.gsap) {
    gsap.from(notification, { x: 100, opacity: 0, duration: 0.3, ease: 'power2.out' });
    setTimeout(() => {
      gsap.to(notification, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => notification.remove()
      });
    }, 3000);
  } else {
    setTimeout(() => notification.remove(), 3000);
  }
}

// ============================
// SCROLL EFFECTS
// ============================
function initScrollEffects() {
  const scrollBtn = DOM.scrollToTop;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn?.classList.remove('hidden');
    } else {
      scrollBtn?.classList.add('hidden');
    }
    
    if (DOM.navbar) {
      if (window.scrollY > 50) {
        DOM.navbar.style.backdropFilter = 'blur(20px)';
        DOM.navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
      } else {
        DOM.navbar.style.backdropFilter = 'blur(10px)';
        DOM.navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
      }
    }
  });
  
  scrollBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================
// ANIMATIONS
// ============================
function initAnimations() {
  if (!window.gsap) return;
  
  gsap.from('#home h1', {
    opacity: 0,
    x: -100,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  });
  
  gsap.from('#home .hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.6,
    ease: 'power2.out'
  });
}

// ============================
// APP INITIALIZATION
// ============================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
