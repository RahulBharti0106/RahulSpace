// ===================================
// SUPABASE CONFIGURATION - UPDATED
// ===================================

// Initialize Supabase client
const SUPABASE_URL = 'https://xxnqykwinpjqsuhlnrlv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bnF5a3dpbnBqcXN1aGxucmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzc4MjMsImV4cCI6MjA3NTY1MzgyM30.QnYcMZS-Jz6rsmhZa07lv9m0EFEoMPGGhM165frewJI';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ Supabase connected successfully!');

// ===================================
// LOAD DYNAMIC CONTENT FROM DATABASE
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadSiteConfig();
    await loadProjects();
    await loadPrompts();
    await loadSkills();
    applyAppearance();
});

// ===================================
// SITE CONFIG
// ===================================

async function loadSiteConfig() {
    try {
        const { data, error } = await supabaseClient
            .from('site_config')
            .select('*');
        
        if (error) throw error;
        
        data.forEach(config => {
            const content = config.content;
            
            // Home Section
            if (config.section_name === 'home') {
                const titleElement = document.querySelector('.home-text h1');
                const subtitleElement = document.querySelector('.home-text .subtitle');
                const descriptionElement = document.querySelector('.home-text .description');
                
                if (titleElement) titleElement.textContent = content.greeting || 'Hey, I\'m Rahul';
                if (subtitleElement) subtitleElement.textContent = content.subtitle || 'Student • Thinker • Learner';
                if (descriptionElement) descriptionElement.textContent = content.description || '';
            }
            
            // About Section
            if (config.section_name === 'about') {
                const introElement = document.querySelector('.about-intro');
                const bio1Element = document.querySelector('.about-text p:nth-of-type(2)');
                const bio2Element = document.querySelector('.about-text p:nth-of-type(3)');
                
                if (introElement) introElement.textContent = content.intro || '';
                if (bio1Element) bio1Element.textContent = content.bio_1 || '';
                if (bio2Element) bio2Element.textContent = content.bio_2 || '';
            }
            
            // Contact Info
            if (config.section_name === 'contact') {
                const emailCards = document.querySelectorAll('.info-card');
                emailCards.forEach(card => {
                    const heading = card.querySelector('h3');
                    const text = card.querySelector('p');
                    
                    if (heading && heading.textContent === 'Email' && text) {
                        text.textContent = content.email || '';
                    }
                    if (heading && heading.textContent === 'Location' && text) {
                        text.textContent = content.location || '';
                    }
                    if (heading && heading.textContent === 'Work' && text) {
                        text.textContent = content.work_status || '';
                    }
                });
            }
            
            // Section Visibility
            if (config.section_name === 'sections_visibility' && config.is_visible) {
                if (content.home === false) hideSection('home');
                if (content.projects === false) hideSection('projects');
                if (content.prompts === false) hideSection('prompts');
                if (content.skills === false) hideSection('skills');
                if (content.about === false) hideSection('about');
                if (content.contact === false) hideSection('contact');
            }
        });
        
        console.log('✅ Site config loaded');
        
    } catch (error) {
        console.error('Error loading site config:', error);
    }
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
    
    // Hide nav link too
    const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (navLink) {
        navLink.parentElement.style.display = 'none';
    }
}

// ===================================
// PROJECTS
// ===================================

async function loadProjects() {
    try {
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('is_visible', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            const projectsGrid = document.querySelector('.projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = ''; // Clear existing projects
                
                data.forEach((project, index) => {
                    const projectCard = createProjectCard(project, index);
                    projectsGrid.appendChild(projectCard);
                });
            }
        }
        
        console.log('✅ Projects loaded from database');
        
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    const imageIcon = project.image_url ? '' : '<span class="placeholder-icon">🎨</span>';
    const imageStyle = project.image_url ? `background-image: url('${project.image_url}'); background-size: cover; background-position: center;` : '';
    
    const liveBtn = project.live_url ? `<a href="${project.live_url}" class="overlay-btn" target="_blank">View Live</a>` : '';
    const sourceBtn = project.source_url ? `<a href="${project.source_url}" class="overlay-btn" target="_blank">Source Code</a>` : '';
    
    const tags = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    card.innerHTML = `
        <div class="card-glow"></div>
        <div class="card-image">
            <div class="placeholder-img" style="${imageStyle}">
                ${imageIcon}
            </div>
            <div class="card-overlay">
                ${liveBtn}
                ${sourceBtn}
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${project.title}</h3>
            <p class="card-description">${project.description}</p>
            <div class="card-tags">
                ${tags}
            </div>
        </div>
    `;
    
    return card;
}

// ===================================
// PROMPTS
// ===================================

async function loadPrompts() {
    try {
        const { data, error } = await supabaseClient
            .from('prompts')
            .select('*')
            .eq('is_visible', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            const promptsGrid = document.querySelector('.prompts-grid');
            if (promptsGrid) {
                promptsGrid.innerHTML = ''; // Clear existing prompts
                
                data.forEach((prompt, index) => {
                    const promptCard = createPromptCard(prompt, index);
                    promptsGrid.appendChild(promptCard);
                });
            }
        }
        
        console.log('✅ Prompts loaded from database');
        
    } catch (error) {
        console.error('Error loading prompts:', error);
    }
}

function createPromptCard(prompt, index) {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.setAttribute('data-aos', 'zoom-in');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    const resultContent = prompt.result_image_url ? 
        `<img src="${prompt.result_image_url}" alt="Result" style="max-width: 100%; border-radius: 10px; margin-top: 0.5rem;">` :
        `<div class="result-placeholder">
            <span class="result-icon">✨</span>
            <p>${prompt.result_text}</p>
        </div>`;
    
    card.innerHTML = `
        <div class="prompt-header">
            <span class="prompt-type">${prompt.prompt_type}</span>
        </div>
        <div class="prompt-content">
            <div class="prompt-input">
                <h4>Prompt:</h4>
                <p>${prompt.prompt_text}</p>
            </div>
            <div class="prompt-arrow">→</div>
            <div class="prompt-output">
                <h4>Result:</h4>
                ${resultContent}
            </div>
        </div>
    `;
    
    return card;
}

// ===================================
// SKILLS
// ===================================

async function loadSkills() {
    try {
        const { data, error } = await supabaseClient
            .from('skills')
            .select('*')
            .eq('is_visible', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Check if skills section exists, if not create it
            let skillsSection = document.getElementById('skills');
            
            if (!skillsSection) {
                // Create skills section after prompts section
                const promptsSection = document.getElementById('prompts');
                if (promptsSection) {
                    skillsSection = createSkillsSection();
                    promptsSection.insertAdjacentElement('afterend', skillsSection);
                    
                    // Add nav item
                    addSkillsNavItem();
                }
            }
            
            if (skillsSection) {
                const skillsContainer = skillsSection.querySelector('.skills-container') || createSkillsContainer(skillsSection);
                skillsContainer.innerHTML = ''; // Clear existing
                
                // Group by category
                const groupedSkills = {};
                data.forEach(skill => {
                    if (!groupedSkills[skill.category]) {
                        groupedSkills[skill.category] = [];
                    }
                    groupedSkills[skill.category].push(skill);
                });
                
                // Create category sections
                Object.keys(groupedSkills).forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'skill-category';
                    categoryDiv.setAttribute('data-aos', 'fade-up');
                    
                    categoryDiv.innerHTML = `<h3 class="category-title">${category}</h3>`;
                    
                    const skillsGrid = document.createElement('div');
                    skillsGrid.className = 'skills-grid';
                    
                    groupedSkills[category].forEach(skill => {
                        const skillCard = createSkillCard(skill);
                        skillsGrid.appendChild(skillCard);
                    });
                    
                    categoryDiv.appendChild(skillsGrid);
                    skillsContainer.appendChild(categoryDiv);
                });
            }
        }
        
        console.log('✅ Skills loaded from database');
        
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function createSkillsSection() {
    const section = document.createElement('section');
    section.id = 'skills';
    section.className = 'section';
    
    section.innerHTML = `
        <div class="container">
            <h2 class="section-title">
                <span class="title-icon">🎯</span>
                Skills & Technologies
            </h2>
            <p class="section-subtitle">Tools and technologies I work with</p>
            <div class="skills-container"></div>
        </div>
    `;
    
    return section;
}

function createSkillsContainer(section) {
    const container = section.querySelector('.container');
    const skillsContainer = document.createElement('div');
    skillsContainer.className = 'skills-container';
    container.appendChild(skillsContainer);
    return skillsContainer;
}

function createSkillCard(skill) {
    const card = document.createElement('div');
    card.className = 'skill-card';
    
    card.innerHTML = `
        <div class="skill-icon">${skill.icon || '⭐'}</div>
        <div class="skill-info">
            <h4>${skill.skill_name}</h4>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.proficiency}%"></div>
            </div>
        </div>
    `;
    
    return card;
}

function addSkillsNavItem() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const aboutNav = navMenu.querySelector('[data-section="about"]');
        if (aboutNav) {
            const skillsNav = document.createElement('li');
            skillsNav.innerHTML = '<a href="#skills" class="nav-link" data-section="skills">Skills</a>';
            aboutNav.parentElement.insertBefore(skillsNav, aboutNav.parentElement);
        }
    }
}

// ===================================
// APPEARANCE
// ===================================

async function applyAppearance() {
    try {
        const { data, error } = await supabaseClient
            .from('site_config')
            .select('*')
            .eq('section_name', 'appearance')
            .single();
        
        if (error) throw error;
        
        const content = data.content;
        
        // Apply colors
        document.documentElement.style.setProperty('--primary', content.primary_color || '#6366f1');
        document.documentElement.style.setProperty('--secondary', content.secondary_color || '#8b5cf6');
        document.documentElement.style.setProperty('--accent', content.accent_color || '#ec4899');
        
        // Apply font
        if (content.font && content.font !== 'Poppins') {
            const fontLink = document.createElement('link');
            fontLink.href = `https://fonts.googleapis.com/css2?family=${content.font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
            
            document.body.style.fontFamily = `'${content.font}', sans-serif`;
        }
        
        console.log('✅ Appearance applied');
        
    } catch (error) {
        console.error('Error applying appearance:', error);
    }
}
