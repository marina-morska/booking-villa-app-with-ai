export class Gallery {
  constructor() {
    this.galleryImages = [
      { id: 1, title: 'Main Living Room', category: 'interior' },
      { id: 2, title: 'Master Bedroom', category: 'bedroom' },
      { id: 3, title: 'Beachfront View', category: 'exterior' },
      { id: 4, title: 'Modern Kitchen', category: 'interior' },
      { id: 5, title: 'Private Pool', category: 'exterior' },
      { id: 6, title: 'Guest Suite', category: 'bedroom' },
      { id: 7, title: 'Dining Area', category: 'interior' },
      { id: 8, title: 'Beach Access', category: 'exterior' },
      { id: 9, title: 'Terrace Sunset', category: 'exterior' },
      { id: 10, title: 'Spa & Wellness', category: 'amenities' },
      { id: 11, title: 'Movie Theater', category: 'amenities' },
      { id: 12, title: 'Scenic Surroundings', category: 'exterior' }
    ];
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    
    const filterButtons = `
      <div class="d-flex gap-2 justify-content-center mb-5 flex-wrap">
        <button class="btn btn-outline-primary filter-btn active" data-filter="all">All Photos</button>
        <button class="btn btn-outline-primary filter-btn" data-filter="interior">Interior</button>
        <button class="btn btn-outline-primary filter-btn" data-filter="bedroom">Bedrooms</button>
        <button class="btn btn-outline-primary filter-btn" data-filter="exterior">Exterior</button>
        <button class="btn btn-outline-primary filter-btn" data-filter="amenities">Amenities</button>
      </div>
    `;
    
    const galleryGrid = this.galleryImages.map(img => `
      <div class="gallery-item" data-category="${img.category}">
        <div class="placeholder-image" style="background: linear-gradient(135deg, #2c5f8d, #1f4d6d); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
          <i class="bi bi-image"></i>
        </div>
        <div class="gallery-overlay">
          <div class="gallery-overlay-icon">
            <i class="bi bi-zoom-in"></i>
          </div>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Villa Gallery</h1>
          <p>Explore the beauty and elegance of Villa Paradise</p>
        </div>
      </section>

      <!-- Filters Section -->
      <section class="container my-5">
        ${filterButtons}
      </section>

      <!-- Gallery Section -->
      <section class="container mb-5">
        <div class="gallery-grid" id="gallery-grid">
          ${galleryGrid}
        </div>
      </section>

      <!-- Gallery Description -->
      <section class="bg-light py-5 mb-0">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 mb-4 mb-lg-0">
              <h2>Stunning Accommodations</h2>
              <p class="lead">Every corner of Villa Paradise is designed with elegance and comfort in mind. From spacious bedrooms to modern amenities, our villa offers everything you need for an unforgettable stay.</p>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>5 Luxurious Bedrooms</strong> - Each with premium bedding and views
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>4 Elegant Bathrooms</strong> - With spa-like amenities
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>State-of-the-art Kitchen</strong> - Fully equipped for gourmet dining
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Large Living Areas</strong> - Perfect for gatherings and relaxation
                </li>
              </ul>
            </div>
            <div class="col-lg-6">
              <h2>Exterior Paradise</h2>
              <p class="lead">Experience the natural beauty of our location with direct beach access and stunning ocean views.</p>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Private Beach Access</strong> - Exclusive shoreline
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Infinity Pool</strong> - With ocean views
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Tropical Gardens</strong> - Lush and beautifully landscaped
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Outdoor Dining</strong> - Sunset terraces and lounging areas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
    
    // Set up filter functionality after rendering
    setTimeout(() => {
      this.setupFilters();
    }, 0);
    
    return container;
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Filter gallery items
        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
            }, 10);
          } else {
            item.style.opacity = '0.3';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
    
    // Set up lightbox functionality
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const title = item.querySelector('.gallery-overlay').previousElementSibling?.alt || 'Villa Paradise';
        this.openLightbox(item);
      });
    });
  }

  openLightbox(item) {
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
      <div style="position: relative; max-width: 90vw; max-height: 90vh;">
        <button style="
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        " class="close-lightbox">
          <i class="bi bi-x"></i>
        </button>
        <div style="
          background: linear-gradient(135deg, #2c5f8d, #1f4d6d);
          width: 600px;
          height: 400px;
          max-width: 90vw;
          max-height: 80vh;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 4rem;
        ">
          <i class="bi bi-image"></i>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-lightbox').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
}
