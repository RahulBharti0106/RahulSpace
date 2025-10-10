// ===================================
// SECTION LOADER & VISIBILITY
// ===================================

(function() {
    'use strict';
    
    const sections = document.querySelectorAll('.section');
    
    // Intersection Observer for section visibility
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger animations for child elements
                const animatedElements = entry.target.querySelectorAll('[data-aos]');
                animatedElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                });
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '-50px'
    });
    
    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Preload images for better performance
    function preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Initialize preloading
    preloadImages();
    
    // Performance optimization: Lazy load sections
    const lazyLoadSections = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                section.style.willChange = 'opacity, transform';
            } else {
                section.style.willChange = 'auto';
            }
        });
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                lazyLoadSections();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    console.log('✨ Section loader initialized');
    
})();
