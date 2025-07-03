import { ResumeParser } from './modules/resumeParser.js';
import { JobMatcher } from './modules/jobMatcher.js';
import { SuggestionEngine } from './modules/suggestionEngine.js';
import { ReportGenerator } from './modules/reportGenerator.js';
import { ChartRenderer } from './modules/chartRenderer.js';
import { ResumeBuilder } from './modules/resumeBuilder.js';
import { CoverLetterGenerator } from './modules/coverLetterGenerator.js';
import { InterviewPrep } from './modules/interviewPrep.js';
import { UserFeedback } from './modules/userFeedback.js';
import { AccessibilityManager } from './modules/accessibilityManager.js';

class SmartResumeAnalyzer {
    constructor() {
        this.resumeParser = new ResumeParser();
        this.jobMatcher = new JobMatcher();
        this.suggestionEngine = new SuggestionEngine();
        this.reportGenerator = new ReportGenerator();
        this.chartRenderer = new ChartRenderer();
        this.resumeBuilder = new ResumeBuilder();
        this.coverLetterGenerator = new CoverLetterGenerator();
        this.interviewPrep = new InterviewPrep();
        this.userFeedback = new UserFeedback();
        this.accessibilityManager = new AccessibilityManager();
        
        this.currentAnalysis = null;
        this.currentResumeText = '';
        this.currentResumeData = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.initializeEventListeners();
        this.initializeTheme();
        this.initializeAnimations();
        this.initializeNavigation();
        this.addFeedbackModal();
        
        // Make feedback system globally available
        window.userFeedback = this.userFeedback;
        
        // Add global scroll functions
        window.scrollToUpload = this.scrollToUpload.bind(this);
        window.scrollToFeatures = this.scrollToFeatures.bind(this);
    }

    initializeEventListeners() {
        // File upload handling
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('resumeFile');
        const analyzeBtn = document.getElementById('analyzeBtn');

        // Upload area click
        uploadArea?.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea?.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                fileInput.files = files;
                this.handleFileUpload(files[0]);
            }
        });

        // File input change
        fileInput?.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Job type radio buttons
        const jobTypeRadios = document.querySelectorAll('input[name="jobType"]');
        jobTypeRadios.forEach(radio => {
            radio.addEventListener('change', this.handleJobTypeChange.bind(this));
        });

        // Analyze button
        analyzeBtn?.addEventListener('click', this.analyzeResume.bind(this));

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab || e.target.closest('.tab-btn').dataset.tab);
            });
        });

        // New analysis button
        document.getElementById('newAnalysisBtn')?.addEventListener('click', this.resetAnalysis.bind(this));

        // Report buttons
        document.getElementById('downloadPdfBtn')?.addEventListener('click', this.downloadPdfReport.bind(this));
        document.getElementById('copyReportBtn')?.addEventListener('click', this.copyTextReport.bind(this));

        // Share results button
        document.getElementById('shareResultsBtn')?.addEventListener('click', this.shareResults.bind(this));
    }

    initializeTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.body.className = savedTheme + '-mode';
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.className = newTheme + '-mode';
            localStorage.setItem('theme', newTheme);
            
            // Announce theme change to screen readers
            this.announceToScreenReader(`Switched to ${newTheme} mode`);
        });
    }

    initializeAnimations() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }

        // Add intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.score-card, .feature-card, .step-item').forEach(el => {
            observer.observe(el);
        });
    }

    initializeNavigation() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        navToggle?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Close mobile menu
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', this.updateActiveNavLink.bind(this));
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    scrollToUpload() {
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
            uploadSection.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    scrollToFeatures() {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    addFeedbackModal() {
        const modalHTML = this.userFeedback.createDetailedFeedbackModal();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    handleFileUpload(file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showToast('File size too large. Please upload a file smaller than 10MB.', 'error');
            return;
        }

        const uploadContent = document.querySelector('.upload-content');
        if (uploadContent) {
            uploadContent.innerHTML = `
                <div class="upload-icon-large">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3><strong>${file.name}</strong> uploaded successfully</h3>
                <p>File size: ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <small>Ready for analysis</small>
            `;
            uploadContent.classList.add('success');
        }

        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }

        // Update progress indicator
        this.updateProgressStep('upload', 'completed');
        this.updateProgressStep('analyze', 'active');

        this.showToast('Resume uploaded successfully!', 'success');
    }

    handleJobTypeChange(e) {
        const predefinedRoles = document.getElementById('predefinedRoles');
        const customJobInput = document.getElementById('customJobInput');

        if (e.target.value === 'predefined') {
            if (predefinedRoles) predefinedRoles.style.display = 'block';
            if (customJobInput) customJobInput.style.display = 'none';
        } else {
            if (predefinedRoles) predefinedRoles.style.display = 'none';
            if (customJobInput) customJobInput.style.display = 'block';
        }
    }

    async analyzeResume() {
        const fileInput = document.getElementById('resumeFile');
        const jobTypeRadios = document.querySelectorAll('input[name="jobType"]');
        const selectedJobType = Array.from(jobTypeRadios).find(radio => radio.checked)?.value;

        if (!fileInput?.files[0]) {
            this.showToast('Please upload a resume first.', 'error');
            return;
        }

        // Update progress
        this.updateProgressStep('analyze', 'active');
        
        // Show loading section
        this.showSection('loadingSection');
        this.simulateLoadingProgress();

        try {
            // Extract text from PDF
            this.currentResumeText = await this.resumeParser.extractTextFromPDF(fileInput.files[0]);
            
            // Get job requirements
            let jobData;
            if (selectedJobType === 'predefined') {
                const selectedRole = document.getElementById('jobRoleSelect')?.value;
                jobData = this.jobMatcher.getJobRequirements(selectedRole);
            } else {
                const jobDescription = document.getElementById('jobDescription')?.value;
                if (!jobDescription?.trim()) {
                    this.showToast('Please enter a job description.', 'error');
                    this.showSection('uploadSection');
                    return;
                }
                jobData = this.jobMatcher.analyzeJobDescription(jobDescription);
            }

            // Perform analysis
            this.currentAnalysis = this.jobMatcher.analyzeResume(this.currentResumeText, jobData);
            
            // Generate suggestions
            const suggestions = this.suggestionEngine.generateSuggestions(this.currentAnalysis, jobData);
            this.currentAnalysis.suggestions = suggestions;

            // Store job data for other features
            this.currentJobData = jobData;

            // Display results after loading animation
            setTimeout(() => {
                this.updateProgressStep('analyze', 'completed');
                this.updateProgressStep('results', 'active');
                this.displayResults();
                this.showSection('resultsSection');
                this.showToast('Analysis completed successfully!', 'success');
            }, 3000);

        } catch (error) {
            console.error('Analysis error:', error);
            this.showToast('Error analyzing resume. Please try again.', 'error');
            this.showSection('uploadSection');
            this.updateProgressStep('analyze', 'active');
        }
    }

    simulateLoadingProgress() {
        const progressFill = document.getElementById('loadingProgress');
        const progressText = document.getElementById('progressText');
        const steps = document.querySelectorAll('.loading-steps .step');
        
        let progress = 0;
        let currentStep = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;

            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}%`;
            }

            // Update steps
            const stepProgress = Math.floor((progress / 100) * steps.length);
            if (stepProgress > currentStep && currentStep < steps.length) {
                if (steps[currentStep]) {
                    steps[currentStep].classList.remove('active');
                }
                currentStep = stepProgress;
                if (steps[currentStep]) {
                    steps[currentStep].classList.add('active');
                }
            }

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200);
    }

    updateProgressStep(step, status) {
        const stepElement = document.querySelector(`[data-step="${step}"]`);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');
            stepElement.classList.add(status);
        }
    }

    displayResults() {
        const analysis = this.currentAnalysis;

        // Update score cards with animation
        this.animateScoreCard('overallScore', analysis.overallScore, 100);
        this.animateScoreCard('skillMatch', analysis.skillMatchPercentage, 100, '%');
        this.animateScoreCard('keywordsFound', analysis.matchedKeywords.length, analysis.matchedKeywords.length);
        this.animateScoreCard('readabilityScore', analysis.readabilityScore, 100);

        // Update progress bars
        this.updateProgressBar('overallProgress', analysis.overallScore);

        // Populate skills analysis
        this.populateSkillsAnalysis(analysis);

        // Populate suggestions with feedback widgets
        this.populateSuggestionsWithFeedback(analysis.suggestions);

        // Render chart
        this.chartRenderer.renderScoreChart(analysis);

        // Populate section analysis
        this.populateSectionAnalysis(analysis);

        // Generate report preview
        this.generateReportPreview();

        // Add entrance animations
        setTimeout(() => {
            document.querySelectorAll('.score-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        }, 500);
    }

    animateScoreCard(elementId, targetValue, maxValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        let currentValue = 0;
        const increment = targetValue / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            if (suffix === '%') {
                element.textContent = `${Math.round(currentValue)}${suffix}`;
            } else {
                element.textContent = Math.round(currentValue);
            }
        }, stepTime);
    }

    updateProgressBar(elementId, percentage) {
        const element = document.getElementById(elementId);
        if (element) {
            setTimeout(() => {
                element.style.width = `${percentage}%`;
            }, 500);
        }
    }

    populateSkillsAnalysis(analysis) {
        const matchedSkillsContainer = document.getElementById('matchedSkills');
        const missingSkillsContainer = document.getElementById('missingSkills');
        const foundKeywordsContainer = document.getElementById('foundKeywords');
        const missingKeywordsContainer = document.getElementById('missingKeywords');
        const matchedSkillsCount = document.getElementById('matchedSkillsCount');
        const missingSkillsCount = document.getElementById('missingSkillsCount');

        // Update counts
        if (matchedSkillsCount) matchedSkillsCount.textContent = analysis.matchedSkills.length;
        if (missingSkillsCount) missingSkillsCount.textContent = analysis.missingSkills.length;

        // Matched skills
        if (matchedSkillsContainer) {
            matchedSkillsContainer.innerHTML = '';
            if (analysis.matchedSkills.length > 0) {
                analysis.matchedSkills.forEach((skill, index) => {
                    const skillElement = document.createElement('div');
                    skillElement.className = 'skill-item';
                    skillElement.textContent = `✓ ${skill}`;
                    skillElement.style.animationDelay = `${index * 50}ms`;
                    matchedSkillsContainer.appendChild(skillElement);
                });
            } else {
                matchedSkillsContainer.innerHTML = '<p>No specific skills matched. Consider adding more relevant skills.</p>';
            }
        }

        // Missing skills
        if (missingSkillsContainer) {
            missingSkillsContainer.innerHTML = '';
            if (analysis.missingSkills.length > 0) {
                analysis.missingSkills.slice(0, 10).forEach((skill, index) => {
                    const skillElement = document.createElement('div');
                    skillElement.className = 'skill-item missing';
                    skillElement.textContent = `✗ ${skill}`;
                    skillElement.style.animationDelay = `${index * 50}ms`;
                    missingSkillsContainer.appendChild(skillElement);
                });
            } else {
                missingSkillsContainer.innerHTML = '<p>Great! You have most of the required skills.</p>';
            }
        }

        // Found keywords
        if (foundKeywordsContainer) {
            foundKeywordsContainer.innerHTML = '';
            analysis.matchedKeywords.slice(0, 15).forEach(keyword => {
                const tag = document.createElement('span');
                tag.className = 'keyword-tag found';
                tag.textContent = keyword;
                foundKeywordsContainer.appendChild(tag);
            });
        }

        // Missing keywords
        if (missingKeywordsContainer) {
            missingKeywordsContainer.innerHTML = '';
            analysis.missingKeywords.slice(0, 15).forEach(keyword => {
                const tag = document.createElement('span');
                tag.className = 'keyword-tag missing';
                tag.textContent = keyword;
                missingKeywordsContainer.appendChild(tag);
            });
        }
    }

    populateSuggestionsWithFeedback(suggestions) {
        const container = document.getElementById('suggestionsContainer');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(suggestions).forEach(([category, items]) => {
            if (items.length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'suggestion-category';

                const title = document.createElement('h3');
                title.textContent = `💡 ${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`;
                categoryDiv.appendChild(title);

                const list = document.createElement('div');
                list.className = 'suggestion-list';

                items.forEach((item, index) => {
                    const suggestionDiv = document.createElement('div');
                    suggestionDiv.className = 'suggestion-item';
                    suggestionDiv.textContent = item;

                    // Add feedback widget
                    const suggestionId = `${category}_${index}`;
                    const feedbackWidget = this.userFeedback.createFeedbackWidget(suggestionId, item, 'suggestion');
                    suggestionDiv.insertAdjacentHTML('afterend', feedbackWidget);

                    list.appendChild(suggestionDiv);
                });

                categoryDiv.appendChild(list);
                container.appendChild(categoryDiv);
            }
        });
    }

    populateSectionAnalysis(analysis) {
        const container = document.getElementById('sectionAnalysis');
        if (!container) return;

        container.innerHTML = '<h3>📄 Resume Sections Analysis</h3>';

        const sections = [
            { name: 'Summary/Objective', present: analysis.hasSummary, quality: analysis.summaryQuality },
            { name: 'Work Experience', present: analysis.hasExperience, quality: analysis.experienceQuality },
            { name: 'Education', present: analysis.hasEducation, quality: analysis.educationQuality },
            { name: 'Skills', present: analysis.hasSkills, quality: analysis.skillsQuality },
            { name: 'Projects', present: analysis.hasProjects, quality: analysis.projectsQuality }
        ];

        sections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-item';
            sectionDiv.style.animationDelay = `${index * 100}ms`;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'section-name';
            nameSpan.textContent = section.name;

            const statusSpan = document.createElement('span');
            statusSpan.className = `section-status ${section.quality || 'missing'}`;
            statusSpan.textContent = section.present ? 
                (section.quality === 'good' ? 'Good' : 'Needs Improvement') : 
                'Missing';

            sectionDiv.appendChild(nameSpan);
            sectionDiv.appendChild(statusSpan);
            container.appendChild(sectionDiv);
        });
    }

    generateReportPreview() {
        const preview = document.getElementById('reportPreview');
        if (!preview || !this.currentAnalysis) return;
        
        const reportText = this.reportGenerator.generateTextReport(this.currentAnalysis, this.currentResumeText);
        preview.textContent = reportText;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${tabName}Tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Announce tab change to screen readers
        this.announceToScreenReader(`Switched to ${tabName} tab`);
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = ['uploadSection', 'loadingSection', 'resultsSection'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    resetAnalysis() {
        this.currentAnalysis = null;
        this.currentResumeText = '';
        this.currentJobData = null;
        
        // Reset file input
        const fileInput = document.getElementById('resumeFile');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        if (fileInput) fileInput.value = '';
        if (analyzeBtn) analyzeBtn.disabled = true;
        
        // Reset upload area
        const uploadContent = document.querySelector('.upload-content');
        if (uploadContent) {
            uploadContent.innerHTML = `
                <div class="upload-icon-large">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3>Drag & drop your PDF resume here</h3>
                <p>or <span class="upload-link">browse files</span></p>
                <small>Supports PDF files up to 10MB</small>
            `;
            uploadContent.classList.remove('success');
        }

        // Reset progress indicator
        this.updateProgressStep('upload', 'active');
        this.updateProgressStep('analyze', '');
        this.updateProgressStep('results', '');

        // Show upload section
        this.showSection('uploadSection');
        
        this.showToast('Ready for new analysis', 'success');
    }

    async downloadPdfReport() {
        if (!this.currentAnalysis) return;

        try {
            const pdfBlob = await this.reportGenerator.generatePdfReport(this.currentAnalysis, this.currentResumeText);
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resume_analysis_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('PDF report downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showToast('Error generating PDF report. Please try again.', 'error');
        }
    }

    async copyTextReport() {
        if (!this.currentAnalysis) return;

        const reportText = this.reportGenerator.generateTextReport(this.currentAnalysis, this.currentResumeText);
        
        try {
            await navigator.clipboard.writeText(reportText);
            this.showToast('Report copied to clipboard!', 'success');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            // Fallback: select text in preview
            const preview = document.getElementById('reportPreview');
            if (preview) {
                const range = document.createRange();
                range.selectNode(preview);
                window.getSelection()?.removeAllRanges();
                window.getSelection()?.addRange(range);
                this.showToast('Report text selected. Press Ctrl+C to copy.', 'warning');
            }
        }
    }

    async shareResults() {
        if (!this.currentAnalysis) return;

        const shareData = {
            title: 'My Resume Analysis Results',
            text: `I just analyzed my resume with ResumeAI Pro and got a score of ${this.currentAnalysis.overallScore}/100!`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showToast('Results shared successfully!', 'success');
            } else {
                // Fallback: copy URL to clipboard
                await navigator.clipboard.writeText(window.location.href);
                this.showToast('Link copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            this.showToast('Unable to share results', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Announce to screen readers
        this.announceToScreenReader(message);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartResumeAnalyzer();
});