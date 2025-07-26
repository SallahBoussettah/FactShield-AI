// Content script for FactShield AI extension
// This script runs in the context of web pages and handles content analysis

// Add extension detection marker for web app integration
document.documentElement.setAttribute('data-factshield-extension', 'installed');
window.factshieldExtension = {
  version: '1.0.0',
  installed: true
};

// Global variables
let isAnalyzing = false;
let highlightedElements = [];
let analysisThrottle = null;
let lastAnalysisTime = 0;
let contentObserver = null;

// Throttling configuration
const THROTTLE_DELAY = 2000; // 2 seconds between analyses
const CONTENT_CHANGE_DELAY = 1000; // 1 second delay after content changes

// Listen for messages from popup and background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyzePage') {
    analyzePage()
      .then(() => sendResponse({ status: 'analyzing' }))
      .catch(error => {
        console.error('Error analyzing page:', error);
        sendResponse({ status: 'error', message: error.message });
      });
    return true; // Required for async response
  }

  if (message.action === 'analyzeSelection') {
    analyzeSelection()
      .then(status => sendResponse(status))
      .catch(error => {
        console.error('Error analyzing selection:', error);
        sendResponse({ status: 'error', message: error.message });
      });
    return true; // Required for async response
  }

  if (message.action === 'analysisResults') {
    handleAnalysisResults(message.results);
    sendResponse({ status: 'received' });
    return true;
  }
});

// Function to analyze the entire page with throttling
async function analyzePage() {
  const now = Date.now();
  
  // Check if we're already analyzing or if we need to throttle
  if (isAnalyzing || (now - lastAnalysisTime) < THROTTLE_DELAY) {
    return;
  }

  isAnalyzing = true;
  lastAnalysisTime = now;
  showAnalysisIndicator();

  try {
    // Extract main content from the page
    const content = extractPageContent();

    // Only analyze if we have substantial content
    if (content.length < 100) {
      isAnalyzing = false;
      hideAnalysisIndicator();
      return;
    }

    // Send content to background script for analysis
    chrome.runtime.sendMessage({
      action: 'analyzeContent',
      content,
      url: window.location.href,
      timestamp: now
    });
  } catch (error) {
    isAnalyzing = false;
    hideAnalysisIndicator();
    throw error;
  }
}

// Throttled version of analyzePage for automatic content analysis
function throttledAnalyzePage() {
  if (analysisThrottle) {
    clearTimeout(analysisThrottle);
  }
  
  analysisThrottle = setTimeout(() => {
    analyzePage();
  }, CONTENT_CHANGE_DELAY);
}

// Function to analyze selected text
async function analyzeSelection() {
  const now = Date.now();
  
  if (isAnalyzing || (now - lastAnalysisTime) < THROTTLE_DELAY) {
    return { status: 'throttled' };
  }

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText) {
    return { status: 'noSelection' };
  }

  if (selectedText.length < 20) {
    return { status: 'tooShort' };
  }

  isAnalyzing = true;
  lastAnalysisTime = now;
  showAnalysisIndicator();

  try {
    // Send selected text to background script for analysis
    chrome.runtime.sendMessage({
      action: 'analyzeContent',
      content: selectedText,
      url: window.location.href,
      timestamp: now,
      isSelection: true
    });

    return { status: 'analyzing' };
  } catch (error) {
    isAnalyzing = false;
    hideAnalysisIndicator();
    throw error;
  }
}

// Function to extract main content from the page
function extractPageContent() {
  // Enhanced content extraction strategy
  const contentSelectors = [
    'article',
    'main',
    '[role="main"]',
    '.content',
    '.article',
    '.post',
    '.entry-content',
    '.post-content',
    '#content',
    '#main',
    '.story-body',
    '.article-body'
  ];

  let content = '';
  let foundContent = false;

  // Try each selector in order of preference
  for (const selector of contentSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      for (const element of elements) {
        // Skip elements that are likely navigation or ads
        if (isContentElement(element)) {
          content += cleanText(element.innerText) + ' ';
          foundContent = true;
        }
      }
      if (foundContent) break;
    }
  }

  // If no content found with selectors, extract from paragraphs
  if (!content.trim()) {
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (isContentElement(p) && p.innerText.trim().length > 50) {
        content += cleanText(p.innerText) + ' ';
      }
    });
  }

  // Last resort: use body text but filter out navigation and ads
  if (!content.trim()) {
    content = cleanText(document.body.innerText);
  }

  return content.trim();
}

// Helper function to determine if an element contains actual content
function isContentElement(element) {
  // Skip elements that are likely not content
  const skipClasses = [
    'nav', 'navigation', 'menu', 'sidebar', 'footer', 'header',
    'ad', 'advertisement', 'banner', 'popup', 'modal',
    'comment', 'comments', 'social', 'share', 'related'
  ];

  const className = element.className.toLowerCase();
  const id = element.id.toLowerCase();

  for (const skipClass of skipClasses) {
    if (className.includes(skipClass) || id.includes(skipClass)) {
      return false;
    }
  }

  // Check if element has substantial text content
  const textLength = element.innerText.trim().length;
  return textLength > 20;
}

// Helper function to clean extracted text
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
}

// Function to handle analysis results
function handleAnalysisResults(results) {
  isAnalyzing = false;
  hideAnalysisIndicator();

  if (!results || results.error) {
    showNotification('Error analyzing content', 'error');
    return;
  }

  // Clear previous highlights
  clearHighlights();

  // Process claims if available
  if (results.claims && results.claims.length > 0) {
    highlightClaims(results.claims);
    showNotification(`Found ${results.claims.length} claims to verify`, 'info');
  } else {
    showNotification('No claims found to verify', 'info');
  }
}

// Function to highlight claims in the page with improved performance
function highlightClaims(claims) {
  if (!claims || claims.length === 0) return;

  // Get content elements to search within
  const contentElements = getContentElements();
  
  // Process claims in batches to avoid blocking the UI
  const batchSize = 5;
  let claimIndex = 0;

  function processBatch() {
    const endIndex = Math.min(claimIndex + batchSize, claims.length);
    
    for (let i = claimIndex; i < endIndex; i++) {
      const claim = claims[i];
      if (claim.text && claim.text.length > 10) {
        highlightClaimInElements(claim, contentElements);
      }
    }
    
    claimIndex = endIndex;
    
    // Continue processing if there are more claims
    if (claimIndex < claims.length) {
      requestAnimationFrame(processBatch);
    }
  }
  
  // Start processing
  requestAnimationFrame(processBatch);
}

// Get elements that likely contain content
function getContentElements() {
  const contentSelectors = [
    'article', 'main', '[role="main"]', '.content', '.article', 
    '.post', '.entry-content', '.post-content', 'p', 'div'
  ];
  
  const elements = [];
  contentSelectors.forEach(selector => {
    const found = document.querySelectorAll(selector);
    found.forEach(el => {
      if (isContentElement(el) && !elements.includes(el)) {
        elements.push(el);
      }
    });
  });
  
  return elements.length > 0 ? elements : [document.body];
}

// Highlight a specific claim within given elements
function highlightClaimInElements(claim, elements) {
  const claimText = claim.text.trim();
  if (!claimText) return;

  elements.forEach(element => {
    // Skip if element already contains highlights to avoid nested highlights
    if (element.querySelector('.factshield-highlight')) return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip nodes in script/style tags and already highlighted content
          const parent = node.parentNode;
          if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.nodeName) ||
              parent.classList.contains('factshield-highlight')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.trim() !== '') {
        textNodes.push(node);
      }
    }

    // Find and highlight the claim text
    textNodes.forEach(textNode => {
      const nodeText = textNode.nodeValue;
      const lowerNodeText = nodeText.toLowerCase();
      const lowerClaimText = claimText.toLowerCase();
      const index = lowerNodeText.indexOf(lowerClaimText);

      if (index >= 0) {
        highlightTextInNode(textNode, index, claimText.length, claim);
      }
    });
  });
}

// Highlight text within a specific text node
function highlightTextInNode(textNode, startIndex, length, claim) {
  try {
    const nodeText = textNode.nodeValue;
    const before = nodeText.substring(0, startIndex);
    const highlightText = nodeText.substring(startIndex, startIndex + length);
    const after = nodeText.substring(startIndex + length);

    const span = document.createElement('span');
    span.className = 'factshield-highlight';
    span.textContent = highlightText;
    span.dataset.claimId = claim.id || Math.random().toString(36).substr(2, 9);
    span.dataset.credibilityScore = claim.credibilityScore || 'unknown';

    // Set highlight color based on credibility score
    if (claim.credibilityScore !== undefined) {
      if (claim.credibilityScore < 0.3) {
        span.classList.add('factshield-low-credibility');
      } else if (claim.credibilityScore < 0.7) {
        span.classList.add('factshield-medium-credibility');
      } else {
        span.classList.add('factshield-high-credibility');
      }
    } else {
      span.classList.add('factshield-medium-credibility'); // Default to medium
    }

    // Add click event to show details
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showClaimDetails(claim, e);
    });

    // Add hover effect
    span.addEventListener('mouseenter', () => {
      span.style.opacity = '0.8';
    });
    
    span.addEventListener('mouseleave', () => {
      span.style.opacity = '1';
    });

    // Replace the text node with the new elements
    const fragment = document.createDocumentFragment();
    if (before) {
      fragment.appendChild(document.createTextNode(before));
    }
    fragment.appendChild(span);
    if (after) {
      fragment.appendChild(document.createTextNode(after));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
    highlightedElements.push(span);
  } catch (error) {
    console.warn('Error highlighting text:', error);
  }
}

// Function to show claim details
function showClaimDetails(claim, event) {
  // Remove existing detail popup if any
  const existingPopup = document.getElementById('factshield-detail-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create popup element
  const popup = document.createElement('div');
  popup.id = 'factshield-detail-popup';
  popup.className = 'factshield-popup';

  // Create popup content
  let credibilityClass = 'unknown';
  let credibilityText = 'Unknown';
  let credibilityScore = '';

  if (claim.credibilityScore !== undefined) {
    const score = parseFloat(claim.credibilityScore);
    credibilityScore = ` (${Math.round(score * 100)}%)`;
    
    if (score < 0.3) {
      credibilityClass = 'low';
      credibilityText = 'Low Credibility';
    } else if (score < 0.7) {
      credibilityClass = 'medium';
      credibilityText = 'Medium Credibility';
    } else {
      credibilityClass = 'high';
      credibilityText = 'High Credibility';
    }
  }

  // Build sources HTML if available
  let sourcesHtml = '';
  if (claim.sources && claim.sources.length > 0) {
    sourcesHtml = '<h3>Sources:</h3><ul>';
    claim.sources.forEach(source => {
      const title = source.title || source.url;
      const reliability = source.reliability ? ` (${Math.round(source.reliability * 100)}% reliable)` : '';
      sourcesHtml += `<li><a href="${source.url}" target="_blank" rel="noopener">${title}</a>${reliability}</li>`;
    });
    sourcesHtml += '</ul>';
  }

  // Escape HTML in claim text
  const claimText = claim.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  popup.innerHTML = `
    <div class="factshield-popup-header">
      <h2>FactShield AI Analysis</h2>
      <button class="factshield-close-btn" aria-label="Close">&times;</button>
    </div>
    <div class="factshield-popup-content">
      <div class="factshield-claim">
        <p><strong>Claim:</strong> "${claimText}"</p>
      </div>
      <div class="factshield-credibility factshield-credibility-${credibilityClass}">
        ${credibilityText}${credibilityScore}
      </div>
      ${sourcesHtml}
    </div>
    <div class="factshield-popup-footer">
      <a href="http://localhost:5173" target="_blank" rel="noopener">Powered by FactShield AI</a>
    </div>
  `;

  // Add close button functionality
  popup.querySelector('.factshield-close-btn').addEventListener('click', () => {
    popup.remove();
  });

  // Close popup when clicking outside
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  // Add popup to page
  document.body.appendChild(popup);

  // Position popup near the click event or use default position
  let mouseX = 200;
  let mouseY = 200;
  
  if (event && event.clientX !== undefined) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  // Wait for popup to be rendered to get accurate dimensions
  requestAnimationFrame(() => {
    const popupRect = popup.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = mouseX + 10;
    let top = mouseY + 10;

    // Adjust position if popup would go off screen
    if (left + popupRect.width > windowWidth) {
      left = Math.max(10, windowWidth - popupRect.width - 10);
    }

    if (top + popupRect.height > windowHeight) {
      top = Math.max(10, windowHeight - popupRect.height - 10);
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  });
}

// Function to clear highlights
function clearHighlights() {
  highlightedElements.forEach(element => {
    if (element.parentNode) {
      // Get the text content
      const text = element.textContent;
      // Create a text node
      const textNode = document.createTextNode(text);
      // Replace the highlight with the text node
      element.parentNode.replaceChild(textNode, element);
    }
  });

  highlightedElements = [];
}

// Function to show analysis indicator
function showAnalysisIndicator() {
  // Remove existing indicator if any
  const existingIndicator = document.getElementById('factshield-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }

  // Create indicator element
  const indicator = document.createElement('div');
  indicator.id = 'factshield-indicator';
  indicator.className = 'factshield-indicator';
  indicator.innerHTML = `
    <div class="factshield-indicator-content">
      <div class="factshield-spinner"></div>
      <p>FactShield AI is analyzing this content...</p>
    </div>
  `;

  // Add indicator to page
  document.body.appendChild(indicator);
}

// Function to hide analysis indicator
function hideAnalysisIndicator() {
  const indicator = document.getElementById('factshield-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// Function to show notification
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.getElementById('factshield-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'factshield-notification';
  notification.className = `factshield-notification factshield-notification-${type}`;
  notification.innerHTML = `
    <div class="factshield-notification-content">
      <p>${message}</p>
    </div>
  `;

  // Add notification to page
  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Function to initialize content monitoring
function initializeContentMonitoring() {
  // Monitor for dynamic content changes
  if (contentObserver) {
    contentObserver.disconnect();
  }

  contentObserver = new MutationObserver((mutations) => {
    let shouldAnalyze = false;
    
    mutations.forEach((mutation) => {
      // Check if significant content was added
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent || '';
            // Only trigger analysis for substantial content additions
            if (text.length > 100) {
              shouldAnalyze = true;
            }
          }
        });
      }
    });
    
    if (shouldAnalyze) {
      throttledAnalyzePage();
    }
  });

  // Start observing
  contentObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: false
  });
}

// Function to check if page should be analyzed automatically
function shouldAnalyzePageAutomatically() {
  // Skip certain domains or page types
  const skipDomains = ['chrome://', 'chrome-extension://', 'moz-extension://'];
  const currentUrl = window.location.href;
  
  for (const domain of skipDomains) {
    if (currentUrl.startsWith(domain)) {
      return false;
    }
  }
  
  // Skip if page has very little content
  const content = extractPageContent();
  return content.length > 200;
}

// Initialize the content script
function initialize() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
    return;
  }

  // Initialize content monitoring
  initializeContentMonitoring();

  // Analyze page automatically if it has substantial content
  setTimeout(() => {
    if (shouldAnalyzePageAutomatically()) {
      throttledAnalyzePage();
    }
  }, 1000); // Wait 1 second after page load
}

// Start initialization
initialize();