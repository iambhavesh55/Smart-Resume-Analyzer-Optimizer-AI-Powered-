# 🎯 Smart Resume Analyzer & Optimizer

An AI-powered web application that analyzes resumes, evaluates them against job roles, and provides intelligent feedback to help job seekers improve their chances of getting hired.

![Resume Analyzer Demo](https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🌟 Features

### Core Functionality
- **📄 Resume Upload**: Support for PDF and DOCX formats
- **🎯 Job Role Matching**: Compare against predefined roles or custom job descriptions
- **📊 Comprehensive Analysis**: 
  - Overall resume score (0-100)
  - Skill match percentage
  - Keyword optimization analysis
  - Readability assessment
  - Section-by-section evaluation

### Intelligent Feedback
- **💡 Smart Suggestions**: Actionable recommendations for improvement
- **🤖 AI Optimization**: Enhanced suggestions using OpenAI GPT (optional)
- **📈 Visual Analytics**: Interactive charts and score breakdowns
- **📄 PDF Reports**: Downloadable analysis reports

### Advanced Features
- **🔍 Skills Gap Analysis**: Identify missing skills for target roles
- **📝 Content Enhancement**: Suggestions for better formatting and content
- **🎨 Professional Interface**: Clean, modern web design
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Web Framework** | Streamlit |
| **PDF Processing** | PyMuPDF (fitz) |
| **Document Processing** | python-docx |
| **NLP & Analysis** | spaCy, NLTK, scikit-learn |
| **AI Enhancement** | OpenAI GPT-3.5 (optional) |
| **Data Visualization** | Plotly, Matplotlib, Seaborn |
| **Report Generation** | FPDF2 |
| **Text Analysis** | TextStat, TF-IDF Vectorization |

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-resume-analyzer.git
   cd smart-resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Download spaCy language model**
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Run the application**
   ```bash
   streamlit run app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:8501`

## 📖 How to Use

### 1. Upload Your Resume
- Click "Upload Your Resume" in the sidebar
- Select your PDF or DOCX resume file
- The system will automatically extract and parse the content

### 2. Choose Analysis Type
- **Predefined Job Role**: Select from common roles like Software Engineer, Data Scientist, etc.
- **Custom Job Description**: Paste a specific job posting for targeted analysis

### 3. Configure Settings
- Enable AI Optimization for enhanced suggestions (requires OpenAI API key)
- Adjust analysis parameters as needed

### 4. Analyze & Review
- Click "🚀 Analyze Resume" to start the analysis
- Review your scores, matched/missing skills, and detailed feedback
- Explore different tabs for comprehensive insights

### 5. Generate Reports
- Download PDF reports for offline review
- Copy analysis summaries for easy sharing
- Use suggestions to improve your resume

## 📊 Analysis Components

### Overall Scoring
- **Skills Match**: Percentage of required skills found in your resume
- **Keyword Optimization**: Relevance to job description keywords
- **Content Quality**: Readability and professional presentation
- **Section Completeness**: Presence and quality of essential resume sections

### Detailed Feedback
- **✅ Matched Skills**: Skills you already possess
- **❌ Missing Skills**: Important skills to develop or highlight
- **💡 Improvement Suggestions**: Specific, actionable recommendations
- **🤖 AI Insights**: Enhanced suggestions powered by GPT (when enabled)

## 🎯 Supported Job Roles

The system includes predefined analysis for:
- Software Engineer
- Data Scientist
- Product Manager
- Marketing Manager
- Business Analyst
- UI/UX Designer
- DevOps Engineer
- Project Manager
- Financial Analyst
- HR Manager
- Content Writer
- Sales Representative

## 🔧 Configuration

### Environment Variables
Create a `.env` file for optional configurations:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Customization
- **Job Roles**: Edit `assets/job_roles.json` to add custom job roles
- **Skills Database**: Modify skill lists in `job_matcher.py`
- **Styling**: Update CSS in `app.py` for custom themes

## 📁 Project Structure

```
smart-resume-analyzer/
├── app.py                 # Main Streamlit application
├── resume_parser.py       # PDF/DOCX text extraction
├── job_matcher.py         # Job matching and scoring logic
├── suggestor.py          # Improvement suggestions engine
├── llm_optimizer.py      # AI-powered optimizations
├── report_generator.py   # PDF report generation
├── assets/
│   └── job_roles.json    # Predefined job role data
├── reports/              # Generated PDF reports
├── test_resumes/         # Sample resumes for testing
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Areas for Contribution
- Additional job role templates
- Enhanced NLP analysis
- UI/UX improvements
- Performance optimizations
- Additional export formats
- Mobile app development

## 📈 Roadmap

### Version 2.0 (Planned)
- [ ] Multi-language support
- [ ] Industry-specific analysis
- [ ] Resume template generator
- [ ] Interview preparation suggestions
- [ ] Salary estimation based on skills
- [ ] LinkedIn profile optimization
- [ ] ATS compatibility checker

### Version 3.0 (Future)
- [ ] Real-time job market analysis
- [ ] Skill development recommendations
- [ ] Career path suggestions
- [ ] Integration with job boards
- [ ] Team/HR dashboard
- [ ] API for third-party integrations

## 🐛 Troubleshooting

### Common Issues

**1. PDF parsing errors**
- Ensure your PDF is text-based (not scanned images)
- Try converting to DOCX format
- Check file size (max 10MB recommended)

**2. AI features not working**
- Verify your OpenAI API key is valid
- Check your API usage limits
- Ensure stable internet connection

**3. Slow analysis**
- Large files may take longer to process
- Close other applications to free up memory
- Try with a smaller resume file first

### Getting Help
- Check the [Issues](https://github.com/yourusername/smart-resume-analyzer/issues) page
- Create a new issue with detailed description
- Join our [Discord community](https://discord.gg/resume-analyzer) for support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT API capabilities
- **Streamlit** for the amazing web framework
- **spaCy** for natural language processing
- **PyMuPDF** for PDF processing
- **Pexels** for stock photography
- **Open source community** for various libraries and tools

## 📞 Contact

- **Author**: Bhavesh Chaudhary
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **GitHub**: [Your GitHub Profile](https://github.com/yourusername)

---

**⭐ If this project helped you land your dream job, please give it a star!**

Made with ❤️ for job seekers worldwide