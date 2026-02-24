import {
  deleteBooking,
  deletePhoto,
  getAllBookings,
  getAllMessages,
  getAllPhotos,
  replyToMessage,
  updateBookingStatus,
  uploadPhoto
} from '../services/adminService.js';

export class Admin {
  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';

    const [bookingsResult, messagesResult, photosResult] = await Promise.all([
      getAllBookings(),
      getAllMessages(),
      getAllPhotos()
    ]);

    const bookings = bookingsResult.data ?? [];
    const messages = messagesResult.data ?? [];
    const photos = photosResult.data ?? [];

    container.innerHTML = `
      <section class="hero">
        <div class="hero-content">
          <h1>Admin</h1>
          <p>Manage bookings, messages and gallery media</p>
        </div>
      </section>

      <section class="container my-4">
        <div id="admin-alerts"></div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <h4 class="mb-3">Bookings</h4>
            ${this.renderBookings(bookings)}
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <h4 class="mb-3">Messages</h4>
            ${this.renderMessages(messages)}
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <h4 class="mb-3">Gallery Photos</h4>
            <form id="photo-upload-form" class="row g-2 align-items-end mb-3">
              <div class="col-md-4">
                <label class="form-label" for="photo-title">Title</label>
                <input id="photo-title" class="form-control" type="text" placeholder="Optional title">
              </div>
              <div class="col-md-5">
                <label class="form-label" for="photo-file">File</label>
                <input id="photo-file" class="form-control" type="file" accept="image/*" required>
              </div>
              <div class="col-md-3">
                <button class="btn btn-primary w-100" type="submit">Upload Photo</button>
              </div>
            </form>
            ${this.renderPhotos(photos)}
          </div>
        </div>
      </section>
    `;

    setTimeout(() => this.setupHandlers(), 0);
    return container;
  }

  renderBookings(bookings) {
    if (!bookings.length) {
      return '<p class="text-muted mb-0">No bookings found.</p>';
    }

    return `
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>User</th>
              <th>Dates</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map((booking) => `
              <tr>
                <td><small>${booking.user_id}</small></td>
                <td>${booking.check_in} → ${booking.check_out}</td>
                <td>${booking.guests}</td>
                <td><span class="badge text-bg-secondary">${booking.status}</span></td>
                <td>
                  <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-outline-success" data-admin-action="confirm-booking" data-id="${booking.id}">Confirm</button>
                    <button class="btn btn-sm btn-outline-danger" data-admin-action="delete-booking" data-id="${booking.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderMessages(messages) {
    if (!messages.length) {
      return '<p class="text-muted mb-0">No messages found.</p>';
    }

    return messages.map((message) => `
      <div class="border rounded p-3 mb-3">
        <div class="d-flex justify-content-between gap-3 mb-2">
          <div>
            <strong>${message.full_name}</strong> · ${message.email}
            <div class="small text-muted">${message.subject}</div>
          </div>
          <div class="small text-muted">${new Date(message.created_at).toLocaleString()}</div>
        </div>
        <p class="mb-2">${message.message}</p>
        <div class="mb-2"><strong>Reply:</strong> ${message.admin_reply || '<span class="text-muted">No reply yet</span>'}</div>
        <div class="d-flex gap-2">
          <input class="form-control" type="text" placeholder="Write reply..." data-reply-input="${message.id}">
          <button class="btn btn-outline-primary" data-admin-action="reply-message" data-id="${message.id}">Send</button>
        </div>
      </div>
    `).join('');
  }

  renderPhotos(photos) {
    if (!photos.length) {
      return '<p class="text-muted mb-0">No uploaded photos.</p>';
    }

    return `
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Path</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${photos.map((photo) => `
              <tr>
                <td>${photo.title || '-'}</td>
                <td><small>${photo.storage_path}</small></td>
                <td>
                  <button class="btn btn-sm btn-outline-danger" data-admin-action="delete-photo" data-id="${photo.id}" data-path="${photo.storage_path}">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  setupHandlers() {
    const alerts = document.getElementById('admin-alerts');
    const uploadForm = document.getElementById('photo-upload-form');

    uploadForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      alerts.innerHTML = '';

      const title = document.getElementById('photo-title').value.trim();
      const fileInput = document.getElementById('photo-file');
      const file = fileInput.files?.[0];

      if (!file) {
        this.showAlert('Please select an image file.', 'danger');
        return;
      }

      const { error } = await uploadPhoto(file, title);
      if (error) {
        this.showAlert(`Upload failed: ${error.message}`, 'danger');
        return;
      }

      this.showAlert('Photo uploaded successfully.', 'success');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    document.querySelectorAll('[data-admin-action="confirm-booking"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const bookingId = button.getAttribute('data-id');
        const { error } = await updateBookingStatus(bookingId, 'confirmed');
        if (error) {
          this.showAlert(`Could not confirm booking: ${error.message}`, 'danger');
          return;
        }

        this.showAlert('Booking confirmed.', 'success');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    });

    document.querySelectorAll('[data-admin-action="delete-booking"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const bookingId = button.getAttribute('data-id');
        const { error } = await deleteBooking(bookingId);
        if (error) {
          this.showAlert(`Could not delete booking: ${error.message}`, 'danger');
          return;
        }

        this.showAlert('Booking deleted.', 'success');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    });

    document.querySelectorAll('[data-admin-action="reply-message"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const messageId = button.getAttribute('data-id');
        const input = document.querySelector(`[data-reply-input="${messageId}"]`);
        const replyText = input?.value.trim();

        if (!replyText) {
          this.showAlert('Reply text is required.', 'danger');
          return;
        }

        const { error } = await replyToMessage(messageId, replyText);
        if (error) {
          this.showAlert(`Could not send reply: ${error.message}`, 'danger');
          return;
        }

        this.showAlert('Reply sent.', 'success');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    });

    document.querySelectorAll('[data-admin-action="delete-photo"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const photoId = button.getAttribute('data-id');
        const storagePath = button.getAttribute('data-path');

        const { error } = await deletePhoto(photoId, storagePath);
        if (error) {
          this.showAlert(`Could not delete photo: ${error.message}`, 'danger');
          return;
        }

        this.showAlert('Photo deleted.', 'success');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    });
  }

  showAlert(message, type = 'success') {
    const alerts = document.getElementById('admin-alerts');
    if (!alerts) {
      return;
    }

    alerts.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }
}
