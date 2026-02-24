import { getAuthState } from '../services/authService.js';
import { createReview, deleteReview, getPublicReviews, updateReview } from '../services/reviewService.js';

export class Reviews {
  constructor() {
    this.editingReviewId = null;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';

    const auth = await getAuthState();
    const reviews = await getPublicReviews();

    container.innerHTML = `
      <section class="hero">
        <div class="hero-content">
          <h1>Guest Reviews</h1>
          <p>Real feedback from guests</p>
        </div>
      </section>

      <section class="container my-5">
        ${auth.user ? this.getReviewFormHTML() : '<div class="alert alert-info">Login to write and manage your reviews.</div>'}
      </section>

      <section class="container my-4">
        <div id="review-alerts"></div>
        <div class="row">
          ${this.renderReviewCards(reviews, auth)}
        </div>
      </section>
    `;

    if (auth.user) {
      setTimeout(() => this.setupHandlers(auth), 0);
    }

    return container;
  }

  getReviewFormHTML() {
    return `
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h4 class="mb-3">Write a Review</h4>
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
    `;
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

      const name = review.profiles?.display_name || 'Guest';
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

  setupHandlers(auth) {
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

      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    cancelBtn.addEventListener('click', () => {
      this.editingReviewId = null;
      form.reset();
      cancelBtn.classList.add('d-none');
      document.getElementById('review-submit-btn').textContent = 'Submit Review';
    });

    document.querySelectorAll('[data-review-action="edit"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const reviewId = button.getAttribute('data-review-id');
        const reviews = await getPublicReviews();
        const review = reviews.find((item) => item.id === reviewId && item.user_id === auth.user.id);

        if (!review) {
          return;
        }

        this.editingReviewId = review.id;
        document.getElementById('review-title').value = review.title;
        document.getElementById('review-content').value = review.content;
        document.getElementById('review-rating').value = String(review.rating);
        cancelBtn.classList.remove('d-none');
        document.getElementById('review-submit-btn').textContent = 'Update Review';
      });
    });

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
