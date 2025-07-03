import openai
from typing import Dict, Optional
import json

class LLMOptimizer:
    """Use LLM to generate enhanced resume suggestions and optimizations"""
    
    def __init__(self, api_key: Optional[str] = None):
        if api_key:
            openai.api_key = api_key
            self.client = openai.OpenAI(api_key=api_key)
        else:
            self.client = None
    
    def optimize_resume_sections(self, resume_sections: Dict[str, str], 
                               job_data: Dict, analysis_results: Dict) -> Dict[str, str]:
        """Generate AI-powered suggestions for each resume section"""
        if not self.client:
            return {}
        
        optimizations = {}
        
        # Optimize summary/objective
        if resume_sections.get('summary'):
            optimizations['summary'] = self._optimize_summary(
                resume_sections['summary'], job_data, analysis_results
            )
        
        # Optimize experience section
        if resume_sections.get('experience'):
            optimizations['experience'] = self._optimize_experience(
                resume_sections['experience'], job_data, analysis_results
            )
        
        # Optimize skills section
        if resume_sections.get('skills'):
            optimizations['skills'] = self._optimize_skills(
                resume_sections['skills'], job_data, analysis_results
            )
        
        # Generate overall improvement suggestions
        optimizations['overall'] = self._generate_overall_suggestions(
            resume_sections, job_data, analysis_results
        )
        
        return optimizations
    
    def _optimize_summary(self, summary_text: str, job_data: Dict, analysis_results: Dict) -> str:
        """Optimize the professional summary section"""
        try:
            prompt = f"""
            As a professional resume writer, please improve this professional summary for a {job_data.get('description', 'professional role')}:

            Current Summary:
            {summary_text}

            Job Requirements:
            - Required Skills: {', '.join(job_data.get('required_skills', [])[:10])}
            - Key Keywords: {', '.join(job_data.get('keywords', [])[:10])}

            Current Analysis:
            - Skill Match: {analysis_results.get('skill_match_percentage', 0):.1f}%
            - Missing Skills: {', '.join(analysis_results.get('missing_skills', [])[:5])}

            Please provide:
            1. An improved version of the summary (2-3 sentences)
            2. Specific suggestions for enhancement
            3. Keywords to naturally incorporate

            Focus on making it more compelling and aligned with the target role while maintaining authenticity.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"AI optimization unavailable: {str(e)}"
    
    def _optimize_experience(self, experience_text: str, job_data: Dict, analysis_results: Dict) -> str:
        """Optimize the work experience section"""
        try:
            prompt = f"""
            As a professional resume writer, please provide suggestions to improve this work experience section for a {job_data.get('description', 'professional role')}:

            Current Experience:
            {experience_text[:1000]}...  # Truncate for API limits

            Target Role Requirements:
            - Required Skills: {', '.join(job_data.get('required_skills', [])[:8])}
            - Important Keywords: {', '.join(job_data.get('keywords', [])[:8])}

            Please provide:
            1. Suggestions for stronger action verbs
            2. Ways to quantify achievements
            3. How to better align with target role requirements
            4. Keywords to naturally incorporate
            5. Structure improvements

            Focus on making accomplishments more impactful and relevant to the target role.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"AI optimization unavailable: {str(e)}"
    
    def _optimize_skills(self, skills_text: str, job_data: Dict, analysis_results: Dict) -> str:
        """Optimize the skills section"""
        try:
            missing_skills = analysis_results.get('missing_skills', [])[:10]
            
            prompt = f"""
            As a professional resume writer, please provide suggestions to improve this skills section:

            Current Skills:
            {skills_text}

            Target Role Requirements:
            - Required Skills: {', '.join(job_data.get('required_skills', [])[:10])}
            - Missing Skills: {', '.join(missing_skills)}

            Please provide:
            1. How to better organize and present current skills
            2. Suggestions for skills to add or develop
            3. How to categorize skills (technical vs. soft skills)
            4. Ways to demonstrate proficiency levels
            5. Skills that should be prioritized for this role

            Focus on making the skills section more comprehensive and aligned with the target role.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"AI optimization unavailable: {str(e)}"
    
    def _generate_overall_suggestions(self, resume_sections: Dict[str, str], 
                                    job_data: Dict, analysis_results: Dict) -> str:
        """Generate overall resume improvement suggestions"""
        try:
            overall_score = analysis_results.get('overall_score', 0)
            skill_match = analysis_results.get('skill_match_percentage', 0)
            
            prompt = f"""
            As a senior career coach, please provide strategic advice for improving this resume:

            Resume Analysis:
            - Overall Score: {overall_score}/100
            - Skill Match: {skill_match:.1f}%
            - Sections Present: {', '.join([k for k, v in resume_sections.items() if v.strip()])}

            Target Role: {job_data.get('description', 'Professional role')}
            Top Missing Skills: {', '.join(analysis_results.get('missing_skills', [])[:5])}

            Please provide:
            1. Top 3 strategic improvements to focus on
            2. Industry-specific advice for this role
            3. Common mistakes to avoid
            4. Next steps for skill development
            5. How to stand out from other candidates

            Provide actionable, specific advice that will have the biggest impact on job search success.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"AI optimization unavailable: {str(e)}"
    
    def generate_cover_letter_suggestions(self, resume_sections: Dict[str, str], 
                                        job_data: Dict) -> str:
        """Generate cover letter suggestions based on resume and job requirements"""
        if not self.client:
            return "AI optimization not available"
        
        try:
            prompt = f"""
            Based on this resume analysis, provide suggestions for writing a compelling cover letter:

            Resume Highlights:
            - Summary: {resume_sections.get('summary', 'Not provided')[:200]}
            - Key Skills: {resume_sections.get('skills', 'Not provided')[:200]}
            - Experience: {resume_sections.get('experience', 'Not provided')[:300]}

            Target Role: {job_data.get('description', 'Professional role')}
            Required Skills: {', '.join(job_data.get('required_skills', [])[:8])}

            Please provide:
            1. Key points to highlight in the cover letter
            2. How to connect experience to job requirements
            3. Compelling opening and closing suggestions
            4. Ways to demonstrate value to the employer
            5. Common cover letter mistakes to avoid

            Focus on making the candidate stand out while staying authentic.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Cover letter suggestions unavailable: {str(e)}"