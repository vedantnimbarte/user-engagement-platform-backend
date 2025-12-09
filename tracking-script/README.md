# UserPlus Tracking Script

### Script Public URL
```sh
https://pub-7e377bd3cfe644bca38e9ed2b6b36c21.r2.dev/userplus.js
```

## Overview
The **UserPlus Tracking Script** is a JavaScript SDK that enables tracking of users on your website, capturing their **session details, page views, clicks, events, bounce rate, and user identification**. It uses cookies for persistent user tracking and ensures seamless tracking across browser sessions.

## Features
- ✅ **Track anonymous & identified users**
- ✅ **Record page views and user sessions**
- ✅ **Capture button & link clicks using event capturing**
- ✅ **Track custom events**
- ✅ **Detect bounce rate (if user leaves within 10 minutes)**
- ✅ **Extract and track UTM parameters**
- ✅ **Monitor user idle state (15 minutes)**
- ✅ **Support for SPA (Single Page Applications)**
- ✅ **WebSocket support for real-time tracking**
- ✅ **Persistent user tracking via cookies**

---

## 📌 Installation
### **1️⃣ Install Dependencies**
UserPlus Tracking Script requires `pnpm` for package management. If you don’t have `pnpm`, install it first:
```sh
npm install -g pnpm
```
Now, install dependencies:
```sh
pnpm install
```

---

## 🔧 Building the Script
### **2️⃣ Build & Minify the Script**
To compile the TypeScript code and minify the output:
```sh
pnpm run start
```
This will:
1. Compile TypeScript (`dist/userTracker.js`)
2. Minify the script (`dist/tracker.min.js`)

---

## 🚀 Usage
### **3️⃣ Add the Script to Your Website**
Include the following script tag in your website’s **`<head>`**:
```html
<script src="https://cdn.yourdomain.com/tracker.min.js"></script>
<script>
    userplus.init("YOUR_DOMAIN_ID", document, window);
</script>
```
🔹 Replace `YOUR_DOMAIN_ID` with the unique domain ID for your website.

---

## 📊 Tracking API
Once initialized, you can track users and events:

### **Identify a User (Login Event)**
```js
userplus.identify("USER_ID", {
    name: "John Doe",
    email: "john@example.com"
});
```
🔹 This converts an **anonymous user** into an **identified user**.

### **Track a Custom Event**
```js
userplus.trackEvent("button_click", {
    button_name: "Subscribe Now",
    page: window.location.href
});
```
🔹 Use this to track interactions beyond page views.

---

## 🛠 How It Works
### **Tracking Flow**
1️⃣ **User visits the website** → The script checks for a stored `user_id` in **cookies**. If absent, it creates an **anonymous user**.

2️⃣ **Session Initialization** → If there's no active session, a **new session** is created and stored in **cookies + sessionStorage**.

3️⃣ **Page View Tracking** → Each page visit sends a request to `/page_view` API with:
   - User details
   - Session ID
   - User-Agent Data
   - Referrer and current URL

4️⃣ **Click & Event Tracking** → Clicks on buttons & links are tracked via **event capturing** and sent as events.

5️⃣ **User Identification** → If the user logs in, `userplus.identify(userId, userData)` updates their status to **identified**.

6️⃣ **Bounce Rate Detection** → If the user leaves **before 10 minutes** without interaction, a **bounce event** is sent.

7️⃣ **SPA Support** → The script listens for **URL changes** and sends page view events dynamically.

8️⃣ **WebSocket Integration** → Sends session and user data to the server for **real-time tracking**.

9️⃣ **Data Persistence** →
   - `localStorage` and `sessionStorage` store user details.
   - **Cookies** ensure session & user ID tracking remains intact across visits.

---

## 🏗️ Deployment
### **4️⃣ Host the Script on a CDN**
To make the script accessible, you need to upload `dist/tracker.min.js` to a CDN:

- **Option 1:** Host on your own server (Nginx, Apache)
- **Option 2:** Use Cloudflare Pages, AWS S3 + CloudFront, Vercel, or Netlify

Example URL:
```
https://cdn.yourdomain.com/tracker.min.js
```

Once hosted, users can include the script using the `<script>` tag.

---

## 🤝 Contributing
Feel free to open issues or submit pull requests if you’d like to contribute.

---

## 📄 License
This project is licensed under the MIT License.

---

## 📞 Support
For any questions or support, reach out to **support@yourdomain.com**.

---

Happy tracking! 🚀