// Add this at the top of your app.js file

// Supabase Configuration
let SUPABASE_URL = null;
let SUPABASE_ANON_KEY = null;
let supabase = null;

// Async function to load configuration
async function loadConfig() {
    // First check if local config exists
    if (window.localConfig && window.localConfig.supabase) {
        SUPABASE_URL = window.localConfig.supabase.url;
        SUPABASE_ANON_KEY = window.localConfig.supabase.anonKey;
        console.log('Using local config for Supabase');
    } else {
        // Try to fetch config from API endpoint (Vercel serverless function)
        try {
            const response = await fetch('/api/config');
            if (response.ok) {
                const config = await response.json();
                SUPABASE_URL = config.supabase.url;
                SUPABASE_ANON_KEY = config.supabase.anonKey;
                console.log('Loaded config from API');
            }
        } catch (error) {
            console.log('Could not load config from API');
        }
    }
    
    // Initialize Supabase if config is available
    if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized successfully!');
    } else {
        console.log('Running in localStorage mode (no Supabase config)');
    }
}

// Modified TimelineApp class with Supabase integration
class TimelineApp {
    constructor() {
        this.clients = [];
        this.currentClient = null;
        this.milestones = [];
        this.currentView = 'timeline';
        this.zoomLevel = 1;
        this.editingMilestone = null;
        this.selectedSchool = 'all';
        this.useSupabase = !!supabase; // Use Supabase if available
        
        // ... rest of constructor code ...
    }
    
    // Modified load clients to try Supabase first, fallback to localStorage
    async loadClients() {
        if (this.useSupabase) {
            try {
                const { data, error } = await supabase
                    .from('clients')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Supabase error, falling back to localStorage:', error);
                this.useSupabase = false;
            }
        }
        
        // Fallback to localStorage
        const stored = localStorage.getItem('vespaClients');
        return stored ? JSON.parse(stored) : [];
    }
    
    // Modified save clients
    async saveClients() {
        if (this.useSupabase && this.currentClient) {
            try {
                const { error } = await supabase
                    .from('clients')
                    .upsert({
                        id: this.currentClient.id,
                        name: this.currentClient.name,
                        project: this.currentClient.project
                    });
                
                if (error) throw error;
                return;
            } catch (error) {
                console.error('Supabase save error:', error);
            }
        }
        
        // Fallback to localStorage
        localStorage.setItem('vespaClients', JSON.stringify(this.clients));
    }
    
    // Modified load milestones
    async loadMilestones() {
        if (!this.currentClient) return;
        
        if (this.useSupabase) {
            try {
                const { data, error } = await supabase
                    .from('milestones')
                    .select('*')
                    .eq('client_id', this.currentClient.id)
                    .order('start_date', { ascending: true });
                
                if (error) throw error;
                this.milestones = data || [];
                this.renderCurrentView();
                this.updateProgressStats();
                return;
            } catch (error) {
                console.error('Supabase error:', error);
            }
        }
        
        // Fallback to localStorage
        const stored = localStorage.getItem('milestones-' + this.currentClient.id);
        this.milestones = stored ? JSON.parse(stored) : [];
        this.renderCurrentView();
        this.updateProgressStats();
    }
    
    // Modified save milestone
    async saveMilestone(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('milestoneName').value,
            phase: document.getElementById('phase').value,
            start_date: document.getElementById('startDate').value,
            end_date: document.getElementById('endDate').value,
            status: document.getElementById('status').value,
            progress: parseInt(document.getElementById('progress').value),
            description: document.getElementById('description').value,
            vespa_deliverables: document.getElementById('vespaDeliverables').value
                .split(',')
                .map(d => d.trim())
                .filter(d => d),
            school_deliverables: document.getElementById('schoolDeliverables').value
                .split(',')
                .map(d => d.trim())
                .filter(d => d)
        };
        
        if (this.useSupabase) {
            try {
                if (this.editingMilestone) {
                    // Update existing
                    const { error } = await supabase
                        .from('milestones')
                        .update(formData)
                        .eq('id', this.editingMilestone.id);
                    
                    if (error) throw error;
                } else {
                    // Create new
                    const { error } = await supabase
                        .from('milestones')
                        .insert({
                            ...formData,
                            client_id: this.currentClient.id
                        });
                    
                    if (error) throw error;
                }
                
                // Reload milestones
                await this.loadMilestones();
                this.closeMilestoneModal();
                return;
            } catch (error) {
                console.error('Supabase error:', error);
                alert('Error saving to database. Data saved locally.');
            }
        }
        
        // Fallback to localStorage save (existing code)
        if (this.editingMilestone) {
            const index = this.milestones.findIndex(m => m.id === this.editingMilestone.id);
            this.milestones[index] = { ...this.editingMilestone, ...formData };
        } else {
            this.milestones.push({
                id: 'milestone-' + Date.now(),
                ...formData
            });
        }
        
        this.saveMilestones();
        this.renderCurrentView();
        this.updateProgressStats();
        this.closeMilestoneModal();
    }
    
    // Add method to sync localStorage data to Supabase
    async syncToSupabase() {
        if (!this.useSupabase || !confirm('Sync all local data to cloud?')) return;
        
        try {
            // Sync clients
            for (const client of this.clients) {
                await supabase.from('clients').upsert({
                    id: client.id,
                    name: client.name,
                    project: client.project
                });
                
                // Sync milestones for this client
                const localMilestones = localStorage.getItem('milestones-' + client.id);
                if (localMilestones) {
                    const milestones = JSON.parse(localMilestones);
                    for (const milestone of milestones) {
                        await supabase.from('milestones').upsert({
                            ...milestone,
                            client_id: client.id
                        });
                    }
                }
            }
            
            alert('Data synced to cloud successfully!');
        } catch (error) {
            console.error('Sync error:', error);
            alert('Error syncing data: ' + error.message);
        }
    }
}

// Initialize app after config is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Load config first
    await loadConfig();
    
    // Initialize the app
    window.app = new TimelineApp();
}); 