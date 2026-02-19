export class Home {
  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to Villa Paradise</h1>
          <p>Experience luxury living in a stunning beachfront villa</p>
          <a href="/booking" class="btn btn-secondary btn-lg" data-link>
            <i class="bi bi-calendar-check"></i> Book Now
          </a>
        </div>
      </section>
    `;
    
    return container;
  }
}
