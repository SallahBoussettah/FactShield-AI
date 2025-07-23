// Content script for FactShield AI extension
// This script runs in the context of web pages and handles content analysis

// Global variables
let isAnalyzing = false;
let highlightedElements = [];

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

// Function to analyze the entire page
async function analyzePage() {
  if (isAnalyzing) {
    return;
  }

  isAnalyzing = true;
  showAnalysisIndicator();

  try {
    // Extract main content from the page
    const content = extractPageContent();

    // Send content to background script for analysis
    chrome.runtime.sendMessage({
      action: 'analyzeContent',
      content
    });
  } catch (error) {
    isAnalyzing = false;
    hideAnalysisIndicator();
    throw error;
  }
}

// Function to analyze selected text
async function analyzeSelection() {
  if (isAnalyzing) {
    return { status: 'analyzing' };
  }

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText) {
    return { status: 'noSelection' };
  }

  isAnalyzing = true;
  showAnalysisIndicator();

  try {
    // Send selected text to background script for analysis
    chrome.runtime.sendMessage({
      action: 'analyzeContent',
      content: selectedText
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
  // Simple content extraction strategy
  // This could be improved with more sophisticated algorithms

  // Try to find main content containers
  const contentSelectors = [
    'article',
    'main',
    '.content',
    '.article',
    '.post',
    '#content',
    '#main'
  ];

  let content = '';

  // Try each selector
  for (const selector of contentSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      for (const element of elements) {
        content += element.innerText + ' ';
      }
      break;
    }
  }

  // If no content found with selectors, use body text
  if (!content.trim()) {
    content = document.body.innerText;
  }

  return content.trim();
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

// Function to highlight claims in the page
function highlightClaims(claims) {
  // Get all text nodes in the document
  const textNodes = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    // Skip empty nodes and nodes in script/style tags
    if (
      node.nodeValue.trim() !== '' &&
      !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentNode.nodeName)
    ) {
      textNodes.push(node);
    }
  }

  // For each claim, find and highlight occurrences in text nodes
  claims.forEach(claim => {
    const claimText = claim.text;
    if (!claimText) return;

    textNodes.forEach(textNode => {
      const nodeText = textNode.nodeValue;
      const index = nodeText.indexOf(claimText);

      if (index >= 0) {
        // Split the text node and insert a highlight
        const before = nodeText.substring(0, index);
        const after = nodeText.substring(index + claimText.length);

        const span = document.createElement('span');
        span.className = 'factshield-highlight';
        span.textContent = claimText;
        span.dataset.claimId = claim.id;
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
        }

        // Add click event to show details
        span.addEventListener('click', () => {
          showClaimDetails(claim);
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
      }
    });
  });
}

// Function to show claim details
function showClaimDetails(claim) {
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

  if (claim.credibilityScore !== undefined) {
    if (claim.credibilityScore < 0.3) {
      credibilityClass = 'low';
      credibilityText = 'Low Credibility';
    } else if (claim.credibilityScore < 0.7) {
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
      sourcesHtml += `<li><a href="${source.url}" target="_blank">${source.title || source.url}</a></li>`;
    });
    sourcesHtml += '</ul>';
  }

  popup.innerHTML = `
    <div class="factshield-popup-header">
      <h2>FactShield AI Analysis</h2>
      <button class="factshield-close-btn">&times;</button>
    </div>
    <div class="factshield-popup-content">
      <div class="factshield-claim">
        <p>${claim.text}</p>
      </div>
      <div class="factshield-credibility factshield-credibility-${credibilityClass}">
        ${credibilityText}
      </div>
      ${sourcesHtml}
    </div>
    <div class="factshield-popup-footer">
      <a href="http://localhost:5173" target="_blank">Powered by FactShield AI</a>
    </div>
  `;

  // Add close button functionality
  popup.querySelector('.factshield-close-btn').addEventListener('click', () => {
    popup.remove();
  });

  // Add popup to page
  document.body.appendChild(popup);

  // Position popup near the mouse
  const mouseX = window.event ? window.event.clientX : 200;
  const mouseY = window.event ? window.event.clientY : 200;

  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let left = mouseX + 10;
  let top = mouseY + 10;

  // Adjust position if popup would go off screen
  if (left + popupWidth > windowWidth) {
    left = windowWidth - popupWidth - 10;
  }

  if (top + popupHeight > windowHeight) {
    top = windowHeight - popupHeight - 10;
  }

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
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