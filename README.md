# Uday Makawna - Game Designer Portfolio

A modern, minimalist portfolio website built for a Game Designer specializing in PC games and RPGs. Features Three.js 3D animations, interactive mini-games, and automated contact form.

![Portfolio Preview](preview.png)

---

## 🎮 Features

### Visual Design
- **Modern Minimalist Aesthetic** - Clean dark theme with purple accent (#6366f1)
- **Three.js 3D Background** - Animated particles and wireframe shapes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Scroll-triggered reveals and hover effects

### Interactive Elements
- **3D Hero Visual** - Rotating octahedron in the hero section
- **Playground Section** - 4 interactive mini-games:
  - 🎲 **3D Cube Runner** - Drag to rotate wireframe cube
  - ✨ **Particle System** - Mouse-interactive particle network
  - 🎯 **Memory Match** - Classic emoji matching game
  - ⚡ **Reaction Test** - Test your reflexes

### Functional Features
- **EmailJS Contact Form** - Automated email sending
- **Smooth Scroll Navigation** - Seamless section navigation
- **Active Section Highlighting** - Dynamic nav link updates
- **Mobile Hamburger Menu** - Touch-friendly navigation

---

## 📁 File Structure

```
game-portfolio/
├── index.html      # Main HTML structure
├── styles.css      # All CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This documentation
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 | Modern styling with custom properties |
| JavaScript (ES6+) | Interactivity and animations |
| Three.js | 3D graphics and animations |
| EmailJS | Contact form email automation |
| Font Awesome | Icon library |
| Google Fonts | Space Grotesk + Inter typography |

---

## 🚀 Quick Start

### View Locally
Simply open `index.html` in any modern web browser:
```
game-portfolio/index.html
```

### Run with Local Server (Recommended)
```bash
cd game-portfolio
npx serve .
```
Then open `http://localhost:3000`

---

## 📧 EmailJS Configuration

The contact form is configured with EmailJS to send emails automatically.

### Current Configuration
Located in `script.js` (around line 128):
```javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'BZZbHZHWcT9v1h9gQ',
    SERVICE_ID: 'service_2aok68p',
    TEMPLATE_ID: 'template_zn8det6'
};
```

### Email Template Variables
Your EmailJS template should include these variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email address
- `{{subject}}` - Email subject
- `{{message}}` - Message content
- `{{to_name}}` - Recipient name (Uday Makawna)
- `{{reply_to}}` - Reply-to address

### Free Tier Limits
- 200 emails/month
- Resets on the 20th of each month

---

## 🎨 Customization Guide

### Change Colors
Edit CSS variables in `styles.css` (line 1-40):
```css
:root {
    --bg-primary: #0a0a0a;      /* Main background */
    --highlight: #6366f1;        /* Accent color */
    --text-primary: #ffffff;     /* Main text color */
    /* ... more variables */
}
```

### Update Personal Info
Edit `index.html`:
- **Name**: Search for "Uday Makawna" and replace
- **Title**: Update hero subtitle and badges
- **Contact**: Update email, phone, and social links
- **Experience**: Modify the experience cards
- **Skills**: Adjust skill percentages

### Add Profile Photo
Replace the placeholder icon in the hero section:
```html
<!-- In index.html, replace the hero-visual div content -->
<img src="your-photo.jpg" alt="Your Name" class="profile-photo">
```

### Add Project Images
Replace placeholder icons in project cards:
```html
<div class="project-image">
    <img src="project-screenshot.jpg" alt="Project Name">
</div>
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Description |
|------------|-------------|
| > 992px | Full desktop layout |
| 768px - 992px | Tablet layout |
| < 768px | Mobile layout with hamburger menu |
| < 480px | Small mobile, stacked buttons |

---

## 🔧 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (not supported)

---

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select main branch and save
4. Site will be live at `yourusername.github.io/repo-name`

### Netlify (Free)
1. Drag and drop folder to [netlify.com/drop](https://netlify.com/drop)
2. Or connect GitHub repo for auto-deploys

### Vercel (Free)
1. Import project at [vercel.com](https://vercel.com)
2. Automatic SSL and CDN included

---

## 📊 Site Sections

| Section | Description |
|---------|-------------|
| **Hero** | Introduction with name, title, and stats |
| **About** | Bio and key achievements |
| **Experience** | Work history cards |
| **Projects** | Portfolio of game design work |
| **Playground** | Interactive mini-game demos |
| **Skills** | Technical and soft skills |
| **Education** | Academic background |
| **Contact** | Form with email automation |

---

## 🎯 Performance Tips

1. **Optimize Images**: Compress before uploading
2. **Lazy Loading**: Add `loading="lazy"` to images
3. **Minify CSS/JS**: For production deployment
4. **CDN**: All libraries load from CDN

---

## 📝 License

This portfolio is created for **Uday Makawna**. Feel free to use as a template for your own portfolio.

---

## 📞 Contact

**Uday Makawna**
- 📧 Email: udaymakawna@gmail.com
- 📱 Phone: +91 93138 38248
- 💼 LinkedIn: [linkedin.com/in/uday-makawna](https://www.linkedin.com/in/uday-makawna)
- 🐙 GitHub: [github.com/udaymakawna](https://github.com/udaymakawna)
- 🐦 Twitter: [@udaymak7](https://twitter.com/udaymak7)
- 💬 Discord: lerebel

---

*Built with ❤️ for gaming*
