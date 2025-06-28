// popup.js - ArchiveJump popup controls

document.addEventListener('DOMContentLoaded', function() {
    const enableToggle = document.getElementById('enableExtension');
    const autoSelectToggle = document.getElementById('autoSelectLatest');
    const searchButton = document.getElementById('searchCurrentPage');
    const status = document.getElementById('status');
    
    // Load saved settings
    chrome.storage.sync.get(['extensionEnabled', 'autoSelectLatest'], function(result) {
        enableToggle.checked = result.extensionEnabled !== false; // Default to true
        autoSelectToggle.checked = result.autoSelectLatest === true; // Default to false
        updateStatus();
    });
    
    // Save settings when enable toggle changes
    enableToggle.addEventListener('change', function() {
        const enabled = enableToggle.checked;
        chrome.storage.sync.set({extensionEnabled: enabled}, function() {
            updateStatus();
        });
        
        // Send message to content script about the change
        sendMessageToContentScript();
    });
    
    // Save settings when auto-select toggle changes
    autoSelectToggle.addEventListener('change', function() {
        const autoSelect = autoSelectToggle.checked;
        chrome.storage.sync.set({autoSelectLatest: autoSelect}, function() {
            updateStatus();
        });
        
        // Send message to content script about the change
        sendMessageToContentScript();
    });
    
    // Update status text based on current settings
    function updateStatus() {
        if (!enableToggle.checked) {
            status.textContent = 'Extension disabled';
        } else if (autoSelectToggle.checked) {
            status.textContent = 'Auto-jumping to latest archived versions';
        } else {
            status.textContent = 'Click links to search on Archive.ph';
        }
    }
    
    // Send current settings to content script
    function sendMessageToContentScript() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'updateSettings',
                enabled: enableToggle.checked,
                autoSelectLatest: autoSelectToggle.checked
            }).catch(() => {
                // Ignore errors if content script isn't loaded
            });
        });
    }
    
    // Search current page on archive.ph
    searchButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentUrl = tabs[0].url;
            
            if (autoSelectToggle.checked) {
                // Try to get the latest archive directly
                const archiveUrl = "https://archive.ph/newest/" + encodeURIComponent(currentUrl);
                chrome.tabs.create({url: archiveUrl});
            } else {
                // Go to search page
                const archiveSearchUrl = "https://archive.ph/search/?q=" + encodeURIComponent(currentUrl);
                chrome.tabs.create({url: archiveSearchUrl});
            }
            
            window.close();
        });
    });
});
