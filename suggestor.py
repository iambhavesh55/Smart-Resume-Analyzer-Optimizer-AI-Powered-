from typing import Dict, List
import re

class SuggestionEngine:
    """Generate intelligent suggestions for resume improvement"""
    
    def __init__(self):
        self.improvement_templates = {
            'skills_improvement': [
                "Add '{skill}' to your skills section as it's highly valued for this role",
                "Consider gaining experience in '{skill}' through online courses or projects",
                "Highlight your '{skill}' experience more prominently in your resume",
                "Include specific examples of how you've used '{skill}' in your work"
            ],
            'keyword_optimization': [
                "Include the keyword '{keyword}' in your resume to match job requirements",
                "Use '{keyword}' in your experience descriptions to improve ATS compatibility",
                "Add '{keyword}' to your summary or skills section",
                "Incorporate '{keyword}' when describing relevant projects or achievements"
            ],
            'section_improvements': [
                "Add a professional summary section to highlight your key qualifications",
                "Include a dedicated skills section with both technical and soft skills",
                "Add a projects section to showcase your practical experience",
                "Include certifications section to highlight your professional development"
            ],
            'content_enhancement': [
                "Use action verbs to start your bullet points (e.g., 'Developed', 'Managed', 'Led')",
                "Quantify your achievements with specific numbers and metrics",
                "Focus on accomplishments rather than just job responsibilities",
                "Tailor your experience descriptions to match the job requirements"
            ],
            'formatting_tips': [
                "Use consistent formatting throughout your resume",
                "Keep your resume to 1-2 pages for optimal readability",
                "Use bullet points instead of paragraphs for better scanability",
                "Ensure proper spacing and margins for a clean appearance"
            ]
        }
    
    def generate_suggestions(self, analysis_results: Dict, resume_sections: Dict[str, str], job_data: Dict) -> Dict[str, List[str]]:
        """Generate comprehensive improvement suggestions"""
        suggestions = {
            'skills_improvement': [],
            'keyword_optimization': [],
            'section_improvements': [],
            'content_enhancement': [],
            'formatting_tips': [],
            'experience_enhancement': [],
            'education_tips': [],
            'general_advice': []
        }
        
        # Skills improvement suggestions
        missing_skills = analysis_results.get('missing_skills', [])
        for skill in missing_skills[:5]:  # Top 5 missing skills
            suggestion = f"Consider adding '{skill}' to your skillset as it's highly valued for this role"
            suggestions['skills_improvement'].append(suggestion)
        
        # Keyword optimization
        missing_keywords = analysis_results.get('missing_keywords', [])
        for keyword in missing_keywords[:5]:  # Top 5 missing keywords
            suggestion = f"Include '{keyword}' in your resume to better match job requirements"
            suggestions['keyword_optimization'].append(suggestion)
        
        # Section-specific improvements
        section_analysis = analysis_results.get('section_analysis', {})
        suggestions['section_improvements'].extend(
            self._generate_section_suggestions(section_analysis, resume_sections)
        )
        
        # Content enhancement based on analysis
        suggestions['content_enhancement'].extend(
            self._generate_content_suggestions(analysis_results, resume_sections)
        )
        
        # Experience enhancement
        suggestions['experience_enhancement'].extend(
            self._generate_experience_suggestions(resume_sections.get('experience', ''))
        )
        
        # Education tips
        suggestions['education_tips'].extend(
            self._generate_education_suggestions(resume_sections.get('education', ''))
        )
        
        # General formatting and presentation tips
        suggestions['formatting_tips'].extend(
            self._generate_formatting_suggestions(resume_sections)
        )
        
        # General advice based on overall score
        overall_score = analysis_results.get('overall_score', 0)
        suggestions['general_advice'].extend(
            self._generate_general_advice(overall_score, analysis_results)
        )
        
        # Remove empty categories
        return {k: v for k, v in suggestions.items() if v}
    
    def _generate_section_suggestions(self, section_analysis: Dict, resume_sections: Dict[str, str]) -> List[str]:
        """Generate suggestions for improving resume sections"""
        suggestions = []
        
        # Check for missing important sections
        important_sections = ['summary', 'experience', 'education', 'skills']
        
        for section in important_sections:
            analysis = section_analysis.get(section, {})
            if not analysis.get('present', False):
                if section == 'summary':
                    suggestions.append("Add a professional summary section at the top to highlight your key qualifications and career objectives")
                elif section == 'skills':
                    suggestions.append("Include a dedicated skills section listing both technical and soft skills relevant to your target role")
                elif section == 'experience':
                    suggestions.append("Add a work experience section detailing your professional background and achievements")
                elif section == 'education':
                    suggestions.append("Include an education section with your degrees, certifications, and relevant coursework")
            
            elif analysis.get('quality') == 'Poor':
                suggestions.append(f"Expand your {section} section with more detailed and relevant information")
        
        # Check for additional beneficial sections
        if not section_analysis.get('projects', {}).get('present', False):
            suggestions.append("Consider adding a projects section to showcase your practical skills and achievements")
        
        if not section_analysis.get('certifications', {}).get('present', False):
            suggestions.append("Add a certifications section if you have relevant professional certifications")
        
        return suggestions
    
    def _generate_content_suggestions(self, analysis_results: Dict, resume_sections: Dict[str, str]) -> List[str]:
        """Generate suggestions for improving content quality"""
        suggestions = []
        
        # Readability suggestions
        readability_score = analysis_results.get('readability_score', 0)
        if readability_score < 30:
            suggestions.append("Simplify your language and use shorter sentences to improve readability")
        elif readability_score > 90:
            suggestions.append("Consider using more professional terminology to demonstrate your expertise")
        
        # Skills match suggestions
        skill_match_pct = analysis_results.get('skill_match_percentage', 0)
        if skill_match_pct < 50:
            suggestions.append("Highlight more skills that are relevant to your target job role")
            suggestions.append("Use specific examples to demonstrate your proficiency in key skills")
        
        # Keyword density suggestions
        matched_keywords = len(analysis_results.get('matched_keywords', []))
        missing_keywords = len(analysis_results.get('missing_keywords', []))
        
        if matched_keywords < missing_keywords:
            suggestions.append("Incorporate more industry-specific keywords and terminology throughout your resume")
            suggestions.append("Review the job description and naturally include relevant terms in your experience descriptions")
        
        return suggestions
    
    def _generate_experience_suggestions(self, experience_text: str) -> List[str]:
        """Generate suggestions for improving experience section"""
        suggestions = []
        
        if not experience_text.strip():
            suggestions.append("Add a comprehensive work experience section detailing your professional background")
            return suggestions
        
        # Check for action verbs
        action_verbs = ['developed', 'managed', 'led', 'created', 'implemented', 'designed', 'analyzed', 'improved', 'achieved', 'delivered']
        text_lower = experience_text.lower()
        
        found_action_verbs = sum(1 for verb in action_verbs if verb in text_lower)
        if found_action_verbs < 3:
            suggestions.append("Start your bullet points with strong action verbs like 'Developed', 'Managed', 'Led', or 'Implemented'")
        
        # Check for quantifiable achievements
        numbers_pattern = r'\d+(?:,\d{3})*(?:\.\d+)?[%$]?'
        numbers_found = len(re.findall(numbers_pattern, experience_text))
        
        if numbers_found < 2:
            suggestions.append("Include specific numbers, percentages, and metrics to quantify your achievements")
            suggestions.append("Add measurable results like 'Increased sales by 25%' or 'Managed team of 10 people'")
        
        # Check for job responsibilities vs achievements
        responsibility_words = ['responsible for', 'duties included', 'tasks involved']
        has_responsibilities = any(word in text_lower for word in responsibility_words)
        
        if has_responsibilities:
            suggestions.append("Focus on achievements and results rather than just listing job responsibilities")
        
        return suggestions
    
    def _generate_education_suggestions(self, education_text: str) -> List[str]:
        """Generate suggestions for improving education section"""
        suggestions = []
        
        if not education_text.strip():
            suggestions.append("Include your educational background with degrees, institutions, and graduation dates")
            return suggestions
        
        # Check for relevant coursework
        if len(education_text.split()) < 20:
            suggestions.append("Consider adding relevant coursework, academic projects, or honors to strengthen your education section")
        
        # Check for GPA (if recent graduate)
        if 'gpa' not in education_text.lower() and 'grade' not in education_text.lower():
            suggestions.append("If you're a recent graduate with a strong GPA (3.5+), consider including it")
        
        return suggestions
    
    def _generate_formatting_suggestions(self, resume_sections: Dict[str, str]) -> List[str]:
        """Generate suggestions for improving resume formatting"""
        suggestions = []
        
        # Check overall length
        total_content = ' '.join(resume_sections.values())
        word_count = len(total_content.split())
        
        if word_count < 200:
            suggestions.append("Your resume appears quite brief. Consider adding more detail about your experience and achievements")
        elif word_count > 800:
            suggestions.append("Consider condensing your resume to 1-2 pages by focusing on the most relevant information")
        
        # Check for consistent formatting
        suggestions.extend([
            "Use consistent bullet points and formatting throughout all sections",
            "Ensure proper spacing between sections for better readability",
            "Use a professional font and maintain consistent font sizes",
            "Keep margins uniform and ensure the layout is clean and organized"
        ])
        
        return suggestions
    
    def _generate_general_advice(self, overall_score: int, analysis_results: Dict) -> List[str]:
        """Generate general advice based on overall performance"""
        suggestions = []
        
        if overall_score < 50:
            suggestions.extend([
                "Your resume needs significant improvement to be competitive for your target role",
                "Focus on adding more relevant skills and experience details",
                "Consider seeking feedback from industry professionals or career counselors",
                "Tailor your resume specifically for each job application"
            ])
        elif overall_score < 70:
            suggestions.extend([
                "Your resume is on the right track but could use some improvements",
                "Focus on incorporating more relevant keywords and skills",
                "Strengthen your experience descriptions with specific achievements",
                "Consider adding more quantifiable results to demonstrate your impact"
            ])
        elif overall_score < 85:
            suggestions.extend([
                "Your resume is quite good! Focus on fine-tuning the details",
                "Add a few more relevant keywords to improve ATS compatibility",
                "Consider adding any missing skills that are important for your target role",
                "Ensure all sections are well-developed and professional"
            ])
        else:
            suggestions.extend([
                "Excellent resume! You're well-positioned for your target role",
                "Continue to tailor your resume for specific job applications",
                "Keep your resume updated with new skills and achievements",
                "Consider this resume as a strong foundation for your job search"
            ])
        
        # Skill match specific advice
        skill_match_pct = analysis_results.get('skill_match_percentage', 0)
        if skill_match_pct < 30:
            suggestions.append("Consider developing more skills relevant to your target role through courses or projects")
        
        return suggestions