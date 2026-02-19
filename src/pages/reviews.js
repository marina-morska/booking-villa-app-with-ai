export class Reviews {
  constructor() {
    this.reviews = [
      {
        initials: 'JD',
        name: 'John Doe',
        date: '2 weeks ago',
        rating: 5,
        text: 'Absolutely incredible! The villa exceeded all expectations. The beach access was pristine, and the service was impeccable. We\'ll definitely be back!'
      },
      {
        initials: 'SM',
        name: 'Sarah Miller',
        date: '1 month ago',
        rating: 5,
        text: 'Perfect place for a family getaway. Kids loved the beach, and the accommodation was comfortable and well-maintained. Highly recommended!'
      },
      {
        initials: 'MP',
        name: 'Michael Parker',
        date: '6 weeks ago',
        rating: 5,
        text: 'Outstanding experience! The amenities are top-notch, and the location is unbeatable. The team took great care of us. Worth every penny!'
      },
      {
        initials: 'EC',
        name: 'Emily Chen',
        date: '2 months ago',
        rating: 5,
        text: 'Amazing villa with breathtaking views. The attention to detail is impressive. Every aspect of our stay was perfect. Highly recommend!'
      },
      {
        initials: 'DB',
        name: 'David Brown',
        date: '3 months ago',
        rating: 5,
        text: 'Luxury at its finest! The villa offers everything you could want for a dream vacation. The staff was attentive and professional. Absolutely worth it!'
      },
      {
        initials: 'LW',
        name: 'Lisa Wilson',
        date: '3 months ago',
        rating: 5,
        text: 'We had an unforgettable experience here. The sunset views from the terrace are stunning. Everything was clean and well-organized. 10/10!'
      },
      {
        initials: 'JT',
        name: 'James Taylor',
        date: '4 months ago',
        rating: 5,
        text: 'Best vacation we\'ve had in years! The villa is stunning, and the location is perfect. We can\'t wait to come back next year!'
      },
      {
        initials: 'RA',
        name: 'Rachel Anderson',
        date: '4 months ago',
        rating: 5,
        text: 'Incredible property with exceptional service. The amenities are world-class. Worth every penny. Highly recommend for special occasions!'
      }
    ];
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    
    const reviewsBubbles = this.reviews.map(review => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="review-bubble">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">${review.initials}</div>
              <div>
                <div class="reviewer-name">${review.name}</div>
                <div class="reviewer-date">${review.date}</div>
              </div>
            </div>
            <div class="reviewer-rating">
              ${Array(review.rating).fill('<i class="bi bi-star-fill"></i>').join('')}
            </div>
          </div>
          <p class="review-text">"${review.text}"</p>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Guest Reviews</h1>
          <p>What our guests are saying about Villa Paradise</p>
        </div>
      </section>

      <!-- Reviews Grid -->
      <section class="container my-5">
        <h2 class="text-center mb-5">5-Star Experiences</h2>
        <div class="row">
          ${reviewsBubbles}
        </div>
      </section>

      <!-- Rating Summary -->
      <section class="bg-light py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6 mb-4 mb-lg-0">
              <h2>Why Guests Love Us</h2>
              <p class="lead">Villa Paradise consistently receives 5-star ratings from our guests. Here's what makes us special:</p>
              <ul class="list-unstyled">
                <li class="mb-3">
                  <i class="bi bi-check-circle text-success me-2 fs-5"></i>
                  <strong>Stunning Location:</strong> Pristine beachfront with breathtaking ocean views
                </li>
                <li class="mb-3">
                  <i class="bi bi-check-circle text-success me-2 fs-5"></i>
                  <strong>Luxury Amenities:</strong> World-class facilities and modern comforts
                </li>
                <li class="mb-3">
                  <i class="bi bi-check-circle text-success me-2 fs-5"></i>
                  <strong>Exceptional Service:</strong> Professional and attentive staff available 24/7
                </li>
                <li class="mb-3">
                  <i class="bi bi-check-circle text-success me-2 fs-5"></i>
                  <strong>Pristine Cleanliness:</strong> Immaculate accommodations and facilities
                </li>
                <li class="mb-3">
                  <i class="bi bi-check-circle text-success me-2 fs-5"></i>
                  <strong>Memorable Experiences:</strong> Perfect for families, couples, and groups
                </li>
              </ul>
            </div>
            <div class="col-lg-6">
              <div class="card border-0 shadow-lg p-4" style="background: linear-gradient(135deg, #2c5f8d, #1f4d6d); color: white;">
                <div class="text-center">
                  <div style="font-size: 4rem; margin-bottom: 1rem;">⭐</div>
                  <h3 class="mb-3">4.9 / 5.0</h3>
                  <p class="mb-2">Based on ${this.reviews.length} verified guest reviews</p>
                  <div class="mb-3">
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                  </div>
                  <p style="font-size: 0.95rem; opacity: 0.9;">Guests consistently praise our exceptional service, stunning location, and luxury amenities. We strive to exceed expectations on every visit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Booking CTA -->
      <section style="background: linear-gradient(135deg, #2c5f8d, #1f4d6d); color: white; padding: 4rem 2rem; text-align: center;">
        <div class="container">
          <h2>Ready to Experience Villa Paradise?</h2>
          <p class="lead mb-4">Join thousands of satisfied guests. Book your stay today!</p>
          <a href="/booking" class="btn btn-secondary btn-lg" data-link>
            <i class="bi bi-calendar-check"></i> Book Now
          </a>
        </div>
      </section>
    `;
    
    return container;
  }
}
