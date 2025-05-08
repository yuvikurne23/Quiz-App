const loggedInUser = localStorage.getItem("loggedInUser") || "guest";

// On every login, we reset quizData for the user
let adminQuestions = JSON.parse(localStorage.getItem("allQuestions")) || [];
const shuffled = adminQuestions.sort(() => Math.random() - 0.5).slice(0, 10); // 10 random questions

let quizData = {
  questions: shuffled,
  answers: Array(10).fill(null),
  index: 0,
  score: 0
};

let userQuiz = quizData;
let questions = userQuiz.questions;
let userAnswers = userQuiz.answers;
let currentQuestionIndex = userQuiz.index;
let score = userQuiz.score;

const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const optionsContainer = document.getElementById("options-container");
const progressBar = document.getElementById("progress-bar");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("previous-button");
const heading = document.getElementById("lasts-question");

function updateStorage() {
  userQuiz.answers = userAnswers;
  userQuiz.index = currentQuestionIndex;
  userQuiz.score = score;
  localStorage.setItem("quizData", JSON.stringify(userQuiz));
}

function updateHeading() {
  if (currentQuestionIndex === questions.length - 2) {
    heading.innerText = "Last 2 Questions Left";
  } else if (currentQuestionIndex === questions.length - 1) {
    heading.innerText = "Hey, this is the Last Question!";
  } else {
    heading.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  }
}

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.innerText = `${currentQuestionIndex + 1}. ${q.question}`;
  questionNumber.innerText = `${currentQuestionIndex + 1}`;

  optionsContainer.innerHTML = "";

  q.options.forEach((opt, i) => {
    const optEl = document.createElement("p");
    optEl.classList.add("option");
    optEl.setAttribute("data-value", i + 1);
    optEl.innerHTML = `<span>${i + 1}.</span> ${opt}`;
    if (userAnswers[currentQuestionIndex] === String(i + 1)) {
      optEl.classList.add("selected");
    }
    optEl.addEventListener("click", () => selectOption(optEl));
    optionsContainer.appendChild(optEl);
  });

  progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  prevButton.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";
  updateHeading();
}

function selectOption(optionEl) {
  document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
  optionEl.classList.add("selected");

  const selectedVal = optionEl.getAttribute("data-value");
  userAnswers[currentQuestionIndex] = selectedVal;
  updateStorage();
}

nextButton.addEventListener("click", () => {
  const selected = userAnswers[currentQuestionIndex];
  if (!selected) return alert("Please select an option first!");

  const correct = questions[currentQuestionIndex].answer;
  if (selected === correct) score++;

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
    updateStorage();
  } else {
    const attempt = questions.map((q, i) => {
      const selIndex = parseInt(userAnswers[i]) - 1;
      return {
        question: q.question,
        selectedAnswer: q.options[selIndex],
        correctAnswer: q.options[parseInt(q.answer) - 1]
      };
    });

    let attempts = JSON.parse(localStorage.getItem("attempts")) || {};
    if (!attempts[loggedInUser]) attempts[loggedInUser] = [];

    attempts[loggedInUser].push({
      timestamp: new Date().toISOString(),
      score: score * 1000,
      responses: attempt
    });

    localStorage.setItem("attempts", JSON.stringify(attempts));

    // Update score in user list
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(user =>
      user.email === loggedInUser ? { ...user, score: score * 1000 } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Hurray! Your quiz is completed.");
    localStorage.removeItem("quizData"); // clear current quiz
    window.location.href = "./scoreboard.html";
  }
});

prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
    updateStorage();
  }
});

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("quizData"); // clear quiz for next login
  window.location.href = "./login.html";
});

loadQuestion();
