export class ResumeBuilder {
    constructor() {
        this.resumeData = {
            personalInfo: {
                name: '',
                email: '',
                phone: '',
                linkedin: '',
                github: '',
                location: ''
            },
            summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: []
        };
        this.aiSuggestions = [];
    }

    initializeBuilder() {
        this.createBuilderInterface();
        this.attachEventListeners();
    }

    createBuilderInterface() {
        const builderHTML = `
            <div class="resume-builder" id="resumeBuilder">
                <div class="builder-header">
                    <h2>📝 Interactive Resume Builder</h2>
                    <div class="builder-actions">
                        <button class="btn-secondary" id="importResumeBtn">
                            <span>📄</span> Import Existing Resume
                        </button>
                        <button class="btn-primary" id="downloadResumeBtn">
                            <span>💾</span> Download Resume
                        </button>
                    </div>
                </div>

                <div class="builder-content">
                    <div class="builder-sidebar">
                        <div class="section-nav">
                            <button class="nav-item active" data-section="personal">Personal Info</button>
                            <button class="nav-item" data-section="summary">Summary</button>
                            <button class="nav-item" data-section="experience">Experience</button>
                            <button class="nav-item" data-section="education">Education</button>
                            <button class="nav-item" data-section="skills">Skills</button>
                            <button class="nav-item" data-section="projects">Projects</button>
                            <button class="nav-item" data-section="certifications">Certifications</button>
                        </div>
                        
                        <div class="ai-suggestions-panel">
                            <h3>🤖 AI Suggestions</h3>
                            <div id="liveSuggestions" class="suggestions-list">
                                <p class="no-suggestions">Start editing to see AI suggestions</p>
                            </div>
                        </div>
                    </div>

                    <div class="builder-main">
                        <div class="section-editor" id="sectionEditor">
                            ${this.createPersonalInfoSection()}
                        </div>
                    </div>

                    <div class="builder-preview">
                        <h3>📄 Live Preview</h3>
                        <div id="resumePreview" class="resume-preview">
                            ${this.generatePreview()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return builderHTML;
    }

    createPersonalInfoSection() {
        return `
            <div class="section-content" data-section="personal">
                <h3>Personal Information</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="fullName">Full Name *</label>
                        <input type="text" id="fullName" placeholder="John Doe" required>
                        <div class="ai-hint" id="nameHint"></div>
                    </div>
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" placeholder="john.doe@email.com" required>
                        <div class="ai-hint" id="emailHint"></div>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone</label>
                        <input type="tel" id="phone" placeholder="+1 (555) 123-4567">
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input type="text" id="location" placeholder="City, State">
                    </div>
                    <div class="form-group">
                        <label for="linkedin">LinkedIn</label>
                        <input type="url" id="linkedin" placeholder="https://linkedin.com/in/johndoe">
                    </div>
                    <div class="form-group">
                        <label for="github">GitHub</label>
                        <input type="url" id="github" placeholder="https://github.com/johndoe">
                    </div>
                </div>
            </div>
        `;
    }

    createSummarySection() {
        return `
            <div class="section-content" data-section="summary">
                <h3>Professional Summary</h3>
                <div class="form-group">
                    <label for="summaryText">Summary</label>
                    <textarea id="summaryText" rows="6" placeholder="Write a compelling professional summary that highlights your key qualifications and career objectives..."></textarea>
                    <div class="ai-suggestions-inline" id="summaryAI"></div>
                    <div class="text-stats">
                        <span id="summaryWordCount">0 words</span>
                        <span id="summaryReadability">Readability: Good</span>
                    </div>
                </div>
                <div class="ai-templates">
                    <h4>💡 AI-Generated Templates</h4>
                    <div id="summaryTemplates" class="template-suggestions"></div>
                </div>
            </div>
        `;
    }

    createExperienceSection() {
        return `
            <div class="section-content" data-section="experience">
                <h3>Work Experience</h3>
                <div class="section-actions">
                    <button class="btn-secondary" id="addExperienceBtn">
                        <span>➕</span> Add Experience
                    </button>
                </div>
                <div id="experienceList" class="experience-list">
                    ${this.createExperienceItem(0)}
                </div>
            </div>
        `;
    }

    createExperienceItem(index) {
        return `
            <div class="experience-item" data-index="${index}">
                <div class="item-header">
                    <h4>Experience ${index + 1}</h4>
                    <button class="btn-danger-small" onclick="removeExperienceItem(${index})">🗑️</button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Job Title *</label>
                        <input type="text" name="jobTitle" placeholder="Software Engineer" required>
                    </div>
                    <div class="form-group">
                        <label>Company *</label>
                        <input type="text" name="company" placeholder="Tech Company Inc." required>
                    </div>
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="month" name="startDate">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="month" name="endDate">
                        <label class="checkbox-label">
                            <input type="checkbox" name="current"> Currently working here
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="4" placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Improved application performance by 30% through code optimization"></textarea>
                    <div class="ai-suggestions-inline" id="expAI${index}"></div>
                </div>
                <div class="achievement-suggestions">
                    <h5>💡 Achievement Suggestions</h5>
                    <div class="suggestion-chips" id="achievementChips${index}"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Section navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                this.switchSection(e.target.dataset.section);
            }
        });

        // Real-time AI suggestions
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                this.generateLiveAISuggestions(e.target);
                this.updatePreview();
            }
        });

        // Add experience item
        document.addEventListener('click', (e) => {
            if (e.target.id === 'addExperienceBtn') {
                this.addExperienceItem();
            }
        });
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        const editor = document.getElementById('sectionEditor');
        editor.innerHTML = this.getSectionContent(sectionName);
    }

    getSectionContent(sectionName) {
        switch (sectionName) {
            case 'personal': return this.createPersonalInfoSection();
            case 'summary': return this.createSummarySection();
            case 'experience': return this.createExperienceSection();
            case 'education': return this.createEducationSection();
            case 'skills': return this.createSkillsSection();
            case 'projects': return this.createProjectsSection();
            case 'certifications': return this.createCertificationsSection();
            default: return this.createPersonalInfoSection();
        }
    }

    createEducationSection() {
        return `
            <div class="section-content" data-section="education">
                <h3>Education</h3>
                <div class="section-actions">
                    <button class="btn-secondary" id="addEducationBtn">
                        <span>➕</span> Add Education
                    </button>
                </div>
                <div id="educationList" class="education-list">
                    ${this.createEducationItem(0)}
                </div>
            </div>
        `;
    }

    createEducationItem(index) {
        return `
            <div class="education-item" data-index="${index}">
                <div class="item-header">
                    <h4>Education ${index + 1}</h4>
                    <button class="btn-danger-small" onclick="removeEducationItem(${index})">🗑️</button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Degree *</label>
                        <input type="text" name="degree" placeholder="Bachelor of Science in Computer Science" required>
                    </div>
                    <div class="form-group">
                        <label>Institution *</label>
                        <input type="text" name="institution" placeholder="University Name" required>
                    </div>
                    <div class="form-group">
                        <label>Graduation Year</label>
                        <input type="number" name="graduationYear" min="1950" max="2030" placeholder="2023">
                    </div>
                    <div class="form-group">
                        <label>GPA (Optional)</label>
                        <input type="number" name="gpa" min="0" max="4" step="0.01" placeholder="3.8">
                    </div>
                </div>
                <div class="form-group">
                    <label>Relevant Coursework</label>
                    <textarea name="coursework" rows="2" placeholder="Data Structures, Algorithms, Database Systems, Web Development"></textarea>
                </div>
            </div>
        `;
    }

    createSkillsSection() {
        return `
            <div class="section-content" data-section="skills">
                <h3>Skills</h3>
                <div class="skills-categories">
                    <div class="skill-category">
                        <h4>Technical Skills</h4>
                        <div class="skill-input-group">
                            <input type="text" id="technicalSkillInput" placeholder="Add a technical skill...">
                            <button class="btn-secondary" onclick="addSkill('technical')">Add</button>
                        </div>
                        <div class="skills-tags" id="technicalSkills"></div>
                        <div class="skill-suggestions">
                            <h5>💡 Suggested Technical Skills</h5>
                            <div class="suggestion-chips" id="techSkillSuggestions"></div>
                        </div>
                    </div>
                    
                    <div class="skill-category">
                        <h4>Soft Skills</h4>
                        <div class="skill-input-group">
                            <input type="text" id="softSkillInput" placeholder="Add a soft skill...">
                            <button class="btn-secondary" onclick="addSkill('soft')">Add</button>
                        </div>
                        <div class="skills-tags" id="softSkills"></div>
                        <div class="skill-suggestions">
                            <h5>💡 Suggested Soft Skills</h5>
                            <div class="suggestion-chips" id="softSkillSuggestions"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createProjectsSection() {
        return `
            <div class="section-content" data-section="projects">
                <h3>Projects</h3>
                <div class="section-actions">
                    <button class="btn-secondary" id="addProjectBtn">
                        <span>➕</span> Add Project
                    </button>
                </div>
                <div id="projectsList" class="projects-list">
                    ${this.createProjectItem(0)}
                </div>
            </div>
        `;
    }

    createProjectItem(index) {
        return `
            <div class="project-item" data-index="${index}">
                <div class="item-header">
                    <h4>Project ${index + 1}</h4>
                    <button class="btn-danger-small" onclick="removeProjectItem(${index})">🗑️</button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Project Name *</label>
                        <input type="text" name="projectName" placeholder="E-commerce Website" required>
                    </div>
                    <div class="form-group">
                        <label>Technologies Used</label>
                        <input type="text" name="technologies" placeholder="React, Node.js, MongoDB">
                    </div>
                    <div class="form-group">
                        <label>Project URL</label>
                        <input type="url" name="projectUrl" placeholder="https://github.com/username/project">
                    </div>
                    <div class="form-group">
                        <label>Duration</label>
                        <input type="text" name="duration" placeholder="3 months">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="projectDescription" rows="4" placeholder="• Built a full-stack e-commerce platform with user authentication&#10;• Implemented payment processing using Stripe API&#10;• Achieved 99% uptime with proper error handling and testing"></textarea>
                    <div class="ai-suggestions-inline" id="projectAI${index}"></div>
                </div>
            </div>
        `;
    }

    createCertificationsSection() {
        return `
            <div class="section-content" data-section="certifications">
                <h3>Certifications</h3>
                <div class="section-actions">
                    <button class="btn-secondary" id="addCertificationBtn">
                        <span>➕</span> Add Certification
                    </button>
                </div>
                <div id="certificationsList" class="certifications-list">
                    ${this.createCertificationItem(0)}
                </div>
            </div>
        `;
    }

    createCertificationItem(index) {
        return `
            <div class="certification-item" data-index="${index}">
                <div class="item-header">
                    <h4>Certification ${index + 1}</h4>
                    <button class="btn-danger-small" onclick="removeCertificationItem(${index})">🗑️</button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Certification Name *</label>
                        <input type="text" name="certName" placeholder="AWS Certified Solutions Architect" required>
                    </div>
                    <div class="form-group">
                        <label>Issuing Organization</label>
                        <input type="text" name="issuer" placeholder="Amazon Web Services">
                    </div>
                    <div class="form-group">
                        <label>Issue Date</label>
                        <input type="month" name="issueDate">
                    </div>
                    <div class="form-group">
                        <label>Expiration Date</label>
                        <input type="month" name="expirationDate">
                        <label class="checkbox-label">
                            <input type="checkbox" name="noExpiration"> No expiration
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Credential URL</label>
                    <input type="url" name="credentialUrl" placeholder="https://www.credly.com/badges/...">
                </div>
            </div>
        `;
    }

    generateLiveAISuggestions(element) {
        const suggestions = [];
        const text = element.value;
        const elementType = element.tagName.toLowerCase();
        const elementName = element.name || element.id;

        // Grammar and style suggestions
        if (text.length > 10) {
            // Check for passive voice
            if (text.includes('was ') || text.includes('were ') || text.includes('been ')) {
                suggestions.push({
                    type: 'grammar',
                    message: 'Consider using active voice for stronger impact',
                    icon: '✏️'
                });
            }

            // Check for action verbs in experience descriptions
            if (elementName.includes('description') || elementName.includes('summary')) {
                const actionVerbs = ['developed', 'managed', 'led', 'created', 'implemented', 'designed', 'analyzed', 'improved'];
                const hasActionVerb = actionVerbs.some(verb => text.toLowerCase().includes(verb));
                
                if (!hasActionVerb) {
                    suggestions.push({
                        type: 'content',
                        message: 'Start with strong action verbs like "Developed", "Managed", or "Led"',
                        icon: '💪'
                    });
                }
            }

            // Check for quantifiable metrics
            if (elementName.includes('description')) {
                const hasNumbers = /\d+/.test(text);
                if (!hasNumbers) {
                    suggestions.push({
                        type: 'metrics',
                        message: 'Add specific numbers or percentages to quantify your achievements',
                        icon: '📊'
                    });
                }
            }

            // Keyword suggestions based on common job requirements
            if (elementName.includes('summary') || elementName.includes('description')) {
                const keywords = this.getRelevantKeywords(text);
                if (keywords.length > 0) {
                    suggestions.push({
                        type: 'keywords',
                        message: `Consider adding: ${keywords.slice(0, 3).join(', ')}`,
                        icon: '🔑'
                    });
                }
            }
        }

        this.displayAISuggestions(element, suggestions);
    }

    getRelevantKeywords(text) {
        const commonKeywords = [
            'collaboration', 'leadership', 'problem-solving', 'innovation',
            'agile', 'scrum', 'project management', 'team player',
            'results-driven', 'analytical', 'strategic thinking'
        ];

        return commonKeywords.filter(keyword => 
            !text.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    displayAISuggestions(element, suggestions) {
        const suggestionContainer = element.parentNode.querySelector('.ai-suggestions-inline') || 
                                   element.parentNode.querySelector('.ai-hint');
        
        if (!suggestionContainer) return;

        if (suggestions.length === 0) {
            suggestionContainer.innerHTML = '';
            return;
        }

        const suggestionsHTML = suggestions.map(suggestion => `
            <div class="ai-suggestion-item ${suggestion.type}">
                <span class="suggestion-icon">${suggestion.icon}</span>
                <span class="suggestion-text">${suggestion.message}</span>
                <button class="apply-suggestion" onclick="applySuggestion(this)">Apply</button>
            </div>
        `).join('');

        suggestionContainer.innerHTML = suggestionsHTML;
    }

    updatePreview() {
        const preview = document.getElementById('resumePreview');
        if (!preview) return;

        // Collect all form data
        this.collectFormData();
        
        // Generate updated preview
        preview.innerHTML = this.generatePreview();
    }

    collectFormData() {
        // Personal info
        this.resumeData.personalInfo = {
            name: document.getElementById('fullName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            linkedin: document.getElementById('linkedin')?.value || '',
            github: document.getElementById('github')?.value || '',
            location: document.getElementById('location')?.value || ''
        };

        // Summary
        this.resumeData.summary = document.getElementById('summaryText')?.value || '';

        // Experience
        this.resumeData.experience = this.collectExperienceData();

        // Education
        this.resumeData.education = this.collectEducationData();

        // Skills
        this.resumeData.skills = this.collectSkillsData();

        // Projects
        this.resumeData.projects = this.collectProjectsData();

        // Certifications
        this.resumeData.certifications = this.collectCertificationsData();
    }

    collectExperienceData() {
        const experienceItems = document.querySelectorAll('.experience-item');
        return Array.from(experienceItems).map(item => ({
            jobTitle: item.querySelector('[name="jobTitle"]')?.value || '',
            company: item.querySelector('[name="company"]')?.value || '',
            startDate: item.querySelector('[name="startDate"]')?.value || '',
            endDate: item.querySelector('[name="endDate"]')?.value || '',
            current: item.querySelector('[name="current"]')?.checked || false,
            description: item.querySelector('[name="description"]')?.value || ''
        }));
    }

    collectEducationData() {
        const educationItems = document.querySelectorAll('.education-item');
        return Array.from(educationItems).map(item => ({
            degree: item.querySelector('[name="degree"]')?.value || '',
            institution: item.querySelector('[name="institution"]')?.value || '',
            graduationYear: item.querySelector('[name="graduationYear"]')?.value || '',
            gpa: item.querySelector('[name="gpa"]')?.value || '',
            coursework: item.querySelector('[name="coursework"]')?.value || ''
        }));
    }

    collectSkillsData() {
        const technicalSkills = Array.from(document.querySelectorAll('#technicalSkills .skill-tag'))
            .map(tag => tag.textContent.replace('×', '').trim());
        const softSkills = Array.from(document.querySelectorAll('#softSkills .skill-tag'))
            .map(tag => tag.textContent.replace('×', '').trim());
        
        return {
            technical: technicalSkills,
            soft: softSkills
        };
    }

    collectProjectsData() {
        const projectItems = document.querySelectorAll('.project-item');
        return Array.from(projectItems).map(item => ({
            name: item.querySelector('[name="projectName"]')?.value || '',
            technologies: item.querySelector('[name="technologies"]')?.value || '',
            url: item.querySelector('[name="projectUrl"]')?.value || '',
            duration: item.querySelector('[name="duration"]')?.value || '',
            description: item.querySelector('[name="projectDescription"]')?.value || ''
        }));
    }

    collectCertificationsData() {
        const certificationItems = document.querySelectorAll('.certification-item');
        return Array.from(certificationItems).map(item => ({
            name: item.querySelector('[name="certName"]')?.value || '',
            issuer: item.querySelector('[name="issuer"]')?.value || '',
            issueDate: item.querySelector('[name="issueDate"]')?.value || '',
            expirationDate: item.querySelector('[name="expirationDate"]')?.value || '',
            noExpiration: item.querySelector('[name="noExpiration"]')?.checked || false,
            credentialUrl: item.querySelector('[name="credentialUrl"]')?.value || ''
        }));
    }

    generatePreview() {
        const data = this.resumeData;
        
        return `
            <div class="resume-document">
                <header class="resume-header">
                    <h1>${data.personalInfo.name || 'Your Name'}</h1>
                    <div class="contact-info">
                        ${data.personalInfo.email ? `<span>📧 ${data.personalInfo.email}</span>` : ''}
                        ${data.personalInfo.phone ? `<span>📞 ${data.personalInfo.phone}</span>` : ''}
                        ${data.personalInfo.location ? `<span>📍 ${data.personalInfo.location}</span>` : ''}
                        ${data.personalInfo.linkedin ? `<span>💼 LinkedIn</span>` : ''}
                        ${data.personalInfo.github ? `<span>💻 GitHub</span>` : ''}
                    </div>
                </header>

                ${data.summary ? `
                    <section class="resume-section">
                        <h2>Professional Summary</h2>
                        <p>${data.summary}</p>
                    </section>
                ` : ''}

                ${data.experience.length > 0 ? `
                    <section class="resume-section">
                        <h2>Work Experience</h2>
                        ${data.experience.map(exp => `
                            <div class="experience-entry">
                                <div class="entry-header">
                                    <h3>${exp.jobTitle} - ${exp.company}</h3>
                                    <span class="date-range">
                                        ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                ${exp.description ? `<div class="entry-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${data.education.length > 0 ? `
                    <section class="resume-section">
                        <h2>Education</h2>
                        ${data.education.map(edu => `
                            <div class="education-entry">
                                <div class="entry-header">
                                    <h3>${edu.degree}</h3>
                                    <span class="date-range">${edu.graduationYear}</span>
                                </div>
                                <p>${edu.institution}</p>
                                ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                                ${edu.coursework ? `<p><strong>Relevant Coursework:</strong> ${edu.coursework}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${(data.skills.technical?.length > 0 || data.skills.soft?.length > 0) ? `
                    <section class="resume-section">
                        <h2>Skills</h2>
                        ${data.skills.technical?.length > 0 ? `
                            <div class="skills-category">
                                <h4>Technical Skills</h4>
                                <div class="skills-list">${data.skills.technical.join(', ')}</div>
                            </div>
                        ` : ''}
                        ${data.skills.soft?.length > 0 ? `
                            <div class="skills-category">
                                <h4>Soft Skills</h4>
                                <div class="skills-list">${data.skills.soft.join(', ')}</div>
                            </div>
                        ` : ''}
                    </section>
                ` : ''}

                ${data.projects.length > 0 ? `
                    <section class="resume-section">
                        <h2>Projects</h2>
                        ${data.projects.map(project => `
                            <div class="project-entry">
                                <div class="entry-header">
                                    <h3>${project.name}</h3>
                                    ${project.duration ? `<span class="date-range">${project.duration}</span>` : ''}
                                </div>
                                ${project.technologies ? `<p><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
                                ${project.description ? `<div class="entry-description">${project.description.replace(/\n/g, '<br>')}</div>` : ''}
                                ${project.url ? `<p><a href="${project.url}" target="_blank">View Project</a></p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${data.certifications.length > 0 ? `
                    <section class="resume-section">
                        <h2>Certifications</h2>
                        ${data.certifications.map(cert => `
                            <div class="certification-entry">
                                <div class="entry-header">
                                    <h3>${cert.name}</h3>
                                    <span class="date-range">
                                        ${cert.issueDate} ${cert.noExpiration ? '' : `- ${cert.expirationDate}`}
                                    </span>
                                </div>
                                ${cert.issuer ? `<p>${cert.issuer}</p>` : ''}
                                ${cert.credentialUrl ? `<p><a href="${cert.credentialUrl}" target="_blank">View Credential</a></p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
            </div>
        `;
    }

    addExperienceItem() {
        const experienceList = document.getElementById('experienceList');
        const newIndex = experienceList.children.length;
        experienceList.insertAdjacentHTML('beforeend', this.createExperienceItem(newIndex));
    }

    exportResumeData() {
        this.collectFormData();
        return this.resumeData;
    }

    importResumeData(data) {
        this.resumeData = { ...this.resumeData, ...data };
        this.populateForm();
        this.updatePreview();
    }

    populateForm() {
        // Populate personal info
        Object.keys(this.resumeData.personalInfo).forEach(key => {
            const element = document.getElementById(key === 'name' ? 'fullName' : key);
            if (element) {
                element.value = this.resumeData.personalInfo[key];
            }
        });

        // Populate summary
        const summaryElement = document.getElementById('summaryText');
        if (summaryElement) {
            summaryElement.value = this.resumeData.summary;
        }

        // Note: Other sections would need similar population logic
        // This is a simplified version for demonstration
    }
}

// Global functions for dynamic content management
window.removeExperienceItem = function(index) {
    const item = document.querySelector(`.experience-item[data-index="${index}"]`);
    if (item) item.remove();
};

window.removeEducationItem = function(index) {
    const item = document.querySelector(`.education-item[data-index="${index}"]`);
    if (item) item.remove();
};

window.removeProjectItem = function(index) {
    const item = document.querySelector(`.project-item[data-index="${index}"]`);
    if (item) item.remove();
};

window.removeCertificationItem = function(index) {
    const item = document.querySelector(`.certification-item[data-index="${index}"]`);
    if (item) item.remove();
};

window.addSkill = function(category) {
    const input = document.getElementById(`${category}SkillInput`);
    const container = document.getElementById(`${category}Skills`);
    
    if (input.value.trim()) {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `${input.value.trim()} <button onclick="this.parentElement.remove()">×</button>`;
        container.appendChild(skillTag);
        input.value = '';
    }
};

window.applySuggestion = function(button) {
    // This would implement the logic to apply AI suggestions
    button.parentElement.style.display = 'none';
};