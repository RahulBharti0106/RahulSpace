// ===================================
// ADMIN PANEL - COMPLETE JAVASCRIPT
// ===================================

// Initialize Supabase
const SUPABASE_URL = 'https://xxnqykwinpjqsuhlnrlv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bnF5a3dpbnBqcXN1aGxucmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzc4MjMsImV4cCI6MjA3NTY1MzgyM30.QnYcMZS-Jz6rsmhZa07lv9m0EFEoMPGGhM165frewJI';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;

// ===================================
// AUTHENTICATION
// ===================================

// Check if user is logged in
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        showDashboard();
        document.getElementById('adminEmail').textContent = currentUser.email;
        loadDashboard();
    } else {
        showLogin();
    }
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');
    
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    errorDiv.classList.remove('show');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        currentUser = data.user;
        showDashboard();
        document.getElementById('adminEmail').textContent = currentUser.email;
        loadDashboard();
        
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = error.message || 'Invalid credentials. Please try again.';
        errorDiv.classList.add('show');
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    currentUser = null;
    showLogin();
});

function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('adminDashboard').classList.remove('active');
}

function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminDashboard').classList.add('active');
}

// ===================================
// NAVIGATION
// ===================================

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding section
        const sectionId = item.dataset.section;
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        
        // Load data for specific sections
        if (sectionId === 'projects') loadProjects();
        if (sectionId === 'prompts') loadPrompts();
        if (sectionId === 'skills') loadSkills();
        if (sectionId === 'messages') loadMessages();
        if (sectionId === 'site-settings') loadSiteSettings();
        if (sectionId === 'appearance') loadAppearance();
    });
});

// ===================================
// DASHBOARD
// ===================================

async function loadDashboard() {
    try {
        // Count projects
        const { count: projectsCount } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true });
        
        // Count prompts
        const { count: promptsCount } = await supabase
            .from('prompts')
            .select('*', { count: 'exact', head: true });
        
        // Count skills
        const { count: skillsCount } = await supabase
            .from('skills')
            .select('*', { count: 'exact', head: true });
        
        // Count messages
        const { count: messagesCount } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true });
        
        document.getElementById('projectsCount').textContent = projectsCount || 0;
        document.getElementById('promptsCount').textContent = promptsCount || 0;
        document.getElementById('skillsCount').textContent = skillsCount || 0;
        document.getElementById('messagesCount').textContent = messagesCount || 0;
        
        document.getElementById('dashboardLoading').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ===================================
// PROJECTS
// ===================================

let editingProjectId = null;

// Add/Edit Project
document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const tags = document.getElementById('projectTags').value.split(',').map(t => t.trim());
    const liveUrl = document.getElementById('projectLiveUrl').value;
    const sourceUrl = document.getElementById('projectSourceUrl').value;
    const imageUrl = document.getElementById('projectImageUrl').value;
    const isVisible = document.getElementById('projectVisible').checked;
    const order = document.getElementById('projectOrder').value;
    
    let finalImageUrl = imageUrl;
    
    // Handle image upload
    const fileInput = document.getElementById('projectImageFile');
    if (fileInput.files.length > 0) {
        finalImageUrl = await uploadImage(fileInput.files[0], 'project');
        if (!finalImageUrl && !imageUrl) {
            return; // Upload failed and no URL provided
        }
    }
    
    const projectData = {
        title,
        description,
        tags,
        live_url: liveUrl,
        source_url: sourceUrl,
        image_url: finalImageUrl,
        is_visible: isVisible,
        display_order: parseInt(order)
    };
    
    try {
        if (editingProjectId) {
            // Update existing project
            const { error } = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', editingProjectId);
            
            if (error) throw error;
            
            showMessage('projectMessage', 'Project updated successfully!', 'success');
            editingProjectId = null;
            document.querySelector('#projectForm button[type="submit"]').textContent = 'Add Project';
            document.getElementById('cancelProjectBtn').style.display = 'none';
            
        } else {
            // Insert new project
            const { error } = await supabase
                .from('projects')
                .insert([projectData]);
            
            if (error) throw error;
            
            showMessage('projectMessage', 'Project added successfully!', 'success');
        }
        
        document.getElementById('projectForm').reset();
        document.getElementById('projectImagePreviewContainer').style.display = 'none';
        loadProjects();
        loadDashboard();
        
    } catch (error) {
        console.error('Error saving project:', error);
        showMessage('projectMessage', 'Failed to save project. Please try again.', 'error');
    }
});

// Load Projects
async function loadProjects() {
    document.getElementById('projectsLoading').style.display = 'block';
    document.getElementById('projectsTable').style.display = 'none';
    
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        let html = '<table><thead><tr><th>Title</th><th>Tags</th><th>Visible</th><th>Order</th><th>Actions</th></tr></thead><tbody>';
        
        if (data.length === 0) {
            html += '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #666;">No projects yet. Add your first project above!</td></tr>';
        }
        
        data.forEach(project => {
            html += `
                <tr>
                    <td><strong>${project.title}</strong></td>
                    <td>${project.tags.join(', ')}</td>
                    <td>${project.is_visible ? '✅ Yes' : '❌ No'}</td>
                    <td>${project.display_order}</td>
                    <td class="action-btns">
                        <button class="btn btn-primary btn-sm" onclick="editProject('${project.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProject('${project.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('projectsLoading').style.display = 'none';
        document.getElementById('projectsTable').innerHTML = html;
        document.getElementById('projectsTable').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Edit Project
async function editProject(id) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        // Scroll to form
        document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
        
        // Fill form
        document.getElementById('projectTitle').value = data.title;
        document.getElementById('projectDescription').value = data.description;
        document.getElementById('projectTags').value = data.tags.join(', ');
        document.getElementById('projectLiveUrl').value = data.live_url || '';
        document.getElementById('projectSourceUrl').value = data.source_url || '';
        document.getElementById('projectImageUrl').value = data.image_url || '';
        document.getElementById('projectVisible').checked = data.is_visible;
        document.getElementById('projectOrder').value = data.display_order;
        
        // Show image preview
        if (data.image_url) {
            document.getElementById('projectImagePreview').src = data.image_url;
            document.getElementById('projectImagePreviewContainer').style.display = 'block';
        }
        
        // Change button text and show cancel
        document.querySelector('#projectForm button[type="submit"]').textContent = 'Update Project';
        document.getElementById('cancelProjectBtn').style.display = 'inline-block';
        
        // Set editing mode
        editingProjectId = id;
        
        showMessage('projectMessage', 'Editing project. Make changes and click "Update Project".', 'success');
        
    } catch (error) {
        console.error('Error loading project for edit:', error);
        showMessage('projectMessage', 'Failed to load project for editing.', 'error');
    }
}

// Delete Project
async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showMessage('projectMessage', 'Project deleted successfully!', 'success');
        loadProjects();
        loadDashboard();
        
    } catch (error) {
        console.error('Error deleting project:', error);
        showMessage('projectMessage', 'Failed to delete project.', 'error');
    }
}

// Image Preview for Projects
document.getElementById('projectImageFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('projectImagePreview').src = e.target.result;
            document.getElementById('projectImagePreviewContainer').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('projectImageUrl').addEventListener('input', (e) => {
    const url = e.target.value;
    if (url) {
        document.getElementById('projectImagePreview').src = url;
        document.getElementById('projectImagePreviewContainer').style.display = 'block';
    } else {
        document.getElementById('projectImagePreviewContainer').style.display = 'none';
    }
});

// ===================================
// PROMPTS
// ===================================

let editingPromptId = null;

// Add/Edit Prompt
document.getElementById('promptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('promptType').value;
    const text = document.getElementById('promptText').value;
    const result = document.getElementById('promptResult').value;
    const imageUrl = document.getElementById('promptImageUrl').value;
    const isVisible = document.getElementById('promptVisible').checked;
    const order = document.getElementById('promptOrder').value;
    
    let finalImageUrl = imageUrl;
    
    // Handle image upload
    const fileInput = document.getElementById('promptImageFile');
    if (fileInput.files.length > 0) {
        finalImageUrl = await uploadImage(fileInput.files[0], 'prompt');
        if (!finalImageUrl && !imageUrl) {
            return;
        }
    }
    
    const promptData = {
        prompt_type: type,
        prompt_text: text,
        result_text: result,
        result_image_url: finalImageUrl,
        is_visible: isVisible,
        display_order: parseInt(order)
    };
    
    try {
        if (editingPromptId) {
            // Update existing prompt
            const { error } = await supabase
                .from('prompts')
                .update(promptData)
                .eq('id', editingPromptId);
            
            if (error) throw error;
            
            showMessage('promptMessage', 'Prompt updated successfully!', 'success');
            editingPromptId = null;
            document.querySelector('#promptForm button[type="submit"]').textContent = 'Add Prompt';
            document.getElementById('cancelPromptBtn').style.display = 'none';
            
        } else {
            // Insert new prompt
            const { error } = await supabase
                .from('prompts')
                .insert([promptData]);
            
            if (error) throw error;
            
            showMessage('promptMessage', 'Prompt added successfully!', 'success');
        }
        
        document.getElementById('promptForm').reset();
        document.getElementById('promptImagePreviewContainer').style.display = 'none';
        loadPrompts();
        loadDashboard();
        
    } catch (error) {
        console.error('Error saving prompt:', error);
        showMessage('promptMessage', 'Failed to save prompt. Please try again.', 'error');
    }
});

// Load Prompts
async function loadPrompts() {
    document.getElementById('promptsLoading').style.display = 'block';
    document.getElementById('promptsTable').style.display = 'none';
    
    try {
        const { data, error } = await supabase
            .from('prompts')
            .select('*')
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        let html = '<table><thead><tr><th>Type</th><th>Prompt</th><th>Visible</th><th>Order</th><th>Actions</th></tr></thead><tbody>';
        
        if (data.length === 0) {
            html += '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #666;">No prompts yet. Add your first prompt above!</td></tr>';
        }
        
        data.forEach(prompt => {
            html += `
                <tr>
                    <td><strong>${prompt.prompt_type}</strong></td>
                    <td>${prompt.prompt_text.substring(0, 50)}...</td>
                    <td>${prompt.is_visible ? '✅ Yes' : '❌ No'}</td>
                    <td>${prompt.display_order}</td>
                    <td class="action-btns">
                        <button class="btn btn-primary btn-sm" onclick="editPrompt('${prompt.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deletePrompt('${prompt.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('promptsLoading').style.display = 'none';
        document.getElementById('promptsTable').innerHTML = html;
        document.getElementById('promptsTable').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading prompts:', error);
    }
}

// Edit Prompt
async function editPrompt(id) {
    try {
        const { data, error } = await supabase
            .from('prompts')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        document.getElementById('promptForm').scrollIntoView({ behavior: 'smooth' });
        
        document.getElementById('promptType').value = data.prompt_type;
        document.getElementById('promptText').value = data.prompt_text;
        document.getElementById('promptResult').value = data.result_text;
        document.getElementById('promptImageUrl').value = data.result_image_url || '';
        document.getElementById('promptVisible').checked = data.is_visible;
        document.getElementById('promptOrder').value = data.display_order;
        
        if (data.result_image_url) {
            document.getElementById('promptImagePreview').src = data.result_image_url;
            document.getElementById('promptImagePreviewContainer').style.display = 'block';
        }
        
        document.querySelector('#promptForm button[type="submit"]').textContent = 'Update Prompt';
        document.getElementById('cancelPromptBtn').style.display = 'inline-block';
        editingPromptId = id;
        
        showMessage('promptMessage', 'Editing prompt. Make changes and click "Update Prompt".', 'success');
        
    } catch (error) {
        console.error('Error loading prompt for edit:', error);
        showMessage('promptMessage', 'Failed to load prompt for editing.', 'error');
    }
}

// Delete Prompt
async function deletePrompt(id) {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
        const { error } = await supabase
            .from('prompts')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showMessage('promptMessage', 'Prompt deleted successfully!', 'success');
        loadPrompts();
        loadDashboard();
        
    } catch (error) {
        console.error('Error deleting prompt:', error);
        showMessage('promptMessage', 'Failed to delete prompt.', 'error');
    }
}

// Prompt Image Preview
document.getElementById('promptImageFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('promptImagePreview').src = e.target.result;
            document.getElementById('promptImagePreviewContainer').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('promptImageUrl').addEventListener('input', (e) => {
    const url = e.target.value;
    if (url) {
        document.getElementById('promptImagePreview').src = url;
        document.getElementById('promptImagePreviewContainer').style.display = 'block';
    } else {
        document.getElementById('promptImagePreviewContainer').style.display = 'none';
    }
});

// ===================================
// SKILLS
// ===================================

let editingSkillId = null;

// Add/Edit Skill
document.getElementById('skillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const category = document.getElementById('skillCategory').value;
    const name = document.getElementById('skillName').value;
    const icon = document.getElementById('skillIcon').value;
    const proficiency = document.getElementById('skillProficiency').value;
    const isVisible = document.getElementById('skillVisible').checked;
    const order = document.getElementById('skillOrder').value;
    
    const skillData = {
        category,
        skill_name: name,
        icon,
        proficiency: parseInt(proficiency),
        is_visible: isVisible,
        display_order: parseInt(order)
    };
    
    try {
        if (editingSkillId) {
            // Update existing skill
            const { error } = await supabase
                .from('skills')
                .update(skillData)
                .eq('id', editingSkillId);
            
            if (error) throw error;
            
            showMessage('skillMessage', 'Skill updated successfully!', 'success');
            editingSkillId = null;
            document.querySelector('#skillForm button[type="submit"]').textContent = 'Add Skill';
            document.getElementById('cancelSkillBtn').style.display = 'none';
            
        } else {
            // Insert new skill
            const { error } = await supabase
                .from('skills')
                .insert([skillData]);
            
            if (error) throw error;
            
            showMessage('skillMessage', 'Skill added successfully!', 'success');
        }
        
        document.getElementById('skillForm').reset();
        loadSkills();
        loadDashboard();
        
    } catch (error) {
        console.error('Error saving skill:', error);
        showMessage('skillMessage', 'Failed to save skill. Please try again.', 'error');
    }
});

// Load Skills
async function loadSkills() {
    document.getElementById('skillsLoading').style.display = 'block';
    document.getElementById('skillsTable').style.display = 'none';
    
    try {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        let html = '<table><thead><tr><th>Category</th><th>Skill</th><th>Icon</th><th>Proficiency</th><th>Visible</th><th>Actions</th></tr></thead><tbody>';
        
        if (data.length === 0) {
            html += '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #666;">No skills yet. Add your first skill above!</td></tr>';
        }
        
        data.forEach(skill => {
            html += `
                <tr>
                    <td><strong>${skill.category}</strong></td>
                    <td>${skill.skill_name}</td>
                    <td style="font-size: 1.5rem;">${skill.icon || '-'}</td>
                    <td>${skill.proficiency}%</td>
                    <td>${skill.is_visible ? '✅ Yes' : '❌ No'}</td>
                    <td class="action-btns">
                        <button class="btn btn-primary btn-sm" onclick="editSkill('${skill.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteSkill('${skill.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('skillsLoading').style.display = 'none';
        document.getElementById('skillsTable').innerHTML = html;
        document.getElementById('skillsTable').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// Edit Skill
async function editSkill(id) {
    try {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        document.getElementById('skillForm').scrollIntoView({ behavior: 'smooth' });
        
        document.getElementById('skillCategory').value = data.category;
        document.getElementById('skillName').value = data.skill_name;
        document.getElementById('skillIcon').value = data.icon || '';
        document.getElementById('skillProficiency').value = data.proficiency;
        document.getElementById('skillVisible').checked = data.is_visible;
        document.getElementById('skillOrder').value = data.display_order;
        
        document.querySelector('#skillForm button[type="submit"]').textContent = 'Update Skill';
        document.getElementById('cancelSkillBtn').style.display = 'inline-block';
        editingSkillId = id;
        
        showMessage('skillMessage', 'Editing skill. Make changes and click "Update Skill".', 'success');
        
    } catch (error) {
        console.error('Error loading skill for edit:', error);
        showMessage('skillMessage', 'Failed to load skill for editing.', 'error');
    }
}

// Delete Skill
async function deleteSkill(id) {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showMessage('skillMessage', 'Skill deleted successfully!', 'success');
        loadSkills();
        loadDashboard();
        
    } catch (error) {
        console.error('Error deleting skill:', error);
        showMessage('skillMessage', 'Failed to delete skill.', 'error');
    }
}

// ===================================
// SITE SETTINGS
// ===================================

async function loadSiteSettings() {
    try {
        const { data, error } = await supabase
            .from('site_config')
            .select('*');
        
        if (error) throw error;
        
        data.forEach(config => {
            const content = config.content;
            
            if (config.section_name === 'home') {
                document.getElementById('homeGreeting').value = content.greeting || '';
                document.getElementById('homeSubtitle').value = content.subtitle || '';
                document.getElementById('homeDescription').value = content.description || '';
            }
            
            if (config.section_name === 'about') {
                document.getElementById('aboutIntro').value = content.intro || '';
                document.getElementById('aboutBio1').value = content.bio_1 || '';
                document.getElementById('aboutBio2').value = content.bio_2 || '';
                document.getElementById('aboutProfileImage').value = content.profile_image || '';
            }
            
            if (config.section_name === 'contact') {
                document.getElementById('contactEmail').value = content.email || '';
                document.getElementById('contactLocation').value = content.location || '';
                document.getElementById('contactWork').value = content.work_status || '';
            }
            
            if (config.section_name === 'social') {
                document.getElementById('socialGithub').value = content.github || '';
                document.getElementById('socialTwitter').value = content.twitter || '';
                document.getElementById('socialLinkedin').value = content.linkedin || '';
                document.getElementById('socialEmail').value = content.email || '';
            }
            
            if (config.section_name === 'sections_visibility') {
                document.getElementById('visHome').checked = content.home !== false;
                document.getElementById('visProjects').checked = content.projects !== false;
                document.getElementById('visPrompts').checked = content.prompts !== false;
                document.getElementById('visSkills').checked = content.skills !== false;
                document.getElementById('visAbout').checked = content.about !== false;
                document.getElementById('visContact').checked = content.contact !== false;
            }
        });
        
    } catch (error) {
        console.error('Error loading site settings:', error);
    }
}

// Save Home Section
document.getElementById('homeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = {
        greeting: document.getElementById('homeGreeting').value,
        subtitle: document.getElementById('homeSubtitle').value,
        description: document.getElementById('homeDescription').value
    };
    
    try {
        const { error } = await supabase
            .from('site_config')
            .update({ content })
            .eq('section_name', 'home');
        
        if (error) throw error;
        
        showMessage('settingsMessage', 'Home section updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating home:', error);
        showMessage('settingsMessage', 'Failed to update home section.', 'error');
    }
});

// Save About Section
document.getElementById('aboutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = {
        intro: document.getElementById('aboutIntro').value,
        bio_1: document.getElementById('aboutBio1').value,
        bio_2: document.getElementById('aboutBio2').value,
        profile_image: document.getElementById('aboutProfileImage').value
    };
    
    try {
        const { error } = await supabase
            .from('site_config')
            .update({ content })
            .eq('section_name', 'about');
        
        if (error) throw error;
        
        showMessage('settingsMessage', 'About section updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating about:', error);
        showMessage('settingsMessage', 'Failed to update about section.', 'error');
    }
});

// Save Contact Info
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = {
        email: document.getElementById('contactEmail').value,
        location: document.getElementById('contactLocation').value,
        work_status: document.getElementById('contactWork').value
    };
    
    try {
        const { error } = await supabase
            .from('site_config')
            .update({ content })
            .eq('section_name', 'contact');
        
        if (error) throw error;
        
        showMessage('settingsMessage', 'Contact info updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating contact:', error);
        showMessage('settingsMessage', 'Failed to update contact info.', 'error');
    }
});

// Save Social Links
document.getElementById('socialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = {
        github: document.getElementById('socialGithub').value,
        twitter: document.getElementById('socialTwitter').value,
        linkedin: document.getElementById('socialLinkedin').value,
        email: document.getElementById('socialEmail').value
    };
    
    try {
        const { error } = await supabase
            .from('site_config')
            .update({ content })
            .eq('section_name', 'social');
        
        if (error) throw error;
        
        showMessage('settingsMessage', 'Social links updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating social:', error);
        showMessage('settingsMessage', 'Failed to update social links.', 'error');
    }
});

// Save Visibility
document.getElementById('visibilityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = {
        home: document.getElementById('visHome').checked,
        projects: document.getElementById('visProjects').checked,
        prompts: document.getElementById('visPrompts').checked,
        skills: document.getElementById('visSkills').checked,
        about: document.getElementById('visAbout').checked,
        contact: document.getElementById('visContact').checked
    };
    
    try {
        const { error } = await supabase
            .from('site_config')
            .update({ content })
            .eq('section_name', 'sections_visibility');
        
        if (error) throw error;
        
        showMessage('settingsMessage', 'Section visibility updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating visibility:', error);
        showMessage('settingsMessage', 'Failed to update visibility.', 'error');
    }
});

// ===================================
// APPEARANCE
// ===================================

async function loadAppearance() {
    try {
        const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .eq('section_name', 'appearance')
            .single();
        
        if (error) throw error;
        
        const content = data.content;
        document.getElementById('primaryColor').value = content.primary_color || '#6366f1';
        document.getElementById('primaryColorHex').value = content.primary_color || '#6366f1';
        document.getElementById('secondaryColor').value = content.secondary_color || '#8b5cf6';
        document.getElementById('secondaryColorHex').value = content.secondary_color || '#8b5cf6';
        document.getElementById('accentColor').value = content.accent_color || '#ec4899';
        document.getElementById('accentColorHex').value = content.accent_color || '#ec4899';
        document.getElementById('fontFamily').value = content.font || 'Poppins';
        
    } catch (error) {
        console.error('Error loading appearance:', error);
    }
}

// Sync color picker with hex input
document.getElementById('primaryColor').addEventListener('input', (e) => {
    document.getElementById('primaryColorHex').value = e.target.value;
});

document.getElementById('secondaryColor').addEventListener('input', (e) => {
    document.getElementById('secondaryColorHex').value = e.target.value;
});

document.getElementById('accentColor').addEventListener('input', (e) => {
    document.getElementById('accentColorHex').value = e.target.value;
});

// Save Appearance
document.getElementById('appearanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = {
        primary_color: document.getElementById('primaryColor').value,
        secondary_color: document.getElementById('secondaryColor').value,
        accent_color: document.getElementById('accentColor').value,
        font: document.getElementById('fontFamily').value
    };
    
    try {
        const { error } = await supabase
            .from('site_config')
            .update({ content })
            .eq('section_name', 'appearance');
        
        if (error) throw error;
        
        showMessage('appearanceMessage', 'Appearance updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating appearance:', error);
        showMessage('appearanceMessage', 'Failed to update appearance.', 'error');
    }
});

// Reset Appearance
function resetAppearance() {
    document.getElementById('primaryColor').value = '#6366f1';
    document.getElementById('primaryColorHex').value = '#6366f1';
    document.getElementById('secondaryColor').value = '#8b5cf6';
    document.getElementById('secondaryColorHex').value = '#8b5cf6';
    document.getElementById('accentColor').value = '#ec4899';
    document.getElementById('accentColorHex').value = '#ec4899';
    document.getElementById('fontFamily').value = 'Poppins';
}

// ===================================
// MESSAGES
// ===================================

async function loadMessages() {
    document.getElementById('messagesLoading').style.display = 'block';
    document.getElementById('messagesTable').style.display = 'none';
    
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        let html = '<table><thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Subject</th><th>Message</th></tr></thead><tbody>';
        
        if (data.length === 0) {
            html += '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #666;">No messages yet.</td></tr>';
        }
        
        data.forEach(msg => {
            const date = new Date(msg.created_at).toLocaleDateString();
            html += `
                <tr>
                    <td>${date}</td>
                    <td><strong>${msg.name}</strong></td>
                    <td>${msg.email}</td>
                    <td>${msg.subject}</td>
                    <td>${msg.message.substring(0, 100)}${msg.message.length > 100 ? '...' : ''}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('messagesLoading').style.display = 'none';
        document.getElementById('messagesTable').innerHTML = html;
        document.getElementById('messagesTable').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// ===================================
// IMAGE UPLOAD
// ===================================

async function uploadImage(file, type) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${type}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
            .from('portfolio-images')
            .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(filePath);
        
        return data.publicUrl;
        
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try using image URL instead or check storage policy in Supabase.');
        return '';
    }
}

// ===================================
// IMAGE REMOVAL FUNCTIONS
// ===================================

function removeProjectImage() {
    document.getElementById('projectImageFile').value = '';
    document.getElementById('projectImageUrl').value = '';
    document.getElementById('projectImagePreview').src = '';
    document.getElementById('projectImagePreviewContainer').style.display = 'none';
}

function removePromptImage() {
    document.getElementById('promptImageFile').value = '';
    document.getElementById('promptImageUrl').value = '';
    document.getElementById('promptImagePreview').src = '';
    document.getElementById('promptImagePreviewContainer').style.display = 'none';
}

// ===================================
// CANCEL EDIT FUNCTIONS
// ===================================

function cancelProjectEdit() {
    editingProjectId = null;
    document.getElementById('projectForm').reset();
    removeProjectImage();
    document.querySelector('#projectForm button[type="submit"]').textContent = 'Add Project';
    document.getElementById('cancelProjectBtn').style.display = 'none';
    showMessage('projectMessage', 'Edit cancelled.', 'success');
}

function cancelPromptEdit() {
    editingPromptId = null;
    document.getElementById('promptForm').reset();
    removePromptImage();
    document.querySelector('#promptForm button[type="submit"]').textContent = 'Add Prompt';
    document.getElementById('cancelPromptBtn').style.display = 'none';
    showMessage('promptMessage', 'Edit cancelled.', 'success');
}

function cancelSkillEdit() {
    editingSkillId = null;
    document.getElementById('skillForm').reset();
    document.querySelector('#skillForm button[type="submit"]').textContent = 'Add Skill';
    document.getElementById('cancelSkillBtn').style.display = 'none';
    showMessage('skillMessage', 'Edit cancelled.', 'success');
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function showMessage(elementId, text, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

// Make functions global
window.deleteProject = deleteProject;
window.editProject = editProject;
window.deletePrompt = deletePrompt;
window.editPrompt = editPrompt;
window.deleteSkill = deleteSkill;
window.editSkill = editSkill;
window.removeProjectImage = removeProjectImage;
window.removePromptImage = removePromptImage;
window.cancelProjectEdit = cancelProjectEdit;
window.cancelPromptEdit = cancelPromptEdit;
window.cancelSkillEdit = cancelSkillEdit;
window.resetAppearance = resetAppearance;

// Initialize on page load
checkAuth();
