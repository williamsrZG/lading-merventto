(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("mainNav");
  var navToggle = document.getElementById("navToggle");
  var toTop = document.getElementById("toTop");
  var yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header state + back-to-top on scroll */
  function onScroll() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle("is-scrolled", scrolled);
    toTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  function closeNav() {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* Scroll reveal via IntersectionObserver */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Contact form -> WhatsApp handoff */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = document.getElementById("fNombre").value.trim();
      var servicio = document.getElementById("fServicio").value;
      var mensaje = document.getElementById("fMensaje").value.trim();

      var texto = "Hola Marventto, soy " + (nombre || "un cliente") +
        ". Quiero consultar por transporte de " + servicio.toLowerCase() + ".";
      if (mensaje) texto += " " + mensaje;

      var url = "https://wa.me/5493541213416?text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
    });
  }
})();
