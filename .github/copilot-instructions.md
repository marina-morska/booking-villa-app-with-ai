# Villa Booking Website

## Project Overview

This is a website to list and book an entire villa (no individual room bookings). Potential users can check availability, view photos, and make reservations for the whole property. The website includes a calendar to show available dates and a booking form to collect user information. Also it has a gallery with images of the villa and surroundings. It has sections with amenities and services,  reviews, and contact form with location. 

## Architecture and Tech stack

Classical client server app

- Frontend - JS app, Bootstrap, HTML, CSS. No TypeScript and UI frameworks like React, Vue, Angular, etc.
- Backend - Supabase(database, authentication and storage).
- Database - PostgreSQL (managed by Supabase).
- Authentication - Supabase Auth.
- Build tools - Node.js, Vite, npm.
- API - Supabase RESTful API.
- Hosting - Netlify.
- Source code - GitHub.


## Modular design
- Use a modular structure with separate files for different components, pages, and features. Use ES6 modules to organize the code.

## UI guidelines

- Use HTML, CSS, Bootstrap and vanilla JavaScript for the frontend development.
- Use Bootstrap components and utilities to create a responsive and user-friendly interface.
- Implement modern, responsible UI design with semantic HTML.
- Use consistent color schemes, typography throughout the website.
- Use appropriate icons, effects and visual cues to enhance the user experience.


## Pages and features

- Split the website into multiple pages: Home, Booking, Gallery, Amenities, Contact.
- Implement pages as reusable components (HTML, CSS, JS)to ensure consistency and maintainability.
- Use routing to navigate between pages.
- Use full URLs like /, /home, /booking, /gallery, /amenities, /reviews,/contact, etc.


## Backend and Database schema

- Use Supabase to manage the backend and database.
- Use PostgreSQL as the database with tables for users, bookings, availability, photos, amenities, etc.
- Use Supabase storage for uploading and storing photos and other media files.
- When changing the database schema, always use migrations to keep track of changes.
- After applying a migration to the database, keep a copy of the migration SQL file in the code.


## Authentication and Authorization

- Use Supabase Auth for user authentication and authorization.
- Implement RLS policies to restrict access to data based on user roles and permissions.
- Implement user roles with separate DB table `user_roles` + enum `roles` (e. g. admin, user)
- Implement admin and user roles with different permissions. Admins can manage bookings, availability, photos, amenities, etc., while regular users can only view and make bookings.
