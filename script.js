// ===================================
// NAVIGATION MOBILE
// ===================================

// Récupération des éléments
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// Toggle du menu mobile
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Gestion de l'accessibilité
    const isExpanded = navMenu.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
    
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = isExpanded ? 'hidden' : '';
});

// Fermer le menu quand on clique sur un lien
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// Fermer le menu en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// ===================================
// SMOOTH SCROLL
// ===================================

// Amélioration du smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80; // Hauteur du header fixe
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// ACTIVE LINK ON SCROLL
// ===================================

// Mise à jour du lien actif selon la section visible
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Écouter le scroll avec throttle pour optimiser les performances
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        setActiveLink();
    });
});

// ===================================
// ANIMATIONS ON SCROLL
// ===================================

// Observer pour les animations au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments avec animation
const animatedElements = document.querySelectorAll('.service-card, .stat-card');
animatedElements.forEach(el => {
    observer.observe(el);
});

// ===================================
// GESTION DU HEADER AU SCROLL
// ===================================

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Ajouter une ombre au header quand on scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// LAZY LOADING DES IMAGES
// ===================================

// Lazy loading natif supporté par la plupart des navigateurs modernes
// Si besoin d'un support plus ancien, on peut utiliser IntersectionObserver
// if ('loading' in HTMLImageElement.prototype) {
//     const images = document.querySelectorAll('img[loading="lazy"]');
//     images.forEach(img => {
//         img.src = img.dataset.src;
//     });
// } else {
//     // Fallback pour les navigateurs plus anciens
//     const imageObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const img = entry.target;
//                 img.src = img.dataset.src;
//                 imageObserver.unobserve(img);
//             }
//         });
//     });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

// ===================================
// PERFORMANCE: Réduire les animations si demandé
// ===================================

// Respecter la préférence utilisateur pour réduire les animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Désactiver toutes les animations CSS
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-base', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

// ===================================
// CONSOLE MESSAGE
// ===================================

// ===================================
// FORMULAIRE DE CONTACT AJAX
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            const formMessage = document.getElementById('formMessage');
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
                el.style.display = 'none';
            });
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
            
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
            
            // Collect form data
            const formData = {
                name: document.getElementById('id_name').value,
                contact: document.getElementById('id_contact').value,
                email: document.getElementById('id_email').value,
                sujet: document.getElementById('id_sujet').value,
                message: document.getElementById('id_message').value
            };
            
            // Send AJAX request
            fetch('/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                formMessage.style.display = 'block';
                
                if (data.success) {
                    // Show success message
                    formMessage.className = 'form-message success';
                    formMessage.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>${data.message}</span>
                    `;
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    // Show error message
                    formMessage.className = 'form-message error';
                    formMessage.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>${data.message}</span>
                    `;
                    
                    // Display field errors
                    if (data.errors) {
                        for (const [field, error] of Object.entries(data.errors)) {
                            const errorEl = document.getElementById(`${field}_error`);
                            if (errorEl) {
                                errorEl.textContent = error;
                                errorEl.style.display = 'block';
                            }
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formMessage.style.display = 'block';
                formMessage.className = 'form-message error';
                formMessage.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>Une erreur est survenue. Veuillez réessayer.</span>
                `;
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            });
        });
    }
});
