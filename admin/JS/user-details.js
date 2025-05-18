const menuButton = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

function adminProfile() {
  const profile = document.getElementById("admin-popup");
  profile.style.display = (profile.style.display === "block") ? "none" : "block";
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../login.html";
});

function handleNavigation(page) {
  switch (page) {
    case "home": window.location.href = "/admin/home.html"; break;
    case "quiz": window.location.href = "/admin/addQuiz.html"; break;
    case "users": window.location.href = "/admin/users.html"; break;
    default: window.location.href = "/admin/home.html"; break;
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

  if (!userId || !users[userId]) {
    tbody.innerHTML = "<tr><td colspan='5'>User not found</td></tr>";
    return;
  }

  const user = users[userId];
  const userAttempts = attempts[user.email] || [];

  userNameDiv.innerHTML = `<span></span> <strong>${user.fullName.toUpperCase()}</strong>`;
  userEmailDiv.innerHTML = `<span></span> <strong>${user.email}</strong>`;

  if (userAttempts.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>No test attempts found</td></tr>";
    return;
  }

  // Sort attempts descending by timestamp (latest first)
  userAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  tbody.innerHTML = ""; // Clear previous rows

  // Only show latest attempt
  const latestAttempt = userAttempts[0];

  if (latestAttempt) {
// Calculate correct answers by counting correct responses in the attempt
const correctAnswersCount = latestAttempt.responses
  ? latestAttempt.responses.filter(r => r.selectedAnswer === r.correctAnswer).length
  : (latestAttempt.correctAnswers || 0);

const row = document.createElement("tr");
row.innerHTML = `
    <td>1</td>
    <td>${new Date(latestAttempt.timestamp).toLocaleDateString()}</td>
    <td>${correctAnswersCount}</td>  <!-- Score = correct answers count -->
    <td>${correctAnswersCount}</td>  <!-- Correct Answer column -->
    <td><a href="../admin/result.html?id=${userId}&attempt=0" class="view">View</a></td>
`;
tbody.appendChild(row);
  } else {
    tbody.innerHTML = "<tr><td colspan='5'>No test attempts found</td></tr>";
  }
});
