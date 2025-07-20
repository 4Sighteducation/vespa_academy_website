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

// Enable Supabase if configured
if (config.supabase.url && config.supabase.anonKey) {
    config.features.useSupabase = true;
    console.log('Supabase enabled');
} else {
    console.log('Running in localStorage-only mode');
}

// Export for use in app
window.appConfig = config; 