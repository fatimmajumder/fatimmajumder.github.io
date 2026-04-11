const stats = document.querySelectorAll(".stat-number");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

function formatValue(value, decimals, suffix) {
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}${suffix}`;
}

function animateStats() {
  stats.forEach((node) => {
    const target = Number(node.dataset.target || 0);
    const decimals = Number(node.dataset.decimals || 0);
    const suffix = node.dataset.suffix || "";
    const start = performance.now();
    const duration = 1200;

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      node.textContent = formatValue(current, progress === 1 ? decimals : Math.min(decimals, 1), suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        node.textContent = formatValue(target, decimals, suffix);
      }
    }

    requestAnimationFrame(step);
  });
}

if ("IntersectionObserver" in window && stats.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(stats[0]);
} else {
  animateStats();
}
