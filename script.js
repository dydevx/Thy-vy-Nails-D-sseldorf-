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

const appointmentForm = document.querySelector("#appointment-form");
const bookingPreview = document.querySelector("#booking-preview");
const previewMessage = document.querySelector("#preview-message");
const formStatus = document.querySelector("#form-status");
const appointmentDate = appointmentForm.querySelector('[name="date"]');
appointmentDate.min = new Date().toISOString().split("T")[0];

const requiredBookingFields = ["name", "service", "date", "time"];

const formatGermanDate = value => {
  if (!value) return "";
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
};

const getBookingData = () => Object.fromEntries(new FormData(appointmentForm).entries());

const buildBookingMessage = data => {
  const lines = [
    "Hallo Thy & Vy Nails Düsseldorf,",
    "ich möchte gerne einen Termin anfragen.",
    "",
    `Name: ${data.name}`,
    `Dienstleistung: ${data.service}`,
    `Wunschtermin: ${formatGermanDate(data.date)}`,
    `Uhrzeit: ${data.time}`
  ];
  if (data.phone) lines.push(`Telefonnummer: ${data.phone}`);
  if (data.message) lines.push(`Nachricht: ${data.message}`);
  lines.push("", "Vielen Dank!");
  return lines.join("\n");
};

const updateBookingPreview = () => {
  const data = getBookingData();
  const isComplete = requiredBookingFields.every(field => data[field]?.trim());
  bookingPreview.hidden = !isComplete;
  if (isComplete) previewMessage.textContent = buildBookingMessage(data);
  if (formStatus.textContent) formStatus.textContent = "";
};

appointmentForm.addEventListener("input", updateBookingPreview);
appointmentForm.addEventListener("change", updateBookingPreview);

appointmentForm.addEventListener("submit", event => {
  event.preventDefault();
  appointmentForm.classList.add("was-validated");
  if (!appointmentForm.checkValidity()) {
    const firstInvalid = appointmentForm.querySelector(":invalid");
    formStatus.textContent = "Bitte füllen Sie alle erforderlichen Felder aus.";
    firstInvalid?.focus();
    return;
  }
  const message = buildBookingMessage(getBookingData());
  window.open(`https://wa.me/4921141651273?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});
