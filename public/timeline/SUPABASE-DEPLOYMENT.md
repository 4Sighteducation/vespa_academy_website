# 🚀 Deploying with Supabase

## Quick Setup (Without Next.js)

### 1. **Local Development**
Create `config.local.js` (git-ignored):
```javascript
window.localConfig = {
    supabase: {
        url: 'https://YOUR_PROJECT.supabase.co',
        anonKey: 'YOUR_ANON_KEY'
    }
};
```

### 2. **Vercel Deployment**

#### Option A: Using Serverless Function (Recommended)
1. In Vercel Dashboard → Settings → Environment Variables:
   - `SUPABASE_URL` = `https://yourproject.supabase.co`
   - `SUPABASE_ANON_KEY` = `your-anon-key`

2. Deploy files:
   - `index.html`
   - `app-supabase.js` (rename to `app.js`)
   - `styles.css`
   - `api/config.js` (serverless function)
   - `vercel.json`

#### Option B: Direct Client Config (Simpler)
If you're OK with the anon key being visible in code:
1. Edit `app-supabase.js` directly with your values
2. Deploy normally

### 3. **HTML Setup**
Add to your `index.html`:
```html
<!-- Before your app.js -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.local.js"></script> <!-- Only for local dev -->
<script src="app.js"></script>
```

## 🔑 Why This Approach Works

- **No Next.js needed** - Keep your simple static site
- **Serverless function** - Hides keys from client code
- **Fallback to localStorage** - Works even without Supabase
- **Easy deployment** - Just push to GitHub

## 📝 Summary

You DON'T need Next.js for environment variables. The serverless function approach gives you the same benefits while keeping your app simple! 