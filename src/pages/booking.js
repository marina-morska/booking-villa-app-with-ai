export class Booking {
  constructor() {
    this.currentMonth = new Date();
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.bookedDates = this.generateBookedDates();
  }

  generateBookedDates() {
    // Simulate some booked dates
    const booked = new Set();
    const today = new Date();
    // Add some booked dates for demonstration
    for (let i = 5; i < 12; i++) {
      booked.add(new Date(today.getFullYear(), today.getMonth(), i).toDateString());
    }
    return booked;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    
    const html = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Book Your Stay</h1>
          <p>Select your dates and reserve your perfect getaway</p>
        </div>
      </section>

      <!-- Main Content -->
      <div class="container my-5">
        <div class="row">
          <!-- Calendar Section -->
          <div class="col-lg-6 mb-5">
            <div id="calendar" class="calendar"></div>
          </div>

          <!-- Booking Form Section -->
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h3 class="mb-0">Booking Details</h3>
              </div>
              <div class="card-body">
                <form id="booking-form">
                  <!-- Selected Dates -->
                  <div class="form-group">
                    <label class="form-label">Check-in Date</label>
                    <input type="text" id="checkin-date" class="form-control" readonly placeholder="Select start date">
                  </div>

                  <div class="form-group">
                    <label class="form-label">Check-out Date</label>
                    <input type="text" id="checkout-date" class="form-control" readonly placeholder="Select end date">
                  </div>

                  <div class="form-group">
                    <label class="form-label">Number of Nights</label>
                    <input type="text" id="nights-count" class="form-control" readonly placeholder="0">
                  </div>

                  <!-- Divider -->
                  <hr>

                  <!-- Guest Information -->
                  <h5 class="mb-3">Guest Information</h5>

                  <div class="form-group">
                    <label class="form-label" for="guest-name">Full Name *</label>
                    <input type="text" id="guest-name" class="form-control" placeholder="Enter your full name" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="guest-email">Email Address *</label>
                    <input type="email" id="guest-email" class="form-control" placeholder="Enter your email" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="guest-phone">Phone Number *</label>
                    <input type="tel" id="guest-phone" class="form-control" placeholder="Enter your phone number" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="guest-notes">Special Requests</label>
                    <textarea id="guest-notes" class="form-control" rows="4" placeholder="Any special requests or requirements?"></textarea>
                  </div>

                  <!-- Price Summary -->
                  <hr>
                  <div class="mb-3">
                    <div class="d-flex justify-content-between mb-2">
                      <span>Price per night:</span>
                      <span><strong>$250</strong></span>
                    </div>
                    <div class="d-flex justify-content-between mb-3">
                      <span>Total Price:</span>
                      <span id="total-price"><strong>$0</strong></span>
                    </div>
                  </div>

                  <!-- Alerts -->
                  <div id="form-alerts"></div>

                  <!-- Submit Button -->
                  <button type="submit" class="btn btn-primary w-100 btn-lg">
                    <i class="bi bi-check-circle"></i> Complete Booking
                  </button>

                  <p class="text-muted mt-3 mb-0 text-center small">
                    Your booking is secure and confidential
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // Initialize calendar after rendering
    setTimeout(() => {
      this.initializeCalendar();
      this.setupFormHandlers();
    }, 0);
    
    return container;
  }

  initializeCalendar() {
    const calendarDiv = document.getElementById('calendar');
    
    // Create calendar header with navigation
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
      <h3 id="calendar-title">${this.formatMonthYear(this.currentMonth)}</h3>
      <div class="calendar-nav">
        <button type="button" id="prev-month" title="Previous month">← Prev</button>
        <button type="button" id="next-month" title="Next month">Next →</button>
      </div>
    `;
    calendarDiv.appendChild(header);
    
    // Create calendar grid
    const grid = document.createElement('div');
    grid.id = 'calendar-grid';
    grid.className = 'calendar-grid';
    calendarDiv.appendChild(grid);
    
    // Add navigation event listeners
    document.getElementById('prev-month').addEventListener('click', () => {
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
      this.renderCalendarGrid();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
      this.renderCalendarGrid();
    });
    
    // Initial render
    this.renderCalendarGrid();
  }

  renderCalendarGrid() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    
    // Update title
    document.getElementById('calendar-title').textContent = this.formatMonthYear(this.currentMonth);
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
      const header = document.createElement('div');
      header.className = 'calendar-day-header';
      header.textContent = day;
      grid.appendChild(header);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();
    const daysInPrevMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0).getDate();
    
    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = document.createElement('div');
      day.className = 'calendar-day other-month';
      day.textContent = daysInPrevMonth - i;
      grid.appendChild(day);
    }
    
    // Current month's days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i);
      const dateString = currentDate.toDateString();
      
      const day = document.createElement('div');
      day.className = 'calendar-day';
      day.textContent = i;
      day.dataset.date = dateString;
      
      // Check if date is in the past
      if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        day.classList.add('disabled');
      } else if (this.bookedDates.has(dateString)) {
        day.classList.add('booked');
      } else {
        day.classList.add('available');
        day.addEventListener('click', () => this.selectDate(currentDate));
      }
      
      // Highlight selected dates
      if (this.selectedStartDate && dateString === this.selectedStartDate.toDateString()) {
        day.classList.add('selected');
      } else if (this.selectedEndDate && dateString === this.selectedEndDate.toDateString()) {
        day.classList.add('selected');
      } else if (this.selectedStartDate && this.selectedEndDate) {
        const start = this.selectedStartDate.getTime();
        const end = this.selectedEndDate.getTime();
        const current = currentDate.getTime();
        if (current > start && current < end) {
          day.classList.add('in-range');
        }
      }
      
      grid.appendChild(day);
    }
    
    // Next month's days
    const totalCells = grid.children.length - 7; // Subtract header row
    const remainingCells = 35 - totalCells; // 5 rows of 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day other-month';
      day.textContent = i;
      grid.appendChild(day);
    }
  }

  selectDate(date) {
    const dateString = date.toDateString();
    
    if (!this.selectedStartDate) {
      this.selectedStartDate = date;
    } else if (!this.selectedEndDate) {
      if (date < this.selectedStartDate) {
        this.selectedEndDate = this.selectedStartDate;
        this.selectedStartDate = date;
      } else {
        this.selectedEndDate = date;
      }
    } else {
      // Reset selection
      this.selectedStartDate = date;
      this.selectedEndDate = null;
    }
    
    this.updateBookingInfo();
    this.renderCalendarGrid();
  }

  updateBookingInfo() {
    const checkinInput = document.getElementById('checkin-date');
    const checkoutInput = document.getElementById('checkout-date');
    const nightsInput = document.getElementById('nights-count');
    const priceInput = document.getElementById('total-price');
    
    if (this.selectedStartDate) {
      checkinInput.value = this.formatDate(this.selectedStartDate);
    } else {
      checkinInput.value = '';
    }
    
    if (this.selectedEndDate) {
      checkoutInput.value = this.formatDate(this.selectedEndDate);
      
      const nights = Math.floor((this.selectedEndDate - this.selectedStartDate) / (1000 * 60 * 60 * 24));
      nightsInput.value = nights;
      
      const totalPrice = nights * 250;
      priceInput.innerHTML = `<strong>$${totalPrice}</strong>`;
    } else {
      checkoutInput.value = '';
      nightsInput.value = '';
      priceInput.innerHTML = '<strong>$0</strong>';
    }
  }

  setupFormHandlers() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validation
      const errors = [];
      
      if (!this.selectedStartDate || !this.selectedEndDate) {
        errors.push('Please select check-in and check-out dates');
      }
      
      const name = document.getElementById('guest-name').value;
      if (!name.trim()) {
        errors.push('Please enter your full name');
      }
      
      const email = document.getElementById('guest-email').value;
      if (!email.trim() || !this.isValidEmail(email)) {
        errors.push('Please enter a valid email address');
      }
      
      const phone = document.getElementById('guest-phone').value;
      if (!phone.trim() || !this.isValidPhone(phone)) {
        errors.push('Please enter a valid phone number');
      }
      
      // Display errors or success
      const alertsDiv = document.getElementById('form-alerts');
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
          <strong>Booking Submitted!</strong>
          <p class="mb-0 mt-2">Thank you for your booking request. We'll confirm your reservation shortly.</p>
        `;
        alertsDiv.appendChild(successAlert);
        
        // Log booking details
        console.log('Booking Details:', {
          checkin: this.formatDate(this.selectedStartDate),
          checkout: this.formatDate(this.selectedEndDate),
          name: name,
          email: email,
          phone: phone,
          notes: document.getElementById('guest-notes').value
        });
      }
    });
  }

  formatMonthYear(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  isValidPhone(phone) {
    const re = /^\d{10,}$/;
    return re.test(phone.replace(/\D/g, ''));
  }
}
