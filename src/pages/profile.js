import { getAuthState } from '../services/authService.js';
import { getMyBookings, getMyMessages, getMyReviews } from '../services/profileService.js';

export class Profile {
  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';

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
      getMyBookings(),
      getMyReviews(),
      getMyMessages()
    ]);

    container.innerHTML = `
      <section class="hero">
        <div class="hero-content">
          <h1>My Profile</h1>
          <p>${auth.user.email}</p>
        </div>
      </section>

      <section class="container my-5">
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
      </section>
    `;

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
        <div><strong>${message.subject}</strong></div>
        <div class="small text-muted">${message.admin_reply ? 'Answered' : 'Awaiting reply'}</div>
      </div>
    `).join('');
  }
}
