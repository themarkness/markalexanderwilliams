if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

// Theme switcher
const themeToggleButton = document.getElementById('theme-toggle');
const doc = document.documentElement;

// Function to apply the theme
function applyTheme(theme) {
  if (theme === 'dark') {
    doc.setAttribute('data-theme', 'dark');
  } else {
    doc.removeAttribute('data-theme');
  }
}

// Event listener for the toggle button
themeToggleButton.addEventListener('click', () => {
  let currentTheme = localStorage.getItem('theme');
  let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
});

// Check for saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark) {
    applyTheme('dark');
  }
});
