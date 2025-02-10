const b = browser || chrome;

b.contextMenus.create({
    id: "copy-html",
    title: "Copy as HTML",
    contexts: ["browser_action"]
});

b.contextMenus.create({
    id: "copy-markdown",
    title: "Copy as Markdown",
    contexts: ["browser_action"]
});

function formatLinks(tabs, format) {
    return tabs.map(tab => {
        if (format === 'markdown') {
            return `[${tab.title}](${tab.url})`;
        }
        return `<a href="${tab.url}">${tab.title}</a>`;
    }).join('\n') + '\n';
}

function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
}

function showError(message) {
    b.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Tab Link Copier Error',
        message: message
    });
}

function handleAction(format = 'html') {
    const queryTabs = b.tabs.query;

    queryTabs({ currentWindow: true }, async (tabs) => {
        const links = formatLinks(tabs, format);

        try {
            await copyToClipboard(links);
        } catch (err) {
            console.error('Failed to copy tabs:', err);
            showError('Failed to copy tabs to clipboard');
        }
    });
}

b.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "copy-html") {
        handleAction('html');
    } else if (info.menuItemId === "copy-markdown") {
        handleAction('markdown');
    }
});

// Default to HTML when icon is clicked directly
b.browserAction.onClicked.addListener(() => handleAction('html'));
