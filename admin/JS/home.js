function handleNavigation(page) {
    switch (page) {
        case "home":
               window.location.href=`/admin/home.html`
            break;
        case "quizz":
               window.location.href=`/admin/addQuiz.html`
            break;
        case "users":
              window.location.href=`/admin/users.html`
            break;
    
        default:
            window.location.href = "/admin/home.html";
            break;
    }
}


const menuButton = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');
const sidebarItems = document.querySelectorAll('.sidebar ul li');

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
document.getElementById('logout').addEventListener('click', ()=>{
    localStorage.removeItem('loggedInUser');
    window.location.href = '../login.html'
})
