const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const navLinks = Array.from(
  document.querySelectorAll('.site-nav .nav-link[href^="#"]')
);

const revealGroups = [
  { selector: ".section-heading", step: 0, maxDelay: 0, distance: "12px" },
  { selector: ".proof-grid > *", step: 24, maxDelay: 72, distance: "10px" },
  { selector: ".case-study-grid > *", step: 32, maxDelay: 96, distance: "10px" },
  { selector: ".experience-list > *", step: 24, maxDelay: 72, distance: "10px" },
  { selector: ".project-grid > *", step: 28, maxDelay: 84, distance: "10px" },
  { selector: ".writing-grid > *", step: 28, maxDelay: 84, distance: "10px" },
  { selector: ".metric-grid > *", step: 18, maxDelay: 54, distance: "8px" },
  { selector: ".story-grid-case > *", step: 18, maxDelay: 54, distance: "8px" },
  { selector: ".boundary-card", step: 0, maxDelay: 0, distance: "10px" },
  { selector: ".contact-card", step: 0, maxDelay: 0, distance: "8px" },
  { selector: ".site-footer", step: 0, maxDelay: 0, distance: "8px" }
];

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const target = link.getAttribute("href")?.slice(1);
    link.classList.toggle("is-active", target === id);
  });
};

const setupActiveNav = () => {
  if (navLinks.length === 0 || !("IntersectionObserver" in window)) {
    return;
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

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
};

const setupStickyHeaderState = () => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  let frameId = null;

  const syncHeaderState = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 20);
    frameId = null;
  };

  syncHeaderState();

  window.addEventListener(
    "scroll",
    () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(syncHeaderState);
    },
    { passive: true }
  );
};

const isNearViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight * 1.02;
};

const setupRevealSystem = () => {
  if (prefersReducedMotion.matches) {
    return;
  }

  const deferredRevealItems = [];

  revealGroups.forEach(({ selector, step, maxDelay, distance }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      const delay = Math.min(index * step, maxDelay);

      element.classList.add("reveal-ready");
      element.style.setProperty("--reveal-delay", `${delay}ms`);
      element.style.setProperty("--reveal-distance", distance);

      if (isNearViewport(element)) {
        element.classList.add("is-visible");
      } else {
        deferredRevealItems.push(element);
      }
    });
  });

  if (!("IntersectionObserver" in window)) {
    deferredRevealItems.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  deferredRevealItems.forEach((element) => observer.observe(element));
};

setupActiveNav();
setupStickyHeaderState();
setupRevealSystem();
