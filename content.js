// content.js - ArchiveJump: Smart archive redirection for news articles

// List of supported sites that commonly have paywalls
const SUPPORTED_SITES = [
    'newyorker.com',
    'theatlantic.com',
    'washingtonpost.com',
    'nytimes.com',
    'wsj.com',
    'ft.com',
    'economist.com',
    'bloomberg.com',
    'reuters.com',
    'theguardian.com',
    'cnn.com',
    'bbc.com',
    'npr.org',
    'politico.com',
    'slate.com',
    'vox.com',
    'buzzfeed.com',
    'huffpost.com',
    'medium.com'
];

let extensionEnabled = true;
let autoSelectLatest = false;

// Load extension settings
chrome.storage.sync.get(['extensionEnabled', 'autoSelectLatest'], function(result) {
    extensionEnabled = result.extensionEnabled !== false; // Default to true
    autoSelectLatest = result.autoSelectLatest === true; // Default to false
});

// Listen for messages from popup and background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateSettings') {
        extensionEnabled = request.enabled;
        autoSelectLatest = request.autoSelectLatest;
    }
    // Legacy support for old message format
    else if (request.action === 'toggleExtension') {
        extensionEnabled = request.enabled;
    }
    // Handle context menu archive requests
    else if (request.action === 'archiveUrl') {
        archiveUrlFromContextMenu(request.url, request.autoSelectLatest);
    }
});

// Check if a URL belongs to a supported site
function isSupportedSite(url) {
    try {
        const hostname = new URL(url).hostname.toLowerCase();
        return SUPPORTED_SITES.some(site => hostname.includes(site));
    } catch (e) {
        return false;
    }
}

// Main click handler
document.addEventListener('click', function (e) {
    // Only proceed if extension is enabled
    if (!extensionEnabled) {
        return;
    }
    
    const link = e.target.closest('a');
    
    if (link && link.href) {
        const url = link.href;
        
        // Check if it's a supported site and not already an archive.ph link
        if (isSupportedSite(url) && !url.includes("archive.ph")) {
            // Check if the link looks like an article (not homepage, category pages, etc.)
            if (isLikelyArticleLink(url)) {
                e.preventDefault();
                e.stopPropagation();
                
                // Visual feedback
                showRedirectNotification(link, autoSelectLatest);
                
                if (autoSelectLatest) {
                    // Try to get the latest archive directly
                    const archiveUrl = "https://archive.ph/newest/" + encodeURIComponent(url);
                    window.open(archiveUrl, '_blank');
                } else {
                    // Go to archive search page
                    const archiveSearchUrl = "https://archive.ph/search/?q=" + encodeURIComponent(url);
                    window.open(archiveSearchUrl, '_blank');
                }
            }
        }
    }
});

// Check if a URL looks like an article link
function isLikelyArticleLink(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname.toLowerCase();
        
        // Skip obvious non-article pages
        const skipPatterns = [
            '/',
            '/home',
            '/index',
            '/category',
            '/tag',
            '/author',
            '/search',
            '/login',
            '/subscribe',
            '/newsletter',
            '/podcast',
            '/video',
            '/photos',
            '/gallery'
        ];
        
        // If pathname exactly matches skip patterns, skip it
        if (skipPatterns.some(pattern => pathname === pattern || pathname === pattern + '/')) {
            return false;
        }
        
        // If pathname is very short (likely homepage or category), skip it
        if (pathname.length < 10) {
            return false;
        }
        
        // If it contains typical article indicators, include it
        const articleIndicators = [
            '/article',
            '/story',
            '/news',
            '/opinion',
            '/analysis',
            '/feature',
            '/review',
            '/interview',
            '/report'
        ];
        
        if (articleIndicators.some(indicator => pathname.includes(indicator))) {
            return true;
        }
        
        // For most sites, if the path has multiple segments and reasonable length, 
        // it's probably an article
        const segments = pathname.split('/').filter(s => s.length > 0);
        return segments.length >= 2 && pathname.length > 15;
        
    } catch (e) {
        return false;
    }
}

// Show visual feedback when a link is redirected
function showRedirectNotification(link, isAutoSelect = false) {
    // Create a small notification
    const notification = document.createElement('div');
    notification.textContent = isAutoSelect ? 
        'Jumping to latest archive...' : 
        'Searching Archive.ph...';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isAutoSelect ? '#4caf50' : '#1a73e8'};
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2700);
    
    // Also add a subtle highlight to the clicked link
    const originalBg = link.style.backgroundColor;
    link.style.backgroundColor = isAutoSelect ? '#e8f5e8' : '#e3f2fd';
    link.style.transition = 'background-color 0.3s ease';
    
    setTimeout(() => {
        link.style.backgroundColor = originalBg;
    }, 1000);
}

// Archive a URL from context menu
function archiveUrlFromContextMenu(url, autoSelectLatest) {
    console.log('ArchiveJump: Archiving URL from context menu:', url);
    
    // Show notification
    showArchiveNotification(autoSelectLatest);
    
    // Check if we need to fallback to Wayback Machine
    if (autoSelectLatest) {
        // Try Archive.ph first, then check if we need Wayback fallback
        const archiveUrl = "https://archive.ph/newest/" + encodeURIComponent(url);
        
        // Open archive in new tab via background script
        chrome.runtime.sendMessage({
            action: 'openArchive',
            url: archiveUrl
        });
        
        // Check for Archive.ph results after a delay and potentially fallback
        setTimeout(() => {
            checkAndFallbackToWayback(url);
        }, 3000);
    } else {
        // Go to archive search page
        const archiveSearchUrl = "https://archive.ph/search/?q=" + encodeURIComponent(url);
        chrome.runtime.sendMessage({
            action: 'openArchive',
            url: archiveSearchUrl
        });
    }
}

// Show notification for context menu actions
function showArchiveNotification(isAutoSelect = false) {
    const notification = document.createElement('div');
    notification.textContent = isAutoSelect ? 
        'Jumping to latest archive...' : 
        'Searching Archive.ph...';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isAutoSelect ? '#4caf50' : '#1a73e8'};
        color: white;
        padding: 12px 18px;
        border-radius: 8px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transition: opacity 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2700);
}

// Check if Archive.ph has results, fallback to Wayback if needed
function checkAndFallbackToWayback(originalUrl) {
    // This is a simplified check - in a real implementation you might
    // want to check the actual content of the archive page
    // For now, we'll implement a basic fallback mechanism
    console.log('ArchiveJump: Checking for potential Wayback fallback for:', originalUrl);
}
