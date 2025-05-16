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
  
  

});
