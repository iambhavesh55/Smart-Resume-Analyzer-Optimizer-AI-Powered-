import streamlit as st
import os
import json
from datetime import datetime
import plotly.graph_objects as go
import plotly.express as px
from resume_parser import ResumeParser
from job_matcher import JobMatcher
from suggestor import SuggestionEngine
from llm_optimizer import LLMOptimizer
import pandas as pd

# Page configuration
st.set_page_config(
    page_title="Smart Resume Analyzer & Optimizer",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #667eea;
    }
    .suggestion-box {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #28a745;
        margin: 0.5rem 0;
    }
    .warning-box {
        background: #fff3cd;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #ffc107;
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🎯 Smart Resume Analyzer & Optimizer</h1>
        <p>AI-Powered Resume Analysis to Boost Your Job Search Success</p>
    </div>
    """, unsafe_allow_html=True)

    # Initialize session state
    if 'analysis_complete' not in st.session_state:
        st.session_state.analysis_complete = False
    if 'resume_data' not in st.session_state:
        st.session_state.resume_data = None

    # Sidebar
    with st.sidebar:
        st.header("📋 Analysis Options")
        
        # File upload
        uploaded_file = st.file_uploader(
            "Upload Your Resume",
            type=['pdf', 'docx'],
            help="Upload your resume in PDF or DOCX format"
        )
        
        # Job role selection
        st.subheader("🎯 Target Job Role")
        job_option = st.radio(
            "Choose analysis type:",
            ["Predefined Job Role", "Custom Job Description"]
        )
        
        if job_option == "Predefined Job Role":
            job_roles = [
                "Software Engineer", "Data Scientist", "Product Manager",
                "Marketing Manager", "Sales Representative", "Business Analyst",
                "UI/UX Designer", "DevOps Engineer", "Project Manager",
                "Financial Analyst", "HR Manager", "Content Writer"
            ]
            selected_role = st.selectbox("Select Job Role:", job_roles)
            job_description = ""
        else:
            selected_role = "Custom"
            job_description = st.text_area(
                "Paste Job Description:",
                height=200,
                placeholder="Paste the complete job description here..."
            )
        
        # Analysis settings
        st.subheader("⚙️ Settings")
        use_ai_optimization = st.checkbox(
            "Enable AI Optimization",
            help="Use AI to generate enhanced suggestions (requires API key)"
        )
        
        if use_ai_optimization:
            api_key = st.text_input(
                "OpenAI API Key (Optional):",
                type="password",
                help="Enter your OpenAI API key for enhanced AI features"
            )
        else:
            api_key = None

    # Main content
    if uploaded_file is not None:
        if st.button("🚀 Analyze Resume", type="primary"):
            with st.spinner("Analyzing your resume... This may take a few moments."):
                try:
                    # Parse resume
                    parser = ResumeParser()
                    resume_text, resume_sections = parser.extract_text_and_sections(uploaded_file)
                    
                    # Match with job
                    matcher = JobMatcher()
                    if job_option == "Predefined Job Role":
                        job_data = matcher.get_job_requirements(selected_role)
                        comparison_text = job_data['description']
                    else:
                        comparison_text = job_description
                        job_data = matcher.analyze_job_description(job_description)
                    
                    # Perform analysis
                    analysis_results = matcher.analyze_resume(
                        resume_text, resume_sections, job_data
                    )
                    
                    # Generate suggestions
                    suggestor = SuggestionEngine()
                    suggestions = suggestor.generate_suggestions(
                        analysis_results, resume_sections, job_data
                    )
                    
                    # AI optimization (if enabled)
                    ai_suggestions = None
                    if use_ai_optimization and api_key:
                        try:
                            optimizer = LLMOptimizer(api_key)
                            ai_suggestions = optimizer.optimize_resume_sections(
                                resume_sections, job_data, analysis_results
                            )
                        except Exception as e:
                            st.warning(f"AI optimization failed: {str(e)}")
                    
                    # Store results in session state
                    st.session_state.resume_data = {
                        'analysis': analysis_results,
                        'suggestions': suggestions,
                        'ai_suggestions': ai_suggestions,
                        'resume_sections': resume_sections,
                        'job_role': selected_role,
                        'job_data': job_data,
                        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    }
                    st.session_state.analysis_complete = True
                    
                except Exception as e:
                    st.error(f"Error analyzing resume: {str(e)}")
                    st.error("Please check your file format and try again.")

    # Display results
    if st.session_state.analysis_complete and st.session_state.resume_data:
        display_analysis_results(st.session_state.resume_data)

def display_analysis_results(data):
    """Display comprehensive analysis results"""
    analysis = data['analysis']
    suggestions = data['suggestions']
    ai_suggestions = data['ai_suggestions']
    
    st.header("📊 Analysis Results")
    
    # Overall score and metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            "Overall Score",
            f"{analysis['overall_score']}/100",
            delta=f"{analysis['overall_score'] - 70} vs Average"
        )
    
    with col2:
        st.metric(
            "Skill Match",
            f"{analysis['skill_match_percentage']:.1f}%",
            delta=f"{analysis['skill_match_percentage'] - 60:.1f}% vs Target"
        )
    
    with col3:
        st.metric(
            "Keywords Found",
            f"{len(analysis['matched_keywords'])}",
            delta=f"{len(analysis['matched_keywords']) - len(analysis['missing_keywords'])}"
        )
    
    with col4:
        st.metric(
            "Readability Score",
            f"{analysis['readability_score']:.1f}",
            delta="Good" if analysis['readability_score'] > 60 else "Needs Work"
        )
    
    # Score breakdown chart
    st.subheader("📈 Score Breakdown")
    
    categories = ['Skills Match', 'Keywords', 'Experience', 'Education', 'Format', 'Readability']
    scores = [
        analysis['skill_match_percentage'],
        (len(analysis['matched_keywords']) / max(len(analysis['matched_keywords']) + len(analysis['missing_keywords']), 1)) * 100,
        analysis.get('experience_score', 75),
        analysis.get('education_score', 80),
        analysis.get('format_score', 85),
        analysis['readability_score']
    ]
    
    fig = go.Figure(data=go.Scatterpolar(
        r=scores,
        theta=categories,
        fill='toself',
        name='Your Resume'
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 100]
            )),
        showlegend=True,
        title="Resume Analysis Radar Chart"
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Detailed analysis tabs
    tab1, tab2, tab3, tab4 = st.tabs(["🎯 Skills Analysis", "💡 Suggestions", "🤖 AI Insights", "📄 Report"])
    
    with tab1:
        display_skills_analysis(analysis)
    
    with tab2:
        display_suggestions(suggestions)
    
    with tab3:
        if ai_suggestions:
            display_ai_suggestions(ai_suggestions)
        else:
            st.info("AI suggestions not available. Enable AI optimization and provide an API key to access this feature.")
    
    with tab4:
        display_report_options(data)

def display_skills_analysis(analysis):
    """Display detailed skills analysis"""
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("✅ Matched Skills")
        if analysis['matched_skills']:
            for skill in analysis['matched_skills']:
                st.success(f"✓ {skill}")
        else:
            st.info("No specific skills matched. Consider adding more relevant skills.")
    
    with col2:
        st.subheader("❌ Missing Skills")
        if analysis['missing_skills']:
            for skill in analysis['missing_skills'][:10]:  # Show top 10
                st.error(f"✗ {skill}")
        else:
            st.success("Great! You have most of the required skills.")
    
    # Keywords analysis
    st.subheader("🔍 Keywords Analysis")
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("**Found Keywords:**")
        if analysis['matched_keywords']:
            keyword_text = ", ".join(analysis['matched_keywords'][:20])
            st.success(keyword_text)
    
    with col2:
        st.write("**Missing Keywords:**")
        if analysis['missing_keywords']:
            missing_text = ", ".join(analysis['missing_keywords'][:20])
            st.warning(missing_text)

def display_suggestions(suggestions):
    """Display improvement suggestions"""
    for category, items in suggestions.items():
        if items:
            st.subheader(f"💡 {category.replace('_', ' ').title()}")
            for item in items:
                st.markdown(f"""
                <div class="suggestion-box">
                    <strong>💡 Suggestion:</strong> {item}
                </div>
                """, unsafe_allow_html=True)

def display_ai_suggestions(ai_suggestions):
    """Display AI-generated suggestions"""
    st.subheader("🤖 AI-Powered Optimization")
    
    for section, suggestion in ai_suggestions.items():
        if suggestion:
            with st.expander(f"✨ {section.title()} Enhancement"):
                st.write("**AI Suggestion:**")
                st.info(suggestion)

def display_report_options(data):
    """Display report generation options"""
    st.subheader("📄 Generate Report")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📊 Generate PDF Report", type="primary"):
            try:
                from report_generator import ReportGenerator
                generator = ReportGenerator()
                pdf_path = generator.generate_pdf_report(data)
                
                with open(pdf_path, "rb") as pdf_file:
                    st.download_button(
                        label="📥 Download PDF Report",
                        data=pdf_file.read(),
                        file_name=f"resume_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
                        mime="application/pdf"
                    )
                st.success("PDF report generated successfully!")
            except Exception as e:
                st.error(f"Error generating PDF: {str(e)}")
    
    with col2:
        if st.button("📋 Copy Analysis Summary"):
            summary = generate_text_summary(data)
            st.text_area("Analysis Summary (Copy this):", summary, height=300)

def generate_text_summary(data):
    """Generate a text summary of the analysis"""
    analysis = data['analysis']
    timestamp = data['timestamp']
    
    summary = f"""
RESUME ANALYSIS REPORT
Generated on: {timestamp}
Target Role: {data['job_role']}

OVERALL SCORES:
- Overall Score: {analysis['overall_score']}/100
- Skill Match: {analysis['skill_match_percentage']:.1f}%
- Readability: {analysis['readability_score']:.1f}

MATCHED SKILLS ({len(analysis['matched_skills'])}):
{', '.join(analysis['matched_skills']) if analysis['matched_skills'] else 'None identified'}

MISSING SKILLS ({len(analysis['missing_skills'])}):
{', '.join(analysis['missing_skills'][:10]) if analysis['missing_skills'] else 'None identified'}

KEY RECOMMENDATIONS:
"""
    
    # Add top suggestions
    suggestions = data['suggestions']
    for category, items in suggestions.items():
        if items:
            summary += f"\n{category.replace('_', ' ').upper()}:\n"
            for item in items[:3]:  # Top 3 per category
                summary += f"- {item}\n"
    
    return summary

if __name__ == "__main__":
    main()