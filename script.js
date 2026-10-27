const menuToggle = document.querySelector(".menu-toggle");

const siteNav = document.querySelector(".site-nav");

 

menuToggle?.addEventListener("click", () => {

  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));

  menuToggle.setAttribute("aria-label", isOpen ? "Navigation öffnen" : "Navigation schließen");

  siteNav?.classList.toggle("is-open", !isOpen);

});

 

siteNav?.querySelectorAll("a").forEach((link) => {

  link.addEventListener("click", () => {

    menuToggle?.setAttribute("aria-expanded", "false");

    menuToggle?.setAttribute("aria-label", "Navigation öffnen");

    siteNav.classList.remove("is-open");

  });

});

 

document.querySelector("#year").textContent = String(new Date().getFullYear());

 

const apparelSection = document.querySelector(".apparel-scroll");

const partnerMarks = [...document.querySelectorAll("[data-partner-mark]")];

const partnerProgress = document.querySelector("[data-partner-progress]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

 

if (apparelSection && partnerMarks.length) {

  let animationFrame = 0;

 

  const updatePartnerMarks = () => {

    animationFrame = 0;

    const scrollRange = Math.max(1, apparelSection.offsetHeight - window.innerHeight);

    const progress = Math.max(0, Math.min(1, -apparelSection.getBoundingClientRect().top / scrollRange));

    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    const zoomEnd = 0.28;

    const holdEnd = 0.68;

    const maximumScale = isMobile ? 1.72 : 1.45;

    let suitScale;

 

    if (prefersReducedMotion) {

      suitScale = 1;

    } else if (progress < zoomEnd) {

      suitScale = 1.12 + (maximumScale - 1.12) * (progress / zoomEnd);

    } else if (progress < holdEnd) {

      suitScale = maximumScale;

    } else {

      const shrinkProgress = (progress - holdEnd) / (1 - holdEnd);

      const finalScale = isMobile ? 1.32 : 0.92;

      suitScale = maximumScale + (finalScale - maximumScale) * shrinkProgress;

    }

 

    const verticalShift = prefersReducedMotion || !isMobile

      ? 0

      : progress < zoomEnd

        ? 14 * (1 - progress / zoomEnd)

        : progress < holdEnd

          ? 0

          : 0;

    const copyOpacity = prefersReducedMotion || !isMobile

      ? 1

      : Math.max(0, 1 - progress / 0.24);

 

    apparelSection.style.setProperty("--suit-scale", suitScale.toFixed(3));

    apparelSection.style.setProperty("--suit-y", `${verticalShift.toFixed(2)}vh`);

    apparelSection.style.setProperty("--apparel-copy-opacity", copyOpacity.toFixed(3));

    apparelSection.style.setProperty("--apparel-copy-y", `${(-10 * (1 - copyOpacity)).toFixed(2)}px`);

    let visibleCount = 0;

 

    partnerMarks.forEach((mark) => {

      const visible = prefersReducedMotion || progress >= Number(mark.dataset.revealAt);

      mark.classList.toggle("is-visible", visible);

      if (visible) visibleCount += 1;

    });

 

    if (partnerProgress) {

      partnerProgress.textContent = `${visibleCount} von ${partnerMarks.length} Partnerflächen`;

    }

  };

 

  const schedulePartnerUpdate = () => {

    if (animationFrame) return;

    animationFrame = window.requestAnimationFrame(updatePartnerMarks);

  };

 

  if (prefersReducedMotion) {

    updatePartnerMarks();

  } else {

    const observer = new IntersectionObserver(([entry]) => {

      if (entry.isIntersecting) {

        updatePartnerMarks();

        window.addEventListener("scroll", schedulePartnerUpdate, { passive: true });

        window.addEventListener("resize", schedulePartnerUpdate);

      } else {

        window.removeEventListener("scroll", schedulePartnerUpdate);

        window.removeEventListener("resize", schedulePartnerUpdate);

      }

    });

 

    observer.observe(apparelSection);

  }

}
