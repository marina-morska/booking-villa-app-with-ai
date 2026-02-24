import { getAuthState } from '../services/authService.js';
import { deleteReview, getPublicReviews, updateReview } from '../services/reviewService.js';

export class Reviews {
  constructor() {
    this.editingReviewId = null;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    container.style.backgroundColor = '#FFEDC7';

    const auth = await getAuthState();
    const reviews = await getPublicReviews();

    container.innerHTML = `
      <section class="hero" style="background-color: #FFEDC7;">
        <div class="hero-content">
          <h1>Guest Reviews</h1>
          <p>Real feedback from guests</p>
        </div>
      </section>

      ${auth.user ? `
        <div id="edit-review-section" style="display: none; background-color: #FFEDC7;">
          <section class="container my-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h4 class="mb-3">Edit Review</h4>
                <div id="review-alerts"></div>
                <form id="edit-review-form">
                  <div class="mb-3">
                    <label for="edit-review-title" class="form-label">Title</label>
                    <input id="edit-review-title" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label for="edit-review-rating" class="form-label">Rating</label>
                    <select id="edit-review-rating" class="form-select" required>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="edit-review-content" class="form-label">Review</label>
                    <textarea id="edit-review-content" class="form-control" rows="4" required></textarea>
                  </div>
                  <button class="btn btn-primary" type="submit" id="edit-review-submit-btn">Update Review</button>
                  <button class="btn btn-outline-secondary ms-2" type="button" id="edit-review-cancel-btn">Cancel</button>
                </form>
              </div>
            </div>
          </section>
        </div>
      ` : ''}

      <section class="container-fluid my-0" style="background-color: #FFEDC7; padding: 2rem;">
        <div class="container">
          <div class="row">
            ${this.renderReviewCards(reviews, auth)}
          </div>
        </div>
      </section>
    `;

    if (auth.user) {
      setTimeout(() => this.setupHandlers(auth, reviews), 0);
    }

    return container;
  }

  renderReviewCards(reviews, auth) {
    if (!reviews.length) {
      return '<div class="col-12"><div class="alert alert-light border">No reviews yet.</div></div>';
    }

    return reviews.map((review) => {
      const ownerActions = auth.user && auth.user.id === review.user_id
        ? `
          <div class="mt-3 d-flex gap-2">
            <button type="button" class="btn btn-sm btn-outline-primary" data-review-action="edit" data-review-id="${review.id}">Edit</button>
            <button type="button" class="btn btn-sm btn-outline-danger" data-review-action="delete" data-review-id="${review.id}">Delete</button>
          </div>
        `
        : '';

      const name = review.display_name || 'User';
      return `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="review-bubble h-100">
            <div class="review-header d-flex justify-content-between align-items-start">
              <div>
                <div class="reviewer-name">${name}</div>
                <div class="reviewer-date">${new Date(review.created_at).toLocaleDateString()}</div>
              </div>
              <div class="reviewer-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <h6 class="mt-3">${review.title}</h6>
            <p class="review-text">${review.content}</p>
            ${ownerActions}
          </div>
        </div>
      `;
    }).join('');
  }

  setupHandlers(auth, reviews) {
    const alerts = document.getElementById('review-alerts');
    const form = document.getElementById('edit-review-form');
    const section = document.getElementById('edit-review-section');
    const cancelBtn = document.getElementById('edit-review-cancel-btn');

    // Edit button handlers
    document.querySelectorAll('[data-review-action="edit"]').forEach((button) => {
      button.addEventListener('click', () => {
        const reviewId = button.getAttribute('data-review-id');
        const review = reviews.find((item) => item.id === reviewId && item.user_id === auth.user.id);

        if (!review) {
          return;
        }

        this.editingReviewId = review.id;
        document.getElementById('edit-review-title').value = review.title;
        document.getElementById('edit-review-content').value = review.content;
        document.getElementById('edit-review-rating').value = String(review.rating);
        document.getElementById('edit-review-submit-btn').textContent = 'Update Review';
        section.style.display = 'block';
        alerts.innerHTML = '';

        // Scroll to form
        section.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Cancel edit
    cancelBtn.addEventListener('click', () => {
      this.editingReviewId = null;
      form.reset();
      section.style.display = 'none';
      alerts.innerHTML = '';
    });

    // Form submission
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      alerts.innerHTML = '';

      if (!this.editingReviewId) {
        return;
      }

      const payload = {
        title: document.getElementById('edit-review-title').value.trim(),
        content: document.getElementById('edit-review-content').value.trim(),
        rating: Number(document.getElementById('edit-review-rating').value)
      };

      const { error } = await updateReview(this.editingReviewId, payload);
      if (error) {
        alerts.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        return;
      }

      section.style.display = 'none';
      this.editingReviewId = null;
      form.reset();
      alerts.innerHTML = '<div class="alert alert-success">Review updated successfully!</div>';

      // Reload reviews
      setTimeout(() => {
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 1500);
    });

    // Delete button handlers
    document.querySelectorAll('[data-review-action="delete"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const reviewId = button.getAttribute('data-review-id');
        const { error } = await deleteReview(reviewId);
        if (error) {
          alerts.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
          return;
        }

        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    });
  }
}
