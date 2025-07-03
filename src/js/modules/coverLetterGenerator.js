export class CoverLetterGenerator {
    constructor() {
        this.templates = {
            professional: {
                name: 'Professional',
                structure: [
                    'header',
                    'greeting',
                    'opening',
                    'body_experience',
                    'body_skills',
                    'body_enthusiasm',
                    'closing',
                    'signature'
                ]
            },
            creative: {
                name: 'Creative',
                structure: [
                    'header',
                    'greeting',
                    'hook',
                    'story',
                    'skills_match',
                    'call_to_action',
                    'signature'
                ]
            },
            technical: {
                name: 'Technical',
                structure: [
                    'header',
                    'greeting',
                    'technical_opening',
                    'project_highlights',
                    'technical_skills',
                    'problem_solving',
                    'closing',
                    'signature'
                ]
            }
        };
    }

    generateCoverLetter(resumeData, jobData, template = 'professional') {
        const selectedTemplate = this.templates[template];
        let coverLetter = '';

        selectedTemplate.structure.forEach(section => {
            coverLetter += this.generateSection(section, resumeData, jobData) + '\n\n';
        });

        return coverLetter.trim();
    }

    generateSection(sectionType, resumeData, jobData) {
        const personalInfo = resumeData.personalInfo || {};
        const companyName = jobData.company || 'the company';
        const jobTitle = jobData.title || 'this position';

        switch (sectionType) {
            case 'header':
                return `${personalInfo.name || 'Your Name'}
${personalInfo.email || 'your.email@example.com'}
${personalInfo.phone || 'Your Phone Number'}
${personalInfo.location || 'Your Location'}

${new Date().toLocaleDateString()}

Hiring Manager
${companyName}`;

            case 'greeting':
                return `Dear Hiring Manager,`;

            case 'opening':
                return `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${this.getRelevantBackground(resumeData)}, I am excited about the opportunity to contribute to your team.`;

            case 'body_experience':
                const relevantExperience = this.getRelevantExperience(resumeData, jobData);
                return `In my previous role as ${relevantExperience.title || 'a professional'}, I ${relevantExperience.achievement || 'gained valuable experience that aligns with your requirements'}. This experience has prepared me well for the challenges and opportunities that come with the ${jobTitle} role.`;

            case 'body_skills':
                const matchedSkills = this.getMatchedSkills(resumeData, jobData);
                return `My technical skills include ${matchedSkills.join(', ')}, which directly align with the requirements outlined in your job posting. I am particularly excited about the opportunity to apply these skills in ${companyName}'s innovative environment.`;

            case 'body_enthusiasm':
                return `What particularly attracts me to ${companyName} is ${this.generateEnthusiasmReason(jobData)}. I am eager to bring my passion for ${this.getRelevantField(resumeData)} and my commitment to excellence to your team.`;

            case 'closing':
                return `Thank you for considering my application. I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${companyName}'s continued success. I look forward to hearing from you.`;

            case 'signature':
                return `Sincerely,
${personalInfo.name || 'Your Name'}`;

            case 'hook':
                return `When I discovered the ${jobTitle} position at ${companyName}, I knew I had found the perfect opportunity to combine my passion for ${this.getRelevantField(resumeData)} with my proven track record of ${this.getKeyAchievement(resumeData)}.`;

            case 'story':
                return `Let me share a brief story that illustrates my approach to work: ${this.generatePersonalStory(resumeData)}. This experience taught me the importance of ${this.getKeyLearning(resumeData)}, a quality I believe would be valuable in the ${jobTitle} role.`;

            case 'technical_opening':
                return `As a ${this.getTechnicalRole(resumeData)} with expertise in ${this.getTechnicalSkills(resumeData).slice(0, 3).join(', ')}, I am excited to apply for the ${jobTitle} position at ${companyName}.`;

            case 'project_highlights':
                const projects = resumeData.projects || [];
                const relevantProject = projects[0] || {};
                return `One of my most relevant projects involved ${relevantProject.description || 'developing a solution that demonstrates my technical capabilities'}. This project showcased my ability to ${this.getProjectSkills(relevantProject)}.`;

            case 'technical_skills':
                const techSkills = this.getTechnicalSkills(resumeData);
                return `My technical expertise spans ${techSkills.join(', ')}, with particular strength in ${techSkills[0] || 'relevant technologies'}. I stay current with industry trends and continuously expand my skill set to meet evolving technical challenges.`;

            case 'problem_solving':
                return `I thrive on solving complex technical challenges and have a proven track record of ${this.getProblemSolvingExample(resumeData)}. This analytical approach and attention to detail would be valuable assets in the ${jobTitle} role.`;

            case 'call_to_action':
                return `I would love to discuss how my unique combination of ${this.getUniqueValue(resumeData)} can help ${companyName} achieve its goals. Are you available for a brief conversation this week?`;

            default:
                return '';
        }
    }

    getRelevantBackground(resumeData) {
        const experience = resumeData.experience || [];
        if (experience.length > 0) {
            return experience[0].jobTitle || 'professional experience';
        }
        const education = resumeData.education || [];
        if (education.length > 0) {
            return education[0].degree || 'educational background';
        }
        return 'diverse background';
    }

    getRelevantExperience(resumeData, jobData) {
        const experience = resumeData.experience || [];
        if (experience.length > 0) {
            const exp = experience[0];
            return {
                title: exp.jobTitle,
                achievement: this.extractAchievement(exp.description)
            };
        }
        return { title: '', achievement: '' };
    }

    extractAchievement(description) {
        if (!description) return '';
        
        // Look for quantifiable achievements
        const lines = description.split('\n').filter(line => line.trim());
        const achievementLine = lines.find(line => 
            /\d+%|\d+\+|increased|improved|reduced|achieved|delivered/.test(line.toLowerCase())
        );
        
        return achievementLine || lines[0] || '';
    }

    getMatchedSkills(resumeData, jobData) {
        const resumeSkills = [
            ...(resumeData.skills?.technical || []),
            ...(resumeData.skills?.soft || [])
        ];
        
        const jobSkills = [
            ...(jobData.requiredSkills || []),
            ...(jobData.preferredSkills || [])
        ];

        const matched = resumeSkills.filter(skill => 
            jobSkills.some(jobSkill => 
                skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
                jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
        );

        return matched.slice(0, 5);
    }

    generateEnthusiasmReason(jobData) {
        const reasons = [
            'your commitment to innovation and excellence',
            'your reputation as an industry leader',
            'your focus on cutting-edge technology',
            'your collaborative work environment',
            'your mission to make a positive impact'
        ];
        
        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    getRelevantField(resumeData) {
        const experience = resumeData.experience || [];
        if (experience.length > 0) {
            const jobTitle = experience[0].jobTitle || '';
            if (jobTitle.toLowerCase().includes('engineer')) return 'engineering';
            if (jobTitle.toLowerCase().includes('design')) return 'design';
            if (jobTitle.toLowerCase().includes('data')) return 'data science';
            if (jobTitle.toLowerCase().includes('market')) return 'marketing';
            if (jobTitle.toLowerCase().includes('manage')) return 'management';
        }
        return 'technology';
    }

    getKeyAchievement(resumeData) {
        const achievements = [
            'delivering results under pressure',
            'leading successful projects',
            'solving complex problems',
            'driving innovation',
            'building strong relationships'
        ];
        
        return achievements[Math.floor(Math.random() * achievements.length)];
    }

    generatePersonalStory(resumeData) {
        const stories = [
            'Recently, I faced a challenging deadline that required creative problem-solving and collaboration across multiple teams',
            'In my previous role, I identified an opportunity to improve efficiency that resulted in significant time and cost savings',
            'When presented with a complex technical challenge, I took the initiative to research innovative solutions and implement a successful strategy'
        ];
        
        return stories[Math.floor(Math.random() * stories.length)];
    }

    getKeyLearning(resumeData) {
        const learnings = [
            'clear communication and teamwork',
            'adaptability and continuous learning',
            'attention to detail and quality',
            'proactive problem-solving',
            'customer-focused thinking'
        ];
        
        return learnings[Math.floor(Math.random() * learnings.length)];
    }

    getTechnicalRole(resumeData) {
        const experience = resumeData.experience || [];
        if (experience.length > 0) {
            return experience[0].jobTitle || 'technical professional';
        }
        return 'technical professional';
    }

    getTechnicalSkills(resumeData) {
        return resumeData.skills?.technical || ['JavaScript', 'Python', 'React'];
    }

    getProjectSkills(project) {
        const skills = [
            'work with modern technologies',
            'deliver high-quality solutions',
            'collaborate effectively with stakeholders',
            'meet challenging deadlines',
            'implement best practices'
        ];
        
        return skills[Math.floor(Math.random() * skills.length)];
    }

    getProblemSolvingExample(resumeData) {
        const examples = [
            'identifying and resolving performance bottlenecks',
            'implementing efficient algorithms and data structures',
            'debugging complex issues in production environments',
            'optimizing systems for scalability and reliability'
        ];
        
        return examples[Math.floor(Math.random() * examples.length)];
    }

    getUniqueValue(resumeData) {
        const values = [
            'technical expertise and creative problem-solving',
            'leadership experience and technical skills',
            'analytical thinking and collaborative approach',
            'innovation mindset and proven results'
        ];
        
        return values[Math.floor(Math.random() * values.length)];
    }

    createCoverLetterInterface() {
        return `
            <div class="cover-letter-generator">
                <div class="generator-header">
                    <h2>📝 Cover Letter Generator</h2>
                    <p>Generate a personalized cover letter based on your resume and target job</p>
                </div>

                <div class="generator-options">
                    <div class="option-group">
                        <label>Template Style</label>
                        <select id="coverLetterTemplate">
                            <option value="professional">Professional</option>
                            <option value="creative">Creative</option>
                            <option value="technical">Technical</option>
                        </select>
                    </div>

                    <div class="option-group">
                        <label>Company Name</label>
                        <input type="text" id="companyName" placeholder="Enter company name">
                    </div>

                    <div class="option-group">
                        <label>Job Title</label>
                        <input type="text" id="jobTitle" placeholder="Enter job title">
                    </div>

                    <div class="option-group">
                        <label>Additional Information (Optional)</label>
                        <textarea id="additionalInfo" rows="3" placeholder="Any specific points you'd like to highlight..."></textarea>
                    </div>

                    <button class="btn-primary" id="generateCoverLetterBtn">
                        <span>✨</span> Generate Cover Letter
                    </button>
                </div>

                <div class="cover-letter-output" id="coverLetterOutput" style="display: none;">
                    <div class="output-header">
                        <h3>Generated Cover Letter</h3>
                        <div class="output-actions">
                            <button class="btn-secondary" id="editCoverLetterBtn">Edit</button>
                            <button class="btn-secondary" id="copyCoverLetterBtn">Copy</button>
                            <button class="btn-primary" id="downloadCoverLetterBtn">Download</button>
                        </div>
                    </div>
                    <div class="cover-letter-content" id="coverLetterContent"></div>
                </div>
            </div>
        `;
    }
}