/* Navid portfolio: small, dependency-free interactions. */
(function () {
  "use strict";

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.documentElement.classList.remove("no-js");

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // One translucent blue jelly orb floats behind the content on every page.
    var jellyOrb = document.createElement("div");
    jellyOrb.className = "jelly-orb";
    jellyOrb.setAttribute("aria-hidden", "true");
    jellyOrb.innerHTML = '<span class="jelly-orb-surface"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><filter id="jelly-noise"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#jelly-noise)"/></svg></span>';
    document.body.appendChild(jellyOrb);

    if (motionQuery.matches) {
      jellyOrb.style.transform = "translate3d(50vw, 43vh, 0) translate(-50%, -50%)";
    } else {
      var orbX = window.innerWidth / 2;
      var orbY = window.innerHeight * .42;
      var orbVx = 0;
      var orbVy = 0;
      var orbTargetX = orbX;
      var orbTargetY = orbY;
      var orbNextTarget = 0;
      var orbPreviousTime = 0;
      var orbRadius = jellyOrb.offsetWidth / 2;
      var chooseOrbTarget = function (time) {
        var maxX = Math.max(orbRadius, window.innerWidth - orbRadius);
        var maxY = Math.max(orbRadius, window.innerHeight - orbRadius);
        orbTargetX = orbRadius + Math.random() * (maxX - orbRadius);
        orbTargetY = orbRadius + Math.random() * (maxY - orbRadius);
        orbNextTarget = time + 3000 + Math.random() * 3200;
      };
      var animateOrb = function (time) {
        var delta = orbPreviousTime ? Math.min((time - orbPreviousTime) / 1000, .04) : 0;
        orbPreviousTime = time;
        orbRadius = jellyOrb.offsetWidth / 2;
        if (time >= orbNextTarget) chooseOrbTarget(time);
        if (delta) {
          var accelerationX = (orbTargetX - orbX) * 1.05 - orbVx * 1.5;
          var accelerationY = (orbTargetY - orbY) * 1.05 - orbVy * 1.5 + 22;
          orbVx += accelerationX * delta;
          orbVy += accelerationY * delta;
          orbX += orbVx * delta;
          orbY += orbVy * delta;

          var maxX = Math.max(orbRadius, window.innerWidth - orbRadius);
          var maxY = Math.max(orbRadius, window.innerHeight - orbRadius);
          if (orbX < orbRadius || orbX > maxX) orbVx *= -.72;
          if (orbY < orbRadius || orbY > maxY) orbVy *= -.72;
          orbX = Math.max(orbRadius, Math.min(maxX, orbX));
          orbY = Math.max(orbRadius, Math.min(maxY, orbY));
        }
        var squashX = Math.min(.045, Math.abs(orbVx) * .00012);
        var squashY = Math.min(.045, Math.abs(orbVy) * .00012);
        jellyOrb.style.transform = "translate3d(" + orbX.toFixed(1) + "px, " + orbY.toFixed(1) + "px, 0) translate(-50%, -50%) scale(" + (1 + squashX).toFixed(3) + ", " + (1 + squashY).toFixed(3) + ")";
        window.requestAnimationFrame(animateOrb);
      };
      chooseOrbTarget(0);
      window.requestAnimationFrame(animateOrb);
      window.addEventListener("resize", function () {
        orbRadius = jellyOrb.offsetWidth / 2;
        chooseOrbTarget(performance.now());
      }, { passive: true });
    }

    // A tiny rubber duck replaces the system pointer on desktop mouse devices.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      var duckCursor = document.createElement("div");
      duckCursor.className = "duck-cursor";
      duckCursor.setAttribute("aria-hidden", "true");
      duckCursor.innerHTML = '<span class="duck-cursor-face">🦆</span><span class="duck-cursor-sound">quack!</span>';
      document.body.appendChild(duckCursor);

      var cursorX = 0;
      var cursorY = 0;
      var cursorFrame = 0;
      document.addEventListener("pointermove", function (event) {
        document.body.classList.add("has-duck-cursor");
        cursorX = event.clientX;
        cursorY = event.clientY;
        var textEntry = event.target.closest && event.target.closest("input, textarea, select, [contenteditable=true]");
        if (textEntry) {
          duckCursor.classList.remove("is-visible", "is-hovering");
          return;
        }
        duckCursor.classList.add("is-visible");
        if (cursorFrame) return;
        cursorFrame = window.requestAnimationFrame(function () {
          duckCursor.style.transform = "translate3d(" + cursorX + "px, " + cursorY + "px, 0) translate(-50%, -50%)";
          cursorFrame = 0;
        });
        var interactive = event.target.closest && event.target.closest("a, button, [role=button]");
        duckCursor.classList.toggle("is-hovering", Boolean(interactive));
      });
      window.addEventListener("pointerleave", function () {
        duckCursor.classList.remove("is-visible");
        document.body.classList.remove("has-duck-cursor");
      });
    }

    var header = document.querySelector(".site-header");
    if (header) {
      var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 10); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // The mobile menu stays in the normal tab order only while it is open.
    var toggle = document.querySelector(".menu-toggle");
    var links = document.getElementById("nav-links");
    if (toggle && links) {
      var mobileNav = window.matchMedia("(max-width: 860px)");
      var setMenu = function (open) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.querySelector("span").textContent = open ? "Close" : "Menu";
        links.classList.toggle("open", open);
        links.setAttribute("aria-hidden", String(mobileNav.matches && !open));
        links.inert = mobileNav.matches && !open;
      };
      setMenu(false);

      toggle.addEventListener("click", function () {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
      });
      links.addEventListener("click", function (event) {
        if (event.target.closest("a")) setMenu(false);
      });
      document.addEventListener("click", function (event) {
        if (mobileNav.matches && links.classList.contains("open") &&
            !links.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && links.classList.contains("open")) {
          setMenu(false);
          toggle.focus();
        }
      });
      mobileNav.addEventListener("change", function (event) {
        links.inert = event.matches;
        links.setAttribute("aria-hidden", String(event.matches));
        if (!event.matches) setMenu(false);
      });
    }

    // Reveal content once, with a small stagger for project cards.
    var headings = document.querySelectorAll("main h2, .page-hero h1");
    headings.forEach(function (heading) {
      if (!heading.closest(".reveal")) heading.classList.add("reveal");
    });
    document.querySelectorAll(".work-grid").forEach(function (grid) {
      grid.querySelectorAll(".case").forEach(function (card, index) {
        card.style.setProperty("--reveal-delay", Math.min(index * 65, 195) + "ms");
      });
    });

    var items = document.querySelectorAll(".reveal");
    if (motionQuery.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("in-view"); });
    } else {
      var observer = new IntersectionObserver(function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            currentObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
      items.forEach(function (item) { observer.observe(item); });
    }

    // Fade major sections and project cards gently as they pass the viewport center.
    if (!motionQuery.matches) {
      var fadeTargets = Array.prototype.slice.call(document.querySelectorAll("main > section"))
        .filter(function (section) { return !section.querySelector(".work-grid"); })
        .concat(Array.prototype.slice.call(document.querySelectorAll(".work-grid .case")));
      var fadeFrame = 0;
      var updateScrollFade = function () {
        fadeFrame = 0;
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        fadeTargets.forEach(function (target) {
          if (target.hidden) return;
          var bounds = target.getBoundingClientRect();
          if (bounds.bottom <= 0 || bounds.top >= viewportHeight) {
            target.style.setProperty("--scroll-opacity", ".72");
            return;
          }
          var center = bounds.top + bounds.height / 2;
          var distance = Math.abs(center - viewportHeight / 2) / viewportHeight;
          var opacity = Math.max(.72, 1 - distance * .42);
          target.style.setProperty("--scroll-opacity", opacity.toFixed(3));
        });
      };
      var queueScrollFade = function () {
        if (!fadeFrame) fadeFrame = window.requestAnimationFrame(updateScrollFade);
      };
      fadeTargets.forEach(function (target) { target.classList.add("scroll-fade"); });
      window.addEventListener("scroll", queueScrollFade, { passive: true });
      window.addEventListener("resize", queueScrollFade, { passive: true });
      queueScrollFade();
    }

    // Small, pointer-driven image movement and viewport-bounded scroll drift.
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!motionQuery.matches && finePointer.matches) {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".case"));
      var activeCards = new Set();
      var scrollFrame = 0;
      var updateScrollDrift = function () {
        scrollFrame = 0;
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        activeCards.forEach(function (card) {
          if (card.hidden) return;
          var bounds = card.getBoundingClientRect();
          if (bounds.bottom < 0 || bounds.top > viewportHeight) {
            card.style.setProperty("--scroll-shift", "0px");
            return;
          }
          var distanceFromCenter = (bounds.top + bounds.height / 2) - viewportHeight / 2;
          var drift = Math.max(-9, Math.min(9, -distanceFromCenter * 0.018));
          card.style.setProperty("--scroll-shift", drift.toFixed(1) + "px");
        });
      };
      var queueScrollDrift = function () {
        if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollDrift);
      };

      if ("IntersectionObserver" in window) {
        var motionObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) activeCards.add(entry.target);
            else {
              activeCards.delete(entry.target);
              entry.target.style.setProperty("--scroll-shift", "0px");
            }
          });
          queueScrollDrift();
        }, { rootMargin: "100px 0px" });
        cards.forEach(function (card) { motionObserver.observe(card); });
      } else {
        cards.forEach(function (card) { activeCards.add(card); });
      }
      window.addEventListener("scroll", queueScrollDrift, { passive: true });
      window.addEventListener("resize", queueScrollDrift, { passive: true });

      cards.forEach(function (card) {
        var media = card.querySelector(".case-media");
        if (!media) return;
        media.addEventListener("pointermove", function (event) {
          var bounds = media.getBoundingClientRect();
          var x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
          var y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
          card.style.setProperty("--hover-x", (Math.max(-1, Math.min(1, x)) * 5).toFixed(1) + "px");
          card.style.setProperty("--hover-y", (Math.max(-1, Math.min(1, y)) * 5).toFixed(1) + "px");
        });
        media.addEventListener("pointerleave", function () {
          card.style.setProperty("--hover-x", "0px");
          card.style.setProperty("--hover-y", "0px");
        });
      });

      var hero = document.querySelector(".hero");
      var heroMark = hero && hero.querySelector(".pill-word");
      if (hero && heroMark) {
        hero.addEventListener("pointermove", function (event) {
          var bounds = hero.getBoundingClientRect();
          var x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
          var y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
          heroMark.style.setProperty("--hero-pointer-x", (Math.max(-1, Math.min(1, x)) * 4).toFixed(1) + "px");
          heroMark.style.setProperty("--hero-pointer-y", (Math.max(-1, Math.min(1, y)) * 4).toFixed(1) + "px");
        });
        hero.addEventListener("pointerleave", function () {
          heroMark.style.setProperty("--hero-pointer-x", "0px");
          heroMark.style.setProperty("--hero-pointer-y", "0px");
        });
      }
    }

    // Keep the existing category filter and announce the resulting card count.
    var filterButtons = document.querySelectorAll("[data-filter]");
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.dataset.filter;
        filterButtons.forEach(function (item) {
          item.setAttribute("aria-pressed", String(item === button));
        });
        document.querySelectorAll("#work-list .case").forEach(function (card) {
          card.hidden = !(filter === "all" || card.dataset.cat === filter);
          if (!card.hidden) card.classList.add("in-view");
        });
      });
    });

    // Newsletter demo behavior is retained.
    document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var message = form.parentElement.querySelector(".form-msg");
        var input = form.querySelector("input");
        if (!input.checkValidity()) {
          message.textContent = "Please enter a valid email.";
          input.focus();
          return;
        }
        message.textContent = "Thanks! (Demo form, connect it to Formspree or Netlify Forms.)";
        form.reset();
      });
    });

    // Contact demo validation and confirmation are retained.
    var contact = document.querySelector("form[data-demo-contact]");
    if (contact) {
      contact.addEventListener("submit", function (event) {
        event.preventDefault();
        var valid = true;
        var firstInvalid = null;
        contact.querySelectorAll("input[required]:not([type=radio]), textarea[required]").forEach(function (field) {
          var error = field.parentElement.querySelector(".error");
          var fieldIsValid = field.checkValidity();
          field.setAttribute("aria-invalid", String(!fieldIsValid));
          if (error) error.textContent = fieldIsValid ? "" :
            (field.type === "email" && field.value ? "That email doesn't look right." : "This field is required.");
          if (!fieldIsValid) {
            valid = false;
            firstInvalid = firstInvalid || field;
          }
        });
        var status = contact.querySelector(".form-status");
        if (!valid) {
          firstInvalid.focus();
          status.classList.remove("show");
          return;
        }
        status.textContent = "Thanks, your message is on its way! (This is a demo form: connect it to Formspree or Netlify Forms to receive enquiries.)";
        status.classList.add("show");
        contact.reset();
      });
    }
  });
})();
