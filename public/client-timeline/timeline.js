// ===== Timeline Application =====

class TimelineApp {
    constructor() {
        this.clients = this.loadClients();
        this.currentClient = null;
        this.milestones = [];
        this.currentView = 'timeline';
        this.zoomLevel = 1;
        this.editingMilestone = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkForClient();
        this.updateProgressStats();
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
        this.milestones = stored ? JSON.parse(stored) : this.getDefaultMilestones();
        this.renderCurrentView();
        this.updateProgressStats();
    }
    
    saveMilestones() {
        if (!this.currentClient) return;
        localStorage.setItem('milestones-' + this.currentClient.id, JSON.stringify(this.milestones));
    }
    
    getDefaultMilestones() {
        // Return some default milestones for new clients
        return [
            {
                id: 'milestone-1',
                name: 'Initial Consultation',
                phase: 'planning',
                startDate: this.getDateString(0),
                endDate: this.getDateString(7),
                status: 'completed',
                progress: 100,
                description: 'Initial meeting to discuss project requirements and goals',
                deliverables: ['Requirements document', 'Project proposal']
            },
            {
                id: 'milestone-2',
                name: 'Strategy Development',
                phase: 'planning',
                startDate: this.getDateString(7),
                endDate: this.getDateString(21),
                status: 'in-progress',
                progress: 60,
                description: 'Develop comprehensive strategy based on requirements',
                deliverables: ['Strategy document', 'Timeline']
            },
            {
                id: 'milestone-3',
                name: 'Implementation Phase 1',
                phase: 'implementation',
                startDate: this.getDateString(21),
                endDate: this.getDateString(45),
                status: 'upcoming',
                progress: 0,
                description: 'Begin implementation of core components',
                deliverables: ['Phase 1 deliverables', 'Progress report']
            }
        ];
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
        document.querySelectorAll('.timeline-view, .gantt-view, .list-view').forEach(v => {
            v.classList.remove('active');
        });
        
        document.getElementById(view + 'View').classList.add('active');
        this.renderCurrentView();
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
        
        // Generate month headers
        const months = [];
        const current = new Date(minDate);
        while (current <= maxDate) {
            months.push({
                year: current.getFullYear(),
                month: current.getMonth(),
                name: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            });
            current.setMonth(current.getMonth() + 1);
        }
        
        months.forEach(month => {
            const header = document.createElement('div');
            header.className = 'month-header';
            header.textContent = month.name;
            monthsHeader.appendChild(header);
        });
        
        // Calculate positions and render milestones
        const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
        const pixelsPerDay = (timelineContent.offsetWidth * this.zoomLevel) / totalDays;
        
        // Group milestones by phase
        const phases = ['planning', 'implementation', 'review', 'delivery'];
        phases.forEach((phase, phaseIndex) => {
            const phaseMilestones = this.milestones.filter(m => m.phase === phase);
            
            phaseMilestones.forEach(milestone => {
                const startDays = Math.ceil((new Date(milestone.startDate) - minDate) / (1000 * 60 * 60 * 24));
                const duration = Math.ceil((new Date(milestone.endDate) - new Date(milestone.startDate)) / (1000 * 60 * 60 * 24));
                
                const item = document.createElement('div');
                item.className = `timeline-item ${milestone.phase}`;
                item.style.left = (startDays * pixelsPerDay) + 'px';
                item.style.width = (duration * pixelsPerDay) + 'px';
                item.style.top = (phaseIndex * 80) + 'px';
                
                // Build deliverables HTML
                let deliverablesHTML = '';
                if (milestone.vespaDeliverables && milestone.vespaDeliverables.length > 0) {
                    deliverablesHTML += '<div class="deliverables-mini"><span class="deliverables-label vespa">VESPA:</span> ' + 
                        milestone.vespaDeliverables.slice(0, 2).join(', ') + 
                        (milestone.vespaDeliverables.length > 2 ? '...' : '') + '</div>';
                }
                if (milestone.schoolDeliverables && milestone.schoolDeliverables.length > 0) {
                    deliverablesHTML += '<div class="deliverables-mini"><span class="deliverables-label school">Client:</span> ' + 
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
                    <div class="timeline-item-header">
                        <span class="timeline-item-title">${milestone.name}</span>
                        <span class="timeline-item-status status-${milestone.status}">${milestone.status.replace('-', ' ')}</span>
                    </div>
                    <div class="timeline-item-dates">
                        ${new Date(milestone.startDate).toLocaleDateString()} - ${new Date(milestone.endDate).toLocaleDateString()}
                    </div>
                    <div class="timeline-item-progress">
                        <div class="progress-bar" style="width: ${milestone.progress}%"></div>
                    </div>
                    ${deliverablesHTML}
                `;
                
                item.addEventListener('click', () => this.openMilestoneModal(milestone));
                timelineContent.appendChild(item);
            });
        });
        
        // Set content height
        timelineContent.style.height = (phases.length * 80 + 40) + 'px';
        
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
        const ganttView = document.getElementById('ganttView');
        ganttView.innerHTML = '<p style="text-align: center; padding: 40px;">Gantt view coming soon!</p>';
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
        this.renderTimelineView();
    }
    
    zoomReset() {
        this.zoomLevel = 1;
        this.renderTimelineView();
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
        const headers = ['Phase', 'Milestone', 'Start Date', 'End Date', 'Status', 'Progress', 'Description', 'VESPA Deliverables', 'Client Deliverables'];
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
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TimelineApp();
}); 