// Responsive Iframe Enhancement Script for VESPA Website
document.addEventListener('DOMContentLoaded', function() {
    // Function to check if viewport is narrow/unusual
    function isNarrowViewport() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        return aspectRatio < 0.75; // 3:4 ratio
    }

    // Function to adjust iframe height based on viewport
    function adjustIframeHeight(wrapper) {
        if (isNarrowViewport()) {
            wrapper.style.height = '70vh';
            wrapper.style.paddingBottom = '0';
            wrapper.style.maxHeight = '70vh';
        }
    }

    // Function to wrap iframe in responsive container
    function makeIframeResponsive(iframe) {
        // Skip if already wrapped
        if (iframe.parentElement.classList.contains('responsive-iframe-container')) {
            return;
        }

        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.className = 'responsive-iframe-container';

        // Determine aspect ratio based on iframe source
        const src = iframe.src || '';
        
        if (src.includes('slides.com') || src.includes('youtube') || src.includes('vimeo')) {
            // Slides and videos: 16:9 with viewport constraints
            wrapper.classList.add('responsive-iframe-16-9');
            // Check and adjust for narrow viewports
            adjustIframeHeight(wrapper);
        } else if (src.includes('calendly')) {
            // Calendly: Tall
            wrapper.classList.add('responsive-iframe-tall');
        } else if (src.includes('maps') || src.includes('google.com/maps')) {
            // Maps: 4:3
            wrapper.classList.add('responsive-iframe-4-3');
        } else if (src.includes('jotform') || src.includes('form')) {
            // Forms: Tall and scrollable on mobile
            wrapper.classList.add('responsive-iframe-tall', 'responsive-iframe-scrollable');
        } else {
            // Default: 16:9
            wrapper.classList.add('responsive-iframe-16-9');
            adjustIframeHeight(wrapper);
        }

        // Wrap the iframe
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);

        // Remove inline width/height styles
        iframe.style.removeProperty('width');
        iframe.style.removeProperty('height');
        iframe.style.removeProperty('min-width');
        iframe.style.removeProperty('min-height');
        
        // Ensure iframe has necessary attributes
        if (!iframe.hasAttribute('allowfullscreen')) {
            iframe.setAttribute('allowfullscreen', '');
        }
    }

    // Find all iframes on the page
    const iframes = document.querySelectorAll('iframe');
    
    // Apply responsive wrapper to each iframe
    iframes.forEach(iframe => {
        // Skip iframes that are already in specific containers we don't want to modify
        if (!iframe.closest('.responsive-iframe-wrapper') && // Our custom wrapper from resources.html
            !iframe.closest('[data-no-responsive]')) { // Allow opting out with data attribute
            makeIframeResponsive(iframe);
        }
    });

    // Also handle dynamically added iframes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IFRAME') {
                    makeIframeResponsive(node);
                } else if (node.querySelectorAll) {
                    const iframes = node.querySelectorAll('iframe');
                    iframes.forEach(makeIframeResponsive);
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Handle window resize to adjust iframes
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Re-adjust all responsive iframes
            const wrappers = document.querySelectorAll('.responsive-iframe-16-9, .responsive-iframe-4-3');
            wrappers.forEach(wrapper => {
                if (isNarrowViewport()) {
                    wrapper.style.height = '70vh';
                    wrapper.style.paddingBottom = '0';
                    wrapper.style.maxHeight = '70vh';
                } else {
                    // Reset to aspect ratio based sizing
                    wrapper.style.height = '';
                    wrapper.style.paddingBottom = '';
                    wrapper.style.maxHeight = '80vh';
                }
            });
        }, 250);
    });
}); 