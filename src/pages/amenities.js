export class Amenities {
  constructor() {
    this.amenities = [
      {
        icon: 'bi-wifi',
        title: 'High-Speed WiFi',
        description: 'Stay connected with our premium high-speed internet throughout the villa'
      },
      {
        icon: 'bi-thermometer-half',
        title: 'Air Conditioning',
        description: 'Climate control in every room with individual temperature settings'
      },
      {
        icon: 'bi-water',
        title: 'Private Pool',
        description: 'Stunning infinity pool with ocean views and heating system'
      },
      {
        icon: 'bi-telephone',
        title: '24/7 Support',
        description: 'Round-the-clock concierge service for all your needs'
      },
      {
        icon: 'bi-cup',
        title: 'Fully Equipped Kitchen',
        description: 'Modern appliances and cookware for preparing gourmet meals'
      },
      {
        icon: 'bi-tv',
        title: 'Entertainment System',
        description: 'Smart TV with streaming services and home theater setup'
      },
      {
        icon: 'bi-music-note-beamed',
        title: 'Sound System',
        description: 'Professional audio system throughout the villa'
      },
      {
        icon: 'bi-flower2',
        title: 'Spa & Wellness',
        description: 'Sauna, hot tub, and yoga deck for ultimate relaxation'
      },
      {
        icon: 'bi-sunset',
        title: 'Scenic Terrace',
        description: 'Multiple outdoor seating areas with stunning sunset views'
      },
      {
        icon: 'bi-car-front',
        title: 'Airport Transfers',
        description: 'Complimentary transportation service to/from airport'
      },
      {
        icon: 'bi-shield-check',
        title: 'Security',
        description: '24/7 security monitoring and surveillance system'
      },
      {
        icon: 'bi-handbag',
        title: 'Housekeeping',
        description: 'Daily housekeeping and laundry services included'
      }
    ];
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    
    const amenityCards = this.amenities.map(amenity => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="amenity-card">
          <div class="amenity-icon">
            <i class="bi ${amenity.icon}"></i>
          </div>
          <h5 class="amenity-title">${amenity.title}</h5>
          <p class="amenity-description">${amenity.description}</p>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Amenities & Services</h1>
          <p>Everything you need for a luxurious and comfortable stay</p>
        </div>
      </section>

      <!-- Amenities Grid -->
      <section class="container my-5">
        <div class="row">
          ${amenityCards}
        </div>
      </section>

      <!-- Detailed Amenities Section -->
      <section class="bg-light py-5">
        <div class="container">
          <h2 class="text-center mb-5">Premium Services</h2>
          <div class="row">
            <div class="col-lg-6 mb-5">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <h5 class="card-title mb-3">
                    <i class="bi bi-bookmark-heart text-success me-2"></i>
                    Recreation & Entertainment
                  </h5>
                  <ul class="list-unstyled">
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Beach volleyball court</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Game room with billiards</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Home theater with premium sound</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Board games and books library</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Outdoor projector for movie nights</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mb-5">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <h5 class="card-title mb-3">
                    <i class="bi bi-heart-pulse text-danger me-2"></i>
                    Health & Wellness
                  </h5>
                  <ul class="list-unstyled">
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Sauna & steam room</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Heated hot tub</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Yoga & meditation deck</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Fitness equipment</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Spa services available</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mb-5">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <h5 class="card-title mb-3">
                    <i class="bi bi-cup-hot text-warning me-2"></i>
                    Dining & Breakfast
                  </h5>
                  <ul class="list-unstyled">
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Daily breakfast buffet</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Private chef services</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Wine cellar with selection</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Outdoor dining setup</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Grocery service</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mb-5">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <h5 class="card-title mb-3">
                    <i class="bi bi-geo-alt text-primary me-2"></i>
                    Activities & Excursions
                  </h5>
                  <ul class="list-unstyled">
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Beach activities coordination</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Water sports equipment rental</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Local tour arrangements</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Boat rental services</li>
                    <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Restaurant reservations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Booking Section -->
      <section style="background: linear-gradient(135deg, #2c5f8d, #1f4d6d); color: white; padding: 4rem 2rem; text-align: center;">
        <div class="container">
          <h2>Ready to Experience Our Amenities?</h2>
          <p class="lead mb-4">Book your stay today and enjoy world-class facilities and services</p>
          <a href="/booking" class="btn btn-secondary btn-lg" data-link>
            <i class="bi bi-calendar-check"></i> Book Your Stay
          </a>
        </div>
      </section>
    `;
    
    return container;
  }
}
