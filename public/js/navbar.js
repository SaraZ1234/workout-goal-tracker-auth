document.addEventListener("DOMContentLoaded", async () => {
  try {
    const nav = document.querySelector(".navbar ul");
    if (!nav) return; // exit if navbar not found

    // Fetch user role from server
    const res = await fetch("/api/user/role", { credentials: "include" });
    const data = await res.json();

    if (data.success && data.role === 1) {
      // Create and append admin link
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "/api/admin/dashboard"; // redirect to admin dashboard
      link.textContent = "Admin";
      li.appendChild(link);
      nav.appendChild(li);
    }
  } catch (err) {
    console.error("Failed to fetch user role:", err);
  }
});
