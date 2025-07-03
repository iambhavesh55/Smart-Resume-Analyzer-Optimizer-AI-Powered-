export class UserFeedback {
    constructor() {
        this.feedbackData = [];
        this.initializeStorage();
    }

    initializeStorage() {
        // Initialize local storage for feedback if not exists
        if (!localStorage.getItem('resumeAnalyzerFeedback')) {
            localStorage.setItem('resumeAnalyzerFeedback', JSON.stringify([]));
        }
        this.loadFeedbackData();
    }

    loadFeedbackData() {
        try {
            this.feedbackData = JSON.parse(localStorage.getItem('resumeAnalyzerFeedback')) || [];
        } catch (error) {
            console.error('Error loading feedback data:', error);
            this.feedbackData = [];
        }
    }

    saveFeedbackData() {
        try {
            localStorage.setItem('resumeAnalyzerFeedback', JSON.stringify(this.feedbackData));
        } catch (error) {
            console.error('Error saving feedback data:', error);
        }
    }

    createFeedbackWidget(suggestionId, suggestionText, context = 'general') {
        return `
            <div class="feedback-widget" data-suggestion-id="${suggestionId}">
                <div class="feedback-question">
                    <span>Was this suggestion helpful?</span>
                </div>
                <div class="feedback-actions">
                    <button class="feedback-btn thumbs-up" onclick="submitFeedback('${suggestionId}', 'positive', '${context}')" title="Helpful">
                        👍
                    </button>
                    <button class="feedback-btn thumbs-down" onclick="submitFeedback('${suggestionId}', 'negative', '${context}')" title="Not helpful">
                        👎
                    </button>
                    <button class="feedback-btn comment" onclick="openFeedbackModal('${suggestionId}', '${context}')" title="Add comment">
                        💬
                    </button>
                </div>
                <div class="feedback-status" id="feedback-status-${suggestionId}"></div>
            </div>
        `;
    }

    createDetailedFeedbackModal() {
        return `
            <div class="feedback-modal" id="feedbackModal" style="display: none;">
                <div class="modal-overlay" onclick="closeFeedbackModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>📝 Provide Detailed Feedback</h3>
                        <button class="modal-close" onclick="closeFeedbackModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="feedback-form">
                            <div class="form-group">
                                <label>Overall Rating</label>
                                <div class="star-rating" id="starRating">
                                    <span class="star" data-rating="1">⭐</span>
                                    <span class="star" data-rating="2">⭐</span>
                                    <span class="star" data-rating="3">⭐</span>
                                    <span class="star" data-rating="4">⭐</span>
                                    <span class="star" data-rating="5">⭐</span>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>What did you find most helpful?</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" value="skill-analysis"> Skill Analysis
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" value="keyword-suggestions"> Keyword Suggestions
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" value="content-improvements"> Content Improvements
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" value="formatting-tips"> Formatting Tips
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" value="overall-score"> Overall Score
                                    </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>What could be improved?</label>
                                <textarea id="improvementSuggestions" rows="4" placeholder="Tell us how we can make this tool better..."></textarea>
                            </div>

                            <div class="form-group">
                                <label>Additional Comments</label>
                                <textarea id="additionalComments" rows="3" placeholder="Any other feedback or suggestions..."></textarea>
                            </div>

                            <div class="form-group">
                                <label>Would you recommend this tool to others?</label>
                                <div class="radio-group">
                                    <label class="radio-label">
                                        <input type="radio" name="recommend" value="definitely"> Definitely
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="recommend" value="probably"> Probably
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="recommend" value="maybe"> Maybe
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="recommend" value="probably-not"> Probably Not
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="recommend" value="definitely-not"> Definitely Not
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="closeFeedbackModal()">Cancel</button>
                        <button class="btn-primary" onclick="submitDetailedFeedback()">Submit Feedback</button>
                    </div>
                </div>
            </div>
        `;
    }

    submitFeedback(suggestionId, type, context, comment = '') {
        const feedback = {
            id: this.generateFeedbackId(),
            suggestionId,
            type, // 'positive', 'negative', 'detailed'
            context,
            comment,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.feedbackData.push(feedback);
        this.saveFeedbackData();

        // Update UI to show feedback was submitted
        this.showFeedbackConfirmation(suggestionId, type);

        // Send to analytics (if implemented)
        this.trackFeedbackEvent(feedback);

        return feedback.id;
    }

    submitDetailedFeedback() {
        const rating = this.getSelectedRating();
        const helpful = this.getSelectedCheckboxes();
        const improvements = document.getElementById('improvementSuggestions')?.value || '';
        const comments = document.getElementById('additionalComments')?.value || '';
        const recommend = document.querySelector('input[name="recommend"]:checked')?.value || '';

        const feedback = {
            id: this.generateFeedbackId(),
            type: 'detailed',
            rating,
            helpful,
            improvements,
            comments,
            recommend,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.feedbackData.push(feedback);
        this.saveFeedbackData();

        // Show confirmation
        this.showDetailedFeedbackConfirmation();

        // Close modal
        this.closeFeedbackModal();

        // Track event
        this.trackFeedbackEvent(feedback);

        return feedback.id;
    }

    getSelectedRating() {
        const selectedStar = document.querySelector('.star.selected');
        return selectedStar ? parseInt(selectedStar.dataset.rating) : 0;
    }

    getSelectedCheckboxes() {
        const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    showFeedbackConfirmation(suggestionId, type) {
        const statusElement = document.getElementById(`feedback-status-${suggestionId}`);
        if (statusElement) {
            const message = type === 'positive' ? 
                '✅ Thanks for your feedback!' : 
                '📝 Thanks! We\'ll work on improving this.';
            
            statusElement.innerHTML = `<span class="feedback-confirmation">${message}</span>`;
            statusElement.style.display = 'block';

            // Hide feedback buttons
            const widget = statusElement.closest('.feedback-widget');
            const actions = widget?.querySelector('.feedback-actions');
            if (actions) {
                actions.style.display = 'none';
            }

            // Auto-hide after 3 seconds
            setTimeout(() => {
                statusElement.style.display = 'none';
                if (actions) {
                    actions.style.display = 'flex';
                }
            }, 3000);
        }
    }

    showDetailedFeedbackConfirmation() {
        // Create and show a toast notification
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">🎉</span>
                <span class="toast-message">Thank you for your detailed feedback!</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 4000);
    }

    openFeedbackModal(suggestionId, context) {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.style.display = 'block';
            modal.dataset.suggestionId = suggestionId;
            modal.dataset.context = context;

            // Initialize star rating
            this.initializeStarRating();
        }
    }

    closeFeedbackModal() {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.style.display = 'none';
            this.resetFeedbackForm();
        }
    }

    initializeStarRating() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                // Remove selected class from all stars
                stars.forEach(s => s.classList.remove('selected'));
                
                // Add selected class to clicked star and all previous stars
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('selected');
                }
            });

            star.addEventListener('mouseover', () => {
                // Add hover effect
                stars.forEach(s => s.classList.remove('hover'));
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('hover');
                }
            });
        });

        // Remove hover effect when mouse leaves rating area
        const ratingContainer = document.getElementById('starRating');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hover'));
            });
        }
    }

    resetFeedbackForm() {
        // Reset star rating
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('selected', 'hover');
        });

        // Reset checkboxes
        document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Reset radio buttons
        document.querySelectorAll('input[name="recommend"]').forEach(radio => {
            radio.checked = false;
        });

        // Reset textareas
        document.getElementById('improvementSuggestions').value = '';
        document.getElementById('additionalComments').value = '';
    }

    generateFeedbackId() {
        return 'feedback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackFeedbackEvent(feedback) {
        // This would integrate with analytics services like Google Analytics
        // For now, we'll just log to console
        console.log('Feedback submitted:', feedback);

        // Example Google Analytics event (if GA is loaded)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'feedback_submitted', {
                'event_category': 'user_feedback',
                'event_label': feedback.type,
                'value': feedback.rating || 1
            });
        }
    }

    getFeedbackSummary() {
        const summary = {
            totalFeedback: this.feedbackData.length,
            positiveCount: this.feedbackData.filter(f => f.type === 'positive').length,
            negativeCount: this.feedbackData.filter(f => f.type === 'negative').length,
            detailedCount: this.feedbackData.filter(f => f.type === 'detailed').length,
            averageRating: 0,
            commonImprovements: [],
            recommendationScore: 0
        };

        // Calculate average rating from detailed feedback
        const detailedFeedback = this.feedbackData.filter(f => f.type === 'detailed' && f.rating);
        if (detailedFeedback.length > 0) {
            summary.averageRating = detailedFeedback.reduce((sum, f) => sum + f.rating, 0) / detailedFeedback.length;
        }

        // Calculate recommendation score
        const recommendations = this.feedbackData.filter(f => f.recommend);
        if (recommendations.length > 0) {
            const scores = { 'definitely': 5, 'probably': 4, 'maybe': 3, 'probably-not': 2, 'definitely-not': 1 };
            summary.recommendationScore = recommendations.reduce((sum, f) => sum + (scores[f.recommend] || 0), 0) / recommendations.length;
        }

        return summary;
    }

    createFeedbackSummaryWidget() {
        const summary = this.getFeedbackSummary();
        
        return `
            <div class="feedback-summary">
                <h3>📊 User Feedback Summary</h3>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-value">${summary.totalFeedback}</span>
                        <span class="stat-label">Total Feedback</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${summary.averageRating.toFixed(1)}/5</span>
                        <span class="stat-label">Average Rating</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${Math.round((summary.positiveCount / Math.max(summary.totalFeedback, 1)) * 100)}%</span>
                        <span class="stat-label">Positive Feedback</span>
                    </div>
                </div>
            </div>
        `;
    }

    exportFeedbackData() {
        const dataStr = JSON.stringify(this.feedbackData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `resume_analyzer_feedback_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Global functions for feedback system
window.submitFeedback = function(suggestionId, type, context) {
    if (window.userFeedback) {
        window.userFeedback.submitFeedback(suggestionId, type, context);
    }
};

window.openFeedbackModal = function(suggestionId, context) {
    if (window.userFeedback) {
        window.userFeedback.openFeedbackModal(suggestionId, context);
    }
};

window.closeFeedbackModal = function() {
    if (window.userFeedback) {
        window.userFeedback.closeFeedbackModal();
    }
};

window.submitDetailedFeedback = function() {
    if (window.userFeedback) {
        window.userFeedback.submitDetailedFeedback();
    }
};