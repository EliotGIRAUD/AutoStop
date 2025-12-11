const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const learnMoreButton = document.getElementById("learn-more");
const featureSection = document.getElementById("feature");

if (learnMoreButton && featureSection) {
  learnMoreButton.addEventListener("click", () => {
    featureSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Placeholder redirect hook; replace href with your app URL if needed.
const appLinks = document.querySelectorAll('a[href="/app"]');
appLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "/app";
  });
});
