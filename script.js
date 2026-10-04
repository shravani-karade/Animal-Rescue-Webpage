// ================= REPORT SYSTEM =================

const form = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");
const phone = document.getElementById("contact");
const error = document.getElementById("contactError");


// Get saved reports
function getReports() {
    return JSON.parse(localStorage.getItem("reports")) || [];
}


// Show reports on webpage
function showReports() {

    const reports = getReports();

    reportsList.innerHTML = "";

    reports.reverse().forEach(report => {

        const card = document.createElement("div");
        card.className = "report-card";

        card.innerHTML = `
            <h3>🐾 ${report.animal}</h3>
            <p><b>Location:</b> ${report.location}</p>
            <p><b>Condition:</b> ${report.condition}</p>
            <p><b>Reported by:</b> ${report.name}</p>
            <p><b>Contact:</b> ${report.phone}</p>
        `;

        reportsList.appendChild(card);
    });
}


// Phone validation
phone.addEventListener("input", function () {

    phone.value = phone.value
        .replace(/\D/g, "")
        .slice(0, 10);

    error.textContent =
        phone.value.length === 10
        ? ""
        : "Enter a valid 10-digit number.";
});


// Submit report
form.addEventListener("submit", function(event) {

    event.preventDefault();

    if (phone.value.length !== 10) {
        error.textContent = "Enter a valid 10-digit number.";
        return;
    }

    const report = {
        animal: document.getElementById("animalType").value,
        location: document.getElementById("location").value,
        condition: document.getElementById("description").value,
        name: document.getElementById("reporterName").value,
        phone: phone.value
    };

    const reports = getReports();

    reports.push(report);

    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );

    form.reset();
    showReports();

    alert("Report submitted successfully! 🐾");
});


// ================= HEALTH GUIDE =================

const healthData = {

    cold: [
        "🤧 Cold / Sneezing",
        "Keep the animal warm and dry. Provide clean water. If breathing becomes difficult, contact a veterinarian."
    ],

    wound: [
        "🩹 Small Wound",
        "Keep the area clean and prevent further injury. Avoid unknown medicines. Deep wounds need veterinary care."
    ],

    water: [
        "💧 Dehydration",
        "Provide clean drinking water and keep the animal in a cool place. Severe weakness needs professional help."
    ],

    heat: [
        "☀️ Heat Stress",
        "Move the animal to shade and provide water. Heavy panting, weakness or collapse needs urgent veterinary help."
    ],

    ticks: [
        "🐜 Ticks / Fleas",
        "Do not use random chemicals or human medicines. Ask a veterinarian about safe treatment."
    ],

    injury: [
        "🦴 Injury",
        "Keep the animal still and away from traffic. Do not try to straighten broken bones. Contact a vet or rescue team."
    ]
};


const healthSelect = document.getElementById("healthSelect");
const healthResult = document.getElementById("healthResult");

healthSelect.addEventListener("change", function() {

    const data = healthData[this.value];

    if (!data) return;

    healthResult.innerHTML = `
        <h3>${data[0]}</h3>
        <p>${data[1]}</p>
    `;
});


// ================= NGO + VET DIRECTORY =================

const helpData = [

    {
        name: "Bombay SPCA",
        type: "Veterinary Hospital",
        area: "south",
        location: "Parel",
        phone: "+91 85916 59398"
    },

    {
        name: "Animal Matter To Me",
        type: "Rescue NGO + Hospital",
        area: "western",
        location: "Malad West",
        phone: "+91 99207 37737"
    },

    {
        name: "YODA",
        type: "Animal Rescue NGO",
        area: "western",
        location: "Khar West",
        phone: "Check current helpline"
    },

    {
        name: "RAWW",
        type: "Wildlife Rescue",
        area: "central",
        location: "Mulund",
        phone: "+91 76666 80202"
    },

    {
        name: "IDA India",
        type: "Animal Welfare",
        area: "central",
        location: "Deonar",
        phone: "+91 93200 56581"
    },

    {
        name: "The Feline Foundation",
        type: "Veterinary Clinic",
        area: "western",
        location: "Versova, Andheri West",
        phone: "Check current contact"
    },

    {
        name: "Superpets",
        type: "24×7 Veterinary Hospital",
        area: "western",
        location: "Khar West",
        phone: "+91 98211 12746"
    },

    {
        name: "PetZone Veterinary Clinic",
        type: "24×7 Animal Hospital",
        area: "south",
        location: "Mahalaxmi",
        phone: "+91 77009 57393"
    }
];


// Display NGOs and vets
function showHelp(area = "all") {

    const list = document.getElementById("helpList");

    const results = area === "all"
        ? helpData
        : helpData.filter(item => item.area === area);

    list.innerHTML = "";

    results.forEach(item => {

        const card = document.createElement("div");

        card.className = "help-card";

        card.innerHTML = `
            <span class="area">${item.area.toUpperCase()}</span>

            <h3>${item.name}</h3>

            <p><b>Type:</b> ${item.type}</p>
            <p><b>Location:</b> ${item.location}</p>
            <p><b>Contact:</b> ${item.phone}</p>
        `;

        list.appendChild(card);
    });
}


// Area filter buttons
document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        showHelp(this.dataset.area);
    });
});


// ================= SCROLL ANIMATION =================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });

}, { threshold: 0.15 });


document.querySelectorAll(".section")
    .forEach(section => observer.observe(section));


// Load data when website opens
showReports();
showHelp();