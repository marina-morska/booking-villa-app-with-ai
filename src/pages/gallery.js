export class Gallery {
  constructor() {
    this.galleryImages = [
      { id: 1, title: 'Villa 1', src: '../images/1_villa_1.jpg', category: 'exterior' },
      { id: 2, title: 'Villa 2', src: '../images/2_villa_2.jpg', category: 'exterior' },
      { id: 3, title: 'Villa 3', src: '../images/3_villa_3.jpg', category: 'exterior' },
      { id: 4, title: 'Villa 4', src: '../images/4_villa_4.jpg', category: 'exterior' },
      { id: 5, title: 'Villa 5', src: '../images/5_villa_5.jpg', category: 'exterior' },
      { id: 6, title: 'Exterior 5', src: '../images/6_exterior_5.jpg', category: 'exterior' },
      { id: 7, title: 'Exterior 6', src: '../images/7_exterior_6.jpg', category: 'exterior' },
      { id: 8, title: 'Exterior 1', src: '../images/8_exterior_1.jpg', category: 'exterior' },
      { id: 9, title: 'Exterior 2', src: '../images/9_exterior_2.jpg', category: 'exterior' },
      { id: 10, title: 'Exterior 7', src: '../images/10_exterior_7.jpg', category: 'exterior' },
      { id: 11, title: 'Exterior 3', src: '../images/11_exterior_3.jpg', category: 'exterior' },
      { id: 12, title: 'Room 1', src: '../images/12_room_1.jpg', category: 'bedroom' },
      { id: 13, title: 'Room 2', src: '../images/13_room_2.jpg', category: 'bedroom' },
      { id: 14, title: 'Room 3', src: '../images/14_room_3.jpg', category: 'bedroom' },
      { id: 15, title: 'Kitchen', src: '../images/15_kitchen.jpg', category: 'interior' },
      { id: 16, title: 'Living Room 1', src: '../images/16_living_room_1.jpg', category: 'interior' },
      { id: 17, title: 'Living Room 2', src: '../images/17_living_room_2.jpg', category: 'interior' },
      { id: 18, title: 'Staircase', src: '../images/18_staircase.jpg', category: 'interior' },
      { id: 19, title: 'Bathroom 1', src: '../images/19_bathroom_1.jpg', category: 'interior' },
      { id: 20, title: 'Bathroom 2', src: '../images/20_bathroom_2.jpg', category: 'interior' },
      { id: 21, title: 'Bathroom 3', src: '../images/21_bathroom_3.jpg', category: 'interior' },
      { id: 22, title: 'Pool 1', src: '../images/22_pool_1.jpg', category: 'amenities' },
      { id: 23, title: 'Pool 3', src: '../images/23_pool_3.jpg', category: 'amenities' },
      { id: 24, title: 'Pool 4', src: '../images/24_pool_4.jpg', category: 'amenities' },
      { id: 25, title: 'Pool 5', src: '../images/25_pool_5.jpg', category: 'amenities' },
      { id: 26, title: 'Pool 6', src: '../images/26_pool_6.jpg', category: 'amenities' },
      { id: 27, title: 'Pool 7', src: '../images/27_pool_7.jpg', category: 'amenities' },
      { id: 28, title: 'Pool 8', src: '../images/28_pool_8.jpg', category: 'amenities' },
      { id: 29, title: 'Pool Bar 1', src: '../images/29_pool_bar_1.jpg', category: 'amenities' },
      { id: 30, title: 'Pool Bar 2', src: '../images/30_pool_bar_2.jpg', category: 'amenities' },
      { id: 31, title: 'Pool Bar 4', src: '../images/31_pool_bar_4.jpg', category: 'amenities' },
      { id: 32, title: 'Terrace', src: '../images/32_terrace.jpg', category: 'exterior' }
    ];
    this.currentImageIndex = 0;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';

    const galleryGrid = this.galleryImages.map(img => `
      <div class="gallery-item" data-category="${img.category}" data-src="${img.src}" data-title="${img.title}">
        <img src="${img.src}" alt="${img.title}" />
        <div class="gallery-overlay">
          <div class="gallery-overlay-icon">
            <i class="bi bi-zoom-in"></i>
          </div>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero" style="background-color: #FFEDC7;">
        <div class="hero-content">
          <h1>Villa Gallery</h1>
          <p>Explore the beauty and elegance of Villa Paradise</p>
        </div>
      </section>

      <!-- Gallery Section -->
      <section style="background-color: #FFEDC7; padding: 2rem;">
        <div class="container">
          <div class="gallery-grid" id="gallery-grid">
          ${galleryGrid}
        </div>
        </div>
      </section>

      <!-- Lightbox Modal -->
      <div id="lightbox" class="lightbox">
        <button class="lightbox-nav lightbox-prev" id="lightbox-prev">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-image" src="" alt="" />
        <button class="lightbox-nav lightbox-next" id="lightbox-next">
          <i class="bi bi-chevron-right"></i>
        </button>
        <div class="lightbox-counter">
          <span id="lightbox-current">1</span> / <span id="lightbox-total">${this.galleryImages.length}</span>
        </div>
      </div>

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
                  <strong>3 Luxurious Bedrooms</strong> - Each with premium bedding and views
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>4 Elegant Bathrooms</strong> 
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
              <p class="lead">Experience the natural beauty of our location.</p>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Luxurious Swimming Pool</strong> - Large, heated swimming pool with jacuzzi.
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Pool bar</strong> - Casual poolside bar offering free beer and coffee for your stay.
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Children’s play area</strong> - Safe space with toys and equipment suitable for toddlers and young kids, children's pool.
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Outdoor Dining</strong> - BBQ area and dining area.
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <strong>Parking, Wi-Fi</strong> - Convenient parking and high-speed internet access.
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
      this.setupLightboxCarousel();
    }, 0);
    
    return container;
  }

  setupFilters() {
    // Filters removed
  }

  setupLightboxCarousel() {
    this.setupLightboxNav();
  }

  setupLightboxNav() {
    const lightbox = document.getElementById('lightbox');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Open lightbox when clicking gallery items
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.currentImageIndex = index;
        this.openLightbox();
      });
    });
    
    lightboxPrev.addEventListener('click', () => {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
      this.updateLightboxImage();
    });
    
    lightboxNext.addEventListener('click', () => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
      this.updateLightboxImage();
    });
    
    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
          this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
          this.updateLightboxImage();
        } else if (e.key === 'ArrowRight') {
          this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
          this.updateLightboxImage();
        } else if (e.key === 'Escape') {
          lightbox.style.display = 'none';
        }
      }
    });
  }

  openLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'flex';
    this.updateLightboxImage();
  }

  updateLightboxImage() {
    const image = this.galleryImages[this.currentImageIndex];
    const lightboxImage = document.querySelector('.lightbox-image');
    const currentImageSpan = document.getElementById('lightbox-current');
    
    lightboxImage.src = image.src;
    lightboxImage.alt = image.title;
    currentImageSpan.textContent = this.currentImageIndex + 1;
  }
}
