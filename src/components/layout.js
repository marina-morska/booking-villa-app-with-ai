export function renderNavbar() {
  const navbar = document.getElementById('navbar');
  
  const navHTML = `
    <div class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/" data-link>
          <i class="bi bi-house-fill"></i>
          Villa Paradise
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link active" href="/" data-link>
                <i class="bi bi-house"></i> Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/booking" data-link>
                <i class="bi bi-calendar"></i> Booking
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/gallery" data-link>
                <i class="bi bi-images"></i> Gallery
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/amenities" data-link>
                <i class="bi bi-star"></i> Amenities
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/reviews" data-link>
                <i class="bi bi-chat-dots"></i> Reviews
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/contacts" data-link>
                <i class="bi bi-envelope"></i> Contacts
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  navbar.innerHTML = navHTML;
}

export function renderFooter() {
  const footer = document.getElementById('footer');
  const currentYear = new Date().getFullYear();
  
  const footerHTML = `
    <div class="footer-content">
      <div class="footer-section">
        <h5><i class="bi bi-house-fill"></i> Villa Paradise</h5>
        <p>Experience luxury and comfort at our exclusive villa retreat. Perfect for families and groups looking for an unforgettable vacation.</p>
      </div>
      <div class="footer-section">
        <h5>Quick Links</h5>
        <ul>
          <li><a href="/" data-link>Home</a></li>
          <li><a href="/booking" data-link>Make a Booking</a></li>
          <li><a href="/gallery" data-link>View Gallery</a></li>
          <li><a href="/amenities" data-link>Amenities</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h5>Contact Info</h5>
        <ul>
          <li><i class="bi bi-telephone"></i> +1 (555) 123-4567</li>
          <li><i class="bi bi-envelope"></i> info@villaparadise.com</li>
          <li><i class="bi bi-geo-alt"></i> Paradise Beach, Tropical Island</li>
        </ul>
      </div>
      <div class="footer-section">
        <h5>Follow Us</h5>
        <div style="font-size: 1.5rem; display: flex; gap: 1rem;">
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
    </div>
    <div class="footer-bottom">
      <p>&copy; ${currentYear} Villa Paradise. All rights reserved. | Privacy Policy | Terms of Service</p>
    </div>
  `;
  
  footer.innerHTML = footerHTML;
}
