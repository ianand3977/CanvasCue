# Digital Art Submission Portal

A modern, role-driven platform for Artists and Curators, featuring OTP-based authentication, robust models, and a curated public gallery.

---

## 🗂️ Data Models

### User
```ts
User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'artist' | 'curator';
  bio?: string;
  createdAt: Date;
}
```
- **Role-based access:** Only 'artist' or 'curator'.
- **Security:** Use strong password hashing (e.g., bcrypt).

### Artwork
```ts
Artwork {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  tags: string[]; // tag IDs or names
  submittedBy: string; // User.id
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string; // Curator's User.id
  approvedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}
```

### Feedback
```ts
Feedback {
  id: string;
  artworkId: string;
  curatorId: string; // User.id (curator)
  comments: string;
  rating: number; // 1-5
  timestamp: Date;
}
```

### Tag
```ts
Tag {
  id: string;
  name: string;
}
```

### ArtworkTag (Join Table)
```ts
ArtworkTag {
  artworkId: string;
  tagId: string;
}
```

### EmailOTP
```ts
EmailOTP {
  email: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}
```
- **Cleanup:** Auto-delete expired OTPs with a background job or prune on login attempts.

---

## 🖥️ Pages & Features

| Page                  | Description                                                                 | Access              |
|----------------------|-----------------------------------------------------------------------------|---------------------|
| Landing Page         | Carousel of top artworks, mission, CTA (Login/Register)                      | Everyone            |
| Login/Register       | Role-based registration, OTP/JWT auth, validations                           | Everyone            |
| Dashboard            | Personalized: artist submissions/status or curator review queue               | Artist / Curator    |
| Art Submission Form  | Artists submit artwork (title, tags, description)                             | Artist              |
| Curator Review Panel | Pending submissions, preview, approve/reject, feedback modal                  | Curator             |
| Public Gallery       | Approved artworks in card/grid, filters (tag, artist, category)               | Artist / Curator    |
| Artwork Detail View  | Full artwork view with metadata and feedback                                 | Artist/Curator      |
| Profile Page         | View/edit bio, track submissions/feedback history                             | Artist / Curator    |
| Notifications        | (Optional) WebSocket-driven alerts for status/review changes                  | Artist / Curator    |
| 404 & Error Pages    | Themed fallback for invalid routes/failures                                  | Everyone            |

---

## 🔐 OTP-Based Authentication Workflow

### Registration
1. User enters details (name, email, bio, role)
2. Backend generates OTP, emails it (Nodemailer/SendGrid)
3. User enters OTP in frontend
4. Backend verifies OTP, creates user, returns success

### Login
1. User enters email
2. Backend generates OTP, emails it
3. User enters OTP
4. Backend verifies OTP, returns JWT/session, redirects to dashboard

---

## 🏛️ Architecture & Best Practices
- **Modular structure:** Separate frontend (Angular), backend (Node/Express), and database (PostgreSQL)
- **JWT authentication** for secure sessions
- **Winston logging** for robust API monitoring
- **Testing:** Jasmine/Karma (Angular), Jest (Node)
- **Role-based routing and guards**
- **Clean, maintainable code:** Use services, guards, and interceptors in Angular; controllers/services in Node
- **Background jobs** for OTP cleanup
- **Responsive, modern UI/UX**

---

## 🚀 Next Steps
- Scaffold Angular routes and modules for each page
- Build backend endpoints for all models and OTP flows
- Implement role-based guards and JWT handling
- Add tests for all critical flows

---

*This documentation is now clean, structured, and ready for rapid development and onboarding!*
