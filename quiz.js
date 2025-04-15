const allQuestions = [
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "2" },
  { question: "What is the Capital of France?", options: ["Madrid", "Berlin", "Paris", "Lisbon"], answer: "3" },
  { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Hemingway", "Austen", "Tolkien"], answer: "1" },
  { question: "Which planet is Closest to Sun?", options: ["Earth", "Mars", "Mercury", "Venus"], answer: "3" },
  { question: "which ocean is Largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "4" },
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "3" },
  { question: "What is the Chemical symbol 'O'?", options: ["Oxygen", "Gold", "Osmium", "Ozone"], answer: "1" },
  { question: "What is Freezing point of water?", options: ["0", "100", "-10", "50"], answer: "1" },
  { question: "Who painted Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"], answer: "2" },
  { question: "What is the Capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], answer: "3" },
  { question: "Which is the Largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippo"], answer: "2" },
  { question: "Which is the Fastest land animal?", options: ["Tiger", "Leopard", "Cheetah", "Lion"], answer: "3" },
  { question: "How many bones are there in Human?", options: ["206", "208", "210", "212"], answer: "1" },
  { question: "Which is the Smallest prime number?", options: ["0", "1", "2", "3"], answer: "3" },
  { question: "What is meant by H2O?", options: ["Salt", "Oxygen", "Water", "Hydrogen"], answer: "3" }
];

const loggedInUser = localStorage.getItem("loggedInUser") || "guest";

let storedQuiz = JSON.parse(localStorage.getItem("quizData")) || {};
if (!storedQuiz[loggedInUser]) {
  const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
  storedQuiz[loggedInUser] = {
    questions: shuffled,
    answers: Array(10).fill(null),
    index: 0,
    score: 0
  };
  localStorage.setItem("quizData", JSON.stringify(storedQuiz));
}

let quiz = storedQuiz[loggedInUser];
let questions = quiz.questions;
let userAnswers = quiz.answers;
let currentQuestionIndex = quiz.index;
let score = quiz.score;

const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const optionsContainer = document.getElementById("options-container");
const progressBar = document.getElementById("progress-bar");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("previous-button");
const heading = document.getElementById("lasts-question");

function updateStorage() {
  storedQuiz[loggedInUser].answers = userAnswers;
  storedQuiz[loggedInUser].index = currentQuestionIndex;
  storedQuiz[loggedInUser].score = score;
  localStorage.setItem("quizData", JSON.stringify(storedQuiz));
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
  questionText.innerHTML = `${q.question}`;
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
      score: score,
      responses: attempt
    });

    localStorage.setItem("attempts", JSON.stringify(attempts));
    alert("Hurray your Quiz completed!");
    localStorage.removeItem("quizData");
    window.location.href = "scoreboard.html";
  }
});

prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
    updateStorage();
  }
});

loadQuestion();



let countdownTime = localStorage.getItem('countdownTime') ? parseInt(localStorage.getItem('countdownTime')) : 10 * 60; // Get saved time or default to 10 minutes

function updateTime() {
  const minutes = String(Math.floor(countdownTime / 60)).padStart(2, '0');
  const seconds = String(countdownTime % 60).padStart(2, '0');
  document.getElementById("time").textContent = `${minutes}:${seconds}`;
  
  // Decrease the countdown time by 1 second
  countdownTime--;
  
  // Save the updated countdown time in localStorage
  localStorage.setItem('countdownTime', countdownTime);
  
  // If time runs out, trigger logout
  if (countdownTime < 0) {
    logout();
  }
}

// Update time every second
setInterval(updateTime, 1000);

// Timeout timer for logout (e.g., 10 minutes)
const timeoutDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
let timeout;

// Reset the timeout every time the user interacts
function resetTimeout() {
  clearTimeout(timeout);
  timeout = setTimeout(logout, timeoutDuration);
}

// Function to handle logout
function logout() {
  // Save selected answers when the user times out
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
    score: score,
    responses: attempt
  });

  localStorage.setItem("attempts", JSON.stringify(attempts));

  // Clear quiz data
  localStorage.removeItem("quizData");
  localStorage.removeItem("loggedInUser");

  // Redirect to login page
  window.location.href = "login.html";
}

// Add event listener to the logout button
document.getElementById("logout").addEventListener("click", function () {
  logout();
});

// Reset timeout on any user interaction (click, keypress, etc.)
window.addEventListener("click", resetTimeout);
window.addEventListener("keypress", resetTimeout);

// Start the timeout countdown
resetTimeout();

