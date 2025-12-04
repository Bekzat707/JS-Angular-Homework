# 🏗️ STORE - Project Architecture

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (Angular Components)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Home   │  │  About   │  │  Items   │  │  Login   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Signup  │  │ Profile  │  │Favorites │  │  Navbar  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                             │
│                   (Business Logic)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │  AuthService   │  │ ItemsService   │  │FavoritesService│  │
│  │                │  │                │  │                │  │
│  │ • signup()     │  │ • getItems()   │  │ • toggle()     │  │
│  │ • login()      │  │ • getById()    │  │ • isFavorite() │  │
│  │ • logout()     │  │ • search()     │  │ • sync()       │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐                       │
│  │ProfileService  │  │  AuthGuard     │                       │
│  │                │  │                │                       │
│  │ • getProfile() │  │ • canActivate()│                       │
│  │ • uploadPhoto()│  │                │                       │
│  └────────────────┘  └────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                             │
│                       (NgRx)                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐ │
│  │ Actions  │ →  │ Reducer  │ →  │  Store   │ →  │Selector │ │
│  └──────────┘    └──────────┘    └──────────┘    └─────────┘ │
│       ↓                                                  ↑      │
│  ┌──────────┐                                                  │
│  │ Effects  │ ─────────────────────────────────────────┘      │
│  └──────────┘                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Firebase                             │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │Authentication│  │  Firestore   │  │   Storage    │ │  │
│  │  │              │  │              │  │              │ │  │
│  │  │ • Users      │  │ • users/     │  │ • profile_   │ │  │
│  │  │ • Sessions   │  │   {uid}      │  │   pictures/  │ │  │
│  │  │              │  │   - email    │  │              │ │  │
│  │  │              │  │   - photoURL │  │              │ │  │
│  │  │              │  │   - favorites│  │              │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  DummyJSON API                          │  │
│  │                                                         │  │
│  │  • GET /products?limit=10&skip=0&q=search              │  │
│  │  • GET /products/:id                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT STORAGE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ localStorage │  │Service Worker│  │  IndexedDB   │        │
│  │              │  │              │  │              │        │
│  │ • favorites  │  │ • Cache API  │  │ • NgRx Store │        │
│  │   (guests)   │  │ • Offline    │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Authentication Flow

```
User Action: Click "Signup"
    ↓
SignupComponent
    ↓
AuthService.signup(email, password)
    ↓
Firebase Authentication
    ↓
Create User Account
    ↓
Return User Object
    ↓
AuthService.currentUser$ (Observable)
    ↓
Router.navigate(['/profile'])
    ↓
ProfileComponent (displays user info)
```

### 2. Favorites Sync Flow (Guest → Logged In)

```
GUEST MODE:
User clicks "Add to Favorites"
    ↓
FavoritesService.toggleFavorite(itemId)
    ↓
Save to localStorage
    ↓
Update BehaviorSubject
    ↓
UI updates (heart icon changes)

─────────────────────────────

USER LOGS IN:
AuthService.login()
    ↓
FavoritesService detects user login
    ↓
Load favorites from Firestore
    ↓
Load favorites from localStorage
    ↓
Merge both arrays (unique items)
    ↓
Save merged to Firestore
    ↓
Clear localStorage
    ↓
Update BehaviorSubject
    ↓
UI updates with all favorites
```

### 3. Profile Picture Upload Flow

```
User selects image file
    ↓
ProfileComponent.onFileSelected(file)
    ↓
Create Web Worker
    ↓
Worker: Compress image (70% quality)
    ↓
Worker returns compressed Blob
    ↓
Convert Blob to File
    ↓
ProfileService.uploadProfilePicture(uid, file)
    ↓
Upload to Firebase Storage
    ↓
Get download URL
    ↓
Save URL to Firestore (users/{uid}/photoURL)
    ↓
ProfileService.getUserProfile(uid) (Observable)
    ↓
UI auto-updates with new photo
```

### 4. Search & Pagination Flow

```
User types in search box
    ↓
ItemsListComponent.onSearch(query)
    ↓
Dispatch: loadItems({ page, limit, search })
    ↓
ItemsEffects.loadItems$
    ↓
debounceTime(300ms)
    ↓
ItemsService.getItems(page, limit, search)
    ↓
HTTP GET to DummyJSON API
    ↓
API returns { products, total, skip, limit }
    ↓
Dispatch: loadItemsSuccess(items, total)
    ↓
ItemsReducer updates state
    ↓
Selectors: selectItems$, selectLoading$
    ↓
Component subscribes to selectors
    ↓
UI updates with new items
```

---

## 🗂️ File Structure & Responsibilities

```
src/app/
│
├── components/                    # UI Layer
│   ├── home/
│   │   ├── home.component.ts     # Home page logic
│   │   ├── home.component.html   # Home template
│   │   └── home.component.css    # Home styles
│   │
│   ├── login/
│   │   ├── login.component.ts    # Login logic
│   │   ├── login.component.html  # Login form
│   │   └── login.component.css   # Login styles
│   │
│   ├── signup/
│   │   ├── signup.component.ts   # Signup logic + validation
│   │   ├── signup.component.html # Signup form
│   │   └── signup.component.css  # Signup styles
│   │
│   ├── profile/
│   │   ├── profile.component.ts  # Profile logic + upload
│   │   ├── profile.component.html# Profile template
│   │   └── profile.component.css # Profile styles
│   │
│   ├── items-list/
│   │   ├── items-list.component.ts   # List logic + pagination
│   │   ├── items-list.component.html # List template
│   │   └── items-list.component.css  # List styles
│   │
│   ├── item-details/
│   │   ├── item-details.component.ts # Details logic
│   │   ├── item-details.component.html# Details template
│   │   └── item-details.component.css# Details styles
│   │
│   ├── item-card/
│   │   ├── item-card.component.ts    # Card logic + favorites
│   │   ├── item-card.component.html  # Card template
│   │   └── item-card.component.css   # Card styles
│   │
│   ├── favorites/
│   │   ├── favorites.component.ts    # Favorites logic
│   │   ├── favorites.component.html  # Favorites template
│   │   └── favorites.component.css   # Favorites styles
│   │
│   └── navbar/
│       ├── navbar.component.ts       # Nav logic + auth state
│       ├── navbar.component.html     # Nav template
│       └── navbar.component.css      # Nav styles
│
├── services/                      # Business Logic Layer
│   ├── auth.service.ts           # Authentication operations
│   ├── auth.guard.ts             # Route protection
│   ├── items.service.ts          # API calls for products
│   ├── favorites.service.ts      # Favorites management
│   └── profile.service.ts        # Profile operations
│
├── items/state/                   # State Management Layer
│   ├── items.actions.ts          # Action definitions
│   ├── items.reducer.ts          # State updates
│   ├── items.effects.ts          # Side effects (API calls)
│   └── items.selectors.ts        # State queries
│
├── utils/                         # Utilities
│   └── password.validators.ts    # Custom validators
│
├── workers/                       # Web Workers
│   └── image-compressor.worker.ts# Image compression
│
├── app.config.ts                 # App configuration
├── app.routes.ts                 # Route definitions
└── app.component.ts              # Root component
```

---

## 🔌 API Integration

### DummyJSON API Endpoints

```typescript
// Base URL
const API_URL = 'https://dummyjson.com';

// Get products with pagination and search
GET /products?limit=10&skip=0&q=phone
Response: {
  products: Item[],
  total: number,
  skip: number,
  limit: number
}

// Get single product
GET /products/:id
Response: Item
```

### Firebase Integration

```typescript
// Authentication
import { Auth } from '@angular/fire/auth';
- createUserWithEmailAndPassword(auth, email, password)
- signInWithEmailAndPassword(auth, email, password)
- signOut(auth)

// Firestore
import { Firestore } from '@angular/fire/firestore';
- doc(firestore, 'users', uid)
- setDoc(docRef, data, { merge: true })
- getDoc(docRef)
- docData(docRef) // Observable

// Storage
import { Storage } from '@angular/fire/storage';
- ref(storage, 'profile_pictures/uid/filename')
- uploadBytes(storageRef, file)
- getDownloadURL(storageRef)
```

---

## 🎯 Component Communication

```
┌─────────────────────────────────────────────────────────┐
│                    App Component                        │
│                  (Root Component)                       │
└─────────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────┴────────────────┐
        ↓                                 ↓
┌───────────────┐              ┌───────────────────┐
│    Navbar     │              │  Router Outlet    │
│               │              │                   │
│ • Auth State  │              │  • Home           │
│ • Navigation  │              │  • Items List     │
│               │              │  • Item Details   │
└───────────────┘              │  • Login          │
                               │  • Signup         │
                               │  • Profile        │
                               │  • Favorites      │
                               └───────────────────┘

Communication Methods:
1. Services (Shared State)
   - AuthService.currentUser$ → Navbar, Profile
   - FavoritesService.favorites$ → ItemCard, Favorites

2. Router (Navigation)
   - Router.navigate(['/profile'])
   - routerLink="/items"

3. NgRx Store (Global State)
   - Store.select(selectItems) → ItemsList
   - Store.dispatch(loadItems()) → ItemsList

4. Input/Output (Parent-Child)
   - @Input() item → ItemCard
   - @Output() toggle → ItemsList
```

---

## 🔐 Security Architecture

### Authentication Flow
```
User → Login Form → AuthService → Firebase Auth
                                        ↓
                                   JWT Token
                                        ↓
                              Stored in Firebase SDK
                                        ↓
                              Auto-attached to requests
                                        ↓
                         Firestore/Storage verify token
```

### Route Protection
```
User navigates to /profile
    ↓
AuthGuard.canActivate()
    ↓
Check AuthService.currentUser$
    ↓
    ├─ User exists → Allow access
    └─ No user → Redirect to /login
```

### Firestore Security
```
Request to users/{userId}
    ↓
Firestore Security Rules
    ↓
Check: request.auth.uid == userId
    ↓
    ├─ Match → Allow
    └─ No match → Deny
```

### Storage Security
```
Upload to profile_pictures/{userId}/image.jpg
    ↓
Storage Security Rules
    ↓
Check:
  1. request.auth.uid == userId
  2. file.size < 5MB
  3. file.type matches 'image/*'
    ↓
    ├─ All pass → Allow
    └─ Any fail → Deny
```

---

## 📱 PWA Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │           Angular Application                │  │
│  └──────────────────────────────────────────────┘  │
│                       ↓ ↑                          │
│  ┌──────────────────────────────────────────────┐  │
│  │          Service Worker                      │  │
│  │                                              │  │
│  │  • Intercept network requests                │  │
│  │  • Cache responses                           │  │
│  │  • Serve from cache when offline             │  │
│  └──────────────────────────────────────────────┘  │
│                       ↓ ↑                          │
│  ┌──────────────────────────────────────────────┐  │
│  │            Cache Storage                     │  │
│  │                                              │  │
│  │  • ngsw:/:db:control                         │  │
│  │  • ngsw:/:db:ngsw:/:1:assets:app-shell       │  │
│  │  • ngsw:/:db:ngsw:/:1:data:api               │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
                       ↓ ↑
┌─────────────────────────────────────────────────────┐
│                   Network                           │
│                                                     │
│  • Firebase APIs                                    │
│  • DummyJSON API                                    │
└─────────────────────────────────────────────────────┘
```

---

## 🧩 Module Dependencies

```
App Module (Standalone Components)
│
├── @angular/core
├── @angular/common
├── @angular/router
├── @angular/forms
├── @angular/platform-browser
│
├── @angular/fire
│   ├── /auth
│   ├── /firestore
│   └── /storage
│
├── @ngrx/store
├── @ngrx/effects
├── @ngrx/store-devtools
│
├── @angular/service-worker
│
└── rxjs
```

---

## 🎨 Styling Architecture

```
Global Styles (styles.css)
├── CSS Variables
│   ├── Colors
│   ├── Shadows
│   └── Spacing
│
├── Base Styles
│   ├── Reset
│   ├── Typography
│   └── Body
│
├── Component Styles
│   ├── Navbar
│   ├── Buttons
│   ├── Forms
│   └── Cards
│
└── Utilities
    ├── Animations
    ├── Responsive
    └── Scrollbar

Component Styles (*.component.css)
├── Component-specific
├── Scoped to component
└── Override global if needed
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Testability
- ✅ Performance
- ✅ Security
