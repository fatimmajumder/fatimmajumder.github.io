const focusLenses = {
  evaluation: {
    label: "Arthur AI · Summer 2025",
    title: "Deterministic evaluation for teams moving faster than their tooling.",
    copy:
      "I build evaluation systems that preserve trust while teams iterate fast across prompts, datasets, tokenizers, models, and judges.",
    bullets: [
      "Architected a production-grade platform across Python, PyTorch, Ray, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, and AWS.",
      "Scaled shared experimentation to 15K+ benchmark runs per week across reasoning, retrieval, tool use, multilingual generation, safety, and long-context workloads.",
      "Cut median turnaround by 84% and reduced wasted GPU-hours by 51% with asynchronous scheduling, caching, retry semantics, and run-diff tooling."
    ]
  },
  observability: {
    label: "Fullstory · Summer 2024",
    title: "Analytics infrastructure that makes silent regressions impossible to ignore.",
    copy:
      "I like building systems that make bad data loud before it reaches dashboards, decision-makers, or downstream teams.",
    bullets: [
      "Built backend observability and validation for analytics pipelines processing 4B+ weekly events using Python, SQL, Kafka, Airflow, dbt, and Docker.",
      "Developed validators for schema drift, freshness lag, broken joins, replay mismatches, null spikes, cardinality explosions, and anomaly bursts.",
      "Improved alert precision from 63% to 96% and reduced median time-to-detection from 3.4 hours to 7 minutes."
    ]
  },
  research: {
    label: "Algory Capital + Georgia Tech / Emory",
    title: "Research infrastructure that makes rigor easier to practice.",
    copy:
      "Across quantitative finance and biomedical ML, I build tooling that standardizes experimentation, reduces leakage risk, and helps more people do serious research well.",
    bullets: [
      "Built the research stack for a 30+ member student-run investment organization, increasing strategy research throughput by 6.8x.",
      "Reduced new-analyst ramp time from about 6 weeks to 8 days with shared workflows for tearsheets, diagnostics, experiment tracking, and point-in-time validation.",
      "Built reproducible multimodal ML pipelines that improved held-out AUROC from 0.71 to 0.88 after eliminating patient overlap, contamination, and leakage."
    ]
  }
};

const lensTabs = document.querySelectorAll(".lens-tab");
const lensLabel = document.getElementById("lens-label");
const lensTitle = document.getElementById("lens-title");
const lensCopy = document.getElementById("lens-copy");
const lensBullets = document.getElementById("lens-bullets");
const statNumbers = document.querySelectorAll(".stat-number");
const revealElements = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-link");
const copyEmailButton = document.querySelector("[data-copy-email]");

function renderLens(key) {
  const lens = focusLenses[key];
  if (!lens) {
    return;
  }

  lensLabel.textContent = lens.label;
  lensTitle.textContent = lens.title;
  lensCopy.textContent = lens.copy;
  lensBullets.innerHTML = "";

  lens.bullets.forEach((bullet) => {
    const item = document.createElement("li");
    item.textContent = bullet;
    lensBullets.appendChild(item);
  });

  lensTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.lens === key);
  });
}

lensTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    renderLens(tab.dataset.lens);
  });
});

function formatStat(value, decimals, prefix, suffix) {
  return `${prefix}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}${suffix}`;
}

function animateStats() {
  statNumbers.forEach((element) => {
    const target = Number(element.dataset.target);
    const decimals = Number(element.dataset.decimals || 0);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const displayDecimals = progress === 1 ? decimals : Math.min(decimals, 1);

      element.textContent = formatStat(current, displayDecimals, prefix, suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatStat(target, decimals, prefix, suffix);
      }
    }

    requestAnimationFrame(step);
  });
}

function updateActiveNav(id) {
  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("is-active", targetId === id);
  });
}

renderLens("evaluation");

if (copyEmailButton && navigator.clipboard) {
  copyEmailButton.addEventListener("click", async () => {
    const originalText = copyEmailButton.textContent;

    try {
      await navigator.clipboard.writeText("fatim.majumder@emory.edu");
      copyEmailButton.textContent = "Email copied";
      window.setTimeout(() => {
        copyEmailButton.textContent = originalText;
      }, 1600);
    } catch (error) {
      copyEmailButton.textContent = "Copy failed";
      window.setTimeout(() => {
        copyEmailButton.textContent = originalText;
      }, 1600);
    }
  });
}

if ("IntersectionObserver" in window) {
  revealElements.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.92) {
      element.classList.add("is-visible");
    }
  });

  document.body.classList.add("js-ready");

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
          statObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  if (statNumbers.length > 0) {
    statObserver.observe(statNumbers[0]);
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -24px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

      if (visibleSections[0]?.target?.id) {
        updateActiveNav(visibleSections[0].target.id);
      }
    },
    {
      threshold: [0.25, 0.5, 0.75],
      rootMargin: "-20% 0px -55% 0px"
    }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });

  animateStats();
}
