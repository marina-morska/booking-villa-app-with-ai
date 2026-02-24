import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getNavbarHTML, renderNavbar, renderFooter } from './components/layout.js';
import { Home } from './pages/home.js';
import { Booking } from './pages/booking.js';
import { Gallery } from './pages/gallery.js';
import { Reviews } from './pages/reviews.js';
import { Contacts } from './pages/contacts.js';
import { Login } from './pages/login.js';
import { Register } from './pages/register.js';
import { Profile } from './pages/profile.js';
import { Admin } from './pages/admin.js';
import { getAuthState, signOut } from './services/authService.js';

class App {
  constructor() {
    this.currentPage = null;
    this.routeRequestId = 0;
    this.routes = {
      '/': Home,
      '/home': Home,
      '/booking': Booking,
      '/gallery': Gallery,
      '/reviews': Reviews,
      '/contacts': Contacts,
      '/login': Login,
      '/register': Register,
      '/profile': Profile,
      '/admin': Admin
    };
  }

  init() {
    // Set up routing
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Handle navigation links
    document.addEventListener('click', (e) => {
      const logoutLink = e.target.closest('[data-auth-action="logout"]');
      if (logoutLink) {
        e.preventDefault();
        this.handleLogout();
        return;
      }

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
    const requestId = ++this.routeRequestId;
    const path = window.location.pathname || '/';
    const authState = await getAuthState();
    if (requestId !== this.routeRequestId) {
      return;
    }

    const resolvedPath = this.getRouteForAccess(path, authState);

    if (resolvedPath !== path) {
      window.history.replaceState(null, '', resolvedPath);
    }

    const PageClass = this.routes[resolvedPath] || Home;
    const isHome = resolvedPath === '/' || resolvedPath === '/home';
    const page = new PageClass();
    const content = await page.render();
    if (requestId !== this.routeRequestId) {
      return;
    }
    
    const appDiv = document.getElementById('app');
    const otherPagesDiv = document.getElementById('other-pages-container');
    
    if (isHome) {
      // Render home page navbar
      const homeNavbar = document.getElementById('home-navbar');
      homeNavbar.innerHTML = getNavbarHTML(authState);
      
      // Render home page content
      const homePageContent = document.getElementById('home-page-content');
      homePageContent.replaceChildren(content);
      
      // Render home page footer
      this.renderHomeFooter();

      // Show home page, hide other pages
      appDiv.style.display = 'flex';
      otherPagesDiv.style.display = 'none';
      
      // Update active nav link
      this.updateActiveNavLink(resolvedPath, 'home-navbar');
    } else {
      // Render navbar and footer for other pages
      renderNavbar(null, authState);
      renderFooter();
      
      // Render page content
      const pageContent = document.getElementById('page-content');
      pageContent.replaceChildren(content);

      // Show other pages, hide home page
      appDiv.style.display = 'none';
      otherPagesDiv.style.display = 'flex';
      
      // Update active nav link
      this.updateActiveNavLink(resolvedPath);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }

  getRouteForAccess(path, authState) {
    const protectedRoutes = new Set(['/profile', '/admin']);
    const guestOnlyRoutes = new Set(['/login', '/register']);

    if (protectedRoutes.has(path) && !authState.user) {
      return '/login';
    }

    if (path === '/admin' && authState.role !== 'admin') {
      return '/profile';
    }

    if (guestOnlyRoutes.has(path) && authState.user) {
      return '/profile';
    }

    return path;
  }

  async handleLogout() {
    await signOut();
    this.navigateTo('/home');
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
