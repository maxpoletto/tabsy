const b = typeof browser !== 'undefined' ? browser : chrome;

async function copyText(text) {
    if (typeof browser !== 'undefined') {
        await navigator.clipboard.writeText(text);
    } else {
        const tab = await chrome.tabs.create({
            url: 'copy.html',
            active: false
        });

        try {
            // Wait for page to load
            await new Promise(resolve => setTimeout(resolve, 100));

            const response = await chrome.tabs.sendMessage(tab.id, {
                type: 'copy',
                text: text
            });
            if (response.error) throw new Error(response.error);
        } finally {
            await chrome.tabs.remove(tab.id);
        }
    }
}

async function handleAction(format = 'html') {
    try {
        const tabs = await b.tabs.query({ currentWindow: true });
        const links = tabs.map(tab =>
            format === 'markdown' ?
                `[${tab.title}](${tab.url})` :
                `<a href="${tab.url}">${tab.title}</a>`
        ).join('\n') + '\n';

        await copyText(links);
    } catch (err) {
        console.error('Failed to copy tabs:', err);
        b.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Tab Link Copier Error',
            message: 'Failed to copy tabs to clipboard'
        });
    }
}

// Create context menu items
b.runtime.onInstalled.addListener(() => {
    b.contextMenus.create({
        id: "copy-html",
        title: "Copy as HTML",
        contexts: ["action"]
    });
    b.contextMenus.create({
        id: "copy-markdown",
        title: "Copy as Markdown",
        contexts: ["action"]
    });
});

// Handle context menu clicks
b.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "copy-html") {
        handleAction('html');
    } else if (info.menuItemId === "copy-markdown") {
        handleAction('markdown');
    }
});

// Handle icon clicks
b.action.onClicked.addListener(() => handleAction('html'));
