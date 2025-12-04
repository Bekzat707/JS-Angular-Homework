# 🔥 Firebase Console Quick Setup - 5 Minutes

## 🎯 Goal
Enable 3 Firebase services for your STORE project:
1. ✅ Authentication (Email/Password)
2. ✅ Firestore Database
3. ✅ Storage

---

## 📍 Step 1: Open Firebase Console

1. Go to: **https://console.firebase.google.com/**
2. Sign in with your Google account
3. You should see your project: **akzhols-market**
4. Click on it to open

---

## 🔐 Step 2: Enable Authentication (2 minutes)

### Visual Guide:
```
Firebase Console
├── Left Sidebar
│   └── Build
│       └── Authentication  ← CLICK HERE
```

### Actions:
1. Click **"Authentication"** in left sidebar
2. Click **"Get started"** button (if you see it)
3. Go to **"Sign-in method"** tab at the top
4. Find **"Email/Password"** in the list
5. Click on it
6. Toggle **"Enable"** switch to ON
7. Click **"Save"**

### ✅ Verification:
- You should see "Email/Password" with status "Enabled"
- Green checkmark next to it

---

## 💾 Step 3: Enable Firestore Database (2 minutes)

### Visual Guide:
```
Firebase Console
├── Left Sidebar
│   └── Build
│       └── Firestore Database  ← CLICK HERE
```

### Actions:
1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"** button
3. **Select mode:**
   - Choose **"Start in test mode"** (for development)
   - Click **"Next"**
4. **Select location:**
   - Choose closest to you (e.g., "asia-southeast1" for Asia)
   - Click **"Enable"**
5. Wait 30-60 seconds for setup

### ✅ Verification:
- You should see Firestore console with "Start collection" button
- Database is ready!

### 🛡️ Set Security Rules (IMPORTANT):
1. Click **"Rules"** tab at the top
2. Replace ALL content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

---

## 📦 Step 4: Enable Storage (1 minute)

### Visual Guide:
```
Firebase Console
├── Left Sidebar
│   └── Build
│       └── Storage  ← CLICK HERE
```

### Actions:
1. Click **"Storage"** in left sidebar
2. Click **"Get started"** button
3. **Security rules:**
   - Choose **"Start in test mode"**
   - Click **"Next"**
4. **Select location:**
   - Should auto-select same as Firestore
   - Click **"Done"**
5. Wait 10-20 seconds for setup

### ✅ Verification:
- You should see Storage console with "Upload file" button
- Storage is ready!

### 🛡️ Set Security Rules (IMPORTANT):
1. Click **"Rules"** tab at the top
2. Replace ALL content with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile_pictures/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Click **"Publish"**

---

## ✅ Final Verification Checklist

Go back to **Project Overview** (click project name at top):

### Check Services Status:
- [ ] **Authentication** - Shows "Email/Password" enabled
- [ ] **Firestore Database** - Shows database created
- [ ] **Storage** - Shows bucket created

### All should show green checkmarks! ✅

---

## 🧪 Test Your Setup

### 1. Test Signup (in your app):
```
1. Open http://localhost:4200/signup
2. Enter email: test@example.com
3. Enter password: Test123!
4. Repeat password: Test123!
5. Click Signup
6. Should redirect to /profile
```

### 2. Verify in Firebase Console:
```
Authentication → Users
└── Should see: test@example.com listed
```

### 3. Test Profile Upload:
```
1. Go to /profile (should be logged in)
2. Click "Choose File"
3. Select an image
4. Wait for upload
5. Image should appear
```

### 4. Verify in Firebase Console:
```
Storage → Files → profile_pictures
└── Should see: folder with your user ID
    └── Should see: uploaded image

Firestore → Data → users → [your-user-id]
└── Should see: photoURL field with storage link
```

### 5. Test Favorites:
```
1. Go to /items
2. Click "🤍 Add to Favorites" on some items
3. Go to /favorites
4. Should see your favorite items
```

### 6. Verify in Firebase Console:
```
Firestore → Data → users → [your-user-id]
└── Should see: favorites field with array of item IDs
```

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/operation-not-allowed)"
**Solution:** Email/Password not enabled. Go back to Step 2.

### Error: "Missing or insufficient permissions"
**Solution:** Firestore rules not set. Go back to Step 3, set rules.

### Error: "User does not have permission to access"
**Solution:** Storage rules not set. Go back to Step 4, set rules.

### Profile picture not uploading
**Solution:** 
1. Check Storage is enabled
2. Check Storage rules are set correctly
3. Check file is image (PNG/JPEG)
4. Check file size < 5MB

---

## 📊 Expected Firebase Console View

After setup, your Firebase Console should show:

```
Project: akzhols-market
├── Authentication
│   ├── Users: [list of registered users]
│   └── Sign-in method: Email/Password ✅
│
├── Firestore Database
│   └── users (collection)
│       └── [user-uid] (document)
│           ├── uid: "..."
│           ├── email: "..."
│           ├── photoURL: "https://..."
│           └── favorites: [1, 2, 3, ...]
│
└── Storage
    └── profile_pictures
        └── [user-uid]
            └── [image-file.jpg]
```

---

## ⏱️ Time Breakdown

- Step 1: Open Console - 30 seconds
- Step 2: Enable Auth - 2 minutes
- Step 3: Enable Firestore + Rules - 2 minutes
- Step 4: Enable Storage + Rules - 1 minute
- Testing - 2 minutes

**Total: ~7-8 minutes**

---

## 🎉 You're Done!

Once all 3 services are enabled and rules are set:
1. ✅ Authentication works
2. ✅ Favorites sync to Firestore
3. ✅ Profile pictures upload to Storage

**Your project is 100% ready for submission!** 🚀

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console (F12) for errors
2. Check Firebase Console → Authentication → Users
3. Check Firebase Console → Firestore → Data
4. Check Firebase Console → Storage → Files

Common error messages and solutions are in `FIREBASE_SETUP_GUIDE.md`
