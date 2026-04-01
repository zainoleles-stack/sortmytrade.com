function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.querySelectorAll("[data-scroll]").forEach((item) => {
  item.addEventListener("click", () => {
    scrollToSection(item.getAttribute("data-scroll"));
  });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    item.classList.toggle("active");
  });
});

const quoteForm = document.getElementById("quoteForm");
const successMessage = document.getElementById("successMessage");

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const payload = Object.fromEntries(formData.entries());

    console.log("Quote request submitted:", payload);

    quoteForm.reset();
    successMessage.style.display = "block";

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 5000);
  });
}
