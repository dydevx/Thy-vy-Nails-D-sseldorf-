document.documentElement.classList.add("js");

const header = document.querySelector("#site-header");
const toggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

const closeMenu = () => {
  header.classList.remove("open");
  document.body.classList.remove("menu-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Menü öffnen");
};

toggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
});

mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 24), { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.src;
    lightboxImage.alt = item.querySelector("img").alt;
    lightbox.showModal();
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});
