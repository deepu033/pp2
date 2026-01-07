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
    crowdData: []
};

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
    // Sample Events
    appState.events = [
        {
            id: 1,
            name: "Tech Symposium 2023",
            date: "2023-10-15",
            time: "10:00",
            venue: "Main Auditorium",
            city: "Mumbai",
            capacity: 500,
            registered: 320,
            organizer: "Computer Science Department",
            category: "tech",
            description: "Annual technology conference featuring talks from industry leaders, workshops, and coding competitions.",
            fee: 0,
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            status: "upcoming"
        },
        {
            id: 2,
            name: "Cultural Fest",
            date: "2023-10-22",
            time: "09:00",
            venue: "College Ground",
            city: "Delhi",
            capacity: 1000,
            registered: 580,
            organizer: "Student Council",
            category: "cultural",
            description: "A vibrant celebration of art, music, dance, and drama with performances, competitions, and food stalls.",
            fee: 100,
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            status: "upcoming"
        },
        {
            id: 3,
            name: "Startup Expo",
            date: "2023-11-05",
            time: "11:00",
            venue: "Business Block",
            city: "Bangalore",
            capacity: 300,
            registered: 210,
            organizer: "Entrepreneurship Cell",
            category: "workshop",
            description: "Showcasing innovative startups, networking with entrepreneurs, and pitch competitions with prize money.",
            fee: 50,
            image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            status: "upcoming"
        }
    ];

    // Sample Transactions
    appState.transactions = [
        { id: 1, date: "2023-10-10", description: "Sponsorship from TechCorp", category: "sponsorship", type: "income", amount: 75000, approvedBy: "Dr. Sharma", event: "Tech Symposium 2023" },
        { id: 2, date: "2023-10-12", description: "Stall bookings for Cultural Fest", category: "stall-booking", type: "income", amount: 45000, approvedBy: "Dr. Sharma", event: "Cultural Fest" },
        { id: 3, date: "2023-10-15", description: "College Grant for Tech Symposium", category: "college-grant", type: "income", amount: 50000, approvedBy: "Principal", event: "Tech Symposium 2023" }
    ];

    // Sample Sponsors
    appState.sponsors = [
        { id: 1, name: "TechCorp Inc.", contact: "Rajesh Kumar", email: "rajesh@techcorp.com", phone: "9876543210", amount: 75000, status: "confirmed", industry: "technology", event: "Tech Symposium 2023" },
        { id: 2, name: "EduSoft Solutions", contact: "Priya Sharma", email: "priya@edusoft.com", phone: "8765432109", amount: 50000, status: "confirmed", industry: "education", event: "Cultural Fest" }
    ];

    // Sample Bookings
    appState.bookings = [
        { id: 1, vendor: "Foodie's Delight", event: "Cultural Fest", type: "food", amount: 15000, date: "2023-10-10", status: "confirmed" },
        { id: 2, vendor: "Tech Gadgets Hub", event: "Tech Symposium", type: "tech", amount: 20000, date: "2023-10-12", status: "confirmed" }
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

    // Dashboard buttons
    document.getElementById('add-event-btn').addEventListener('click', () => alert('Add Event feature - Full implementation coming soon'));
    document.getElementById('quick-add-event').addEventListener('click', () => alert('Quick Add Event feature - Full implementation coming soon'));
    document.getElementById('add-transaction-btn').addEventListener('click', () => alert('Add Transaction feature - Full implementation coming soon'));
    document.getElementById('add-sponsor-btn').addEventListener('click', () => alert('Add Sponsor feature - Full implementation coming soon'));
    document.getElementById('add-booking-btn').addEventListener('click', () => alert('Add Booking feature - Full implementation coming soon'));
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
            alert('Invalid credentials. Demo Admin: admin@example.com / admin123');
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
            alert('Please enter valid email and password');
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
        alert('Passwords do not match!');
        return;
    }

    alert('Registration successful! You can now login.');
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
    if (confirm('Are you sure you want to logout?')) {
        appState.currentUser = null;
        appState.userType = null;

        document.getElementById('home-page').classList.remove('hidden');
        document.getElementById('dashboard-page').classList.add('hidden');

        switchModalTab('login');
    }
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
    document.getElementById('header-title').textContent = appState.userType === 'admin' ? 'EventHub Admin' : 'EventHub Dashboard';

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
    
    if (appState.userType === 'user') {
        // For users, show all available events with registration option
        appState.events.forEach(event => {
            const isRegistered = appState.myEvents.some(e => e.id === event.id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${formatDate(event.date)} at ${event.time}</td>
                <td>${event.venue}</td>
                <td>${event.capacity}</td>
                <td>${event.registered}</td>
                <td><span class="status-badge status-${event.status}">${event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span></td>
                <td>
                    <button class="btn ${isRegistered ? 'btn-success' : 'btn-primary'} btn-small" onclick="registerForEvent(${event.id})" ${isRegistered ? 'disabled' : ''}>
                        <i class="fas ${isRegistered ? 'fa-check' : 'fa-calendar-plus'}"></i>
                        ${isRegistered ? 'Registered' : 'Register'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        // For admins, show full management options
        appState.events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${formatDate(event.date)} at ${event.time}</td>
                <td>${event.venue}</td>
                <td>${event.capacity}</td>
                <td>${event.registered}</td>
                <td><span class="status-badge status-${event.status}">${event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small btn-icon" onclick="editEvent(${event.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-small btn-icon" onclick="deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
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
            </div>
        `;
        container.appendChild(passElement);
    });
}

// ============================================
// CRUD OPERATIONS
// ============================================

function editEvent(eventId) {
    alert(`Edit event ${eventId} - Full implementation coming soon`);
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        appState.events = appState.events.filter(e => e.id !== eventId);
        updateEventsTable();
        alert('Event deleted successfully!');
    }
}

function deleteTransaction(transactionId) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        appState.transactions = appState.transactions.filter(t => t.id !== transactionId);
        updateTransactionsTable();
        alert('Transaction deleted successfully!');
    }
}

function editSponsor(sponsorId) {
    alert(`Edit sponsor ${sponsorId} - Full implementation coming soon`);
}

function deleteSponsor(sponsorId) {
    if (confirm('Are you sure you want to delete this sponsor?')) {
        appState.sponsors = appState.sponsors.filter(s => s.id !== sponsorId);
        updateSponsorsTable();
        alert('Sponsor deleted successfully!');
    }
}

function editBooking(bookingId) {
    alert(`Edit booking ${bookingId} - Full implementation coming soon`);
}

function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        appState.bookings = appState.bookings.filter(b => b.id !== bookingId);
        updateBookingsTable();
        alert('Booking deleted successfully!');
    }
}

// ============================================
// USER FUNCTIONS
// ============================================

function registerForEvent(eventId) {
    const event = appState.events.find(e => e.id === eventId);
    if (!event) return;

    // Check if already registered
    if (appState.myEvents.some(e => e.id === eventId)) {
        alert('You are already registered for this event!');
        return;
    }

    // Check capacity
    if (event.registered >= event.capacity) {
        alert('This event is at full capacity!');
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
    alert(`Successfully registered for "${event.name}"!\\nRegistration ID: ${registrationId}`);
}

function downloadPass(registrationId) {
    alert(`Event pass for Registration ID: ${registrationId} downloaded! In a real application, this would generate a PDF with the QR code.`);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}