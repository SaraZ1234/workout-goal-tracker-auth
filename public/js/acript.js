const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.menu-overlay');

function toggleMenu() {
  const isActive = menu.classList.toggle('active');
  overlay.classList.toggle('active', isActive);
  hamburger.classList.toggle('active', isActive);

  // Toggle aria attributes for accessibility
  menu.setAttribute('aria-hidden', !isActive);
  hamburger.setAttribute('aria-expanded', isActive);
}

hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);


document.addEventListener('DOMContentLoaded', async () => {
  // fetch role from backend session
  let userType = 'user';
  try {
    const res = await fetch("/api/user/role", { credentials: "include" });
    const data = await res.json();
    if (data.role === 1) userType = 'admin';
  } catch (err) {
    console.error(err);
  }

  const adminLinkHTML = '<li class="admin-link"><a href="/admin_dashboard.html">Admin Panel</a></li>';

  const desktopNav = document.querySelector('nav.navbar ul');
  if (userType === 'admin' && desktopNav && !desktopNav.querySelector('.admin-link')) {
    desktopNav.insertAdjacentHTML('beforeend', adminLinkHTML);
  }

  const mobileNav = document.querySelector('.menu nav ul');
  if (userType === 'admin' && mobileNav && !mobileNav.querySelector('.admin-link')) {
    mobileNav.insertAdjacentHTML('beforeend', adminLinkHTML);
  }
});


// if (data.role === 1) {
//   window.location.href = "/admin_dashboard.html";
// } else {
//   window.location.href = "/user_dashboard.html";
// }
