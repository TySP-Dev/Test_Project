document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusText = document.getElementById('statusText');
    const progressText = document.getElementById('progressText');
    const thresholdText = document.getElementById('thresholdText');
    const thresholdInput = document.getElementById('thresholdInput');
    const retriesInput = document.getElementById('retriesInput');
    const logContent = document.getElementById('logContent');

    let logs = [];

    // Load saved settings
    chrome.storage.sync.get(['progressThreshold', 'maxRetries'], function(result) {
        if (result.progressThreshold !== undefined) {
            thresholdInput.value = result.progressThreshold;
        }
        if (result.maxRetries !== undefined) {
            retriesInput.value = result.maxRetries;
        }
    });

    function updateStatus() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, function(response) {
                    if (chrome.runtime.lastError) {
                        statusText.textContent = 'Not on JKO page';
                        statusText.className = 'status-value stopped';
                        return;
                    }

                    if (response) {
                        statusText.textContent = response.running ? 'Running' : 'Stopped';
                        statusText.className = response.running ? 'status-value running' : 'status-value stopped';
                        progressText.textContent = response.progress + '%';
                        thresholdText.textContent = response.threshold + '%';
                    }
                });
            }
        });
    }

    function addLog(message, type) {
        const entry = document.createElement('div');
        entry.className = 'log-entry ' + (type || 'info');
        entry.textContent = new Date().toLocaleTimeString() + ' - ' + message;

        logs.push(entry);
        if (logs.length > 50) {
            logs.shift();
        }

        logContent.innerHTML = '';
        logs.forEach(log => logContent.appendChild(log));
        logContent.scrollTop = logContent.scrollHeight;
    }

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.type === 'log') {
            addLog(request.message, request.logType);
        } else if (request.type === 'status') {
            updateStatus();
        }
    });

    startBtn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'start' }, function(response) {
                    if (chrome.runtime.lastError) {
                        addLog('Error: Not on JKO page', 'error');
                    } else {
                        addLog('Automation started', 'success');
                        updateStatus();
                    }
                });
            }
        });
    });

    stopBtn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' }, function(response) {
                    if (chrome.runtime.lastError) {
                        addLog('Error: Not on JKO page', 'error');
                    } else {
                        addLog('Automation stopped', 'info');
                        updateStatus();
                    }
                });
            }
        });
    });

    thresholdInput.addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value >= 1 && value <= 100) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'setThreshold',
                        value: value
                    }, function(response) {
                        if (!chrome.runtime.lastError) {
                            addLog('Threshold set to ' + value + '%', 'success');
                            updateStatus();
                        }
                    });
                }
            });
        }
    });

    retriesInput.addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value >= 1 && value <= 50) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'setMaxRetries',
                        value: value
                    }, function(response) {
                        if (!chrome.runtime.lastError) {
                            addLog('Max retries set to ' + value, 'success');
                        }
                    });
                }
            });
        }
    });

    // Update status every 2 seconds
    setInterval(updateStatus, 2000);

    // Initial status update
    updateStatus();
});
