const navLinks = Array.from(
  document.querySelectorAll('.site-nav .nav-link[href^="#"]')
);

if (navLinks.length > 0 && "IntersectionObserver" in window) {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const target = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", target === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

      if (visible[0]?.target?.id) {
        setActiveLink(visible[0].target.id);
      }
    },
    {
      threshold: [0.3, 0.5, 0.7],
      rootMargin: "-18% 0px -60% 0px"
    }
  );

  if (sections[0]?.id) {
    setActiveLink(sections[0].id);
  }

  sections.forEach((section) => observer.observe(section));
}
