// ===================================
// MAIN PORTFOLIO JAVASCRIPT - OPTIMIZED
// ===================================

// ===================================
// SMOOTH NAVBAR BEHAVIOR
// ===================================

const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
}, { passive: true });

// ===================================
// MOBILE MENU TOGGLE
// ===================================

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===================================
// SMOOTH SCROLL TO SECTIONS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const navHeight = navbar ? navbar.offsetHeight : 60;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// ACTIVE NAV LINK HIGHLIGHTING
// ===================================

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const highlightNav = debounce(() => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - (navbar ? navbar.offsetHeight : 60) - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 50);

window.addEventListener('scroll', highlightNav, { passive: true });

// ===================================
// CONTACT FORM HANDLING
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        if (!formData.name || !formData.email || !formData.message) {
            alert('❌ Please fill in all required fields!');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('❌ Please enter a valid email address!');
            return;
        }
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const { error } = await supabaseClient
                .from('contacts')
                .insert([formData]);
            
            if (error) throw error;
            
            alert('✅ Message sent successfully! I\'ll get back to you soon.');
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('❌ Failed to send message. Please try again or email me directly.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===================================
// KEYBOARD NAVIGATION SUPPORT
// ===================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        if (menuToggle) menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===================================
// PREVENT ZOOM ON DOUBLE TAP (MOBILE)
// ===================================

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// ===================================
// PERFORMANCE MONITORING
// ===================================

window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log('%c🚀 Performance Report', 'color: #6366f1; font-size: 16px; font-weight: bold;');
        console.log(`⏱️ Page Load Time: ${pageLoadTime}ms`);
        
        if (pageLoadTime < 2000) {
            console.log('%c✅ Excellent Performance!', 'color: #10b981; font-weight: bold;');
        } else if (pageLoadTime < 3000) {
            console.log('%c⚠️ Good Performance', 'color: #f59e0b; font-weight: bold;');
        } else {
            console.log('%c❌ Needs Optimization', 'color: #ef4444; font-weight: bold;');
        }
    }
});

// ===================================
// INITIALIZE ON DOM READY
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Portfolio initialized successfully!');
});

console.log('%c✨ Main script loaded!', 'color: #10b981; font-weight: bold;');
