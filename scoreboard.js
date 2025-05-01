
document.addEventListener("DOMContentLoaded", () => {
  const allScoresDiv = document.querySelector(".all-scores");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userScores = users.map(user => ({
    fullName: user.fullName,
    email: user.email,
    score: user.score || 0 // fallback in case score is not saved
  }));

  // Map scores to a scale of 100 to 1000 for the top 3 users (1 = 100, 10 = 1000)
  userScores.forEach(user => {
    if (user.score >= 1 && user.score <= 10) {
      user.score = (user.score - 1) * 100 + 100; // Maps score from [1, 10] to [100, 1000]
    }
  });

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

  // Check the rank of the logged-in user and update the rank message
  const userRank = userScores.findIndex(user => user.email === checkUser.email) + 1;
  const yourRankElement = document.getElementById('your-rank');
  if (userRank === 1) {
    yourRankElement.textContent = "Wow, You Rank 1st!";
  } else if (userRank === 2) {
    yourRankElement.textContent = "Wow, You Rank 2nd!";
  } else if (userRank === 3) {
    yourRankElement.textContent = "Wow, You Rank 3rd!";
  } else if (userRank === 4) {
    yourRankElement.textContent = "Wow, You Rank 4th!";
  } else if (userRank === 5) {
    yourRankElement.textContent = "Wow, You Rank 5th!";
  } else if (userRank === 6) {
    yourRankElement.textContent = "Wow, You Rank 6th!";
  } else {
    yourRankElement.textContent = `Your Rank: ${userRank}`;
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