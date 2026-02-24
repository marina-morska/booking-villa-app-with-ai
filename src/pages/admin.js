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
    const messagesWaitingReply = messages.filter((message) => !message.admin_reply);

    const loadErrors = [bookingsResult.error, messagesResult.error, photosResult.error].filter(Boolean);

    const pendingBookings = bookings.filter((booking) => {
      const normalizedStatus = String(booking.status || '').toLowerCase();
      return normalizedStatus === 'awaiting_confirmation' || normalizedStatus === 'pending';
    }).length;
    const unreadMessages = messagesWaitingReply.length;
    const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed').length;

    container.innerHTML = `
      <section class="hero" style="background-color: #FFEDC7;">
        <div class="hero-content">
          <h1>Admin Panel</h1>
          <p>Manage bookings, guest messages and gallery media from one place</p>
        </div>
      </section>

      <section style="background-color: #FFEDC7; padding: 2rem 0 3rem;">
        <div class="container" id="admin-panel">
        <div id="admin-alerts"></div>

        ${loadErrors.length ? `
          <div class="alert alert-warning mb-4">
            Some data could not be loaded completely. ${this.escapeHtml(loadErrors[0].message || 'Please refresh and try again.')}
          </div>
        ` : ''}

        <div class="row g-3 mb-4">
          <div class="col-md-6 col-xl-3">
            <div class="card border-0 shadow-sm admin-stat-card h-100">
              <div class="card-body">
                <div class="small text-muted mb-1">Total Bookings</div>
                <div class="h3 mb-0">${bookings.length}</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="card border-0 shadow-sm admin-stat-card h-100">
              <div class="card-body">
                <div class="small text-muted mb-1">Pending Bookings</div>
                <div class="h3 mb-0">${pendingBookings}</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="card border-0 shadow-sm admin-stat-card h-100">
              <div class="card-body">
                <div class="small text-muted mb-1">Confirmed Bookings</div>
                <div class="h3 mb-0">${confirmedBookings}</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="card border-0 shadow-sm admin-stat-card h-100">
              <div class="card-body">
                <div class="small text-muted mb-1">Messages Waiting Reply</div>
                <div class="h3 mb-0">${unreadMessages}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <h4 class="mb-3">Bookings</h4>
            ${this.renderBookings(bookings)}
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <h4 class="mb-3">Messages</h4>
            ${this.renderMessages(messagesWaitingReply)}
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
        <table class="table table-sm align-middle admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Dates</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map((booking) => `
              <tr>
                <td><small>${this.escapeHtml(this.formatUser(booking.user_id))}</small></td>
                <td>${this.formatDate(booking.check_in)} → ${this.formatDate(booking.check_out)}</td>
                <td>${booking.guests}</td>
                <td><span class="badge ${this.statusBadgeClass(booking.status)}">${this.escapeHtml(this.formatBookingStatus(booking.status))}</span></td>
                <td>
                  <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-outline-secondary" data-admin-action="set-booking-status" data-id="${booking.id}" data-status="awaiting_confirmation">Pending</button>
                    <button class="btn btn-sm btn-outline-success" data-admin-action="set-booking-status" data-id="${booking.id}" data-status="confirmed">Confirm</button>
                    <button class="btn btn-sm btn-outline-primary" data-admin-action="set-booking-status" data-id="${booking.id}" data-status="rejected">Reject</button>
                    <button class="btn btn-sm btn-outline-warning" data-admin-action="set-booking-status" data-id="${booking.id}" data-status="cancelled">Cancel</button>
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
      return '<p class="text-muted mb-0">No messages waiting reply.</p>';
    }

    return messages.map((message) => `
      <div class="border rounded p-3 mb-3">
        <div class="d-flex justify-content-between gap-3 mb-2">
          <div>
            <strong>${this.escapeHtml(message.full_name || 'Guest')}</strong> · ${this.escapeHtml(message.email || '-')}
            <div class="small text-muted">${this.escapeHtml(message.subject || 'General')}</div>
          </div>
          <div class="small text-muted">${this.formatDateTime(message.created_at)}</div>
        </div>
        <p class="mb-2">${this.escapeHtml(message.message || '')}</p>
        <div class="mb-2"><strong>Reply:</strong> ${message.admin_reply ? this.escapeHtml(message.admin_reply) : '<span class="text-muted">No reply yet</span>'}</div>
        <div class="d-flex gap-2">
          <input class="form-control" type="text" placeholder="Write reply..." data-reply-input="${message.id}" value="${this.escapeHtml(message.admin_reply || '')}">
          <button class="btn btn-outline-primary" data-admin-action="reply-message" data-id="${message.id}" data-email="${this.escapeHtml(message.email || '')}" data-full-name="${this.escapeHtml(message.full_name || 'Guest')}" data-subject="${this.escapeHtml(message.subject || 'General')}">Send</button>
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
        <table class="table table-sm align-middle admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Path</th>
              <th>Uploaded</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${photos.map((photo) => `
              <tr>
                <td>${this.escapeHtml(photo.title || '-')}</td>
                <td><small>${this.escapeHtml(photo.storage_path || '-')}</small></td>
                <td><small>${this.formatDateTime(photo.created_at)}</small></td>
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
    const adminPanel = document.getElementById('admin-panel');
    const uploadForm = document.getElementById('photo-upload-form');

    uploadForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (alerts) {
        alerts.innerHTML = '';
      }

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
      this.reloadPage();
    });

    adminPanel?.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-admin-action]');
      if (!button) {
        return;
      }

      const action = button.getAttribute('data-admin-action');
      const id = button.getAttribute('data-id');

      if (action === 'set-booking-status') {
        const status = button.getAttribute('data-status');
        const { error } = await updateBookingStatus(id, status);
        if (error) {
          this.showAlert(`Could not update booking status: ${error.message}`, 'danger');
          return;
        }

        this.showAlert(`Booking marked as ${status}.`, 'success');
        this.reloadPage();
        return;
      }

      if (action === 'delete-booking') {
        const confirmed = window.confirm('Delete this booking permanently?');
        if (!confirmed) {
          return;
        }

        const { error } = await deleteBooking(id);
        if (error) {
          this.showAlert(`Could not delete booking: ${error.message}`, 'danger');
          return;
        }

        this.showAlert('Booking deleted.', 'success');
        this.reloadPage();
        return;
      }

      if (action === 'reply-message') {
        const input = adminPanel.querySelector(`[data-reply-input="${id}"]`);
        const replyText = input?.value.trim();

        if (!replyText) {
          this.showAlert('Reply text is required.', 'danger');
          return;
        }

        const recipient = {
          email: button.getAttribute('data-email') || '',
          fullName: button.getAttribute('data-full-name') || 'Guest',
          subject: button.getAttribute('data-subject') || 'General'
        };

        const { error, emailError } = await replyToMessage(id, replyText, recipient);
        if (error) {
          this.showAlert(`Could not send reply: ${error.message}`, 'danger');
          return;
        }

        if (emailError) {
          this.showAlert(`Reply saved, but email notification failed: ${emailError.message}`, 'warning');
          this.reloadPage();
          return;
        }

        this.showAlert('Reply saved.', 'success');
        this.reloadPage();
        return;
      }

      if (action === 'delete-photo') {
        const storagePath = button.getAttribute('data-path');
        const confirmed = window.confirm('Delete this photo from gallery and storage?');
        if (!confirmed) {
          return;
        }

        const { error } = await deletePhoto(id, storagePath);
        if (error) {
          this.showAlert(`Could not delete photo: ${error.message}`, 'danger');
          return;
        }

        this.showAlert('Photo deleted.', 'success');
        this.reloadPage();
      }
    });
  }

  showAlert(message, type = 'success') {
    const alerts = document.getElementById('admin-alerts');
    if (!alerts) {
      return;
    }

    alerts.innerHTML = `<div class="alert alert-${type} mb-4">${message}</div>`;
  }

  reloadPage() {
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  statusBadgeClass(status = 'awaiting_confirmation') {
    const normalized = String(status).toLowerCase();
    if (normalized === 'confirmed') {
      return 'text-bg-success';
    }

    if (normalized === 'rejected') {
      return 'text-bg-primary';
    }

    if (normalized === 'cancelled') {
      return 'text-bg-danger';
    }

    return 'text-bg-warning';
  }

  formatBookingStatus(status = 'awaiting_confirmation') {
    const normalized = String(status).toLowerCase();
    if (normalized === 'awaiting_confirmation' || normalized === 'pending') {
      return 'Pending';
    }

    if (normalized === 'confirmed') {
      return 'Confirmed';
    }

    if (normalized === 'rejected') {
      return 'Rejected';
    }

    if (normalized === 'cancelled') {
      return 'Cancelled';
    }

    return normalized;
  }

  formatUser(userId = '') {
    if (!userId) {
      return 'Unknown user';
    }

    if (userId.length <= 12) {
      return userId;
    }

    return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
  }

  formatDate(value) {
    if (!value) {
      return '-';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString();
  }

  formatDateTime(value) {
    if (!value) {
      return '-';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleString();
  }

  escapeHtml(value) {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
