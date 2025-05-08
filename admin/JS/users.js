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
  
      return {
        ...user,
        noOfTestGiven: userAttempts.length,
        score: latest ? latest.score : "N/A",
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
        <td class= "action">
          <span onclick="viewUser('${user.email}')"><i class='fa fa-eye'></i></span>
          <span onclick="editUser('${user.email}')"><i class='fa fa-pen'></i></span>
          <span onclick="deleteUser('${user.email}')"><i class='fa fa-trash'></i></span>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  function viewUser(email) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);
    
    if (user) {
        // Retrieve attempts and ensure it's an array
        const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
        
        if (!Array.isArray(attempts)) {
            alert("Error: Attempts data is corrupted.");
            return;
        }

        const userAttempts = attempts.filter(attempt => attempt.email === email);

        let scoreHistory = userAttempts.map((attempt, index) => {
            return `Attempt ${index + 1}: Score: ${attempt.score}`;
        }).join("\n");

        if (scoreHistory === "") {
            scoreHistory = "No attempts yet.";
        }

        alert(`Name: ${user.fullName}\nEmail: ${user.email}\nAttempts:\n${scoreHistory}`);
    } else {
        alert("User not found!");
    }
}

  function editUser(email) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === email);
    if (userIndex === -1) return;
  
    const newName = prompt("Enter new name:", users[userIndex].fullName);
    const newEmail = prompt("Enter new email:", users[userIndex].email);
  
    if (newName && newEmail) {
      users[userIndex].fullName = newName;
      users[userIndex].email = newEmail;
  
      // Update localStorage for user
      localStorage.setItem("users", JSON.stringify(users));
  
      // Update attempts key if email changed
      if (email !== newEmail) {
        const attempts = JSON.parse(localStorage.getItem("attempts")) || {};
        if (attempts[email]) {
          attempts[newEmail] = attempts[email];
          delete attempts[email];
          localStorage.setItem("attempts", JSON.stringify(attempts));
        }
      }
  
      alert("User updated successfully.");
      displayUsers();
    }
  }
  
  function deleteUser(email) {
    if (!confirm(`Are you sure you want to delete the user with email: ${email}?`)) return;
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter((user) => user.email !== email);
    localStorage.setItem("users", JSON.stringify(users));
  
    const attempts = JSON.parse(localStorage.getItem("attempts")) || {};
    if (attempts[email]) {
      delete attempts[email];
      localStorage.setItem("attempts", JSON.stringify(attempts));
    }
  
    alert("User deleted successfully.");
    displayUsers();
  }
  
  // Optional: Call this if you're on users.html
  // window.onload = displayUsers;
  