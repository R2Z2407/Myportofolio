// =================================================================================
// MAIN APPLICATION OBJECT
// =================================================================================
const portfolioApp = {
  currentLanguage: "idn",
  data: {
    projects: [],
    experiences: [],
    certificates: [],
  },

  // =================================================================================
  // INITIALIZATION
  // =================================================================================
  async init() {
    this.ui.showLoadingScreen();
    this.navbar.init();
    this.languageSwitcher.init();
    this.bindEvents();
    this.utility.revealOnScroll();

    try {
      const [projects, experiences, certificates] = await Promise.all([
        this.api.fetchProjects(),
        this.api.fetchExperiences(),
        this.api.fetchCertificates(),
      ]);

      this.data.projects = projects;
      this.data.experiences = experiences;
      this.data.certificates = certificates;

      this.projects.render(projects);
      this.experiences.render(experiences);
      this.certificates.render(certificates);
      this.projects.populateFilter(projects);
    } catch (error) {
      console.error("Gagal memuat data aplikasi:", error);
    } finally {
      this.ui.hideLoadingScreen();
    }
  },

  // =================================================================================
  // EVENT BINDINGS
  // =================================================================================
  bindEvents() {
    const self = this;
    $(window).on("scroll", () => this.utility.revealOnScroll());
    $("#typeFilter").on("change", () => this.projects.filter());
    $("#modalClose").on("click", () => this.experiences.closeModal());
    $("#enlargedImageContainer").on("click", () =>
      $("#enlargedImageContainer").css("display", "none")
    );
    $("#enlargedCertificateContainer").on("click", function (e) {
      if ($(e.target).closest("a").length) return;
      $(this).hide();
      $("body").removeClass("body-no-scroll");
    });
    $("#see-more-btn").on("click", () => this.certificates.toggleSeeMore());
    $(".fa-envelope").on("click", function (e) {
      e.preventDefault();
      $(this).closest("li").toggleClass("shadow-1 fill-color");
      self.utility.openEmailComposer("gmail");
    });
    $('button:contains("Download CV")').on("click", function () {
      $(this).toggleClass("shadow-1 fill-color");
      self.utility.downloadCV();
      setTimeout(() => $(this).removeClass("shadow-1 fill-color"), 300);
    });
  },

  // =================================================================================
  // API (Data Fetching) MODULE
  // =================================================================================
  api: {
    async fetchExperiences() {
      try {
        const response = await fetch("database/db_experience.json");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching experiences:", error);
        return [];
      }
    },
    async fetchProjects() {
      try {
        const response = await fetch("database/db_project.json");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const projects = await response.json();
        return projects.map((p) => ({
          ...p,
          image_content: p.image_content || "",
          file_content: p.file_content || "No available",
          link_content: p.link_content || "No available",
        }));
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    },
    async fetchCertificates() {
      try {
        const response = await fetch("database/db_sertifikat.json");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const certificates = await response.json();
        return certificates.map((cert) => ({
          name_idn: cert.name_idn || "Nama Sertifikat Tidak Tersedia",
          name_eng: cert.name_eng || "Certificate Name Not Available",
          dir: cert.dir || "default-image.png",
          link: cert.link || "#",
        }));
      } catch (error) {
        console.error("Gagal mengambil data sertifikat:", error);
        return [];
      }
    },
  },

  // =================================================================================
  // NAVBAR MODULE
  // =================================================================================
  navbar: {
    navObserver: null,
    init() {
      this.handleScrollEffects();
      this.handleHamburgerToggle();
      this.handleSmoothScroll();
      this.handleResize();
      this.manageMobileMenuObserver();
      $(window).on("resize", () => this.manageMobileMenuObserver());
    },
    closeMenu() {
      const $navbarMenu = $(".navbar-menu");
      if ($navbarMenu.hasClass("opened")) {
        $navbarMenu.removeClass("opened");
        const $lines = $(".hamburger .line");
        $lines
          .filter(".line1")
          .css({ strokeDasharray: "60 207", strokeDashoffset: "0" });
        $lines
          .filter(".line2")
          .css({ strokeDasharray: "60 60", strokeDashoffset: "0" });
        $lines
          .filter(".line3")
          .css({ strokeDasharray: "60 207", strokeDashoffset: "0" });
      }
    },
    handleScrollEffects() {
      $(window).on("scroll", function () {
        const isScrolled = $(window).scrollTop() > 0;
        if ($(window).width() >= 1024) {
          $("nav").toggleClass("scrolled", isScrolled);
          $(".navbar-brand img").toggleClass("scrolled-img", isScrolled);
        }
      });
    },
    handleHamburgerToggle() {
      $(".hamburger").on("click", () => {
        $(".navbar-menu").toggleClass("opened");
        const isOpen = $(".navbar-menu").hasClass("opened");
        const $lines = $(".hamburger .line");
        $lines
          .filter(".line1")
          .css(
            isOpen
              ? { strokeDasharray: "90 207", strokeDashoffset: "-134" }
              : { strokeDasharray: "60 207", strokeDashoffset: "0" }
          );
        $lines
          .filter(".line2")
          .css(
            isOpen
              ? { strokeDasharray: "1 60", strokeDashoffset: "-30" }
              : { strokeDasharray: "60 60", strokeDashoffset: "0" }
          );
        $lines
          .filter(".line3")
          .css(
            isOpen
              ? { strokeDasharray: "90 207", strokeDashoffset: "-134" }
              : { strokeDasharray: "60 207", strokeDashoffset: "0" }
          );
      });
    },
    handleSmoothScroll() {
      const self = this;
      $("#home-link, .navbar-item, .navbar-item-PC").on(
        "click",
        function (event) {
          event.preventDefault();
          const $clickedLink = $(this);
          if ($clickedLink.is("#home-link")) {
            $("html, body").animate({ scrollTop: 0 }, 500, () => {
              self.closeMenu();
            });
          } else {
            const targetId = $clickedLink.attr("href");
            const $targetElement = $(targetId);
            if ($targetElement.length) {
              $("html, body").animate(
                { scrollTop: $targetElement.offset().top },
                500,
                () => {
                  self.closeMenu();
                }
              );
            }
          }
        }
      );
    },
    handleResize() {
      $(window).on("resize", () => {
        if ($(window).width() > 1024) {
          this.closeMenu();
          $("nav").removeClass("scrolled");
          $(".navbar-brand img").removeClass("scrolled-img");
        }
      });
    },
    pxToVh(pixels) {
      return (pixels * 100) / window.innerHeight;
    },
    manageMobileMenuObserver() {
      const navElement = $("nav")[0];
      const mobileMenu = $(".navbar-menu")[0];
      if (!navElement || !mobileMenu) return;

      if (window.innerHeight <= 600) {
        if (!this.navObserver) {
          this.navObserver = new ResizeObserver((entries) => {
            const navHeightInPx = entries[0].target.offsetHeight;
            const navHeightInVh = this.pxToVh(navHeightInPx);
            const remainingHeightInVh = 100 - navHeightInVh;
            $(mobileMenu).css({
              top: `${navHeightInVh}vh`,
              height: `${remainingHeightInVh}vh`,
            });
          });
          this.navObserver.observe(navElement);
        }
      } else {
        if (this.navObserver) {
          this.navObserver.disconnect();
          this.navObserver = null;
          $(mobileMenu).css({ top: "", height: "" });
        }
      }
    },
  },

  // =================================================================================
  // LANGUAGE SWITCHER (FAB) MODULE
  // =================================================================================
  languageSwitcher: {
    init() {
      const self = this;
      $("#fabToggle").on("click", function (event) {
        event.stopPropagation();
        $("#languageOptions").slideToggle(250).toggleClass("show");
      });
      $(".language-option").on("click", function () {
        const lang = $(this).data("lang");
        self.changeLanguage(lang);
        $("#languageOptions").slideUp(250).removeClass("show");
      });
      $(document).on("click", function () {
        const $options = $("#languageOptions");
        if ($options.hasClass("show")) {
          $options.slideUp(250).removeClass("show");
        }
      });
    },
    changeLanguage(lang) {
      portfolioApp.currentLanguage = lang;
      if (lang === "us") {
        $("[data-eng]").each(function () {
          $(this).html($(this).data("eng"));
        });
        $("#fabToggle").attr("title", "Change Language");
      } else if (lang === "idn") {
        $("[data-idn]").each(function () {
          $(this).html($(this).data("idn"));
        });
        $("#fabToggle").attr("title", "Ganti Bahasa");
      }
    },
  },

  // =================================================================================
  // EXPERIENCES MODULE
  // =================================================================================
  experiences: {
    render(experiences) {
      const $container = $(".experience-container").empty();
      $.each(experiences, (index, experience) => {
        const $card = this.createCard(experience);
        $container.append($card);
      });
    },
    createCard(experience) {
      const truncatedDescription_idn = portfolioApp.utility.truncateText(
        experience.description_content_idn || "Tidak Tersedia Deskripsi",
        25
      );
      const truncatedDescription_eng = portfolioApp.utility.truncateText(
        experience.description_content_eng || "No description available.",
        25
      );
      // PERHATIKAN PERUBAHAN STRUKTUR HTML DI BAWAH INI
      const cardHTML = `
        <div class="property-card2">
            <div class="image-content2">
                <img src="${
                  experience.thumbnail_content || "default-image.png"
                }" alt="${experience.company_content}">
            </div>
            
            <div class="card-text-content">
                <div class="name-content2">
                    <h4>${experience.company_content}</h4>
                </div>
                <div class="position-content2">
                    <i class="fa fa-briefcase"></i>&nbsp;${
                      experience.position_content || "Not Specified"
                    } | ${portfolioApp.utility.formatDateRange(
        experience.average_work_content
      )}
                </div>
                <div class="description-content2">
                    <p data-idn="${truncatedDescription_idn}" data-eng="${truncatedDescription_eng}">${truncatedDescription_idn}</p>
                </div>
            </div>

        </div>
    `;
      const $card = $(cardHTML);
      if (portfolioApp.currentLanguage === "us") {
        $card.find("[data-eng]").each(function () {
          $(this).html($(this).data("eng"));
        });
      }
      $card.on("click", () => this.openModal(experience));
      return $card;
    },
    openModal(experience) {
      $("#modal-image-logo").attr("src", experience.thumbnail_content);
      $("#pdf_viewer").attr("src", experience.file_pdf).show();
      $("#modalCompany").text(experience.company_content);
      $("#modalPosition").text(
        experience.position_content || "Position Not Specified"
      );
      $("#modalWorkDate").text(
        portfolioApp.utility.formatDateRange(experience.average_work_content)
      );
      let descriptionToShow;
      if (portfolioApp.currentLanguage === "us") {
        descriptionToShow =
          experience.description_content_eng || "No description available.";
      } else {
        descriptionToShow =
          experience.description_content_idn || "Deskripsi tidak tersedia.";
      }
      $("#modalDescription").html(descriptionToShow);
      const $modalImages = $("#modalImages").empty();
      $.each(experience.image_content, (index, image) => {
        const $img = $(
          `<img src="${image}" alt="Experience Image" class="modal-image" style="cursor: pointer;">`
        );
        $img.on("click", () => {
          $("#enlargedImage").attr("src", image);
          $("#enlargedImageContainer").css("display", "flex");
        });
        $modalImages.append($img);
      });
      $("body").addClass("body-no-scroll");
      $("#myModal").show();
    },
    closeModal() {
      $("#myModal").hide();
      $("body").removeClass("body-no-scroll");
    },
  },

  // =================================================================================
  // PROJECTS MODULE
  // =================================================================================
  projects: {
    render(projects) {
      const $container = $(".Card").empty();
      projects.forEach((project) => {
        const $card = this.createCard(project);
        $container.append($card);
      });
    },
    createCard(project) {
      const determineFontSizeClass = (text) => {
        const len = text ? text.length : 0;
        if (len <= 50) return "font-size-default";
        if (len <= 75) return "font-size-medium";
        if (len <= 95) return "font-size-small";
        return "font-size-extra-small";
      };
      const nameContent_idn = project.name_content_idn || "Tanpa Nama Proyek";
      const nameContent_eng = project.name_content_eng || "Unnamed Project";
      const descriptionContent_idn =
        project.description_content_idn || "Tidak tersedia deskripsi.";
      const descriptionContent_eng =
        project.description_content_eng || "No description available.";
      const imageUrl =
        project.image_content || "assets/images/thumbnail/Default.png";
      const fontSizeClass = determineFontSizeClass(nameContent_idn);
      const cardHTML = `
            <div class="property-card">
                <div class="image-content">
                    <img src="${imageUrl}" alt="${nameContent_idn}">
                </div>
                <div class="name-content">
                    <h3 class="${fontSizeClass}" data-idn="${nameContent_idn}" data-eng="${nameContent_eng}">${nameContent_idn}</h3>
                </div>
                <div class="description-content">
                    <p data-idn="${descriptionContent_idn}" data-eng="${descriptionContent_eng}">${descriptionContent_idn}</p>
                </div>
                <div class="footer-content">
                    <div class="link-content">
                        ${
                          project.link_content !== "No available"
                            ? `<a href="${project.link_content}" target="_blank" data-idn="Lihat Proyek" data-eng="View Project">Lihat Proyek</a>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
      const $card = $(cardHTML);
      if (portfolioApp.currentLanguage === "us") {
        $card.find("[data-eng]").each(function () {
          $(this).html($(this).data("eng"));
        });
      }
      return $card;
    },
    populateFilter(projects) {
      const $typeFilter = $("#typeFilter");
      const uniqueTypes = [...new Set(projects.map((p) => p.type_content))];
      uniqueTypes.forEach((type) => {
        $typeFilter.append(`<option value="${type}">${type}</option>`);
      });
    },
    filter() {
      const selectedType = $("#typeFilter").val();
      const filtered =
        selectedType === "all"
          ? portfolioApp.data.projects
          : portfolioApp.data.projects.filter(
              (p) => p.type_content === selectedType
            );
      this.render(filtered);
    },
  },

  // =================================================================================
  // CERTIFICATES MODULE
  // =================================================================================
  certificates: {
    render(certificates) {
      const $container = $(".certificate-grid").empty();
      const maxVisibleCards = this.getMaxVisibleCards();
      certificates.forEach((certificate, index) => {
        const $card = this.createCard(certificate);
        if (index >= maxVisibleCards) {
          $card.addClass("hidden");
        }
        $container.append($card);
      });
      $("#see-more-btn").toggle(certificates.length > maxVisibleCards);
    },
    createCard(certificate) {
      // Buat template HTML dalam sebuah variabel
      const cardHTML = `
            <div class="card">
                <img src="${certificate.dir}" alt="${certificate.name_idn}" />
                <p data-idn="${certificate.name_idn}" data-eng="${certificate.name_eng}">
                    ${certificate.name_idn}
                </p>
            </div>
        `;

      // Ubah string HTML menjadi objek jQuery
      const $card = $(cardHTML);

      // Terapkan bahasa yang sedang aktif
      if (portfolioApp.currentLanguage === "us") {
        $card.find("[data-eng]").each(function () {
          $(this).html($(this).data("eng"));
        });
      }

      // Tambahkan event listener dan kembalikan kartu
      $card.on("click", () => this.openEnlarge(certificate));
      return $card;
    },
    openEnlarge(certificate) {
      const $container = $("#enlargedCertificateContainer");
      $container.find("#enlargedCertificateImage").attr("src", certificate.dir);
      $container
        .find("#certificateVerificationLink")
        .attr("href", certificate.link);
      $container
        .find(".certificate-link-container")
        .toggle(!!(certificate.link && certificate.link !== "#"));
      $container.css("display", "flex");
      $("body").addClass("body-no-scroll");
    },
    getVisibleColumns() {
      const width = $(window).width();
      if (width >= 1200) return 4;
      if (width >= 900) return 3;
      if (width >= 600) return 2;
      return 1;
    },
    getMaxVisibleCards() {
      return this.getVisibleColumns() * 2;
    },
    toggleSeeMore() {
      const $grid = $(".certificate-grid");
      const $button = $("#see-more-btn");
      const isExpanded = $grid.hasClass("expanded");
      const lang = portfolioApp.currentLanguage;
      if (isExpanded) {
        const maxVisible = this.getMaxVisibleCards();
        $grid.find(".card").each(function (index) {
          if (index >= maxVisible) {
            $(this).addClass("hidden").removeClass("card-fade-in");
          }
        });
        const textToShow =
          lang === "us" ? $button.data("eng-more") : $button.data("idn-more");
        $button.text(textToShow);
        $("html, body").animate(
          { scrollTop: $("#sertifikat").offset().top },
          500
        );
      } else {
        $grid
          .find(".card.hidden")
          .removeClass("hidden")
          .addClass("card-fade-in");
        const textToShow =
          lang === "us" ? $button.data("eng-less") : $button.data("idn-less");
        $button.text(textToShow);
      }
      $grid.toggleClass("expanded");
    },
  },

  // =================================================================================
  // UI MODULE (Loading, etc.)
  // =================================================================================
  ui: {
    showLoadingScreen() {
      $("body").css("overflow", "hidden");
      $("#loading-overlay").show();
    },
    hideLoadingScreen() {
      const $loadingOverlay = $("#loading-overlay");
      $loadingOverlay.addClass("hidden");
      $loadingOverlay.on("transitionend", function () {
        //$("#main-content").addClass("visible"); // main-content is not defined in the HTML
        $(".fab-wrapper").addClass("visible");
        $("body").css("overflow", "auto");
        $("#wipe-rect-stroke, #wipe-rect-fill").css("animation", "none");
        $(this).hide();
      });
    },
  },

  // =================================================================================
  // UTILITY MODULE
  // =================================================================================
  utility: {
    formatDateRange(dateRange) {
      if (!dateRange) return "Date Working Not Specified";
      const [startDateStr, endDateStr] = dateRange.split(" - ");
      const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split("/").map(Number);
        const shortMonthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return `${day} ${shortMonthNames[month - 1]} ${year}`;
      };
      return `${formatDate(startDateStr)} - ${formatDate(endDateStr)}`;
    },
    truncateText(text, maxWords) {
      const words = (text || "").split(" ");
      return words.length <= maxWords
        ? text
        : words.slice(0, maxWords).join(" ") + " ...";
    },
    downloadCV() {
      const cvPath_idn = "assets/CV/Rijal_Rahman_Zuhri-CV_IDN.pdf";
      const cvPath_eng = "assets/CV/Rijal_Rahman_Zuhri-CV_ENG.pdf";
      let selectedPath;
      let selectedFileName;
      if (portfolioApp.currentLanguage === "us") {
        // Jika bahasa Inggris, gunakan versi Inggris
        selectedPath = cvPath_eng;
      } else {
        // Jika tidak (atau defaultnya Indonesia), gunakan versi Indonesia
        selectedPath = cvPath_idn;
      }
      const link = document.createElement("a");
      link.href = selectedPath;
      link.download = "Rijal_Rahman_Zuhri_CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    openEmailComposer(platform = "gmail") {
      const email = "rijalrzuhri247@gmail.com";
      const subject = "Message from Website";
      const body = "Hello, I want to talk to you ...";
      let mailtoLink;
      if (platform === "gmail") {
        mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
      } else {
        mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
      }
      window.open(mailtoLink, "_blank");
    },
    revealOnScroll() {
      const windowHeight = $(window).height();
      const windowScrollTop = $(window).scrollTop();
      $(".reveal").each(function () {
        const $element = $(this);
        const elementTop = $element.offset().top;
        if (elementTop < windowScrollTop + windowHeight - 50) {
          $element.addClass("visible");
        } else {
          $element.removeClass("visible");
        }
      });
    },
  },
};

// =================================================================================
// DOCUMENT READY
// =================================================================================
$(document).ready(function () {
  portfolioApp.init();
});
