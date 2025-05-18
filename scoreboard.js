document.addEventListener("DOMContentLoaded", () => {
  const allScoresDiv = document.querySelector(".all-scores");
  const attemptsDiv = document.querySelector(".user-attempts"); // You need to have this container in your HTML for attempts detail

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const attempts = JSON.parse(localStorage.getItem("attempts")) || {};

  const userScores = users.map(user => ({
    fullName: user.fullName,
    email: user.email,
    score: user.score || 0,
    attempts: attempts[user.email] || []
  }));

  // Sort users by score descending
  userScores.sort((a, b) => b.score - a.score);

  // Update Top 3 Rankings (existing logic)
  for (let i = 0; i < 3; i++) {
    if (userScores[i]) {
      const rankImg = document.querySelector(`#rank-${i + 1}`);
      if (rankImg) {
        const scoreContainer = rankImg.nextElementSibling;
        if (scoreContainer) {
          const nameEl = scoreContainer.querySelector("h2");
          const scoreEl = scoreContainer.querySelector("p");
          if (nameEl) nameEl.textContent = userScores[i].fullName;
          if (scoreEl) scoreEl.textContent = userScores[i].score;
        }
      }
    }
  }

  // Show user ranks (existing logic)
  const currentUserEmail = typeof checkUser !== "undefined" ? checkUser.email : null;
  const userRank = currentUserEmail
    ? userScores.findIndex(user => user.email === currentUserEmail) + 1
    : -1;

  const yourRankElement = document.getElementById('your-rank');
  if (yourRankElement) {
    if (userRank > 0 && userScores[userRank - 1]) {
      let suffix = "th";
      if (![11, 12, 13].includes(userRank % 100)) {
        if (userRank % 10 === 1) suffix = "st";
        else if (userRank % 10 === 2) suffix = "nd";
        else if (userRank % 10 === 3) suffix = "rd";
      }
      yourRankElement.textContent = `Wow, You Rank ${userRank}${suffix}`;
    } else {
      yourRankElement.textContent = "You have no recorded score yet.";
    }
  }

  // Clear and show users ranked 4+
  allScoresDiv.innerHTML = "";
  userScores.slice(3).forEach((user, index) => {
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

  // Show detailed attempts for logged-in user (or any user you want)
  if (currentUserEmail && attemptsDiv) {
    attemptsDiv.innerHTML = ""; // Clear old content

    const userAttempts = attempts[currentUserEmail] || [];
    if (userAttempts.length === 0) {
      attemptsDiv.textContent = "No quiz attempts yet.";
    } else {
      userAttempts.forEach((attempt, idx) => {
        const attemptDiv = document.createElement("div");
        attemptDiv.className = "attempt";

        let attemptHTML = `
          <h3>Attempt #${idx + 1} - Score: ${attempt.score} / ${attempt.responses.length}</h3>
          <p>Started: ${new Date(attempt.startTime).toLocaleString()}</p>
          <p>Finished: ${new Date(attempt.endTime).toLocaleString()}</p>
          <ol>
        `;

        attempt.responses.forEach(resp => {
          const isCorrect = resp.selectedAnswer === resp.correctAnswer;
          attemptHTML += `
            <li>
              <strong>Q:</strong> ${resp.question}<br>
              <strong>Your Answer:</strong> <span style="color:${isCorrect ? "green" : "red"}">${resp.selectedAnswer}</span><br>
              <strong>Correct Answer:</strong> ${resp.correctAnswer}
            </li>
          `;
        });

        attemptHTML += "</ol>";
        attemptDiv.innerHTML = attemptHTML;
        attemptsDiv.appendChild(attemptDiv);
      });
    }
  }
});
