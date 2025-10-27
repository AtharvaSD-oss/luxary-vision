// Global variables for animations and state
let isCounterAnimated = false;
let scrollTimeout = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCounter();
    initializeTabs();
    initializeScrollAnimations();
    initializeFeatureTabs();
});

// Counter Animation
function initializeCounter() {
    const counter = document.getElementById('counter');
    if (!counter) return;
    
    // Start counter animation after a short delay
    setTimeout(() => {
        animateCounter();
    }, 800);
}

function animateCounter() {
    if (isCounterAnimated) return;
    
    const counter = document.getElementById('counter');
    const target = 100;
    const duration = 2000;
    const start = Date.now();
    const startValue = 0;
    
    function updateCounter() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutCubic);
        
        counter.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target;
            isCounterAnimated = true;
        }
    }
    
    updateCounter();
}

// Scroll-triggered animations using Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Special handling for staggered animations
                if (entry.target.classList.contains('feature-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.feature-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 150);
                }
                
                // Animate timeline steps
                if (entry.target.classList.contains('design-process')) {
                    const steps = entry.target.querySelectorAll('.timeline-step');
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            step.style.animationPlayState = 'running';
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-reveal attribute
    const elementsToReveal = document.querySelectorAll('[data-reveal]');
    elementsToReveal.forEach(el => observer.observe(el));
    
    // Observe feature cards separately for staggered animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => observer.observe(card));
}

// Tab functionality for Design Philosophy section
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Feature tabs for Interior section
function initializeFeatureTabs() {
    const featureTabs = document.querySelectorAll('.feature-tab');
    const featurePanels = document.querySelectorAll('.feature-panel');
    
    featureTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetFeature = tab.getAttribute('data-feature');
            
            // Remove active class from all tabs and panels
            featureTabs.forEach(t => t.classList.remove('active'));
            featurePanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            const targetPanel = document.getElementById(targetFeature);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Parallax effect for hero section
function initializeParallax() {
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroSection || !heroContent) return;
    
    function handleScroll() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrolled < heroHeight) {
                const translateY = scrolled * 0.5;
                const opacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.5);
                
                heroContent.style.transform = `translate3d(0, ${translateY}px, 0)`;
                heroContent.style.opacity = opacity;
            }
        });
    }
    
    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Additional animations and interactions
function initializeAnimations() {
    // Initialize parallax
    initializeParallax();
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effects to interactive elements
    initializeHoverEffects();
    
    // Initialize CTA button interaction
    initializeCTAButton();
}

// Hover effects for cards and buttons
function initializeHoverEffects() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('revealed')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// CTA button functionality
function initializeCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Add a subtle click animation
            this.style.transform = 'translateY(-3px) scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1)';
            }, 150);
            
            // Simulate navigation or show message
            console.log('Discover More clicked - Navigate to detailed page');
            
            // You could add actual navigation here:
            // window.open('https://your-detailed-page.com', '_blank');
        });
    }
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Performance optimization: Debounce scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

// Initialize smooth scroll behavior for better UX
function initializeSmoothScroll() {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80; // Adjust based on fixed header height if any
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle window resize for responsive animations
function handleResize() {
    // Recalculate animations on window resize
    const debouncedResize = debounce(() => {
        // Re-initialize animations that depend on viewport size
        initializeParallax();
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
}

// Initialize resize handlers
document.addEventListener('DOMContentLoaded', handleResize);

// Export functions for potential external use
window.DesignShowcase = {
    scrollToTop,
    animateCounter,
    isInViewport
};