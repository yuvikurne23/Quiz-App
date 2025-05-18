const menuButton = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");
const sidebarItems = document.querySelectorAll(".sidebar ul li");

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

function adminProfile() {
  const profile = document.getElementById("admin-popup");
  profile.style.display = (profile.style.display === "none" || profile.style.display === "") ? "block" : "none";
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../login.html";
});

function handleNavigation(page) {
  switch (page) {
    case "home":
      window.location.href = "/admin/home.html";
      break;
    case "quiz":
      window.location.href = "/admin/addQuiz.html";
      break;
    case "users":
      window.location.href = "/admin/users.html";
      break;
    default:
      window.location.href = "/admin/home.html";
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const attempts = JSON.parse(localStorage.getItem("attempts")) || {};
  const tbody = document.querySelector(".tbody");
  const userNameDiv = document.querySelector(".user-name");
  const userEmailDiv = document.querySelector(".user-email");

  if (userId !== null && users[userId]) {
    const user = users[userId];
    const userAttempts = attempts[user.email] || [];

    userNameDiv.innerHTML = `<span></span> <strong>${user.fullName.toUpperCase()}</strong>`;
    userEmailDiv.innerHTML = `<span></span> <strong>${user.email}</strong>`;

    if (userAttempts.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>No test attempts found</td></tr>";
    } else {
      userAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const latestAttempt = userAttempts[0];
      const correctAnswersCount = latestAttempt.responses
        ? latestAttempt.responses.filter(r => r.selectedAnswer === r.correctAnswer).length
        : (latestAttempt.correctAnswers || 0);

      const row = document.createElement("tr");
      row.innerHTML = `
          <td>1</td>
          <td>${new Date(latestAttempt.timestamp).toLocaleDateString()}</td>
          <td>${correctAnswersCount}</td>
          <td>${correctAnswersCount}</td>
          <td><a href="../admin/result.html?id=${userId}&attempt=0" class="view">View</a></td>
      `;
      tbody.appendChild(row);
    }
  }

  displayUsers(); // Only run when on users.html
});

async function displayUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const attempts = JSON.parse(localStorage.getItem("attempts")) || {};
  const tableBody = document.querySelector(".main-content .tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (users.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
    return;
  }

  users.forEach((user, index) => {
    const userAttempts = attempts[user.email] || [];
    userAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latest = userAttempts[0];

    let scoreDisplay = "N/A";
    if (latest && Array.isArray(latest.responses)) {
      const correctAnswers = latest.responses.filter(r => r.selectedAnswer === r.correctAnswer).length;
      scoreDisplay = `${correctAnswers}`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.fullName}</td>
      <td>${user.email}</td>
      <td>${userAttempts.length}</td>
      <td>${scoreDisplay}</td>
      <td><a href="../admin/user-details.html?id=${index}" class="view-page">View Result</a></td>
    `;
    tableBody.appendChild(row);
  });
}
