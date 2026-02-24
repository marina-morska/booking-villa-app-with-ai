# Villa Paradise - Luxury Villa Booking Website

A modern, responsive multipage villa booking application built with vanilla JavaScript, Bootstrap 5, and Vite.

## 🏨 Features

### Pages
- **Home** (`/`) - Landing page with villa overview, features, and guest reviews
- **Booking** (`/booking`) - Interactive calendar with date-range selection, booking form, and validation
- **Gallery** (`/gallery`) - Photo gallery with filter functionality and lightbox viewer
- **Amenities** (`/amenities`) - Cards displaying amenities and services
- **Contacts** (`/contacts`) - Contact form, business information, location map, and FAQs

### Key Features
- ✅ **Interactive Calendar** - Visual availability calendar with date-range selection
- ✅ **Form Validation** - Client-side validation for booking and contact forms
- ✅ **Responsive Design** - Mobile-first approach, works on all devices
- ✅ **Semantic HTML** - Proper HTML5 semantic tags for accessibility
- ✅ **Modern UI** - Consistent color scheme, smooth animations, hover effects
- ✅ **Bootstrap 5** - Leveraging Bootstrap components and utilities
- ✅ **Review Bubbles** - Guest testimonials with ratings displayed as bubbles
- ✅ **Client-Side Routing** - SPA-like experience without server-side routing
- ✅ **Icon Set** - Bootstrap Icons integrated throughout
- ✅ **Supabase Auth + Roles** - Guest/User/Admin experience with role-aware UI and route guards
- ✅ **User Profile** - Logged users can see their bookings, reviews, and contact messages

## 🛠 Tech Stack

- **Frontend Framework**: Vanilla ES6 JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Build Tool**: Vite
- **HTML**: Semantic HTML5
- **CSS**: Custom CSS with CSS variables for theming

## 📦 Installation

### Prerequisites
- Node.js 14.0 or higher
- npm 6.0 or higher

### Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd booking-villa-app-with-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env` from `.env.example` and set:
   ```bash
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

4. **Configure Supabase Edge Function secrets (for admin reply emails)**
   In Supabase project settings, add:
   ```bash
   RESEND_API_KEY=...
   ADMIN_REPLY_FROM_EMAIL=Villa Paradise <noreply@your-domain.com>
   ```

   If you do not have a domain yet, you can still test with:
   ```bash
   ADMIN_REPLY_FROM_EMAIL=Villa Paradise <onboarding@resend.dev>
   ADMIN_REPLY_TEST_TO_EMAIL=your-verified-email@example.com
   ```
   `ADMIN_REPLY_TEST_TO_EMAIL` forces all reply emails to your test inbox.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will open automatically in your browser at `http://localhost:5173`

6. **Build for production**
   ```bash
   npm run build
   ```
   Build files will be generated in the `dist` folder.

7. **Preview the production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
booking-villa-app-with-ai/
├── index.html                 # Main HTML entry point
├── src/
│   ├── main.js               # Application entry point & routing
│   ├── styles.css            # Global styles and theme
│   ├── components/
│   │   └── layout.js         # Navbar and Footer components
│   └── pages/
│       ├── home.js           # Home page
│       ├── booking.js        # Booking page with calendar
│       ├── gallery.js        # Gallery page with filters
│       ├── amenities.js      # Amenities page
│       └── contacts.js       # Contact page
├── package.json              # Project dependencies
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## 🎨 Color Scheme

The app uses a professional color scheme defined in CSS variables:

- **Primary Color**: `#2c5f8d` (Deep Blue)
- **Secondary Color**: `#f39c12` (Warm Gold)
- **Accent Color**: `#27ae60` (Green)
- **Light Background**: `#f8f9fa`
- **Dark Text**: `#2c3e50`

These can be customized by modifying the `:root` variables in `src/styles.css`.

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: Below 768px

## 🗂️ Key Components

### Calendar Component
- Interactive month-by-month navigation
- Visual indicators for available, booked, and selected dates
- Date range selection with visual feedback
- Automatic calculation of number of nights

### Review Bubbles
- Guest avatars with initials
- Star ratings
- Guest name and date
- Review text in italic style

### Amenity Cards
- Icon-based display
- Title and description
- Hover effects with color transitions
- Organized grid layout

### Contact Form
- Subject dropdown selection
- Phone number (optional)
- Newsletter subscription checkbox
- Form validation and success messages

### Gallery
- Grid-based image display
- Category filter buttons
- Lightbox modal viewer
- Responsive image layout

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast compliance
- Form labels properly associated with inputs
- Screen reader considerations (sr-only class)

## 🔧 JavaScript Features

### Client-Side Routing
- Hash-based routing system
- Smooth page transitions
- Active navigation link highlighting
- Browser history management

### Form Validation
- Email format validation
- Phone number validation
- Required field checking
- User-friendly error messages

### Date Handling
- Month/year formatting
- Date range calculations
- Booked date tracking
- Past date disabling

## 🚀 Deployment

### Netlify Deployment
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

### Other Platforms
The built `dist` folder can be deployed to any static hosting service (Vercel, GitHub Pages, AWS S3, etc.)

## 📋 Future Enhancements

- Backend integration with Supabase
- User authentication system
- Real booking persistence
- Payment gateway integration
- Admin dashboard for managing bookings
- Email notifications
- Guest reviews submission
- Dark mode toggle
- Multi-language support
- Advanced search and filtering

## 📝 Notes

- The calendar displays mock booked dates for demonstration
- Form submissions are logged to console (not persisted)
- Gallery images use placeholder backgrounds
- Map is embedded from Google Maps (can be customized)
- Email and phone fields are validated client-side only

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available for personal and commercial use.

## 📞 Support

For questions or issues, please reach out through the contact form on the website.

---

**Built with ❤️ for luxury villa bookings**
