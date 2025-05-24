// Gabungan Script: Navbar Responsif dan Project Rendering

// Fungsi untuk mengatur navbar berdasarkan ukuran layar
function setupNavbarResponsive() {
  const nav = document.querySelector("nav");
  const logo = document.querySelector(".navbar-brand img");
  const navbarMenu = document.querySelector(".navbar-menu");
  const hamburger = document.querySelector(".hamburger");

  // Fungsi untuk menutup navbar menu
  function closeNavbarMenu() {
    if (navbarMenu.classList.contains("opened")) {
      navbarMenu.classList.remove("opened");

      // Reset animasi hamburger
      const line1 = document.querySelector(".line1");
      const line2 = document.querySelector(".line2");
      const line3 = document.querySelector(".line3");

      line1.style.strokeDasharray = "60 207";
      line1.style.strokeDashoffset = "0";
      line2.style.strokeDasharray = "60 60";
      line2.style.strokeDashoffset = "0";
      line3.style.strokeDasharray = "60 207";
      line3.style.strokeDashoffset = "0";
    }
  }

  // Fungsi scroll untuk layar besar (>= 1024px)
  function handleLargeScreenScroll() {
    window.addEventListener("scroll", function () {
      if (window.innerWidth >= 1024) {
        if (window.scrollY > 0) {
          nav.classList.add("scrolled");
          logo.classList.add("scrolled-img");
        } else {
          nav.classList.remove("scrolled");
          logo.classList.remove("scrolled-img");
        }
      } else {
        // Reset styling untuk layar kecil
        nav.classList.remove("scrolled");
        logo.classList.remove("scrolled-img");
      }
    });
  }

  // Fungsi toggle menu hamburger
  function setupHamburgerMenu() {
    hamburger.addEventListener("click", function () {
      console.log("Hamburger Clicked");
      navbarMenu.classList.toggle("opened");

      console.log("Navbar Menu Opened:", navbarMenu.classList.contains("opened"));

      const line1 = document.querySelector(".line1");
      const line2 = document.querySelector(".line2");
      const line3 = document.querySelector(".line3");

      if (navbarMenu.classList.contains("opened")) {
        line1.style.strokeDasharray = "90 207";
        line1.style.strokeDashoffset = "-134";
        line2.style.strokeDasharray = "1 60";
        line2.style.strokeDashoffset = "-30";
        line3.style.strokeDasharray = "90 207";
        line3.style.strokeDashoffset = "-134";
      } else {
        line1.style.strokeDasharray = "60 207";
        line1.style.strokeDashoffset = "0";
        line2.style.strokeDasharray = "60 60";
        line2.style.strokeDashoffset = "0";
        line3.style.strokeDasharray = "60 207";
        line3.style.strokeDashoffset = "0";
      }
    });
  }

  // Fungsi smooth scroll untuk semua layar
  function setupSmoothScroll() {
    // Smooth scroll to top saat beranda diklik
    document.getElementById("home-link").addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Tutup navbar menu
      closeNavbarMenu();
    });

    // Smooth scroll untuk item navbar
    document.querySelectorAll(".navbar-item").forEach((item) => {
      item.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        event.preventDefault();

        // Scroll ke elemen yang dituju
        document.querySelector(targetId).scrollIntoView({
          behavior: "smooth",
        });

        // Tutup navbar menu
        closeNavbarMenu();
      });
    });
  }

  // Fungsi reset menu saat resize
  function setupResizeHandler() {
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) {
        navbarMenu.classList.remove("opened");
        // Reset styling untuk layar besar
        nav.classList.remove("scrolled");
        logo.classList.remove("scrolled-img");
      }
    });
  }

  // Fungsi untuk toggle shadow dan fill pada icon kontak
  function setupContactIcons() {
    // Menggunakan jQuery untuk toggle icon
    $(".first li").click(function () {
      $(this).toggleClass("shadow-1").siblings();
      $(this).toggleClass("fill-color").siblings();
    });
  }

  // Inisialisasi semua fungsi navbar
  handleLargeScreenScroll();
  setupHamburgerMenu();
  setupSmoothScroll();
  setupResizeHandler();
  setupContactIcons();
}

// Fungsi untuk mengambil data project dari API
async function fetchProjects() {
  try {
    // Tambahkan error handling yang lebih detail
    const response = await fetch("database/db_project.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const projects = await response.json();
    return projects.map((project) => ({
      ...project,
      // Normalisasi data untuk menghindari undefined
      image_content: project.image_content || "",
      file_content: project.file_content || "#",
      link_content: project.link_content || "#",
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Fungsi untuk mengambil data project2 dari API
async function fetchProjects2() {
  try {
    const response = await fetch("database/db_project2.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const projects = await response.json();
    return projects.map((project) => ({
      ...project,
      image_content: project.image_content || "",
      description_short: project.description_content ? (project.description_content.length > 100 ? project.description_content.substring(0, 100) + "..." : project.description_content) : "...",
    }));
  } catch (error) {
    console.error("Error fetching projects2:", error);
    return [];
  }
}

// Fungsi untuk mengisi dropdown filter berdasarkan type_content
function populateProjectFilter(projects) {
  const typeFilter = document.getElementById("typeFilter");

  // Ambil unique type_content
  const uniqueTypes = [...new Set(projects.map((project) => project.type_content))];

  // Tambahkan opsi untuk setiap tipe
  uniqueTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

// Fungsi untuk mengisi dropdown filter project2
function populateProjectFilter2(projects) {
  const typeFilter = document.getElementById("typeFilter2");
  typeFilter.innerHTML = ""; // Bersihkan filter sebelumnya

  // Tambahkan opsi "All"
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Projects";
  typeFilter.appendChild(allOption);

  // Ambil unique type_content
  const uniqueTypes = [...new Set(projects.map((project) => project.type_content).filter(Boolean))];

  // Tambahkan opsi untuk setiap tipe
  uniqueTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

function getProjectImage(project) {
  // Cek apakah image_content valid
  if (project.image_content && project.image_content.trim() !== "") {
    return project.image_content;
  }

  // Jika tidak ada gambar, kembalikan warna abu-abu
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "property-card";

  // Fungsi untuk menentukan kelas font berdasarkan panjang teks
  function determinefontSizeClass(text) {
    if (text.length <= 50) {
      return "font-size-default";
    } else if (text.length <= 75) {
      return "font-size-medium";
    } else if (text.length <= 95) {
      return "font-size-small";
    } else {
      return "font-size-extra-small";
    }
  }

  // Buat elemen nama dengan kelas font yang sesuai
  const nameElement = document.createElement("h3");
  nameElement.textContent = project.name_content;
  nameElement.className = determinefontSizeClass(project.name_content);

  card.innerHTML = `
        <div class="image-content">
            <img src="${getProjectImage(project)}" alt="${project.name_content}">
        </div>
        <div class="name-content">
            <!-- Nama akan diatur oleh fungsi di atas -->
        </div>
        <div class="description-content">
            <p>${project.description_content}</p>
        </div>
        <div class="footer-content">
            <div class="file-content">
                <a href="${project.file_content}" download>Download</a>
            </div>
            <div class="link-content">
                <a href="${project.link_content}" target="_blank">View Project</a>
            </div>
        </div>
    `;

  // Tambahkan elemen nama ke dalam kontainer
  const nameContentDiv = card.querySelector(".name-content");
  nameContentDiv.appendChild(nameElement);

  return card;
}

// Fungsi untuk membuat project card2
function createProjectCard2(project) {
  const card = document.createElement("div");
  card.className = "property-card2";
  card.dataset.projectId = project.id;

  card.innerHTML = `
        <div class="image-content2">
            <img src="${getProjectImage(project)}" alt="${project.name_content || "Project Image"}">
        </div>
        <div class="name-content2">
            <h3>${project.name_content || "Unnamed Project"}</h3>
        </div>
        <div class="position-content2">
            <p>${project.position_content || "Position Not Specified"}</p>
        </div>
        <div class="description-content2">
            <p>${project.description_short}</p>
        </div>
    `;

  // Tambahkan event listener untuk membuka modal
  card.addEventListener("click", () => openProjectModal(project));

  return card;
}

// Fungsi untuk membuat modal project
function createProjectModal(project) {
  const modal = document.createElement("div");
  modal.className = "project-modal";
  modal.innerHTML = `
        <div class="project-modal-content">
            <span class="project-modal-close">&times;</span>
            <div class="project-modal-image">
                <img src="${getProjectImage(project)}" alt="${project.name_content}">
            </div>
            <div class="project-modal-details">
                <h2>${project.name_content}</h2>
                <h3>${project.position_content}</h3>
                <p>${project.description_content}</p>
                <div class="project-modal-links">
                    ${project.link_content ? `<a href="${project.link_content}" target="_blank">View Project</a>` : ""}
                    ${project.file_content ? `<a href="${project.file_content}" download>Download</a>` : ""}
                </div>
            </div>
        </div>
    `;

  // Tambahkan event listener untuk menutup modal
  const closeButton = modal.querySelector(".project-modal-close");
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  return modal;
}

// CSS tambahan
const additionalCSS = `
.property-card .image-content {
    width: 100%;
    height: 250px;
    background-color: #E0E0E0; /* Warna abu-abu terang */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.property-card .image-content img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
`;

// Fungsi untuk merender project cards
function renderProjects(projects) {
  const cardContainer = document.querySelector(".Card");
  cardContainer.innerHTML = ""; // Bersihkan kontainer sebelum render

  projects.forEach((project) => {
    const projectCard = createProjectCard(project);
    cardContainer.appendChild(projectCard);
  });
}

// Fungsi untuk merender project cards2
function renderProjects2(projects) {
  const cardContainer = document.querySelector(".Card2");
  cardContainer.innerHTML = ""; // Bersihkan kontainer sebelum render

  projects.forEach((project) => {
    const projectCard = createProjectCard2(project);
    cardContainer.appendChild(projectCard);
  });
}

// Fungsi filter project berdasarkan type
function filterProjects() {
  const typeFilter = document.getElementById("typeFilter");
  const selectedType = typeFilter.value;

  const projects = JSON.parse(localStorage.getItem("projects")) || [];

  const filteredProjects = selectedType === "all" ? projects : projects.filter((project) => project.type_content === selectedType);

  renderProjects(filteredProjects);
}

// Inisialisasi utama untuk project
async function initProjects() {
  try {
    // Ambil projects
    const projects = await fetchProjects();

    // Simpan di localStorage untuk filter
    localStorage.setItem("projects", JSON.stringify(projects));

    // Isi dropdown filter
    populateProjectFilter(projects);

    // Render semua projects
    renderProjects(projects);

    // Tambahkan event listener untuk filter
    document.getElementById("typeFilter").addEventListener("change", filterProjects);
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

// Inisialisasi utama untuk project2
async function initProjects2() {
  try {
    const projects = await fetchProjects2();

    if (projects.length === 0) {
      const cardContainer = document.querySelector(".Card2");
      cardContainer.innerHTML = "<p>No projects found.</p>";
      return;
    }

    localStorage.setItem("projects2", JSON.stringify(projects));

    populateProjectFilter2(projects);
    renderProjects2(projects);

    document.getElementById("typeFilter2").addEventListener("change", filterProjects2);
  } catch (error) {
    console.error("Initialization error:", error);
    const cardContainer = document.querySelector(".Card2");
    cardContainer.innerHTML = "<p>Error loading projects. Please try again later.</p>";
  }
}

function downloadCV() {
  const cvPath = "assets/CV/Rijal_Rahman_Zuhri-CV.pdf";

  // Tambahkan log untuk debugging
  console.log("Attempting to download CV from:", cvPath);

  fetch(cvPath)
    .then((response) => {
      // Tambahkan log status response
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      // Tambahkan log ukuran blob
      console.log("Blob size:", blob.size);

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Rijal_Rahman_Zuhri_CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      // Log error detail
      console.error("Full error details:", error);

      // Tambahkan pemeriksaan path file
      const checkFileExists = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("HEAD", cvPath, true);
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(true);
          } else {
            reject(false);
          }
        };
        xhr.onerror = () => reject(false);
        xhr.send();
      });

      checkFileExists
        .then((exists) => {
          if (exists) {
            alert("File CV ditemukan, tetapi gagal didownload. Cek konfigurasi server.");
          } else {
            alert("Maaf, CV tidak dapat didownload saat ini.");
          }
        })
        .catch(() => {
          alert("Maaf, CV tidak dapat didownload saat ini.");
        });
    });
}

// Alternatif metode download
function downloadCVAlternative() {
  const cvPath = "assets/CV/Rijal_Rahman_Zuhri-CV.pdf";

  // Metode window.location
  window.location.href = cvPath;
}

function openEmailComposer(platform = "gmail") {
  const email = "rijalrzuhri247@gmail.com";
  const subject = "Messange from Website";
  const body = "Hello, I want to talk you ...";

  // Konstruksi URL berbeda untuk platform
  let mailtoLink;
  switch (platform) {
    case "gmail":
      mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      break;
    case "outlook":
      mailtoLink = `https://outlook.office.com/mail/deeplink/compose?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      break;
    default:
      mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // Buka jendela email
  window.open(mailtoLink, "_blank");

  // Opsional: Tracking
  trackEmailClick();
}

// Fungsi tracking sederhana
function trackEmailClick() {
  console.log("Email link clicked");
}

// Jalankan setup saat dokumen siap
$(document).ready(function () {
  // Inisialisasi navbar
  setupNavbarResponsive();

  // Inisialisasi project
  initProjects();

  // Inisialisasi project2
  initProjects2();

  $(".fa-envelope").on("click", function (e) {
    e.preventDefault();

    // Toggle shadow dan fill
    $(this).closest("li").toggleClass("shadow-1").toggleClass("fill-color");

    // Buka email composer
    openEmailComposer("gmail");
  });

  $('button:contains("Download CV")').on("click", function () {
    // Toggle shadow dan fill
    $(this).toggleClass("shadow-1").toggleClass("fill-color");
    // Coba metode fetch terlebih dahulu
    downloadCV();
    // Kembalikan ke state semula setelah beberapa saat
    setTimeout(() => {
      $(this).removeClass("shadow-1").removeClass("fill-color");
    }, 300);
  });
});
