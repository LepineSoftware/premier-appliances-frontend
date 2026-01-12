import packages from "./packages.js";
import vendors from "./vendors.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- Initialization ---
  if (typeof AOS !== "undefined") {
    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      offset: 0,
      duration: 300,
      disable: "mobile",
    });
  }

  // --- Sticky Nav Logic ---
  const nav = document.getElementById("main-nav");
  const hero = document.querySelector("#hero");
  const stickyLogo = document.querySelector(".sticky-logo");

  const handleScroll = () => {
    if (!hero) return;
    const heroHeight = hero.getBoundingClientRect().height;
    if (window.scrollY > heroHeight + 50) {
      nav.classList.add("sticky");
      if (window.innerWidth >= 1280 && stickyLogo) {
        stickyLogo.style.display = "flex";
      }
    } else {
      nav.classList.remove("sticky");
      // stickyLogo handling if needed when not sticky
      if (stickyLogo) stickyLogo.style.display = ""; // Reset
    }
  };
  window.addEventListener("scroll", handleScroll);

  // --- Mobile Nav Toggle ---
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const navContent = document.getElementById("nav-content");
  const openIcon = document.querySelector(".nav-icon-open");
  const closeIcon = document.querySelector(".nav-icon-close");

  const toggleNavState = (isActive) => {
    if (isActive) {
      navContent.classList.add("active");
      if (openIcon) openIcon.style.display = "none";
      if (closeIcon) closeIcon.style.display = "block";
    } else {
      navContent.classList.remove("active");
      if (openIcon) openIcon.style.display = "block";
      if (closeIcon) closeIcon.style.display = "none";
    }
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", () => {
      const isActive = !navContent.classList.contains("active");
      toggleNavState(isActive);
    });
  }

  // CLOSE NAV WHEN LINK IS CLICKED
  document.querySelectorAll(".premierappliances__nav--item").forEach((item) => {
    item.addEventListener("click", () => {
      toggleNavState(false); // Force close
    });
  });

  // Safety: Ensure mobile menu closes if window is resized to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1280 && navContent.classList.contains("active")) {
      toggleNavState(false);
    }
  });

  // --- Vendors Swiper Logic ---
  const vendorsWrapper = document.getElementById("vendors-wrapper");
  if (vendorsWrapper && vendors) {
    vendors.forEach((v) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
            <div class="premierappliances__vendor h-[150px] w-[300px] flex justify-center items-center m-auto">
                <img src="${v.image}" alt="${v.name}" class="h-3/4 w-3/4 object-contain object-center" />
            </div>
        `;
      vendorsWrapper.appendChild(slide);
    });

    // Initialize Swiper (No modules array needed for bundle)
    new Swiper(".vendors-swiper", {
      // Layout
      slidesPerView: "auto", // Allows us to define width in CSS
      spaceBetween: 250, // Space between logos (in px)
      centeredSlides: true, // Keeps the active item in the center
      loop: true, // Infinite looping

      // Autoplay configuration
      autoplay: {
        delay: 2500, // Time in ms before sliding
        disableOnInteraction: false, // Continue autoplay even after user swipes
      },

      // Disable Navigation and Pagination
      navigation: false,
      pagination: false,
    });
  }

  // --- Packages Logic ---
  let activePackageIndex = 0;
  const swiperContainer = document.getElementById("packages-swiper-container");

  const updateUI = () => {
    // Update Buttons
    document
      .querySelectorAll(".premierappliances__packages--btn")
      .forEach((btn) => {
        if (parseInt(btn.dataset.index) === activePackageIndex) {
          // Active State: Gold bg, White text, Gold border
          btn.classList.add("bg-pa-gold", "text-white", "border-pa-gold");
          btn.classList.remove("bg-white", "text-gray-400", "border-gray-300");
        } else {
          // Inactive State: White bg, Grey text, Grey outline
          btn.classList.remove("bg-pa-gold", "text-white", "border-pa-gold");
          btn.classList.add("bg-white", "text-gray-400", "border-gray-300");
        }
      });

    // Update Swiper Visibility
    document
      .querySelectorAll(".premierappliances__package--swiper-wrapper")
      .forEach((el, idx) => {
        if (idx === activePackageIndex) {
          // Show with Animation
          el.classList.remove("hidden");
          el.classList.add("block", "animate-swiperFade");
          // Also need to set col-start/end due to grid
          el.classList.add("col-start-2", "col-end-12");
        } else {
          // Hide
          el.classList.add("hidden");
          el.classList.remove(
            "block",
            "animate-swiperFade",
            "col-start-2",
            "col-end-12"
          );
        }
      });
  };

  // 1. Render Buttons
  const renderButtons = () => {
    packages.forEach((p, index) => {
      const btnWrapper = document.getElementById(`btn-wrapper-${p.tier}`);
      if (btnWrapper) {
        const btn = document.createElement("button");
        // Base Tailwind Classes (Removed 'text-white' and 'border-none')
        const baseClasses =
          "premierappliances__packages--btn w-full p-4 rounded font-medium uppercase hover:brightness-95 transition-all border cursor-pointer";

        // Initial State
        const stateClasses =
          index === activePackageIndex
            ? "bg-pa-gold text-white border-pa-gold"
            : "bg-white text-gray-400 border-gray-300";

        btn.className = `${baseClasses} ${stateClasses}`;
        btn.dataset.index = index;
        btn.innerText = p.name;
        btn.addEventListener("click", () => {
          activePackageIndex = index;
          updateUI();
        });
        btnWrapper.appendChild(btn);
      }
    });
  };

  // 2. Render Swipers (One for each package, toggle visibility)
  const renderSwipers = () => {
    if (!swiperContainer) return;
    swiperContainer.innerHTML = "";

    packages.forEach((p, index) => {
      const swiperWrapper = document.createElement("div");
      // Base classes + initial visibility
      const visibilityClass =
        index === activePackageIndex
          ? "block animate-swiperFade col-start-2 col-end-12"
          : "hidden";
      swiperWrapper.className = `premierappliances__swiper premierappliances__package--swiper-wrapper w-full py-8 ${visibilityClass}`;
      swiperWrapper.id = `package-swiper-${index}`;

      let slidesHtml = "";
      p.items.forEach((item) => {
        slidesHtml += `
            <div class="swiper-slide" style="width: 100%;">
                <div class="premierappliances__package flex flex-col justify-center items-center gap-4 w-full max-w-[400px] h-[500px] m-auto">
                    <div class="premierappliances__package--image flex justify-center items-center">
                        <img src="${
                          item.image
                        }" style="max-height:300px; width:auto;" class="object-contain object-center h-[300px] w-[300px]" alt="${
          item.modelNumber
        }" />
                    </div>
                    <div class="premierappliances__package--description flex flex-col justify-center items-center gap-2 px-8 text-center h-full">
                        <p class="font-bold">${item.modelNumber}</p>
                        <p>${item.description}</p>
                        ${
                          item.pdf && item.pdf !== "#"
                            ? `<a href="${item.pdf}" target="_blank" rel="noreferrer" class="premierappliances__package--btn text-pa-gold border-2 border-pa-gold rounded p-2 mt-auto transition-all no-underline hover:bg-pa-gold hover:text-white hover:font-bold">View Specs</a>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
      });

      swiperWrapper.innerHTML = `
            <div class="swiper swiper-package-${index}">
                <div class="swiper-wrapper">
                    ${slidesHtml}
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        `;
      swiperContainer.appendChild(swiperWrapper);

      // Init Swiper for this specific package
      new Swiper(`.swiper-package-${index}`, {
        slidesPerView: "auto",
        loop: p.name !== "Standalone Upgrades",
        centeredSlides: p.name !== "Standalone Upgrades",
        autoplay: {
          delay: 2500,
          disableOnInteraction: true,
        },
        navigation: {
          nextEl: `.swiper-package-${index} .swiper-button-next`,
          prevEl: `.swiper-package-${index} .swiper-button-prev`,
        },
        spaceBetween: 25,
      });
    });
  };

  if (packages && packages.length > 0) {
    renderButtons();
    renderSwipers();
  }

  // --- Contact Popup Logic ---
  const contactTrigger = document.getElementById("contact-trigger");
  const contactPopup = document.getElementById("contact-popup");
  const popupClose = document.getElementById("popup-close");
  const body = document.querySelector("body");

  const togglePopup = (isActive) => {
    if (!contactPopup) return;
    if (isActive) {
      contactPopup.classList.add("active");
      body.classList.add("noscroll");
    } else {
      contactPopup.classList.remove("active");
      body.classList.remove("noscroll");
    }
  };

  if (contactTrigger)
    contactTrigger.addEventListener("click", () => togglePopup(true));
  if (popupClose)
    popupClose.addEventListener("click", () => togglePopup(false));

  // --- Form Submission Logic ---
  const handleFormSubmit = async (e, formId) => {
    e.preventDefault();
    const form = document.getElementById(formId);
    if (!form) return;

    const responseEl = form.querySelector(".form-response");
    const submitBtn = form.querySelector('button[type="submit"]');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic Validation
    if (!data.name || !data.email) {
      responseEl.innerText = "Please provide a name and an email";
      return;
    }

    responseEl.innerText = "Submitting your inquiry...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(
        "https://lepineapartments.com/api/premierappliances/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const resData = await response.json();
        responseEl.innerText =
          resData.message || "Thank you! Your inquiry has been received.";
        form.reset();
        setTimeout(() => {
          responseEl.innerText = "";
          if (formId === "contact-form-popup") {
            togglePopup(false);
          }
        }, 2500);
      } else {
        const errorData = await response.json();
        responseEl.innerText =
          errorData.error || "Something went wrong. Please try again.";
      }
    } catch (error) {
      responseEl.innerText =
        "Something went wrong! Please email info@premierappliances.ca";
      console.error(error);
    } finally {
      submitBtn.disabled = false;
    }
  };

  const mainForm = document.getElementById("contact-form-main");
  if (mainForm) {
    mainForm.addEventListener("submit", (e) =>
      handleFormSubmit(e, "contact-form-main")
    );
  }

  const popupForm = document.getElementById("contact-form-popup");
  if (popupForm) {
    popupForm.addEventListener("submit", (e) =>
      handleFormSubmit(e, "contact-form-popup")
    );
  }
});
