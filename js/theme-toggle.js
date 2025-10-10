// ===================================
// THEME TOGGLE FUNCTIONALITY
// ===================================

(function() {
    'use strict';
    
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Toggle dark mode class
            body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            
            // Add animation effect
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
            
            console.log(`🎨 Theme switched to ${theme} mode`);
        });
    }
    
    // Smooth transition for theme toggle button
    themeToggle.style.transition = 'transform 0.3s ease';
    
})();
