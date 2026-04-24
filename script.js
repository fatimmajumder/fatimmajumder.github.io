const header = document.querySelector(".site-header");

if (header) {
  const syncHeaderState = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
}
