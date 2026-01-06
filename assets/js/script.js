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
      if (window.innerWidth >= 768 && stickyLogo) {
        stickyLogo.style.display = "flex";
      }
    } else {
      nav.classList.remove("sticky");
    }
  };
  window.addEventListener("scroll", handleScroll);

  // --- Mobile Nav Toggle ---
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const navContent = document.getElementById("nav-content");
  const openIcon = document.querySelector(".nav-icon-open");
  const closeIcon = document.querySelector(".nav-icon-close");

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", () => {
      navContent.classList.toggle("active");
      const isActive = navContent.classList.contains("active");
      openIcon.style.display = isActive ? "none" : "block";
      closeIcon.style.display = isActive ? "block" : "none";
    });
  }

  document.querySelectorAll(".premierappliances__nav--item").forEach((item) => {
    item.addEventListener("click", () => {
      if (navContent) navContent.classList.remove("active");
      if (openIcon) openIcon.style.display = "block";
      if (closeIcon) closeIcon.style.display = "none";
    });
  });

  // --- Vendors Swiper Logic ---
  const vendorsWrapper = document.getElementById("vendors-wrapper");
  if (vendorsWrapper && vendors) {
    vendors.forEach((v) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
            <div class="premierappliances__vendor">
                <img src="${v.image}" alt="${v.name}" />
            </div>
        `;
      vendorsWrapper.appendChild(slide);
    });

    // Initialize Swiper (No modules array needed for bundle)
    new Swiper(".vendors-swiper", {
      slidesPerView: "auto",
      slidesPerGroup: 1,
      loop: true,
      centeredSlides: true,
      pagination: {
        el: ".vendorsSwiper__pagination",
        clickable: true,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      spaceBetween: 25,
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
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

    // Update Swiper Visibility
    document
      .querySelectorAll(".premierappliances__package--swiper-wrapper")
      .forEach((el, idx) => {
        if (idx === activePackageIndex) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
  };

  // 1. Render Buttons
  const renderButtons = () => {
    packages.forEach((p, index) => {
      const btnWrapper = document.getElementById(`btn-wrapper-${p.tier}`);
      if (btnWrapper) {
        const btn = document.createElement("button");
        btn.className = `premierappliances__packages--btn ${
          index === activePackageIndex ? "active" : ""
        }`;
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
      swiperWrapper.className = `premierappliances__swiper premierappliances__package--swiper-wrapper ${
        index === activePackageIndex ? "active" : ""
      }`;
      swiperWrapper.id = `package-swiper-${index}`;

      let slidesHtml = "";
      p.items.forEach((item) => {
        slidesHtml += `
            <div class="swiper-slide" style="width: 100%;">
                <div class="premierappliances__package">
                    <div class="premierappliances__package--image">
                        <img src="${
                          item.image
                        }" style="max-height:300px; width:auto;" alt="${
          item.modelNumber
        }" />
                    </div>
                    <div class="premierappliances__package--description">
                        <p class="text-bold">${item.modelNumber}</p>
                        <p>${item.description}</p>
                        ${
                          item.pdf && item.pdf !== "#"
                            ? `<a href="${item.pdf}" target="_blank" rel="noreferrer" class="premierappliances__package--btn">View Specs</a>`
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
