displayUsers();
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

document.getElementById('logout').addEventListener('click', ()=>{
  localStorage.removeItem('loggedInUser');
  window.location.href = '../login.html'
})

async function displayUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const attempts = JSON.parse(localStorage.getItem("attempts")) || {};
  const tableBody = document.querySelector(".main-content .tbody");
  tableBody.innerHTML = "";

  if (users.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
    return;
  }

  users = users.map((user) => {
    const userAttempts = attempts[user.email] || [];
    userAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latest = userAttempts[0];

    // Extract actual correct answers count from the latest attempt's score
    const correctAnswers = latest ? latest.score * 1 : "N/A";

    return {
      ...user,
      noOfTestGiven: userAttempts.length,
      score: latest ? correctAnswers : "N/A",
      lastAttempt: latest
        ? new Date(latest.timestamp).toLocaleDateString()
        : "N/A",
    };
  });

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.noOfTestGiven}</td>
        <td>${user.score}</td>
        <td>
          <a href="../admin/user-details.html?id=${index}" class="view-page">View Result</a>
        </td>
      `;
    tableBody.appendChild(row);
  });
}
