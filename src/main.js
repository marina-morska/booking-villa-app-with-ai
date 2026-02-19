import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { renderNavbar, renderFooter } from './components/layout.js';
import { Home } from './pages/home.js';
import { Booking } from './pages/booking.js';
import { Gallery } from './pages/gallery.js';
import { Amenities } from './pages/amenities.js';
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
      '/amenities': Amenities,
      '/reviews': Reviews,
      '/contacts': Contacts
    };
  }

  init() {
    // Render static components
    renderNavbar();
    renderFooter();
    
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
    
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = '';
    
    const page = new PageClass();
    const content = await page.render();
    pageContent.appendChild(content);
    
    // Update active nav link
    this.updateActiveNavLink(path);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }

  updateActiveNavLink(path) {
    document.querySelectorAll('.navbar a[data-link]').forEach(link => {
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
