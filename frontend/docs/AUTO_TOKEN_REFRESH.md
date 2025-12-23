# Auto Token Refresh Implementation

## 📋 Overview

Hệ thống tự động làm mới access token khi hết hạn, giảm thiểu việc user phải đăng nhập lại liên tục.

## 🔄 Flow Diagram

```
User Request → fetchWithAuth()
                    ↓
            Check Response Status
                    ↓
            ┌───────┴────────┐
            │                │
         200 OK          401 Unauthorized
            │                │
    Return Response    Check Refresh Token
                            ↓
                    ┌───────┴────────┐
                    │                │
            Token Exists      No Token
                    │                │
            Try Refresh    Redirect to Login
                    │
            ┌───────┴────────┐
            │                │
    Refresh Success   Refresh Failed
            │                │
    Retry Request    Redirect to Login
```

## 🛠️ Implementation Details

### 1. **fetchWithAuth() Helper Function**

Location: `/frontend/src/services/api.js`

**Chức năng:**
- Tự động thêm Authorization header cho mọi request
- Detect 401 Unauthorized response
- Tự động gọi refresh token API
- Retry request ban đầu với token mới
- Prevent multiple refresh attempts đồng thời (race condition)

**Key Features:**
```javascript
// Prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

// Queue requests while refreshing
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Notify all waiting requests when done
const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};
```

### 2. **AuthErrorHandler Component**

Location: `/frontend/src/components/AuthErrorHandler.jsx`

**Chức năng:**
- Listen for custom event `auth:token-expired`
- Clear localStorage khi token expired
- Redirect to login page
- Pass message qua React Router state

**Usage:**
```jsx
// In App.jsx
<AuthErrorHandler />
```

### 3. **Login Page Enhancement**

Location: `/frontend/src/pages/login.jsx`

**Chức năng:**
- Hiển thị message khi bị redirect do token expired
- Clear message sau khi hiển thị

## 📝 How It Works

### Scenario 1: Access Token Expired (Refresh Token Still Valid)

1. User gọi API → Access token hết hạn → Server trả về 401
2. `fetchWithAuth()` catch 401 error
3. Kiểm tra có refresh token trong localStorage không
4. Gọi API `/nguoidung/refresh` với refresh token
5. Backend verify refresh token → Return new access token + new refresh token
6. Save tokens mới vào localStorage
7. Retry request ban đầu với access token mới
8. User không bị interrupt, không cần login lại

### Scenario 2: Both Tokens Expired

1. User gọi API → Access token hết hạn → Server trả về 401
2. `fetchWithAuth()` catch 401 error
3. Try refresh token → Refresh token cũng hết hạn → Server trả về 401
4. Clear localStorage
5. Dispatch event `auth:token-expired`
6. `AuthErrorHandler` catch event → Redirect to `/login`
7. Login page hiển thị message: "Phiên đăng nhập đã hết hạn"

### Scenario 3: No Refresh Token

1. User gọi API → Access token hết hạn → Server trả về 401
2. `fetchWithAuth()` catch 401 error
3. Không tìm thấy refresh token trong localStorage
4. Clear localStorage
5. Redirect to `/login` ngay lập tức

## 🔐 Security Features

### 1. **Race Condition Prevention**
```javascript
if (isRefreshing) {
  // Wait for current refresh to complete
  return new Promise((resolve) => {
    subscribeTokenRefresh((newAccessToken) => {
      // Use new token for this request
      resolve(fetch(url, options));
    });
  });
}
```

**Vấn đề:** Nếu có 10 requests đồng thời và tất cả đều nhận 401, sẽ có 10 refresh token calls đồng thời.

**Giải pháp:** 
- Request đầu tiên set `isRefreshing = true`
- 9 requests còn lại subscribe vào `refreshSubscribers[]`
- Khi refresh xong, notify tất cả subscribers
- Tất cả requests retry với token mới

### 2. **Token Rotation**
Backend nên implement token rotation:
- Mỗi lần refresh → Return new access token + new refresh token
- Invalidate old refresh token
- Prevent token reuse attacks

### 3. **Secure Storage**
```javascript
// Store tokens
localStorage.setItem('accessToken', newAccessToken);
localStorage.setItem('refreshToken', newRefreshToken);

// Clear on logout/expiration
localStorage.clear();
```

**Note:** Trong production, cân nhắc:
- HttpOnly cookies cho refresh token (an toàn hơn)
- Encrypt tokens trước khi lưu localStorage
- Implement fingerprinting để detect token theft

## 📊 Token Lifetimes

**Recommended Settings:**

| Token Type | Lifetime | Reason |
|-----------|----------|--------|
| Access Token | 15 minutes | Short-lived để giảm risk nếu bị steal |
| Refresh Token | 7 days | Đủ dài để user không phải login thường xuyên |

**Backend Configuration:**
```javascript
// In backend JWT config
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
```

## 🧪 Testing Scenarios

### Test 1: Normal Flow
1. Login successfully
2. Navigate through app
3. Make API calls → Should work normally
4. **Expected:** No interruption

### Test 2: Access Token Expired
1. Login
2. Wait for access token to expire (or manually set expired token)
3. Make API call
4. **Expected:** 
   - Request fails with 401
   - Auto refresh
   - Request succeeds
   - No redirect to login

### Test 3: Both Tokens Expired
1. Login
2. Wait for both tokens to expire
3. Make API call
4. **Expected:**
   - Request fails with 401
   - Refresh fails with 401
   - Clear localStorage
   - Redirect to login
   - Show message "Phiên đăng nhập đã hết hạn"

### Test 4: Multiple Concurrent Requests
1. Login
2. Trigger 10 API calls simultaneously after access token expired
3. **Expected:**
   - Only 1 refresh token call
   - All 10 requests wait for refresh
   - All 10 requests retry with new token
   - All succeed

## 🐛 Debugging

### Check Token Status
```javascript
// In browser console
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));

// Decode JWT to check expiration
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires at:', new Date(payload.exp * 1000));
console.log('Is expired:', Date.now() > payload.exp * 1000);
```

### Monitor Refresh Attempts
```javascript
// Add logging in fetchWithAuth
console.log('🔄 Refreshing token...');
console.log('✅ Token refreshed successfully');
console.log('❌ Refresh failed, redirecting to login');
```

## 📚 API Endpoints

### Refresh Token
```http
POST /api/nguoidung/refresh
Content-Type: application/json

Request:
{
  "refreshToken": "string"
}

Response (Success):
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  },
  "statusCode": 200
}

Response (Failed - Token Expired):
{
  "success": false,
  "message": "Refresh token đã hết hạn",
  "statusCode": 401
}
```

## 🔧 Configuration

### Frontend Environment Variables
```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend JWT Configuration
```javascript
// backend/config/jwt.js
export const jwtConfig = {
  accessTokenSecret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
};
```

## 🚀 Benefits

1. **Better UX:** User không bị logout giữa chừng
2. **Security:** Short-lived access tokens giảm risk
3. **Performance:** Automatic retry, không cần manual refresh
4. **Scalability:** Handle concurrent requests efficiently

## ⚠️ Limitations & Considerations

1. **Refresh Token Storage:**
   - localStorage có thể bị XSS attacks
   - Cân nhắc dùng HttpOnly cookies

2. **Network Issues:**
   - Nếu refresh token call failed do network → User bị logout
   - Có thể add retry logic với exponential backoff

3. **Token Rotation:**
   - Backend phải invalidate old refresh token
   - Prevent token reuse

4. **Session Management:**
   - Cân nhắc add "Remember me" option
   - Different token lifetimes cho remembered vs non-remembered sessions

## 📖 References

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Token Storage Guide](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [React Router Navigation](https://reactrouter.com/en/main/hooks/use-navigate)

---

**Last Updated:** December 23, 2025
**Version:** 1.0.0
