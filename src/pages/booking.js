import { getAuthState } from '../services/authService.js';
import { createBookingRequest } from '../services/bookingService.js';

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
    container.className = 'page-enter booking-page';
    
    const html = `
      <!-- Header Section -->
      <section class="booking-header">
        <div class="booking-header-content">
          <h1>Book Your Stay</h1>
          <p>Select your dates and reserve your perfect getaway</p>
        </div>
      </section>

      <!-- Main Content -->
      <div class="booking-content">
        <div class="container booking-bar-wrapper">
          <form class="booking-bar" aria-label="Quick booking">
            <div class="booking-field">
              <label for="booking-guests">Guest(s) *</label>
              <select id="booking-guests" class="booking-input" aria-label="Guests">
                <option value="" selected>How Many</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
              </select>
            </div>

            <div class="booking-field">
              <label for="booking-checkin">Check in *</label>
              <input id="booking-checkin" class="booking-input" type="date" placeholder="Select Date">
            </div>

            <div class="booking-field">
              <label for="booking-checkout">Check out *</label>
              <input id="booking-checkout" class="booking-input" type="date" placeholder="Select Date">
            </div>

            <div class="booking-actions">
              <button class="booking-check-btn" type="button">Check Availability</button>
              <button class="booking-cta" type="button">Book Now</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // Set up the Book Now button event listener
    this.setupBookNowButton(container);
    
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

  setupBookNowButton(container) {
    const bookNowBtn = container.querySelector('.booking-cta');
    const checkAvailabilityBtn = container.querySelector('.booking-check-btn');
    const checkinInput = container.querySelector('#booking-checkin');
    const checkoutInput = container.querySelector('#booking-checkout');

    bookNowBtn.addEventListener('click', () => this.handleBookNowClick());
    checkAvailabilityBtn.addEventListener('click', () => this.handleCheckAvailabilityClick());
    checkinInput.addEventListener('change', () => this.updateBookNowButtonState());
    checkoutInput.addEventListener('change', () => this.updateBookNowButtonState());
    
    // Store container reference for modal creation
    this.pageContainer = container;
    this.updateBookNowButtonState();
  }

  setBookNowEnabled(isEnabled) {
    const bookNowBtn = document.querySelector('.booking-cta');
    if (!bookNowBtn) {
      return;
    }

    bookNowBtn.disabled = !isEnabled;
    bookNowBtn.setAttribute('aria-disabled', String(!isEnabled));
  }

  updateBookNowButtonState() {
    const dateRange = this.getDateRangeFromInputs();
    if (!dateRange) {
      this.setBookNowEnabled(false);
      return;
    }

    const isAvailable = this.checkAvailability(dateRange.checkinDate, dateRange.checkoutDate);
    this.setBookNowEnabled(isAvailable);
  }

  getDateRangeFromInputs() {
    const checkinInput = document.getElementById('booking-checkin');
    const checkoutInput = document.getElementById('booking-checkout');

    if (!checkinInput || !checkoutInput) {
      return null;
    }

    if (!checkinInput.value || !checkoutInput.value) {
      return null;
    }

    const checkinDate = new Date(checkinInput.value);
    const checkoutDate = new Date(checkoutInput.value);

    if (checkinDate >= checkoutDate) {
      return null;
    }

    return { checkinDate, checkoutDate };
  }

  async handleCheckAvailabilityClick() {
    const checkinInput = document.getElementById('booking-checkin');
    const checkoutInput = document.getElementById('booking-checkout');

    if (!checkinInput.value || !checkoutInput.value) {
      this.showModal('Please select check-in and check-out dates.', 'warning');
      return;
    }

    const dateRange = this.getDateRangeFromInputs();
    if (!dateRange) {
      this.setBookNowEnabled(false);
      this.showModal('Check-out date must be after check-in date.', 'warning');
      return;
    }

    const isAvailable = this.checkAvailability(dateRange.checkinDate, dateRange.checkoutDate);
    this.setBookNowEnabled(isAvailable);

    if (!isAvailable) {
      this.showModal('The villa is not available for the requested period. Please select other dates.', 'error');
      return;
    }

    const authState = await getAuthState();
    if (!authState.user) {
      this.showModal('The villa is available for this period, please login or register to continue your booking.', 'success');
      setTimeout(() => {
        window.history.pushState(null, '', '/login?next=/booking');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 900);
      return;
    }

    this.showModal('The villa is available for this period, you can book your stay', 'success');
  }

  handleBookNowClick() {
    const checkinInput = document.getElementById('booking-checkin');
    const checkoutInput = document.getElementById('booking-checkout');
    const guestsSelect = document.getElementById('booking-guests');

    // Validation
    if (!checkinInput.value || !checkoutInput.value || !guestsSelect.value) {
      this.showModal('Please fill in all fields.', 'warning');
      return;
    }

    const dateRange = this.getDateRangeFromInputs();
    if (!dateRange) {
      this.setBookNowEnabled(false);
      this.showModal('Check-out date must be after check-in date.', 'warning');
      return;
    }

    // Check availability
    const isAvailable = this.checkAvailability(dateRange.checkinDate, dateRange.checkoutDate);
    this.setBookNowEnabled(isAvailable);

    if (!isAvailable) {
      this.showModal('The villa is not available for the requested period. Please select other dates.', 'error');
      return;
    }

    this.submitBookingForAvailablePeriod(dateRange, guestsSelect.value);
  }

  async submitBookingForAvailablePeriod(dateRange, guests) {
    const authState = await getAuthState();

    if (!authState.user) {
      this.showModal('The villa is available for this period, please login or register to continue your booking.', 'success');
      setTimeout(() => {
        window.history.pushState(null, '', '/login?next=/booking');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 900);
      return;
    }

    const payload = {
      checkIn: dateRange.checkinDate.toISOString().slice(0, 10),
      checkOut: dateRange.checkoutDate.toISOString().slice(0, 10),
      guests: Number(guests)
    };

    const { error } = await createBookingRequest(payload);

    if (error) {
      this.showModal(`Booking could not be created: ${error.message}`, 'error');
      return;
    }

    this.showModal('Booking request submitted. Status: awaiting confirmation.', 'success');
  }

  checkAvailability(startDate, endDate) {
    // Check if any date in the range is booked
    for (let currentDate = new Date(startDate); currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      if (this.bookedDates.has(currentDate.toDateString())) {
        return false;
      }
    }
    return true;
  }

  showModal(message, type = 'info') {
    // Remove existing modal if present
    const existingModal = document.getElementById('booking-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'booking-modal';
    modal.className = `booking-modal booking-modal-${type}`;

    // Determine icon and title based on type
    let icon = '✓';
    let title = 'Success';
    
    if (type === 'error') {
      icon = '✕';
      title = 'Not Available';
    } else if (type === 'warning') {
      icon = '!';
      title = 'Please Note';
    } else if (type === 'success') {
      icon = '✓';
      title = 'Available!';
    }

    modal.innerHTML = `
      <div class="booking-modal-overlay"></div>
      <div class="booking-modal-content">
        <div class="booking-modal-icon booking-modal-icon-${type}">
          ${icon}
        </div>
        <h3 class="booking-modal-title">${title}</h3>
        <p class="booking-modal-message">${message}</p>
        <button class="booking-modal-btn" type="button">Close</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => modal.classList.add('active'), 10);

    // Close button handler
    const closeBtn = modal.querySelector('.booking-modal-btn');
    closeBtn.addEventListener('click', () => this.closeModal(modal));

    // Close on overlay click
    const overlay = modal.querySelector('.booking-modal-overlay');
    overlay.addEventListener('click', () => this.closeModal(modal));

    // Close on Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}
