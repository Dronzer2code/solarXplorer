document.addEventListener('DOMContentLoaded', () => {

    // --- Intersection Observer for fade-in animations ---
    const hiddenElements = document.querySelectorAll('.hidden');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    hiddenElements.forEach(el => observer.observe(el));

});