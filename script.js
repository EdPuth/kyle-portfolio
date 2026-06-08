const root = document.documentElement;
const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
}

function updateActiveNav() {
  const links = [...document.querySelectorAll(".nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let activeId = "";
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 150) {
      activeId = section.id;
    }
  }

  links.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
}

function bindPointerGlow() {
  const hero = document.querySelector(".hero");
  if (!hero || !motionOK) return;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    root.style.setProperty("--glow-x", `${x.toFixed(2)}%`);
    root.style.setProperty("--glow-y", `${y.toFixed(2)}%`);
  });
}

function bindCardGlow() {
  if (!motionOK) return;
  const cards = document.querySelectorAll(
    ".project-card, .skill-columns > div, .education-grid article, .terminal-card"
  );

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--card-x", `${x.toFixed(2)}%`);
      card.style.setProperty("--card-y", `${y.toFixed(2)}%`);
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(
    ".overview > div, .section-heading, .timeline-item, .project-card, .education-grid article, .publication-list a, .skill-columns > div, .contact > *"
  );

  items.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });

  if (!motionOK) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
}, { passive: true });

window.addEventListener("resize", updateProgress);

updateProgress();
updateActiveNav();
bindPointerGlow();
bindCardGlow();
setupReveal();
