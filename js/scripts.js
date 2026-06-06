/* ============================================
   PASSERELLE ENVIRONNEMENT - SCRIPTS
   Interactions et navigation
   ============================================ */

// ============================================
// MENU MOBILE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('navToggle');
    const links  = document.getElementById('navLinks');

    if (toggle && links) {
        toggle.addEventListener('click', function() {
            links.classList.toggle('open');
        });

        // Fermer le menu si on clique ailleurs
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !links.contains(e.target)) {
                links.classList.remove('open');
            }
        });
    }
});

// ============================================
// NAVIGATION ACTIVE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Détecte la page actuelle et marque le lien nav comme actif
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// ANIMATIONS AU SCROLL (Intersection Observer)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer toutes les cartes
document.querySelectorAll('.intro-card, .domaine-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ============================================
// GESTION DES FORMULAIRES (stub)
// ============================================

// À utiliser pour le questionnaire, le formulaire de contact, etc.
function handleFormSubmit(formId, callback) {
    const form = document.getElementById(formId);
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupère les données
            const formData = new FormData(form);
            
            if (callback) {
                callback(formData);
            }
            
            // Par défaut, affiche un message de succès
            alert('Formulaire envoyé avec succès !');
        });
    }
}

// ============================================
// UTILITAIRES
// ============================================

// Scroll vers le haut
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Détecte si on est sur mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// ============================================
// LOGS (À SUPPRIMER EN PRODUCTION)
// ============================================

console.log('✅ Scripts de Passerelle Environnement chargés');
