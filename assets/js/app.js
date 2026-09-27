const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

document.querySelectorAll("[data-coming]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.coming} sedang disiapkan.`);
  });
});

document.getElementById("year").textContent =
  `© ${new Date().getFullYear()}`;
