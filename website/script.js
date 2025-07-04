// Smooth scrolling for navigation links
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// FAQ toggle functionality (if we add collapsible FAQs later)
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', function() {
        // Add any interactive FAQ functionality here if needed
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .faq-item, .step');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Copy install command functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a brief success message
        const notification = document.createElement('div');
        notification.textContent = 'Copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            animation: slideInOut 2s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    });
}

// Add copy functionality to code blocks
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('code').forEach(codeBlock => {
        if (codeBlock.textContent.includes('chrome://')) {
            codeBlock.style.cursor = 'pointer';
            codeBlock.title = 'Click to copy';
            codeBlock.addEventListener('click', () => {
                copyToClipboard(codeBlock.textContent);
            });
        }
    });
});

// Browser mockup interaction
document.addEventListener('DOMContentLoaded', () => {
    const mockup = document.querySelector('.browser-mockup');
    const popup = document.querySelector('.archivejump-popup');
    
    if (mockup && popup) {
        // Add some interactive hover effects
        mockup.addEventListener('mouseenter', () => {
            popup.style.transform = 'scale(1.05)';
            popup.style.transition = 'transform 0.3s ease';
        });
        
        mockup.addEventListener('mouseleave', () => {
            popup.style.transform = 'scale(1)';
        });
    }
});

// Add download tracking (optional - for analytics later)
document.querySelectorAll('a[href*="github"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track download clicks if needed
        console.log('GitHub link clicked:', link.href);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or dropdowns
        document.querySelectorAll('details[open]').forEach(details => {
            details.removeAttribute('open');
        });
    }
});

// Performance optimization: Lazy load images when we add them
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Mobile menu toggle (if we add mobile menu later)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInOut {
        0% { opacity: 0; transform: translateX(100%); }
        15% { opacity: 1; transform: translateX(0); }
        85% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(100%); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// Dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add a nice transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = 'light';
            themeToggle.setAttribute('aria-label', 'switch to light mode');
        } else {
            themeIcon.textContent = 'dark';
            themeToggle.setAttribute('aria-label', 'switch to dark mode');
        }
    }
});
