# Digital Art Submission Portal – Project Overview & Workflow

## Project Summary
This is a full-stack web application for digital art submission, curation, and public display. It is designed for two main user roles: **Artists** (who submit artworks) and **Curators** (who review and approve/reject submissions). The platform features a modern, responsive UI, secure authentication, email-based OTP registration, image uploads, and a public gallery.

---

## Technology Stack
- **Frontend:** Angular (standalone components, modern routing, responsive design)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token), OTP-based email verification
- **Image Hosting:** Cloudinary
- **Logging:** Winston
- **Testing:** (Optional, extensible)

---

## Key Features & Workflow

### 1. User Registration & Login
- **Registration:**
  - User enters email, requests OTP (One-Time Password) sent via email.
  - User verifies OTP. Only after successful OTP verification can the user complete registration (with name, password, role, and optional bio).
- **Login:**
  - User logs in with email and password (JWT issued on success).
  - All protected routes require a valid JWT.

### 2. Role-Based Access
- **Artist:**
  - Can submit new artworks (with image, title, description, tags).
  - Can view their own submissions and see status/feedback.
- **Curator:**
  - Can view all pending artworks for review.
  - Can approve/reject submissions and provide feedback.
  - Can view their review history.

### 3. Artwork Submission & Review
- **Artwork Submission:**
  - Artists upload images (stored on Cloudinary), add title, description, and tags.
  - Tags are created dynamically if new.
  - Submission triggers an email notification to the artist.
- **Curator Review:**
  - Curators see a list of pending artworks.
  - Can approve (artwork becomes public) or reject (with feedback, sent via email to artist).

### 4. Public Gallery
- **Accessible to all (even unauthenticated users).**
- Displays all approved artworks in a modern, responsive card layout.
- Each card shows the artwork, title, tags, artist name, and a modal for details.
- (Optional) Like/comment features can be added.

### 5. Profile Page
- **Artists:** See account info and all their submissions with status and feedback.
- **Curators:** See account info and their review history.

### 6. Notifications & Email
- OTPs and review results are sent via email.
- Email utility is modular for easy extension.

### 7. Security & Logging
- All sensitive endpoints are protected by JWT.
- Role-based middleware restricts access.
- Winston logger records key events and errors.

---

## Project Structure
- **backend/**: Express app, models, controllers, services, routes, utils (Cloudinary, email, OTP), logging, and error handling.
- **frontend/**: Angular app with standalone components for each page, modern routing, and global styles.
- **Database:** PostgreSQL schema for users, artworks, tags, feedback, and OTPs.

---

## Typical User Flow
1. **Register** (with OTP email verification)
2. **Login** (JWT issued)
3. **Artist:** Submit artwork → Wait for review → Get notified of approval/rejection
4. **Curator:** Review pending artworks → Approve/Reject with feedback
5. **Public:** Browse gallery, view artwork details
6. **Profile:** View account info, submissions, and review history

---

## How to Run
1. **Backend:**
   - Configure environment variables for DB, JWT, Cloudinary, and email.
   - Run migrations/init.sql to set up the database.
   - Start the server (`npm start` in backend).
2. **Frontend:**
   - Set API URL in `environment.ts`.
   - Run `npm start` in frontend.
3. **Access:**
   - Visit `/public-gallery` for the public view.
   - Register/login to access artist/curator features.

---

## Extensibility
- Add more user roles, artwork features, or notification types easily.
- Add more robust tests for backend and frontend.
- Enhance gallery with likes, comments, or advanced search.

---

## Credits
- Designed and developed as a modern, secure, and user-friendly digital art platform for artists and curators.

---

For any questions or contributions, please refer to the codebase or contact the project maintainer.
