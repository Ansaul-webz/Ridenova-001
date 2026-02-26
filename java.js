const language = document.querySelector(".nx-language");
const dropdown = document.querySelector(".nx-dropdown");
const selected = document.querySelector(".nx-selected");
const options = document.querySelectorAll(".nx-option");

language.addEventListener("click", () => {
    dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
});

options.forEach(option => {
    option.addEventListener("click", () => {
        selected.textContent = "🌍 " + option.dataset.lang;
        dropdown.style.display = "none";
    });
});

document.addEventListener("click", (e) => {
    if (!language.contains(e.target)) {
        dropdown.style.display = "none";
    }
});