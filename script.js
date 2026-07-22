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

const requiredBookingFields = ["name", "date", "time"];
const serviceInputs = [...document.querySelectorAll(".price-option input")];
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const continueBooking = document.querySelector("#continue-booking");
const selectedServices = document.querySelector("#selected-services");
const selectedServicesList = document.querySelector("#selected-services-list");

const formatPrice = value => new Intl.NumberFormat("de-DE", {
  style: "currency", currency: "EUR", minimumFractionDigits: value % 1 ? 2 : 0
}).format(value);

const getSelectedServices = () => serviceInputs.filter(input => input.checked).map(input => ({
  name: input.dataset.service,
  price: input.dataset.price === "" ? null : Number(input.dataset.price)
}));

const getServiceTotal = services => services.reduce((total, service) => total + (service.price || 0), 0);

const updateServiceCart = () => {
  const services = getSelectedServices();
  const total = getServiceTotal(services);
  const hasQuoteItem = services.some(service => service.price === null);
  cartCount.textContent = services.length ? `${services.length} ${services.length === 1 ? "Leistung" : "Leistungen"} gewählt` : "Noch keine Leistung gewählt";
  cartTotal.textContent = `Gesamt ab ${formatPrice(total)}${hasQuoteItem ? " + Preis auf Anfrage" : ""}`;
  selectedServicesList.textContent = services.length
    ? `${services.map(service => service.name).join(", ")} · ab ${formatPrice(total)}${hasQuoteItem ? " + Preis auf Anfrage" : ""}`
    : "Bitte wählen Sie zuerst eine Leistung aus der Preisliste.";
  selectedServices.classList.toggle("is-invalid", appointmentForm.classList.contains("was-validated") && services.length === 0);
  continueBooking.classList.toggle("is-disabled", services.length === 0);
  continueBooking.setAttribute("aria-disabled", String(services.length === 0));
  updateBookingPreview();
};

const formatGermanDate = value => {
  if (!value) return "";
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
};

const getBookingData = () => {
  const formData = new FormData(appointmentForm);
  const services = getSelectedServices();
  return {
    ...Object.fromEntries(formData.entries()),
    services,
    total: getServiceTotal(services),
    hasQuoteItem: services.some(service => service.price === null)
  };
};

const buildBookingMessage = data => {
  const lines = [
    "Hallo Thy & Vy Nails Düsseldorf,",
    "ich möchte gerne einen Termin anfragen.",
    "",
    `Name: ${data.name}`,
    "Gewählte Leistungen:",
    ...data.services.map(service => `• ${service.name}${service.price === null ? " (Preis auf Anfrage)" : ` (ab ${formatPrice(service.price)})`}`),
    `Gesamt: ab ${formatPrice(data.total)}${data.hasQuoteItem ? " + Preis auf Anfrage" : ""}`,
    "",
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
  const isComplete = requiredBookingFields.every(field => data[field]?.trim()) && data.services.length > 0;
  selectedServices.classList.toggle("is-invalid", appointmentForm.classList.contains("was-validated") && data.services.length === 0);
  bookingPreview.hidden = !isComplete;
  if (isComplete) previewMessage.textContent = buildBookingMessage(data);
  if (formStatus.textContent) formStatus.textContent = "";
};

appointmentForm.addEventListener("input", updateBookingPreview);
appointmentForm.addEventListener("change", updateBookingPreview);
serviceInputs.forEach(input => input.addEventListener("change", updateServiceCart));
continueBooking.addEventListener("click", event => {
  if (!getSelectedServices().length) {
    event.preventDefault();
    document.querySelector(".price-option input")?.focus();
  }
});

appointmentForm.addEventListener("submit", event => {
  event.preventDefault();
  appointmentForm.classList.add("was-validated");
  const data = getBookingData();
  const servicesValid = data.services.length > 0;
  selectedServices.classList.toggle("is-invalid", !servicesValid);
  if (!appointmentForm.checkValidity() || !servicesValid) {
    const firstInvalid = !servicesValid ? document.querySelector(".price-option input") : appointmentForm.querySelector(":invalid");
    formStatus.textContent = servicesValid ? "Bitte füllen Sie alle erforderlichen Felder aus." : "Bitte wählen Sie mindestens eine Leistung aus der Preisliste.";
    firstInvalid?.focus();
    return;
  }
  const message = buildBookingMessage(data);
  window.open(`https://wa.me/4915207876868?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

updateServiceCart();
