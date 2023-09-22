document.addEventListener("DOMContentLoaded", function () {
    // JavaScript interactivity can be added here
    // For example, you can add a form submission handler
    const contactForm = document.getElementById("contact-form");
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // Handle form submission here (e.g., send data to a server)
        // You can also add validation and other functionality
        alert("Form submitted!");
    });
});
