// ===== Timeline Application with E-ACT Project Pre-loaded =====

// Initialize Supabase if config is available
let supabaseClient = null;
let useSupabase = false;

function initializeSupabase() {
    if (window.appConfig && window.appConfig.features.useSupabase && window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(
                window.appConfig.supabase.url,
                window.appConfig.supabase.anonKey
            );
            useSupabase = true;
            console.log('Supabase initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            useSupabase = false;
            return false;
        }
    } else {
        console.log('Running in localStorage-only mode');
        return false;
    }
}

class TimelineApp {
    constructor() {
        this.clients = this.loadClients();
        this.currentClient = null;
        this.milestones = [];
        this.currentView = 'timeline';
        this.zoomLevel = 1.2; // Set default zoom to 120% for better visibility
        this.editingMilestone = null;
        this.selectedSchool = 'all';
        this.isClientView = window.isClientView || false; // Check if we're in client view
        this.useSupabase = useSupabase;
        
        // School data with contact details
        this.schools = [
            { 
                id: 'bourne-end', 
                name: 'Bourne End Academy', 
                logo: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12230208/image.png',
                contacts: {
                    'Head of 6th Form': { name: 'Lauren Beynsberger', email: 'lauren.beynsberger@bea.e-act.org.uk' },
                    'Headteacher': { name: 'Natalie King', email: 'natalie.king@bea.e-act.org.uk' }
                }
            },
            { 
                id: 'crest', 
                name: 'Crest Academy', 
                logo: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12223392/image.png',
                contacts: {
                    'Head of 6th Form': { name: 'Aaron Newell', email: 'aaron.newell@crest.e-act.org.uk' },
                    'Associate Headteacher': { name: 'Sikhu Ngwenya', email: 'sikhu.ngwenya@crest.e-act.org.uk' }
                }
            },
            { 
                id: 'daventry', 
                name: 'Daventry 6th Form', 
                logo: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12223361/image.png',
                contacts: {
                    'Head of 6th Form': { name: 'Jac Dempster', email: 'jacqueline.dempster@pkr.e-act.org.uk' },
                    'Headteacher': { name: 'Maughan Johnson', email: 'maughan.johnson@pkr.e-act.org.uk' }
                }
            },
            { 
                id: 'montpelier', 
                name: 'Montpelier V6', 
                logo: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12229812/image.png',
                contacts: {
                    'Head of 6th Form': { name: 'Caroline McClean', email: 'caroline.mcclean@mhs.e-act.org.uk' },
                    'Headteacher': { name: 'Vanetta (Ben) Spence', email: 'vanetta.spence@mhs.e-act.org.uk' }
                }
            },
            { 
                id: 'north-birmingham', 
                name: 'North Birmingham Academy', 
                logo: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12230314/image.png',
                contacts: {
                    'Head of 6th Form': { name: 'Rhiannon Brown', email: 'rhiannon.brown@nba.e-act.org.uk' },
                    'Headteacher': { name: 'David Karim', email: 'david.karim@nba.e-act.org.uk' }
                }
            },
            { 
                id: 'ousedale', 
                name: 'Ousedale', 
                logo: 'https://tse1.mm.bing.net/th/id/OIP.zPyqAOuaIUoSxs5TGlwGfwAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
                contacts: {
                    'Head of 6th Form': { name: 'Rose Camden', email: 'rose.camden@ousedale.org.uk' },
                    'Headteacher': { name: 'Paul McFadden', email: 'paul.mcfadden@ousedale.org.uk' }
                }
            },
            { 
                id: 'west-walsall', 
                name: 'West Walsall', 
                logo: 'https://s3.amazonaws.com/media-p.slid.es/uploads/2275761/images/12229850/image.png',
                contacts: {
                    'Head of 6th Form': { name: 'Tracey Stanton', email: 'tracey.stanton@wwa.e-act.org.uk' },
                    'Headteacher': { name: 'Laura Wilson', email: 'laura.wilson@wwa.e-act.org.uk' }
                }
            }
        ];
        
        // School progress data (mock data - would be loaded from storage in real app)
        this.schoolProgress = {};
    }
    
    async init() {
        this.setupEventListeners();
        
        // Try to initialize Supabase (may have been loaded after initial check)
        if (!this.useSupabase) {
            this.useSupabase = initializeSupabase();
            useSupabase = this.useSupabase; // Update global flag
        }
        
        // Try to load clients from Supabase first
        await this.loadClientsFromSupabase();
        
        await this.loadEACTProject();
        this.updateProgressStats();
        this.updateSchoolProgressBars();
        
        // Show schools bar for E-ACT project
        const schoolsBar = document.getElementById('schoolsBar');
        if (schoolsBar && this.currentClient && this.currentClient.name === 'E-ACT') {
            schoolsBar.style.display = 'block';
            this.populateSchoolsBar(); // Populate the schools
            
            // Show matrix view button for multi-school clients
            const matrixBtn = document.getElementById('matrixViewBtn');
            if (matrixBtn) {
                matrixBtn.style.display = 'inline-block';
            }
        }
    }
    
    async loadEACTProject() {
        // Check if E-ACT client exists
        let eactClient = this.clients.find(c => c.name === 'E-ACT');
        
        if (!eactClient) {
            // Create E-ACT client
            eactClient = {
                id: 'client-eact-2025',
                name: 'E-ACT',
                project: 'School VESPA Coaching Portal 2025-2026',
                createdAt: new Date().toISOString()
            };
            this.clients.push(eactClient);
            await this.saveClients();
        }
        
        // Select E-ACT client
        await this.selectClient(eactClient);
        
        // Load E-ACT milestones
        const stored = localStorage.getItem('milestones-' + eactClient.id);
        if (!stored && this.milestones.length === 0) {
            // Create E-ACT milestones
            this.milestones = this.getEACTMilestones();
            await this.saveMilestones();
        }
    }
    
    getEACTMilestones() {
        return [
            // VESPA Activities (Suggested activities to run throughout the year)
            {
                id: 'vespa-1',
                name: '6 Types of Goal',
                phase: 'activities',
                startDate: '2025-09-01',
                endDate: '2025-09-30',
                status: 'upcoming',
                progress: 25,
                description: 'Goal setting activity',
                vespaCategory: 'VISION',
                attachments: [
                    'https://vespa.academy/resources/6-types-of-goal.pdf',
                    'Activity Worksheet'
                ]
            },
            {
                id: 'vespa-2',
                name: 'Proactive vs Reactive',
                phase: 'activities',
                startDate: '2025-09-15',
                endDate: '2025-10-15',
                status: 'upcoming',
                progress: 0,
                description: 'Time management activity',
                vespaCategory: 'EFFORT'
            },
            {
                id: 'vespa-3',
                name: 'Pending, Doing, Done',
                phase: 'activities',
                startDate: '2025-10-01',
                endDate: '2025-10-31',
                status: 'upcoming',
                progress: 0,
                description: 'Task management activity',
                vespaCategory: 'SYSTEMS'
            },
            {
                id: 'vespa-4',
                name: 'Environment Design',
                phase: 'activities',
                startDate: '2025-10-15',
                endDate: '2025-11-15',
                status: 'upcoming',
                progress: 0,
                description: 'Study environment optimization',
                vespaCategory: 'PRACTICE'
            },
            {
                id: 'vespa-5',
                name: 'Check Ahead, Check Back',
                phase: 'activities',
                startDate: '2025-11-01',
                endDate: '2025-11-30',
                status: 'upcoming',
                progress: 0,
                description: 'Review and planning activity',
                vespaCategory: 'PRACTICE'
            },
            {
                id: 'vespa-6',
                name: 'Proactive vs Reactive',
                phase: 'activities',
                startDate: '2025-12-01',
                endDate: '2025-12-31',
                status: 'upcoming',
                progress: 0,
                description: 'Time management reinforcement',
                vespaCategory: 'EFFORT'
            },
            {
                id: 'vespa-7',
                name: 'A Question of Money',
                phase: 'activities',
                startDate: '2026-01-15',
                endDate: '2026-02-15',
                status: 'upcoming',
                progress: 0,
                description: 'Future planning activity',
                vespaCategory: 'VISION'
            },
            {
                id: 'vespa-8',
                name: 'Have to, Ought to, Want to',
                phase: 'activities',
                startDate: '2026-02-01',
                endDate: '2026-02-28',
                status: 'upcoming',
                progress: 0,
                description: 'Motivation activity',
                vespaCategory: 'ATTITUDE'
            },
            {
                id: 'vespa-9',
                name: 'Worst Case Scenarios',
                phase: 'activities',
                startDate: '2026-02-15',
                endDate: '2026-03-15',
                status: 'upcoming',
                progress: 0,
                description: 'Resilience building activity',
                vespaCategory: 'ATTITUDE'
            },
            {
                id: 'vespa-10',
                name: 'Cog P vs Cog A',
                phase: 'activities',
                startDate: '2026-03-01',
                endDate: '2026-03-31',
                status: 'upcoming',
                progress: 0,
                description: 'Learning strategy activity',
                vespaCategory: 'PRACTICE'
            },
            {
                id: 'vespa-11',
                name: 'Teach your imaginary Class',
                phase: 'activities',
                startDate: '2026-03-15',
                endDate: '2026-04-15',
                status: 'upcoming',
                progress: 0,
                description: 'Active learning technique',
                vespaCategory: 'PRACTICE'
            },
            // Pre-project Planning Sessions (July)
            {
                id: 'pre-1',
                name: 'Project Planning Session 1',
                phase: 'planning',
                startDate: '2025-07-14',
                endDate: '2025-07-16',
                status: 'upcoming',
                progress: 0,
                description: 'Initial project planning and setup',
                vespaDeliverables: ['Project roadmap', 'Requirements gathering'],
                schoolDeliverables: ['Key stakeholder identification', 'Initial requirements']
            },
            {
                id: 'pre-2',
                name: 'Project Planning Session 2',
                phase: 'planning',
                startDate: '2025-07-21',
                endDate: '2025-07-23',
                status: 'upcoming',
                progress: 0,
                description: 'Detailed planning and preparation',
                vespaDeliverables: ['Detailed timeline', 'Resource allocation'],
                schoolDeliverables: ['Staff allocation', 'Schedule confirmation']
            },
            // Setup and Launch Phase
            {
                id: 'eact-1',
                name: 'Welcome Webinar (All Schools)',
                phase: 'planning',
                startDate: '2025-07-21',
                endDate: '2025-07-21',
                status: 'upcoming',
                progress: 0,
                description: 'Initial welcome webinar for all E-ACT schools',
                vespaDeliverables: ['Welcome presentation', 'Portal overview'],
                schoolDeliverables: ['School attendance', 'Q&A participation'],
                attachments: [
                    'https://vespa.academy/resources/welcome-presentation.pdf',
                    'Webinar Recording Link',
                    'https://docs.google.com/presentation/d/example'
                ]
            },
            {
                id: 'eact-2',
                name: 'Staff Onboarding (CSV Upload)',
                phase: 'planning',
                startDate: '2025-07-21',
                endDate: '2025-08-31',
                status: 'upcoming',
                progress: 0,
                description: 'Upload staff details via CSV for portal access',
                vespaDeliverables: ['CSV upload system', 'Portal access setup'],
                schoolDeliverables: ['Provide staff list', 'Verify access credentials']
            },
            {
                id: 'eact-3',
                name: 'Portal Training Sessions',
                phase: 'planning',
                startDate: '2025-08-01',
                endDate: '2025-09-19',
                status: 'upcoming',
                progress: 50,
                description: 'Individual school training sessions - to be booked',
                vespaDeliverables: ['Training materials', 'User guides', 'Video tutorials'],
                schoolDeliverables: ['Book training slots', 'Ensure staff attendance']
            },
            {
                id: 'eact-4',
                name: 'Staff INSET/CPD Session 1 - Project Launch',
                phase: 'planning',
                startDate: '2025-09-22',
                endDate: '2025-09-22',
                status: 'upcoming',
                progress: 0,
                description: 'Face to Face at E-ACT HQ Birmingham - Led by Martin Griffin',
                deliverables: ['CPD materials', 'Project launch pack']
            },
            
            // Student Onboarding
            {
                id: 'eact-5',
                name: 'Student Onboarding and Questionnaire',
                phase: 'implementation',
                startDate: '2025-09-01',
                endDate: '2025-10-24',
                status: 'upcoming',
                progress: 0,
                description: 'Student webinar sessions and questionnaire completion',
                vespaDeliverables: ['Student questionnaire system', 'Data collection portal'],
                schoolDeliverables: ['Ensure student participation', 'Questionnaire completion']
            },
            
            // Cycle 1 Activities
            {
                id: 'eact-6',
                name: 'CPD: Effective Student Conversations',
                phase: 'implementation',
                startDate: '2025-09-18',
                endDate: '2025-09-18',
                status: 'upcoming',
                progress: 0,
                description: 'Staff CPD Webinar 15:45-16:45 - Led by Martin Griffin',
                deliverables: ['Coaching model framework', 'Recording']
            },
            {
                id: 'eact-7',
                name: 'CPD: Developing Independent Learners',
                phase: 'implementation',
                startDate: '2025-11-06',
                endDate: '2025-11-06',
                status: 'upcoming',
                progress: 0,
                description: 'Staff CPD Webinar 15:45-16:45 - Goal setting focus',
                deliverables: ['Goal setting templates', 'Recording']
            },
            {
                id: 'eact-8',
                name: 'Student 1-1 Coaching Sessions (Cycle 1)',
                phase: 'implementation',
                startDate: '2025-10-01',
                endDate: '2025-11-30',
                status: 'upcoming',
                progress: 75,
                description: 'Individual coaching conversations using questionnaire results',
                vespaDeliverables: ['Coaching framework', 'Portal tracking system'],
                schoolDeliverables: ['Conduct 1-1 sessions', 'Record student goals', 'Submit coaching records']
            },
            {
                id: 'eact-9',
                name: 'Cycle 1 Milestone Activities',
                phase: 'implementation',
                startDate: '2025-09-22',
                endDate: '2025-12-19',
                status: 'upcoming',
                progress: 0,
                description: '6 Types of Goal, Pro-active vs Re-active, Pending/Doing/Done, Environment Design, Check Ahead/Back',
                vespaDeliverables: ['Activity resources', 'Implementation guides'],
                schoolDeliverables: ['Complete milestone activities with students', 'Track student engagement', 'Activity completion records']
            },
            {
                id: 'eact-10',
                name: 'Cycle 1 Round Up and Data Analysis',
                phase: 'review',
                startDate: '2025-12-15',
                endDate: '2025-12-19',
                status: 'upcoming',
                progress: 0,
                description: 'Feedback to Amy Gill / Tony Dennis / Martin Griffin',
                deliverables: ['Cycle 1 report', 'Key aims for Cycle 2']
            },
            
            // Cycle 2 Activities
            {
                id: 'eact-11',
                name: 'Questionnaire Completion (Cycle 2)',
                phase: 'implementation',
                startDate: '2026-01-05',
                endDate: '2026-01-31',
                status: 'upcoming',
                progress: 0,
                description: 'Second round questionnaire for progress tracking',
                deliverables: ['Updated student data', 'Progress analysis']
            },
            {
                id: 'eact-12',
                name: 'CPD: Strategic Intervention',
                phase: 'implementation',
                startDate: '2026-01-15',
                endDate: '2026-01-15',
                status: 'upcoming',
                progress: 0,
                description: 'Follow up coaching conversations - developing learning behaviours',
                deliverables: ['Intervention strategies', 'Recording']
            },
            {
                id: 'eact-13',
                name: 'CPD: Building Student Aspiration',
                phase: 'implementation',
                startDate: '2026-02-26',
                endDate: '2026-02-26',
                status: 'upcoming',
                progress: 0,
                description: 'Staff CPD Webinar 15:45-16:45',
                deliverables: ['Aspiration building resources', 'Recording']
            },
            {
                id: 'eact-14',
                name: 'Student Check-ins (Cycle 2)',
                phase: 'implementation',
                startDate: '2026-02-01',
                endDate: '2026-03-31',
                status: 'upcoming',
                progress: 0,
                description: 'Lighter touch - Review and reset study goals',
                deliverables: ['Updated goals', 'Progress reports']
            },
            {
                id: 'eact-15',
                name: 'Cycle 2 Milestone Activities',
                phase: 'implementation',
                startDate: '2026-01-05',
                endDate: '2026-04-10',
                status: 'upcoming',
                progress: 0,
                description: 'A Question of Money, Have/Ought/Want to, Worst Case Scenarios, Cog P vs Cog A, Teach your imaginary Class',
                vespaDeliverables: ['Activity resources', 'Implementation guides'],
                schoolDeliverables: ['Complete milestone activities with students', 'Track engagement', 'Submit activity data']
            },
            {
                id: 'eact-16',
                name: 'Cycle 2 Round Up and Data Analysis',
                phase: 'review',
                startDate: '2026-04-06',
                endDate: '2026-04-10',
                status: 'upcoming',
                progress: 0,
                description: 'Focus on exam pinch points and targeted support',
                deliverables: ['Cycle 2 report', 'Targeted intervention plan']
            },
            
            // Cycle 3 Activities
            {
                id: 'eact-17',
                name: 'Questionnaire Completion (Cycle 3)',
                phase: 'implementation',
                startDate: '2026-04-20',
                endDate: '2026-05-08',
                status: 'upcoming',
                progress: 0,
                description: 'Final questionnaire round',
                deliverables: ['Final data set', 'Year comparison']
            },
            {
                id: 'eact-18',
                name: 'CPD: Evidence Based Revision Strategies',
                phase: 'implementation',
                startDate: '2026-04-23',
                endDate: '2026-04-23',
                status: 'upcoming',
                progress: 0,
                description: 'Led by Martin Griffin / Tony Dennis',
                deliverables: ['Revision resources', 'Recording']
            },
            {
                id: 'eact-19',
                name: 'CPD: Project Wrap Up',
                phase: 'delivery',
                startDate: '2026-06-25',
                endDate: '2026-06-25',
                status: 'upcoming',
                progress: 0,
                description: 'Data Review, Key Metrics, Feedback (WWW-EBI)',
                deliverables: ['Final report', 'Next year planning']
            },
            {
                id: 'eact-20',
                name: 'Revision Support Sessions',
                phase: 'implementation',
                startDate: '2026-05-11',
                endDate: '2026-06-30',
                status: 'upcoming',
                progress: 0,
                description: 'Focus on Revision (Yr13) / Next Year Goals (Yr12)',
                vespaDeliverables: ['Revision strategy resources', 'Goal setting templates'],
                schoolDeliverables: ['Deliver revision support sessions', 'Help students create revision plans', 'Facilitate goal setting']
            },
            {
                id: 'eact-21',
                name: 'Final Project Analysis',
                phase: 'delivery',
                startDate: '2026-07-01',
                endDate: '2026-07-15',
                status: 'upcoming',
                progress: 0,
                description: 'Complete project wrap up and planning for next academic year',
                deliverables: ['Annual report', 'Recommendations', 'Next year timeline']
            }
        ];
    }
    
    // ===== Event Listeners =====
    setupEventListeners() {
        // View Toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });
        
        // Milestone Modal (only in admin view)
        const addMilestoneBtn = document.getElementById('addMilestone');
        if (addMilestoneBtn) {
            addMilestoneBtn.addEventListener('click', () => this.openMilestoneModal());
        }
        
        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeMilestoneModal());
        }
        
        const cancelModalBtn = document.getElementById('cancelModal');
        if (cancelModalBtn) {
            cancelModalBtn.addEventListener('click', () => this.closeMilestoneModal());
        }
        
        const milestoneForm = document.getElementById('milestoneForm');
        if (milestoneForm) {
            milestoneForm.addEventListener('submit', (e) => this.saveMilestone(e));
        }
        
        // Progress slider
        const progressSlider = document.getElementById('progress');
        if (progressSlider) {
            progressSlider.addEventListener('input', (e) => {
                document.getElementById('progressValue').textContent = e.target.value + '%';
            });
        }
        
        // Phase dropdown - show/hide VESPA category
        const phaseSelect = document.getElementById('phase');
        if (phaseSelect) {
            phaseSelect.addEventListener('change', (e) => {
                const vespaCategoryGroup = document.getElementById('vespaCategoryGroup');
                if (vespaCategoryGroup) {
                    vespaCategoryGroup.style.display = e.target.value === 'activities' ? 'block' : 'none';
                }
            });
        }
        
        // VESPA category dropdown - update background color
        const vespaCategorySelect = document.getElementById('vespaCategory');
        if (vespaCategorySelect) {
            vespaCategorySelect.addEventListener('change', (e) => {
                const colors = {
                    'VISION': '#ff8f00',
                    'EFFORT': '#86b4f0',
                    'SYSTEMS': '#72cb44',
                    'PRACTICE': '#7f31a4',
                    'ATTITUDE': '#f032e6'
                };
                if (e.target.value && colors[e.target.value]) {
                    e.target.style.backgroundColor = colors[e.target.value] + '20';
                    e.target.style.borderColor = colors[e.target.value];
                } else {
                    e.target.style.backgroundColor = '';
                    e.target.style.borderColor = '';
                }
            });
        }
        
        // Export buttons
        const exportPDFBtn = document.getElementById('exportPDF');
        if (exportPDFBtn) {
            exportPDFBtn.addEventListener('click', () => this.exportPDF());
        }
        
        const exportCSVBtn = document.getElementById('exportCSV');
        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', () => this.exportCSV());
        }
        
        // Zoom controls
        const zoomInBtn = document.getElementById('zoomIn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoom(1.2));
        }
        
        const zoomOutBtn = document.getElementById('zoomOut');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoom(0.8));
        }
        
        const zoomResetBtn = document.getElementById('zoomReset');
        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', () => this.zoomReset());
        }
        
        // Client modal (only in admin view)
        const clientNameBtn = document.getElementById('clientName');
        if (clientNameBtn && !this.isClientView) {
            clientNameBtn.addEventListener('click', () => this.openClientModal());
        }
        
        const closeClientModalBtn = document.getElementById('closeClientModal');
        if (closeClientModalBtn) {
            closeClientModalBtn.addEventListener('click', () => this.closeClientModal());
        }
        
        const createClientBtn = document.getElementById('createClient');
        if (createClientBtn) {
            createClientBtn.addEventListener('click', () => this.createClient());
        }
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                if (document.getElementById('milestoneModal')) {
                    this.closeMilestoneModal();
                }
                if (document.getElementById('clientModal')) {
                    this.closeClientModal();
                }
            }
        });
        
        // Note: School item clicks are now handled in populateSchoolsBar() when items are created dynamically
        
        // Close contact modal
        const closeContactModalBtn = document.getElementById('closeContactModal');
        if (closeContactModalBtn) {
            closeContactModalBtn.addEventListener('click', () => {
                this.closeContactModal();
            });
        }
        
        // Manage schools button (only in admin view)
        const manageSchoolsBtn = document.getElementById('manageSchools');
        if (manageSchoolsBtn) {
            manageSchoolsBtn.addEventListener('click', () => {
                this.openSchoolManagementModal();
            });
        }
    }
    
    // ===== Client Management =====
    loadClients() {
        // Note: This is synchronous for now as it's called in constructor
        // Supabase loading happens later if needed
        const stored = localStorage.getItem('vespaClients');
        return stored ? JSON.parse(stored) : [];
    }
    
    async loadClientsFromSupabase() {
        if (this.useSupabase && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('clients')
                    .select('*');
                
                if (!error && data && data.length > 0) {
                    this.clients = data.map(c => ({
                        id: c.id,
                        name: c.name,
                        project: c.project,
                        createdAt: c.created_at
                    }));
                    
                    // Save to localStorage for offline access
                    localStorage.setItem('vespaClients', JSON.stringify(this.clients));
                    console.log('Clients loaded from Supabase');
                    return true;
                }
            } catch (error) {
                console.error('Error loading clients from Supabase:', error);
            }
        }
        return false;
    }
    
    async saveClients() {
        // Always save to localStorage
        localStorage.setItem('vespaClients', JSON.stringify(this.clients));
        
        // Also save to Supabase if available
        if (this.useSupabase && supabaseClient) {
            try {
                for (const client of this.clients) {
                    const { error } = await supabaseClient
                        .from('clients')
                        .upsert({
                            id: client.id,
                            name: client.name,
                            project: client.project,
                            created_at: client.createdAt
                        });
                    
                    if (error) {
                        console.error('Error saving client to Supabase:', error);
                    }
                }
                console.log('Clients saved to Supabase successfully');
            } catch (error) {
                console.error('Supabase client save error:', error);
            }
        }
    }
    
    checkForClient() {
        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('client');
        
        if (clientId) {
            const client = this.clients.find(c => c.id === clientId);
            if (client) {
                this.selectClient(client);
            }
        } else if (this.clients.length === 0) {
            this.openClientModal();
        }
    }
    
    openClientModal() {
        const modal = document.getElementById('clientModal');
        const clientList = document.getElementById('clientList');
        
        // Clear and populate client list
        clientList.innerHTML = '';
        this.clients.forEach(client => {
            const item = document.createElement('div');
            item.className = 'client-item';
            item.innerHTML = `
                <strong>${client.name}</strong><br>
                <small>${client.project}</small>
            `;
            item.addEventListener('click', () => {
                this.selectClient(client);
                this.closeClientModal();
            });
            clientList.appendChild(item);
        });
        
        modal.classList.add('active');
    }
    
    closeClientModal() {
        const modal = document.getElementById('clientModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    openEditClientModal(client) {
        // Create edit modal if it doesn't exist
        let modal = document.getElementById('editClientModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'editClientModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Edit Client Details</h3>
                        <button class="close-btn" onclick="app.closeEditClientModal()">&times;</button>
                    </div>
                    <div class="form-group">
                        <label>Client Name:</label>
                        <input type="text" id="editClientName" placeholder="Client name">
                    </div>
                    <div class="form-group">
                        <label>Project Name:</label>
                        <input type="text" id="editProjectName" placeholder="Project name">
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="app.saveClientEdits()">Save Changes</button>
                        <button class="btn btn-secondary" onclick="app.closeEditClientModal()">Cancel</button>
                        <button class="btn btn-danger" onclick="app.deleteClient()" style="margin-left: auto;">Delete Client</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // Populate with current values
        document.getElementById('editClientName').value = client.name;
        document.getElementById('editProjectName').value = client.project;
        modal.classList.add('active');
    }
    
    closeEditClientModal() {
        const modal = document.getElementById('editClientModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    async saveClientEdits() {
        const newName = document.getElementById('editClientName').value.trim();
        const newProject = document.getElementById('editProjectName').value.trim();
        
        if (newName && newProject && this.currentClient) {
            // Update client
            this.currentClient.name = newName;
            this.currentClient.project = newProject;
            
            // Save to storage
            await this.saveClients();
            
            // Update display
            await this.selectClient(this.currentClient);
            
            // Close modal
            this.closeEditClientModal();
        }
    }
    
    async deleteClient() {
        if (confirm(`Are you sure you want to delete "${this.currentClient.name}"? This will also delete all timeline data for this client.`)) {
            // Remove client from array
            this.clients = this.clients.filter(c => c.id !== this.currentClient.id);
            await this.saveClients();
            
            // Clear timeline data for this client
            localStorage.removeItem(`vespaTimeline_${this.currentClient.id}`);
            
            // Delete from Supabase if connected
            if (this.useSupabase && supabaseClient) {
                try {
                    await supabaseClient
                        .from('clients')
                        .delete()
                        .eq('id', this.currentClient.id);
                    
                    await supabaseClient
                        .from('milestones')
                        .delete()
                        .eq('client_id', this.currentClient.id);
                } catch (error) {
                    console.error('Error deleting from Supabase:', error);
                }
            }
            
            // Reset view
            this.currentClient = null;
            this.milestones = [];
            location.reload(); // Reload to reset everything
        }
    }
    
    async createClient() {
        const name = document.getElementById('newClientName').value.trim();
        const project = document.getElementById('newProjectName').value.trim();
        
        if (name && project) {
            const client = {
                id: 'client-' + Date.now(),
                name: name,
                project: project,
                createdAt: new Date().toISOString()
            };
            
            this.clients.push(client);
            await this.saveClients();
            await this.selectClient(client);
            this.closeClientModal();
            
            // Clear form
            document.getElementById('newClientName').value = '';
            document.getElementById('newProjectName').value = '';
        }
    }
    
    async selectClient(client) {
        this.currentClient = client;
        document.getElementById('clientName').innerHTML = `${client.name} <i class="fas fa-edit edit-icon" style="font-size: 14px; margin-left: 8px; cursor: pointer;" title="Edit client details"></i>`;
        document.getElementById('projectDates').textContent = client.project;
        
        // Add edit functionality to the edit icon
        const editIcon = document.querySelector('#clientName .fa-edit');
        if (editIcon) {
            editIcon.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening the client modal
                this.openEditClientModal(client);
            });
        }
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('client', client.id);
        window.history.pushState({}, '', url);
        
        // Show schools bar if E-ACT client
        const schoolsBar = document.getElementById('schoolsBar');
        if (schoolsBar) {
            if (client.name === 'E-ACT') {
                schoolsBar.style.display = 'block';
                this.populateSchoolsBar(); // Populate the schools
                
                // Show matrix view button
                const matrixBtn = document.getElementById('matrixViewBtn');
                if (matrixBtn) {
                    matrixBtn.style.display = 'inline-block';
                }
            } else {
                schoolsBar.style.display = 'none';
                
                // Hide matrix view button
                const matrixBtn = document.getElementById('matrixViewBtn');
                if (matrixBtn) {
                    matrixBtn.style.display = 'none';
                }
            }
        }
        
        // Load milestones
        await this.loadMilestones();
    }
    
    // ===== Milestone Management =====
    async loadMilestones() {
        if (!this.currentClient) return;
        
        // Try to load from Supabase first
        if (this.useSupabase && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('milestones')
                    .select('*')
                    .eq('client_id', this.currentClient.id)
                    .order('start_date', { ascending: true });
                
                if (!error && data) {
                    // Convert Supabase data format to app format
                    this.milestones = data.map(m => ({
                        id: m.id,
                        name: m.name,
                        phase: m.phase,
                        startDate: m.start_date,
                        endDate: m.end_date,
                        status: m.status,
                        progress: m.progress,
                        description: m.description,
                        vespaDeliverables: m.vespa_deliverables || [],
                        schoolDeliverables: m.school_deliverables || [],
                        vespaCategory: m.vespa_category || null,
                        attachments: m.attachments || []
                    }));
                    console.log('Milestones loaded from Supabase');
                    
                    // Also save to localStorage for offline access
                    localStorage.setItem('milestones-' + this.currentClient.id, JSON.stringify(this.milestones));
                } else {
                    throw new Error(error ? error.message : 'No data from Supabase');
                }
            } catch (error) {
                console.error('Error loading from Supabase, falling back to localStorage:', error);
                // Fall back to localStorage
                const stored = localStorage.getItem('milestones-' + this.currentClient.id);
                this.milestones = stored ? JSON.parse(stored) : [];
            }
        } else {
            // Load from localStorage only
            const stored = localStorage.getItem('milestones-' + this.currentClient.id);
            this.milestones = stored ? JSON.parse(stored) : [];
        }
        
        this.loadSchoolProgress();
        this.renderCurrentView();
        this.updateProgressStats();
        this.updateSchoolProgressBars();
    }
    
    async saveMilestones() {
        if (!this.currentClient) return;
        
        // Always save to localStorage
        localStorage.setItem('milestones-' + this.currentClient.id, JSON.stringify(this.milestones));
        
        // Also save to Supabase if available
        if (this.useSupabase && supabaseClient) {
            try {
                // Delete existing milestones for this client
                await supabaseClient
                    .from('milestones')
                    .delete()
                    .eq('client_id', this.currentClient.id);
                
                // Insert all milestones
                if (this.milestones.length > 0) {
                    const supabaseMilestones = this.milestones.map(m => ({
                        id: m.id,
                        client_id: this.currentClient.id,
                        name: m.name,
                        phase: m.phase,
                        start_date: m.startDate,
                        end_date: m.endDate,
                        status: m.status,
                        progress: m.progress,
                        description: m.description,
                        vespa_deliverables: m.vespaDeliverables || [],
                        school_deliverables: m.schoolDeliverables || [],
                        vespa_category: m.vespaCategory || null,
                        attachments: m.attachments || []
                    }));
                    
                    const { error } = await supabaseClient
                        .from('milestones')
                        .insert(supabaseMilestones);
                    
                    if (error) {
                        console.error('Error saving to Supabase:', error);
                    } else {
                        console.log('Milestones saved to Supabase successfully');
                    }
                }
            } catch (error) {
                console.error('Supabase save error:', error);
            }
        }
    }
    
    getDateString(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }
    
    openMilestoneModal(milestone = null) {
        this.editingMilestone = milestone;
        const modal = document.getElementById('milestoneModal');
        const form = document.getElementById('milestoneForm');
        
        if (milestone) {
            document.getElementById('modalTitle').textContent = 'Edit Milestone';
            document.getElementById('milestoneName').value = milestone.name;
            document.getElementById('startDate').value = milestone.startDate;
            document.getElementById('endDate').value = milestone.endDate;
            document.getElementById('phase').value = milestone.phase;
            document.getElementById('status').value = milestone.status;
            document.getElementById('progress').value = milestone.progress;
            document.getElementById('progressValue').textContent = milestone.progress + '%';
            document.getElementById('description').value = milestone.description || '';
            // Handle legacy deliverables field and new separated fields
        if (milestone.vespaDeliverables || milestone.schoolDeliverables) {
            document.getElementById('vespaDeliverables').value = (milestone.vespaDeliverables || []).join(', ');
            document.getElementById('schoolDeliverables').value = (milestone.schoolDeliverables || []).join(', ');
        } else {
            // Legacy support - put all in VESPA deliverables
            document.getElementById('vespaDeliverables').value = (milestone.deliverables || []).join(', ');
            document.getElementById('schoolDeliverables').value = '';
        }
        
        // Handle VESPA category
        const vespaCategoryGroup = document.getElementById('vespaCategoryGroup');
        const vespaCategorySelect = document.getElementById('vespaCategory');
        if (vespaCategoryGroup && vespaCategorySelect) {
            if (milestone.phase === 'activities') {
                vespaCategoryGroup.style.display = 'block';
                vespaCategorySelect.value = milestone.vespaCategory || '';
                
                // Update dropdown background color
                const colors = {
                    'VISION': '#ff8f00',
                    'EFFORT': '#86b4f0',
                    'SYSTEMS': '#72cb44',
                    'PRACTICE': '#7f31a4',
                    'ATTITUDE': '#f032e6'
                };
                if (milestone.vespaCategory && colors[milestone.vespaCategory]) {
                    vespaCategorySelect.style.backgroundColor = colors[milestone.vespaCategory] + '20';
                    vespaCategorySelect.style.borderColor = colors[milestone.vespaCategory];
                } else {
                    vespaCategorySelect.style.backgroundColor = '';
                    vespaCategorySelect.style.borderColor = '';
                }
            } else {
                vespaCategoryGroup.style.display = 'none';
            }
        }
        
        // Handle attachments
        const attachmentsField = document.getElementById('attachments');
        if (attachmentsField) {
            attachmentsField.value = (milestone.attachments || []).join('\n');
        }
        } else {
            document.getElementById('modalTitle').textContent = 'Add New Milestone';
            form.reset();
            document.getElementById('progressValue').textContent = '0%';
            
            // Hide VESPA category by default for new milestones
            const vespaCategoryGroup = document.getElementById('vespaCategoryGroup');
            const vespaCategorySelect = document.getElementById('vespaCategory');
            if (vespaCategoryGroup) {
                vespaCategoryGroup.style.display = 'none';
            }
            if (vespaCategorySelect) {
                vespaCategorySelect.style.backgroundColor = '';
                vespaCategorySelect.style.borderColor = '';
            }
        }
        
        modal.classList.add('active');
    }
    
    closeMilestoneModal() {
        const modal = document.getElementById('milestoneModal');
        if (modal) {
            modal.classList.remove('active');
        }
        const form = document.getElementById('milestoneForm');
        if (form) {
            form.reset();
        }
        this.editingMilestone = null;
    }
    
    async saveMilestone(e) {
        e.preventDefault();
        
        const phase = document.getElementById('phase').value;
        const formData = {
            name: document.getElementById('milestoneName').value,
            phase: phase,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            status: document.getElementById('status').value,
            progress: parseInt(document.getElementById('progress').value),
            description: document.getElementById('description').value,
            vespaDeliverables: document.getElementById('vespaDeliverables').value
                .split(',')
                .map(d => d.trim())
                .filter(d => d),
            schoolDeliverables: document.getElementById('schoolDeliverables').value
                .split(',')
                .map(d => d.trim())
                .filter(d => d)
        };
        
        // Add VESPA category if it's an activity
        if (phase === 'activities') {
            const vespaCategory = document.getElementById('vespaCategory').value;
            if (vespaCategory) {
                formData.vespaCategory = vespaCategory;
            }
        }
        
        // Add attachments
        const attachmentsText = document.getElementById('attachments').value.trim();
        if (attachmentsText) {
            formData.attachments = attachmentsText.split('\n')
                .map(line => line.trim())
                .filter(line => line);
        } else {
            formData.attachments = [];
        }
        
        if (this.editingMilestone) {
            // Update existing milestone
            const index = this.milestones.findIndex(m => m.id === this.editingMilestone.id);
            this.milestones[index] = { ...this.editingMilestone, ...formData };
        } else {
            // Create new milestone
            this.milestones.push({
                id: 'milestone-' + Date.now(),
                ...formData
            });
        }
        
        await this.saveMilestones();
        this.renderCurrentView();
        this.updateProgressStats();
        this.closeMilestoneModal();
    }
    
    async deleteMilestone(id) {
        if (confirm('Are you sure you want to delete this milestone?')) {
            this.milestones = this.milestones.filter(m => m.id !== id);
            await this.saveMilestones();
            this.renderCurrentView();
            this.updateProgressStats();
        }
    }
    
    // ===== View Management =====
    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update view visibility
        document.querySelectorAll('.timeline-view, .gantt-view, .list-view, .matrix-view').forEach(v => {
            v.classList.remove('active');
        });
        
        document.getElementById(view + 'View').classList.add('active');
        this.renderCurrentView();
    }
    
    filterBySchool() {
        document.querySelectorAll('.school-item').forEach(item => {
            const itemSchool = item.dataset.school;
            if (this.selectedSchool === 'all') {
                item.classList.toggle('inactive', false);
                item.classList.toggle('active', itemSchool === 'all');
            } else {
                item.classList.toggle('inactive', itemSchool !== this.selectedSchool && itemSchool !== 'all');
                item.classList.toggle('active', itemSchool === this.selectedSchool);
            }
        });
    }
    
    renderCurrentView() {
        switch (this.currentView) {
            case 'timeline':
                this.renderTimelineView();
                break;
            case 'gantt':
                this.renderGanttView();
                break;
            case 'list':
                this.renderListView();
                break;
            case 'matrix':
                this.renderMatrixView();
                break;
        }
    }
    
    // ===== Timeline View =====
    renderTimelineView() {
        const monthsHeader = document.getElementById('monthsHeader');
        const timelineContent = document.getElementById('timelineContent');
        
        // Clear existing content
        monthsHeader.innerHTML = '';
        timelineContent.innerHTML = '';
        
        if (this.milestones.length === 0) return;
        
        // Fixed date range: July 14, 2025 to July 31, 2026 (54 weeks total)
        const minDate = new Date('2025-07-14');  // Start 2 weeks before August 1
        const maxDate = new Date('2026-07-31');
        
        // Calculate dimensions - 54 weeks total (2 pre-weeks + 52 project weeks)
        const totalDays = 378; // 54 weeks * 7 days
        const totalWeeks = 54;
        const containerWidth = timelineContent.offsetWidth || 1200; // fallback width
        const pixelsPerWeek = (containerWidth * this.zoomLevel) / totalWeeks;
        const pixelsPerDay = pixelsPerWeek / 7;
        
        // Create month headers row
        const monthsRow = document.createElement('div');
        monthsRow.className = 'months-row';
        monthsRow.style.display = 'flex';
        monthsRow.style.height = '25px';
        monthsRow.style.borderBottom = '1px solid #ddd';
        monthsRow.style.backgroundColor = '#f5f5f5';
        
        // Calculate months with proper alignment for Jul 2025 - Jul 2026
        const months = [];
        const monthNames = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const monthYears = [2025, 2025, 2025, 2025, 2025, 2025, 2026, 2026, 2026, 2026, 2026, 2026, 2026];
        
        // Calculate week spans for each month
        let weekOffset = 0;
        for (let i = 0; i < monthNames.length; i++) {
            // Map to actual month indices: Jul=6, Aug=7, Sep=8, Oct=9, Nov=10, Dec=11, Jan=0, Feb=1, etc.
            const monthIndex = i === 0 ? 6 : (i < 6 ? i + 6 : i - 6);
            const monthStart = new Date(monthYears[i], monthIndex, 1);
            const monthEnd = new Date(monthYears[i], monthIndex + 1, 0); // Last day of month
            
            // Calculate weeks that overlap with this month
            const daysFromStart = Math.floor((monthStart - minDate) / (1000 * 60 * 60 * 24));
            const daysToEnd = Math.floor((monthEnd - minDate) / (1000 * 60 * 60 * 24));
            const startWeek = Math.floor(daysFromStart / 7);
            const endWeek = Math.ceil((daysToEnd + 1) / 7);
            const weekSpan = endWeek - startWeek;
            
            months.push({
                name: `${monthNames[i]} ${monthYears[i]}`,
                monthOnly: monthNames[i],
                year: monthYears[i],
                weekSpan: weekSpan,
                startWeek: startWeek
            });
        }
        
        // Always create year row
        const yearRow = document.createElement('div');
        yearRow.className = 'year-row';
        yearRow.style.display = 'flex';
        yearRow.style.height = '20px';
        yearRow.style.backgroundColor = '#e9ecef';
        yearRow.style.borderBottom = '1px solid #dee2e6';
        
        // Calculate year spans
        let currentYear = null;
        let yearStart = 0;
        let yearWeeks = 0;
        
        months.forEach((month, index) => {
            if (month.year !== currentYear) {
                if (currentYear !== null) {
                    // Create year header for previous year
                    const yearHeader = document.createElement('div');
                    yearHeader.className = 'year-header';
                    yearHeader.style.width = (yearWeeks * pixelsPerWeek) + 'px';
                    yearHeader.style.textAlign = 'center';
                    yearHeader.style.fontSize = '13px';
                    yearHeader.style.fontWeight = '700';
                    yearHeader.style.color = '#495057';
                    yearHeader.style.borderRight = '2px solid #dee2e6';
                    yearHeader.style.padding = '2px';
                    yearHeader.textContent = currentYear;
                    yearRow.appendChild(yearHeader);
                }
                currentYear = month.year;
                yearStart = month.startWeek;
                yearWeeks = month.weekSpan;
            } else {
                yearWeeks += month.weekSpan;
            }
            
            // Handle last year
            if (index === months.length - 1) {
                const yearHeader = document.createElement('div');
                yearHeader.className = 'year-header';
                yearHeader.style.width = (yearWeeks * pixelsPerWeek) + 'px';
                yearHeader.style.textAlign = 'center';
                yearHeader.style.fontSize = '13px';
                yearHeader.style.fontWeight = '700';
                yearHeader.style.color = '#495057';
                yearHeader.style.padding = '2px';
                yearHeader.textContent = currentYear;
                yearRow.appendChild(yearHeader);
            }
        });
        
        monthsHeader.appendChild(yearRow);
        
        // Create month headers
        months.forEach(month => {
            const header = document.createElement('div');
            header.className = 'month-header';
            header.style.width = (month.weekSpan * pixelsPerWeek) + 'px';
            header.style.textAlign = 'center';
            header.style.fontSize = '12px';
            header.style.fontWeight = '600';
            header.style.padding = '4px';
            header.style.borderRight = '1px solid #ddd';
            // Always show only month (year is in separate row)
            header.textContent = month.monthOnly;
            header.title = month.name; // Show full date on hover
            monthsRow.appendChild(header);
        });
        
        monthsHeader.appendChild(monthsRow);
        
        // Create week markers row
        const weeksRow = document.createElement('div');
        weeksRow.className = 'weeks-row';
        weeksRow.style.display = 'flex';
        weeksRow.style.height = '20px';
        weeksRow.style.borderBottom = '1px solid #e0e0e0';
        weeksRow.style.backgroundColor = '#fafafa';
        weeksRow.style.fontSize = '10px';
        weeksRow.style.color = '#666';
        
        for (let i = 0; i < totalWeeks; i++) {
            const weekDiv = document.createElement('div');
            weekDiv.className = 'week-marker';
            weekDiv.style.width = pixelsPerWeek + 'px';
            weekDiv.style.textAlign = 'center';
            weekDiv.style.borderRight = '1px solid #f0f0f0';
            weekDiv.style.padding = '2px';
            weekDiv.style.cursor = 'help';
            
            const weekStart = new Date(minDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
            const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
            
            // First 2 weeks (July) don't get week numbers
            if (i < 2) {
                weekDiv.textContent = ''; // No week number for pre-project weeks
                weekDiv.style.backgroundColor = '#f9f9f9';
                weekDiv.title = `Pre-project: ${weekStart.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                })} - ${weekEnd.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                })}`;
            } else {
                weekDiv.textContent = 'W' + (i - 1); // Subtract 2 for proper week numbering
                weekDiv.title = `Week ${i - 1}: ${weekStart.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                })} - ${weekEnd.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                })}`;
            }
            
            weeksRow.appendChild(weekDiv);
        }
        
        monthsHeader.appendChild(weeksRow);
        
        // Rest of the timeline rendering code remains the same...
        // Add cycle indicators
        const cycleIndicators = document.createElement('div');
        cycleIndicators.className = 'cycle-indicators';
        
        // Define cycle dates
        const cycles = [
            { name: 'Cycle 1', start: new Date('2025-09-22'), end: new Date('2025-12-19'), class: 'cycle1' },
            { name: 'Cycle 2', start: new Date('2026-01-05'), end: new Date('2026-04-10'), class: 'cycle2' },
            { name: 'Cycle 3', start: new Date('2026-04-20'), end: new Date('2026-07-15'), class: 'cycle3' }
        ];
        
        cycles.forEach(cycle => {
            const startDays = Math.floor((cycle.start - minDate) / (1000 * 60 * 60 * 24));
            const endDays = Math.ceil((cycle.end - minDate) / (1000 * 60 * 60 * 24));
            
            const indicator = document.createElement('div');
            indicator.className = `cycle-indicator ${cycle.class}`;
            indicator.style.left = (startDays * pixelsPerDay) + 'px';
            indicator.style.width = ((endDays - startDays) * pixelsPerDay) + 'px';
            indicator.style.height = '100%';
            
            const label = document.createElement('div');
            label.className = 'cycle-label';
            label.textContent = cycle.name;
            label.title = `${cycle.name}: ${cycle.start.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            })} - ${cycle.end.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            })}`;
            indicator.appendChild(label);
            
            cycleIndicators.appendChild(indicator);
        });
        
        // Insert cycle indicators at the beginning so they appear behind timeline items
        timelineContent.insertBefore(cycleIndicators, timelineContent.firstChild);
        
        // Group milestones by phase - continue with existing code...
        const phases = ['activities', 'planning', 'implementation', 'review', 'delivery'];
        const phaseHeight = 240; // Increased height for each phase section
        const rowHeight = 65; // Increased height for each row within a phase
        const phaseGap = 20; // Gap between phases
        const activitiesHeight = 90; // Increased height for activities section
        
        // Track rows within each phase to prevent overlap
        const phaseTracks = {
            activities: [],
            planning: [],
            implementation: [],
            review: [],
            delivery: []
        };
        
        // Process each phase
        let cumulativeHeight = 35; // Starting position
        
        phases.forEach((phase, phaseIndex) => {
            const phaseMilestones = this.milestones.filter(m => m.phase === phase);
            
            // Sort milestones within phase by start date
            phaseMilestones.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            
            // Determine phase height
            const currentPhaseHeight = phase === 'activities' ? activitiesHeight : phaseHeight;
            
            // Create phase band background
            const phaseBand = document.createElement('div');
            phaseBand.className = `phase-band ${phase}`;
            phaseBand.style.top = cumulativeHeight + 'px';
            phaseBand.style.height = currentPhaseHeight + 'px';
            timelineContent.appendChild(phaseBand);
            
            // Create phase label
            const phaseLabel = document.createElement('div');
            phaseLabel.style.position = 'absolute';
            phaseLabel.style.left = '10px';
            phaseLabel.style.top = (cumulativeHeight + 5) + 'px';
            phaseLabel.style.fontSize = phase === 'activities' ? '12px' : '14px';
            phaseLabel.style.fontWeight = '600';
            phaseLabel.style.color = 'var(--text-secondary)';
            phaseLabel.style.textTransform = 'capitalize';
            phaseLabel.textContent = phase === 'activities' ? 'Suggested VESPA Activities' : phase;
            timelineContent.appendChild(phaseLabel);
            
            // Process milestones in this phase
            phaseMilestones.forEach(milestone => {
                const startDays = Math.ceil((new Date(milestone.startDate) - minDate) / (1000 * 60 * 60 * 24));
                const endDays = Math.ceil((new Date(milestone.endDate) - minDate) / (1000 * 60 * 60 * 24));
                const duration = endDays - startDays;
                const isSingleDate = milestone.startDate === milestone.endDate;
                
                // Find an available row within this phase
                let rowIndex = 0;
                const tracks = phaseTracks[phase];
                
                for (let i = 0; i < tracks.length; i++) {
                    let canUseRow = true;
                    for (const track of tracks[i]) {
                        if (!(endDays <= track.start || startDays >= track.end)) {
                            canUseRow = false;
                            break;
                        }
                    }
                    if (canUseRow) {
                        rowIndex = i;
                        break;
                    }
                }
                
                // Create new row if needed
                if (rowIndex === tracks.length) {
                    tracks.push([]);
                }
                
                // Add to track
                tracks[rowIndex].push({ start: startDays, end: endDays });
                
                // Create timeline item
                const item = document.createElement('div');
                item.className = `timeline-item ${milestone.phase}`;
                item.style.left = (startDays * pixelsPerDay) + 'px';
                item.style.width = isSingleDate ? '140px' : Math.max(duration * pixelsPerDay, 140) + 'px';
                const itemRowHeight = phase === 'activities' ? 35 : 55; // Increased height for progress bars
                item.style.top = (cumulativeHeight + 25 + rowIndex * itemRowHeight) + 'px';
                item.title = `${milestone.name}\n${milestone.status.replace('-', ' ')}\n${new Date(milestone.startDate).toLocaleDateString()} - ${new Date(milestone.endDate).toLocaleDateString()}`;
                
                // Add special styling for single-date events
                if (isSingleDate) {
                    item.classList.add('single-date-event');
                }
                
                // All milestones can have school progress tracking (except activities)
                const isSchoolMilestone = phase !== 'activities';
                
                // Filter by school if selected
                if (this.selectedSchool !== 'all' && isSchoolMilestone) {
                    const schoolStatus = this.getSchoolMilestoneStatus(this.selectedSchool, milestone.id);
                    if (schoolStatus === 'not-started') {
                        item.style.opacity = '0.5';
                    }
                }
                
                let schoolIndicatorsHTML = '';
                if (isSchoolMilestone && this.selectedSchool === 'all') {
                    schoolIndicatorsHTML = '<div class="school-indicators">';
                    this.schools.forEach(school => {
                        const status = this.getSchoolMilestoneStatus(school.id, milestone.id);
                        schoolIndicatorsHTML += `
                            <div class="school-indicator ${status}" 
                                 style="background-image: url('${school.logo}')"
                                 title="${school.name}: ${status.replace('-', ' ')}">
                            </div>
                        `;
                    });
                    schoolIndicatorsHTML += '</div>';
                } else if (isSchoolMilestone && this.selectedSchool !== 'all') {
                    // Show single school status
                    const school = this.schools.find(s => s.id === this.selectedSchool);
                    const status = this.getSchoolMilestoneStatus(this.selectedSchool, milestone.id);
                    schoolIndicatorsHTML = `
                        <div class="school-indicators">
                            <div class="school-indicator ${status}" 
                                 style="background-image: url('${school.logo}')"
                                 title="${school.name}: ${status.replace('-', ' ')}">
                            </div>
                        </div>
                    `;
                }
                
                // Special rendering for activities
                if (phase === 'activities') {
                    // For activities, show only the title and PDF link
                    const pdfLink = milestone.description && milestone.description.includes('.pdf') 
                        ? `<a href="${milestone.description}" target="_blank" class="activity-link"><i class="fas fa-file-pdf"></i></a>`
                        : '';
                    
                    // VESPA category colors
                    const vespaColors = {
                        'VISION': '#ff8f00',
                        'EFFORT': '#86b4f0',
                        'SYSTEMS': '#72cb44',
                        'PRACTICE': '#7f31a4',
                        'ATTITUDE': '#f032e6'
                    };
                    
                    const categoryColor = vespaColors[milestone.vespaCategory] || '#ffc107';
                    
                    // Build attachments for activities
                    let activityAttachments = '';
                    if (milestone.attachments && milestone.attachments.length > 0) {
                        const firstAttachment = milestone.attachments[0];
                        const isURL = firstAttachment.match(/^https?:\/\//i);
                        if (isURL) {
                            activityAttachments = `<a href="${firstAttachment}" target="_blank" class="activity-link" title="${firstAttachment}">
                                <i class="fas fa-paperclip"></i>
                            </a>`;
                        }
                        if (milestone.attachments.length > 1) {
                            activityAttachments += `<span class="more-attachments" style="font-size: 8px; margin-left: 4px;">+${milestone.attachments.length - 1}</span>`;
                        }
                    }
                    
                    item.innerHTML = `
                        <div class="activity-item-content">
                            <span class="vespa-category-badge" style="background-color: ${categoryColor}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: 600; margin-right: 6px;">
                                ${milestone.vespaCategory || 'VESPA'}
                            </span>
                            <span class="activity-title">${milestone.name}</span>
                            ${pdfLink}
                            ${activityAttachments}
                        </div>
                    `;
                    item.className = 'timeline-item activity-item';
                    item.style.borderColor = categoryColor;
                } else {
                    // Build deliverables HTML for regular milestones
                    let deliverablesHTML = '';
                    if (milestone.vespaDeliverables && milestone.vespaDeliverables.length > 0) {
                        deliverablesHTML += '<div class="deliverables-mini"><span class="deliverables-label vespa">VESPA:</span> ' + 
                            milestone.vespaDeliverables.slice(0, 2).join(', ') + 
                            (milestone.vespaDeliverables.length > 2 ? '...' : '') + '</div>';
                    }
                    if (milestone.schoolDeliverables && milestone.schoolDeliverables.length > 0) {
                        deliverablesHTML += '<div class="deliverables-mini"><span class="deliverables-label school">School:</span> ' + 
                            milestone.schoolDeliverables.slice(0, 2).join(', ') + 
                            (milestone.schoolDeliverables.length > 2 ? '...' : '') + '</div>';
                    }
                    // Legacy support for old deliverables field
                    if (!deliverablesHTML && milestone.deliverables && milestone.deliverables.length > 0) {
                        deliverablesHTML = '<div class="deliverables-mini">' + 
                            milestone.deliverables.slice(0, 2).join(', ') + 
                            (milestone.deliverables.length > 2 ? '...' : '') + '</div>';
                    }
                    
                    // Build attachments HTML
                    let attachmentsHTML = '';
                    if (milestone.attachments && milestone.attachments.length > 0) {
                        attachmentsHTML = '<div class="attachments-mini">';
                        milestone.attachments.slice(0, 2).forEach(attachment => {
                            const isURL = attachment.match(/^https?:\/\//i);
                            if (isURL) {
                                const filename = attachment.split('/').pop().split('?')[0] || 'Link';
                                attachmentsHTML += `<a href="${attachment}" target="_blank" class="attachment-link" title="${attachment}">
                                    <i class="fas fa-paperclip"></i> ${filename.length > 20 ? filename.substring(0, 20) + '...' : filename}
                                </a> `;
                            } else {
                                attachmentsHTML += `<span class="attachment-text"><i class="fas fa-file"></i> ${attachment}</span> `;
                            }
                        });
                        if (milestone.attachments.length > 2) {
                            attachmentsHTML += `<span class="more-attachments">+${milestone.attachments.length - 2} more</span>`;
                        }
                        attachmentsHTML += '</div>';
                    }
                    
                    item.innerHTML = `
                        <div class="status-indicator ${milestone.status}" title="${milestone.status.replace('-', ' ')}"></div>
                        <div class="timeline-item-header">
                            <span class="timeline-item-title">${milestone.name}</span>
                        </div>
                        <div class="timeline-item-dates">
                            ${new Date(milestone.startDate).toLocaleDateString()} - ${new Date(milestone.endDate).toLocaleDateString()}
                        </div>
                        <div class="timeline-item-progress">
                            <div class="progress-bar" style="width: ${milestone.progress}%"></div>
                        </div>
                        ${deliverablesHTML}
                        ${attachmentsHTML}
                        ${schoolIndicatorsHTML}
                    `;
                }
                
                if (!this.isClientView) {
                    item.addEventListener('click', () => {
                        this.openMilestoneModal(milestone);
                    });
                }
                
                timelineContent.appendChild(item);
            });
            
            // Update cumulative height for next phase
            cumulativeHeight += currentPhaseHeight + phaseGap;
        });
        
        // Set content height and width based on cumulative height and timeline width
        timelineContent.style.height = (cumulativeHeight + 50) + 'px';
        timelineContent.style.minWidth = (totalWeeks * pixelsPerWeek) + 'px';
        
        // Add vertical pin indicators for single-date events
        const singleDateEvents = this.milestones.filter(m => m.startDate === m.endDate);
        singleDateEvents.forEach(event => {
            const eventDate = new Date(event.startDate);
            const daysSinceStart = Math.ceil((eventDate - minDate) / (1000 * 60 * 60 * 24));
            const xPosition = daysSinceStart * pixelsPerDay;
            
            // Create vertical line indicator
            const pin = document.createElement('div');
            pin.className = 'single-date-pin';
            pin.style.position = 'absolute';
            pin.style.left = xPosition + 'px';
            pin.style.top = '0';
            pin.style.width = '2px';
            pin.style.height = '100%';
            pin.style.backgroundColor = event.phase === 'delivery' ? '#9c27b0' : '#ff9800';
            pin.style.opacity = '0.3';
            pin.style.pointerEvents = 'none';
            pin.style.zIndex = '1';
            
            timelineContent.appendChild(pin);
        });
        
        // Add current date indicator
        this.addCurrentDateIndicator(minDate, maxDate, pixelsPerDay);
    }
    
    addCurrentDateIndicator(minDate, maxDate, pixelsPerDay) {
        // Remove existing indicator if any
        const existingIndicator = document.querySelector('.current-date-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        const today = new Date();
        // Only show indicator if today is within the timeline range
        if (today >= minDate && today <= maxDate) {
            const daysSinceStart = Math.ceil((today - minDate) / (1000 * 60 * 60 * 24));
            const position = daysSinceStart * pixelsPerDay;
            
            const indicator = document.createElement('div');
            indicator.className = 'current-date-indicator';
            indicator.style.left = position + 'px';
            
            // Add date label
            const label = document.createElement('div');
            label.className = 'current-date-label';
            label.textContent = 'Today';
            indicator.appendChild(label);
            
            document.getElementById('timelineContent').appendChild(indicator);
        }
    }
    
    // ===== Gantt View =====
    renderGanttView() {
        const ganttContainer = document.getElementById('ganttContainer');
        ganttContainer.innerHTML = '';
        
        if (this.milestones.length === 0) return;
        
        // Filter out activities from Gantt view
        const ganttMilestones = this.milestones.filter(m => m.phase !== 'activities');
        
        // Fixed date range: July 14, 2025 to July 31, 2026 (54 weeks total)
        const minDate = new Date('2025-07-14');  // Start 2 weeks before August 1
        const maxDate = new Date('2026-07-31');
        
        // Create header
        const header = document.createElement('div');
        header.className = 'gantt-header';
        
        // Sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'gantt-sidebar';
        sidebar.innerHTML = '<div style="padding: 8px; font-weight: 600;">Tasks</div>';
        header.appendChild(sidebar);
        
        // Timeline header
        const timelineHeader = document.createElement('div');
        timelineHeader.className = 'gantt-timeline-header';
        
        // Months row
        const monthsRow = document.createElement('div');
        monthsRow.className = 'gantt-months-row';
        
        // Calculate months and weeks
        const months = [];
        const current = new Date(minDate);
        while (current <= maxDate) {
            const weeksInMonth = this.getWeeksInMonth(current.getFullYear(), current.getMonth());
            months.push({
                year: current.getFullYear(),
                month: current.getMonth(),
                name: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                weeks: weeksInMonth
            });
            current.setMonth(current.getMonth() + 1);
        }
        
        // Create month headers
        months.forEach(month => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'gantt-month';
            monthDiv.style.flex = month.weeks;
            monthDiv.textContent = month.name;
            monthsRow.appendChild(monthDiv);
        });
        
        // Weeks row
        const weeksRow = document.createElement('div');
        weeksRow.className = 'gantt-weeks-row';
        
        let weekNumber = 1;
        months.forEach(month => {
            for (let i = 0; i < month.weeks; i++) {
                const weekDiv = document.createElement('div');
                weekDiv.className = 'gantt-week';
                weekDiv.textContent = `W${weekNumber}`;
                weeksRow.appendChild(weekDiv);
                weekNumber++;
            }
        });
        
        timelineHeader.appendChild(monthsRow);
        timelineHeader.appendChild(weeksRow);
        header.appendChild(timelineHeader);
        ganttContainer.appendChild(header);
        
        // Create body
        const body = document.createElement('div');
        body.className = 'gantt-body';
        
        // Tasks column
        const tasks = document.createElement('div');
        tasks.className = 'gantt-tasks';
        
        // Sort milestones by start date
        const sortedMilestones = [...ganttMilestones].sort((a, b) => 
            new Date(a.startDate) - new Date(b.startDate)
        );
        
        sortedMilestones.forEach((milestone, index) => {
            const taskRow = document.createElement('div');
            taskRow.className = 'gantt-task-row';
            taskRow.textContent = milestone.name;
            taskRow.title = milestone.name;
            tasks.appendChild(taskRow);
        });
        
        body.appendChild(tasks);
        
        // Bars area
        const barsArea = document.createElement('div');
        barsArea.className = 'gantt-bars';
        
        // Add grid
        const grid = document.createElement('div');
        grid.className = 'gantt-grid';
        
        const totalWeeks = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24 * 7));
        for (let i = 0; i < totalWeeks; i++) {
            const gridColumn = document.createElement('div');
            gridColumn.className = 'gantt-grid-column';
            if (i % 4 === 0) gridColumn.classList.add('week-start');
            grid.appendChild(gridColumn);
        }
        barsArea.appendChild(grid);
        
        // Add cycle backgrounds
        const cycles = [
            { name: 'Cycle 1', start: new Date('2025-09-22'), end: new Date('2025-12-19'), class: 'cycle1' },
            { name: 'Cycle 2', start: new Date('2026-01-05'), end: new Date('2026-04-10'), class: 'cycle2' },
            { name: 'Cycle 3', start: new Date('2026-04-20'), end: new Date('2026-07-15'), class: 'cycle3' }
        ];
        
        const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
        const pixelsPerDay = barsArea.offsetWidth / totalDays || 2;
        
        cycles.forEach(cycle => {
            const startDays = Math.ceil((cycle.start - minDate) / (1000 * 60 * 60 * 24));
            const endDays = Math.ceil((cycle.end - minDate) / (1000 * 60 * 60 * 24));
            
            const cycleDiv = document.createElement('div');
            cycleDiv.className = `cycle-background ${cycle.class}`;
            cycleDiv.style.left = (startDays * pixelsPerDay) + 'px';
            cycleDiv.style.width = ((endDays - startDays) * pixelsPerDay) + 'px';
            barsArea.appendChild(cycleDiv);
        });
        
        // Add milestone bars
        sortedMilestones.forEach((milestone, index) => {
            const startDays = Math.ceil((new Date(milestone.startDate) - minDate) / (1000 * 60 * 60 * 24));
            const endDays = Math.ceil((new Date(milestone.endDate) - minDate) / (1000 * 60 * 60 * 24));
            const duration = endDays - startDays;
            
            const bar = document.createElement('div');
            bar.className = `gantt-bar ${milestone.phase}`;
            bar.style.left = (startDays * pixelsPerDay) + 'px';
            bar.style.width = Math.max(duration * pixelsPerDay, 50) + 'px';
            bar.style.top = (index * 40 + 5) + 'px';
            bar.textContent = milestone.name;
            bar.title = `${milestone.name}\n${new Date(milestone.startDate).toLocaleDateString()} - ${new Date(milestone.endDate).toLocaleDateString()}`;
            
            // Only add click handler if not in client view
            if (!this.isClientView) {
                bar.addEventListener('click', () => this.openMilestoneModal(milestone));
            }
            
            barsArea.appendChild(bar);
        });
        
        body.appendChild(barsArea);
        ganttContainer.appendChild(body);
        
        // Set height
        body.style.height = (sortedMilestones.length * 40 + 20) + 'px';
    }
    
    getWeeksInMonth(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstWeekDay = firstDay.getDay();
        const lastWeekDay = lastDay.getDay();
        
        // Calculate weeks (rough approximation)
        return Math.ceil((daysInMonth + firstWeekDay) / 7);
    }
    
    // ===== List View =====
    renderListView() {
        const tbody = document.getElementById('milestoneTableBody');
        tbody.innerHTML = '';
        
        // Filter out activities from list view
        const listMilestones = this.milestones.filter(m => m.phase !== 'activities');
        
        listMilestones.forEach(milestone => {
            const row = document.createElement('tr');
            
            // Different content for client view vs admin view
            if (this.isClientView) {
                row.innerHTML = `
                    <td>${milestone.phase}</td>
                    <td>${milestone.name}</td>
                    <td>${new Date(milestone.startDate).toLocaleDateString()}</td>
                    <td>${new Date(milestone.endDate).toLocaleDateString()}</td>
                    <td><span class="timeline-item-status status-${milestone.status}">${milestone.status.replace('-', ' ')}</span></td>
                    <td>
                        <div class="timeline-item-progress" style="width: 100px; display: inline-block;">
                            <div class="progress-bar" style="width: ${milestone.progress}%"></div>
                        </div>
                        ${milestone.progress}%
                    </td>
                `;
            } else {
                row.innerHTML = `
                    <td>${milestone.phase}</td>
                    <td>${milestone.name}</td>
                    <td>${new Date(milestone.startDate).toLocaleDateString()}</td>
                    <td>${new Date(milestone.endDate).toLocaleDateString()}</td>
                    <td><span class="timeline-item-status status-${milestone.status}">${milestone.status.replace('-', ' ')}</span></td>
                    <td>
                        <div class="timeline-item-progress" style="width: 100px; display: inline-block;">
                            <div class="progress-bar" style="width: ${milestone.progress}%"></div>
                        </div>
                        ${milestone.progress}%
                    </td>
                    <td>
                        <button class="action-btn" onclick="app.openMilestoneModal(app.milestones.find(m => m.id === '${milestone.id}'))">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn" onclick="app.deleteMilestone('${milestone.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
            }
            tbody.appendChild(row);
        });
    }
    
    // ===== Matrix View =====
    renderMatrixView() {
        const container = document.getElementById('matrixContainer');
        container.innerHTML = '';
        
        // Initialize school progress if not exists
        if (Object.keys(this.schoolProgress).length === 0) {
            this.initializeSchoolProgress();
        }
        
        // Create table
        const table = document.createElement('table');
        table.className = 'matrix-table';
        
        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Milestone</th>';
        
        // Add school headers
        this.schools.forEach(school => {
            const th = document.createElement('th');
            th.innerHTML = `
                <div class="school-header">
                    <img src="${school.logo}" alt="${school.name}">
                    <span>${school.name}</span>
                </div>
            `;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create body
        const tbody = document.createElement('tbody');
        
        // Get all milestones except activities for school tracking
        const keyMilestones = this.milestones
            .filter(m => m.phase !== 'activities')
            .map(m => ({ id: m.id, name: m.name }));
        
        keyMilestones.forEach(milestone => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${milestone.name}</td>`;
            
            this.schools.forEach(school => {
                const td = document.createElement('td');
                const status = this.getSchoolMilestoneStatus(school.id, milestone.id);
                
                td.innerHTML = `
                    <div class="matrix-cell" data-school="${school.id}" data-milestone="${milestone.id}">
                        <div class="school-status ${status}" title="${status.replace('-', ' ')}">
                            ${this.getStatusIcon(status)}
                        </div>
                    </div>
                `;
                
                td.querySelector('.matrix-cell').addEventListener('click', () => {
                    this.updateSchoolMilestoneStatus(school.id, milestone.id);
                });
                
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);
        
        // Update school progress bars
        this.updateSchoolProgressBars();
    }
    
    initializeSchoolProgress() {
        // Get all milestone IDs except activities
        const milestoneIds = this.milestones
            .filter(m => m.phase !== 'activities')
            .map(m => m.id);
        
        this.schools.forEach(school => {
            if (!this.schoolProgress[school.id]) {
                this.schoolProgress[school.id] = {};
            }
            milestoneIds.forEach(id => {
                // Initialize only if not already set
                if (!this.schoolProgress[school.id][id]) {
                    this.schoolProgress[school.id][id] = 'not-started';
                }
            });
        });
        
        this.saveSchoolProgress();
    }
    
    getSchoolMilestoneStatus(schoolId, milestoneId) {
        return this.schoolProgress[schoolId]?.[milestoneId] || 'not-started';
    }
    
    updateSchoolMilestoneStatus(schoolId, milestoneId) {
        const currentStatus = this.getSchoolMilestoneStatus(schoolId, milestoneId);
        const statuses = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statuses.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        
        this.schoolProgress[schoolId][milestoneId] = statuses[nextIndex];
        this.saveSchoolProgress();
        this.renderMatrixView();
    }
    
    getStatusIcon(status) {
        switch (status) {
            case 'completed': return '✓';
            case 'in-progress': return '◐';
            case 'not-started': return '○';
            default: return '?';
        }
    }
    
    saveSchoolProgress() {
        if (this.currentClient) {
            localStorage.setItem('schoolProgress-' + this.currentClient.id, JSON.stringify(this.schoolProgress));
        }
    }
    
    loadSchoolProgress() {
        if (this.currentClient) {
            const stored = localStorage.getItem('schoolProgress-' + this.currentClient.id);
            this.schoolProgress = stored ? JSON.parse(stored) : {};
        }
    }
    
    updateSchoolProgressBars() {
        this.schools.forEach(school => {
            // Get all non-activity milestones
            const milestones = this.milestones
                .filter(m => m.phase !== 'activities')
                .map(m => m.id);
            const completed = milestones.filter(m => this.getSchoolMilestoneStatus(school.id, m) === 'completed').length;
            const progress = milestones.length > 0 ? (completed / milestones.length) * 100 : 0;
            
            const progressBar = document.querySelector(`[data-school="${school.id}"] .school-progress-bar`);
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        });
    }
    
    // ===== Progress Stats =====
    updateProgressStats() {
        const completed = this.milestones.filter(m => m.status === 'completed').length;
        const inProgress = this.milestones.filter(m => m.status === 'in-progress').length;
        const upcoming = this.milestones.filter(m => m.status === 'upcoming').length;
        
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('inProgressCount').textContent = inProgress;
        document.getElementById('upcomingCount').textContent = upcoming;
    }
    
    // ===== Zoom Functions =====
    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel));
        if (this.currentView === 'timeline') {
            this.renderTimelineView();
        }
    }
    
    zoomReset() {
        this.zoomLevel = 1;
        if (this.currentView === 'timeline') {
            this.renderTimelineView();
        }
    }
    
    // ===== Export Functions =====
    async exportPDF() {
        if (!this.currentClient) {
            alert('Please select a client first');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Add header
        pdf.setFontSize(20);
        pdf.text(`Client Timeline: ${this.currentClient.name}`, 20, 20);
        pdf.setFontSize(14);
        pdf.text(this.currentClient.project, 20, 30);
        
        // Add summary
        pdf.setFontSize(12);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
        
        const completed = this.milestones.filter(m => m.status === 'completed').length;
        const total = this.milestones.length;
        pdf.text(`Progress: ${completed}/${total} milestones completed`, 20, 50);
        
        // Add milestones table
        let y = 70;
        pdf.setFontSize(10);
        pdf.text('Phase', 20, y);
        pdf.text('Milestone', 50, y);
        pdf.text('Start Date', 110, y);
        pdf.text('End Date', 140, y);
        pdf.text('Status', 170, y);
        
        y += 10;
        pdf.line(20, y-5, 190, y-5);
        
        this.milestones.forEach(milestone => {
            if (y > 270) {
                pdf.addPage();
                y = 20;
            }
            
            pdf.text(milestone.phase, 20, y);
            pdf.text(milestone.name.substring(0, 30), 50, y);
            pdf.text(new Date(milestone.startDate).toLocaleDateString(), 110, y);
            pdf.text(new Date(milestone.endDate).toLocaleDateString(), 140, y);
            pdf.text(milestone.status, 170, y);
            y += 8;
        });
        
        // Save PDF
        pdf.save(`${this.currentClient.name.replace(/\s+/g, '-')}-timeline.pdf`);
    }
    
    exportCSV() {
        if (!this.currentClient) {
            alert('Please select a client first');
            return;
        }
        
        // Create CSV content
        const headers = ['Phase', 'Milestone', 'Start Date', 'End Date', 'Status', 'Progress', 'Description', 'VESPA Category', 'Attachments', 'VESPA Deliverables', 'School Deliverables'];
        const rows = this.milestones.map(m => [
            m.phase,
            m.name,
            m.startDate,
            m.endDate,
            m.status,
            m.progress + '%',
            m.description || '',
            m.vespaCategory || '',
            (m.attachments || []).join('; '),
            (m.vespaDeliverables || m.deliverables || []).join('; '),
            (m.schoolDeliverables || []).join('; ')
        ]);
        
        // Convert to CSV format
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentClient.name.replace(/\s+/g, '-')}-timeline.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // ===== School Contact Modal =====
    showSchoolContacts(schoolId) {
        const school = this.schools.find(s => s.id === schoolId);
        if (!school) return;
        
        // Check if modal elements exist
        const titleElement = document.getElementById('schoolContactTitle');
        const nameElement = document.getElementById('schoolContactName');
        const logoElement = document.getElementById('schoolContactLogo');
        const contactsList = document.getElementById('contactsList');
        const modal = document.getElementById('schoolContactModal');
        
        if (!titleElement || !nameElement || !logoElement || !contactsList || !modal) {
            console.warn('School contact modal elements not found');
            return;
        }
        
        // Update modal content
        titleElement.textContent = school.name + ' Contacts';
        nameElement.textContent = school.name;
        logoElement.src = school.logo;
        
        // Build contacts HTML
        contactsList.innerHTML = '';
        
        Object.entries(school.contacts).forEach(([role, contact]) => {
            const contactDiv = document.createElement('div');
            contactDiv.className = 'contact-item';
            contactDiv.innerHTML = `
                <div class="contact-role">${role}</div>
                <div class="contact-name">${contact.name}</div>
                <div class="contact-email">
                    <a href="mailto:${contact.email}">${contact.email}</a>
                </div>
            `;
            contactsList.appendChild(contactDiv);
        });
        
        // Show modal
        modal.classList.add('active');
    }
    
    closeContactModal() {
        const modal = document.getElementById('schoolContactModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    // ===== School Management Modal =====
    openSchoolManagementModal() {
        const content = document.getElementById('schoolManagementContent');
        const modal = document.getElementById('schoolManagementModal');
        
        if (!content || !modal) {
            console.warn('School management modal elements not found');
            return;
        }
        
        content.innerHTML = '';
        
        // Create a form for each school
        this.schools.forEach(school => {
            // Ensure school has contacts object
            if (!school.contacts) {
                school.contacts = {
                    'Head of 6th Form': { name: '', email: '' },
                    'Headteacher': { name: '', email: '' }
                };
            }
            
            // Ensure each contact role exists
            if (!school.contacts['Head of 6th Form']) {
                school.contacts['Head of 6th Form'] = { name: '', email: '' };
            }
            if (!school.contacts['Headteacher']) {
                school.contacts['Headteacher'] = { name: '', email: '' };
            }
            
            const schoolDiv = document.createElement('div');
            schoolDiv.className = 'school-edit-section';
            schoolDiv.style.cssText = 'border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px;';
            
            schoolDiv.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <img src="${school.logo}" alt="${school.name}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 15px;">
                    <h4 style="margin: 0;">${school.name}</h4>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1; margin-right: 10px;">
                        <label>Head of 6th Form</label>
                        <input type="text" class="school-contact-name" data-school="${school.id}" data-role="Head of 6th Form" 
                               value="${school.contacts['Head of 6th Form'].name || ''}" placeholder="Name">
                        <input type="email" class="school-contact-email" data-school="${school.id}" data-role="Head of 6th Form" 
                               value="${school.contacts['Head of 6th Form'].email || ''}" placeholder="Email" style="margin-top: 5px;">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Headteacher</label>
                        <input type="text" class="school-contact-name" data-school="${school.id}" data-role="Headteacher" 
                               value="${school.contacts['Headteacher'] ? school.contacts['Headteacher'].name : ''}" placeholder="Name">
                        <input type="email" class="school-contact-email" data-school="${school.id}" data-role="Headteacher" 
                               value="${school.contacts['Headteacher'] ? school.contacts['Headteacher'].email : ''}" placeholder="Email" style="margin-top: 5px;">
                    </div>
                </div>
            `;
            
            content.appendChild(schoolDiv);
        });
        
        // Show modal
        modal.classList.add('active');
    }
    
    closeSchoolManagementModal() {
        const modal = document.getElementById('schoolManagementModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    saveSchoolChanges() {
        // Update all school contacts
        this.schools.forEach(school => {
            // Update Head of 6th Form
            const head6thName = document.querySelector(`.school-contact-name[data-school="${school.id}"][data-role="Head of 6th Form"]`).value;
            const head6thEmail = document.querySelector(`.school-contact-email[data-school="${school.id}"][data-role="Head of 6th Form"]`).value;
            
            // Update Headteacher
            const headName = document.querySelector(`.school-contact-name[data-school="${school.id}"][data-role="Headteacher"]`).value;
            const headEmail = document.querySelector(`.school-contact-email[data-school="${school.id}"][data-role="Headteacher"]`).value;
            
            school.contacts['Head of 6th Form'] = { name: head6thName, email: head6thEmail };
            school.contacts['Headteacher'] = { name: headName, email: headEmail };
        });
        
        // Save to localStorage
        localStorage.setItem('eactSchools', JSON.stringify(this.schools));
        
        // Close modal
        this.closeSchoolManagementModal();
        
        // Show confirmation
        alert('School information updated successfully!');
    }
    
    // ===== School Bar Population =====
    populateSchoolsBar() {
        const schoolsContainer = document.getElementById('schoolsContainer');
        const trustLogo = document.getElementById('trustLogo');
        
        if (!schoolsContainer) return;
        
        // Clear existing content
        schoolsContainer.innerHTML = '';
        
        // Show trust logo for E-ACT
        if (trustLogo) {
            trustLogo.style.display = 'block';
            trustLogo.innerHTML = '<img src="https://tse4.mm.bing.net/th/id/OIP.wCRZNZZat5R5cxhtl5Z2IwHaD7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" alt="E-ACT" title="E-ACT Trust" style="height: 50px;">';
        }
        
        // Add school items
        // First add "All Schools" option
        const allSchoolsItem = document.createElement('div');
        allSchoolsItem.className = 'school-item all-schools';
        allSchoolsItem.dataset.school = 'all';
        allSchoolsItem.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #666;">
                ALL
            </div>
        `;
        allSchoolsItem.title = 'Show all schools';
        
        // Add click handler for all schools
        allSchoolsItem.addEventListener('click', () => {
            this.selectedSchool = 'all';
            this.filterBySchool();
            this.renderCurrentView();
        });
        
        schoolsContainer.appendChild(allSchoolsItem);
        
        // Then add individual schools
        this.schools.forEach(school => {
            const schoolItem = document.createElement('div');
            schoolItem.className = 'school-item';
            schoolItem.dataset.school = school.id;
            schoolItem.innerHTML = `
                <img src="${school.logo}" alt="${school.name}" title="${school.name}">
                <div class="school-progress">
                    <div class="school-progress-bar" data-school="${school.id}" style="width: 0%"></div>
                </div>
                <button class="school-info-btn" data-school="${school.id}" title="Contact Info">
                    <i class="fas fa-info-circle"></i>
                </button>
            `;
            
            // Add click handler to school item
            schoolItem.addEventListener('click', (e) => {
                // Don't trigger if clicking the info button
                if (e.target.closest('.school-info-btn')) return;
                
                const school = schoolItem.dataset.school;
                this.selectedSchool = school;
                this.filterBySchool();
                this.renderCurrentView();
            });
            
            // Add click handler to info button
            const infoBtn = schoolItem.querySelector('.school-info-btn');
            if (infoBtn) {
                infoBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showSchoolContacts(school.id);
                });
            }
            
            schoolsContainer.appendChild(schoolItem);
        });
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', async () => {
    // Try to initialize Supabase when DOM is ready
    initializeSupabase();
    
    app = new TimelineApp();
    await app.init();
}); 