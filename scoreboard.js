// scoreboard.js

document.addEventListener("DOMContentLoaded", () => {
    const allScoresDiv = document.querySelector(".all-scores");
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userScores = users.map(user => ({
      fullName: user.fullName,
      email: user.email,
      score: user.score || 0 // fallback in case score not saved
    }));
  
    // Sort by score (highest to lowest)
    userScores.sort((a, b) => b.score - a.score);
  
    // Display Top 3
    if (userScores[0]) {
      document.querySelector("#rank-1").nextElementSibling.querySelector("p").textContent = userScores[0].score;
      document.querySelector("#rank-1").nextElementSibling.querySelector("h2").textContent = userScores[0].fullName;
    }
    if (userScores[1]) {
      document.querySelector("#rank-2").nextElementSibling.querySelector("p").textContent = userScores[1].score;
      document.querySelector("#rank-2").nextElementSibling.querySelector("h2").textContent = userScores[1].fullName;
    }
    if (userScores[2]) {
      document.querySelector("#rank-3").nextElementSibling.querySelector("p").textContent = userScores[2].score;
      document.querySelector("#rank-3").nextElementSibling.querySelector("h2").textContent = userScores[2].fullName;
    }
  
    // Render remaining users under .otherscore
    const others = userScores.slice(3);
    others.forEach((user, index) => {
        const userDiv = document.createElement("div");
        userDiv.className = "otherscore-item";
        userDiv.innerHTML = `
          <div class="rank-name">
            <span class="rank">#${index + 4}</span>
            <span class="name">${user.fullName}</span>
          </div>
          <span class="score">${user.score}</span>
        `;
        allScoresDiv.appendChild(userDiv);
      });
    });
  