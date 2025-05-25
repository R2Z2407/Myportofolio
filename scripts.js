// Static JSON data for experiences
const experienceData = [
  {
    type_content: "Magang",
    company_content: "Panasonic Manufacturing Indonesia",
    thumbnail_content: "assets/images/panasonic/1.png",
    image_content: ["assets/images/panasonic/2.jpg", "assets/images/panasonic/3.jpg", "assets/images/panasonic/4.jpg", "assets/images/panasonic/5.png"],
    position_content: "Quality Control",
    average_work_content: "22/06/2023 - 31/07/2023",
    description_content:
      "Pada magang ini, saya mempelajari incoming quality control dan product quality control.Dalam divisi incoming quality control mendapatkan tugas memeriksa komponen produk dari pemasok dan produksi internal seperti bahan plastik, logam, dan kabel. Product quality control bertugas dalam mengukur diameter shaft, memeriksa belitan stator, dan memverifikasi teganagan serta arus pada stator. Selain itu, saya menganalisis kecacatan pada rotor. Pada prosesnya, saya menggunakan metode DMAIC dalam menganalisis kecacatan tersebut. Hasil dari analisis yaitu terdapat ketidaksesuaian ukuran shaft akibat mesin gerinding bagian pemasukan shaft yang tidak sesuai kedatatarannya yang membuat shaft seharusnya masuk secara bertahap. Namun, kenyataanya tidak dapat masuk ke dalam mesin tersebut,",
  },
  {
    type_content: "Magang",
    company_content: "GMF Aeroasia",
    thumbnail_content: "assets/images/gmf/1.webp",
    image_content: ["assets/images/gmf/1.webp"],
    position_content: "IoT Project",
    average_work_content: "04/09/2023 - 18/12/2023",
    description_content:
      "Magang ini merupakan magang berbasis proyek. Tugas saya yaitu membuat prototype berskala laboratorium. Mekanisme kerja prototype ini yaitu data dari sensor dibaca melalui arduino selaku mikroprossesor, Ardunio memproses data tersebut lalu dialamatkan ke AWS via MQTT, dan AWS menampilkan hasil dari bacaan sensor.",
  },
];

// Function to format the date range
function formatDateRange(dateRange) {
  const [startDateStr, endDateStr] = dateRange.split(" - ");

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day); // Month is 0-indexed

    // Set up short month names
    const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return `${day} ${shortMonthNames[month - 1]} ${year}`;
  };

  const formattedStartDate = formatDate(startDateStr);
  const formattedEndDate = formatDate(endDateStr);

  return `${formattedStartDate} - ${formattedEndDate}`;
}

// Function to create an experience card
function createExperienceCard(experience) {
  const description = experience.description_content || "No description available.";

  // Fungsi untuk memotong deskripsi menjadi maksimal 50 kata
  const truncateDescription = (text, maxWords) => {
    const words = text.split(" "); // Memisahkan deskripsi menjadi array kata
    return words.length <= maxWords ? text : words.slice(0, maxWords).join(" ") + " " + "..."; // Menggabungkan kembali hingga 50 kata
  };

  const truncatedDescription = truncateDescription(description, 25); // Mendapatkan deskripsi yang sudah dipotong

  const card = $(`
                <div class="property-card2">
                    <div class="image-content2">
                        <img src="${experience.thumbnail_content || "default-image.png"}" alt="${experience.company_content}">
                    </div>
                    <div class="name-content2"><h4>${experience.company_content}</h4></div>
                    <div class="position-content2">
                        <i class="fa fa-briefcase"></i>&nbsp;${experience.position_content || "Position Not Specified"} | ${formatDateRange(experience.average_work_content) || "Date Working Not Specified"}
                    </div>
                    <div class="description-content2">
                        <p>${truncatedDescription}</p>
                    </div>
                </div>
            `);

  card.on("click", () => openModal(experience));

  return card;
}

// Function to render experience cards
function renderExperiences(experiences) {
  const cardContainer = $(".experience-container");
  cardContainer.empty(); // Clear existing content

  $.each(experiences, (index, experience) => {
    const experienceCard = createExperienceCard(experience);
    cardContainer.append(experienceCard);
  });

  // Initialize Slick Carousel
  cardContainer.slick({
    dots: true, // Tampilkan dots untuk navigasi
    infinite: true, // Scroll tanpa akhir
    speed: 500, // Kecepatan transisi
    slidesToShow: 1, // Jumlah kartu yang ditampilkan
    slidesToScroll: 1, // Jumlah kartu yang digeser
  });
}

// Function to open the modal and populate it with experience data
// Function to open the modal and populate it with experience data
function openModal(experience) {
  // Dapatkan gambar pertama
  const firstImage = experience.thumbnail_content; // Memastikan ini adalah yang benar
  console.log("Image URL:", firstImage); // Log untuk membantu troubleshooting

  // Atur src untuk elemen <img>
  $("#modal-image-logo").attr("src", firstImage); // Mengatur src element <img>

  // Assign values to modal elements
  $("#modalCompany").text(experience.company_content);
  $("#modalPosition").text(experience.position_content || "Position Not Specified");
  $("#modalWorkDate").text(formatDateRange(experience.average_work_content));
  $("#modalDescription").html(experience.description_content || "No description available.");

  // Handle modal images
  const modalImages = $("#modalImages");
  modalImages.empty(); // Clear previous images

  $.each(experience.image_content, (index, image) => {
    const imgElement = $(`<img src="${image}" alt="Experience Image" class="modal-image" style="cursor: pointer;">`);

    // Tambahkan event listener untuk gambar
    imgElement.on("click", () => {
      $("#enlargedImage").attr("src", image); // Set src untuk gambar yang diperbesar
      $("#enlargedImageContainer").show(); // Tampilkan container gambar yang diperbesar
    });

    modalImages.append(imgElement);
  });

  // Event listener untuk menutup gambar yang diperbesar saat diklik
  $("#enlargedImageContainer").on("click", () => {
    $("#enlargedImageContainer").hide(); // Sembunyikan gambar yang diperbesar
  });

  // Display the modal
  $("#myModal").show();
}

// Function to close the modal
$("#modalClose").on("click", function () {
  $("#myModal").hide();
});

// Function to setup responsive navbar based on screen size
function setupNavbarResponsive() {
  const nav = document.querySelector("nav");
  const logo = document.querySelector(".navbar-brand img");
  const navbarMenu = document.querySelector(".navbar-menu");
  const hamburger = document.querySelector(".hamburger");

  // Function to close navbar menu
  function closeNavbarMenu() {
    if (navbarMenu.classList.contains("opened")) {
      navbarMenu.classList.remove("opened");

      // Reset hamburger animation
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

  // Function to handle scroll for large screens
  function handleLargeScreenScroll() {
    window.addEventListener("scroll", function () {
      if (window.innerWidth >= 1024) {
        nav.classList.toggle("scrolled", window.scrollY > 0); // Optimize with toggle
        logo.classList.toggle("scrolled-img", window.scrollY > 0);
      } else {
        // Reset styles for small screens
        nav.classList.remove("scrolled");
        logo.classList.remove("scrolled-img");
      }
    });
  }

  // Function to toggle hamburger menu
  function setupHamburgerMenu() {
    hamburger.addEventListener("click", function () {
      console.log("Hamburger Clicked");
      navbarMenu.classList.toggle("opened");

      // Log status of navbar menu
      console.log("Navbar Menu Opened:", navbarMenu.classList.contains("opened"));

      const line1 = document.querySelector(".line1");
      const line2 = document.querySelector(".line2");
      const line3 = document.querySelector(".line3");

      // Animate hamburger lines based on menu state
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

  // Function for smooth scroll for all screens
  function setupSmoothScroll() {
    document.getElementById("home-link").addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      closeNavbarMenu(); // Close navbar menu when clicking home link
    });

    document.querySelectorAll(".navbar-item").forEach((item) => {
      item.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        event.preventDefault();
        document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
        closeNavbarMenu(); // Close navbar menu when clicking on item
      });
    });
  }

  // Function to reset menu on resize
  function setupResizeHandler() {
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) {
        navbarMenu.classList.remove("opened");
        // Reset styles for large screens
        nav.classList.remove("scrolled");
        logo.classList.remove("scrolled-img");
      }
    });
  }

  // Function to toggle shadow and fill on contact icons
  function setupContactIcons() {
    $(".first li").click(function () {
      $(this).toggleClass("shadow-1").siblings().removeClass("shadow-1");
      $(this).toggleClass("fill-color").siblings().removeClass("fill-color");
    });
  }

  // Initialize all navbar functions
  handleLargeScreenScroll();
  setupHamburgerMenu();
  setupSmoothScroll();
  setupResizeHandler();
  setupContactIcons();
}

// Function to fetch project data from API
async function fetchProjects() {
  try {
    const response = await fetch("database/db_project.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const projects = await response.json();
    return projects.map((project) => ({
      ...project,
      image_content: project.image_content || "",
      file_content: project.file_content || "No available", // Set default message
      link_content: project.link_content || "No available", // Set default message
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Return empty array in case of error
  }
}

// Function to populate dropdown filter based on type_content
function populateProjectFilter(projects) {
  const typeFilter = document.getElementById("typeFilter");

  // Get unique type_content
  const uniqueTypes = [...new Set(projects.map((project) => project.type_content))];

  // Add options for each type
  uniqueTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

function getProjectImage(project) {
  // Check if image_content is valid
  if (project.image_content && project.image_content.trim() !== "") {
    return project.image_content;
  }

  // If no image, return a gray placeholder
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
}

// Function for creating a project card
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "property-card";

  // Function to determine font size class based on text length
  function determineFontSizeClass(text) {
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

  const nameElement = document.createElement("h3");
  nameElement.textContent = project.name_content || "Unnamed Project"; // Provide a default name
  nameElement.className = determineFontSizeClass(project.name_content || "");

  card.innerHTML = `
        <div class="image-content">
            <img src="${getProjectImage(project)}" alt="${project.name_content || "Project Image"}">
        </div>
        <div class="name-content">
            <!-- Name will be set by the function above -->
        </div>
        <div class="description-content">
            <p>${project.description_content || "No description available."}</p> <!-- Provide default description -->
        </div>
        <div class="footer-content">
            <div class="file-content">
                <a href="${project.file_content || "#"}" download>${project.file_content !== "No available" ? "Download" : ""}</a>
            </div>
            <div class="link-content">
                <a href="${project.link_content || "#"}" target="_blank">${project.link_content !== "No available" ? "View Project" : ""}</a>
            </div>
        </div>
    `;

  const nameContentDiv = card.querySelector(".name-content");
  nameContentDiv.appendChild(nameElement);

  return card;
}

// Function to create project modal
function createProjectModal(project) {
  // Check if both links and files are not available
  const fileNotAvailable = project.file_content === "No available";
  const linkNotAvailable = project.link_content === "No available";

  if (fileNotAvailable && linkNotAvailable) {
    console.log("No valid links or files available for this project. Skipping modal creation.");
    return null; // Skip modal creation
  }

  const modal = document.createElement("div");
  modal.className = "project-modal";
  modal.innerHTML = `
        <div class="project-modal-content">
            <span class="project-modal-close">&times;</span>
            <div class="project-modal-image">
                <img src="${getProjectImage(project)}" alt="${project.name_content || "Project Image"}">
            </div>
            <div class="project-modal-details">
                <h2>${project.name_content || "Project Name Unavailable"}</h2>
                <h3>${project.position_content || "Position Unavailable"}</h3>
                <p>${project.description_content || "No description available."}</p>
                <div class="project-modal-links">
                    ${!linkNotAvailable ? `<a href="${project.link_content}" target="_blank">View Project</a>` : ""}
                    ${!fileNotAvailable ? `<a href="${project.file_content}" download>Download</a>` : ""}
                    ${fileNotAvailable && linkNotAvailable ? "<p>No links or files available.</p>" : ""}
                </div>
            </div>
        </div>
    `;

  // Add event listener to close modal
  const closeButton = modal.querySelector(".project-modal-close");
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  return modal;
}

// CSS for additional styling
const additionalCSS = `
.property-card .image-content {
    width: 100%;
    height: 250px;
    background-color: #E0E0E0; /* Light gray color */
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

// Function to render project cards
function renderProjects(projects) {
  const cardContainer = document.querySelector(".Card");
  cardContainer.innerHTML = ""; // Clear container before rendering

  projects.forEach((project) => {
    const projectCard = createProjectCard(project);
    cardContainer.appendChild(projectCard);
  });
}

// Function to filter projects based on type
function filterProjects() {
  const typeFilter = document.getElementById("typeFilter");
  const selectedType = typeFilter.value;

  const projects = JSON.parse(localStorage.getItem("projects")) || [];

  const filteredProjects = selectedType === "all" ? projects : projects.filter((project) => project.type_content === selectedType);

  renderProjects(filteredProjects);
}

// Main initialization function for projects
async function initProjects() {
  try {
    // Fetch projects
    const projects = await fetchProjects();

    // Save in localStorage for filtering
    localStorage.setItem("projects", JSON.stringify(projects));

    // Populate dropdown filter
    populateProjectFilter(projects);

    // Render all projects
    renderProjects(projects);

    // Add event listener for filter
    document.getElementById("typeFilter").addEventListener("change", filterProjects);
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

// Function to download CV
function downloadCV() {
  const cvPath = "assets/CV/Rijal_Rahman_Zuhri-CV.pdf";

  // Log for debugging
  console.log("Attempting to download CV from:", cvPath);

  fetch(cvPath)
    .then((response) => {
      // Log response status
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob(); // Get the blob for the file
    })
    .then((blob) => {
      // Log blob size
      console.log("Blob size:", blob.size);

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Rijal_Rahman_Zuhri_CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      // Log error details
      console.error("Full error details:", error);

      // Check if file exists
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

// Alternative method to download CV
function downloadCVAlternative() {
  const cvPath = "assets/CV/Rijal_Rahman_Zuhri-CV.pdf";

  // Use window.location for download
  window.location.href = cvPath;
}

// Function to open email composer
function openEmailComposer(platform = "gmail") {
  const email = "rijalrzuhri247@gmail.com";
  const subject = "Message from Website";
  const body = "Hello, I want to talk to you ...";

  // Construct different URLs for platforms
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

  // Open email window
  window.open(mailtoLink, "_blank");

  // Optional: Tracking
  trackEmailClick();
}

// Simple tracking function
function trackEmailClick() {
  console.log("Email link clicked");
}

// Run setup when document is ready
$(document).ready(function () {
  // Initialize navbar
  setupNavbarResponsive();

  // Initialize projects
  initProjects();

  // Render experiences using static data
  renderExperiences(experienceData); // Use static data

  $(".fa-envelope").on("click", function (e) {
    e.preventDefault();
    $(this).closest("li").toggleClass("shadow-1").toggleClass("fill-color");
    openEmailComposer("gmail");
  });

  $('button:contains("Download CV")').on("click", function () {
    $(this).toggleClass("shadow-1").toggleClass("fill-color");
    downloadCV();
    setTimeout(() => {
      $(this).removeClass("shadow-1").removeClass("fill-color");
    }, 300);
  });
});
