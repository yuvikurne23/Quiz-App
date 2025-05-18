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
    startTime: new Date().toISOString()  // Save quiz start time here
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

  // Remove incremental score update here

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
    updateStorage();
  } else {
    // Quiz finished, compute score based on final answers
    const endTime = new Date().toISOString();

    const attempt = questions.map((q, i) => {
      const selIndex = parseInt(userAnswers[i]) - 1;
      return {
        question: q.question,
        selectedAnswer: q.options[selIndex],
        correctAnswer: q.options[parseInt(q.answer) - 1]
      };
    });

    // Calculate the correct answers count here
    const correctCount = attempt.filter(r => r.selectedAnswer === r.correctAnswer).length;

    let attempts = JSON.parse(localStorage.getItem("attempts")) || {};
    if (!attempts[loggedInUser]) attempts[loggedInUser] = [];

    attempts[loggedInUser].push({
      timestamp: endTime,
      startTime: userQuiz.startTime,    // Save start time
      endTime: endTime,                 // Save end time
      score: correctCount,              // Save the actual count of correct answers here
      responses: attempt
    });

    localStorage.setItem("attempts", JSON.stringify(attempts));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(user =>
      user.email === loggedInUser ? { ...user, score: correctCount } : user
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



/*
questions.push(
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: 3
    },
    {
        question: "Which is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Saturn", "Mars"],
        answer: 2
    },{
        question: "Who wrote 'Hamlet'?",
        options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
        answer: 1
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Oxygen", "Osmium", "Ozone", "Ocelot"],
        answer: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        answer: 4
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: 2
    },
    {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
        answer: 3
    },
    {
        question: "Who discovered gravity?",
        options: ["Einstein", "Newton", "Galileo", "Copernicus"],
        answer: 2
    },
    {
        question: "Which is the longest river in the world?",
        options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        answer: 2
    },
    {
        question: "In which country would you find the Great Barrier Reef?",
        options: ["Australia", "USA", "Canada", "Mexico"],
        answer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
        answer: 3
    },
    {
        question: "Which language is primarily spoken in Brazil?",
        options: ["Spanish", "Portuguese", "French", "Italian"],
        answer: 2
    },
    {
        question: "What is the speed of light?",
        options: ["3x10^8 m/s", "5x10^8 m/s", "2x10^8 m/s", "4x10^8 m/s"],
        answer: 1
    },
    {
        question: "Which is the highest mountain in the world?",
        options: ["K2", "Everest", "Kangchenjunga", "Makalu"],
        answer: 2
    },
    {
        question: "What is the chemical formula of water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        answer: 1
    }
);

// Storing the questions in localStorage
localStorage.setItem('allQuestions', JSON.stringify(questions));

console.log("15 questions added to localStorage!");
*/