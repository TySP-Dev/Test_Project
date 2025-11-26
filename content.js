// ========================================
// JKO Course Automation - Chrome Extension
// ========================================

(function() {
    'use strict';

    var config = {
        progressThreshold: 93,
        checkInterval: 2000,
        apiWaitTime: 100,
        maxApiAttempts: 50,
        maxRetries: 10,
        autoStart: false  // Don't auto-start by default
    };

    var state = {
        isRunning: false,
        currentProgress: 0,
        hasStarted: false,
        currentLessonRetries: 0,
        lastLessonId: null
    };

    // Load settings from Chrome storage
    chrome.storage.sync.get(['autoStart', 'progressThreshold', 'maxRetries'], function(result) {
        if (result.autoStart !== undefined) config.autoStart = result.autoStart;
        if (result.progressThreshold !== undefined) config.progressThreshold = result.progressThreshold;
        if (result.maxRetries !== undefined) config.maxRetries = result.maxRetries;

        if (config.autoStart) {
            log("Auto-start enabled - starting automation", 'success');
            setTimeout(startAutomation, 2000);
        }
    });

    function log(message, type) {
        var prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '🔄';
        console.log(prefix + ' [JKO Auto] ' + message);

        // Send status to popup
        chrome.runtime.sendMessage({
            type: 'log',
            message: message,
            logType: type
        }).catch(() => {}); // Ignore errors if popup is closed
    }

    function updateStatus() {
        chrome.runtime.sendMessage({
            type: 'status',
            data: {
                running: state.isRunning,
                progress: state.currentProgress,
                threshold: config.progressThreshold,
                hasStarted: state.hasStarted,
                retries: state.currentLessonRetries
            }
        }).catch(() => {});
    }

    function getIframe(name) {
        var windows = [window, window.parent, window.top];

        for (var w = 0; w < windows.length; w++) {
            try {
                var win = windows[w];
                if (!win || !win.document) continue;

                var iframes = win.document.getElementsByName(name);
                if (iframes.length > 0) {
                    return iframes[0];
                }
            } catch (e) {
                // Ignore errors
            }
        }
        return null;
    }

    function isElementVisible(element) {
        if (!element) return false;

        var style = element.style;
        if (style.display === 'none' || style.visibility === 'hidden') {
            return false;
        }

        try {
            var computedStyle = element.ownerDocument.defaultView.getComputedStyle(element);
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                return false;
            }
        } catch (e) {}

        if (element.offsetWidth === 0 || element.offsetHeight === 0) {
            return false;
        }

        return true;
    }

    function isCurrentLessonCompleted() {
        try {
            var iframe = getIframe("coursegenerate");
            if (!iframe || !iframe.contentDocument) {
                return null;
            }

            var selectedItems = iframe.contentDocument.querySelectorAll('.menuTabItemSelected');

            for (var i = 0; i < selectedItems.length; i++) {
                var selectedItem = selectedItems[i];
                var menuTabItem = selectedItem.closest('.menuTabItem');
                var lessonId = menuTabItem ? menuTabItem.id : null;

                if (lessonId && lessonId !== state.lastLessonId) {
                    state.lastLessonId = lessonId;
                    state.currentLessonRetries = 0;
                    log("New lesson: " + lessonId, 'info');
                }

                var iconContainer = menuTabItem ?
                    menuTabItem.querySelector('.menuTabItemIconContainer') :
                    selectedItem.parentElement.querySelector('.menuTabItemIconContainer');

                if (iconContainer) {
                    var classes = iconContainer.className;

                    if (classes.indexOf('menuTabLessonIcon_completed') !== -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

            return null;

        } catch (e) {
            log("Error checking completion: " + e.message, 'error');
            return null;
        }
    }

    function retryCurrentLesson() {
        try {
            var iframe = getIframe("coursegenerate");
            if (!iframe || !iframe.contentDocument) {
                return false;
            }

            var selectedItems = iframe.contentDocument.querySelectorAll('.menuTabItemSelected a');

            if (selectedItems.length > 0) {
                var lessonLink = selectedItems[0];
                log("Retrying current lesson...", 'info');
                lessonLink.click();
                return true;
            }

        } catch (e) {
            log("Error retrying lesson: " + e.message, 'error');
        }
        return false;
    }

    function checkAndClickStartResume() {
        try {
            var iframe = getIframe("courseheader");
            if (!iframe || !iframe.contentDocument) {
                return false;
            }

            var resumeButton = iframe.contentDocument.getElementById("two");
            if (resumeButton && isElementVisible(resumeButton)) {
                log("Clicking Resume button", 'success');
                resumeButton.click();
                state.hasStarted = true;
                return true;
            }

            var startButton = iframe.contentDocument.getElementById("one");
            if (startButton && isElementVisible(startButton)) {
                log("Clicking Start button", 'success');
                startButton.click();
                state.hasStarted = true;
                return true;
            }

            return false;

        } catch (e) {
            return false;
        }
    }

    function getProgress() {
        var iframeNames = ['courseheader', 'coursegenerate', 'text'];
        var windows = [window, window.parent, window.top];

        for (var w = 0; w < windows.length; w++) {
            try {
                var win = windows[w];
                if (!win || !win.document) continue;

                var progressEl = win.document.getElementById("lp");
                if (progressEl) {
                    var progress = parseInt(progressEl.textContent || progressEl.innerText);
                    if (!isNaN(progress)) {
                        return progress;
                    }
                }

                for (var i = 0; i < iframeNames.length; i++) {
                    try {
                        var iframes = win.document.getElementsByName(iframeNames[i]);
                        for (var j = 0; j < iframes.length; j++) {
                            var iframe = iframes[j];
                            if (iframe && iframe.contentDocument) {
                                progressEl = iframe.contentDocument.getElementById("lp");
                                if (progressEl) {
                                    progress = parseInt(progressEl.textContent || progressEl.innerText);
                                    if (!isNaN(progress)) {
                                        return progress;
                                    }
                                }
                            }
                        }
                    } catch (e) {}
                }
            } catch (e) {}
        }

        return 0;
    }

    function clickNextLesson() {
        try {
            var iframe = getIframe("courseheader");
            if (iframe && iframe.contentDocument) {
                var nextButton = iframe.contentDocument.getElementById("four");
                if (nextButton && isElementVisible(nextButton)) {
                    log("Clicking Next Lesson", 'info');
                    nextButton.click();
                    return true;
                }
            }
        } catch (e) {
            log("Error clicking Next: " + e.message, 'error');
        }
        return false;
    }

    function clickExitCourse() {
        try {
            var iframe = getIframe("courseheader");
            if (iframe && iframe.contentDocument) {
                var exitButtons = iframe.contentDocument.querySelectorAll('a.button[href="javascript:close();"]');
                for (var i = 0; i < exitButtons.length; i++) {
                    if (exitButtons[i].textContent.indexOf("Exit") !== -1) {
                        log("🎉 Clicking Exit Course!", 'success');
                        exitButtons[i].click();
                        return true;
                    }
                }
            }
        } catch (e) {
            log("Error clicking Exit: " + e.message, 'error');
        }
        return false;
    }

    function findAPI() {
        try {
            if (window.parent && window.parent.JKOAPI &&
                window.parent.JKOAPI.document &&
                window.parent.JKOAPI.document.API_1484_11) {
                return window.parent.JKOAPI.document.API_1484_11;
            }

            if (window.top && window.top.JKOAPI &&
                window.top.JKOAPI.document &&
                window.top.JKOAPI.document.API_1484_11) {
                return window.top.JKOAPI.document.API_1484_11;
            }

            if (window.JKOAPI && window.JKOAPI.document &&
                window.JKOAPI.document.API_1484_11) {
                return window.JKOAPI.document.API_1484_11;
            }
        } catch (e) {}
        return null;
    }

    function completeCurrentLesson() {
        var API = findAPI();
        if (API) {
            try {
                API.SetValue('cmi.completion_status', 'completed');
                return true;
            } catch (e) {
                log("Error setting completion: " + e.message, 'error');
            }
        }
        return false;
    }

    function automationLoop() {
        if (!state.isRunning) return;

        updateStatus();

        if (!state.hasStarted) {
            if (checkAndClickStartResume()) {
                setTimeout(automationLoop, 3000);
                return;
            }
        }

        var currentProgress = getProgress();
        if (currentProgress !== state.currentProgress) {
            state.currentProgress = currentProgress;
            log("Progress: " + currentProgress + "%", 'success');
            updateStatus();
        }

        if (currentProgress >= config.progressThreshold) {
            log("Target reached: " + currentProgress + "%", 'success');
            state.isRunning = false;
            updateStatus();
            setTimeout(function() {
                clickExitCourse();
            }, 1000);
            return;
        }

        completeCurrentLesson();

        setTimeout(function() {
            var isCompleted = isCurrentLessonCompleted();

            if (isCompleted === true) {
                log("Lesson complete - next", 'success');
                state.currentLessonRetries = 0;
                setTimeout(function() {
                    clickNextLesson();
                }, 500);
            } else if (isCompleted === false) {
                state.currentLessonRetries++;

                if (state.currentLessonRetries >= config.maxRetries) {
                    log("Max retries - forcing next", 'error');
                    state.currentLessonRetries = 0;
                    setTimeout(function() {
                        clickNextLesson();
                    }, 500);
                } else {
                    log("Retry " + state.currentLessonRetries + "/" + config.maxRetries, 'info');
                    setTimeout(function() {
                        retryCurrentLesson();
                    }, 1000);
                }
            } else {
                setTimeout(function() {
                    clickNextLesson();
                }, 500);
            }

            setTimeout(automationLoop, config.checkInterval);
            updateStatus();

        }, 1000);
    }

    function startAutomation() {
        var attempts = 0;

        var checkAPI = setInterval(function() {
            attempts++;
            var API = findAPI();

            if (API) {
                clearInterval(checkAPI);
                log("SCORM API found!", 'success');
                log("Target: " + config.progressThreshold + "%", 'info');

                checkAndClickStartResume();

                state.isRunning = true;
                updateStatus();
                setTimeout(automationLoop, 2000);
            } else if (attempts >= config.maxApiAttempts) {
                clearInterval(checkAPI);
                log("Starting without API", 'error');

                checkAndClickStartResume();

                state.isRunning = true;
                updateStatus();
                setTimeout(automationLoop, 2000);
            }
        }, config.apiWaitTime);
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'start') {
            if (!state.isRunning) {
                log("Starting automation", 'success');
                startAutomation();
            }
            sendResponse({ success: true });
        } else if (request.action === 'stop') {
            log("Stopping automation", 'info');
            state.isRunning = false;
            updateStatus();
            sendResponse({ success: true });
        } else if (request.action === 'getStatus') {
            sendResponse({
                running: state.isRunning,
                progress: state.currentProgress,
                threshold: config.progressThreshold,
                hasStarted: state.hasStarted,
                retries: state.currentLessonRetries
            });
        } else if (request.action === 'setThreshold') {
            config.progressThreshold = request.value;
            chrome.storage.sync.set({ progressThreshold: request.value });
            log("Threshold set to " + request.value + "%", 'info');
            sendResponse({ success: true });
        } else if (request.action === 'setMaxRetries') {
            config.maxRetries = request.value;
            chrome.storage.sync.set({ maxRetries: request.value });
            log("Max retries set to " + request.value, 'info');
            sendResponse({ success: true });
        }
        return true;
    });

    log("JKO Automation extension loaded", 'success');

})();
