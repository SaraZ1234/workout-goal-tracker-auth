// /public/js/login.js
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent default form reload

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include" // important for cookies/session
    });

    const data = await res.json();

    if (res.ok) {
      // save role in localStorage (optional, used for navbar update)
      localStorage.setItem("userType", data.role === 1 ? "admin" : "user");

      // redirect based on role
      if (data.role === 1) {
        window.location.href = "/api/admin/dashboard"; // your admin page
      } else {
        window.location.href = "/api/user/dashboard"; // normal user page
      }
    } else {
      alert(data.message); // show error if login failed
    }
  } catch (err) {
    console.error(err);
  }
});
