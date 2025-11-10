// ========================================
// VARIABLES GLOBALES
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ========================================
// NAVIGATION MOBILE
// ========================================
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Fermer le menu mobile au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// ========================================
// NAVIGATION - SCROLL ACTIVE
// ========================================
window.addEventListener('scroll', () => {
    // Navbar transparence au scroll
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }

    // Active link selon la section visible
    let current = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// ANIMATIONS AU SCROLL
// ========================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observer les éléments à animer
const animatedElements = document.querySelectorAll('.massage-card, .feature-item, .gallery-item, .contact-item, .certification-badge');
animatedElements.forEach(el => observer.observe(el));

// La gestion de la réservation est maintenant dans booking.js et integration.js

// ========================================
// SMOOTH SCROLL POUR TOUS LES LIENS D'ANCRE
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offset = 80; // Hauteur de la navbar
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// ANIMATION DU SCROLL INDICATOR
// ========================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// La gestion des créneaux horaires est maintenant dans booking.js

// ========================================
// INITIALISATION
// ========================================
console.log('🌺 Site Zen Réunion chargé avec succès !');
console.log('📝 Pour la phase 2, nous intégrerons :');
console.log('  - Paiement Stripe');
console.log('  - Google Calendar API');
console.log('  - Notifications email/SMS');
