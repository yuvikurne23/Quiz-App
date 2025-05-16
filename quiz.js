// const loggedInUser = localStorage.getItem("loggedInUser") || "guest";

// // On every login, we reset quizData for the user
// let adminQuestions = JSON.parse(localStorage.getItem("allQuestions")) || [];
// const shuffled = adminQuestions.sort(() => Math.random() - 0.5).slice(0, 10); // 10 random questions

// // Load existing quizData if available
// let quizData = JSON.parse(localStorage.getItem("quizData"));
// if (!quizData || !quizData.questions || quizData.questions.length === 0) {
//   const adminQuestions = JSON.parse(localStorage.getItem("allQuestions")) || [];
//   const shuffled = adminQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
//   quizData = {
//     questions: shuffled,
//     answers: Array(shuffled.length).fill(null),
//     index: 0,
//     score: 0
//   };
//   localStorage.setItem("quizData", JSON.stringify(quizData));
// }

// let userQuiz = quizData;
// let questions = userQuiz.questions;
// let userAnswers = userQuiz.answers;
// let currentQuestionIndex = userQuiz.index;
// let score = userQuiz.score;

// const questionText = document.getElementById("question-text");
// const questionNumber = document.getElementById("question-number");
// const optionsContainer = document.getElementById("options-container");
// const progressBar = document.getElementById("progress-bar");
// const nextButton = document.getElementById("next-button");
// const prevButton = document.getElementById("previous-button");
// const heading = document.getElementById("lasts-question");

// function updateStorage() {
//   userQuiz.answers = userAnswers;
//   userQuiz.index = currentQuestionIndex;
//   userQuiz.score = score;
//   localStorage.setItem("quizData", JSON.stringify(userQuiz));
// }

// function updateHeading() {
//   if (currentQuestionIndex === questions.length - 2) {
//     heading.innerText = "Last 2 Questions Left";
//   } else if (currentQuestionIndex === questions.length - 1) {
//     heading.innerText = "Hey, this is the Last Question!";
//   } else {
//     heading.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
//   }
// }

// function loadQuestion() {
//   const q = questions[currentQuestionIndex];
//   questionText.innerText = `${currentQuestionIndex + 1}. ${q.question}`;
//   questionNumber.innerText = `${currentQuestionIndex + 1}`;
//   optionsContainer.innerHTML = "";

//   q.options.forEach((opt, i) => {
//     const optEl = document.createElement("p");
//     optEl.classList.add("option");
//     optEl.setAttribute("data-value", i + 1);
//     optEl.innerHTML = `<span>${i + 1}.</span> ${opt}`;

//     if (userAnswers[currentQuestionIndex] === String(i + 1)) {
//       optEl.classList.add("selected");
//     }

//     optEl.addEventListener("click", () => selectOption(optEl));
//     optionsContainer.appendChild(optEl);
//   });

//   progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
//   prevButton.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";
//   updateHeading();
// }

// function selectOption(optionEl) {
//   document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
//   optionEl.classList.add("selected");

//   const selectedVal = optionEl.getAttribute("data-value");
//   userAnswers[currentQuestionIndex] = selectedVal;
//   updateStorage();
// }

// nextButton.addEventListener("click", () => {
//   const selected = userAnswers[currentQuestionIndex];
//   if (!selected) return alert("Please select an option first!");

//   const correct = questions[currentQuestionIndex].answer;
//   if (selected === correct) score++;

//   if (currentQuestionIndex < questions.length - 1) {
//     currentQuestionIndex++;
//     loadQuestion();
//     updateStorage();
//   } else {
    
//     const attempt = questions.map((q, i) => {
//       const selIndex = parseInt(userAnswers[i]) - 1;
//       return {
//         question: q.question,
//         selectedAnswer: q.options[selIndex],
//         correctAnswer: q.options[parseInt(q.answer) - 1]
//       };
//     });

//     let attempts = JSON.parse(localStorage.getItem("attempts")) || {};
//     if (!attempts[loggedInUser]) attempts[loggedInUser] = [];

//     attempts[loggedInUser].push({
//       timestamp: new Date().toISOString(),
//       score: score * 1000,
//       responses: attempt
//     });

//     localStorage.setItem("attempts", JSON.stringify(attempts));

//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const updatedUsers = users.map(user =>
//       user.email === loggedInUser ? { ...user, score: score * 1000 } : user
//     );
//     localStorage.setItem("users", JSON.stringify(updatedUsers));

//     alert("Hurray! Your quiz is completed.");
//     localStorage.removeItem("quizData");
//     window.location.href = "./scoreboard.html";
//   }
// });

// prevButton.addEventListener("click", () => {
//   if (userAnswers.slice(0, currentQuestionIndex).every(ans => ans === null)) {
//     alert("You need to attempt at least one question to go back.");
//     return;
//   }

//   if (currentQuestionIndex > 0) {
//     currentQuestionIndex--;
//     loadQuestion();
//     updateStorage();
//   }
// });

// document.getElementById("logout").addEventListener("click", () => {
//   localStorage.removeItem("loggedInUser");
//   localStorage.removeItem("quizData");
//   window.location.href = "./login.html";
// });

// loadQuestion();



const loggedInUser = localStorage.getItem("loggedInUser") || "guest";

let adminQuestions = JSON.parse(localStorage.getItem("allQuestions")) || [];
const shuffled = adminQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

let quizData = JSON.parse(localStorage.getItem("quizData"));
if (!quizData || !quizData.questions || quizData.questions.length === 0) {
  quizData = {
    questions: shuffled,
    answers: Array(shuffled.length).fill(null),
    index: 0,
    score: 0,
    startTime: Date.now()
  };
  localStorage.setItem("quizData", JSON.stringify(quizData));
}

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
    // Calculate total time taken in seconds
    const timeTakenSeconds = Math.floor((Date.now() - userQuiz.startTime) / 1000);

    // Prepare attempt responses with full details
    const attemptResponses = questions.map((q, i) => {
      const selIndex = parseInt(userAnswers[i]) - 1;
      return {
        question: q.question,
        options: q.options,
        selectedAnswer: q.options[selIndex],
        correctAnswer: q.options[parseInt(q.answer) - 1]
      };
    });

    let attempts = JSON.parse(localStorage.getItem("attempts")) || {};
    if (!attempts[loggedInUser]) attempts[loggedInUser] = [];

    attempts[loggedInUser].push({
      timestamp: new Date().toISOString(),
      score: score,
      responses: attemptResponses,
      timeTakenSeconds: timeTakenSeconds
    });

    localStorage.setItem("attempts", JSON.stringify(attempts));

    // Update user score too (optional)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(user =>
      user.email === loggedInUser ? { ...user, score: score } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Hurray! Your quiz is completed.");
    localStorage.removeItem("quizData");
    window.location.href = "./scoreboard.html";
  }
});

prevButton.addEventListener("click", () => {
  if (userAnswers.slice(0, currentQuestionIndex).every(ans => ans === null)) {
    alert("You need to attempt at least one question to go back.");
    return;
  }

  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
    updateStorage();
  }
});

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("quizData");
  window.location.href = "./login.html";
});

loadQuestion();
