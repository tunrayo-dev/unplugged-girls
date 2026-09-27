/* =========================================================
   GIRLS UNPLUGGED
   MAIN SITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initCurrentYear();
  initActiveNavigation();
  initCountUp();
  initFaq();
  initSocialLinks();
  initExternalLinks();
  initRevealAnimations();
});


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".site-nav");

  if (!toggle || !navigation) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(isOpen));

    document.body.classList.toggle("nav-open", isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initCurrentYear() {
  const year = new Date().getFullYear();

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = year;
  });
}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    const linkPage = href.split("/").pop();

    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}


/* =========================================================
   COUNT-UP STATISTICS
   ========================================================= */

function initCountUp() {
  const counters = document.querySelectorAll("[data-counter]");

  if (!counters.length) {
    return;
  }

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.counter);

    if (Number.isNaN(target)) {
      return;
    }

    const suffix = counter.dataset.suffix || "";

    counter.textContent = "0" + suffix;

    if (prefersReducedMotion) {
      counter.textContent = target + suffix;
      return;
    }

    counter.dataset.counted = "false";
  });

  const animateCounter = (counter) => {
    if (counter.dataset.counted === "true") {
      return;
    }

    counter.dataset.counted = "true";

    const target = Number(counter.dataset.counter);
    const suffix = counter.dataset.suffix || "";

    if (Number.isNaN(target)) {
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        easedProgress * target
      );

      counter.textContent =
        currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent =
          target + suffix;
      }
    }

    requestAnimationFrame(update);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35
    }
  );

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}


/* =========================================================
   FAQ ACCORDION
   ========================================================= */

function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) {
    return;
  }

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (!question) {
      return;
    }

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("is-open");

        const otherQuestion =
          otherItem.querySelector(".faq-question");

        if (otherQuestion) {
          otherQuestion.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      });

      if (!isOpen) {
        item.classList.add("is-open");
        question.setAttribute(
          "aria-expanded",
          "true"
        );
      }
    });
  });
}


/* =========================================================
   SOCIAL LINKS
   ========================================================= */

function initSocialLinks() {
  const data = window.GirlsUnpluggedData;

  if (!data || !data.organisation || !data.organisation.social) {
    return;
  }

  const social = data.organisation.social;

  document.querySelectorAll('[data-social="instagram"]').forEach(
    (link) => {
      if (social.instagram) {
        link.href = social.instagram;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
  );

  document.querySelectorAll('[data-social="tiktok"]').forEach(
    (link) => {
      if (social.tiktok) {
        link.href = social.tiktok;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
  );
}


/* =========================================================
   EXTERNAL LINKS
   ========================================================= */

function initExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    const currentHost = window.location.hostname;

    try {
      const targetUrl = new URL(link.href);

      if (
        targetUrl.hostname &&
        targetUrl.hostname !== currentHost
      ) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } catch (error) {
      /* Ignore malformed URLs. */
    }
  });
}


/* =========================================================
   SIMPLE REVEAL ANIMATIONS
   ========================================================= */

function initRevealAnimations() {
  const revealElements =
    document.querySelectorAll("[data-reveal]");

  if (!revealElements.length) {
    return;
  }

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}


/* =========================================================
   UTILITY: ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   UTILITY: FORMAT TEXT
   ========================================================= */

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}


/* =========================================================
   GLOBAL ACCESS FOR OTHER PAGE SCRIPTS
   ========================================================= */

window.GirlsUnpluggedSite = {
  escapeHtml,
  formatNumber
};