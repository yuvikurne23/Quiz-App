
function handleNavigation(page) {
    switch (page) {
        case "home":
               window.location.href=`./home.html`
            break;
        case "quizz":
               window.location.href=`./addQuiz.html`
            break;
        case "users":
              window.location.href=`./users.html`
            break;
    
        default:
            window.location.href=`./home.html`
            break;
    }
}

const menuButton = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');
menuButton.addEventListener('click', () => {
    // Toggle the sidebar visibility
    sidebar.classList.toggle('hidden');
});

function adminProfile() {
    const adminProfile = document.getElementById('admin-profile')
    const profile = document.getElementById('admin-popup')
    if (profile.style.display === 'none' || profile.style.display === '') {
        profile.style.display = 'block'; // Show the button
    } else {
        profile.style.display = 'none'; // Hide the button
    }
}

const data = JSON.parse(localStorage.getItem("signup")) || [];

const tableBody = document.querySelector('tbody')
tableBody.innerHTML = ''
data.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${index+1 || "N/A"}</td>
    <td>${item.name || "N/A"}</td>
    <td>${item.email || "N/A"}</td>
    <td>${item.results.length || "N/A"}</td>
    <td>${item.score || "N/A"}</td>
    <td>
    <a href="./user-detail.html?id=${index}" class="view-result">View Result</a>
</td>
`;

    tableBody.appendChild(row);
});

document.getElementById('logout').addEventListener('click', ()=>{
    localStorage.removeItem('loggedInUser');
    window.location.href = '../quizlogin.html'
})
