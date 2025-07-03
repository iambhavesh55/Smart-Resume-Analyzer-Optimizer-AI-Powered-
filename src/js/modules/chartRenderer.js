export class ChartRenderer {
    constructor() {
        this.Chart = null;
        this.initializeChart();
    }

    async initializeChart() {
        // Import Chart.js
        const ChartJS = await import('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js');
        this.Chart = ChartJS;
        
        // Register required components
        this.Chart.register(...this.Chart.registerables);
    }

    async renderScoreChart(analysis) {
        if (!this.Chart) {
            await this.initializeChart();
        }

        const ctx = document.getElementById('scoreChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        const categories = ['Skills Match', 'Keywords', 'Readability', 'Content Quality', 'Completeness'];
        const scores = [
            analysis.skillMatchPercentage,
            (analysis.matchedKeywords.length / Math.max(analysis.matchedKeywords.length + analysis.missingKeywords.length, 1)) * 100,
            analysis.readabilityScore,
            this.calculateContentQuality(analysis),
            this.calculateCompleteness(analysis)
        ];

        const chart = new this.Chart(ctx, {
            type: 'radar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Your Resume',
                    data: scores,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.r.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });

        // Store chart reference for cleanup
        ctx.chart = chart;
    }

    calculateContentQuality(analysis) {
        // Calculate content quality based on various factors
        let score = 0;
        let factors = 0;

        // Readability contributes to content quality
        score += analysis.readabilityScore * 0.3;
        factors += 0.3;

        // Skill match contributes to content quality
        score += analysis.skillMatchPercentage * 0.4;
        factors += 0.4;

        // Keyword optimization contributes to content quality
        const keywordScore = (analysis.matchedKeywords.length / Math.max(analysis.matchedKeywords.length + analysis.missingKeywords.length, 1)) * 100;
        score += keywordScore * 0.3;
        factors += 0.3;

        return factors > 0 ? score / factors : 0;
    }

    calculateCompleteness(analysis) {
        // Calculate completeness based on presence of important sections
        const sections = [
            analysis.hasSummary,
            analysis.hasExperience,
            analysis.hasEducation,
            analysis.hasSkills,
            analysis.hasProjects
        ];

        const presentSections = sections.filter(Boolean).length;
        return (presentSections / sections.length) * 100;
    }

    renderSkillsChart(analysis) {
        // Create a simple bar chart for skills comparison
        const container = document.createElement('div');
        container.className = 'skills-chart';
        container.innerHTML = `
            <h4>Skills Overview</h4>
            <div class="skill-bar">
                <div class="skill-label">Matched Skills</div>
                <div class="skill-progress">
                    <div class="skill-fill matched" style="width: ${(analysis.matchedSkills.length / Math.max(analysis.matchedSkills.length + analysis.missingSkills.length, 1)) * 100}%"></div>
                </div>
                <div class="skill-count">${analysis.matchedSkills.length}</div>
            </div>
            <div class="skill-bar">
                <div class="skill-label">Missing Skills</div>
                <div class="skill-progress">
                    <div class="skill-fill missing" style="width: ${(analysis.missingSkills.length / Math.max(analysis.matchedSkills.length + analysis.missingSkills.length, 1)) * 100}%"></div>
                </div>
                <div class="skill-count">${analysis.missingSkills.length}</div>
            </div>
        `;

        return container;
    }

    renderProgressChart(analysis) {
        // Create a circular progress chart for overall score
        const container = document.createElement('div');
        container.className = 'progress-chart';
        
        const percentage = analysis.overallScore;
        const circumference = 2 * Math.PI * 45; // radius = 45
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        container.innerHTML = `
            <div class="progress-circle">
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#667eea" stroke-width="8"
                            stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashoffset}"
                            stroke-linecap="round" transform="rotate(-90 60 60)"/>
                </svg>
                <div class="progress-text">
                    <div class="progress-value">${percentage}</div>
                    <div class="progress-label">Score</div>
                </div>
            </div>
        `;

        return container;
    }
}