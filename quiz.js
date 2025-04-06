let score = 0;

const questions = [
  { question: "1. What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "2" },
  { question: "2. Which is the capital of France?", options: ["Madrid", "Berlin", "Paris", "Lisbon"], answer: "3" },
  { question: "3. Who wrote 'Hamlet'?", options: ["Shakespeare", "Hemingway", "Austen", "Tolkien"], answer: "1" },
  { question: "4. Which planet is closest to the Sun?", options: ["Earth", "Mars", "Mercury", "Venus"], answer: "3" },
  { question: "5. What is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "4" },
  { question: "6. How many continents are there?", options: ["5", "6", "7", "8"], answer: "3" },
  { question: "7. Which element has the chemical symbol 'O'?", options: ["Oxygen", "Gold", "Osmium", "Ozone"], answer: "1" },
  { question: "8. What is the freezing point of water in Celsius?", options: ["0", "100", "-10", "50"], answer: "1" },
  { question: "9. Who painted the Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"], answer: "2" },
  { question: "10. What is the capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], answer: "3" }
];

let currentQuestionIndex = 0;
let currentQuestion = 1;

const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const optionsContainer = document.getElementById("options-container");
const progressBar = document.getElementById("progress-bar");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("previous-button");

// Get logged-in user
const loggedInUser = localStorage.getItem("loggedInUser");

// Load existing user answers if available
let userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
if (!userAnswers[loggedInUser]) {
  userAnswers[loggedInUser] = Array(questions.length).fill(null);
}

// Helper to update heading
function updateHeading() {
  const heading = document.getElementById('lasts-question');
  if (currentQuestion === 9) {
    heading.innerText = "Last 2 Questions Left";
  } else if (currentQuestion === 10) {
    heading.innerText = "Hey, this is the Last Question!";
  } else {
    heading.innerText = `Question ${currentQuestion} of 10`;
  }
}

// Load a question to UI
function loadQuestion() {
  const question = questions[currentQuestionIndex];
  questionNumber.innerText = currentQuestionIndex + 1;
  questionText.innerText = question.question;
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionElement = document.createElement("p");
    optionElement.classList.add("option");
    optionElement.setAttribute("data-value", index + 1);
    optionElement.innerHTML = `<span>${index + 1}.</span> ${option}`;

    // Highlight previously selected answer
    if (userAnswers[loggedInUser][currentQuestionIndex] === String(index + 1)) {
      optionElement.classList.add("selected");
    }

    optionElement.addEventListener("click", () => selectOption(optionElement));
    optionsContainer.appendChild(optionElement);
  });

  progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  updateHeading();
}

// Handle answer selection
function selectOption(selectedOption) {
  document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
  selectedOption.classList.add("selected");

  const selectedValue = selectedOption.getAttribute("data-value");
  userAnswers[loggedInUser][currentQuestionIndex] = selectedValue;

  // Save to localStorage
  localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
}

// Navigation
nextButton.addEventListener("click", () => {
  const currentQ = questions[currentQuestionIndex];  // renamed to currentQ
  

  // Optional: Validate the answer using your logic
  const selectedOption = document.querySelector(".option.selected");
  if (selectedOption) {
    const selectedValue = selectedOption.getAttribute("data-value");
    if (selectedValue === currentQ.answer) {
      score++;
    }
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    currentQuestion++; // Now correctly refers to the global one for heading
    loadQuestion();
  } else {
    // Save score to user's profile in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = localStorage.getItem('loggedInUser');
    const index = users.findIndex(user => user.email === loggedInUser);
  
    if (index !== -1) {
      users[index].score = score; // update score
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    localStorage.setItem("userScore", score); // optional
    alert("Hurray Champ You Completed The Quiz!");
    window.location.href = "scoreboard.html";
  }
});



prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
});

// Initialize
loadQuestion();

