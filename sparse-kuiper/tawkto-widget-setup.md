# tawk.to Live Chat Widget Setup

## Step 1: Create Your Account
1. Go to [tawk.to](https://tawk.to)
2. Click **Sign Up Free**
3. Register with:
   - **Email:** workplacewellnessafrica@gmail.com
   - **Password:** Waithaka@123
4. Verify your email

## Step 2: Set Up Your Property
1. After logging in, create a new property:
   - **Property Name:** Workplace Wellness Africa
   - **Website URL:** https://workplacewellnessafrica.org
2. Optionally customise the widget appearance to match your brand (green theme: `#059669`)

## Step 3: Get Your Widget Code
1. Go to **Administration** → **Settings** → **Chat Widget**
2. Copy the widget code snippet — it looks like:
```javascript
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function(){
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
```

## Step 4: Add to Your Website
1. Open `assets/js/layout.js`
2. Find the `injectTawkTo()` function (around line 107)
3. Replace the comment block with the actual code from Step 3
4. Save the file

The live chat widget will now appear on **every page** automatically.

## Optional: Set Up Triggers
- **Welcome message:** "Hi! 👋 How can we help you today?"
- **Business hours:** Mon-Fri, 8am-6pm EAT
- **Away message:** "We're currently offline. Leave a message and we'll reply within 24 hours, or WhatsApp us at +254 745 710 078."
