// ===================================
// CUTE CAT ANIMATION - With Eyes & Legs
// ===================================

(function() {
    'use strict';
    
    const catToggle = document.getElementById('cat-toggle');
    
    let mouseX = 0;
    let mouseY = 0;
    let catX = 0;
    let catY = 0;
    let isEnabled = localStorage.getItem('catAnimation') !== 'false';
    
    // Create the cat element
    const floatingCat = document.createElement('div');
    floatingCat.id = 'floating-cat';
    floatingCat.innerHTML = `
        <div class="cat-container">
            <div class="cat-ears">
                <div class="cat-ear cat-ear-left"></div>
                <div class="cat-ear cat-ear-right"></div>
            </div>
            <div class="cat-face">
                <div class="cat-eyes">
                    <div class="cat-eye cat-eye-left">
                        <div class="cat-pupil"></div>
                    </div>
                    <div class="cat-eye cat-eye-right">
                        <div class="cat-pupil"></div>
                    </div>
                </div>
                <div class="cat-nose"></div>
                <div class="cat-mouth">
                    <div class="cat-mouth-left"></div>
                    <div class="cat-mouth-right"></div>
                </div>
                <div class="cat-whiskers cat-whiskers-left">
                    <div class="whisker"></div>
                    <div class="whisker"></div>
                    <div class="whisker"></div>
                </div>
                <div class="cat-whiskers cat-whiskers-right">
                    <div class="whisker"></div>
                    <div class="whisker"></div>
                    <div class="whisker"></div>
                </div>
            </div>
            <div class="cat-body">
                <div class="cat-legs">
                    <div class="cat-leg cat-leg-left"></div>
                    <div class="cat-leg cat-leg-right"></div>
                </div>
                <div class="cat-tail"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(floatingCat);
    
    // Apply saved preference
    if (!isEnabled) {
        floatingCat.style.display = 'none';
        catToggle.style.opacity = '0.5';
    }
    
    // Cat toggle button
    if (catToggle) {
        catToggle.addEventListener('click', () => {
            isEnabled = !isEnabled;
            
            localStorage.setItem('catAnimation', isEnabled);
            
            if (isEnabled) {
                floatingCat.style.display = 'block';
                catToggle.style.opacity = '1';
                console.log('🐱 Cat is now following you!');
            } else {
                floatingCat.style.display = 'none';
                catToggle.style.opacity = '0.5';
                console.log('🐱 Cat is resting...');
            }
            
            catToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                catToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
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
    
    // Animate cat position
    function animateCat() {
        if (!isEnabled) {
            requestAnimationFrame(animateCat);
            return;
        }
        
        // Smooth following with easing
        const speed = 0.08;
        const dx = mouseX - catX;
        const dy = mouseY - catY;
        
        catX += dx * speed;
        catY += dy * speed;
        
        // Apply position
        floatingCat.style.left = catX + 'px';
        floatingCat.style.top = catY + 'px';
        
        // Rotate cat based on movement direction
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        floatingCat.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
        
        // Animate eyes to look at cursor
        const eyes = floatingCat.querySelectorAll('.cat-pupil');
        eyes.forEach(eye => {
            const eyeX = parseFloat(getComputedStyle(eye.parentElement).left);
            const eyeY = parseFloat(getComputedStyle(eye.parentElement).top);
            const deltaX = dx * 0.3;
            const deltaY = dy * 0.3;
            eye.style.transform = `translate(${deltaX * 0.1}px, ${deltaY * 0.1}px)`;
        });
        
        requestAnimationFrame(animateCat);
    }
    
    // Start animation loop
    animateCat();
    
    // Animate legs walking
    let legStep = 0;
    setInterval(() => {
        if (!isEnabled) return;
        
        const speed = Math.sqrt(Math.pow(mouseX - catX, 2) + Math.pow(mouseY - catY, 2));
        
        if (speed > 2) {
            legStep += 0.5;
            const leftLeg = floatingCat.querySelector('.cat-leg-left');
            const rightLeg = floatingCat.querySelector('.cat-leg-right');
            
            if (leftLeg && rightLeg) {
                leftLeg.style.transform = `rotate(${Math.sin(legStep) * 15}deg)`;
                rightLeg.style.transform = `rotate(${Math.sin(legStep + Math.PI) * 15}deg)`;
            }
        }
    }, 50);
    
    console.log('🐱 Cute cat is ready!');
    
})();
