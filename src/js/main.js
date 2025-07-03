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
        
        this.currentAnalysis = null;
        this.currentResumeText = '';
        this.currentResumeData = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.initializeEventListeners();
        this.setupEnhancedFeatures();
        this.addFeedbackModal();
        
        // Make feedback system globally available
        window.userFeedback = this.userFeedback;
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
                this.switchTab(e.target.dataset.tab);
            });
        });

        // New analysis button
        document.getElementById('newAnalysisBtn')?.addEventListener('click', this.resetAnalysis.bind(this));

        // Report buttons
        document.getElementById('downloadPdfBtn')?.addEventListener('click', this.downloadPdfReport.bind(this));
        document.getElementById('copyReportBtn')?.addEventListener('click', this.copyTextReport.bind(this));

        // Enhanced features navigation
        this.setupEnhancedNavigation();
    }

    setupEnhancedNavigation() {
        // Add navigation for enhanced features
        const header = document.querySelector('.header-content');
        if (header) {
            const nav = document.createElement('nav');
            nav.className = 'enhanced-nav';
            nav.innerHTML = `
                <div class="nav-buttons">
                    <button class="nav-btn active" data-feature="analyzer">📊 Analyzer</button>
                    <button class="nav-btn" data-feature="builder">📝 Builder</button>
                    <button class="nav-btn" data-feature="cover-letter">📄 Cover Letter</button>
                    <button class="nav-btn" data-feature="interview">🎯 Interview Prep</button>
                </div>
            `;
            header.appendChild(nav);

            // Add navigation event listeners
            nav.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-btn')) {
                    this.switchFeature(e.target.dataset.feature);
                    
                    // Update active state
                    nav.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        }
    }

    setupEnhancedFeatures() {
        // Create containers for enhanced features
        const main = document.querySelector('.main .container');
        if (main) {
            // Resume Builder
            const builderSection = document.createElement('section');
            builderSection.id = 'builderSection';
            builderSection.className = 'feature-section';
            builderSection.style.display = 'none';
            builderSection.innerHTML = this.resumeBuilder.createBuilderInterface();
            main.appendChild(builderSection);

            // Cover Letter Generator
            const coverLetterSection = document.createElement('section');
            coverLetterSection.id = 'coverLetterSection';
            coverLetterSection.className = 'feature-section';
            coverLetterSection.style.display = 'none';
            coverLetterSection.innerHTML = this.coverLetterGenerator.createCoverLetterInterface();
            main.appendChild(coverLetterSection);

            // Interview Prep
            const interviewSection = document.createElement('section');
            interviewSection.id = 'interviewSection';
            interviewSection.className = 'feature-section';
            interviewSection.style.display = 'none';
            interviewSection.innerHTML = this.interviewPrep.createInterviewPrepInterface();
            main.appendChild(interviewSection);

            // Initialize enhanced features
            this.initializeEnhancedFeatures();
        }
    }

    initializeEnhancedFeatures() {
        // Initialize Resume Builder
        this.resumeBuilder.initializeBuilder();

        // Cover Letter Generator events
        document.getElementById('generateCoverLetterBtn')?.addEventListener('click', this.generateCoverLetter.bind(this));

        // Interview Prep events
        document.getElementById('generateQuestionsBtn')?.addEventListener('click', this.generateInterviewQuestions.bind(this));
        
        // Practice mode events
        document.getElementById('startPracticeBtn')?.addEventListener('click', this.startInterviewPractice.bind(this));
        document.getElementById('nextQuestionBtn')?.addEventListener('click', this.nextPracticeQuestion.bind(this));

        // Tab switching for enhanced features
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const tabName = e.target.dataset.tab;
                this.switchEnhancedTab(e.target, tabName);
            }
        });
    }

    addFeedbackModal() {
        // Add feedback modal to the page
        const modalHTML = this.userFeedback.createDetailedFeedbackModal();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    switchFeature(featureName) {
        // Hide all feature sections
        document.querySelectorAll('.feature-section').forEach(section => {
            section.style.display = 'none';
        });

        // Hide original sections
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';

        // Show selected feature
        switch (featureName) {
            case 'analyzer':
                document.getElementById('uploadSection').style.display = 'block';
                if (this.currentAnalysis) {
                    document.getElementById('resultsSection').style.display = 'block';
                }
                break;
            case 'builder':
                document.getElementById('builderSection').style.display = 'block';
                break;
            case 'cover-letter':
                document.getElementById('coverLetterSection').style.display = 'block';
                break;
            case 'interview':
                document.getElementById('interviewSection').style.display = 'block';
                break;
        }
    }

    switchEnhancedTab(tabButton, tabName) {
        const container = tabButton.closest('.feature-section');
        if (!container) return;

        // Update tab buttons
        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        tabButton.classList.add('active');

        // Update tab content
        container.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        container.querySelector(`#${tabName}Tab`)?.classList.add('active');
    }

    handleFileUpload(file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('File size too large. Please upload a file smaller than 10MB.');
            return;
        }

        const uploadContent = document.querySelector('.upload-content');
        if (uploadContent) {
            uploadContent.innerHTML = `
                <div class="upload-icon-large">✅</div>
                <p><strong>${file.name}</strong> uploaded successfully</p>
                <small>File size: ${(file.size / 1024 / 1024).toFixed(2)} MB</small>
            `;
        }

        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }
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
            alert('Please upload a resume first.');
            return;
        }

        // Show loading section
        this.showSection('loadingSection');
        this.simulateLoadingSteps();

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
                    alert('Please enter a job description.');
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

            // Display results
            setTimeout(() => {
                this.displayResults();
                this.showSection('resultsSection');
            }, 2000);

        } catch (error) {
            console.error('Analysis error:', error);
            alert('Error analyzing resume. Please try again.');
            this.showSection('uploadSection');
        }
    }

    simulateLoadingSteps() {
        const steps = document.querySelectorAll('.step');
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep > 0) {
                steps[currentStep - 1]?.classList.remove('active');
            }
            if (currentStep < steps.length) {
                steps[currentStep]?.classList.add('active');
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 500);
    }

    displayResults() {
        const analysis = this.currentAnalysis;

        // Update score cards
        const overallScore = document.getElementById('overallScore');
        const skillMatch = document.getElementById('skillMatch');
        const keywordsFound = document.getElementById('keywordsFound');
        const readabilityScore = document.getElementById('readabilityScore');

        if (overallScore) overallScore.textContent = analysis.overallScore;
        if (skillMatch) skillMatch.textContent = `${analysis.skillMatchPercentage.toFixed(1)}%`;
        if (keywordsFound) keywordsFound.textContent = analysis.matchedKeywords.length;
        if (readabilityScore) readabilityScore.textContent = analysis.readabilityScore.toFixed(1);

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
    }

    populateSkillsAnalysis(analysis) {
        const matchedSkillsContainer = document.getElementById('matchedSkills');
        const missingSkillsContainer = document.getElementById('missingSkills');
        const foundKeywordsContainer = document.getElementById('foundKeywords');
        const missingKeywordsContainer = document.getElementById('missingKeywords');

        // Matched skills
        if (matchedSkillsContainer) {
            matchedSkillsContainer.innerHTML = '';
            if (analysis.matchedSkills.length > 0) {
                analysis.matchedSkills.forEach(skill => {
                    const skillElement = document.createElement('div');
                    skillElement.className = 'skill-item';
                    skillElement.textContent = `✓ ${skill}`;
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
                analysis.missingSkills.slice(0, 10).forEach(skill => {
                    const skillElement = document.createElement('div');
                    skillElement.className = 'skill-item missing';
                    skillElement.textContent = `✗ ${skill}`;
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

        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-item';

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

    generateCoverLetter() {
        const template = document.getElementById('coverLetterTemplate')?.value || 'professional';
        const companyName = document.getElementById('companyName')?.value || '';
        const jobTitle = document.getElementById('jobTitle')?.value || '';
        const additionalInfo = document.getElementById('additionalInfo')?.value || '';

        if (!companyName || !jobTitle) {
            alert('Please enter company name and job title.');
            return;
        }

        // Get resume data from builder or current analysis
        const resumeData = this.resumeBuilder.exportResumeData();
        
        // Create job data object
        const jobData = {
            company: companyName,
            title: jobTitle,
            ...this.currentJobData
        };

        // Generate cover letter
        const coverLetter = this.coverLetterGenerator.generateCoverLetter(resumeData, jobData, template);

        // Display result
        const output = document.getElementById('coverLetterOutput');
        const content = document.getElementById('coverLetterContent');
        
        if (output && content) {
            content.textContent = coverLetter;
            output.style.display = 'block';
        }

        // Setup output actions
        this.setupCoverLetterActions(coverLetter);
    }

    setupCoverLetterActions(coverLetter) {
        document.getElementById('copyCoverLetterBtn')?.addEventListener('click', () => {
            navigator.clipboard.writeText(coverLetter).then(() => {
                alert('Cover letter copied to clipboard!');
            });
        });

        document.getElementById('downloadCoverLetterBtn')?.addEventListener('click', () => {
            const blob = new Blob([coverLetter], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cover_letter.txt';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    generateInterviewQuestions() {
        const jobRole = document.getElementById('interviewJobRole')?.value || 'software-engineer';
        const interviewType = document.getElementById('interviewType')?.value || 'mixed';
        const questionCount = parseInt(document.getElementById('questionCount')?.value) || 10;

        // Get resume data
        const resumeData = this.resumeBuilder.exportResumeData();

        // Generate questions
        const questions = this.interviewPrep.generateInterviewQuestions(resumeData, jobRole, interviewType);
        const selectedQuestions = questions.slice(0, questionCount);

        // Display questions
        this.interviewPrep.populateQuestions(selectedQuestions);
        this.interviewPrep.populateTips();

        // Show prep content
        const prepContent = document.getElementById('prepContent');
        if (prepContent) {
            prepContent.style.display = 'block';
        }

        // Store questions for practice mode
        this.currentInterviewQuestions = selectedQuestions;
    }

    startInterviewPractice() {
        if (!this.currentInterviewQuestions) {
            alert('Please generate questions first.');
            return;
        }

        this.interviewPrep.startPracticeMode(this.currentInterviewQuestions);
    }

    nextPracticeQuestion() {
        this.interviewPrep.nextPracticeQuestion();
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`)?.classList.add('active');
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
        if (targetSection) targetSection.style.display = 'block';
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
                <div class="upload-icon-large">📄</div>
                <p>Drag & drop your PDF resume here or <span class="upload-link">browse files</span></p>
                <small>Supports PDF files up to 10MB</small>
            `;
        }

        // Show upload section
        this.showSection('uploadSection');
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
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF report. Please try again.');
        }
    }

    async copyTextReport() {
        if (!this.currentAnalysis) return;

        const reportText = this.reportGenerator.generateTextReport(this.currentAnalysis, this.currentResumeText);
        
        try {
            await navigator.clipboard.writeText(reportText);
            alert('Report copied to clipboard!');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            // Fallback: select text in preview
            const preview = document.getElementById('reportPreview');
            if (preview) {
                const range = document.createRange();
                range.selectNode(preview);
                window.getSelection()?.removeAllRanges();
                window.getSelection()?.addRange(range);
                alert('Report text selected. Press Ctrl+C to copy.');
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartResumeAnalyzer();
});