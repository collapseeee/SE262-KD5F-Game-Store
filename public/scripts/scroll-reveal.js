// Scroll Reveal - IntersectionObserver based
(function () {
  var revealElements = document.querySelectorAll('.scroll-reveal');

  if (!revealElements.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
})();
