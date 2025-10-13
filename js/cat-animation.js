// ===================================
// OPTIMIZED CAT ANIMATION
// Hides when typing, touch-friendly
// ===================================

const floatingCat = document.getElementById('floating-cat');

if (floatingCat) {
    let catX = window.innerWidth / 2;
    let catY = window.innerHeight / 2;
    let targetX = catX;
    let targetY = catY;
    let isTyping = false;
    let isHidden = false;
    let typingTimeout;
    let lastUpdateTime = 0;
    const isMobile = window.innerWidth <= 768;
    const updateInterval = isMobile ? 50 : 33;
    
    // Initialize position
    floatingCat.style.left = catX + 'px';
    floatingCat.style.top = catY + 'px';
    
    console.log('🐱 Cat initialized');
    
    // ===================================
    // DETECT TYPING IN ANY INPUT/TEXTAREA
    // ===================================
    
    function hideWhileTyping() {
        isTyping = true;
        floatingCat.classList.add('typing');
        console.log('🐱 Cat hiding - user is typing');
        
        clearTimeout(typingTimeout);
        
        // Keep cat hidden while typing
        typingTimeout = setTimeout(() => {
            // Only show if no input is focused
            if (document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                isTyping = false;
                floatingCat.classList.remove('typing');
                console.log('🐱 Cat showing - typing stopped');
            }
        }, 1500);
    }
    
    function showCat() {
        isTyping = false;
        floatingCat.classList.remove('typing');
        console.log('🐱 Cat showing - input blurred');
    }
    
    // Listen to ALL inputs and textareas
    const allInputs = document.querySelectorAll('input, textarea');
    
    allInputs.forEach(input => {
        // When user clicks into input
        input.addEventListener('focus', () => {
            hideWhileTyping();
        });
        
        // When user clicks away from input
        input.addEventListener('blur', () => {
            showCat();
        });
        
        // When user types anything
        input.addEventListener('input', () => {
            hideWhileTyping();
        });
        
        // When user presses any key
        input.addEventListener('keydown', () => {
            hideWhileTyping();
        });
    });
    
    // Also detect when clicking into contact form area
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                hideWhileTyping();
            }
        });
    }
    
    // ===================================
    // CAT ANIMATION LOOP
    // ===================================
    
    function updateCatPosition(currentTime) {
        if (currentTime - lastUpdateTime < updateInterval) {
            requestAnimationFrame(updateCatPosition);
            return;
        }
        lastUpdateTime = currentTime;
        
        if (!isTyping && !isHidden) {
            const easing = isMobile ? 0.08 : 0.1;
            catX += (targetX - catX) * easing;
            catY += (targetY - catY) * easing;
            
            floatingCat.style.left = catX + 'px';
            floatingCat.style.top = catY + 'px';
        }
        
        requestAnimationFrame(updateCatPosition);
    }
    
    // ===================================
    // MOUSE/TOUCH TRACKING
    // ===================================
    
    if (isMobile) {
        // MOBILE: Touch events
        let touchTimeout;
        let idleTimeout;
        
        document.addEventListener('touchmove', (e) => {
            if (!isTyping && !touchTimeout) {
                const touch = e.touches[0];
                targetX = touch.clientX - 40;
                targetY = touch.clientY - 50;
                
                touchTimeout = setTimeout(() => {
                    touchTimeout = null;
                }, 50);
            }
        }, { passive: true });
        
        document.addEventListener('touchstart', (e) => {
            if (!isTyping) {
                const touch = e.touches[0];
                targetX = touch.clientX - 40;
                targetY = touch.clientY - 50;
            }
        }, { passive: true });
        
        // Move to corner after no touch
        document.addEventListener('touchend', () => {
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                if (!isTyping) {
                    targetX = window.innerWidth - 70;
                    targetY = window.innerHeight - 150;
                }
            }, 3000);
        });
        
        console.log('🐱 Cat: Mobile touch mode activated');
        
    } else {
        // DESKTOP: Mouse events
        let mouseMoveTimeout;
        
        document.addEventListener('mousemove', (e) => {
            if (!isTyping && !mouseMoveTimeout) {
                targetX = e.clientX - 40;
                targetY = e.clientY - 50;
                
                mouseMoveTimeout = setTimeout(() => {
                    mouseMoveTimeout = null;
                }, 16);
            }
        });
        
        console.log('🐱 Cat: Desktop mouse mode activated');
    }
    
    // ===================================
    // HIDE CAT ON BUTTON/LINK CLICKS
    // ===================================
    
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || 
            e.target.tagName === 'A' ||
            e.target.classList.contains('btn')) {
            
            isHidden = true;
            floatingCat.classList.add('hidden');
            
            setTimeout(() => {
                isHidden = false;
                floatingCat.classList.remove('hidden');
            }, 1000);
        }
    });
    
    // ===================================
    // START ANIMATION
    // ===================================
    
    requestAnimationFrame(updateCatPosition);
    
    // Reposition on window resize
    window.addEventListener('resize', () => {
        if (!isTyping) {
            catX = window.innerWidth / 2;
            catY = window.innerHeight / 2;
            targetX = catX;
            targetY = catY;
        }
    });
    
    console.log('✅ Cat animation fully initialized');
}
