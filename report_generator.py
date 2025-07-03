from fpdf import FPDF
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os
from typing import Dict
import numpy as np

class ReportGenerator:
    """Generate PDF reports for resume analysis"""
    
    def __init__(self):
        self.pdf = FPDF()
        self.colors = {
            'primary': (102, 126, 234),
            'secondary': (118, 75, 162),
            'success': (40, 167, 69),
            'warning': (255, 193, 7),
            'danger': (220, 53, 69),
            'info': (23, 162, 184)
        }
    
    def generate_pdf_report(self, analysis_data: Dict) -> str:
        """Generate comprehensive PDF report"""
        self.pdf = FPDF()
        self.pdf.add_page()
        
        # Header
        self._add_header(analysis_data)
        
        # Executive Summary
        self._add_executive_summary(analysis_data)
        
        # Detailed Analysis
        self._add_detailed_analysis(analysis_data)
        
        # Skills Analysis
        self._add_skills_analysis(analysis_data)
        
        # Recommendations
        self._add_recommendations(analysis_data)
        
        # Charts (if possible)
        self._add_charts_section(analysis_data)
        
        # Save PDF
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"resume_analysis_report_{timestamp}.pdf"
        filepath = os.path.join("reports", filename)
        
        # Create reports directory if it doesn't exist
        os.makedirs("reports", exist_ok=True)
        
        self.pdf.output(filepath)
        return filepath
    
    def _add_header(self, data: Dict):
        """Add report header"""
        # Title
        self.pdf.set_font('Arial', 'B', 20)
        self.pdf.set_text_color(102, 126, 234)
        self.pdf.cell(0, 15, 'Smart Resume Analysis Report', 0, 1, 'C')
        
        # Subtitle
        self.pdf.set_font('Arial', '', 12)
        self.pdf.set_text_color(0, 0, 0)
        self.pdf.cell(0, 10, f"Generated on: {data['timestamp']}", 0, 1, 'C')
        self.pdf.cell(0, 10, f"Target Role: {data['job_role']}", 0, 1, 'C')
        
        # Line separator
        self.pdf.ln(5)
        self.pdf.set_draw_color(102, 126, 234)
        self.pdf.line(20, self.pdf.get_y(), 190, self.pdf.get_y())
        self.pdf.ln(10)
    
    def _add_executive_summary(self, data: Dict):
        """Add executive summary section"""
        analysis = data['analysis']
        
        self.pdf.set_font('Arial', 'B', 16)
        self.pdf.set_text_color(102, 126, 234)
        self.pdf.cell(0, 10, 'Executive Summary', 0, 1)
        self.pdf.ln(5)
        
        # Key metrics
        self.pdf.set_font('Arial', 'B', 12)
        self.pdf.set_text_color(0, 0, 0)
        
        metrics = [
            f"Overall Score: {analysis['overall_score']}/100",
            f"Skill Match: {analysis['skill_match_percentage']:.1f}%",
            f"Keywords Found: {len(analysis['matched_keywords'])}",
            f"Readability Score: {analysis['readability_score']:.1f}"
        ]
        
        for metric in metrics:
            self.pdf.cell(0, 8, f"• {metric}", 0, 1)
        
        self.pdf.ln(5)
        
        # Summary text
        self.pdf.set_font('Arial', '', 11)
        summary_text = self._generate_summary_text(analysis)
        self.pdf.multi_cell(0, 6, summary_text)
        self.pdf.ln(10)
    
    def _add_detailed_analysis(self, data: Dict):
        """Add detailed analysis section"""
        analysis = data['analysis']
        
        self.pdf.set_font('Arial', 'B', 16)
        self.pdf.set_text_color(102, 126, 234)
        self.pdf.cell(0, 10, 'Detailed Analysis', 0, 1)
        self.pdf.ln(5)
        
        # Score breakdown
        self.pdf.set_font('Arial', 'B', 12)
        self.pdf.set_text_color(0, 0, 0)
        self.pdf.cell(0, 8, 'Score Breakdown:', 0, 1)
        
        self.pdf.set_font('Arial', '', 11)
        
        # Create score breakdown
        scores = {
            'Skills Match': analysis['skill_match_percentage'],
            'Content Similarity': analysis.get('similarity_score', 0),
            'Readability': analysis['readability_score'],
            'Keyword Optimization': (len(analysis['matched_keywords']) / 
                                   max(len(analysis['matched_keywords']) + len(analysis['missing_keywords']), 1)) * 100
        }
        
        for category, score in scores.items():
            self.pdf.cell(0, 6, f"• {category}: {score:.1f}%", 0, 1)
        
        self.pdf.ln(10)
    
    def _add_skills_analysis(self, data: Dict):
        """Add skills analysis section"""
        analysis = data['analysis']
        
        self.pdf.set_font('Arial', 'B', 16)
        self.pdf.set_text_color(102, 126, 234)
        self.pdf.cell(0, 10, 'Skills Analysis', 0, 1)
        self.pdf.ln(5)
        
        # Matched skills
        self.pdf.set_font('Arial', 'B', 12)
        self.pdf.set_text_color(40, 167, 69)
        self.pdf.cell(0, 8, f'Matched Skills ({len(analysis["matched_skills"])})', 0, 1)
        
        self.pdf.set_font('Arial', '', 10)
        self.pdf.set_text_color(0, 0, 0)
        
        if analysis['matched_skills']:
            skills_text = ', '.join(analysis['matched_skills'])
            self.pdf.multi_cell(0, 5, skills_text)
        else:
            self.pdf.cell(0, 5, 'No specific skills matched', 0, 1)
        
        self.pdf.ln(5)
        
        # Missing skills
        self.pdf.set_font('Arial', 'B', 12)
        self.pdf.set_text_color(220, 53, 69)
        self.pdf.cell(0, 8, f'Missing Skills ({len(analysis["missing_skills"])})', 0, 1)
        
        self.pdf.set_font('Arial', '', 10)
        self.pdf.set_text_color(0, 0, 0)
        
        if analysis['missing_skills']:
            missing_skills_text = ', '.join(analysis['missing_skills'][:15])  # Limit for space
            self.pdf.multi_cell(0, 5, missing_skills_text)
        else:
            self.pdf.cell(0, 5, 'Great! You have most required skills', 0, 1)
        
        self.pdf.ln(10)
    
    def _add_recommendations(self, data: Dict):
        """Add recommendations section"""
        suggestions = data['suggestions']
        
        self.pdf.set_font('Arial', 'B', 16)
        self.pdf.set_text_color(102, 126, 234)
        self.pdf.cell(0, 10, 'Recommendations', 0, 1)
        self.pdf.ln(5)
        
        # Add top suggestions from each category
        priority_categories = ['skills_improvement', 'content_enhancement', 'keyword_optimization']
        
        for category in priority_categories:
            if category in suggestions and suggestions[category]:
                category_title = category.replace('_', ' ').title()
                
                self.pdf.set_font('Arial', 'B', 12)
                self.pdf.set_text_color(0, 0, 0)
                self.pdf.cell(0, 8, category_title, 0, 1)
                
                self.pdf.set_font('Arial', '', 10)
                
                # Add top 3 suggestions from this category
                for suggestion in suggestions[category][:3]:
                    self.pdf.multi_cell(0, 5, f"• {suggestion}")
                    self.pdf.ln(2)
                
                self.pdf.ln(5)
    
    def _add_charts_section(self, data: Dict):
        """Add charts section (placeholder for future implementation)"""
        self.pdf.add_page()
        
        self.pdf.set_font('Arial', 'B', 16)
        self.pdf.set_text_color(102, 126, 234)
        self.pdf.cell(0, 10, 'Visual Analysis', 0, 1)
        self.pdf.ln(5)
        
        self.pdf.set_font('Arial', '', 11)
        self.pdf.set_text_color(0, 0, 0)
        
        # Placeholder for charts
        chart_info = [
            "Score Distribution Chart: Shows how your resume performs across different categories",
            "Skills Gap Analysis: Visual representation of matched vs missing skills",
            "Keyword Optimization Chart: Displays keyword coverage and opportunities",
            "Improvement Priority Matrix: Highlights areas with highest impact potential"
        ]
        
        for info in chart_info:
            self.pdf.multi_cell(0, 6, f"• {info}")
            self.pdf.ln(2)
        
        self.pdf.ln(10)
        self.pdf.multi_cell(0, 6, "Note: Interactive charts and detailed visualizations are available in the web interface.")
    
    def _generate_summary_text(self, analysis: Dict) -> str:
        """Generate executive summary text"""
        score = analysis['overall_score']
        skill_match = analysis['skill_match_percentage']
        
        if score >= 85:
            performance = "excellent"
            advice = "Your resume is highly competitive and well-aligned with the target role."
        elif score >= 70:
            performance = "good"
            advice = "Your resume shows strong potential with room for targeted improvements."
        elif score >= 50:
            performance = "moderate"
            advice = "Your resume needs significant improvements to be competitive."
        else:
            performance = "needs improvement"
            advice = "Your resume requires substantial revision to meet job requirements."
        
        return f"""Your resume demonstrates {performance} alignment with the target role, achieving an overall score of {score}/100. 
With a {skill_match:.1f}% skill match rate, {advice} Focus on the recommendations below to enhance your 
competitiveness and improve your chances of securing interviews."""

def create_sample_report():
    """Create a sample report for testing"""
    sample_data = {
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'job_role': 'Software Engineer',
        'analysis': {
            'overall_score': 78,
            'skill_match_percentage': 65.5,
            'similarity_score': 72.3,
            'readability_score': 68.2,
            'matched_skills': ['Python', 'JavaScript', 'SQL', 'Git', 'Problem Solving'],
            'missing_skills': ['React', 'Docker', 'AWS', 'Machine Learning', 'DevOps'],
            'matched_keywords': ['software development', 'programming', 'database'],
            'missing_keywords': ['agile', 'scrum', 'ci/cd', 'microservices']
        },
        'suggestions': {
            'skills_improvement': [
                'Add React to your skillset as it\'s highly valued for frontend development',
                'Consider learning Docker for containerization skills'
            ],
            'content_enhancement': [
                'Use more action verbs in your experience descriptions',
                'Quantify your achievements with specific metrics'
            ],
            'keyword_optimization': [
                'Include "agile methodology" in your experience section',
                'Add "continuous integration" to demonstrate DevOps knowledge'
            ]
        }
    }
    
    generator = ReportGenerator()
    return generator.generate_pdf_report(sample_data)

if __name__ == "__main__":
    # Test the report generator
    sample_report_path = create_sample_report()
    print(f"Sample report generated: {sample_report_path}")