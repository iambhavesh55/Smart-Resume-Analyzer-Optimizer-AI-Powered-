import fitz  # PyMuPDF
import re
import docx
from typing import Dict, List, Tuple
import streamlit as st

class ResumeParser:
    """Extract and parse resume content from PDF and DOCX files"""
    
    def __init__(self):
        self.section_patterns = {
            'contact': r'(email|phone|address|linkedin|github)',
            'summary': r'(summary|profile|objective|about)',
            'experience': r'(experience|work|employment|career|professional)',
            'education': r'(education|academic|degree|university|college)',
            'skills': r'(skills|technical|competencies|expertise|technologies)',
            'projects': r'(projects|portfolio|work samples)',
            'certifications': r'(certifications|certificates|licenses)',
            'achievements': r'(achievements|awards|honors|accomplishments)'
        }
    
    def extract_text_and_sections(self, uploaded_file) -> Tuple[str, Dict[str, str]]:
        """Extract text and identify sections from uploaded file"""
        try:
            if uploaded_file.type == "application/pdf":
                text = self._extract_from_pdf(uploaded_file)
            elif uploaded_file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                text = self._extract_from_docx(uploaded_file)
            else:
                raise ValueError("Unsupported file format")
            
            sections = self._identify_sections(text)
            return text, sections
            
        except Exception as e:
            raise Exception(f"Error parsing resume: {str(e)}")
    
    def _extract_from_pdf(self, uploaded_file) -> str:
        """Extract text from PDF file"""
        try:
            doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
    
    def _extract_from_docx(self, uploaded_file) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(uploaded_file)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")
    
    def _identify_sections(self, text: str) -> Dict[str, str]:
        """Identify and extract different sections of the resume"""
        sections = {}
        text_lower = text.lower()
        lines = text.split('\n')
        
        current_section = 'other'
        section_content = {section: [] for section in self.section_patterns.keys()}
        section_content['other'] = []
        
        for line in lines:
            line_lower = line.lower().strip()
            if not line_lower:
                continue
            
            # Check if line is a section header
            detected_section = None
            for section, pattern in self.section_patterns.items():
                if re.search(pattern, line_lower) and len(line.strip()) < 50:
                    # Likely a section header
                    detected_section = section
                    break
            
            if detected_section:
                current_section = detected_section
            else:
                section_content[current_section].append(line)
        
        # Convert lists to strings
        for section, content in section_content.items():
            sections[section] = '\n'.join(content).strip()
        
        return sections
    
    def extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information from resume text"""
        contact_info = {}
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact_info['email'] = emails[0]
        
        # Phone pattern
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        if phones:
            contact_info['phone'] = ''.join(phones[0]) if isinstance(phones[0], tuple) else phones[0]
        
        # LinkedIn pattern
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.findall(linkedin_pattern, text.lower())
        if linkedin:
            contact_info['linkedin'] = linkedin[0]
        
        # GitHub pattern
        github_pattern = r'github\.com/[\w-]+'
        github = re.findall(github_pattern, text.lower())
        if github:
            contact_info['github'] = github[0]
        
        return contact_info
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        # Common technical skills
        technical_skills = [
            'python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express',
            'django', 'flask', 'spring', 'laravel', 'rails',
            'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
            'git', 'github', 'gitlab', 'bitbucket',
            'machine learning', 'deep learning', 'ai', 'nlp', 'computer vision',
            'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
            'tableau', 'power bi', 'excel', 'sql', 'r', 'matlab',
            'agile', 'scrum', 'devops', 'ci/cd', 'testing', 'debugging'
        ]
        
        # Soft skills
        soft_skills = [
            'leadership', 'communication', 'teamwork', 'problem solving',
            'project management', 'time management', 'analytical thinking',
            'creativity', 'adaptability', 'collaboration', 'presentation',
            'negotiation', 'customer service', 'sales', 'marketing'
        ]
        
        all_skills = technical_skills + soft_skills
        found_skills = []
        
        text_lower = text.lower()
        for skill in all_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill.title())
        
        return list(set(found_skills))  # Remove duplicates
    
    def extract_experience_years(self, text: str) -> int:
        """Estimate years of experience from resume"""
        # Look for patterns like "5 years", "3+ years", etc.
        year_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)',
            r'(\d+)\+?\s*yrs?\s*(?:of\s*)?(?:experience|exp)',
            r'experience.*?(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s*in'
        ]
        
        years = []
        text_lower = text.lower()
        
        for pattern in year_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                try:
                    years.append(int(match))
                except ValueError:
                    continue
        
        # Also try to estimate from date ranges
        date_pattern = r'(19|20)\d{2}'
        dates = re.findall(date_pattern, text)
        if len(dates) >= 2:
            dates = [int(d) for d in dates]
            date_range = max(dates) - min(dates)
            if date_range > 0 and date_range < 50:  # Reasonable range
                years.append(date_range)
        
        return max(years) if years else 0
    
    def get_resume_statistics(self, text: str) -> Dict[str, int]:
        """Get basic statistics about the resume"""
        lines = text.split('\n')
        words = text.split()
        
        return {
            'total_lines': len(lines),
            'total_words': len(words),
            'total_characters': len(text),
            'non_empty_lines': len([line for line in lines if line.strip()]),
            'average_words_per_line': len(words) / max(len([line for line in lines if line.strip()]), 1)
        }