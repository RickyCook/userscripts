// ==UserScript==
// @name         Krow focus comments
// @namespace    https://thatpanda.com/
// @version      0.1
// @description  Focus on comment fields when opened
// @author       Ricky Cook <ricky.cook@cmd.com.au>
// @updateURL    https://raw.githubusercontent.com/RickyCook/userscripts/master/krow-comment-focus.js
// @downloadURL  https://raw.githubusercontent.com/RickyCook/userscripts/master/krow-comment-focus.js
// @match        https://\*.visual.force.com/\*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Stricter host check
    const hostRe = /.*--krow\..*\.visual\.force\.com/;
    if (!hostRe.test(document.location.hostname)) {
        return;
    }

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    function handleCommentClick() {
        for (const el of document.querySelectorAll('textarea[data-daynote]')) {
            if (el.offsetParent) { // check for visible
                el.focus();
            }
        }
    }
    function processCommentButton(el) {
        el.addEventListener('click', handleCommentClick);
    }
    function processChildCommentButtons(parentEl) {
        for (const el of parentEl.getElementsByClassName('ui-icon-comment')) {
            processCommentButton(el);
        }
    }

    processChildCommentButtons(document);

    const observer = new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.classList && node.classList.contains('ui-icon-comment')) {
                    processCommentButton(node);
                } else if (node.getElementsByClassName) {
                    processChildCommentButtons(node);
                }
            }
        }
    });
    observer.observe(document, {
        subtree: true,
        childList: true,
    });
})();
