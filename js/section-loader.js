// ===================================
// OPTIMIZED SECTION LOADER
// Lazy load sections with Intersection Observer
// Pause animations when not visible
// ===================================

// Check if browser supports IntersectionObserver
if ('IntersectionObserver' in window) {
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Section is visible - animate it
                entry.target.classList.add('visible');
                
                // Resume animations
                const animations = entry.target.querySelectorAll('.project-card, .prompt-card');
                animations.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
                
                console.log(`✅ Section visible: ${entry.target.id}`);
            } else {
                // Section not visible - pause animations for performance
                const animations = entry.target.querySelectorAll('.project-card, .prompt-card');
                animations.forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Make first section visible immediately
    const firstSection = document.querySelector('.section');
    if (firstSection) {
        firstSection.classList.add('visible');
    }
    
    console.log('👁️ Intersection Observer initialized - lazy loading sections');
    
} else {
    // Fallback: show all sections immediately
    console.warn('⚠️ IntersectionObserver not supported. Showing all sections.');
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('visible');
    });
}

// ===================================
// LOW-END DEVICE DETECTION
// ===================================

function isLowEndDevice() {
    const ram = navigator.deviceMemory;
    const cores = navigator.hardwareConcurrency;
    
    if ((ram && ram < 4) || (cores && cores < 4)) {
        return true;
    }
    return false;
}

// Remove floating orbs on low-end devices
if (isLowEndDevice()) {
    document.body.classList.add('low-end-device');
    document.querySelectorAll('.floating-orbs').forEach(orb => {
        orb.style.display = 'none';
    });
    console.log('⚡ Low-end device detected - optimizations applied');
}

// ===================================
// REDUCE MOTION SUPPORT
// ===================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduce-motion');
    console.log('♿ Reduced motion preference detected');
}
