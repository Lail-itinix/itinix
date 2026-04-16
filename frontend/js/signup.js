document.getElementById("signupForm").addEventListener("submit", function(e){
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const cek = users.find(user => user.email === email);

    if(cek){
        alert("Email sudah terdaftar!");
        return;
    }

    users.push({
        username,
        email,
        password,
        history:[]
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup berhasil!");
    window.location.href = "login.html";
});