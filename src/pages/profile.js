import { getAuthState } from '../services/authService.js';
import { getMyBookings, getMyMessages, getMyReviews } from '../services/profileService.js';
import { createReview, updateReview } from '../services/reviewService.js';

export class Profile {
  constructor() {
    this.editingReviewId = null;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    container.style.backgroundColor = '#FFEDC7';

    const auth = await getAuthState();
    if (!auth.user) {
      container.innerHTML = `
        <section class="container my-5">
          <div class="alert alert-warning">Please <a href="/login" data-link>login</a> to view your profile.</div>
        </section>
      `;
      return container;
    }

    const [bookings, reviews, messages] = await Promise.all([
      getMyBookings(auth.user.id),
      getMyReviews(auth.user.id),
      getMyMessages(auth.user.id)
    ]);

    container.innerHTML = `
      <section class="hero" style="background-color: #FFEDC7;">
        <div class="hero-content">
          <h1>My Profile</h1>
          <p>${auth.user.email}</p>
        </div>
      </section>

      <section class="container-fluid my-0" style="background-color: #FFEDC7; padding: 2rem 0;">
        <div class="container">
          <div class="row g-4">
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <h4>My Bookings</h4>
                ${this.renderBookings(bookings)}
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <h4>My Reviews</h4>
                ${this.renderReviews(reviews)}
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <h4>My Messages</h4>
                ${this.renderMessages(messages)}
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section class="container-fluid my-0" style="background-color: #FFEDC7; padding: 2rem 0;">
        <div class="container">
          <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h4 class="mb-3">Write a Review</h4>
            <div id="review-alerts"></div>
            <form id="review-form">
              <div class="mb-3">
                <label for="review-title" class="form-label">Title</label>
                <input id="review-title" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="review-rating" class="form-label">Rating</label>
                <select id="review-rating" class="form-select" required>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="review-content" class="form-label">Review</label>
                <textarea id="review-content" class="form-control" rows="4" required></textarea>
              </div>
              <button class="btn btn-primary" type="submit" id="review-submit-btn">Submit Review</button>
              <button class="btn btn-outline-secondary ms-2 d-none" type="button" id="review-cancel-btn">Cancel Edit</button>
            </form>
          </div>
        </div>
      </section>
    `;

    setTimeout(() => this.setupHandlers(), 0);

    return container;
  }

  renderBookings(bookings) {
    if (!bookings.length) {
      return '<p class="text-muted mb-0">No bookings yet.</p>';
    }

    return bookings.slice(0, 5).map((booking) => `
      <div class="border rounded p-2 mb-2">
        <div><strong>${booking.status}</strong></div>
        <div class="small">${booking.check_in} → ${booking.check_out}</div>
      </div>
    `).join('');
  }

  renderReviews(reviews) {
    if (!reviews.length) {
      return '<p class="text-muted mb-0">No reviews yet.</p>';
    }

    return reviews.slice(0, 5).map((review) => `
      <div class="border rounded p-2 mb-2">
        <div>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
        <div class="small">${review.title ?? ''}</div>
      </div>
    `).join('');
  }

  renderMessages(messages) {
    if (!messages.length) {
      return '<p class="text-muted mb-0">No messages yet.</p>';
    }

    return messages.slice(0, 5).map((message) => `
      <div class="border rounded p-2 mb-2">
        <div><strong>I asked:</strong> ${message.message}</div>
        <div class="small mt-1"><strong>Admin reply:</strong> ${message.admin_reply ? message.admin_reply : '<span class="text-muted">No reply yet.</span>'}</div>
      </div>
    `).join('');
  }

  setupHandlers() {
    const form = document.getElementById('review-form');
    const alerts = document.getElementById('review-alerts');
    const cancelBtn = document.getElementById('review-cancel-btn');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      alerts.innerHTML = '';

      const payload = {
        title: document.getElementById('review-title').value.trim(),
        content: document.getElementById('review-content').value.trim(),
        rating: Number(document.getElementById('review-rating').value)
      };

      if (this.editingReviewId) {
        const { error } = await updateReview(this.editingReviewId, payload);
        if (error) {
          alerts.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
          return;
        }
        this.editingReviewId = null;
      } else {
        const { error } = await createReview(payload);
        if (error) {
          alerts.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
          return;
        }
      }

      form.reset();
      cancelBtn.classList.add('d-none');
      document.getElementById('review-submit-btn').textContent = 'Submit Review';
      alerts.innerHTML = '<div class="alert alert-success">Review submitted successfully!</div>';
      
      // Reload profile after successful review
      setTimeout(() => {
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 1500);
    });

    cancelBtn.addEventListener('click', () => {
      this.editingReviewId = null;
      form.reset();
      cancelBtn.classList.add('d-none');
      document.getElementById('review-submit-btn').textContent = 'Submit Review';
      alerts.innerHTML = '';
    });
  }
}
