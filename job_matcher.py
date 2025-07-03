import json
import re
from typing import Dict, List, Set
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import textstat

class JobMatcher:
    """Match resume content against job requirements and calculate scores"""
    
    def __init__(self):
        self.job_roles_data = self._load_job_roles()
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    
    def _load_job_roles(self) -> Dict:
        """Load predefined job roles and their requirements"""
        return {
            "Software Engineer": {
                "description": "Develop and maintain software applications using various programming languages and frameworks",
                "required_skills": [
                    "Python", "Java", "JavaScript", "C++", "Git", "SQL", "HTML", "CSS",
                    "React", "Node.js", "API Development", "Database Design", "Testing",
                    "Debugging", "Agile", "Problem Solving", "Team Collaboration"
                ],
                "preferred_skills": [
                    "Docker", "Kubernetes", "AWS", "Machine Learning", "DevOps",
                    "Microservices", "GraphQL", "TypeScript", "MongoDB", "Redis"
                ],
                "keywords": [
                    "software development", "programming", "coding", "algorithms",
                    "data structures", "version control", "code review", "deployment",
                    "scalability", "performance optimization", "software architecture"
                ]
            },
            "Data Scientist": {
                "description": "Analyze complex data to extract insights and build predictive models",
                "required_skills": [
                    "Python", "R", "SQL", "Machine Learning", "Statistics", "Pandas",
                    "NumPy", "Scikit-learn", "Data Visualization", "Jupyter", "Excel",
                    "Problem Solving", "Critical Thinking", "Communication"
                ],
                "preferred_skills": [
                    "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Big Data",
                    "Spark", "Hadoop", "Tableau", "Power BI", "A/B Testing",
                    "Feature Engineering", "Model Deployment", "Cloud Platforms"
                ],
                "keywords": [
                    "data analysis", "predictive modeling", "statistical analysis",
                    "data mining", "business intelligence", "data pipeline",
                    "feature selection", "model validation", "data cleaning"
                ]
            },
            "Product Manager": {
                "description": "Lead product development from conception to launch",
                "required_skills": [
                    "Product Strategy", "Market Research", "User Experience", "Analytics",
                    "Project Management", "Communication", "Leadership", "Stakeholder Management",
                    "Agile", "Scrum", "Data Analysis", "Problem Solving"
                ],
                "preferred_skills": [
                    "SQL", "A/B Testing", "Wireframing", "Prototyping", "Customer Development",
                    "Go-to-Market Strategy", "Pricing Strategy", "Competitive Analysis",
                    "Product Marketing", "Technical Writing"
                ],
                "keywords": [
                    "product roadmap", "user stories", "market analysis", "product launch",
                    "customer feedback", "product metrics", "cross-functional teams",
                    "product vision", "requirements gathering", "product lifecycle"
                ]
            },
            "Marketing Manager": {
                "description": "Develop and execute marketing strategies to promote products and services",
                "required_skills": [
                    "Digital Marketing", "Content Marketing", "Social Media", "SEO", "SEM",
                    "Email Marketing", "Analytics", "Campaign Management", "Brand Management",
                    "Communication", "Creativity", "Project Management"
                ],
                "preferred_skills": [
                    "Google Analytics", "Facebook Ads", "Google Ads", "Marketing Automation",
                    "CRM", "A/B Testing", "Conversion Optimization", "Influencer Marketing",
                    "Video Marketing", "Graphic Design", "Copywriting"
                ],
                "keywords": [
                    "marketing campaigns", "lead generation", "brand awareness",
                    "customer acquisition", "marketing ROI", "content strategy",
                    "market segmentation", "customer journey", "marketing funnel"
                ]
            },
            "Business Analyst": {
                "description": "Analyze business processes and requirements to improve efficiency",
                "required_skills": [
                    "Business Analysis", "Requirements Gathering", "Process Mapping",
                    "Data Analysis", "SQL", "Excel", "Documentation", "Stakeholder Management",
                    "Problem Solving", "Communication", "Critical Thinking"
                ],
                "preferred_skills": [
                    "Tableau", "Power BI", "Python", "R", "JIRA", "Confluence",
                    "Process Improvement", "Change Management", "Project Management",
                    "Business Intelligence", "Data Modeling"
                ],
                "keywords": [
                    "business requirements", "process optimization", "gap analysis",
                    "business case", "stakeholder analysis", "workflow analysis",
                    "business metrics", "reporting", "business intelligence"
                ]
            },
            "UI/UX Designer": {
                "description": "Design user interfaces and experiences for digital products",
                "required_skills": [
                    "UI Design", "UX Design", "Wireframing", "Prototyping", "User Research",
                    "Figma", "Sketch", "Adobe Creative Suite", "Design Systems",
                    "User Testing", "Information Architecture", "Creativity"
                ],
                "preferred_skills": [
                    "HTML", "CSS", "JavaScript", "Animation", "Interaction Design",
                    "Accessibility", "Mobile Design", "Responsive Design", "Design Thinking",
                    "Usability Testing", "A/B Testing"
                ],
                "keywords": [
                    "user experience", "user interface", "design thinking", "user journey",
                    "design systems", "visual design", "interaction design",
                    "usability", "accessibility", "design research"
                ]
            }
        }
    
    def get_job_requirements(self, job_role: str) -> Dict:
        """Get requirements for a specific job role"""
        return self.job_roles_data.get(job_role, {})
    
    def analyze_job_description(self, job_description: str) -> Dict:
        """Analyze a custom job description to extract requirements"""
        # Extract skills and keywords from job description
        text_lower = job_description.lower()
        
        # Common technical skills to look for
        all_skills = set()
        for role_data in self.job_roles_data.values():
            all_skills.update([skill.lower() for skill in role_data.get('required_skills', [])])
            all_skills.update([skill.lower() for skill in role_data.get('preferred_skills', [])])
        
        found_skills = []
        for skill in all_skills:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        # Extract keywords (important phrases)
        keywords = self._extract_keywords_from_text(job_description)
        
        return {
            "description": job_description,
            "required_skills": found_skills[:15],  # Top 15 skills
            "preferred_skills": [],
            "keywords": keywords[:20]  # Top 20 keywords
        }
    
    def _extract_keywords_from_text(self, text: str) -> List[str]:
        """Extract important keywords from text"""
        # Remove common stop words and extract meaningful phrases
        important_phrases = [
            "experience", "knowledge", "skills", "ability", "responsible",
            "develop", "manage", "lead", "analyze", "design", "implement",
            "collaborate", "communicate", "problem solving", "team work",
            "project management", "data analysis", "software development"
        ]
        
        keywords = []
        text_lower = text.lower()
        
        # Look for important phrases
        for phrase in important_phrases:
            if phrase in text_lower:
                keywords.append(phrase.title())
        
        # Extract technical terms (words with specific patterns)
        tech_pattern = r'\b[A-Z][a-z]*(?:\.[a-z]+|[A-Z][a-z]*)*\b'
        tech_terms = re.findall(tech_pattern, text)
        keywords.extend(tech_terms[:10])
        
        return list(set(keywords))
    
    def analyze_resume(self, resume_text: str, resume_sections: Dict[str, str], job_data: Dict) -> Dict:
        """Perform comprehensive resume analysis against job requirements"""
        
        # Extract skills from resume
        resume_skills = self._extract_skills_from_text(resume_text)
        
        # Get job requirements
        required_skills = [skill.lower() for skill in job_data.get('required_skills', [])]
        preferred_skills = [skill.lower() for skill in job_data.get('preferred_skills', [])]
        job_keywords = [kw.lower() for kw in job_data.get('keywords', [])]
        
        # Calculate skill matches
        resume_skills_lower = [skill.lower() for skill in resume_skills]
        matched_skills = [skill for skill in required_skills if skill in resume_skills_lower]
        missing_skills = [skill for skill in required_skills if skill not in resume_skills_lower]
        
        # Calculate keyword matches
        resume_text_lower = resume_text.lower()
        matched_keywords = [kw for kw in job_keywords if kw in resume_text_lower]
        missing_keywords = [kw for kw in job_keywords if kw not in resume_text_lower]
        
        # Calculate similarity score using TF-IDF
        similarity_score = self._calculate_text_similarity(resume_text, job_data.get('description', ''))
        
        # Calculate skill match percentage
        total_required_skills = len(required_skills) if required_skills else 1
        skill_match_percentage = (len(matched_skills) / total_required_skills) * 100
        
        # Calculate readability score
        readability_score = textstat.flesch_reading_ease(resume_text)
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(
            skill_match_percentage, similarity_score, readability_score,
            len(matched_keywords), len(missing_keywords), resume_sections
        )
        
        return {
            'overall_score': overall_score,
            'skill_match_percentage': skill_match_percentage,
            'similarity_score': similarity_score,
            'readability_score': readability_score,
            'matched_skills': [skill.title() for skill in matched_skills],
            'missing_skills': [skill.title() for skill in missing_skills[:10]],  # Top 10
            'matched_keywords': matched_keywords,
            'missing_keywords': missing_keywords[:10],  # Top 10
            'resume_skills': resume_skills,
            'section_analysis': self._analyze_sections(resume_sections)
        }
    
    def _extract_skills_from_text(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        # Get all possible skills from job roles
        all_skills = set()
        for role_data in self.job_roles_data.values():
            all_skills.update(role_data.get('required_skills', []))
            all_skills.update(role_data.get('preferred_skills', []))
        
        # Additional common skills
        additional_skills = [
            "Leadership", "Communication", "Problem Solving", "Team Work",
            "Project Management", "Time Management", "Critical Thinking",
            "Analytical Skills", "Creativity", "Adaptability", "Customer Service",
            "Sales", "Negotiation", "Presentation", "Writing", "Research"
        ]
        
        all_skills.update(additional_skills)
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in all_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return list(set(found_skills))
    
    def _calculate_text_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts using TF-IDF"""
        if not text1 or not text2:
            return 0.0
        
        try:
            tfidf_matrix = self.vectorizer.fit_transform([text1, text2])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity * 100)  # Convert to percentage
        except:
            return 0.0
    
    def _calculate_overall_score(self, skill_match_pct: float, similarity_score: float,
                               readability_score: float, matched_kw_count: int,
                               missing_kw_count: int, sections: Dict[str, str]) -> int:
        """Calculate overall resume score"""
        
        # Weights for different components
        weights = {
            'skills': 0.3,
            'similarity': 0.2,
            'keywords': 0.2,
            'readability': 0.1,
            'sections': 0.2
        }
        
        # Skills score (0-100)
        skills_score = min(skill_match_pct, 100)
        
        # Similarity score (0-100)
        similarity_score = min(similarity_score, 100)
        
        # Keywords score (0-100)
        total_keywords = matched_kw_count + missing_kw_count
        keyword_score = (matched_kw_count / max(total_keywords, 1)) * 100
        
        # Readability score (convert to 0-100 scale)
        readability_normalized = min(max(readability_score, 0), 100)
        
        # Sections score (based on presence of key sections)
        sections_score = self._calculate_sections_score(sections)
        
        # Calculate weighted average
        overall_score = (
            skills_score * weights['skills'] +
            similarity_score * weights['similarity'] +
            keyword_score * weights['keywords'] +
            readability_normalized * weights['readability'] +
            sections_score * weights['sections']
        )
        
        return int(round(overall_score))
    
    def _calculate_sections_score(self, sections: Dict[str, str]) -> float:
        """Calculate score based on presence and quality of resume sections"""
        important_sections = ['experience', 'education', 'skills', 'summary']
        section_scores = []
        
        for section in important_sections:
            content = sections.get(section, '').strip()
            if content:
                # Score based on content length and quality
                word_count = len(content.split())
                if word_count > 50:
                    section_scores.append(100)
                elif word_count > 20:
                    section_scores.append(80)
                elif word_count > 5:
                    section_scores.append(60)
                else:
                    section_scores.append(40)
            else:
                section_scores.append(0)
        
        return sum(section_scores) / len(section_scores) if section_scores else 0
    
    def _analyze_sections(self, sections: Dict[str, str]) -> Dict[str, Dict]:
        """Analyze individual resume sections"""
        analysis = {}
        
        for section_name, content in sections.items():
            if content.strip():
                word_count = len(content.split())
                line_count = len([line for line in content.split('\n') if line.strip()])
                
                analysis[section_name] = {
                    'present': True,
                    'word_count': word_count,
                    'line_count': line_count,
                    'quality': 'Good' if word_count > 20 else 'Needs Improvement' if word_count > 5 else 'Poor'
                }
            else:
                analysis[section_name] = {
                    'present': False,
                    'word_count': 0,
                    'line_count': 0,
                    'quality': 'Missing'
                }
        
        return analysis