function handleNavigation(page) {
  switch (page) {
    case "home":
      window.location.href = `./home.html`;
      break;
    case "quizz":
      window.location.href = `./addQuiz.html`;
      break;
    case "users":
      window.location.href = `./users.html`;
      break;
    default:
      window.location.href = `./home.html`;
      break;
  }
}

const menuButton = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  window.location.href = '../quizlogin.html';
});

menuButton.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

function adminProfile() {
  const profile = document.getElementById('admin-popup');
  profile.style.display = profile.style.display === 'block' ? 'none' : 'block';
}

let questions = JSON.parse(localStorage.getItem("allQuestions")) || [];

const tbody = document.querySelector(".tbody");
const addBtn = document.getElementById("add-question");
const modal = document.getElementById("questionModal");
const questionDetails = document.querySelector(".question-details");
const closeModal = document.querySelector(".close");

// Add form modal
const formModal = document.createElement("div");
formModal.id = "formModal";
formModal.className = "modal";
formModal.innerHTML = `
  <div class="modal-content">
    <span class="close" id="formClose">&times;</span>
    <div class="model-head"><h2>Add Question</h2></div>
    <form id="questionForm">
      <label>Question:</label>
      <input type="text" id="formQuestion" required />

      <label>Option 1:</label>
      <input type="text" id="formOption1" required />

      <label>Option 2:</label>
      <input type="text" id="formOption2" required />

      <label>Option 3:</label>
      <input type="text" id="formOption3" required />

      <label>Option 4:</label>
      <input type="text" id="formOption4" required />

      <label>Correct Option:</label>
      <select id="formAnswer" required>
        <option value="">Select correct option</option>
      </select>

      <input type="hidden" id="editIndex" />
      <button type="submit">Save</button>
    </form>
  </div>
`;
document.body.appendChild(formModal);

const optionInputs = [
  document.getElementById("formOption1"),
  document.getElementById("formOption2"),
  document.getElementById("formOption3"),
  document.getElementById("formOption4")
];
const answerSelect = document.getElementById("formAnswer");

function updateAnswerDropdown() {
  answerSelect.innerHTML = `<option value="">Select correct option</option>`;
  optionInputs.forEach((input, i) => {
    const val = input.value.trim();
    if (val) {
      const option = document.createElement("option");
      option.value = i + 1;
      option.textContent = `${i + 1}. ${val}`;
      answerSelect.appendChild(option);
    }
  });
}
optionInputs.forEach(input => input.addEventListener("input", updateAnswerDropdown));

function renderQuestions() {
  tbody.innerHTML = "";
  questions.forEach((q, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${q.question}</td>
      <td class="action">
        <span onclick="viewQuestion(${i})"><i class='fa fa-eye'></i></span>
        <span onclick="openForm(${i})"><i class='fa fa-pen'></i></span>
        <span onclick="deleteQuestion(${i})"><i class='fa fa-trash'></i></span>
      </td>
    `;
    tbody.appendChild(tr);
  });
  localStorage.setItem("allQuestions", JSON.stringify(questions));
}

function deleteQuestion(index) {
  const confirmModal = document.getElementById("delete-modal");
  confirmModal.style.display = "block";
  document.getElementById("delete").onclick = () => {
    questions.splice(index, 1);
    renderQuestions();
    confirmModal.style.display = "none";
  };
  document.getElementById("cancel").onclick = () => {
    confirmModal.style.display = "none";
  };
}

function viewQuestion(index) {
  const q = questions[index];
  questionDetails.innerHTML = `
    <p><strong>Question:</strong> ${q.question}</p>
    <ul>${q.options.map((opt, i) => `<li>${i + 1}. ${opt}</li>`).join("")}</ul>
    <p class="ans"><strong>Answer:</strong> ${q.options[parseInt(q.answer) - 1]}</p>
  `;
  modal.style.display = "block";
}

function openForm(index = -1) {
  const isEdit = index !== -1;
  document.getElementById("editIndex").value = isEdit ? index : "";
  document.getElementById("formQuestion").value = isEdit ? questions[index].question : "";
  document.getElementById("formOption1").value = isEdit ? questions[index].options[0] : "";
  document.getElementById("formOption2").value = isEdit ? questions[index].options[1] : "";
  document.getElementById("formOption3").value = isEdit ? questions[index].options[2] : "";
  document.getElementById("formOption4").value = isEdit ? questions[index].options[3] : "";

  updateAnswerDropdown();

  if (isEdit) {
    document.getElementById("formAnswer").value = questions[index].answer;
  }

  formModal.style.display = "block";
}

addBtn.addEventListener("click", () => openForm());

document.getElementById("formClose").addEventListener("click", () => {
  formModal.style.display = "none";
});

document.getElementById("questionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const question = document.getElementById("formQuestion").value.trim();
  const options = optionInputs.map(inp => inp.value.trim());
  const answer = document.getElementById("formAnswer").value;
  const editIndex = document.getElementById("editIndex").value;

  const questionData = { question, options, answer };

  if (editIndex === "") {
    questions.push(questionData);
  } else {
    questions[parseInt(editIndex)] = questionData;
  }

  formModal.style.display = "none";
  renderQuestions();
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

renderQuestions();
