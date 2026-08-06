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

  /* Fleet carousels */
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".fleet-track");
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".fleet-slide"));
    var dotsWrap = carousel.querySelector(".fleet-dots");
    var prevBtn = carousel.querySelector(".fleet-nav-prev");
    var nextBtn = carousel.querySelector(".fleet-nav-next");
    var current = 0;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "fleet-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Ver foto " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function setActive(i) {
      current = i;
      dots.forEach(function (d, idx) { d.classList.toggle("is-active", idx === i); });
    }

    function goTo(i) {
      track.scrollTo({ left: slides[i].offsetLeft, behavior: "smooth" });
      setActive(i);
    }

    prevBtn.addEventListener("click", function () {
      goTo(current > 0 ? current - 1 : slides.length - 1);
    });
    nextBtn.addEventListener("click", function () {
      goTo(current < slides.length - 1 ? current + 1 : 0);
    });

    var scrollTimer;
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== current) setActive(i);
      }, 100);
    }, { passive: true });
  });

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
