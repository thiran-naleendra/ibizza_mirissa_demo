const header = document.querySelector("#siteHeader");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#navMenu");
const navLinks = [...document.querySelectorAll(".nav-menu a")];
const backTop = document.querySelector("#backTop");
const bookingForm = document.querySelector("#bookingForm");
const formStatus = document.querySelector("#formStatus");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox-close");

const setScrolledState = () => {
  const isScrolled = window.scrollY > 18;
  header.classList.toggle("is-scrolled", isScrolled);
  backTop.classList.toggle("is-visible", window.scrollY > 640);
};

const closeMenu = () => {
  navToggle.classList.remove("is-open");
  navMenu.classList.remove("is-open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
};

navToggle.addEventListener("click", () => {
  const willOpen = !navMenu.classList.contains("is-open");
  navToggle.classList.toggle("is-open", willOpen);
  navMenu.classList.toggle("is-open", willOpen);
  header.classList.toggle("menu-active", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute("aria-label", willOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", setScrolledState, { passive: true });
setScrolledState();

const revealItems = [...document.querySelectorAll(".reveal")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = [...document.querySelectorAll("main section[id]")];
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.48 }
);

sections.forEach((section) => activeObserver.observe(section));

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const name = String(formData.get("name") || "").trim();
  formStatus.textContent = `Thanks${name ? `, ${name}` : ""}. Your table request has been received for this demo.`;
  bookingForm.reset();
});

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add("menu-open");
    lightboxClose.focus();
  });
});

const closeLightbox = () => {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("menu-open");
};

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    if (!lightbox.hidden) closeLightbox();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
