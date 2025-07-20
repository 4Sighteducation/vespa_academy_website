// Migration script for E-ACT timeline data
// This will migrate your existing E-ACT client and milestones from localStorage to Supabase

async function migrateEactData() {
    // Load config
    const script = document.createElement('script');
    script.src = './config.local.js';
    document.head.appendChild(script);
    
    // Wait for config to load
    await new Promise(resolve => {
        script.onload = resolve;
    });
    
    // Initialize Supabase
    const { createClient } = supabase;
    const supabaseClient = createClient(window.localConfig.supabase.url, window.localConfig.supabase.anonKey);
    
    try {
        console.log('Starting E-ACT data migration...');
        
        // First, get the E-ACT client from localStorage
        const clientsData = localStorage.getItem('timeline-clients');
        if (!clientsData) {
            console.error('No clients found in localStorage!');
            return;
        }
        
        const clients = JSON.parse(clientsData);
        const eactClient = clients.find(c => c.name && c.name.includes('E-ACT'));
        
        if (!eactClient) {
            console.error('E-ACT client not found in localStorage!');
            return;
        }
        
        console.log('Found E-ACT client:', eactClient);
        
        // Insert the client to Supabase
        const { error: clientError } = await supabaseClient
            .from('clients')
            .upsert({
                id: eactClient.id,
                name: eactClient.name,
                project: eactClient.project || 'VESPA Implementation 2025-2026'
            });
        
        if (clientError) {
            console.error('Error inserting client:', clientError);
            return;
        }
        
        console.log('Client migrated successfully');
        
        // Now migrate the milestones
        const milestonesKey = 'milestones-' + eactClient.id;
        const milestonesData = localStorage.getItem(milestonesKey);
        
        if (!milestonesData) {
            console.log('No milestones found for this client');
            return;
        }
        
        const milestones = JSON.parse(milestonesData);
        console.log(`Found ${milestones.length} milestones to migrate`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const milestone of milestones) {
            console.log(`Migrating milestone: ${milestone.name}`);
            
            // Prepare the data with proper field mapping
            const supabaseData = {
                id: milestone.id,
                client_id: eactClient.id,
                name: milestone.name,
                phase: milestone.phase,
                start_date: milestone.startDate,
                end_date: milestone.endDate,
                status: milestone.status,
                progress: milestone.progress || 0,
                description: milestone.description || '',
                vespa_deliverables: Array.isArray(milestone.vespaDeliverables) 
                    ? milestone.vespaDeliverables 
                    : (milestone.vespaDeliverables ? milestone.vespaDeliverables.split(',').map(d => d.trim()) : []),
                school_deliverables: Array.isArray(milestone.schoolDeliverables) 
                    ? milestone.schoolDeliverables 
                    : (milestone.schoolDeliverables ? milestone.schoolDeliverables.split(',').map(d => d.trim()) : [])
            };
            
            const { error } = await supabaseClient
                .from('milestones')
                .upsert(supabaseData);
            
            if (error) {
                console.error(`Error migrating milestone ${milestone.name}:`, error);
                errorCount++;
            } else {
                console.log(`  ✓ Successfully migrated`);
                successCount++;
            }
        }
        
        console.log('\n=== Migration Summary ===');
        console.log(`Total milestones: ${milestones.length}`);
        console.log(`Successfully migrated: ${successCount}`);
        console.log(`Errors: ${errorCount}`);
        
        if (successCount === milestones.length) {
            console.log('\n✅ All data migrated successfully!');
            alert('E-ACT data migration completed successfully!');
        } else {
            console.log('\n⚠️ Some milestones failed to migrate. Check console for details.');
            alert(`Migration partially completed. ${successCount} of ${milestones.length} milestones migrated.`);
        }
        
    } catch (error) {
        console.error('Migration error:', error);
        alert('Migration failed! Check console for details.');
    }
}

// Function to verify the migration
async function verifyMigration() {
    const script = document.createElement('script');
    script.src = './config.local.js';
    document.head.appendChild(script);
    
    await new Promise(resolve => {
        script.onload = resolve;
    });
    
    const { createClient } = supabase;
    const supabaseClient = createClient(window.localConfig.supabase.url, window.localConfig.supabase.anonKey);
    
    try {
        // Check clients
        const { data: clients, error: clientError } = await supabaseClient
            .from('clients')
            .select('*');
        
        if (clientError) {
            console.error('Error fetching clients:', clientError);
            return;
        }
        
        console.log('Clients in Supabase:', clients);
        
        // Check milestones
        const { data: milestones, error: milestoneError } = await supabaseClient
            .from('milestones')
            .select('*');
        
        if (milestoneError) {
            console.error('Error fetching milestones:', milestoneError);
            return;
        }
        
        console.log('Milestones in Supabase:', milestones);
        
        // Check schools
        const { data: schools, error: schoolError } = await supabaseClient
            .from('schools')
            .select('*');
        
        if (schoolError) {
            console.error('Error fetching schools:', schoolError);
            return;
        }
        
        console.log('Schools in Supabase:', schools);
        
    } catch (error) {
        console.error('Verification error:', error);
    }
}

// Export functions for use
window.migrateEactData = migrateEactData;
window.verifyMigration = verifyMigration; 