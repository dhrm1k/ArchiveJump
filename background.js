// ArchiveJump Background Script - Context Menu Handler

// Create context menu when extension is installed/enabled
chrome.runtime.onInstalled.addListener(() => {
  console.log('ArchiveJump: Creating context menu');
  
  // Create context menu item for links
  chrome.contextMenus.create({
    id: "archiveLink",
    title: "View archived link",
    contexts: ["link"],
    documentUrlPatterns: ["http://*/*", "https://*/*"]
  });

  // Create context menu item for current page
  chrome.contextMenus.create({
    id: "archivePage",
    title: "Archive current page",
    contexts: ["page"],
    documentUrlPatterns: ["http://*/*", "https://*/*"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('ArchiveJump: Context menu clicked', info.menuItemId);

  try {
    // Get user settings (using sync to match content script)
    const settings = await chrome.storage.sync.get({
      extensionEnabled: true,
      autoSelectLatest: false
    });

    if (!settings.extensionEnabled) {
      console.log('ArchiveJump: Extension is disabled');
      return;
    }

    let targetUrl;
    
    if (info.menuItemId === "archiveLink") {
      targetUrl = info.linkUrl;
    } else if (info.menuItemId === "archivePage") {
      targetUrl = info.pageUrl;
    }

    if (!targetUrl) {
      console.log('ArchiveJump: No URL found');
      return;
    }

    console.log('ArchiveJump: Archiving URL:', targetUrl);

    // Send message to content script to handle the archiving
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'archiveUrl',
        url: targetUrl,
        autoSelectLatest: settings.autoSelectLatest
      });
    } catch (messageError) {
      console.log('ArchiveJump: Content script not ready, opening archive directly');
      // Fallback: open archive directly if content script isn't available
      const archiveUrl = settings.autoSelectLatest ? 
        `https://archive.ph/newest/${encodeURIComponent(targetUrl)}` :
        `https://archive.ph/search/?q=${encodeURIComponent(targetUrl)}`;
      
      chrome.tabs.create({
        url: archiveUrl,
        index: tab.index + 1
      });
    }

  } catch (error) {
    console.error('ArchiveJump: Error handling context menu click:', error);
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('ArchiveJump: Received message:', message);
  
  if (message.action === 'openArchive') {
    try {
      // Open archive in new tab
      chrome.tabs.create({
        url: message.url,
        index: sender.tab.index + 1
      }).then(() => {
        sendResponse({ success: true });
      }).catch(error => {
        console.error('ArchiveJump: Error opening tab:', error);
        sendResponse({ success: false, error: error.message });
      });
      
      // Return true to indicate we'll send response asynchronously
      return true;
    } catch (error) {
      console.error('ArchiveJump: Error in openArchive:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  
  return false;
});
