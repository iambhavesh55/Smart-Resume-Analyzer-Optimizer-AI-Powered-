export class ResumeParser {
    constructor() {
        this.pdfjsLib = null;
        this.initializePdfJs();
    }

    async initializePdfJs() {
        try {
            // Import PDF.js library
            const pdfjsModule = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
            
            // Access the correct property from the module
            this.pdfjsLib = pdfjsModule.default || pdfjsModule;
            
            // Set worker source
            if (this.pdfjsLib.GlobalWorkerOptions) {
                this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
            }
        } catch (error) {
            console.error('Failed to initialize PDF.js:', error);
            throw new Error('PDF processing library failed to load');
        }
    }

    async extractTextFromPDF(file) {
        if (!this.pdfjsLib) {
            await this.initializePdfJs();
        }

        if (!this.pdfjsLib) {
            throw new Error('PDF processing library not available');
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await this.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            
            // Extract text from each page
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                const pageText = textContent.items
                    .map(item => item.str)
                    .join(' ');
                
                fullText += pageText + '\n';
            }
            
            return this.cleanText(fullText);
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
        }
    }

    cleanText(text) {
        // Remove extra whitespace and normalize text
        return text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }

    extractSections(text) {
        const sections = {
            summary: '',
            experience: '',
            education: '',
            skills: '',
            projects: '',
            certifications: '',
            contact: ''
        };

        const sectionPatterns = {
            summary: /(?:summary|profile|objective|about)[\s\S]*?(?=(?:experience|education|skills|projects|certifications)|$)/i,
            experience: /(?:experience|work|employment|career|professional)[\s\S]*?(?=(?:education|skills|projects|certifications|summary)|$)/i,
            education: /(?:education|academic|degree|university|college)[\s\S]*?(?=(?:experience|skills|projects|certifications|summary)|$)/i,
            skills: /(?:skills|technical|competencies|expertise|technologies)[\s\S]*?(?=(?:experience|education|projects|certifications|summary)|$)/i,
            projects: /(?:projects|portfolio|work samples)[\s\S]*?(?=(?:experience|education|skills|certifications|summary)|$)/i,
            certifications: /(?:certifications|certificates|licenses)[\s\S]*?(?=(?:experience|education|skills|projects|summary)|$)/i
        };

        // Extract contact information
        sections.contact = this.extractContactInfo(text);

        // Extract each section
        Object.keys(sectionPatterns).forEach(section => {
            const match = text.match(sectionPatterns[section]);
            if (match) {
                sections[section] = match[0].trim();
            }
        });

        return sections;
    }

    extractContactInfo(text) {
        const contactInfo = {};

        // Email pattern
        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        const emailMatch = text.match(emailPattern);
        if (emailMatch) {
            contactInfo.email = emailMatch[0];
        }

        // Phone pattern
        const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
        const phoneMatch = text.match(phonePattern);
        if (phoneMatch) {
            contactInfo.phone = phoneMatch[0];
        }

        // LinkedIn pattern
        const linkedinPattern = /linkedin\.com\/in\/[\w-]+/i;
        const linkedinMatch = text.match(linkedinPattern);
        if (linkedinMatch) {
            contactInfo.linkedin = linkedinMatch[0];
        }

        // GitHub pattern
        const githubPattern = /github\.com\/[\w-]+/i;
        const githubMatch = text.match(githubPattern);
        if (githubMatch) {
            contactInfo.github = githubMatch[0];
        }

        return contactInfo;
    }

    extractSkills(text) {
        // Common technical and soft skills
        const skillsDatabase = [
            // Programming Languages
            'Python', 'Java', 'JavaScript', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
            'Kotlin', 'TypeScript', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS',
            
            // Frameworks and Libraries
            'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
            'Laravel', 'Rails', 'jQuery', 'Bootstrap', 'Tailwind CSS',
            
            // Databases
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Oracle',
            'Cassandra', 'DynamoDB',
            
            // Cloud and DevOps
            'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub',
            'GitLab', 'CI/CD', 'DevOps', 'Terraform', 'Ansible',
            
            // Data Science and AI
            'Machine Learning', 'Deep Learning', 'AI', 'NLP', 'Computer Vision', 'TensorFlow',
            'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
            
            // Business and Analytics
            'Tableau', 'Power BI', 'Excel', 'Google Analytics', 'A/B Testing', 'Statistics',
            'Data Analysis', 'Business Intelligence',
            
            // Soft Skills
            'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Project Management',
            'Time Management', 'Critical Thinking', 'Creativity', 'Adaptability', 'Collaboration',
            'Presentation', 'Negotiation', 'Customer Service', 'Sales', 'Marketing'
        ];

        const foundSkills = [];
        const textLower = text.toLowerCase();

        skillsDatabase.forEach(skill => {
            if (textLower.includes(skill.toLowerCase())) {
                foundSkills.push(skill);
            }
        });

        return [...new Set(foundSkills)]; // Remove duplicates
    }

    calculateReadabilityScore(text) {
        // Simple readability calculation based on sentence and word length
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        
        if (sentences.length === 0 || words.length === 0) return 0;

        const avgWordsPerSentence = words.length / sentences.length;
        const avgCharsPerWord = words.reduce((sum, word) => sum + word.length, 0) / words.length;

        // Flesch Reading Ease approximation
        const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (avgCharsPerWord / 4.7));
        
        return Math.max(0, Math.min(100, score));
    }

    getResumeStatistics(text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

        return {
            wordCount: words.length,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.length,
            characterCount: text.length,
            averageWordsPerSentence: sentences.length > 0 ? words.length / sentences.length : 0,
            readabilityScore: this.calculateReadabilityScore(text)
        };
    }
}