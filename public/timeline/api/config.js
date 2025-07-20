// Vercel Serverless Function
// This serves your Supabase config without exposing it in client code

export default function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Return configuration
    res.status(200).json({
        supabase: {
            url: process.env.SUPABASE_URL,
            anonKey: process.env.SUPABASE_ANON_KEY
        }
    });
} 