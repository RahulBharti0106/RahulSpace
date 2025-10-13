// ===================================
// FULLY ANIMATED CAT
// Rotates toward movement, hides when typing
// ===================================

const floatingCat = document.getElementById('floating-cat');
const catContainer = document.querySelector('.cat-container');

if (floatingCat && catContainer) {
    let catX = window.innerWidth / 2;
    let catY = window.innerHeight / 2;
    let targetX = catX;
    let targetY = catY;
    let lastX = catX;
    let isTyping = false;
    let isHidden = false;
    let typingTimeout;
    let lastUpdateTime = 0;
    const isMobile = window.innerWidth <= 768;
    const updateInterval = isMobile ? 50 : 33;
    
    // Initialize position
    floatingCat.style.position = 'fixed';
    floatingCat.style.left = catX + 'px';
    floatingCat.style.top = catY + 'px';
    floatingCat.style.pointerEvents = 'none';
    floatingCat.style.zIndex = '9999';
    
    console.log('🐱 Animated cat initialized!');
    
    // ===================================
    // TYPING DETECTION
    // ===================================
    
    function hideWhileTyping() {
        isTyping = true;
        floatingCat.classList.add('typing');
        
        clearTimeout(typingTimeout);
        
        typingTimeout = setTimeout(() => {
            if (document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                isTyping = false;
                floatingCat.classList.remove('typing');
            }
        }, 1500);
    }
    
    function showCat() {
        isTyping = false;
        floatingCat.classList.remove('typing');
    }
    
    const allInputs = document.querySelectorAll('input, textarea');
    
    allInputs.forEach(input => {
        input.addEventListener('focus', hideWhileTyping);
        input.addEventListener('blur', showCat);
        input.addEventListener('input', hideWhileTyping);
        input.addEventListener('keydown', hideWhileTyping);
    });
    
    // ===================================
    // CAT ANIMATION WITH ROTATION
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
            
            // Determine direction and rotate cat
            const deltaX = catX - lastX;
            
            if (Math.abs(deltaX) > 0.5) { // Only rotate if significant movement
                if (deltaX > 0) {
                    // Moving right
                    catContainer.classList.remove('moving-left');
                    catContainer.classList.add('moving-right');
                } else {
                    // Moving left
                    catContainer.classList.remove('moving-right');
                    catContainer.classList.add('moving-left');
                }
            }
            
            lastX = catX;
            
            floatingCat.style.left = catX + 'px';
            floatingCat.style.top = catY + 'px';
        }
        
        requestAnimationFrame(updateCatPosition);
    }
    
    // ===================================
    // MOUSE/TOUCH TRACKING
    // ===================================
    
    if (isMobile) {
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
        
        document.addEventListener('touchend', () => {
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                if (!isTyping) {
                    targetX = window.innerWidth - 70;
                    targetY = window.innerHeight - 150;
                }
            }, 3000);
        });
        
    } else {
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
    }
    
    // ===================================
    // HIDE ON BUTTON CLICKS
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
    
    window.addEventListener('resize', () => {
        if (!isTyping) {
            catX = window.innerWidth / 2;
            catY = window.innerHeight / 2;
            targetX = catX;
            targetY = catY;
        }
    });
    
    console.log('✅ Cat fully animated and ready!');
    
} else {
    console.error('❌ Cat elements not found!');
}
