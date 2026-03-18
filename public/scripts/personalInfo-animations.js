// Scroll Reveal Animation System for Personal Information Page
document.addEventListener('DOMContentLoaded', function() {
  // Get all scroll-reveal elements
  const revealElements = document.querySelectorAll('.scroll-reveal');

  // Create intersection observer for scroll reveal
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add revealed class to trigger animation
        entry.target.classList.add('revealed');
        // Stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  revealElements.forEach(element => {
    observer.observe(element);
  });

  // Handle modal animations
  const confirmModal = document.getElementById('confirm-modal');
  if (confirmModal) {
    confirmModal.addEventListener('show.bs.modal', function() {
      const modalDialog = this.querySelector('.modal-dialog');
      if (modalDialog) {
        // Re-trigger animation by removing and re-adding class
        modalDialog.classList.remove('modal-animate');
        // Force reflow to restart animation
        void modalDialog.offsetWidth;
        modalDialog.classList.add('modal-animate');
      }
    });
  }

  // Add smooth transitions to buttons
  const buttons = document.querySelectorAll('.button-hover');
  buttons.forEach(button => {
    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(0)';
    });
    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-2px)';
    });
  });
});
