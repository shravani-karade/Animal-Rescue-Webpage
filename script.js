const reportForm = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");
const helpList = document.getElementById("helpList");
const contactInput = document.getElementById("contact");
const contactError = document.getElementById("contactError");
const filterButtons = document.querySelectorAll(".filter-btn");


// ===== PHONE VALIDATION =====

function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

contactInput.addEventListener("input", () => {

    contactInput.value = contactInput.value
        .replace(/\D/g, "")
        .slice(0, 10);

    contactError.textContent =
        contactInput.value && !isValidPhone(contactInput.value)
        ? "Enter a valid 10-digit mobile number."
        : "";
});


// ===== REPORT FORM =====

reportForm.addEventListener("submit", (e) => {

    e.preventDefault();

    if (!isValidPhone(contactInput.value)) {
        contactError.textContent = "Enter a valid 10-digit mobile number.";
        contactInput.focus();
        return;
    }

    const report = {
        id: Date.now(),
        animalType: document.getElementById("animalType").value,
        location: document.getElementById("location").value,
        description: document.getElementById("description").value,
        reporterName: document.getElementById("reporterName").value,
        contact: contactInput.value
    };

    const reports = getReports();
    reports.push(report);

    localStorage.setItem("strayReports", JSON.stringify(reports));

    displayReports();
    reportForm.reset();

    alert("Report submitted successfully! 🐾");
});


// ===== REPORT STORAGE =====

function getReports() {
    return JSON.parse(localStorage.getItem("strayReports")) || [];
}

function displayReports() {

    const reports = getReports();

    reportsList.innerHTML = "";

    if (reports.length === 0) {
        reportsList.innerHTML =
            '<p class="empty-message">No reports yet. Be the first to help!</p>';
        return;
    }

    reports.slice().reverse().forEach(report => {

        const card = document.createElement("div");
        card.className = "report-card";

        card.innerHTML = `
            <button class="delete-btn"
                    onclick="deleteReport(${report.id})">
                Delete
            </button>

            <h3>${escapeHTML(report.animalType)}</h3>

            <p><b>Location:</b>
                ${escapeHTML(report.location)}
            </p>

            <p><b>Condition:</b>
                ${escapeHTML(report.description)}
            </p>

            <p><b>Reported by:</b>
                ${escapeHTML(report.reporterName)}
            </p>

            <p><b>Contact:</b>
                ${escapeHTML(report.contact)}
            </p>
        `;

        reportsList.appendChild(card);
    });
}


// ===== DELETE REPORT =====

function deleteReport(id) {

    if (!confirm("Delete this report?")) return;

    const reports = getReports()
        .filter(report => report.id !== id);

    localStorage.setItem(
        "strayReports",
        JSON.stringify(reports)
    );

    displayReports();
}


// ===== PREVENT HTML INJECTION =====

function escapeHTML(text) {

    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// ===== HELP DIRECTORY =====

const helpDirectory = [

    {
        name: "Bombay SPCA (BSPCA)",
        area: "south",
        areaLabel: "South Mumbai",
        locality: "Parel",
        phone: "022-24137518",
        note: "Rescue operations, hospital, ambulance service and animal welfare support."
    },

    {
        name: "Welfare of Stray Dogs (WSD)",
        area: "south",
        areaLabel: "South Mumbai",
        locality: "Lower Parel",
        phone: "089760 22838",
        note: "Stray dog care, adoption and animal welfare programs."
    },

    {
        name: "Save Our Strays (SOS)",
        area: "western",
        areaLabel: "Western Suburbs",
        locality: "Andheri West",
        phone: "Search online",
        note: "Sterilization, rescue and stray animal support."
    },

    {
        name: "World For All (WFA)",
        area: "western",
        areaLabel: "Western Suburbs",
        locality: "Andheri / Goregaon / Jogeshwari / Juhu",
        phone: "9820001506",
        note: "Animal treatment, rescues and adoption support."
    },

    {
        name: "Animals Matter to Me (AMTM)",
        area: "western",
        areaLabel: "Western Suburbs",
        locality: "Malad West",
        phone: "99677 95660",
        note: "Shelter, medical care, foster care and rescue support."
    },

    {
        name: "Youth Organisation in Defence of Animals (YODA)",
        area: "western",
        areaLabel: "Western Suburbs",
        locality: "Mahim West",
        phone: "88999 97704",
        note: "Rescue, rehabilitation, medical aid and adoption."
    },

    {
        name: "In Defence of Animals (IDA)",
        area: "other",
        areaLabel: "Eastern / Navi Mumbai",
        locality: "Deonar",
        phone: "9320056581",
        note: "Animal medical care, sterilization and rescue support."
    },

    {
        name: "Mumbai Animal Association (MAA)",
        area: "other",
        areaLabel: "Central Suburbs",
        locality: "Kandivali / Borivali / Dahisar",
        phone: "8655370005",
        note: "On-road treatment and hospitalization support."
    },

    {
        name: "RAWW",
        area: "other",
        areaLabel: "Central / Thane",
        locality: "Mulund / Chembur / Thane",
        phone: "Search online",
        note: "Wildlife rescue and human-wildlife conflict response."
    }
];


// ===== DISPLAY HELP =====

function displayHelp(filter = "all") {

    helpList.innerHTML = "";

    const results = filter === "all"
        ? helpDirectory
        : helpDirectory.filter(item => item.area === filter);

    results.forEach(item => {

        const card = document.createElement("div");

        card.className = "help-card";

        card.innerHTML = `
            <h3>
                ${escapeHTML(item.name)}
                <span class="area-tag">
                    ${escapeHTML(item.areaLabel)}
                </span>
            </h3>

            <p><b>Locality:</b>
                ${escapeHTML(item.locality)}
            </p>

            <p><b>Contact:</b>
                ${escapeHTML(item.phone)}
            </p>

            <p>${escapeHTML(item.note)}</p>
        `;

        helpList.appendChild(card);
    });
}


// ===== FILTERS =====

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(b =>
            b.classList.remove("active")
        );

        button.classList.add("active");

        displayHelp(button.dataset.area);
    });
});


// ===== SCROLL ANIMATION =====

const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });

}, { threshold: 0.15 });

sections.forEach(section => observer.observe(section));


// ===== LOAD DATA =====

window.addEventListener("DOMContentLoaded", () => {

    displayReports();
    displayHelp();

});