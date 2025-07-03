export class InterviewPrep {
    constructor() {
        this.questionDatabase = {
            general: [
                "Tell me about yourself.",
                "Why are you interested in this position?",
                "What are your greatest strengths?",
                "What is your biggest weakness?",
                "Where do you see yourself in 5 years?",
                "Why are you leaving your current job?",
                "What motivates you?",
                "Describe a challenging situation and how you handled it.",
                "What are your salary expectations?",
                "Do you have any questions for us?"
            ],
            behavioral: [
                "Describe a time when you had to work with a difficult team member.",
                "Tell me about a project you're particularly proud of.",
                "Give an example of when you had to meet a tight deadline.",
                "Describe a situation where you had to learn something new quickly.",
                "Tell me about a time you failed and what you learned from it.",
                "How do you handle stress and pressure?",
                "Describe a time when you had to persuade someone to see your point of view.",
                "Tell me about a time you went above and beyond your job requirements.",
                "How do you prioritize your work when you have multiple deadlines?",
                "Describe a time when you had to adapt to a significant change."
            ],
            technical: {
                'software-engineer': [
                    "Explain the difference between == and === in JavaScript.",
                    "What is the time complexity of common sorting algorithms?",
                    "How would you optimize a slow database query?",
                    "Explain the concept of RESTful APIs.",
                    "What are the principles of object-oriented programming?",
                    "How do you handle version control in a team environment?",
                    "Explain the difference between SQL and NoSQL databases.",
                    "What is your approach to debugging complex issues?",
                    "How do you ensure code quality and maintainability?",
                    "Describe your experience with testing frameworks."
                ],
                'data-scientist': [
                    "Explain the bias-variance tradeoff.",
                    "How would you handle missing data in a dataset?",
                    "What's the difference between supervised and unsupervised learning?",
                    "How do you evaluate the performance of a machine learning model?",
                    "Explain overfitting and how to prevent it.",
                    "What statistical tests would you use to compare two groups?",
                    "How do you approach feature selection?",
                    "Explain the concept of p-values and statistical significance.",
                    "What's your process for data cleaning and preprocessing?",
                    "How do you communicate technical findings to non-technical stakeholders?"
                ],
                'product-manager': [
                    "How do you prioritize features in a product roadmap?",
                    "Describe your approach to gathering user requirements.",
                    "How do you measure product success?",
                    "Tell me about a time you had to make a difficult product decision.",
                    "How do you work with engineering teams to deliver products?",
                    "What frameworks do you use for product strategy?",
                    "How do you handle conflicting stakeholder requirements?",
                    "Describe your experience with A/B testing.",
                    "How do you stay informed about market trends and competition?",
                    "What's your approach to user research and validation?"
                ],
                'marketing-manager': [
                    "How do you measure the ROI of marketing campaigns?",
                    "Describe your experience with digital marketing channels.",
                    "How do you develop a marketing strategy for a new product?",
                    "What tools do you use for marketing analytics?",
                    "How do you approach customer segmentation?",
                    "Describe a successful marketing campaign you've managed.",
                    "How do you stay current with marketing trends?",
                    "What's your experience with content marketing?",
                    "How do you optimize conversion rates?",
                    "Describe your approach to brand management."
                ]
            }
        };

        this.tips = {
            preparation: [
                "Research the company thoroughly - their mission, values, recent news, and competitors",
                "Review the job description and prepare specific examples that demonstrate required skills",
                "Practice your elevator pitch - a 2-minute summary of your background and goals",
                "Prepare thoughtful questions to ask the interviewer about the role and company",
                "Plan your outfit and route to the interview location in advance"
            ],
            during: [
                "Arrive 10-15 minutes early to show punctuality and respect",
                "Maintain good eye contact and confident body language",
                "Listen carefully to questions and take a moment to think before answering",
                "Use the STAR method (Situation, Task, Action, Result) for behavioral questions",
                "Be specific and provide concrete examples rather than general statements"
            ],
            followUp: [
                "Send a thank-you email within 24 hours of the interview",
                "Reiterate your interest in the position and company",
                "Mention specific points from the conversation that excited you",
                "Address any concerns or questions that came up during the interview",
                "Keep it concise but personal and professional"
            ]
        };
    }

    generateInterviewQuestions(resumeData, jobRole, difficulty = 'mixed') {
        const questions = [];
        
        // Add general questions
        questions.push(...this.getRandomQuestions(this.questionDatabase.general, 3));
        
        // Add behavioral questions
        questions.push(...this.getRandomQuestions(this.questionDatabase.behavioral, 4));
        
        // Add role-specific technical questions
        if (this.questionDatabase.technical[jobRole]) {
            questions.push(...this.getRandomQuestions(this.questionDatabase.technical[jobRole], 3));
        }

        // Add personalized questions based on resume
        questions.push(...this.generatePersonalizedQuestions(resumeData));

        return questions;
    }

    getRandomQuestions(questionArray, count) {
        const shuffled = [...questionArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    generatePersonalizedQuestions(resumeData) {
        const questions = [];
        
        // Questions based on experience
        if (resumeData.experience && resumeData.experience.length > 0) {
            const latestJob = resumeData.experience[0];
            questions.push(`Tell me more about your role as ${latestJob.jobTitle} at ${latestJob.company}.`);
            
            if (latestJob.description) {
                questions.push(`You mentioned ${this.extractKeyword(latestJob.description)}. Can you elaborate on that experience?`);
            }
        }

        // Questions based on skills
        if (resumeData.skills && resumeData.skills.technical) {
            const topSkill = resumeData.skills.technical[0];
            if (topSkill) {
                questions.push(`How have you applied your ${topSkill} skills in real-world projects?`);
            }
        }

        // Questions based on projects
        if (resumeData.projects && resumeData.projects.length > 0) {
            const project = resumeData.projects[0];
            questions.push(`Tell me about the ${project.name} project you worked on.`);
        }

        // Questions based on education
        if (resumeData.education && resumeData.education.length > 0) {
            const education = resumeData.education[0];
            questions.push(`How has your ${education.degree} prepared you for this role?`);
        }

        return questions.slice(0, 3); // Return top 3 personalized questions
    }

    extractKeyword(text) {
        const keywords = ['developed', 'managed', 'led', 'created', 'implemented', 'designed', 'analyzed', 'improved'];
        const found = keywords.find(keyword => text.toLowerCase().includes(keyword));
        return found || 'your experience';
    }

    generateAnswerGuidance(question, resumeData) {
        const guidance = {
            structure: [],
            keyPoints: [],
            example: ''
        };

        // Behavioral question guidance
        if (this.isBehavioralQuestion(question)) {
            guidance.structure = [
                'Situation: Set the context',
                'Task: Explain what needed to be done',
                'Action: Describe what you did',
                'Result: Share the outcome and what you learned'
            ];
            guidance.keyPoints = [
                'Be specific and use real examples',
                'Focus on your individual contributions',
                'Quantify results when possible',
                'Show what you learned or how you grew'
            ];
        }
        
        // Technical question guidance
        else if (this.isTechnicalQuestion(question)) {
            guidance.structure = [
                'Define key concepts clearly',
                'Provide practical examples',
                'Discuss trade-offs and considerations',
                'Relate to real-world applications'
            ];
            guidance.keyPoints = [
                'Demonstrate deep understanding',
                'Show practical experience',
                'Discuss best practices',
                'Be honest about limitations'
            ];
        }
        
        // General question guidance
        else {
            guidance.structure = [
                'Start with a clear, concise answer',
                'Provide supporting details',
                'Connect to the role/company',
                'End with enthusiasm or a question'
            ];
            guidance.keyPoints = [
                'Be authentic and genuine',
                'Show enthusiasm for the role',
                'Connect your background to their needs',
                'Keep answers focused and relevant'
            ];
        }

        return guidance;
    }

    isBehavioralQuestion(question) {
        const behavioralKeywords = ['describe a time', 'tell me about', 'give an example', 'how do you handle'];
        return behavioralKeywords.some(keyword => question.toLowerCase().includes(keyword));
    }

    isTechnicalQuestion(question) {
        const technicalKeywords = ['explain', 'what is', 'how would you', 'difference between', 'algorithm', 'complexity'];
        return technicalKeywords.some(keyword => question.toLowerCase().includes(keyword));
    }

    createInterviewPrepInterface() {
        return `
            <div class="interview-prep">
                <div class="prep-header">
                    <h2>🎯 Interview Preparation</h2>
                    <p>Get ready for your interview with personalized questions and expert tips</p>
                </div>

                <div class="prep-options">
                    <div class="option-group">
                        <label>Job Role</label>
                        <select id="interviewJobRole">
                            <option value="software-engineer">Software Engineer</option>
                            <option value="data-scientist">Data Scientist</option>
                            <option value="product-manager">Product Manager</option>
                            <option value="marketing-manager">Marketing Manager</option>
                            <option value="business-analyst">Business Analyst</option>
                            <option value="ui-ux-designer">UI/UX Designer</option>
                        </select>
                    </div>

                    <div class="option-group">
                        <label>Interview Type</label>
                        <select id="interviewType">
                            <option value="mixed">Mixed (Recommended)</option>
                            <option value="behavioral">Behavioral Focus</option>
                            <option value="technical">Technical Focus</option>
                            <option value="general">General Questions</option>
                        </select>
                    </div>

                    <div class="option-group">
                        <label>Number of Questions</label>
                        <select id="questionCount">
                            <option value="5">5 Questions</option>
                            <option value="10" selected>10 Questions</option>
                            <option value="15">15 Questions</option>
                            <option value="20">20 Questions</option>
                        </select>
                    </div>

                    <button class="btn-primary" id="generateQuestionsBtn">
                        <span>🎯</span> Generate Questions
                    </button>
                </div>

                <div class="prep-content" id="prepContent" style="display: none;">
                    <div class="prep-tabs">
                        <button class="tab-btn active" data-tab="questions">Questions</button>
                        <button class="tab-btn" data-tab="tips">Tips</button>
                        <button class="tab-btn" data-tab="practice">Practice</button>
                    </div>

                    <div class="tab-content active" id="questionsTab">
                        <div class="questions-list" id="questionsList"></div>
                    </div>

                    <div class="tab-content" id="tipsTab">
                        <div class="tips-sections">
                            <div class="tip-section">
                                <h3>📋 Before the Interview</h3>
                                <ul id="preparationTips"></ul>
                            </div>
                            <div class="tip-section">
                                <h3>💼 During the Interview</h3>
                                <ul id="duringTips"></ul>
                            </div>
                            <div class="tip-section">
                                <h3>📧 After the Interview</h3>
                                <ul id="followUpTips"></ul>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content" id="practiceTab">
                        <div class="practice-mode">
                            <h3>🎭 Practice Mode</h3>
                            <p>Practice answering questions with a timer and get feedback</p>
                            <div class="practice-question" id="practiceQuestion">
                                <div class="question-text" id="currentQuestion"></div>
                                <div class="practice-controls">
                                    <button class="btn-secondary" id="startPracticeBtn">Start Practice</button>
                                    <button class="btn-secondary" id="nextQuestionBtn" style="display: none;">Next Question</button>
                                    <div class="timer" id="practiceTimer" style="display: none;">Time: <span id="timerDisplay">0:00</span></div>
                                </div>
                                <div class="answer-area" id="answerArea" style="display: none;">
                                    <textarea id="practiceAnswer" placeholder="Type your answer here..." rows="6"></textarea>
                                    <div class="answer-guidance" id="answerGuidance"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    populateQuestions(questions) {
        const questionsList = document.getElementById('questionsList');
        if (!questionsList) return;

        questionsList.innerHTML = questions.map((question, index) => `
            <div class="question-item">
                <div class="question-header">
                    <span class="question-number">${index + 1}</span>
                    <span class="question-type">${this.getQuestionType(question)}</span>
                </div>
                <div class="question-text">${question}</div>
                <div class="question-actions">
                    <button class="btn-small" onclick="showGuidance(${index})">💡 Get Guidance</button>
                    <button class="btn-small" onclick="practiceQuestion(${index})">🎭 Practice</button>
                </div>
                <div class="question-guidance" id="guidance${index}" style="display: none;"></div>
            </div>
        `).join('');
    }

    getQuestionType(question) {
        if (this.isBehavioralQuestion(question)) return 'Behavioral';
        if (this.isTechnicalQuestion(question)) return 'Technical';
        return 'General';
    }

    populateTips() {
        const preparationTips = document.getElementById('preparationTips');
        const duringTips = document.getElementById('duringTips');
        const followUpTips = document.getElementById('followUpTips');

        if (preparationTips) {
            preparationTips.innerHTML = this.tips.preparation.map(tip => `<li>${tip}</li>`).join('');
        }

        if (duringTips) {
            duringTips.innerHTML = this.tips.during.map(tip => `<li>${tip}</li>`).join('');
        }

        if (followUpTips) {
            followUpTips.innerHTML = this.tips.followUp.map(tip => `<li>${tip}</li>`).join('');
        }
    }

    startPracticeMode(questions) {
        this.practiceQuestions = questions;
        this.currentQuestionIndex = 0;
        this.practiceStartTime = null;
        
        this.showNextPracticeQuestion();
    }

    showNextPracticeQuestion() {
        if (this.currentQuestionIndex >= this.practiceQuestions.length) {
            this.endPracticeMode();
            return;
        }

        const question = this.practiceQuestions[this.currentQuestionIndex];
        const questionElement = document.getElementById('currentQuestion');
        const answerArea = document.getElementById('answerArea');
        const startBtn = document.getElementById('startPracticeBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const timer = document.getElementById('practiceTimer');

        if (questionElement) {
            questionElement.textContent = question;
        }

        if (answerArea) {
            answerArea.style.display = 'block';
        }

        if (startBtn) {
            startBtn.style.display = 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }

        if (timer) {
            timer.style.display = 'inline-block';
            this.startTimer();
        }

        // Show guidance for current question
        this.showAnswerGuidance(question);
    }

    startTimer() {
        this.practiceStartTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.practiceStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timerDisplay = document.getElementById('timerDisplay');
            if (timerDisplay) {
                timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    showAnswerGuidance(question) {
        const guidance = this.generateAnswerGuidance(question, {});
        const guidanceElement = document.getElementById('answerGuidance');
        
        if (guidanceElement) {
            guidanceElement.innerHTML = `
                <h4>💡 Answer Structure:</h4>
                <ul>
                    ${guidance.structure.map(point => `<li>${point}</li>`).join('')}
                </ul>
                <h4>🎯 Key Points:</h4>
                <ul>
                    ${guidance.keyPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
            `;
        }
    }

    nextPracticeQuestion() {
        this.stopTimer();
        this.currentQuestionIndex++;
        
        // Clear previous answer
        const answerTextarea = document.getElementById('practiceAnswer');
        if (answerTextarea) {
            answerTextarea.value = '';
        }

        this.showNextPracticeQuestion();
    }

    endPracticeMode() {
        this.stopTimer();
        const questionElement = document.getElementById('currentQuestion');
        const answerArea = document.getElementById('answerArea');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const timer = document.getElementById('practiceTimer');

        if (questionElement) {
            questionElement.textContent = 'Practice session completed! Great job preparing for your interview.';
        }

        if (answerArea) {
            answerArea.style.display = 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = 'none';
        }

        if (timer) {
            timer.style.display = 'none';
        }
    }
}

// Global functions for interview prep
window.showGuidance = function(questionIndex) {
    const guidanceElement = document.getElementById(`guidance${questionIndex}`);
    if (guidanceElement) {
        guidanceElement.style.display = guidanceElement.style.display === 'none' ? 'block' : 'none';
    }
};

window.practiceQuestion = function(questionIndex) {
    // Switch to practice tab and start with specific question
    document.querySelector('[data-tab="practice"]').click();
    // Implementation would set up practice mode for specific question
};