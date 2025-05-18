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
  const userNameDiv = document.querySelector(".user-name");
  const userEmailDiv = document.querySelector(".user-email");
  const resultContainer = document.getElementById("result-container");

  const testNumberEl = document.getElementById("test-number");
  const scoreEl = document.getElementById("score");
  const testDateEl = document.getElementById("test-date");
  const timeTakenEl = document.getElementById("time-taken");

  if (!userId || !users[userId]) {
    if(resultContainer) resultContainer.innerHTML = "<p>User not found</p>";
    return;
  }

  const user = users[userId];
  const userAttempts = attempts[user.email] || [];

  userNameDiv.innerHTML = `<span></span> <strong>${user.fullName.toUpperCase()}</strong>`;
  userEmailDiv.innerHTML = `<span></span> <strong>${user.email}</strong>`;

  if (userAttempts.length === 0) {
    if(resultContainer) resultContainer.innerHTML = "<p>No test attempts found</p>";
    return;
  }

  // Get latest attempt (most recent by timestamp)
  userAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const latestAttempt = userAttempts[0];

  if (!latestAttempt || !Array.isArray(latestAttempt.responses)) {
    if(resultContainer) resultContainer.innerHTML = "<p>No valid responses found for the latest attempt.</p>";
    return;
  }

  // Calculate correct answers count
  const correctAnswersCount = latestAttempt.responses.filter(r => r.selectedAnswer === r.correctAnswer).length;

  // Set header info
  if (testNumberEl) testNumberEl.innerText = `Test: ${userAttempts.length}`;
  if (scoreEl) scoreEl.innerText = `Score: ${correctAnswersCount}`;
  if (testDateEl) testDateEl.innerText = `Date: ${new Date(latestAttempt.timestamp).toLocaleString()}`;

  if (latestAttempt.startTime && latestAttempt.endTime) {
    const start = new Date(latestAttempt.startTime);
    const end = new Date(latestAttempt.endTime);
    const diffMs = end - start;

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const remainingSeconds = diffSeconds % 60;

    if (timeTakenEl) timeTakenEl.innerText = `Time Taken: ${diffMinutes} min ${remainingSeconds} sec`;
  } else {
    if (timeTakenEl) timeTakenEl.innerText = "Time Taken: N/A";
  }

  // Clear previous results
  if (resultContainer) resultContainer.innerHTML = "";

  // Render each question and user's answer
  latestAttempt.responses.forEach((resp, idx) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    questionDiv.innerHTML = `
      <p><strong>Question No. ${idx + 1} : </strong> ${resp.question}</p>
      <p class="${resp.selectedAnswer === resp.correctAnswer ? 'correct' : 'incorrect'}">
        Your Answer: ${resp.selectedAnswer || "No answer selected"}
      </p>
      ${resp.selectedAnswer !== resp.correctAnswer ? `<p class="correct-answer">Correct Answer: ${resp.correctAnswer}</p>` : ''}
    `;

    resultContainer.appendChild(questionDiv);
  });
});
