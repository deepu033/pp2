// ============================================
// APPLICATION STATE
// ============================================

const appState = {
    currentUser: null,
    userType: null,
    events: [],
    myEvents: [],
    transactions: [],
    sponsors: [],
    bookings: [],
    crowdData: [],
    eventFilter: 'all'
};

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info', title = null, actions = null) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    const notificationId = 'notif-' + Date.now();
    
    notification.id = notificationId;
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        confirm: 'fas fa-question-circle'
    };
    
    const displayTitle = title || (type.charAt(0).toUpperCase() + type.slice(1));
    
    let actionsHTML = '';
    if (actions) {
        actionsHTML = '<div class="notification-actions">';
        actions.forEach(action => {
            const btnClass = action.isPrimary ? 'notification-btn-primary' : 'notification-btn-secondary';
            actionsHTML += `<button class="notification-btn ${btnClass}" data-action="${action.id}">${action.label}</button>`;
        });
        actionsHTML += '</div>';
    }
    
    notification.innerHTML = `
        <i class="notification-icon ${icons[type]}"></i>
        <div class="notification-content">
            <div class="notification-title">${displayTitle}</div>
            <div class="notification-message">${message}</div>
            ${actionsHTML}
        </div>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    container.appendChild(notification);
    
    // Handle close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        removeNotification(notificationId);
    });
    
    // Handle action buttons
    if (actions) {
        notification.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', function() {
                const actionId = this.getAttribute('data-action');
                const action = actions.find(a => a.id === actionId);
                if (action && action.callback) {
                    action.callback();
                }
                removeNotification(notificationId);
            });
        });
    }
    
    // Auto remove after 5 seconds if no actions
    if (!actions) {
        setTimeout(() => removeNotification(notificationId), 5000);
    }
}

function removeNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.classList.add('removing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

function showConfirmation(message, title, onConfirm, onCancel = null) {
    const actions = [
        {
            id: 'confirm',
            label: 'Confirm',
            isPrimary: true,
            callback: onConfirm
        },
        {
            id: 'cancel',
            label: 'Cancel',
            isPrimary: false,
            callback: onCancel
        }
    ];
    
    showNotification(message, 'confirm', title, actions);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initializeSampleData();
    setupEventListeners();
});

// ============================================
// DATA INITIALIZATION
// ============================================

function initializeSampleData() {
    // Sample Events (expanded list with image placeholders)
    appState.events = [
        { id: 1, name: "Tech Symposium 2026", date: "2026-10-15", time: "10:00", venue: "Main Auditorium", city: "Mumbai", capacity: 500, registered: 320, organizer: "Computer Science Department", category: "tech", description: "Annual technology conference featuring talks from industry leaders, workshops, and coding competitions.", fee: 0, image: "https://picsum.photos/seed/techsym/800/480", status: "upcoming" },
        { id: 2, name: "Cultural Fest", date: "2026-10-22", time: "09:00", venue: "College Ground", city: "Delhi", capacity: 1000, registered: 580, organizer: "Student Council", category: "cultural", description: "A vibrant celebration of art, music, dance, and drama with performances, competitions, and food stalls.", fee: 100, image: "https://picsum.photos/seed/cultural/800/480", status: "upcoming" },
        { id: 3, name: "Startup Expo", date: "2026-11-05", time: "11:00", venue: "Business Block", city: "Bangalore", capacity: 300, registered: 210, organizer: "Entrepreneurship Cell", category: "workshop", description: "Showcasing innovative startups, networking with entrepreneurs, and pitch competitions with prize money.", fee: 50, image: "https://picsum.photos/seed/startup/800/480", status: "upcoming" },
        { id: 4, name: "Design Thinking Workshop", date: "2026-02-12", time: "14:00", venue: "Innovation Lab", city: "Pune", capacity: 120, registered: 60, organizer: "Design Club", category: "workshop", description: "Hands-on workshop on design thinking and user-centered design.", fee: 25, image: "https://picsum.photos/seed/design/800/480", status: "upcoming" },
        { id: 5, name: "Music Night", date: "2026-03-05", time: "18:30", venue: "Open Amphitheatre", city: "Chennai", capacity: 800, registered: 450, organizer: "Cultural Committee", category: "music", description: "Live performances from college bands and guest artists.", fee: 150, image: "https://picsum.photos/seed/music/800/480", status: "upcoming" },
        { id: 6, name: "AI & Ethics Panel", date: "2026-04-20", time: "16:00", venue: "Lecture Hall A", city: "Hyderabad", capacity: 200, registered: 140, organizer: "AI Cell", category: "conference", description: "Panel discussion on ethical considerations in AI.", fee: 0, image: "https://picsum.photos/seed/aiethics/800/480", status: "upcoming" },
        { id: 7, name: "Hackathon 48H", date: "2026-05-10", time: "09:00", venue: "Tech Hub", city: "Mumbai", capacity: 400, registered: 300, organizer: "Coding Club", category: "competition", description: "48-hour hackathon with mentors and prizes.", fee: 0, image: "https://picsum.photos/seed/hackathon/800/480", status: "upcoming" },
        { id: 8, name: "Photography Walk", date: "2026-06-01", time: "06:00", venue: "City Park", city: "Kolkata", capacity: 80, registered: 42, organizer: "Photo Society", category: "outreach", description: "Sunrise photography walk and editing session.", fee: 10, image: "https://picsum.photos/seed/photo/800/480", status: "upcoming" },
        { id: 9, name: "Entrepreneur Meetup", date: "2026-07-15", time: "17:00", venue: "Startup Lounge", city: "Bengaluru", capacity: 150, registered: 95, organizer: "Entrepreneurship Cell", category: "networking", description: "Connect with founders, investors, and mentors.", fee: 0, image: "https://picsum.photos/seed/entre/800/480", status: "upcoming" },
        { id: 10, name: "Robotics Demo Day", date: "2026-02-25", time: "13:00", venue: "Robotics Lab", city: "Mumbai", capacity: 200, registered: 80, organizer: "Robotics Club", category: "tech", description: "Robotics project demos and competitions by students.", fee: 0, image: "https://picsum.photos/seed/robotics/800/480", status: "upcoming" },
        { id: 11, name: "Literary Meet", date: "2026-03-18", time: "15:00", venue: "Lecture Hall B", city: "Delhi", capacity: 150, registered: 60, organizer: "Literature Society", category: "cultural", description: "Poetry readings, debates, and storytelling sessions.", fee: 20, image: "https://picsum.photos/seed/litmeet/800/480", status: "upcoming" },
        { id: 12, name: "Career Fair", date: "2026-04-08", time: "10:00", venue: "Exhibition Hall", city: "Bengaluru", capacity: 1000, registered: 420, organizer: "Placement Cell", category: "networking", description: "Companies and startups exhibit job and internship opportunities.", fee: 0, image: "https://picsum.photos/seed/career/800/480", status: "upcoming" },
        { id: 13, name: "Sustainability Workshop", date: "2026-05-20", time: "11:00", venue: "Green Centre", city: "Pune", capacity: 120, registered: 30, organizer: "Environment Club", category: "workshop", description: "Practical workshop on sustainable practices and campus initiatives.", fee: 10, image: "https://picsum.photos/seed/sustain/800/480", status: "upcoming" },
        { id: 14, name: "Food Festival", date: "2026-06-12", time: "12:00", venue: "Main Quad", city: "Chennai", capacity: 800, registered: 250, organizer: "Cultural Committee", category: "food", description: "Street food stalls and culinary contests with student vendors.", fee: 50, image: "https://picsum.photos/seed/foodfest/800/480", status: "upcoming" },
        { id: 15, name: "Data Science Bootcamp", date: "2026-07-02", time: "09:30", venue: "Computer Lab", city: "Hyderabad", capacity: 100, registered: 45, organizer: "Data Club", category: "workshop", description: "Hands-on bootcamp covering ML basics and data pipelines.", fee: 200, image: "https://picsum.photos/seed/datasci/800/480", status: "upcoming" }
    ];

    // Sample Transactions
    appState.transactions = [
        { id: 1, date: "2026-10-10", description: "Sponsorship from TechCorp", category: "sponsorship", type: "income", amount: 75000, approvedBy: "Dr. Sharma", event: "Tech Symposium 2023" },
        { id: 2, date: "2026-10-12", description: "Stall bookings for Cultural Fest", category: "stall-booking", type: "income", amount: 45000, approvedBy: "Dr. Sharma", event: "Cultural Fest" },
        { id: 3, date: "2026-10-15", description: "College Grant for Tech Symposium", category: "college-grant", type: "income", amount: 50000, approvedBy: "Principal", event: "Tech Symposium 2023" }
    ];

    // Sample Sponsors
    appState.sponsors = [
        { id: 1, name: "TechCorp Inc.", contact: "Rajesh Kumar", email: "rajesh@techcorp.com", phone: "9876543210", amount: 75000, status: "confirmed", industry: "technology", event: "Tech Symposium 2023" },
        { id: 2, name: "EduSoft Solutions", contact: "Priya Sharma", email: "priya@edusoft.com", phone: "8765432109", amount: 50000, status: "confirmed", industry: "education", event: "Cultural Fest" },
        { id: 3, name: "InnovateLabs India", contact: "Vikram Singh", email: "vikram@innovatelabs.in", phone: "9123456789", amount: 60000, status: "confirmed", industry: "innovation", event: "Hackathon 48H" },
        { id: 4, name: "Global Tech Solutions", contact: "Sarah Johnson", email: "sarah@globaltechsol.com", phone: "9988776655", amount: 85000, status: "confirmed", industry: "technology", event: "Tech Symposium 2023" },
        { id: 5, name: "Creative Minds Agency", contact: "Amar Patel", email: "amar@creativeminds.co", phone: "8899776655", amount: 40000, status: "pending", industry: "creative", event: "Cultural Fest" }
    ];

    // Sample Bookings
    appState.bookings = [
        { id: 1, vendor: "Foodie's Delight", event: "Cultural Fest", type: "food", amount: 15000, date: "2026-10-10", status: "confirmed" },
        { id: 2, vendor: "Tech Gadgets Hub", event: "Tech Symposium", type: "tech", amount: 20000, date: "2026-10-12", status: "confirmed" }
    ];

    // Sample Crowd Data
    appState.crowdData = [
        { time: "10:15 AM", name: "Rahul Sharma", event: "Tech Symposium", entryPoint: "Main Gate", status: "checkedin" },
        { time: "10:20 AM", name: "Priya Patel", event: "Cultural Fest", entryPoint: "East Gate", status: "checkedin" },
        { time: "10:30 AM", name: "Neha Gupta", event: "Startup Expo", entryPoint: "West Gate", status: "checkedin" }
    ];

    // Load my events from localStorage
    appState.myEvents = JSON.parse(localStorage.getItem('myEvents')) || [];
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================

function setupEventListeners() {
    // Navigation
    document.getElementById('login-nav-btn').addEventListener('click', () => {
        document.getElementById('login-modal').classList.add('active');
    });

    // Modal tabs
    document.getElementById('modal-login-tab').addEventListener('click', () => switchModalTab('login'));
    document.getElementById('modal-register-tab').addEventListener('click', () => switchModalTab('register'));

    // Modal close
    document.getElementById('close-login-modal').addEventListener('click', closeLoginModal);
    document.getElementById('login-modal').addEventListener('click', function (e) {
        if (e.target === this) closeLoginModal();
    });

    // QR Modal close
    const closeQRModalBtn = document.getElementById('close-qr-modal');
    const closeQRBtn = document.getElementById('close-qr-btn');
    const qrModal = document.getElementById('qr-modal');
    
    if (closeQRModalBtn) closeQRModalBtn.addEventListener('click', closeQRModal);
    if (closeQRBtn) closeQRBtn.addEventListener('click', closeQRModal);
    if (qrModal) {
        qrModal.addEventListener('click', function (e) {
            if (e.target === this) closeQRModal();
        });
    }
    
    // Download QR button
    const downloadQRBtn = document.getElementById('download-qr-btn');
    if (downloadQRBtn) {
        downloadQRBtn.addEventListener('click', function() {
            downloadQRImage();
        });
    }

    // Modal forms
    document.getElementById('modal-login-form').addEventListener('submit', handleLogin);
    document.getElementById('modal-register-form').addEventListener('submit', handleRegister);

    // Hero buttons
    document.getElementById('explore-events-btn').addEventListener('click', () => {
        document.getElementById('login-modal').classList.add('active');
    });

    document.getElementById('get-started-btn').addEventListener('click', () => {
        document.getElementById('login-modal').classList.add('active');
    });

    // Dashboard navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showDashboardPage(pageId);

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Dashboard buttons - wired to flows that collect data and update state
    const addEventBtn = document.getElementById('add-event-btn');
    if (addEventBtn) addEventBtn.addEventListener('click', addEventFlow);

    const quickAddBtn = document.getElementById('quick-add-event');
    if (quickAddBtn) quickAddBtn.addEventListener('click', addEventFlow);

    const addTransactionBtn = document.getElementById('add-transaction-btn');
    if (addTransactionBtn) addTransactionBtn.addEventListener('click', addTransactionFlow);

    const addSponsorBtn = document.getElementById('add-sponsor-btn');
    if (addSponsorBtn) addSponsorBtn.addEventListener('click', addSponsorFlow);

    const addBookingBtn = document.getElementById('add-booking-btn');
    if (addBookingBtn) addBookingBtn.addEventListener('click', addBookingFlow);

    // Add-modal controls
    const addModal = document.getElementById('add-modal');
    if (addModal) {
        // type selector
        const addType = document.getElementById('add-type');
        if (addType) addType.addEventListener('change', function () { switchAddForm(this.value); });

        // close buttons
        document.querySelectorAll('.close-add-modal').forEach(btn => btn.addEventListener('click', closeAddModal));
        addModal.addEventListener('click', function (e) { if (e.target === this) closeAddModal(); });

        // form submissions
        const fe = document.getElementById('add-event-form'); if (fe) fe.addEventListener('submit', handleAddEventSubmit);
        const ft = document.getElementById('add-transaction-form'); if (ft) ft.addEventListener('submit', handleAddTransactionSubmit);
        const fs = document.getElementById('add-sponsor-form'); if (fs) fs.addEventListener('submit', handleAddSponsorSubmit);
        const fb = document.getElementById('add-booking-form'); if (fb) fb.addEventListener('submit', handleAddBookingSubmit);
    }

    // QR scanner controls (crowd page)
    const startScanBtn = document.getElementById('start-scan-btn'); if (startScanBtn) startScanBtn.addEventListener('click', startQRScan);
    const stopScanBtn = document.getElementById('stop-scan-btn'); if (stopScanBtn) stopScanBtn.addEventListener('click', stopQRScan);
    const processBtn = document.getElementById('process-qr-btn'); if (processBtn) processBtn.addEventListener('click', processScan);
    const captureBtn = document.getElementById('capture-frame-btn'); if (captureBtn) captureBtn.addEventListener('click', captureFrame);

    // Dashboard search
    const searchInput = document.getElementById('dashboard-search');
    const searchBtn = document.getElementById('dashboard-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', () => performSearch(searchInput ? searchInput.value : ''));
    if (searchInput) searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') performSearch(searchInput.value); });

    // Event filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const f = this.getAttribute('data-filter');
            filterEvents(f);
        });
    });

    // initialize categories and counts
    categorizeEvents();
    updateFilterCounts();
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function switchModalTab(tab) {
    if (tab === 'login') {
        document.getElementById('modal-login-tab').classList.add('active');
        document.getElementById('modal-register-tab').classList.remove('active');
        document.getElementById('modal-login-form').classList.add('active');
        document.getElementById('modal-register-form').classList.remove('active');
    } else {
        document.getElementById('modal-register-tab').classList.add('active');
        document.getElementById('modal-login-tab').classList.remove('active');
        document.getElementById('modal-register-form').classList.add('active');
        document.getElementById('modal-login-form').classList.remove('active');
    }
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
}

// ============================================
// QR CODE MODAL
// ============================================

function showQRCodeModal(event, registrationId) {
    const modal = document.getElementById('qr-modal');
    const container = document.getElementById('qr-code-container');
    
    // Clear previous QR code
    container.innerHTML = '';
    
    // Set event name
    document.getElementById('qr-event-name').textContent = event.name;
    document.getElementById('qr-registration-id').textContent = `Registration ID: ${registrationId}`;
    
    // Generate QR code
    try {
        new QRCode(container, {
            text: registrationId,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (error) {
        console.error('QR Code generation error:', error);
        container.innerHTML = '<p style="color: red;">Error generating QR code</p>';
    }
    
    // Show modal
    modal.classList.add('active');
}

function closeQRModal() {
    document.getElementById('qr-modal').classList.remove('active');
}

function downloadQRImage() {
    const container = document.getElementById('qr-code-container');
    const canvas = container.querySelector('canvas');
    
    if (!canvas) {
        showNotification('QR code not found. Please try again.', 'error', 'Download Error');
        return;
    }
    
    try {
        const eventName = document.getElementById('qr-event-name').textContent;
        const registrationId = document.getElementById('qr-registration-id').textContent.replace('Registration ID: ', '');
        
        // Convert canvas to image and download
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${eventName.replace(/\s+/g, '_')}_${registrationId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('QR code downloaded successfully!', 'success', 'Download Complete');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Error downloading QR code. Please try again.', 'error', 'Download Error');
    }
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('modal-email').value;
    const password = document.getElementById('modal-password').value;
    const userType = document.getElementById('modal-usertype').value;

    // Demo validation for admin
    if (userType === 'admin') {
        if (email === 'admin@example.com' && password === 'admin123') {
            loginUser({
                name: 'Administrator',
                email: email,
                role: 'admin',
                college: 'Demo College',
                phone: '+91 9876543210',
                joined: 'October 2023'
            }, 'admin');
        } else {
            showNotification('Invalid credentials. Demo Admin: admin@example.com / admin123', 'error', 'Login Failed');
        }
    } else {
        // For user, accept any non-empty credentials
        if (email && password) {
            const userName = email.split('@')[0];
            loginUser({
                name: userName.charAt(0).toUpperCase() + userName.slice(1),
                email: email,
                role: 'user',
                college: 'Demo College',
                phone: '+91 9876543210',
                joined: 'October 2023'
            }, 'user');
        } else {
            showNotification('Please enter valid email and password', 'error', 'Invalid Input');
        }
    }
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('modal-reg-name').value;
    const email = document.getElementById('modal-reg-email').value;
    const password = document.getElementById('modal-reg-password').value;
    const confirmPassword = document.getElementById('modal-reg-confirm').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error', 'Registration Error');
        return;
    }

    showNotification('Registration successful! You can now login.', 'success', 'Registration Complete');
    switchModalTab('login');
    document.getElementById('modal-email').value = email;
    document.getElementById('modal-password').value = password;
}

function loginUser(userData, userType) {
    appState.currentUser = userData;
    appState.userType = userType;

    // Update UI
    updateUserInfo();
    showDashboard();
    closeLoginModal();

    // Clear forms
    document.getElementById('modal-login-form').reset();
    document.getElementById('modal-register-form').reset();
}

function logout() {
    showConfirmation('Are you sure you want to logout?', 'Confirm Logout', function() {
        appState.currentUser = null;
        appState.userType = null;

        document.getElementById('home-page').classList.remove('hidden');
        document.getElementById('dashboard-page').classList.add('hidden');

        switchModalTab('login');
        showNotification('You have been logged out successfully.', 'success', 'Logout Successful');
    });
}

// ============================================
// PAGE NAVIGATION
// ============================================

function showDashboard() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('dashboard-page').classList.remove('hidden');

    // Hide admin-only actions if user
    const adminActions = document.getElementById('admin-actions');
    if (appState.userType === 'user') {
        adminActions.style.display = 'none';
    } else {
        adminActions.style.display = 'block';
    }

    // Filter sidebar based on user type
    configureNavigation();

    // Show dashboard page by default
    showDashboardPage('dashboard');
}

function showDashboardPage(pageId) {
    // Hide all pages
    document.querySelectorAll('#dashboard-page .page').forEach(page => page.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(`${pageId}-page-content`);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update displays
    updateDashboardDisplays(pageId);
}

// ============================================
// NAVIGATION CONFIGURATION
// ============================================

function configureNavigation() {
    const isAdmin = appState.userType === 'admin';
    
    // Define admin-only pages
    const adminOnlyPages = ['funds', 'sponsors', 'stalls', 'crowd', 'reports'];
    
    // Define user-only pages
    const userOnlyPages = ['passes'];
    
    // Define pages to hide for users
    const userHidePages = ['dashboard'];
    
    // Get all nav items
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(link => {
        const pageId = link.getAttribute('data-page');
        
        if (adminOnlyPages.includes(pageId)) {
            // Hide admin-only items for users
            link.parentElement.style.display = isAdmin ? 'block' : 'none';
        } else if (userOnlyPages.includes(pageId)) {
            // Show user-only items only for users
            link.parentElement.style.display = !isAdmin ? 'block' : 'none';
        } else if (userHidePages.includes(pageId)) {
            // Hide dashboard for users
            link.parentElement.style.display = isAdmin ? 'block' : 'none';
        } else {
            // Show common pages for both
            link.parentElement.style.display = 'block';
        }
    });

    // Activate first available nav link
    const allNavLinks = document.querySelectorAll('.nav-link');
    let firstVisibleLink = null;
    
    for (let link of allNavLinks) {
        const style = window.getComputedStyle(link.parentElement);
        if (style.display !== 'none') {
            firstVisibleLink = link;
            break;
        }
    }
    
    if (firstVisibleLink) {
        allNavLinks.forEach(link => link.classList.remove('active'));
        firstVisibleLink.classList.add('active');
        showDashboardPage(firstVisibleLink.getAttribute('data-page'));
    }
}

// ============================================
// UPDATE USER INTERFACE
// ============================================

function updateUserInfo() {
    if (!appState.currentUser) return;

    const user = appState.currentUser;
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

    document.getElementById('user-avatar').textContent = initials;
    document.getElementById('user-display-name').textContent = user.name;
    document.getElementById('header-title').textContent = appState.userType === 'admin' ? 'EventraX Admin' : 'EventraX Dashboard';

    // Update profile page
    document.getElementById('profile-avatar').textContent = initials;
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-role').textContent = appState.userType === 'admin' ? 'Administrator' : 'Student / Faculty';
    document.getElementById('profile-college').textContent = user.college || 'N/A';
    document.getElementById('profile-phone').textContent = user.phone || 'N/A';
    document.getElementById('profile-joined').textContent = user.joined || 'N/A';
    document.getElementById('profile-registered').textContent = appState.myEvents.length;
    document.getElementById('profile-attended').textContent = appState.myEvents.filter(e => e.status === 'attended').length;
    document.getElementById('profile-upcoming').textContent = appState.myEvents.filter(e => e.status === 'registered').length;
}

function updateDashboardDisplays(pageId) {
    // For users, only allow access to certain pages
    if (appState.userType === 'user') {
        const userOnlyPages = ['events', 'passes', 'profile'];
        if (!userOnlyPages.includes(pageId)) {
            showDashboardPage('events');
            return;
        }
    }

    switch (pageId) {
        case 'dashboard':
            updateDashboardTable();
            break;
        case 'events':
            updateEventsTable();
            break;
        case 'passes':
            updateUserPasses();
            break;
        case 'funds':
            if (appState.userType === 'admin') updateTransactionsTable();
            break;
        case 'sponsors':
            if (appState.userType === 'admin') updateSponsorsTable();
            break;
        case 'stalls':
            updateBookingsTable();
            break;
        case 'crowd':
            updateCrowdTable();
            break;
        case 'profile':
            updateUserInfo();
            break;
    }
}

function updateDashboardTable() {
    const tableBody = document.getElementById('dashboard-events-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    appState.events.slice(0, 5).forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.registered}</td>
            <td>${event.capacity}</td>
            <td><span class="status-badge status-${event.status}">${event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function updateDashboardTable() {
    const tableBody = document.getElementById('dashboard-events-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    // Show different content for users vs admins
    if (appState.userType === 'user') {
        // For users, show registered events
        appState.myEvents.slice(0, 5).forEach(myEvent => {
            const event = appState.events.find(e => e.id === myEvent.id);
            if (!event) return;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${formatDate(event.date)}</td>
                <td>${event.registered}</td>
                <td>${event.capacity}</td>
                <td><span class="status-badge status-${myEvent.status}">${myEvent.status.charAt(0).toUpperCase() + myEvent.status.slice(1)}</span></td>
            `;
            tableBody.appendChild(row);
        });
        
        if (appState.myEvents.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No registered events. <a href="#" onclick="showDashboardPage(\'events\'); return false;">Browse events</a></td></tr>';
        }
    } else {
        // For admins, show all events
        appState.events.slice(0, 5).forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${formatDate(event.date)}</td>
                <td>${event.registered}</td>
                <td>${event.capacity}</td>
                <td><span class="status-badge status-${event.status}">${event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function updateEventsTable() {
    const tableBody = document.getElementById('events-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const cardsContainer = document.getElementById('events-cards');
    if (cardsContainer) cardsContainer.innerHTML = '';

    // categorize and counts
    categorizeEvents();
    updateFilterCounts();

    const filter = appState.eventFilter || 'all';
    // Filter by category (buttons provide category filters). If no category, show all.
    const filtered = appState.events.filter(ev => {
        if (!filter || filter === 'all') return true;
        return ev.category === filter;
    });
    const shownEvents = filtered.length ? filtered : appState.events.slice();

    console.log('updateEventsTable:', { total: appState.events.length, filtered: filtered.length, shown: shownEvents.length });

    if (cardsContainer) {
        const countNote = document.createElement('div');
        countNote.style.cssText = 'padding:8px 0 6px 0; color:#6b6b6b; font-weight:600;';
        countNote.textContent = `Showing ${shownEvents.length} event(s)`;
        cardsContainer.appendChild(countNote);
        if (filtered.length === 0 && appState.events.length > 0) {
            const note = document.createElement('div');
            note.style.cssText = 'padding:12px; margin-bottom:12px; color:#5f6368; background:#fff8e6; border-radius:8px; border:1px solid #fde7b7;';
            note.textContent = 'No events match the current filter. Showing all events instead.';
            cardsContainer.appendChild(note);
        }
    }

    // Build cards and table rows
    shownEvents.forEach(event => {
        // Card
        if (cardsContainer) {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.id = `event-card-${event.id}`;

            const cover = document.createElement('div');
            cover.className = 'cover';
            cover.style.backgroundImage = `url('${event.image || ''}')`;
            card.appendChild(cover);

            const body = document.createElement('div');
            body.className = 'card-body';

            const headWrap = document.createElement('div');
            headWrap.style.display = 'flex';
            headWrap.style.justifyContent = 'space-between';
            headWrap.style.alignItems = 'center';
            headWrap.style.gap = '12px';

            const h4 = document.createElement('h4');
            h4.textContent = event.name || 'Untitled Event';
            headWrap.appendChild(h4);

            const badge = document.createElement('div');
            badge.className = `event-badge ${event.status}`;
            badge.textContent = (event.status || 'upcoming').charAt(0).toUpperCase() + (event.status || 'upcoming').slice(1);
            headWrap.appendChild(badge);

            body.appendChild(headWrap);

            const meta = document.createElement('div');
            meta.className = 'event-meta';
            meta.textContent = `${formatDate(event.date)} • ${event.time || ''} • ${event.venue || ''}`;
            body.appendChild(meta);

            const desc = document.createElement('p');
            desc.style.color = '#5f6368';
            desc.style.fontSize = '13px';
            desc.style.margin = '6px 0 0';
            desc.textContent = event.description ? (event.description.length > 110 ? event.description.substring(0, 110) + '...' : event.description) : '';
            body.appendChild(desc);

            const actions = document.createElement('div');
            actions.className = 'card-actions';

            const isRegistered = appState.myEvents.some(e => e.id === event.id);
            const btn = document.createElement('button');
            btn.className = `btn ${isRegistered ? 'btn-success' : 'btn-primary'} btn-small`;
            if (isRegistered) btn.disabled = true;
            btn.innerHTML = `<i class="fas ${isRegistered ? 'fa-check' : 'fa-calendar-plus'}"></i> ${isRegistered ? 'Registered' : 'Register'}`;
            btn.addEventListener('click', () => registerForEvent(event.id));
            actions.appendChild(btn);

            // Directions button
            const dirBtn = document.createElement('button');
            dirBtn.className = 'btn btn-small';
            dirBtn.style.backgroundColor = '#f0f0f0';
            dirBtn.style.color = '#333';
            dirBtn.style.border = '1px solid #ddd';
            dirBtn.innerHTML = '<i class="fas fa-map-location-dot" style="color: var(--primary-color);"></i> Directions';
            dirBtn.addEventListener('click', () => openGoogleMapsDirections(event.venue, event.city));
            dirBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#e0e0e0';
            });
            dirBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#f0f0f0';
            });
            actions.appendChild(dirBtn);

            const feeDiv = document.createElement('div');
            feeDiv.style.marginLeft = 'auto';
            feeDiv.style.fontWeight = '600';
            feeDiv.style.color = 'var(--primary-color)';
            feeDiv.textContent = event.fee ? '₹' + event.fee : 'Free';
            actions.appendChild(feeDiv);

            body.appendChild(actions);
            card.appendChild(body);
            cardsContainer.appendChild(card);
            console.log('Appended card for event', event.id);
        }

        // Table row
        const row = document.createElement('tr');
        row.id = `event-row-${event.id}`;
        const isRegistered2 = appState.myEvents.some(e => e.id === event.id);
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${formatDate(event.date)} at ${event.time || ''}</td>
            <td>${event.venue || ''}</td>
            <td>${event.capacity || ''}</td>
            <td>${event.registered || 0}</td>
            <td><span class="status-badge status-${event.status}">${(event.status || '').charAt(0).toUpperCase() + (event.status || '').slice(1)}</span></td>
            <td>
                ${appState.userType === 'admin' ? `
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small btn-icon" onclick="editEvent(${event.id})" title="Edit event"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-small btn-icon btn-directions" onclick="openGoogleMapsDirections('${event.venue}', '${event.city}')" title="View directions"><i class="fas fa-map-location-dot"></i></button>
                        <button class="btn btn-outline btn-small btn-icon" onclick="unregisterAllForEvent(${event.id})" title="Unregister all students for this event"><i class="fas fa-user-slash"></i></button>
                        <button class="btn btn-danger btn-small btn-icon" onclick="deleteEvent(${event.id})"><i class="fas fa-trash"></i></button>
                    </div>
                ` : `
                    <div class="action-buttons">
                        <button class="btn ${isRegistered2 ? 'btn-success' : 'btn-primary'} btn-small" onclick="registerForEvent(${event.id})" ${isRegistered2 ? 'disabled' : ''}>
                            <i class="fas ${isRegistered2 ? 'fa-check' : 'fa-calendar-plus'}"></i>
                            ${isRegistered2 ? 'Registered' : 'Register'}
                        </button>
                        <button class="btn btn-small btn-icon btn-directions" onclick="openGoogleMapsDirections('${event.venue}', '${event.city}')" title="View directions"><i class="fas fa-map-location-dot"></i></button>
                    </div>
                `}
            </td>
        `;
        tableBody.appendChild(row);
    });

    // apply search highlights if present
    if (Array.isArray(appState.lastSearchMatches) && appState.lastSearchMatches.length > 0) {
        clearSearchHighlights();
        let firstEl = null;
        appState.lastSearchMatches.forEach(id => {
            const cardEl = document.getElementById(`event-card-${id}`);
            const rowEl = document.getElementById(`event-row-${id}`);
            if (cardEl) {
                cardEl.classList.add('search-highlight');
                if (!firstEl) firstEl = cardEl;
            }
            if (rowEl) {
                rowEl.classList.add('search-highlight-row');
                if (!firstEl) firstEl = rowEl;
            }
        });
        if (firstEl) firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { clearSearchHighlights(); }, 6000);
    }
}

function filterEvents(filter) {
    appState.eventFilter = filter || 'all';
    // update active class on buttons
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    updateEventsTable();
}

function categorizeEvents() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    appState.events.forEach(ev => {
        if (!ev.date) return ev.status = ev.status || 'upcoming';
        const evDate = ev.date;
        if (evDate === todayStr) {
            ev.status = 'ongoing';
        } else if (new Date(evDate) < new Date(todayStr)) {
            ev.status = 'past';
        } else {
            ev.status = 'upcoming';
        }
    });

    // Also populate Admin events preview (shows all events regardless of current table filter)
    populateAdminEvents();
}
// Render all events into the Admin section (#admin-events)
function populateAdminEvents() {
    const adminContainer = document.getElementById('admin-events');
    if (!adminContainer) return;
    adminContainer.innerHTML = '';

    // Basic cards (smaller footprint)
    appState.events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.style.maxWidth = '320px';
        card.style.display = 'inline-block';
        card.style.verticalAlign = 'top';
        card.style.marginRight = '12px';
        card.style.marginBottom = '12px';

        const cover = document.createElement('div');
        cover.className = 'cover';
        cover.style.height = '140px';
        cover.style.backgroundSize = 'cover';
        cover.style.backgroundPosition = 'center';
        cover.style.backgroundImage = `url('${event.image || ''}')`;
        card.appendChild(cover);

        const body = document.createElement('div');
        body.className = 'card-body';
        body.style.padding = '10px';

        const h4 = document.createElement('h4');
        h4.textContent = event.name;
        h4.style.margin = '0 0 6px 0';
        h4.style.fontSize = '15px';
        body.appendChild(h4);

        const meta = document.createElement('div');
        meta.className = 'event-meta';
        meta.textContent = `${formatDate(event.date)} • ${event.venue || ''}`;
        meta.style.fontSize = '13px';
        meta.style.color = '#6b6b6b';
        body.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'card-actions';
        actions.style.marginTop = '8px';

        const btn = document.createElement('button');
        btn.className = 'btn btn-primary btn-small';
        btn.innerHTML = '<i class="fas fa-calendar-plus"></i> View';
        btn.addEventListener('click', () => {
            // navigate to Events page and highlight
            showDashboardPage('events');
            const el = document.getElementById(`event-card-${event.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        actions.appendChild(btn);

        const dirBtn = document.createElement('button');
        dirBtn.className = 'btn btn-small';
        dirBtn.style.marginLeft = '8px';
        dirBtn.style.backgroundColor = '#f0f0f0';
        dirBtn.style.color = '#333';
        dirBtn.style.border = '1px solid #ddd';
        dirBtn.innerHTML = '<i class="fas fa-map-location-dot" style="color: var(--primary-color);"></i>';
        dirBtn.addEventListener('click', () => openGoogleMapsDirections(event.venue, event.city));
        actions.appendChild(dirBtn);

        body.appendChild(actions);
        card.appendChild(body);
        adminContainer.appendChild(card);
    });
}

function updateFilterCounts() {
    const total = appState.events.length;
    // For each filter button, compute count based on its data-filter value (category)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const f = btn.getAttribute('data-filter');
        let count = 0;
        if (!f || f === 'all') count = total;
        else {
            count = appState.events.filter(ev => ev.category === f).length;
        }
        const label = (f && f !== 'all') ? (f.charAt(0).toUpperCase() + f.slice(1)) : 'All';
        btn.innerHTML = `${label} <span class="pill-count">${count}</span>`;
    });
}

function updateTransactionsTable() {
    const tableBody = document.getElementById('transactions-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    appState.transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const amountClass = transaction.type === 'income' ? 'text-success' : 'text-danger';
        const amountSign = transaction.type === 'income' ? '+' : '-';

        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td style="color: ${transaction.type === 'income' ? '#34a853' : '#ea4335'}; font-weight: 500;">${amountSign}₹${transaction.amount.toLocaleString()}</td>
            <td>${transaction.approvedBy}</td>
            <td>
                <button class="btn btn-danger btn-small btn-icon" onclick="deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateSponsorsTable() {
    const tableBody = document.getElementById('sponsors-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    appState.sponsors.forEach(sponsor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sponsor.name}</td>
            <td>${sponsor.contact}</td>
            <td>${sponsor.email}</td>
            <td>${sponsor.phone}</td>
            <td>₹${sponsor.amount.toLocaleString()}</td>
            <td><span class="status-badge ${sponsor.status === 'confirmed' ? 'status-active' : 'status-pending'}">${sponsor.status.charAt(0).toUpperCase() + sponsor.status.slice(1)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-small btn-icon" onclick="editSponsor(${sponsor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small btn-icon" onclick="deleteSponsor(${sponsor.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Also populate AI suggestions
    populateAISponsorSuggestions();
}

// AI Sponsor Suggestions
function populateAISponsorSuggestions() {
    const container = document.getElementById('ai-suggestions');
    if (!container) return;
    container.innerHTML = '';

    // Generate AI suggestions based on events and industry patterns
    const aiSuggestions = [
        { id: 'ai-1', name: "Digital Marketing Co.", industry: "marketing", matchReason: "Perfect fit for Cultural Fest promotion", estimatedAmount: 45000, icon: "fas fa-bullhorn" },
        { id: 'ai-2', name: "FoodTech Innovations", industry: "food-tech", matchReason: "Ideal for Food Festival sponsorship", estimatedAmount: 55000, icon: "fas fa-utensils" },
        { id: 'ai-3', name: "Tech Venture Capital", industry: "venture-capital", matchReason: "Great match for Hackathon & Startup events", estimatedAmount: 100000, icon: "fas fa-rocket" },
        { id: 'ai-4', name: "Educational Publishers Inc.", industry: "education", matchReason: "Strong alignment with workshops", estimatedAmount: 35000, icon: "fas fa-book" },
        { id: 'ai-5', name: "Sports & Wellness Ltd.", industry: "wellness", matchReason: "Suitable for outdoor & cultural events", estimatedAmount: 40000, icon: "fas fa-dumbbell" },
        { id: 'ai-6', name: "Photography Equipment Hub", industry: "photography", matchReason: "Fits Photo Walk and events", estimatedAmount: 30000, icon: "fas fa-camera" }
    ];

    aiSuggestions.forEach(suggestion => {
        const card = document.createElement('div');
        card.style.cssText = 'background: white; padding: 16px; border-radius: 10px; border: 1px solid #e0e0e0; transition: all 0.3s ease;';
        card.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                <div style="font-size: 28px; color: var(--primary-color);">
                    <i class="${suggestion.icon}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 4px 0; color: #333; font-size: 15px;">${suggestion.name}</h4>
                    <p style="margin: 0; font-size: 12px; color: #9c9c9c;">${suggestion.industry.replace('-', ' ').toUpperCase()}</p>
                </div>
            </div>
            <p style="margin: 8px 0; font-size: 13px; color: #5f6368; font-style: italic;">
                <i class="fas fa-lightbulb" style="color: #fbbc05; margin-right: 6px;"></i>${suggestion.matchReason}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #f0f0f0;">
                <div>
                    <p style="margin: 0; font-size: 12px; color: #999;">Est. Amount</p>
                    <p style="margin: 4px 0 0 0; font-weight: 600; color: var(--primary-color); font-size: 14px;">₹${suggestion.estimatedAmount.toLocaleString()}</p>
                </div>
                <button class="btn btn-primary btn-small" onclick="contactAISuggestion('${suggestion.name}', ${suggestion.estimatedAmount})" title="Contact this potential sponsor">
                    <i class="fas fa-envelope"></i> Contact
                </button>
            </div>
        `;
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 16px rgba(152, 86, 182, 0.2)';
            this.style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
            this.style.transform = 'translateY(0)';
        });
        container.appendChild(card);
    });
}

// Contact AI suggested sponsor
function contactAISuggestion(sponsorName, estimatedAmount) {
    showNotification(
        `Initiating contact with ${sponsorName}. Estimated sponsorship amount: ₹${estimatedAmount.toLocaleString()}. Follow up with email or call.`,
        'info',
        'AI Suggestion Selected',
        [
            {
                id: 'add-contact',
                label: 'Add as Pending',
                isPrimary: true,
                callback: () => {
                    const newId = Math.max(...appState.sponsors.map(s => s.id), 0) + 1;
                    appState.sponsors.push({
                        id: newId,
                        name: sponsorName,
                        contact: 'Pending Contact',
                        email: 'pending@example.com',
                        phone: 'TBD',
                        amount: estimatedAmount,
                        status: 'pending',
                        industry: 'AI Suggested',
                        event: 'TBD'
                    });
                    updateSponsorsTable();
                    showNotification(`${sponsorName} added to pending sponsors list`, 'success', 'Sponsor Added');
                }
            }
        ]
    );
}

function updateBookingsTable() {
    const tableBody = document.getElementById('bookings-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    appState.bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>BK-${booking.id.toString().padStart(3, '0')}</td>
            <td>${booking.vendor}</td>
            <td>${booking.event}</td>
            <td>${booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Stall</td>
            <td>₹${booking.amount.toLocaleString()}</td>
            <td>${formatDate(booking.date)}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-small btn-icon" onclick="editBooking(${booking.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small btn-icon" onclick="deleteBooking(${booking.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateCrowdTable() {
    const tableBody = document.getElementById('crowd-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    appState.crowdData.forEach(entry => {
        const row = document.createElement('tr');
        let statusClass = '';
        let statusText = '';

        if (entry.status === 'checkedin') {
            statusClass = 'status-active';
            statusText = 'Checked In';
        } else if (entry.status === 'invalid') {
            statusClass = 'status-pending';
            statusText = 'Invalid Pass';
        } else {
            statusClass = 'status-upcoming';
            statusText = 'Not Checked';
        }

        row.innerHTML = `
            <td>${entry.time}</td>
            <td>${entry.name}</td>
            <td>${entry.event}</td>
            <td>${entry.entryPoint}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function updateUserPasses() {
    const container = document.getElementById('user-passes-container');
    if (!container) return;

    container.innerHTML = '';

    if (appState.myEvents.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; background-color: white; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                <i class="fas fa-ticket-alt" style="font-size: 48px; color: #dadce0; margin-bottom: 15px;"></i>
                <h3 style="margin-bottom: 10px; color: var(--dark-color);">No Event Passes</h3>
                <p style="color: #5f6368; margin-bottom: 20px;">You don't have any event passes yet. Register for events to get QR passes for entry.</p>
                <button class="btn btn-primary" onclick="showDashboardPage('events')">
                    <i class="fas fa-search"></i> Browse Events
                </button>
            </div>
        `;
        return;
    }

    appState.myEvents.forEach(myEvent => {
        const event = appState.events.find(e => e.id === myEvent.id);
        if (!event) return;

        const passElement = document.createElement('div');
        passElement.style.cssText = 'background-color: white; border-radius: var(--border-radius); box-shadow: var(--shadow); padding: 25px; margin-bottom: 20px; display: flex; align-items: center; gap: 30px; animation: slideInUp 0.5s ease;';
        
        passElement.innerHTML = `
            <div style="width: 180px; height: 180px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
                <i class="fas fa-qrcode" style="font-size: 70px; color: #333;"></i>
            </div>
            <div style="flex: 1;">
                <h3 style="margin-bottom: 10px; color: var(--dark-color);">${event.name}</h3>
                <p style="margin-bottom: 8px;"><i class="fas fa-calendar-alt"></i> ${formatDate(event.date)} at ${event.time}</p>
                <p style="margin-bottom: 8px;"><i class="fas fa-map-marker-alt"></i> ${event.venue}</p>
                <p style="margin-bottom: 8px;"><i class="fas fa-user"></i> ${appState.currentUser ? appState.currentUser.name : 'User'}</p>
                <p style="margin-bottom: 15px;"><i class="fas fa-ticket-alt"></i> Registration ID: <strong>${myEvent.registrationId}</strong></p>
                <p style="color: #5f6368; font-size: 14px; margin-bottom: 20px;">Show this QR code at the event entry point for scanning.</p>
                <button class="btn btn-primary" onclick="downloadPass('${myEvent.registrationId}')">
                    <i class="fas fa-download"></i> Download Pass
                </button>
                <button class="btn btn-small" style="margin-left:12px; background-color:#f0f0f0; color:#333; border:1px solid #ddd;" onclick="openGoogleMapsDirections('${event.venue}', '${event.city}')">
                    <i class="fas fa-map-location-dot" style="color: var(--primary-color);"></i> Directions
                </button>
                <button class="btn btn-danger btn-small" style="margin-left:12px" onclick="unregisterPass('${myEvent.registrationId}')">
                    <i class="fas fa-times-circle"></i> Unregister
                </button>
            </div>
        `;
        container.appendChild(passElement);
    });

    // Add bulk unregister control
    const bulkControl = document.createElement('div');
    bulkControl.style.cssText = 'display:flex; justify-content:flex-end; margin-top:8px; gap:10px;';
    bulkControl.innerHTML = `<button class="btn btn-danger" onclick="unregisterAllPasses()"><i class="fas fa-trash-alt"></i> Unregister All</button>`;
    container.insertBefore(bulkControl, container.firstChild);
}

// ============================================
// CRUD OPERATIONS
// ============================================

function editEvent(eventId) {
    showNotification(`Edit event ${eventId} - Full implementation coming soon`, 'info', 'Coming Soon');
}

function deleteEvent(eventId) {
    showConfirmation('Are you sure you want to delete this event?', 'Confirm Delete', function() {
        appState.events = appState.events.filter(e => e.id !== eventId);
        updateEventsTable();
        showNotification('Event deleted successfully!', 'success', 'Event Deleted');
    });
}

function deleteTransaction(transactionId) {
    showConfirmation('Are you sure you want to delete this transaction?', 'Confirm Delete', function() {
        appState.transactions = appState.transactions.filter(t => t.id !== transactionId);
        updateTransactionsTable();
        showNotification('Transaction deleted successfully!', 'success', 'Transaction Deleted');
    });
}

function editSponsor(sponsorId) {
    showNotification(`Edit sponsor ${sponsorId} - Full implementation coming soon`, 'info', 'Coming Soon');
}

function deleteSponsor(sponsorId) {
    showConfirmation('Are you sure you want to delete this sponsor?', 'Confirm Delete', function() {
        appState.sponsors = appState.sponsors.filter(s => s.id !== sponsorId);
        updateSponsorsTable();
        showNotification('Sponsor deleted successfully!', 'success', 'Sponsor Deleted');
    });
}

function editBooking(bookingId) {
    showNotification(`Edit booking ${bookingId} - Full implementation coming soon`, 'info', 'Coming Soon');
}

function deleteBooking(bookingId) {
    showConfirmation('Are you sure you want to delete this booking?', 'Confirm Delete', function() {
        appState.bookings = appState.bookings.filter(b => b.id !== bookingId);
        updateBookingsTable();
        showNotification('Booking deleted successfully!', 'success', 'Booking Deleted');
    });
}

// ============================================
// USER FUNCTIONS
// ============================================

function registerForEvent(eventId) {
    const event = appState.events.find(e => e.id === eventId);
    if (!event) return;

    // Check if already registered
    if (appState.myEvents.some(e => e.id === eventId)) {
        showNotification('You are already registered for this event!', 'warning', 'Already Registered');
        return;
    }

    // Check capacity
    if (event.registered >= event.capacity) {
        showNotification('This event is at full capacity!', 'warning', 'Event Full');
        return;
    }

    // Register user
    const registrationId = 'REG' + Date.now().toString().substring(7);
    appState.myEvents.push({
        id: eventId,
        registrationId: registrationId,
        status: 'registered',
        registrationDate: new Date().toISOString().split('T')[0]
    });

    event.registered++;
    localStorage.setItem('myEvents', JSON.stringify(appState.myEvents));
    
    updateDashboardDisplays('events');
    showNotification(`Successfully registered for "${event.name}"!\nRegistration ID: ${registrationId}`, 'success', 'Registration Complete');
}

function downloadPass(registrationId) {
    // Find the event associated with this registration
    const myEvent = appState.myEvents.find(e => e.registrationId === registrationId);
    if (!myEvent) {
        showNotification('Pass not found.', 'error', 'Error');
        return;
    }
    
    const event = appState.events.find(e => e.id === myEvent.id);
    if (!event) {
        showNotification('Event details not found.', 'error', 'Error');
        return;
    }
    
    // Show the QR modal
    showQRCodeModal(event, registrationId);
}

function unregisterPass(registrationId) {
    showConfirmation('Are you sure you want to unregister and delete this pass?', 'Confirm Unregister', function() {
        const idx = appState.myEvents.findIndex(p => p.registrationId === registrationId);
        if (idx === -1) {
            showNotification('Pass not found.', 'error', 'Error');
            return;
        }

        const myEvent = appState.myEvents[idx];
        // decrement registered count on the event if present
        const ev = appState.events.find(e => e.id === myEvent.id);
        if (ev && typeof ev.registered === 'number' && ev.registered > 0) ev.registered--;

        // remove from user's passes
        appState.myEvents.splice(idx, 1);
        localStorage.setItem('myEvents', JSON.stringify(appState.myEvents));

        // refresh UI
        updateUserPasses();
        updateEventsTable();

        showNotification('Pass unregistered and removed successfully.', 'success', 'Unregistered');
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Open Google Maps Directions
function openGoogleMapsDirections(venue, city) {
    if (!venue) {
        showNotification('Venue location not available.', 'warning', 'No Location');
        return;
    }
    
    // Construct the search query
    const location = city ? `${venue}, ${city}` : venue;
    
    // Create Google Maps Directions URL
    // Using the search query to find the location and open directions
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}/`;
    
    // Open in new tab
    window.open(mapsUrl, '_blank');
    
    showNotification(`Opening directions for ${venue}...`, 'info', 'Opening Maps');
}

// -- Add flows
 
function openModal() {
    // used by a simple + Add Event button in the header
    openAddModal('event');
}

function addEventFlow() { openAddModal('event'); }

function addTransactionFlow() { openAddModal('transaction'); }

function addSponsorFlow() { openAddModal('sponsor'); }

function addBookingFlow() { openAddModal('booking'); }


function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Add-modal helpers and handlers
function openAddModal(type = 'event') {
    const modal = document.getElementById('add-modal');
    if (!modal) return;
    modal.classList.add('active');
    const title = document.getElementById('add-modal-title');
    const selector = document.getElementById('add-type');
    if (selector) selector.value = type;
    switchAddForm(type);
    if (title) title.textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    // set sensible defaults
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('add-event-date'); if (dateInput) dateInput.value = today;
    const txDate = document.getElementById('add-tx-date'); if (txDate) txDate.value = today;
    const bkDate = document.getElementById('add-bk-date'); if (bkDate) bkDate.value = today;
}

function closeAddModal() {
    const modal = document.getElementById('add-modal');
    if (!modal) return;
    modal.classList.remove('active');
    // reset forms
    document.querySelectorAll('#add-modal .modal-form').forEach(f => f.reset());
    document.querySelectorAll('#add-modal .modal-form').forEach(f => f.classList.remove('active'));
}

function switchAddForm(type) {
    document.querySelectorAll('#add-modal .modal-form').forEach(f => f.classList.remove('active'));
    const idMap = {
        event: 'add-event-form',
        transaction: 'add-transaction-form',
        sponsor: 'add-sponsor-form',
        booking: 'add-booking-form'
    };
    const formId = idMap[type] || idMap.event;
    const form = document.getElementById(formId);
    if (form) form.classList.add('active');
    const title = document.getElementById('add-modal-title');
    if (title) title.textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
}

function handleAddEventSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('add-event-name').value.trim();
    const date = document.getElementById('add-event-date').value;
    const time = document.getElementById('add-event-time').value || '10:00';
    const venue = document.getElementById('add-event-venue').value || 'TBD';
    const capacity = parseInt(document.getElementById('add-event-capacity').value || '100', 10) || 100;
    const fee = parseFloat(document.getElementById('add-event-fee').value || '0') || 0;
    const organizer = document.getElementById('add-event-organizer').value || '';
    const description = document.getElementById('add-event-description').value || '';

    if (!name || !date) {
        showNotification('Please provide event name and date.', 'error', 'Missing Information');
        return;
    }

    const newId = appState.events.reduce((max, e) => Math.max(max, e.id || 0), 0) + 1;
    const ev = { id: newId, name, date, time, venue, city: '', capacity, registered: 0, organizer, category: 'general', description, fee, image: '', status: 'upcoming' };
    appState.events.push(ev);
    updateEventsTable();
    closeAddModal();
    showNotification('Event created successfully.', 'success', 'Event Created');
}

function handleAddTransactionSubmit(e) {
    e.preventDefault();
    const description = document.getElementById('add-tx-description').value.trim();
    const date = document.getElementById('add-tx-date').value;
    const category = document.getElementById('add-tx-category').value || 'general';
    const type = document.getElementById('add-tx-type').value || 'income';
    const amount = parseFloat(document.getElementById('add-tx-amount').value || '0') || 0;
    const approvedBy = document.getElementById('add-tx-approvedBy').value || (appState.currentUser ? appState.currentUser.name : 'Admin');
    const event = document.getElementById('add-tx-event').value || '';
    if (!description || !date) {
        showNotification('Please provide description and date.', 'error', 'Missing Information');
        return;
    }
    const newId = appState.transactions.reduce((max, t) => Math.max(max, t.id || 0), 0) + 1;
    const tx = { id: newId, date, description, category, type, amount, approvedBy, event };
    appState.transactions.push(tx);
    updateTransactionsTable();
    closeAddModal();
    showNotification('Transaction added successfully.', 'success', 'Transaction Added');
}

function handleAddSponsorSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('add-sp-name').value.trim();
    if (!name) {
        showNotification('Please provide sponsor name.', 'error', 'Missing Information');
        return;
    }
    const contact = document.getElementById('add-sp-contact').value || '';
    const email = document.getElementById('add-sp-email').value || '';
    const phone = document.getElementById('add-sp-phone').value || '';
    const amount = parseFloat(document.getElementById('add-sp-amount').value || '0') || 0;
    const status = document.getElementById('add-sp-status').value || 'confirmed';
    const event = document.getElementById('add-sp-event').value || '';
    const newId = appState.sponsors.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1;
    const sp = { id: newId, name, contact, email, phone, amount, status, industry: '', event };
    appState.sponsors.push(sp);
    updateSponsorsTable();
    closeAddModal();
    showNotification('Sponsor added successfully.', 'success', 'Sponsor Added');
}

function handleAddBookingSubmit(e) {
    e.preventDefault();
    const vendor = document.getElementById('add-bk-vendor').value.trim();
    if (!vendor) {
        showNotification('Please provide vendor name.', 'error', 'Missing Information');
        return;
    }
    const event = document.getElementById('add-bk-event').value || '';
    const type = document.getElementById('add-bk-type').value || 'food';
    const amount = parseFloat(document.getElementById('add-bk-amount').value || '0') || 0;
    const date = document.getElementById('add-bk-date').value || new Date().toISOString().split('T')[0];
    const status = document.getElementById('add-bk-status').value || 'confirmed';
    const newId = appState.bookings.reduce((max, b) => Math.max(max, b.id || 0), 0) + 1;
    const booking = { id: newId, vendor, event, type, amount, date, status };
    appState.bookings.push(booking);
    updateBookingsTable();
    closeAddModal();
    showNotification('Booking added successfully.', 'success', 'Booking Added');
}

// Camera permission check
async function checkCameraPermissions() {
    try {
        const result = await navigator.permissions.query({ name: 'camera' });
        console.log('Camera permission status:', result.state);
        
        if (result.state === 'denied') {
            showNotification('Camera permission has been denied. Please enable it in your browser settings.', 'error', 'Permission Denied');
        } else if (result.state === 'granted') {
            showNotification('Camera permission is granted. You can now start the camera.', 'success', 'Permission Granted');
        } else if (result.state === 'prompt') {
            showNotification('Camera permission will be requested when you click "Start Camera".', 'info', 'Permission Info');
        }
    } catch (error) {
        console.log('Permission query not supported:', error);
    }
}

// QR scan state
let qrStream = null;

function startQRScan() {
    const video = document.getElementById('qr-video');
    if (!video) {
        showNotification('Video element not found.', 'error', 'Camera Error');
        return;
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showNotification('Camera access not supported in this browser. Use manual entry.', 'warning', 'Camera Not Supported');
        return;
    }

    const constraints = {
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'environment'
        },
        audio: false
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            qrStream = stream;
            video.srcObject = stream;
            
            // Wait for video to load metadata before playing
            video.onloadedmetadata = () => {
                video.play()
                    .then(() => {
                        showNotification('Camera started successfully!', 'success', 'Camera Active');
                    })
                    .catch(playError => {
                        console.error('Play error:', playError);
                        showNotification('Camera started but unable to play. Please try again.', 'error', 'Playback Error');
                    });
            };
        })
        .catch(err => {
            console.error('getUserMedia error:', err);
            let errorMsg = 'Unable to access camera. ';
            
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDenied') {
                errorMsg += 'Camera permission denied. Please allow camera access in your browser settings.';
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMsg += 'No camera found on this device.';
            } else if (err.name === 'NotReadableError') {
                errorMsg += 'Camera is already in use by another application.';
            } else {
                errorMsg += 'Please allow camera permissions or use manual entry.';
            }
            
            showNotification(errorMsg, 'error', 'Camera Error');
        });
}

function stopQRScan() {
    const video = document.getElementById('qr-video');
    
    if (qrStream) {
        qrStream.getTracks().forEach(track => {
            track.stop();
        });
        qrStream = null;
    }
    
    if (video) {
        video.pause();
        video.srcObject = null;
        showNotification('Camera stopped.', 'info', 'Camera Stopped');
    }
}

function captureFrame() {
    const video = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    
    if (!video || !canvas) {
        showNotification('Camera not started. Please click "Start Camera" first.', 'error', 'Camera Error');
        return;
    }
    
    if (!video.srcObject) {
        showNotification('No camera stream active. Please start the camera first.', 'error', 'Camera Error');
        return;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        if (canvas.width === 0 || canvas.height === 0) {
            showNotification('Video stream not ready. Please wait a moment and try again.', 'warning', 'Camera Warning');
            return;
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        showNotification('Frame captured successfully! Enter the Registration ID below.', 'success', 'Frame Captured');
        
        // Optional: Show the captured frame briefly in a modal or preview
        const detected = prompt('Enter detected Registration ID (or paste):', document.getElementById('qr-manual-input').value || '');
        if (detected) {
            document.getElementById('qr-manual-input').value = detected;
        }
    } catch (error) {
        console.error('Capture error:', error);
        showNotification('Error capturing frame. Please try again.', 'error', 'Capture Error');
    }
}

function processScan() {
    const input = document.getElementById('qr-manual-input');
    let code = input ? input.value.trim() : '';
    if (!code) code = prompt('Enter Registration ID to process:');
    if (!code) {
        showNotification('No registration ID provided.', 'error', 'Missing Information');
        return;
    }
    processScannedCode(code);
    if (input) input.value = '';
}

function processScannedCode(regId) {
    const name = prompt('Attendee name (optional):', '') || 'Guest';
    const eventName = prompt('Event name (optional):', '') || 'General Event';
    const entryPoint = 'Main Gate';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // add to crowdData (newest first)
    appState.crowdData.unshift({ time: timeStr, name, event: eventName, entryPoint, status: 'checkedin', registrationId: regId });
    updateCrowdTable();
    showNotification(`Checked in ${name} (${regId}) at ${timeStr}`, 'success', 'Check-in Successful');
}

function unregisterAllPasses() {
    showConfirmation('Are you sure you want to unregister ALL your passes? This cannot be undone.', 'Confirm Unregister All', function() {
        // decrement registered counts for events where applicable
        appState.myEvents.forEach(myEvent => {
            const ev = appState.events.find(e => e.id === myEvent.id);
            if (ev && typeof ev.registered === 'number' && ev.registered > 0) ev.registered--;
        });

        // clear user's passes
        appState.myEvents = [];
        localStorage.setItem('myEvents', JSON.stringify(appState.myEvents));

        // refresh UI
        updateUserPasses();
        updateEventsTable();

        showNotification('All passes have been unregistered and removed.', 'success', 'All Passes Removed');
    });
}

function unregisterAllForEvent(eventId) {
    if (appState.userType !== 'admin') {
        showNotification('Only administrators can unregister all students for an event.', 'error', 'Permission Denied');
        return;
    }
    showConfirmation('Unregister ALL students from this event? This will remove all passes for the event.', 'Confirm Mass Unregister', function() {
        // count how many registrations will be removed
        const removed = appState.myEvents.filter(p => p.id === eventId).length;

        // remove matching registrations
        appState.myEvents = appState.myEvents.filter(p => p.id !== eventId);
        localStorage.setItem('myEvents', JSON.stringify(appState.myEvents));

        // decrement registered count on the event
        const ev = appState.events.find(e => e.id === eventId);
        if (ev) {
            ev.registered = Math.max(0, (ev.registered || 0) - removed);
        }

        // refresh UI
        updateUserPasses();
        updateEventsTable();

        showNotification(`${removed} registration(s) removed for the event.`, 'success', 'Mass Unregister Complete');
    });
}


// ============================================
// SEARCH / FIND
// ============================================

function createSearchModal() {
    if (document.getElementById('search-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Search Results</h3>
                <button class="modal-close" id="close-search-modal">&times;</button>
            </div>
            <div class="modal-body" id="search-modal-body">
                <!-- results injected here -->
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    // close handlers
    document.getElementById('close-search-modal').addEventListener('click', () => hideSearchModal());
    modal.addEventListener('click', function (e) { if (e.target === this) hideSearchModal(); });
}

function showSearchModal(html) {
    createSearchModal();
    const modal = document.getElementById('search-modal');
    const body = document.getElementById('search-modal-body');
    if (!modal || !body) return;
    body.innerHTML = html;
    modal.classList.add('active');
}

function hideSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.remove('active');
}

function performSearch(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
        showSearchModal('<p style="color:#5f6368">Please enter a search query.</p>');
        return;
    }

    // search events
    const events = appState.events.filter(e => {
        return (e.name && e.name.toLowerCase().includes(q)) ||
               (e.description && e.description.toLowerCase().includes(q)) ||
               (e.venue && e.venue.toLowerCase().includes(q)) ||
               (e.organizer && e.organizer.toLowerCase().includes(q)) ||
               (e.city && e.city.toLowerCase().includes(q));
    });

    // sponsors
    const sponsors = appState.sponsors.filter(s => (s.name && s.name.toLowerCase().includes(q)) || (s.contact && s.contact.toLowerCase().includes(q)) || (s.email && s.email.toLowerCase().includes(q)));

    // transactions
    const transactions = appState.transactions.filter(t => (t.description && t.description.toLowerCase().includes(q)) || (t.category && t.category.toLowerCase().includes(q)) || (t.event && t.event.toLowerCase().includes(q)));

    // bookings
    const bookings = appState.bookings.filter(b => (b.vendor && b.vendor.toLowerCase().includes(q)) || (b.event && b.event.toLowerCase().includes(q)));

    // my passes
    const passes = appState.myEvents.filter(p => (p.registrationId && p.registrationId.toLowerCase().includes(q)) || (appState.events.find(e=>e.id===p.id) && appState.events.find(e=>e.id===p.id).name.toLowerCase().includes(q)));

    // remember matches so event list can highlight them
    appState.lastSearchMatches = events.map(e => e.id);

    let html = '';

    html += '<div style="display:flex; gap:18px; flex-direction:column;">';

    // Events
    html += '<div><h4>Events</h4>';
    if (events.length) {
        html += '<ul>' + events.map(ev => `<li style="margin-bottom:8px;"><strong>${ev.name}</strong> — ${formatDate(ev.date)} &nbsp; <button class="btn btn-small" onclick="goToEvent(${ev.id})">Open</button></li>`).join('') + '</ul>';
    } else {
        html += '<p style="color:#5f6368">No events found.</p>';
    }
    html += '</div>';

    // Sponsors
    html += '<div><h4>Sponsors</h4>';
    if (sponsors.length) {
        html += '<ul>' + sponsors.map(s => `<li style="margin-bottom:8px;"><strong>${s.name}</strong> — ${s.contact || ''} &nbsp; <button class="btn btn-small" onclick="showDashboardPage('sponsors')">Open</button></li>`).join('') + '</ul>';
    } else {
        html += '<p style="color:#5f6368">No sponsors found.</p>';
    }
    html += '</div>';

    // Transactions
    html += '<div><h4>Transactions</h4>';
    if (transactions.length) {
        html += '<ul>' + transactions.map(t => `<li style="margin-bottom:8px;"><strong>${t.description}</strong> — ${formatDate(t.date)} &nbsp; <button class="btn btn-small" onclick="showDashboardPage('funds')">Open</button></li>`).join('') + '</ul>';
    } else {
        html += '<p style="color:#5f6368">No transactions found.</p>';
    }
    html += '</div>';

    // Bookings
    html += '<div><h4>Bookings</h4>';
    if (bookings.length) {
        html += '<ul>' + bookings.map(b => `<li style="margin-bottom:8px;"><strong>${b.vendor}</strong> — ${b.event} &nbsp; <button class="btn btn-small" onclick="showDashboardPage('stalls')">Open</button></li>`).join('') + '</ul>';
    } else {
        html += '<p style="color:#5f6368">No bookings found.</p>';
    }
    html += '</div>';

    // Passes
    html += '<div><h4>Your Passes</h4>';
    if (passes.length) {
        html += '<ul>' + passes.map(p => {
            const ev = appState.events.find(e=>e.id===p.id) || {};
            return `<li style="margin-bottom:8px;"><strong>${ev.name || 'Event'}</strong> — ${p.registrationId} &nbsp; <button class="btn btn-small" onclick="showDashboardPage('passes')">Open</button></li>`;
        }).join('') + '</ul>';
    } else {
        html += '<p style="color:#5f6368">No passes found.</p>';
    }
    html += '</div>';

    html += '</div>';

    showSearchModal(html);
}

function goToEvent(eventId) {
    hideSearchModal();
    appState.eventFilter = 'all';
    showDashboardPage('events');
    // slight delay to ensure page is shown before updating
    setTimeout(() => {
        updateEventsTable();
        // ensure the specific event is highlighted
        appState.lastSearchMatches = [eventId];
        setTimeout(() => updateEventsTable(), 60);
    }, 50);
}

function clearSearchHighlights() {
    if (!Array.isArray(appState.lastSearchMatches)) return;
    appState.lastSearchMatches.forEach(id => {
        const c = document.getElementById(`event-card-${id}`);
        const r = document.getElementById(`event-row-${id}`);
        if (c) c.classList.remove('search-highlight');
        if (r) r.classList.remove('search-highlight-row');
    });
    appState.lastSearchMatches = [];
}

// ============================================
// AI CHATBOT FUNCTIONALITY
// ============================================

class EventraXChatbot {
    constructor() {
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.widget = document.getElementById('chatbot-widget');
        this.header = document.getElementById('chatbot-header');
        this.minimizeBtn = document.getElementById('chatbot-minimize');
        this.closeBtn = document.getElementById('chatbot-close');
        this.isDragging = false;
        this.offset = { x: 0, y: 0 };
        
        // State management for conversational flow
        this.currentFlow = null;
        this.flowData = {};
        
        this.init();
    }

    init() {
        // Send button click
        this.sendBtn.addEventListener('click', () => this.handleUserInput());
        
        // Input field enter key
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Dragging functionality
        this.header.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Minimize/Close buttons
        this.minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        this.closeBtn.addEventListener('click', () => this.closeChat());
    }

    startDrag(e) {
        this.isDragging = true;
        const rect = this.widget.getBoundingClientRect();
        this.offset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    drag(e) {
        if (!this.isDragging) return;
        this.widget.style.left = (e.clientX - this.offset.x) + 'px';
        this.widget.style.right = 'auto';
        this.widget.style.bottom = 'auto';
        this.widget.style.top = (e.clientY - this.offset.y) + 'px';
    }

    stopDrag() {
        this.isDragging = false;
    }

    toggleMinimize() {
        this.widget.classList.toggle('minimized');
    }

    closeChat() {
        this.widget.style.display = 'none';
    }

    handleUserInput() {
        const message = this.inputField.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.inputField.value = '';

        // Process message and get response
        setTimeout(() => {
            // If we're in a flow, handle the flow response
            if (this.currentFlow) {
                this.handleFlowResponse(message);
            } else {
                const response = this.processUserMessage(message);
                this.addMessage(response, 'bot');
            }
        }, 400);
    }

    handleQuickAction(action) {
        let userMsg = '';

        switch(action) {
            case 'add-event':
                userMsg = 'Add a new event';
                this.startAddEventFlow();
                break;
            case 'add-sponsor':
                userMsg = 'Add a new sponsor';
                this.startAddSponsorFlow();
                break;
            case 'list-events':
                userMsg = 'Show all events';
                this.addMessage(this.handleListEventsFlow(), 'bot');
                return;
            case 'list-sponsors':
                userMsg = 'Show all sponsors';
                this.addMessage(this.handleListSponsorsFlow(), 'bot');
                return;
        }

        this.addMessage(userMsg, 'user');
    }

    processUserMessage(message) {
        const msg = message.toLowerCase();

        // Add event keywords
        if (msg.includes('add') && (msg.includes('event') || msg.includes('create'))) {
            this.startAddEventFlow();
            return null;
        }

        // Remove/delete event
        if ((msg.includes('remove') || msg.includes('delete')) && msg.includes('event')) {
            return this.handleDeleteEventFlow();
        }

        // Add sponsor
        if ((msg.includes('add') || msg.includes('create')) && msg.includes('sponsor')) {
            this.startAddSponsorFlow();
            return null;
        }

        // Remove sponsor
        if ((msg.includes('remove') || msg.includes('delete')) && msg.includes('sponsor')) {
            return this.handleDeleteSponsorFlow();
        }

        // List events
        if ((msg.includes('show') || msg.includes('list') || msg.includes('all')) && msg.includes('event')) {
            return this.handleListEventsFlow();
        }

        // List sponsors
        if ((msg.includes('show') || msg.includes('list') || msg.includes('all')) && msg.includes('sponsor')) {
            return this.handleListSponsorsFlow();
        }

        // Help/general questions
        if (msg.includes('help') || msg.includes('can you')) {
            return `📚 Here's what I can do for you:\n\n✨ **Event Management:**\n• Add new events\n• Remove events\n• View all events\n\n✨ **Sponsor Management:**\n• Add sponsors\n• Remove sponsors\n• View all sponsors\n\nJust ask me or use the quick buttons above!`;
        }

        // Default response
        return `😊 I didn't quite understand that. Try asking me to:\n\n• "Add an event"\n• "Add a sponsor"\n• "Show all events"\n• "Show all sponsors"\n\nOr use the quick action buttons!`;
    }

    // ============ ADD EVENT FLOW ============
    startAddEventFlow() {
        this.currentFlow = 'add-event';
        this.flowData = { step: 1 };
        this.addMessage(`📝 Let's create a new event!\n\n✏️ What would you like to name the event?`, 'bot');
    }

    handleFlowResponse(message) {
        if (this.currentFlow === 'add-event') {
            this.handleAddEventResponse(message);
        } else if (this.currentFlow === 'add-sponsor') {
            this.handleAddSponsorResponse(message);
        }
    }

    handleAddEventResponse(message) {
        const step = this.flowData.step;

        if (step === 1) {
            this.flowData.title = message;
            this.flowData.step = 2;
            this.addMessage(`Great! Event name: **${message}**\n\n📅 What's the event date? (format: YYYY-MM-DD, e.g., 2026-02-15)`, 'bot');
        } else if (step === 2) {
            // Validate date format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(message)) {
                this.addMessage(`❌ Invalid date format. Please use YYYY-MM-DD format (e.g., 2026-02-15)`, 'bot');
                return;
            }
            this.flowData.date = message;
            this.flowData.step = 3;
            this.addMessage(`Perfect! Date set to: **${message}**\n\n📂 What category? (e.g., Tech, Cultural, Sports, Workshop, Competition)`, 'bot');
        } else if (step === 3) {
            this.flowData.category = message;
            this.flowData.step = 4;
            this.addMessage(`Excellent! Category: **${message}**\n\n📍 What's the location/venue?`, 'bot');
        } else if (step === 4) {
            this.flowData.location = message;
            
            // Create and save the event
            const newEvent = {
                id: appState.events.length + 1,
                title: this.flowData.title,
                date: this.flowData.date,
                category: this.flowData.category,
                location: this.flowData.location,
                description: `Event: ${this.flowData.title}`,
                registeredCount: 0,
                image: 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(this.flowData.title),
                status: 'upcoming'
            };
            
            appState.events.push(newEvent);
            
            const response = `✅ Perfect! Your event has been created successfully!\n\n🎉 **Event Summary:**\n• **Name:** ${newEvent.title}\n• **Date:** ${newEvent.date}\n• **Category:** ${newEvent.category}\n• **Location:** ${newEvent.location}\n\nThe event is now live on the platform!`;
            
            this.addMessage(response, 'bot');
            
            // Reset flow
            this.currentFlow = null;
            this.flowData = {};
        }
    }

    // ============ ADD SPONSOR FLOW ============
    startAddSponsorFlow() {
        this.currentFlow = 'add-sponsor';
        this.flowData = { step: 1 };
        this.addMessage(`🤝 Let's add a new sponsor!\n\n✏️ What's the sponsor's name?`, 'bot');
    }

    handleAddSponsorResponse(message) {
        const step = this.flowData.step;

        if (step === 1) {
            this.flowData.name = message;
            this.flowData.step = 2;
            this.addMessage(`Great! Sponsor: **${message}**\n\n📂 What category? (e.g., Tech, Food, Finance, Logistics)`, 'bot');
        } else if (step === 2) {
            this.flowData.category = message;
            this.flowData.step = 3;
            this.addMessage(`Perfect! Category: **${message}**\n\n💰 What's the sponsorship amount?`, 'bot');
        } else if (step === 3) {
            // Validate amount is a number
            if (isNaN(message) || message.trim() === '') {
                this.addMessage(`❌ Please enter a valid amount (numbers only)`, 'bot');
                return;
            }
            
            this.flowData.amount = parseInt(message);
            
            // Create and save the sponsor
            const newSponsor = {
                id: appState.sponsors.length + 1,
                name: this.flowData.name,
                category: this.flowData.category,
                amount: this.flowData.amount,
                logo: 'https://via.placeholder.com/100?text=' + encodeURIComponent(this.flowData.name),
                description: `${this.flowData.name} - ${this.flowData.category} Sponsor`
            };
            
            appState.sponsors.push(newSponsor);
            
            const response = `✅ Sponsor added successfully!\n\n💼 **Sponsor Summary:**\n• **Name:** ${newSponsor.name}\n• **Category:** ${newSponsor.category}\n• **Amount:** $${newSponsor.amount}\n\nThank you for the partnership!`;
            
            this.addMessage(response, 'bot');
            
            // Reset flow
            this.currentFlow = null;
            this.flowData = {};
        }
    }

    handleDeleteEventFlow() {
        if (appState.events.length === 0) {
            return "📭 There are no events to delete.";
        }
        
        const eventsList = appState.events.map((e, i) => `${i + 1}. ${e.title}`).join('\n');
        return `🗑️ Here are your current events:\n\n${eventsList}\n\nPlease provide the event name or number you'd like to delete.`;
    }

    handleDeleteSponsorFlow() {
        if (appState.sponsors.length === 0) {
            return "📭 There are no sponsors to delete.";
        }
        
        const sponsorsList = appState.sponsors.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
        return `🗑️ Here are your current sponsors:\n\n${sponsorsList}\n\nPlease provide the sponsor name or number you'd like to remove.`;
    }

    handleListEventsFlow() {
        if (appState.events.length === 0) {
            return "📭 There are no events currently. Would you like to create one?";
        }

        const eventsList = appState.events
            .slice(0, 5)
            .map((e, i) => `${i + 1}. **${e.title}** - ${e.date}`)
            .join('\n');
        
        const more = appState.events.length > 5 ? `\n\n... and ${appState.events.length - 5} more events` : '';
        return `📋 **Your Events:**\n\n${eventsList}${more}`;
    }

    handleListSponsorsFlow() {
        if (appState.sponsors.length === 0) {
            return "📭 There are no sponsors currently. Would you like to add one?";
        }

        const sponsorsList = appState.sponsors
            .slice(0, 5)
            .map((s, i) => `${i + 1}. **${s.name}** - ${s.category}`)
            .join('\n');
        
        const more = appState.sponsors.length > 5 ? `\n\n... and ${appState.sponsors.length - 5} more sponsors` : '';
        return `👥 **Your Sponsors:**\n\n${sponsorsList}${more}`;
    }

    addMessage(text, sender = 'bot') {
        if (!text) return; // Skip if no text
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Convert text to HTML with line breaks and bold text
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        contentDiv.innerHTML = `<p>${formattedText}</p>`;

        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 50);
    }
}

// Initialize chatbot only when in admin/dashboard section
document.addEventListener('DOMContentLoaded', () => {
    // Check if chatbot widget exists (only present in dashboard-page)
    const chatbotWidget = document.getElementById('chatbot-widget');
    if (chatbotWidget) {
        new EventraXChatbot();
    }
});

