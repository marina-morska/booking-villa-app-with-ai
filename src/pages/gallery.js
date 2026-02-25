import { getPublicGalleryPhotos } from '../services/adminService.js';

export class Gallery {
  constructor() {
    this.galleryImages = [];
    this.currentImageIndex = 0;
    this.keyboardListenerAttached = false;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero" style="background-color: #FFEDC7;">
        <div class="hero-content">
          <h1>Villa Gallery</h1>
          <p>Explore the beauty and elegance of Villa Blue Summer</p>
        </div>
      </section>

      <!-- Gallery Section -->
      <section style="background-color: #FFEDC7; padding: 2rem;">
        <div class="container">
          <div class="gallery-grid" id="gallery-grid">
          <div class="d-flex align-items-center justify-content-center py-5">
            <div class="spinner-border text-primary me-2" role="status" aria-hidden="true"></div>
            <span>Loading gallery...</span>
          </div>
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
        <div class="lightbox-counter"><span id="lightbox-current">1</span> / <span id="lightbox-total">0</span></div>
      </div>

      <!-- Gallery Description -->
      <section class="bg-light py-5 mb-0">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 mb-4 mb-lg-0">
              <h2>Stunning Accommodations</h2>
              <p class="lead">Every corner of Villa Blue Summer is designed with elegance and comfort in mind. From spacious bedrooms to modern amenities, our villa offers everything you need for an unforgettable stay.</p>
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
    
    // Set up page interactions after first render
    setTimeout(() => {
      this.setupFilters();
      this.loadGalleryContent();
    }, 0);
    
    return container;
  }

  setupFilters() {
    // Filters removed
  }

  setupLightboxCarousel() {
    this.setupLightboxNav();
  }

  async loadGalleryContent() {
    const galleryGridElement = document.getElementById('gallery-grid');
    const totalElement = document.getElementById('lightbox-total');

    if (!galleryGridElement) {
      return;
    }

    const { data: photos, error } = await getPublicGalleryPhotos();
    this.galleryImages = photos ?? [];

    const galleryContent = error
      ? '<div class="alert alert-warning mb-0">Gallery could not load from Supabase Storage. Please check your bucket and policies.</div>'
      : this.renderGalleryGrid();

    galleryGridElement.innerHTML = galleryContent;
    if (totalElement) {
      totalElement.textContent = String(this.galleryImages.length);
    }

    this.setupLightboxCarousel();
  }

  renderGalleryGrid() {
    if (!this.galleryImages.length) {
      return '<div class="alert alert-light border mb-0">No photos found in Supabase Storage bucket.</div>';
    }

    return this.galleryImages.map((img, index) => `
      <div class="gallery-item" data-src="${img.src}" data-full-src="${img.lightboxSrc || img.src}" data-title="${this.escapeHtml(img.title)}">
        <img
          src="${img.src}"
          alt="${this.escapeHtml(img.title)}"
          loading="lazy"
          decoding="async"
          fetchpriority="${index < 3 ? 'high' : 'low'}"
        />
        <div class="gallery-overlay">
          <div class="gallery-overlay-icon">
            <i class="bi bi-zoom-in"></i>
          </div>
        </div>
      </div>
    `).join('');
  }

  setupLightboxNav() {
    const lightbox = document.getElementById('lightbox');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryItems.length) {
      lightboxPrev.style.display = 'none';
      lightboxNext.style.display = 'none';
      return;
    }

    lightboxPrev.style.display = '';
    lightboxNext.style.display = '';
    
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
    if (!this.keyboardListenerAttached) {
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
      this.keyboardListenerAttached = true;
    }
  }

  openLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'flex';
    this.updateLightboxImage();
  }

  updateLightboxImage() {
    const image = this.galleryImages[this.currentImageIndex];
    if (!image) {
      return;
    }

    const lightboxImage = document.querySelector('.lightbox-image');
    const currentImageSpan = document.getElementById('lightbox-current');
    
    lightboxImage.src = image.lightboxSrc || image.src;
    lightboxImage.alt = image.title;
    currentImageSpan.textContent = this.currentImageIndex + 1;
  }

  escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
