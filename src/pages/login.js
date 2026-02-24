import { signIn, signUp } from '../services/authService.js';

export class Login {
  constructor(defaultTab = null) {
    this.defaultTab = defaultTab;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter';
    container.style.backgroundColor = '#FFEDC7';

    const activeTab = this.getActiveTab();

    container.innerHTML = `
      <section class="hero" style="background-color: #FFEDC7;">
        <div class="hero-content">
          <h1>Account</h1>
          <p>Login or create an account to continue</p>
        </div>
      </section>

      <section class="container my-5" style="max-width: 560px;">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <ul class="nav nav-tabs mb-4" id="auth-tabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link ${activeTab === 'login' ? 'active' : ''}" id="login-tab" type="button" data-auth-tab="login">Login</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link ${activeTab === 'register' ? 'active' : ''}" id="register-tab" type="button" data-auth-tab="register">Register</button>
              </li>
            </ul>

            <form id="auth-form">
              <div class="mb-3">
                <label for="auth-email" class="form-label">Email</label>
                <input id="auth-email" type="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="auth-password" class="form-label">Password</label>
                <input id="auth-password" type="password" class="form-control" minlength="6" required>
              </div>
              <div id="auth-alerts" class="mb-3"></div>
              <button type="submit" class="btn btn-primary w-100" id="auth-submit-btn">${activeTab === 'register' ? 'Create account' : 'Login'}</button>
            </form>
            <p class="mb-0 mt-3 text-center" id="auth-switch-hint">
              ${activeTab === 'register'
      ? 'Already have an account? <a href="/login" data-link>Login</a>'
      : 'No account yet? <a href="/register" data-link>Create one</a>'}
            </p>
          </div>
        </div>
      </section>
    `;

    setTimeout(() => this.setupHandlers(activeTab), 0);
    return container;
  }

  getActiveTab() {
    if (this.defaultTab) {
      return this.defaultTab;
    }

    return window.location.pathname === '/register' ? 'register' : 'login';
  }

  setupHandlers(initialTab) {
    const form = document.getElementById('auth-form');
    const alerts = document.getElementById('auth-alerts');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchHint = document.getElementById('auth-switch-hint');
    let currentTab = initialTab;

    const updateTabUI = () => {
      document.querySelectorAll('[data-auth-tab]').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-auth-tab') === currentTab);
      });

      submitBtn.textContent = currentTab === 'register' ? 'Create account' : 'Login';
      switchHint.innerHTML = currentTab === 'register'
        ? 'Already have an account? <a href="/login" data-link>Login</a>'
        : 'No account yet? <a href="/register" data-link>Create one</a>';

      const targetPath = currentTab === 'register' ? '/register' : '/login';
      if (window.location.pathname !== targetPath) {
        const search = window.location.search || '';
        window.history.replaceState(null, '', `${targetPath}${search}`);
      }
    };

    document.querySelectorAll('[data-auth-tab]').forEach((tabButton) => {
      tabButton.addEventListener('click', () => {
        currentTab = tabButton.getAttribute('data-auth-tab');
        alerts.innerHTML = '';
        updateTabUI();
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      alerts.innerHTML = '';

      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;

      if (currentTab === 'register') {
        const { error } = await signUp(email, password);

        if (error) {
          alerts.innerHTML = `<div class="alert alert-danger mb-0">${error.message}</div>`;
          return;
        }

        alerts.innerHTML = '<div class="alert alert-success mb-0">Account created. Please check your email confirmation (if enabled), then login.</div>';
        currentTab = 'login';
        updateTabUI();
        return;
      }

      const { error } = await signIn(email, password);

      if (error) {
        alerts.innerHTML = `<div class="alert alert-danger mb-0">${error.message}</div>`;
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const next = params.get('next') || '/profile';
      window.history.pushState(null, '', next);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    updateTabUI();
  }
}
