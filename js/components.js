document.addEventListener("DOMContentLoaded", function () {
    // Load Navbar
    fetch("components/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").outerHTML = data;

            // Re-initialize hamburger menu after loading navbar
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.navbar-links');
            const links = document.querySelectorAll('.navbar-links li');

            if (hamburger) {
                hamburger.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                    hamburger.classList.toggle('active');
                });
            }
        })
        .catch(error => console.error('Error loading navbar:', error));

    // Load Footer
    fetch("components/footer.html")
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById("footer-placeholder");
            if (footerPlaceholder) {
                footerPlaceholder.outerHTML = data;
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});
