# Quiz-App

$reposPath = "C:\Users\YourUsername\Projects"  # Change this to your actual repositories folder
$readmeContent = @"
# 👋 Hi, I'm Yuvikurne!  

🚀 *Frontend Developer | Web Enthusiast | UI/UX Explorer*  

Welcome to my GitHub! I’m passionate about building interactive and user-friendly web applications. I specialize in crafting sleek, responsive, and high-performing websites.  

## 🌟 About Me  
- 🎨 Passionate about *Frontend Development & UI/UX*  
- 💼 Building responsive and dynamic web applications  
- 🔥 Skilled in *HTML, CSS, JavaScript, React, Tailwind CSS*  
- 📚 Always learning new technologies and best practices  

## 🛠 Tech Stack  
🔹 *Languages:* HTML, CSS, JavaScript  
🔹 *Frameworks/Libraries:* React.js, Tailwind CSS, Bootstrap  
🔹 *Tools:* Git, GitHub, VS Code, Figma  

## 📌 Projects  
🚀 Check out my *GitHub*  
More projects coming soon! Stay tuned.  

## 👯 Let's Connect!  
🔗 [GitHub](https://github.com/yuvikurne)  
🔗 [LinkedIn](https://www.linkedin.com/in/yuvrajkurne0223/)  
🔗 [Email](mailto:yuvrajkurne2311@gmail.com)  

💡 *"Code, Create, and Innovate!"*  
"@

# Get all repositories in the directory
$repos = Get-ChildItem -Path $reposPath -Directory

foreach ($repo in $repos) {
    $readmePath = "$($repo.FullName)\README.md"
    if (!(Test-Path $readmePath)) {
        # Create README.md and write content
        $readmeContent | Out-File -Encoding utf8 $readmePath

        # Navigate to repo and commit changes
        Set-Location $repo.FullName
        git add README.md
        git commit -m "Added README"
        git push origin main  # Adjust if using 'master' instead of 'main'
    }
}
