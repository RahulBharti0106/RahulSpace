// ===================================
// FLOATING CAT ANIMATION
// ===================================

(function() {
    'use strict';
    
    const floatingCat = document.getElementById('floating-cat');
    const catToggle = document.getElementById('cat-toggle');
    
    let mouseX = 0;
    let mouseY = 0;
    let catX = 0;
    let catY = 0;
    let isEnabled = localStorage.getItem('catAnimation') !== 'false';
    let isTyping = false; // NEW: Track typing state
    let typingTimeout; // NEW: Timeout for typing detection
    
    // Apply saved preference
    if (!isEnabled) {
        floatingCat.style.display = 'none';
        catToggle.style.opacity = '0.5';
    }
    
    // Cat toggle event listener
    if (catToggle) {
        catToggle.addEventListener('click', () => {
            isEnabled = !isEnabled;
            
            // Save preference to localStorage
            localStorage.setItem('catAnimation', isEnabled);
            
            // Toggle visibility
            if (isEnabled) {
                floatingCat.style.display = 'block';
                catToggle.style.opacity = '1';
                console.log('🐱 Cat animation enabled');
            } else {
                floatingCat.style.display = 'none';
                catToggle.style.opacity = '0.5';
                console.log('🐱 Cat animation disabled');
            }
            
            // Add click animation
            catToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                catToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // NEW: Hide cat when typing in inputs/textareas
    const allInputs = document.querySelectorAll('input, textarea');
    
    allInputs.forEach(input => {
        // When user focuses on input
        input.addEventListener('focus', () => {
            isTyping = true;
            floatingCat.style.opacity = '0.2';
            floatingCat.style.transform = 'translate(-50%, -50%) scale(0.5)';
            console.log('🐱 Cat hidden - typing mode');
        });
        
        // When user leaves input
        input.addEventListener('blur', () => {
            isTyping = false;
            floatingCat.style.opacity = '1';
            floatingCat.style.transform = 'translate(-50%, -50%) scale(1)';
            console.log('🐱 Cat visible - typing ended');
        });
        
        // Also detect typing
        input.addEventListener('input', () => {
            isTyping = true;
            floatingCat.style.opacity = '0.2';
            floatingCat.style.transform = 'translate(-50%, -50%) scale(0.5)';
            
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                if (document.activeElement !== input) {
                    isTyping = false;
                    floatingCat.style.opacity = '1';
                    floatingCat.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            }, 1500);
        });
    });
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        if (!isEnabled) return;
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Touch support for mobile
    document.addEventListener('touchmove', (e) => {
        if (!isEnabled) return;
        
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
    });
    
    // Animate cat position with smooth following effect
    function animateCat() {
        if (!isEnabled) {
            requestAnimationFrame(animateCat);
            return;
        }
        
        // Smooth following with easing
        const speed = 0.1; // Lower = smoother, slower
        catX += (mouseX - catX) * speed;
        catY += (mouseY - catY) * speed;
        
        // Apply position
        floatingCat.style.left = catX + 'px';
        floatingCat.style.top = catY + 'px';
        
        // Add rotation based on movement direction (only if not typing)
        if (!isTyping) {
            const deltaX = mouseX - catX;
            const angle = Math.atan2(0, deltaX) * (180 / Math.PI);
            floatingCat.style.transform = `translate(-50%, -50%) rotate(${angle * 0.1}deg)`;
        }
        
        requestAnimationFrame(animateCat);
    }
    
    // Start animation loop
    animateCat();
    
    // Add trail effect
    let trailIndex = 0;
    const maxTrails = 10;
    
    setInterval(() => {
        if (!isEnabled || isTyping) return; // NEW: No trail when typing
        
        const trail = document.createElement('div');
        trail.className = 'cat-trail-dot';
        trail.style.left = catX + 'px';
        trail.style.top = catY + 'px';
        trail.style.position = 'fixed';
        trail.style.width = '5px';
        trail.style.height = '5px';
        trail.style.background = 'var(--primary)';
        trail.style.borderRadius = '50%';
        trail.style.opacity = '0.5';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9998';
        trail.style.transition = 'opacity 0.5s ease';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 500);
        }, 100);
        
        trailIndex++;
        if (trailIndex > maxTrails) trailIndex = 0;
    }, 50);
    
})();
