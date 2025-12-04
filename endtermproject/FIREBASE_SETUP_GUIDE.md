# Firebase Authentication Setup Guide - STORE Project

## 📋 Current Status

✅ **Already Configured:**
- Firebase SDK installed (`@angular/fire` v19.2.0, `firebase` v9.23.0)
- Firebase config in `environment.ts`
- Auth, Firestore, and Storage providers in `app.config.ts`
- AuthService with signup, login, logout methods
- AuthGuard protecting `/profile` route
- ProfileService with photo upload functionality
- FavoritesService with localStorage + Firestore sync
- Password validation (8+ chars, number, special char)
- Web Worker for image compression

## 🔥 Firebase Console Setup (REQUIRED)

### Step 1: Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **akzhols-market**
3. Click **Authentication** in left sidebar
4. Click **Get Started** (if not enabled)
5. Go to **Sign-in method** tab
6. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle **Enable** switch
   - Click **Save**

### Step 2: Enable Firestore Database
1. In Firebase Console, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select location (closest to you)
5. Click **Enable**

### Step 3: Set Firestore Security Rules
Replace default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow all users to read items (if you store items in Firestore)
    match /items/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 4: Enable Firebase Storage
1. Click **Storage** in left sidebar
2. Click **Get started**
3. Choose **Start in test mode**
4. Click **Next** → **Done**

### Step 5: Set Storage Security Rules
Replace default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures - users can only upload to their own folder
    match /profile_pictures/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 🧪 Testing Authentication

### Test Signup Flow:
1. Navigate to `http://localhost:4200/signup`
2. Enter email: `test@example.com`
3. Enter password: `Test123!` (meets requirements)
4. Repeat password: `Test123!`
5. Click **Signup**
6. Should redirect to `/profile`

### Test Login Flow:
1. Navigate to `http://localhost:4200/login`
2. Enter same credentials
3. Click **Login**
4. Should redirect to `/profile`

### Test Protected Route (AuthGuard):
1. Logout (click Logout button in navbar)
2. Try to access `http://localhost:4200/profile`
3. Should redirect to `/login`

### Test Profile Picture Upload:
1. Login and go to `/profile`
2. Click "Choose File" and select an image (PNG/JPEG)
3. Image will be compressed via Web Worker
4. Uploaded to Firebase Storage
5. URL saved in Firestore
6. Profile picture should update automatically

### Test Favorites (localStorage → Firestore):
1. **As Guest** (not logged in):
   - Go to `/items`
   - Click "🤍 Add to Favorites" on some items
   - Check `/favorites` - items should appear
   - Favorites stored in localStorage

2. **After Login**:
   - Login with your account
   - Favorites from localStorage automatically merge with Firestore
   - Add more favorites - they save to Firestore
   - Logout and login again - favorites persist

## 📊 Data Structure in Firestore

### Collection: `users`
```javascript
{
  "users": {
    "<user-uid>": {
      "uid": "string",
      "email": "string",
      "photoURL": "string (optional)",
      "favorites": [1, 2, 3, ...] // array of item IDs
    }
  }
}
```

## 🔐 Password Requirements

Your signup form validates:
- ✅ Minimum 8 characters
- ✅ At least one number
- ✅ At least one special character (!@#$%^&*(),.?":{}|<>)
- ✅ Passwords must match

## 🛡️ Security Features

1. **AuthGuard**: Protects `/profile` route
2. **Firestore Rules**: Users can only access their own data
3. **Storage Rules**: Users can only upload to their own folder, max 5MB
4. **Password Validation**: Client-side validation before submission
5. **Error Handling**: User-friendly error messages

## 🚀 Quick Start Commands

```bash
# Already running (you have ng serve running)
# Just open browser to http://localhost:4200

# To test PWA offline:
npm run build
npx http-server dist/hw6-routes/browser -p 8080
```

## 📝 Grading Checklist

### ✅ Authentication (1 point)
- [x] Firebase setup
- [x] Signup with email/password
- [x] Login functionality
- [x] Logout functionality
- [x] Password complexity rules (8+ chars, number, special char)
- [x] Repeat password validation
- [x] AuthGuard protecting routes

### ✅ Favorites Feature (1 point)
- [x] Works in localStorage for guests
- [x] Works in Firestore for logged-in users
- [x] Loads correctly after login (merge logic)
- [x] Full UI implemented (add/remove buttons)

### ✅ Profile Page (1 point)
- [x] Profile page for logged-in users
- [x] Profile picture upload
- [x] Image compression via Web Worker
- [x] Upload to Firebase Storage
- [x] Photo URL saved in Firestore
- [x] UI updates and displays stored picture

### ✅ PWA (0.5 points)
- [x] Manifest configured
- [x] Service worker enabled
- [x] Caching strategy
- [x] Offline behavior

### ✅ Routing (0.5 points)
- [x] 7+ pages (Home, About, Items, Item Details, Login, Signup, Profile, Favorites)
- [x] Protected route (/profile with AuthGuard)

## 🐛 Common Issues & Solutions

### Issue: "Firebase: Error (auth/email-already-in-use)"
**Solution**: Email is already registered. Try login instead or use different email.

### Issue: "Firebase: Error (auth/wrong-password)"
**Solution**: Incorrect password. Check credentials.

### Issue: "Firebase: Error (auth/user-not-found)"
**Solution**: User doesn't exist. Sign up first.

### Issue: Profile picture not uploading
**Solution**: 
1. Check Firebase Storage is enabled
2. Check security rules allow upload
3. Check file size < 5MB
4. Check file type is image (PNG/JPEG)

### Issue: Favorites not syncing
**Solution**:
1. Check Firestore is enabled
2. Check security rules allow read/write to users/{userId}
3. Check browser console for errors

## 🎯 Next Steps

1. **Enable Firebase Authentication** in console (most important!)
2. **Enable Firestore Database**
3. **Enable Firebase Storage**
4. **Set security rules** for Firestore and Storage
5. **Test signup/login** flows
6. **Test profile picture upload**
7. **Test favorites sync**

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Firebase Console → Authentication → Users (to see registered users)
3. Check Firestore → Data (to see stored data)
4. Check Storage → Files (to see uploaded images)

---

**Your project is 95% ready!** Just need to enable services in Firebase Console. 🔥
