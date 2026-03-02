# Testing Strategy & Security Review

This document outlines the testing strategy, security measures, and performance optimizations implemented for the OLYM Company Site project.

## 1. Security Review

### Backend Security
- **Authentication**: Usage of `bcrypt` for password hashing and `jsonwebtoken` (JWT) for stateless authentication.
- **Middleware**:
  - `helmet`: Sets secure HTTP headers to prevent XSS, clickjacking, etc.
  - `cors`: Configured to allow cross-origin requests (customize origin in production).
  - `rate-limit`: Limits requests to 100 per 15 minutes per IP to prevent DDoS/brute-force.
- **Database**:
  - Prepared statements via Sequelize ORM to prevent SQL Injection.
  - Environment variables for sensitive credentials (DB password, JWT secret).

### Frontend Security
- **Content Security Policy (CSP)**: Ensure API calls are restricted to trusted domains.
- **Input validation**: Forms should validate input before submission.

## 2. Test Cases

### Functional Tests (Manual)

#### Authentication
1. **Register User**:
   - Helper: POST `/api/auth/register`
   - Data: `{"email": "test@example.com", "password": "password123"}`
   - Expect: 201 Created, returns Token.
2. **Login User**:
   - Helper: POST `/api/auth/login`
   - Data: `{"email": "test@example.com", "password": "password123"}`
   - Expect: 200 OK, returns Token.
3. **Access Protected Route**:
   - Helper: GET `/api/auth/me` with `Authorization: Bearer <token>`
   - Expect: 200 OK, returns user profile.

#### Content Management
1. **Create News (Admin)**:
   - Helper: POST `/api/news` with admin token.
   - Expect: 201 Created.
2. **View News (Public)**:
   - Helper: GET `/api/news`
   - Expect: List of news items.

#### Download Management
1. **Create Download (Admin)**:
   - Helper: POST `/api/downloads` with admin token.
   - Data: `{"name": "Test File", "url": "http://example.com/file.pdf"}`
   - Expect: 201 Created.
2. **View Downloads (Public)**:
   - Helper: GET `/api/downloads`
   - Expect: List of download items.

### Automated Tests (Unit/Integration)

Recommended setup using `jest` and `supertest`:

1.  **Install**: `npm install --save-dev jest supertest`
2.  **Run**: `npm test`

Example `auth.test.js`:
```javascript
const request = require('supertest');
const app = require('../index'); // Export app from index.js

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

## 3. Performance Review

- **Frontend**:
  - Images are served from local `/upload/` or optimized public URLs.
  - React components use `useEffect` and cleanup to avoid memory leaks.
  - Code splitting enabled by Vite default build.

- **Backend**:
  - `compression` middleware recommended for gzip response (add `npm install compression`).
  - Database indexing on commonly queried fields (e.g., `email`, `slug`).

## 4. Next Steps

1.  **Run Security Scan**: Use tools like `npm audit` or `OWASP ZAP`.
2.  **Load Testing**: Use `k6` or `Apache Benchmark` to test RPS capacity.
3.  **CI/CD**: Set up GitHub Actions for automated testing on push.
