export class Contacts {
  constructor() {
    this.contactInfo = {
      phone: '+1 (555) 123-4567',
      email: 'info@villaparadise.com',
      address: 'Paradise Beach, Tropical Island',
      hours: {
        weekday: '9:00 AM - 8:00 PM',
        weekend: '9:00 AM - 9:00 PM'
      }
    };
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for any inquiries or assistance</p>
        </div>
      </section>

      <!-- Contact Section -->
      <div class="container my-5">
        <div class="row">
          <!-- Contact Form -->
          <div class="col-lg-8 mx-auto">
            <div class="card border-0 shadow-sm">
              <div class="card-header">
                <h3 class="mb-0">Send us a Message</h3>
              </div>
              <div class="card-body">
                <form id="contact-form">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label" for="contact-name">Full Name *</label>
                        <input type="text" id="contact-name" class="form-control" placeholder="Your name" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label" for="contact-email">Email Address *</label>
                        <input type="email" id="contact-email" class="form-control" placeholder="Your email" required>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="contact-phone">Phone Number</label>
                    <input type="tel" id="contact-phone" class="form-control" placeholder="Your phone number (optional)">
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="contact-subject">Subject *</label>
                    <select id="contact-subject" class="form-select" required>
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="amenities">Amenities Question</option>
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="contact-message">Message *</label>
                    <textarea id="contact-message" class="form-control" rows="6" placeholder="Tell us your message..." required></textarea>
                  </div>

                  <div class="form-group">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="contact-newsletter">
                      <label class="form-check-label" for="contact-newsletter">
                        Subscribe to our newsletter for updates and special offers
                      </label>
                    </div>
                  </div>

                  <!-- Alerts -->
                  <div id="contact-alerts"></div>

                  <button type="submit" class="btn btn-primary btn-lg w-100">
                    <i class="bi bi-send"></i> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <section class="my-5">
        <div class="container">
          <h2 class="text-center mb-4">Our Location</h2>
          <div class="contact-map" id="map-container">
            <iframe 
              width="100%" 
              height="400" 
              style="border: none; border-radius: 12px;"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1098141961806!2d-74.00601492345055!3d40.71282314254718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3855555%3A0xb89d1fe6bc499443!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123"
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="bg-light py-5">
        <div class="container">
          <h2 class="text-center mb-5">Frequently Asked Questions</h2>
          <div class="row">
            <div class="col-lg-6 mb-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="bi bi-question-circle text-primary me-2"></i>
                    What is your cancellation policy?
                  </h5>
                  <p class="card-text">We offer free cancellation up to 7 days before your check-in date. Cancellations within 7 days may incur a fee.</p>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mb-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="bi bi-question-circle text-primary me-2"></i>
                    Do you offer airport transfers?
                  </h5>
                  <p class="card-text">Yes! We provide complimentary airport transfer services for all guests. Contact us with your flight details.</p>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mb-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="bi bi-question-circle text-primary me-2"></i>
                    Are pets allowed?
                  </h5>
                  <p class="card-text">Pets are welcome! Please notify us in advance and a small pet fee may apply.</p>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mb-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="bi bi-question-circle text-primary me-2"></i>
                    What payment methods do you accept?
                  </h5>
                  <p class="card-text">We accept all major credit cards, PayPal, and bank transfers. Flexible payment plans available.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    
    // Set up form handler after rendering
    setTimeout(() => {
      this.setupFormHandlers();
    }, 0);
    
    return container;
  }

  setupFormHandlers() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validation
      const errors = [];
      
      const name = document.getElementById('contact-name').value;
      if (!name.trim()) {
        errors.push('Please enter your full name');
      }
      
      const email = document.getElementById('contact-email').value;
      if (!email.trim() || !this.isValidEmail(email)) {
        errors.push('Please enter a valid email address');
      }
      
      const subject = document.getElementById('contact-subject').value;
      if (!subject) {
        errors.push('Please select a subject');
      }
      
      const message = document.getElementById('contact-message').value;
      if (!message.trim()) {
        errors.push('Please enter your message');
      }
      
      // Display errors or success
      const alertsDiv = document.getElementById('contact-alerts');
      alertsDiv.innerHTML = '';
      
      if (errors.length > 0) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger mb-3';
        alert.innerHTML = '<strong>Please correct the following errors:</strong><ul class="mb-0 mt-2">' +
          errors.map(error => `<li>${error}</li>`).join('') +
          '</ul>';
        alertsDiv.appendChild(alert);
      } else {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success mb-3';
        successAlert.innerHTML = `
          <strong>Message Sent Successfully!</strong>
          <p class="mb-0 mt-2">Thank you for contacting us. We will get back to you as soon as possible.</p>
        `;
        alertsDiv.appendChild(successAlert);
        
        // Reset form
        form.reset();
        
        // Log message details
        console.log('Contact Message:', {
          name: name,
          email: email,
          phone: document.getElementById('contact-phone').value,
          subject: subject,
          message: message,
          newsletter: document.getElementById('contact-newsletter').checked
        });
      }
    });
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
