# Backend Implementation Required: Admin Verification Endpoint

## 🔒 Security Enhancement: Admin Role Verification

### Overview
The frontend now implements **server-side admin verification** to prevent unauthorized access through localStorage manipulation. This requires a new backend endpoint.

---

## Required Endpoint

### `GET /api/v1/auth/verify-admin`

**Purpose:** Verify if the authenticated user has admin privileges by checking the database (not client-provided data).

**Headers:**
```http
Authorization: Bearer <access_token>
```

---

## Implementation Requirements

### 1. **Verify JWT Token**
```javascript
// Pseudo-code
const token = req.headers.authorization?.replace('Bearer ', '');
const decoded = jwt.verify(token, JWT_SECRET);
const userId = decoded.id;
```

### 2. **Query Database for User Role**
```javascript
// ⚠️ CRITICAL: Always check role from DATABASE, NOT from token payload
const user = await User.findById(userId);

if (!user) {
  return res.status(401).json({ 
    isAdmin: false, 
    message: 'User not found' 
  });
}
```

### 3. **Return Response**

#### ✅ Success Response (User is Admin)
```json
HTTP 200 OK
{
  "isAdmin": true,
  "user": {
    "id": "user_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### ❌ User is NOT Admin
```json
HTTP 200 OK
{
  "isAdmin": false
}
```

**OR**

```json
HTTP 403 Forbidden
{
  "isAdmin": false,
  "message": "Admin access required"
}
```

#### 🔐 Invalid/Expired Token
```json
HTTP 401 Unauthorized
{
  "isAdmin": false,
  "message": "Invalid or expired token"
}
```

---

## Example Implementation (Node.js/Express)

```javascript
// routes/auth.js
router.get('/verify-admin', authenticate, async (req, res) => {
  try {
    // req.user is set by authenticate middleware
    const userId = req.user.id;
    
    // Query database for current user role
    const user = await User.findById(userId).select('id name email role');
    
    if (!user) {
      return res.status(401).json({ 
        isAdmin: false, 
        message: 'User not found' 
      });
    }
    
    // Check role from database (NOT from token or request)
    const isAdmin = user.role === 'admin';
    
    if (isAdmin) {
      return res.json({
        isAdmin: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(403).json({
        isAdmin: false,
        message: 'Admin privileges required'
      });
    }
    
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({ 
      isAdmin: false, 
      message: 'Server error' 
    });
  }
});
```

---

## Security Checklist

- [ ] ✅ Endpoint requires valid JWT token
- [ ] ✅ User role checked from **DATABASE** (not token payload)
- [ ] ✅ Returns 401 for invalid/expired tokens
- [ ] ✅ Returns 403 for non-admin users
- [ ] ✅ Includes rate limiting (prevent brute force)
- [ ] ✅ Logs unauthorized access attempts
- [ ] ⚠️ **NEVER trust client-sent role data**

---

## Testing the Endpoint

### Test Case 1: Valid Admin User
```bash
curl -X GET http://localhost:5001/api/v1/auth/verify-admin \
  -H "Authorization: Bearer <admin_token>"

# Expected: 200 OK, { "isAdmin": true, "user": {...} }
```

### Test Case 2: Valid Non-Admin User
```bash
curl -X GET http://localhost:5001/api/v1/auth/verify-admin \
  -H "Authorization: Bearer <customer_token>"

# Expected: 403 Forbidden, { "isAdmin": false }
```

### Test Case 3: Invalid Token
```bash
curl -X GET http://localhost:5001/api/v1/auth/verify-admin \
  -H "Authorization: Bearer invalid_token"

# Expected: 401 Unauthorized, { "isAdmin": false }
```

### Test Case 4: No Token
```bash
curl -X GET http://localhost:5001/api/v1/auth/verify-admin

# Expected: 401 Unauthorized, { "isAdmin": false }
```

---

## Frontend Integration

The frontend automatically calls this endpoint when:
- User navigates to any `/admin/*` route
- `ProtectedRoute` component with `requireAdmin={true}` is rendered

**Frontend behavior:**
- ✅ If `isAdmin: true` → Grant access
- ❌ If `isAdmin: false` → Force logout + redirect to home
- ❌ If request fails → Force logout + redirect to home

---

## Additional Security Recommendations

### 1. **Protect All Admin API Routes**
Apply the same verification to all admin endpoints:
```javascript
// Middleware for admin routes
const requireAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Apply to admin routes
router.use('/admin/*', authenticate, requireAdmin);
```

### 2. **Audit Logging**
Log all admin verification attempts:
```javascript
logger.info('Admin verification attempt', {
  userId: user.id,
  email: user.email,
  role: user.role,
  ip: req.ip,
  success: isAdmin
});
```

### 3. **Rate Limiting**
Prevent abuse:
```javascript
const rateLimit = require('express-rate-limit');

const adminVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.get('/verify-admin', adminVerifyLimiter, authenticate, ...);
```

---

## Priority: 🔴 HIGH

This endpoint is **critical for security**. Without it:
- Users can manipulate localStorage to access admin UI
- Admin routes are vulnerable to unauthorized access
- Security bypass is trivial for any user

**Estimated Implementation Time:** 30-60 minutes

---

## Questions?

Contact the frontend team for clarification or additional requirements.

**Frontend Implementation:** ✅ Complete  
**Backend Implementation:** ⏳ Pending
