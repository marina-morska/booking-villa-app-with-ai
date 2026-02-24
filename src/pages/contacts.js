import { createContactMessage } from '../services/contactService.js';

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
      <section class="hero" style="background-color: #FFEDC7;">
        <div class="hero-content">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for any inquiries or assistance</p>
        </div>
      </section>

      <!-- Contact Section -->
      <section style="background-color: #FFEDC7; padding: 3rem 0;">
        <div class="container">
          <div class="row">
          <!-- Contact Form -->
          <div class="col-lg-8 mx-auto">
            <div class="card border-0 shadow-sm">
              <div class="card-header">
                <h3 class="mb-0" style="color: white;">Send us a Message</h3>
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
      </section>

      <!-- Map Section -->
      <section style="background-color: #FFEDC7; padding: 3rem 0;">
        <div class="container">
          <h2 class="text-center mb-4">Our Location</h2>
          <div class="contact-map" id="map-container">
            <iframe 
              width="100%" 
              height="400" 
              style="border: none; border-radius: 12px;"
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2952.1380219975476!2d27.734583999999998!3d42.275577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDLCsDE2JzMyLjEiTiAyN8KwNDQnMDQuNSJF!5e0!3m2!1sen!2sbg!4v1771769612015!5m2!1sen!2sbg"
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
            <div class="col-lg-8 mx-auto">
              <div class="accordion" id="faqAccordion">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="faqHeading1">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse1" aria-expanded="true" aria-controls="faqCollapse1">
                      <i class="bi bi-question-circle text-primary me-2"></i>
                      What is your cancellation policy?
                    </button>
                  </h2>
                  <div id="faqCollapse1" class="accordion-collapse collapse show" aria-labelledby="faqHeading1" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                      We offer free cancellation up to 7 days before your check-in date. Cancellations within 7 days may incur a fee.
                    </div>
                  </div>
                </div>

                <div class="accordion-item">
                  <h2 class="accordion-header" id="faqHeading2">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse2" aria-expanded="false" aria-controls="faqCollapse2">
                      <i class="bi bi-question-circle text-primary me-2"></i>
                      Do you offer airport transfers?
                    </button>
                  </h2>
                  <div id="faqCollapse2" class="accordion-collapse collapse" aria-labelledby="faqHeading2" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                      Yes! We provide complimentary airport transfer services for all guests. Contact us with your flight details.
                    </div>
                  </div>
                </div>

                <div class="accordion-item">
                  <h2 class="accordion-header" id="faqHeading3">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse3" aria-expanded="false" aria-controls="faqCollapse3">
                      <i class="bi bi-question-circle text-primary me-2"></i>
                      Are pets allowed?
                    </button>
                  </h2>
                  <div id="faqCollapse3" class="accordion-collapse collapse" aria-labelledby="faqHeading3" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                      Pets are welcome! Please notify us in advance and a small pet fee may apply.
                    </div>
                  </div>
                </div>

                <div class="accordion-item">
                  <h2 class="accordion-header" id="faqHeading4">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse4" aria-expanded="false" aria-controls="faqCollapse4">
                      <i class="bi bi-question-circle text-primary me-2"></i>
                      What payment methods do you accept?
                    </button>
                  </h2>
                  <div id="faqCollapse4" class="accordion-collapse collapse" aria-labelledby="faqHeading4" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                      We accept all major credit cards, PayPal, and bank transfers. Flexible payment plans available.
                    </div>
                  </div>
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
    
    form.addEventListener('submit', async (e) => {
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
        const { error } = await createContactMessage({
          fullName: name,
          email,
          phone: document.getElementById('contact-phone').value,
          subject,
          message
        });

        if (error) {
          const errorAlert = document.createElement('div');
          errorAlert.className = 'alert alert-danger mb-3';
          errorAlert.innerHTML = `
            <strong>Message Not Sent</strong>
            <p class="mb-0 mt-2">${error.message}</p>
          `;
          alertsDiv.appendChild(errorAlert);
          return;
        }

        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success mb-3';
        successAlert.innerHTML = `
          <strong>Message Sent Successfully!</strong>
          <p class="mb-0 mt-2">Thank you for contacting us. We will get back to you as soon as possible.</p>
        `;
        alertsDiv.appendChild(successAlert);

        form.reset();
      }
    });
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
