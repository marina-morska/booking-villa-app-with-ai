function getAuthLinks(authState = { user: null, role: 'guest' }) {
  if (!authState.user) {
    return `
      <li class="nav-item">
        <a class="nav-link" href="/login" data-link>Log in</a>
      </li>
    `;
  }

  return `
    <li class="nav-item">
      <a class="nav-link" href="/profile" data-link>Profile</a>
    </li>
    ${authState.role === 'admin' ? `
      <li class="nav-item">
        <a class="nav-link" href="/admin" data-link>Admin</a>
      </li>
    ` : ''}
    <li class="nav-item">
      <a class="nav-link" href="#" data-auth-action="logout">Logout</a>
    </li>
  `;
}

export function getNavbarHTML(authState = { user: null, role: 'guest' }) {
  return `
    <div class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/" data-link>
          Villa Paradise
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link active" href="/" data-link>
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/booking" data-link>
                Booking
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/gallery" data-link>
                Gallery
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/reviews" data-link>
                Reviews
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/contacts" data-link>
                Contacts
              </a>
            </li>
            ${getAuthLinks(authState)}
          </ul>
        </div>
      </div>
    </div>
  `;
}

export function renderNavbar(targetElement = null, authState = { user: null, role: 'guest' }) {
  const navbar = targetElement || document.getElementById('navbar');
  if (!navbar) {
    return;
  }
  navbar.innerHTML = getNavbarHTML(authState);
}

export function renderFooter() {
  const footer = document.getElementById('footer');
  const currentYear = new Date().getFullYear();
  
  const footerHTML = `
    <div class="footer-bottom">
      <p>&copy; ${currentYear} Villa Paradise. All rights reserved.</p>
      <div style="font-size: 1.5rem; display: flex; gap: 1rem; justify-content: center; margin-top: 0.75rem;">
        <a href="#" style="color: rgba(255, 255, 255, 0.8);" title="Facebook">
          <i class="bi bi-facebook"></i>
        </a>
        <a href="#" style="color: rgba(255, 255, 255, 0.8);" title="Instagram">
          <i class="bi bi-instagram"></i>
        </a>
        <a href="#" style="color: rgba(255, 255, 255, 0.8);" title="Twitter">
          <i class="bi bi-twitter"></i>
        </a>
      </div>
    </div>
  `;
  
  footer.innerHTML = footerHTML;
}
