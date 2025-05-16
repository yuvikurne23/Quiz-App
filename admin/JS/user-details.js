const menuButton = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");
const sidebarItems = document.querySelectorAll(".sidebar ul li");

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

function adminProfile() {
  const profile = document.getElementById("admin-popup");
  if (profile.style.display === "none" || profile.style.display === "") {
    profile.style.display = "block";
  } else {
    profile.style.display = "none";
  }
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../login.html";
});

// displayUsers();
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

  // const tbody = document.querySelector(".tbody");

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

  userAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  userAttempts.forEach((attempt, index) => {
    // Check if the score is 1000, and if so, set the correctAnswers to 10
    const correctAnswers = attempt.score === 1000 ? 10 : attempt.correctAnswers;

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${new Date(attempt.timestamp).toLocaleDateString()}</td>
            <td>${attempt.score}</td>
            <td>${attempt.score / 100}</td>
            <td><a href="../admin/result.html?id=${userId}&attempt=${index}" class="view">View</a></td>
        `;
    tbody.appendChild(row);
  });
});
