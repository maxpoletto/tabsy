chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'copy') {
        // The execCommand method is deprecated, but currently it seems to be the most
        // reliable way to copy to the clipboard under Manifest V3. (The modern
        // navigator.clipboard API requires focus.)
        try {
            const textarea = document.createElement('textarea');
            textarea.value = message.text;
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);

            if (success) {
                sendResponse({ success: true });
            } else {
                sendResponse({ error: 'Copy command failed' });
            }
        } catch (err) {
            sendResponse({ error: err.message });
        }
        return true;  // Keep message channel open for async response
    }
});
