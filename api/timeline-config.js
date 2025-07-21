// This serves your Supabase config from environment variables
// Set these in Vercel: SUPABASE_URL and SUPABASE_ANON_KEY

export default function handler(req, res) {
    // CORS headers for client-side access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');
    
    // Return config from environment variables
    res.status(200).json({
        supabase: {
            url: process.env.SUPABASE_URL || null,
            anonKey: process.env.SUPABASE_ANON_KEY || null
        }
    });
} 