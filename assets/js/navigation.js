(() => {
  const header = document.querySelector("[data-site-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-primary-nav]");

  if (header) {
    const updateHeader = () => {
      header.dataset.scrolled = window.scrollY > 18 ? "true" : "false";
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (!toggle || !navigation) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    navigation.dataset.open = "false";
  };

  toggle.addEventListener("click", () => {
    const willOpen = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(willOpen));
    navigation.dataset.open = String(willOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
})();
