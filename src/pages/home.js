// Force reload: 2026-02-21-001
export class Home {
  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to Villa Blue Summer</h1>
          <p>Experience comfort and warmth and create unforgettable memories</p>
          <p>A luxurius house with incredible sea views in the heart of Ropotamo Nature Reserve. Villa Blue Summer, Primorsko has bed capacity of 8 distributed in 3 separate rooms, each with its own bathroom.</p>
          <p>The villa has a large, luxurious and heated swimming pool, a fully equipped kitchen, and spacious living areas perfect for relaxation and entertainment.</p>
          <a href="/booking" class="btn btn-secondary btn-lg home-book-btn" data-link>
            <i class="bi bi-calendar-check"></i> Book Now
          </a>
        </div>
      </section>

      <!-- Transparent Overlay Panel -->
      <div class="overlay-panel">
        <blockquote class="overlay-quote">
          <p>"Cause a little bit of summer's what the whole year's all about."</p>
          <footer>—John Mayer</footer>
        </blockquote>
      </div>
    `;
    
    return container;
  }
}
