import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { renderNavbar, renderFooter } from './components/layout.js';
import { Home } from './pages/home.js';
import { Booking } from './pages/booking.js';
import { Gallery } from './pages/gallery.js';
import { Reviews } from './pages/reviews.js';
import { Contacts } from './pages/contacts.js';

class App {
  constructor() {
    this.currentPage = null;
    this.routes = {
      '/': Home,
      '/home': Home,
      '/booking': Booking,
      '/gallery': Gallery,
      '/reviews': Reviews,
      '/contacts': Contacts
    };
  }

  init() {
    // Set up routing
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Handle navigation links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigateTo(href);
      }
    });
    
    // Initial route
    this.handleRoute();
  }

  navigateTo(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname || '/';
    const PageClass = this.routes[path] || Home;
    const isHome = path === '/' || path === '/home';
    
    const appDiv = document.getElementById('app');
    const otherPagesDiv = document.getElementById('other-pages-container');
    
    if (isHome) {
      // Show home page, hide other pages
      appDiv.style.display = 'flex';
      otherPagesDiv.style.display = 'none';
      
      // Render home page navbar
      const homeNavbar = document.getElementById('home-navbar');
      homeNavbar.innerHTML = this.getNavbarHTML();
      
      // Render home page content
      const homePageContent = document.getElementById('home-page-content');
      homePageContent.innerHTML = '';
      const page = new PageClass();
      const content = await page.render();
      homePageContent.appendChild(content);
      
      // Render home page footer
      this.renderHomeFooter();
      
      // Update active nav link
      this.updateActiveNavLink(path, 'home-navbar');
    } else {
      // Show other pages, hide home page
      appDiv.style.display = 'none';
      otherPagesDiv.style.display = 'flex';
      
      // Render navbar and footer for other pages
      renderNavbar();
      renderFooter();
      
      // Render page content
      const pageContent = document.getElementById('page-content');
      pageContent.innerHTML = '';
      const page = new PageClass();
      const content = await page.render();
      pageContent.appendChild(content);
      
      // Update active nav link
      this.updateActiveNavLink(path);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }

  getNavbarHTML() {
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
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderHomeFooter() {
    const footer = document.getElementById('home-footer');
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

  updateActiveNavLink(path, navbarId = null) {
    const navbarSelector = navbarId ? `#${navbarId}` : '';
    document.querySelectorAll(`${navbarSelector} .navbar a[data-link]`).forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '/' && href === '/home')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
  });
} else {
  const app = new App();
  app.init();
}
