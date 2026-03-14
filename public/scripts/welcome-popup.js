// Welcome Popup Script
(function() {
    const WELCOME_POPUP_SHOWN_KEY = 'welcomePopupShown';
    
    // Get DOM elements
    const welcomeOverlay = document.getElementById('welcome-popup-overlay');
    const welcomeTextChars = document.querySelectorAll('.welcome-text-char');
    const welcomeTitle = document.getElementById('welcome-popup-h1');

    // Check if popup has already been shown in this session
    function hasPopupBeenShown() {
        return sessionStorage.getItem(WELCOME_POPUP_SHOWN_KEY) === 'true';
    }

    // Mark popup as shown in this session
    function markPopupAsShown() {
        sessionStorage.setItem(WELCOME_POPUP_SHOWN_KEY, 'true');
    }

    // Show popup with animations
    function showPopup() {
        if (hasPopupBeenShown()) {
            return;
        }

        // Display the overlay
        welcomeOverlay.style.display = 'block';

        // Animate overlay fade in and scale
        welcomeOverlay.style.opacity = '0';
        welcomeOverlay.style.transform = 'translate(-50%, -50%) scale(0.8)';
        welcomeOverlay.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

        // Trigger reflow to apply initial styles
        welcomeOverlay.offsetHeight;

        // Start overlay animation
        welcomeOverlay.style.opacity = '1';
        welcomeOverlay.style.transform = 'translate(-50%, -50%) scale(1)';

        // Animate title
        welcomeTitle.style.opacity = '0';
        welcomeTitle.style.transform = 'translateY(-20px)';
        welcomeTitle.style.transition = 'opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s';
        welcomeTitle.offsetHeight;
        welcomeTitle.style.opacity = '1';
        welcomeTitle.style.transform = 'translateY(0)';

        // Animate floating text characters
        animateWelcomeText();

        // Mark popup as shown
        markPopupAsShown();
    }

    // Animate welcome text with waterfall effect
    function animateWelcomeText() {
        welcomeTextChars.forEach((char, index) => {
            // Initial state
            char.style.opacity = '0';
            char.style.transform = 'translateY(20px) translateX(-10px)';
            char.style.transition = `opacity 0.4s ease-out ${0.5 + index * 0.05}s, transform 0.4s ease-out ${0.5 + index * 0.05}s`;

            // Trigger reflow
            char.offsetHeight;

            // Animate to final state
            char.style.opacity = '1';
            char.style.transform = 'translateY(0) translateX(0)';
        });
    }

    // Close popup with fade out animation
    function closePopup() {
        // Fade out overlay
        welcomeOverlay.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        welcomeOverlay.style.opacity = '0';
        welcomeOverlay.style.transform = 'translate(-50%, -50%) scale(0.8)';

        // Hide element after animation completes
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
        }, 400);
    }

    // Add click listener to close popup on any click
    function addCloseListener() {
        document.addEventListener('click', function(event) {
            // Check if the popup is visible
            if (welcomeOverlay.style.display === 'block') {
                closePopup();
            }
        }, { once: true }); // Only listen for the first click
    }

    // Initialize popup on page load
    function initializePopup() {
        // Only show if not already shown in this session
        if (!hasPopupBeenShown()) {
            // Delay popup appearance by 1.5 seconds
            setTimeout(() => {
                showPopup();
                addCloseListener();
            }, 1500);
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePopup);
    } else {
        initializePopup();
    }
})();
