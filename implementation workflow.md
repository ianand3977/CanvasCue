# Digital Art Submission Portal – Backend Implementation & Workflow

## What is Implemented in the Backend?

### 1. **Authentication & User Management**
- **OTP-based registration and login** (email, OTP, JWT)
- **Role-based access**: 'artist' and 'curator'
- **User profile** endpoint

### 2. **Artwork Management**
- **Artwork submission** (with image upload to Cloudinary)
- **Artwork listing and detail view**
- **Artwork approval/rejection** (curator only)
- **Artwork status tracking**

### 3. **Feedback System**
- **Curators can leave feedback** on artworks
- **Artists/curators can view feedback** for each artwork

### 4. **Tag Management**
- **Curators can create tags**
- **All users can list tags**

### 5. **Utilities & Middleware**
- **Winston logging** for errors and API activity
- **Centralized error handling**
- **JWT authentication and role guards**
- **Cloudinary integration** for image uploads

---

## Workflow for Each Role

### **Artist Workflow**
1. **Register/Login** using email and OTP (role: artist)
2. **Submit new artwork**:
   - Fill in title, description, tags, and upload an image (all in one form)
   - Image is uploaded to Cloudinary, URL is saved in the database
3. **View own submissions** and their status (pending/approved/rejected)
4. **View feedback** left by curators on their artworks
5. **Browse public gallery** of approved artworks
6. **Edit profile** (bio, etc.)

### **Curator Workflow**
1. **Register/Login** using email and OTP (role: curator)
2. **Review pending artworks**:
   - Approve or reject submissions
   - Leave feedback for artists
3. **Create new tags** for categorizing artworks
4. **View all artworks** (pending, approved, rejected)
5. **Browse public gallery**
6. **Edit profile** (bio, etc.)

---

## API Endpoints (Summary)
- `/user/register`, `/user/request-otp`, `/user/verify-otp`, `/user/login`, `/user/profile`
- `/artwork` (POST: submit with image, GET: list), `/artwork/:id`, `/artwork/:id/approve`, `/artwork/:id/reject`, `/artwork/upload` (legacy, now merged into POST /artwork)
- `/feedback` (POST: leave feedback), `/feedback/artwork/:artworkId` (GET: view feedback)
- `/tag` (POST: create, GET: list)

---

**All business logic is modularized (controllers/services/models/middleware).**
- All endpoints are protected by JWT and role-based guards as needed.
- All image uploads are handled via Cloudinary and saved as URLs in the database.
- All actions are logged and errors are handled centrally.

*For more details, see the Swagger UI at `/api/docs` when the backend is running.*
