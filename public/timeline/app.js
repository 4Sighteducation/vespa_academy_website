// ===== Timeline Application with E-ACT Project Pre-loaded =====

class TimelineApp {
    constructor() {
        this.clients = this.loadClients();
        this.currentClient = null;
        this.milestones = [];
        this.currentView = 'timeline';
        this.zoomLevel = 1;
        this.editingMilestone = null;
        this.selectedSchool = 'all';
        
        // Check URL parameters for mode
        const urlParams = new URLSearchParams(window.location.search);
        this.mode = urlParams.get('mode') || 'generic';
        this.demoClient = urlParams.get('demo');
        
        // School data - only for E-ACT or multi-entity clients
        this.schools = this.mode === 'eact' || this.demoClient === 'eact' ? [
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
        ] : []; // Empty array for non-E-ACT clients
        
        // School progress data (mock data - would be loaded from storage in real app)
        this.schoolProgress = {};
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        
        // Handle different initialization modes
        if (this.demoClient === 'eact' || this.mode === 'eact') {
            this.loadEACTProject();
            this.showSchoolFeatures();
        } else {
            this.checkForClient();
        }
        
        this.updateProgressStats();
        if (this.schools.length > 0) {
            this.updateSchoolProgressBars();
        }
    }
    
    showSchoolFeatures() {
        // Show school-specific UI elements
        document.getElementById('schoolBar').style.display = 'block';
        document.getElementById('matrixViewBtn').style.display = 'inline-block';
        
        // Update deliverables labels
        document.getElementById('schoolDeliverablesLabel').textContent = 'School Deliverables (comma-separated)';
        
        // Populate school filter and list
        this.populateSchoolUI();
    }
    
    populateSchoolUI() {
        const schoolFilter = document.getElementById('schoolFilter');
        const schoolList = document.getElementById('schoolList');
        
        // Clear existing content
        schoolFilter.innerHTML = '<option value="all">All Schools</option>';
        schoolList.innerHTML = '';
        
        // Add schools to filter and list
        this.schools.forEach(school => {
            // Add to filter dropdown
            const option = document.createElement('option');
            option.value = school.id;
            option.textContent = school.name;
            schoolFilter.appendChild(option);
            
            // Add to school list
            const schoolItem = document.createElement('div');
            schoolItem.className = 'school-item';
            schoolItem.dataset.school = school.id;
            schoolItem.innerHTML = `
                <img src="${school.logo}" alt="${school.name}">
                <span>${school.name}</span>
                <div class="school-progress">
                    <div class="school-progress-bar" data-school="${school.id}"></div>
                </div>
                <button class="school-info-btn" data-school="${school.id}">
                    <i class="fas fa-info-circle"></i>
                </button>
            `;
            schoolList.appendChild(schoolItem);
        });
        
        // Setup event listeners for the newly created school items
        this.setupSchoolItemListeners();
    }
    
    loadEACTProject() {
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
            this.saveClients();
        }
        
        // Select E-ACT client
        this.selectClient(eactClient);
        
        // Load E-ACT milestones
        const stored = localStorage.getItem('milestones-' + eactClient.id);
        if (!stored) {
            // Create E-ACT milestones
            this.milestones = this.getEACTMilestones();
            this.saveMilestones();
        }
    }
    
    getEACTMilestones() {
        return [
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
                schoolDeliverables: ['School attendance', 'Q&A participation']
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
                progress: 0,
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
                progress: 0,
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
        
        // Milestone Modal
        document.getElementById('addMilestone').addEventListener('click', () => this.openMilestoneModal());
        document.getElementById('closeModal').addEventListener('click', () => this.closeMilestoneModal());
        document.getElementById('cancelModal').addEventListener('click', () => this.closeMilestoneModal());
        document.getElementById('milestoneForm').addEventListener('submit', (e) => this.saveMilestone(e));
        
        // Progress slider
        document.getElementById('progress').addEventListener('input', (e) => {
            document.getElementById('progressValue').textContent = e.target.value + '%';
        });
        
        // Export buttons
        document.getElementById('exportPDF').addEventListener('click', () => this.exportPDF());
        document.getElementById('exportCSV').addEventListener('click', () => this.exportCSV());
        
        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.8));
        document.getElementById('zoomReset').addEventListener('click', () => this.zoomReset());
        
        // Client modal
        document.getElementById('clientName').addEventListener('click', () => this.openClientModal());
        document.getElementById('closeClientModal').addEventListener('click', () => this.closeClientModal());
        document.getElementById('createClient').addEventListener('click', () => this.createClient());
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeMilestoneModal();
                this.closeClientModal();
            }
        });
        
        // School-related event listeners (only if schools exist)
        if (document.getElementById('schoolFilter')) {
            document.getElementById('schoolFilter').addEventListener('change', (e) => {
                this.selectedSchool = e.target.value;
                this.filterBySchool();
                this.renderCurrentView();
            });
            
            // Manage schools button
            const manageBtn = document.getElementById('manageSchools');
            if (manageBtn) {
                manageBtn.addEventListener('click', () => {
                    this.openSchoolManagementModal();
                });
            }
        }
        
        // Close contact modal (always add this listener)
        document.getElementById('closeContactModal').addEventListener('click', () => {
            this.closeContactModal();
        });
    }
    
    // Add event listeners for school items after they're created
    setupSchoolItemListeners() {
        // School item clicks
        document.querySelectorAll('.school-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't trigger if clicking the info button
                if (e.target.closest('.school-info-btn')) return;
                
                const school = item.dataset.school;
                document.getElementById('schoolFilter').value = school;
                this.selectedSchool = school;
                this.filterBySchool();
                this.renderCurrentView();
            });
        });
        
        // School info button clicks
        document.querySelectorAll('.school-info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const schoolId = btn.dataset.school;
                this.showSchoolContacts(schoolId);
            });
        });
    }
    
    // ===== Client Management =====
    loadClients() {
        const stored = localStorage.getItem('vespaClients');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveClients() {
        localStorage.setItem('vespaClients', JSON.stringify(this.clients));
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
        document.getElementById('clientModal').classList.remove('active');
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
        document.getElementById('editClientModal').classList.remove('active');
    }
    
    saveClientEdits() {
        const newName = document.getElementById('editClientName').value.trim();
        const newProject = document.getElementById('editProjectName').value.trim();
        
        if (newName && newProject && this.currentClient) {
            // Update client
            this.currentClient.name = newName;
            this.currentClient.project = newProject;
            
            // Save to storage
            this.saveClients();
            
            // Update display
            this.selectClient(this.currentClient);
            
            // Close modal
            this.closeEditClientModal();
        }
    }
    
    deleteClient() {
        if (confirm(`Are you sure you want to delete "${this.currentClient.name}"? This will also delete all timeline data for this client.`)) {
            // Remove client from array
            this.clients = this.clients.filter(c => c.id !== this.currentClient.id);
            this.saveClients();
            
            // Clear timeline data for this client
            localStorage.removeItem(`vespaTimeline_${this.currentClient.id}`);
            
            // Reset view
            this.currentClient = null;
            this.milestones = [];
            location.reload(); // Reload to reset everything
        }
    }
    
    createClient() {
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
            this.saveClients();
            this.selectClient(client);
            this.closeClientModal();
            
            // Clear form
            document.getElementById('newClientName').value = '';
            document.getElementById('newProjectName').value = '';
        }
    }
    
    selectClient(client) {
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
        
        // Load milestones
        this.loadMilestones();
    }
    
    // ===== Milestone Management =====
    loadMilestones() {
        if (!this.currentClient) return;
        
        const stored = localStorage.getItem('milestones-' + this.currentClient.id);
        this.milestones = stored ? JSON.parse(stored) : [];
        this.loadSchoolProgress();
        this.renderCurrentView();
        this.updateProgressStats();
        this.updateSchoolProgressBars();
    }
    
    saveMilestones() {
        if (!this.currentClient) return;
        localStorage.setItem('milestones-' + this.currentClient.id, JSON.stringify(this.milestones));
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
        } else {
            document.getElementById('modalTitle').textContent = 'Add New Milestone';
            form.reset();
            document.getElementById('progressValue').textContent = '0%';
        }
        
        modal.classList.add('active');
    }
    
    closeMilestoneModal() {
        document.getElementById('milestoneModal').classList.remove('active');
        document.getElementById('milestoneForm').reset();
        this.editingMilestone = null;
    }
    
    saveMilestone(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('milestoneName').value,
            phase: document.getElementById('phase').value,
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
        
        this.saveMilestones();
        this.renderCurrentView();
        this.updateProgressStats();
        this.closeMilestoneModal();
    }
    
    deleteMilestone(id) {
        if (confirm('Are you sure you want to delete this milestone?')) {
            this.milestones = this.milestones.filter(m => m.id !== id);
            this.saveMilestones();
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
            if (this.selectedSchool === 'all') {
                item.classList.remove('inactive');
            } else {
                item.classList.toggle('inactive', item.dataset.school !== this.selectedSchool);
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
        
        // Find date range
        const dates = this.milestones.flatMap(m => [new Date(m.startDate), new Date(m.endDate)]);
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        
        // Add padding
        minDate.setMonth(minDate.getMonth() - 1);
        maxDate.setMonth(maxDate.getMonth() + 1);
        
        // Generate month headers with week markers
        const months = [];
        const current = new Date(minDate);
        while (current <= maxDate) {
            months.push({
                year: current.getFullYear(),
                month: current.getMonth(),
                name: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                startDate: new Date(current)
            });
            current.setMonth(current.getMonth() + 1);
        }
        
        // Create month headers
        months.forEach(month => {
            const header = document.createElement('div');
            header.className = 'month-header';
            header.textContent = month.name;
            monthsHeader.appendChild(header);
        });
        
        // Add week markers
        const weekMarkersDiv = document.createElement('div');
        weekMarkersDiv.className = 'week-markers';
        const totalWeeks = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24 * 7));
        for (let i = 0; i < totalWeeks; i++) {
            const marker = document.createElement('div');
            marker.className = 'week-marker';
            weekMarkersDiv.appendChild(marker);
        }
        monthsHeader.appendChild(weekMarkersDiv);
        
        // Add cycle indicators
        const cycleIndicators = document.createElement('div');
        cycleIndicators.className = 'cycle-indicators';
        
        // Define cycle dates
        const cycles = [
            { name: 'Cycle 1', start: new Date('2025-09-22'), end: new Date('2025-12-19'), class: 'cycle1' },
            { name: 'Cycle 2', start: new Date('2026-01-05'), end: new Date('2026-04-10'), class: 'cycle2' },
            { name: 'Cycle 3', start: new Date('2026-04-20'), end: new Date('2026-07-15'), class: 'cycle3' }
        ];
        
        const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
        const pixelsPerDay = (timelineContent.offsetWidth * this.zoomLevel) / totalDays;
        
        cycles.forEach(cycle => {
            const startDays = Math.ceil((cycle.start - minDate) / (1000 * 60 * 60 * 24));
            const endDays = Math.ceil((cycle.end - minDate) / (1000 * 60 * 60 * 24));
            
            const indicator = document.createElement('div');
            indicator.className = `cycle-indicator ${cycle.class}`;
            indicator.style.left = (startDays * pixelsPerDay) + 'px';
            indicator.style.width = ((endDays - startDays) * pixelsPerDay) + 'px';
            
            const label = document.createElement('div');
            label.className = 'cycle-label';
            label.textContent = cycle.name;
            indicator.appendChild(label);
            
            cycleIndicators.appendChild(indicator);
        });
        
        timelineContent.appendChild(cycleIndicators);
        
        // Group milestones by phase
        const phases = ['activities', 'planning', 'implementation', 'review', 'delivery'];
        const phaseHeight = 180; // Height for each phase section (increased for more rows)
        const rowHeight = 45; // Height for each row within a phase (increased for deliverables)
        const phaseGap = 20; // Gap between phases
        const activitiesHeight = 60; // Smaller height for activities section
        
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
                item.style.width = Math.max(duration * pixelsPerDay, 140) + 'px';
                // Use cumulative height for proper positioning
                const itemRowHeight = phase === 'activities' ? 30 : rowHeight;
                item.style.top = (cumulativeHeight + 25 + rowIndex * itemRowHeight) + 'px';
                item.title = `${milestone.name}\n${milestone.status.replace('-', ' ')}\n${new Date(milestone.startDate).toLocaleDateString()} - ${new Date(milestone.endDate).toLocaleDateString()}`;
                
                // Check if this is a school-trackable milestone
                const isSchoolMilestone = ['eact-5', 'eact-8', 'eact-11', 'eact-14', 'eact-17', 'eact-20'].includes(milestone.id);
                
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
                    
                    item.innerHTML = `
                        <div class="activity-item-content">
                            <span class="activity-title">${milestone.name}</span>
                            ${pdfLink}
                        </div>
                    `;
                    item.className = 'timeline-item activity-item';
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
                        ${schoolIndicatorsHTML}
                    `;
                }
                
                item.addEventListener('click', () => this.openMilestoneModal(milestone));
                timelineContent.appendChild(item);
            });
            
            // Update cumulative height for next phase
            cumulativeHeight += currentPhaseHeight + phaseGap;
        });
        
        // Set content height based on cumulative height
        timelineContent.style.height = (cumulativeHeight + 50) + 'px';
        
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
        
        // Find date range
        const dates = this.milestones.flatMap(m => [new Date(m.startDate), new Date(m.endDate)]);
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        
        // Add padding
        minDate.setMonth(minDate.getMonth() - 1);
        maxDate.setMonth(maxDate.getMonth() + 1);
        
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
        const sortedMilestones = [...this.milestones].sort((a, b) => 
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
            
            bar.addEventListener('click', () => this.openMilestoneModal(milestone));
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
        
        this.milestones.forEach(milestone => {
            const row = document.createElement('tr');
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
        
        // Key milestones to track
        const keyMilestones = [
            { id: 'eact-5', name: 'Student Questionnaire (Cycle 1)' },
            { id: 'eact-8', name: '1-1 Coaching Sessions (Cycle 1)' },
            { id: 'eact-11', name: 'Questionnaire (Cycle 2)' },
            { id: 'eact-14', name: 'Student Check-ins (Cycle 2)' },
            { id: 'eact-17', name: 'Questionnaire (Cycle 3)' },
            { id: 'eact-20', name: 'Revision Support Sessions' }
        ];
        
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
        const milestoneIds = ['eact-5', 'eact-8', 'eact-11', 'eact-14', 'eact-17', 'eact-20'];
        
        this.schools.forEach(school => {
            this.schoolProgress[school.id] = {};
            milestoneIds.forEach(id => {
                // Mock data - some schools ahead, some behind
                if (school.id === 'daventry' || school.id === 'crest') {
                    this.schoolProgress[school.id][id] = id === 'eact-5' ? 'completed' : 'not-started';
                } else if (school.id === 'west-walsall') {
                    this.schoolProgress[school.id][id] = id === 'eact-5' ? 'in-progress' : 'not-started';
                } else {
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
            const milestones = ['eact-5', 'eact-8', 'eact-11', 'eact-14', 'eact-17', 'eact-20'];
            const completed = milestones.filter(m => this.getSchoolMilestoneStatus(school.id, m) === 'completed').length;
            const progress = (completed / milestones.length) * 100;
            
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
        const headers = ['Phase', 'Milestone', 'Start Date', 'End Date', 'Status', 'Progress', 'Description', 'VESPA Deliverables', 'School Deliverables'];
        const rows = this.milestones.map(m => [
            m.phase,
            m.name,
            m.startDate,
            m.endDate,
            m.status,
            m.progress + '%',
            m.description || '',
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
        
        // Update modal content
        document.getElementById('schoolContactTitle').textContent = school.name + ' Contacts';
        document.getElementById('schoolContactName').textContent = school.name;
        document.getElementById('schoolContactLogo').src = school.logo;
        
        // Build contacts HTML
        const contactsList = document.getElementById('contactsList');
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
        document.getElementById('schoolContactModal').classList.add('active');
    }
    
    closeContactModal() {
        document.getElementById('schoolContactModal').classList.remove('active');
    }
    
    // ===== School Management Modal =====
    openSchoolManagementModal() {
        const content = document.getElementById('schoolManagementContent');
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
        document.getElementById('schoolManagementModal').classList.add('active');
    }
    
    closeSchoolManagementModal() {
        document.getElementById('schoolManagementModal').classList.remove('active');
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
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TimelineApp();
}); 