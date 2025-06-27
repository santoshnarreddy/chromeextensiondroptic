// Handle eye reminder alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'eyeReminder') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Eye Reminder',
            message: 'Time to take a break and rest your eyes!'
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Failed to create eye reminder notification:', chrome.runtime.lastError);
            }
        });
    } else if (alarm.name === 'customReminder') {
        chrome.storage.local.get(['customReminder'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Failed to get custom reminder:', chrome.runtime.lastError);
                return;
            }

            if (result && result.customReminder) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Custom Reminder',
                    message: result.customReminder.message
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Failed to create custom reminder notification:', chrome.runtime.lastError);
                        return;
                    }

                    if (result.customReminder.url) {
                        try {
                            new URL(result.customReminder.url); // Validate URL
                            chrome.tabs.create({ url: result.customReminder.url }, () => {
                                if (chrome.runtime.lastError) {
                                    console.error('Failed to open URL:', chrome.runtime.lastError);
                                }
                            });
                        } catch (err) {
                            console.error('Invalid URL in custom reminder:', err);
                        }
                    }
                });
            }
        });
    }
}); 