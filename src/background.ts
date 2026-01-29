/// <reference types="chrome" />

// Listen for extension icon click
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'index.html' });
});
