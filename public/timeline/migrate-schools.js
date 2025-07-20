// Migration script to add E-ACT schools to Supabase
// Run this once to populate the schools table with your hardcoded data

const eactSchools = [
    {
        id: 'bourne-end',
        name: 'Bourne End Academy',
        logo_url: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12230208/image.png',
        trust_id: 'e-act'
    },
    {
        id: 'crest',
        name: 'Crest Academy',
        logo_url: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12223392/image.png',
        trust_id: 'e-act'
    },
    {
        id: 'daventry',
        name: 'Daventry 6th Form',
        logo_url: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12223361/image.png',
        trust_id: 'e-act'
    },
    {
        id: 'montpelier',
        name: 'Montpelier High School',
        logo_url: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12229812/image.png',
        trust_id: 'e-act'
    },
    {
        id: 'north-birmingham',
        name: 'North Birmingham Academy',
        logo_url: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12230314/image.png',
        trust_id: 'e-act'
    },
    {
        id: 'ousedale',
        name: 'Ousedale',
        logo_url: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12223361/image.png',
        trust_id: 'e-act'
    },
    {
        id: 'west-walsall',
        name: 'West Walsall',
        logo_url: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12229850/image.png',
        trust_id: 'e-act'
    }
];

// Sample contacts for each school (you can customize these)
const schoolContacts = {
    'bourne-end': [
        { role: 'Principal', name: 'To Be Updated', email: 'natalie.king@bea.e-act.org.uk' },
        { role: 'VESPA Coordinator', name: 'Lauren Beynsberger', email: 'lauren.beynsberger@bea.e-act.org.uk' }
    ],
    'crest': [
        { role: 'Principal', name: 'Sikhu Ngwenya', email: 'sikhu.ngwenya@crest.e-act.org.uk' },
        { role: 'VESPA Coordinator', name: 'Aaron Newell', email: 'vespa@crest.e-act.org.uk' }
    ],
    'daventry': [
        { role: 'Principal', name: 'To Be Updated', email: 'principal@daventry.e-act.org.uk' },
        { role: 'VESPA Coordinator', name: 'To Be Updated', email: 'vespa@daventry.e-act.org.uk' }
    ],
    'montpelier': [
        { role: 'Principal', name: 'To Be Updated', email: 'principal@montpelier.e-act.org.uk' },
        { role: 'VESPA Coordinator', name: 'To Be Updated', email: 'vespa@montpelier.e-act.org.uk' }
    ],
    'north-birmingham': [
        { role: 'Principal', name: 'To Be Updated', email: 'principal@northbirmingham.e-act.org.uk' },
        { role: 'VESPA Coordinator', name: 'To Be Updated', email: 'vespa@northbirmingham.e-act.org.uk' }
    ],
    'ousedale': [
        { role: 'Principal', name: 'To Be Updated', email: 'principal@ousedale.e-act.org.uk' },
        { role: 'VESPA Coordinator', name: 'To Be Updated', email: 'vespa@ousedale.e-act.org.uk' }
    ],
    'west-walsall': [
        { role: 'Principal', name: 'To Be Updated', email: 'principal@westwalsall.e-act.org.uk' },
        { role: 'VESPA Coordinator', name: 'To Be Updated', email: 'vespa@westwalsall.e-act.org.uk' }
    ]
};

async function migrateSchools() {
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
        console.log('Starting schools migration...');
        
        // Insert schools
        for (const school of eactSchools) {
            console.log(`Inserting school: ${school.name}`);
            const { error: schoolError } = await supabaseClient
                .from('schools')
                .upsert(school);
            
            if (schoolError) {
                console.error(`Error inserting school ${school.name}:`, schoolError);
                continue;
            }
            
            // Insert contacts for this school
            const contacts = schoolContacts[school.id] || [];
            for (const contact of contacts) {
                console.log(`  Adding contact: ${contact.role}`);
                const { error: contactError } = await supabaseClient
                    .from('school_contacts')
                    .insert({
                        school_id: school.id,
                        role: contact.role,
                        name: contact.name,
                        email: contact.email
                    });
                
                if (contactError) {
                    console.error(`  Error inserting contact:`, contactError);
                }
            }
        }
        
        console.log('Schools migration completed!');
        alert('Schools migration completed! Check console for details.');
        
    } catch (error) {
        console.error('Migration error:', error);
        alert('Migration failed! Check console for details.');
    }
}

// Auto-run when loaded
if (window.supabase) {
    migrateSchools();
} else {
    window.addEventListener('load', () => {
        setTimeout(migrateSchools, 1000);
    });
} 