export class AccessibilityManager {
    constructor() {
        this.focusableElements = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
        this.setupScreenReaderSupport();
        this.setupColorContrastMode();
        this.setupReducedMotionSupport();
    }

    setupKeyboardNavigation() {
        // Global keyboard event handler
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });

        // Tab navigation for custom components
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });

        // Escape key handling for modals and dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });
    }

    handleGlobalKeydown(e) {
        // Skip to main content (Alt + M)
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            this.skipToMainContent();
        }

        // Open accessibility menu (Alt + A)
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            this.openAccessibilityMenu();
        }

        // Toggle high contrast mode (Alt + C)
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            this.toggleHighContrast();
        }
    }

    handleTabNavigation(e) {
        const activeElement = document.activeElement;
        const focusableElements = document.querySelectorAll(this.focusableElements);
        const focusableArray = Array.from(focusableElements);
        const currentIndex = focusableArray.indexOf(activeElement);

        // Handle tab trapping in modals
        const modal = activeElement.closest('.modal-content');
        if (modal) {
            const modalFocusable = modal.querySelectorAll(this.focusableElements);
            const modalArray = Array.from(modalFocusable);
            const modalIndex = modalArray.indexOf(activeElement);

            if (e.shiftKey) {
                // Shift + Tab
                if (modalIndex === 0) {
                    e.preventDefault();
                    modalArray[modalArray.length - 1].focus();
                }
            } else {
                // Tab
                if (modalIndex === modalArray.length - 1) {
                    e.preventDefault();
                    modalArray[0].focus();
                }
            }
        }
    }

    handleEscapeKey(e) {
        // Close modals
        const openModal = document.querySelector('.modal[style*="display: block"]');
        if (openModal) {
            this.closeModal(openModal);
            return;
        }

        // Close dropdowns
        const openDropdown = document.querySelector('.dropdown.open');
        if (openDropdown) {
            this.closeDropdown(openDropdown);
            return;
        }

        // Clear focus from search inputs
        if (e.target.type === 'search' || e.target.classList.contains('search-input')) {
            e.target.blur();
        }
    }

    setupFocusManagement() {
        // Focus management for dynamic content
        this.setupFocusIndicators();
        this.setupFocusTrapping();
        this.setupFocusRestoration();
    }

    setupFocusIndicators() {
        // Enhanced focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 3px solid #4A90E2 !important;
                outline-offset: 2px !important;
            }
            
            .focus-visible:focus {
                box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3) !important;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                z-index: 10000;
                border-radius: 4px;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(style);

        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusTrapping() {
        // Focus trapping for modals and dialogs
        document.addEventListener('focusin', (e) => {
            const modal = document.querySelector('.modal[style*="display: block"]');
            if (modal && !modal.contains(e.target)) {
                const firstFocusable = modal.querySelector(this.focusableElements);
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        });
    }

    setupFocusRestoration() {
        // Store focus before opening modals/dialogs
        this.previousFocus = null;

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal-trigger]')) {
                this.previousFocus = e.target;
            }
        });
    }

    setupARIALabels() {
        // Add ARIA labels to interactive elements
        this.addARIALabelsToButtons();
        this.addARIALabelsToInputs();
        this.addARIALabelsToRegions();
        this.setupLiveRegions();
    }

    addARIALabelsToButtons() {
        // Add ARIA labels to buttons without text
        document.querySelectorAll('button').forEach(button => {
            if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
                const icon = button.querySelector('[class*="icon"], [class*="emoji"]');
                if (icon) {
                    const iconClass = icon.className;
                    let label = 'Button';
                    
                    if (iconClass.includes('close') || button.textContent.includes('×')) {
                        label = 'Close';
                    } else if (iconClass.includes('menu') || iconClass.includes('hamburger')) {
                        label = 'Menu';
                    } else if (iconClass.includes('search')) {
                        label = 'Search';
                    } else if (iconClass.includes('download')) {
                        label = 'Download';
                    } else if (iconClass.includes('upload')) {
                        label = 'Upload';
                    }
                    
                    button.setAttribute('aria-label', label);
                }
            }
        });
    }

    addARIALabelsToInputs() {
        // Ensure all inputs have proper labels
        document.querySelectorAll('input, textarea, select').forEach(input => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = input.closest('.form-group')?.querySelector('label');
                if (label && !label.getAttribute('for')) {
                    const id = input.id || `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    input.id = id;
                    label.setAttribute('for', id);
                }
            }
        });
    }

    addARIALabelsToRegions() {
        // Add landmark roles and labels
        const regions = [
            { selector: 'header', role: 'banner', label: 'Site header' },
            { selector: 'nav', role: 'navigation', label: 'Main navigation' },
            { selector: 'main', role: 'main', label: 'Main content' },
            { selector: 'aside', role: 'complementary', label: 'Sidebar' },
            { selector: 'footer', role: 'contentinfo', label: 'Site footer' }
        ];

        regions.forEach(region => {
            const elements = document.querySelectorAll(region.selector);
            elements.forEach(element => {
                if (!element.getAttribute('role')) {
                    element.setAttribute('role', region.role);
                }
                if (!element.getAttribute('aria-label')) {
                    element.setAttribute('aria-label', region.label);
                }
            });
        });

        // Add main content landmark if not exists
        if (!document.querySelector('main, [role="main"]')) {
            const mainContent = document.querySelector('.main, .main-content, #main-content');
            if (mainContent) {
                mainContent.setAttribute('role', 'main');
                mainContent.setAttribute('aria-label', 'Main content');
                mainContent.id = 'main-content';
            }
        }
    }

    setupLiveRegions() {
        // Create live regions for dynamic content announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);

        // Create assertive live region for urgent announcements
        const assertiveLiveRegion = document.createElement('div');
        assertiveLiveRegion.id = 'assertive-live-region';
        assertiveLiveRegion.setAttribute('aria-live', 'assertive');
        assertiveLiveRegion.setAttribute('aria-atomic', 'true');
        assertiveLiveRegion.style.cssText = liveRegion.style.cssText;
        document.body.appendChild(assertiveLiveRegion);
    }

    setupScreenReaderSupport() {
        // Add screen reader specific content
        this.addScreenReaderText();
        this.setupProgressAnnouncements();
        this.setupFormValidationAnnouncements();
    }

    addScreenReaderText() {
        // Add visually hidden text for screen readers
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
        `;
        document.head.appendChild(style);

        // Add screen reader text to score cards
        document.querySelectorAll('.score-card').forEach(card => {
            const value = card.querySelector('.score-value')?.textContent;
            const label = card.querySelector('.score-label')?.textContent;
            if (value && label) {
                const srText = document.createElement('span');
                srText.className = 'sr-only';
                srText.textContent = `${label}: ${value}`;
                card.appendChild(srText);
            }
        });
    }

    setupProgressAnnouncements() {
        // Announce progress updates to screen readers
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check for loading states
                    const loadingElements = mutation.target.querySelectorAll('.loading, .spinner');
                    loadingElements.forEach(element => {
                        if (!element.getAttribute('aria-label')) {
                            element.setAttribute('aria-label', 'Loading, please wait');
                            element.setAttribute('role', 'status');
                        }
                    });

                    // Check for progress bars
                    const progressBars = mutation.target.querySelectorAll('.progress-bar, [role="progressbar"]');
                    progressBars.forEach(bar => {
                        if (!bar.getAttribute('aria-label')) {
                            bar.setAttribute('aria-label', 'Progress indicator');
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupFormValidationAnnouncements() {
        // Announce form validation errors
        document.addEventListener('invalid', (e) => {
            const input = e.target;
            const errorMessage = input.validationMessage;
            
            // Create or update error message element
            let errorElement = input.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                input.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = errorMessage;
            input.setAttribute('aria-describedby', errorElement.id || 'error-' + input.id);
            
            // Announce to screen readers
            this.announceToScreenReader(errorMessage, 'assertive');
        });
    }

    setupColorContrastMode() {
        // High contrast mode toggle
        this.highContrastEnabled = localStorage.getItem('highContrast') === 'true';
        
        if (this.highContrastEnabled) {
            this.enableHighContrast();
        }
    }

    setupReducedMotionSupport() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.enableReducedMotion();
        }

        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                this.enableReducedMotion();
            } else {
                this.disableReducedMotion();
            }
        });
    }

    // Public methods
    announceToScreenReader(message, priority = 'polite') {
        const liveRegionId = priority === 'assertive' ? 'assertive-live-region' : 'live-region';
        const liveRegion = document.getElementById(liveRegionId);
        
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    skipToMainContent() {
        const mainContent = document.querySelector('main, [role="main"], #main-content');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView();
        }
    }

    toggleHighContrast() {
        this.highContrastEnabled = !this.highContrastEnabled;
        localStorage.setItem('highContrast', this.highContrastEnabled.toString());
        
        if (this.highContrastEnabled) {
            this.enableHighContrast();
        } else {
            this.disableHighContrast();
        }
    }

    enableHighContrast() {
        document.body.classList.add('high-contrast');
        this.announceToScreenReader('High contrast mode enabled');
    }

    disableHighContrast() {
        document.body.classList.remove('high-contrast');
        this.announceToScreenReader('High contrast mode disabled');
    }

    enableReducedMotion() {
        document.body.classList.add('reduced-motion');
        
        // Add CSS for reduced motion
        const style = document.createElement('style');
        style.id = 'reduced-motion-styles';
        style.textContent = `
            .reduced-motion *,
            .reduced-motion *::before,
            .reduced-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    disableReducedMotion() {
        document.body.classList.remove('reduced-motion');
        const style = document.getElementById('reduced-motion-styles');
        if (style) {
            style.remove();
        }
    }

    openAccessibilityMenu() {
        // Create accessibility menu if it doesn't exist
        let menu = document.getElementById('accessibility-menu');
        if (!menu) {
            menu = this.createAccessibilityMenu();
            document.body.appendChild(menu);
        }
        
        menu.style.display = 'block';
        menu.querySelector('button').focus();
    }

    createAccessibilityMenu() {
        const menu = document.createElement('div');
        menu.id = 'accessibility-menu';
        menu.className = 'accessibility-menu';
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-labelledby', 'accessibility-menu-title');
        
        menu.innerHTML = `
            <div class="menu-content">
                <h2 id="accessibility-menu-title">Accessibility Options</h2>
                <div class="menu-options">
                    <button onclick="accessibilityManager.toggleHighContrast()">
                        Toggle High Contrast
                    </button>
                    <button onclick="accessibilityManager.increaseFontSize()">
                        Increase Font Size
                    </button>
                    <button onclick="accessibilityManager.decreaseFontSize()">
                        Decrease Font Size
                    </button>
                    <button onclick="accessibilityManager.resetFontSize()">
                        Reset Font Size
                    </button>
                </div>
                <button class="close-menu" onclick="accessibilityManager.closeAccessibilityMenu()">
                    Close Menu
                </button>
            </div>
        `;
        
        return menu;
    }

    closeAccessibilityMenu() {
        const menu = document.getElementById('accessibility-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    }

    increaseFontSize() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = (currentSize * 1.1) + 'px';
        this.announceToScreenReader('Font size increased');
    }

    decreaseFontSize() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = (currentSize * 0.9) + 'px';
        this.announceToScreenReader('Font size decreased');
    }

    resetFontSize() {
        document.documentElement.style.fontSize = '';
        this.announceToScreenReader('Font size reset to default');
    }

    closeModal(modal) {
        modal.style.display = 'none';
        
        // Restore focus
        if (this.previousFocus) {
            this.previousFocus.focus();
            this.previousFocus = null;
        }
    }

    closeDropdown(dropdown) {
        dropdown.classList.remove('open');
    }
}

// Initialize accessibility manager
window.accessibilityManager = new AccessibilityManager();