// Configuration file for VESPA Timeline
// This approach allows you to:
// 1. Keep sensitive config out of your main code
// 2. Have different configs for dev/prod
// 3. Not commit actual keys to GitHub

// Default configuration (safe to commit)
const config = {
    // Supabase configuration
    supabase: {
        url: null,
        anonKey: null
    },
    
    // Feature flags
    features: {
        useSupabase: false,
        allowLocalStorage: true,
        autoSync: false
    }
};

// Try to load config from external source
// Option 1: From a config.local.js file (git-ignored)
// Option 2: From window object (injected by server)
// Option 3: From URL parameters (for testing)

// Check if local config exists (you'll create this file locally but not commit it)
if (window.localConfig) {
    Object.assign(config.supabase, window.localConfig.supabase);
}

// Check URL parameters (useful for testing)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('supabase_url')) {
    config.supabase.url = urlParams.get('supabase_url');
    config.supabase.anonKey = urlParams.get('supabase_key');
}

// In production, try to fetch config from API
if (window.location.hostname !== 'localhost' && !window.location.protocol.includes('file')) {
    // We're in production, fetch config from API
    fetch('/timeline/api/config')
        .then(res => res.json())
        .then(data => {
            if (data.supabase && data.supabase.url && data.supabase.anonKey) {
                config.supabase = data.supabase;
                config.features.useSupabase = true;
                console.log('Supabase config loaded from API');
                
                // Re-initialize Supabase if app is already loaded
                if (window.initializeSupabase) {
                    window.initializeSupabase();
                }
            }
        })
        .catch(err => {
            console.log('Could not fetch config from API:', err);
        });
}

// Enable Supabase if configured
if (config.supabase.url && config.supabase.anonKey) {
    config.features.useSupabase = true;
    console.log('Supabase enabled');
} else {
    console.log('Running in localStorage-only mode');
}

// Export for use in app
window.appConfig = config; 