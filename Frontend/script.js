// SwiftRail Frontend Core Logic
const API_BASE_URL = 'http://127.0.0.1:8000';

// Global Authentication & Session Management
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function checkAuthentication() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    // Protected pages list
    const passengerPages = ['passenger_dashboard.html', 'booking_history.html', 'booking.html', 'payment.html'];
    const adminPages = ['admin_dashboard.html'];

    if (passengerPages.includes(currentPage) && !user) {
        window.location.href = 'login.html';
        return;
    }

    if (adminPages.includes(currentPage)) {
        if (!user || user.email !== 'admin@railway.com') {
            alert('Access Denied: Admin privileges required.');
            window.location.href = 'login.html';
            return;
        }
    }
}

// Update Navigation Links based on Login Status
function updateNavbar() {
    const user = getCurrentUser();
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    // Default Links
    let linksHTML = `
        <li><a href="index.html" class="${isActivePage('index.html')}"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="trains.html" class="${isActivePage('trains.html')}"><i class="fa-solid fa-magnifying-glass"></i> Search Trains</a></li>
    `;

    if (user) {
        if (user.email === 'admin@railway.com') {
            // Admin Links
            linksHTML += `
                <li><a href="admin_dashboard.html" class="${isActivePage('admin_dashboard.html')}"><i class="fa-solid fa-screwdriver-wrench"></i> Admin Panel</a></li>
                <li><a href="#" id="logout-btn" class="nav-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>
            `;
        } else {
            // Passenger Links
            linksHTML += `
                <li><a href="passenger_dashboard.html" class="${isActivePage('passenger_dashboard.html')}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a></li>
                <li><a href="booking_history.html" class="${isActivePage('booking_history.html')}"><i class="fa-solid fa-history"></i> My Bookings</a></li>
                <li><a href="#" id="logout-btn" class="nav-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout (${user.full_name.split(' ')[0]})</a></li>
            `;
        }
    } else {
        // Guest Links
        linksHTML += `
            <li><a href="login.html" class="${isActivePage('login.html')}"><i class="fa-solid fa-right-to-bracket"></i> Login</a></li>
            <li><a href="register.html" class="nav-btn"><i class="fa-solid fa-user-plus"></i> Register</a></li>
        `;
    }

    navLinks.innerHTML = linksHTML;

    // Attach logout event
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
}

function isActivePage(pageName) {
    const currentPage = window.location.pathname.split('/').pop();
    return currentPage === pageName ? 'active' : '';
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    updateNavbar();
    initializePageLogic();
});

// Route Pages Logic
function initializePageLogic() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        initHomePage();
    } else if (currentPage === 'login.html') {
        initLoginPage();
    } else if (currentPage === 'register.html') {
        initRegisterPage();
    } else if (currentPage === 'trains.html') {
        initTrainsPage();
    } else if (currentPage === 'train_details.html') {
        initTrainDetailsPage();
    } else if (currentPage === 'booking.html') {
        initBookingPage();
    } else if (currentPage === 'payment.html') {
        initPaymentPage();
    } else if (currentPage === 'booking_history.html') {
        initBookingHistoryPage();
    } else if (currentPage === 'passenger_dashboard.html') {
        initPassengerDashboardPage();
    } else if (currentPage === 'admin_dashboard.html') {
        initAdminDashboardPage();
    }
}

// Helper to format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

// Generate random seat number (e.g. C5-18, S3-42, A1-12)
function generateRandomSeat(coachType) {
    let coachCode = 'S';
    if (coachType.includes('AC First')) coachCode = 'H';
    else if (coachType.includes('AC 2')) coachCode = 'A';
    else if (coachType.includes('AC 3')) coachCode = 'B';
    else if (coachType.includes('Chair')) coachCode = 'C';
    
    const coachNum = Math.floor(Math.random() * 5) + 1;
    const seatNum = Math.floor(Math.random() * 64) + 1;
    return `${coachCode}${coachNum}-${seatNum}`;
}

// Generate unique transaction ID
function generateTxnId() {
    return 'TXN' + Math.floor(Math.random() * 900000000) + 100000000;
}

// =====================================================================
// 1. HOME PAGE LOGIC
// =====================================================================
function initHomePage() {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('search-date');
    if (dateInput) {
        dateInput.value = tomorrow.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0]; // Can't book past dates
    }

    // Handle home page train search submission
    const searchForm = document.getElementById('train-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const source = document.getElementById('search-source').value;
            const dest = document.getElementById('search-destination').value;
            const date = document.getElementById('search-date').value;

            if (source === dest) {
                alert('Source and destination stations cannot be the same!');
                return;
            }

            // Redirect to trains list page with parameters
            window.location.href = `trains.html?source=${source}&destination=${dest}&date=${date}`;
        });
    }

    // Popular Route quick search buttons
    const quickBtns = document.querySelectorAll('.quick-search-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const source = e.target.getAttribute('data-source');
            const dest = e.target.getAttribute('data-dest');
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            window.location.href = `trains.html?source=${source}&destination=${dest}&date=${tomorrowStr}`;
        });
    });

    // PNR Tracker search
    const pnrBtn = document.getElementById('pnr-search-btn');
    if (pnrBtn) {
        pnrBtn.addEventListener('click', async () => {
            const bookingId = document.getElementById('pnr-input').value.trim();
            const errDiv = document.getElementById('pnr-error');
            errDiv.style.display = 'none';

            if (!bookingId) {
                errDiv.textContent = 'Please enter a valid Booking ID.';
                errDiv.style.display = 'block';
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/bookings/`);
                if (!response.ok) throw new Error('Failed to fetch bookings list');
                const bookings = await response.json();
                
                const booking = bookings.find(b => b.booking_id == bookingId);
                if (!booking) {
                    errDiv.textContent = `No booking record found with PNR/Booking ID ${bookingId}.`;
                    errDiv.style.display = 'block';
                    return;
                }

                // Show PNR Ticket Modal
                showPNRDetails(booking);

            } catch (error) {
                console.error(error);
                errDiv.textContent = 'Error tracking PNR status. Server might be offline.';
                errDiv.style.display = 'block';
            }
        });
    }
}

function showPNRDetails(booking) {
    const modal = document.getElementById('pnr-modal');
    const container = document.getElementById('pnr-ticket-container');
    
    container.innerHTML = `
        <div class="ticket-header">
            <div>
                <h3 style="color: var(--primary-light); font-size: 1.4rem;">SWIFTRAIL RESERVATION SLIP</h3>
                <span style="font-size: 0.85rem; color: var(--text-secondary);">PNR / Booking Reference: #${booking.booking_id}</span>
            </div>
            <span class="status-pill ${booking.booking_status.toLowerCase()}">${booking.booking_status}</span>
        </div>
        <div class="ticket-grid">
            <div class="ticket-item">
                <span class="label">Passenger Name</span>
                <span class="val">${booking.passenger_name}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Train Name</span>
                <span class="val">${booking.train_name}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Journey Date</span>
                <span class="val">${booking.journey_date}</span>
            </div>
            <div class="ticket-item">
                <span class="label">From -> To</span>
                <span class="val">${booking.source} to ${booking.destination}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Coach Class</span>
                <span class="val">${booking.coach_type}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Allocated Seat</span>
                <span class="val" style="color: var(--primary-light); font-weight: 700;">${booking.seat_number}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Fare Charged</span>
                <span class="val">${formatCurrency(booking.total_fare)}</span>
            </div>
        </div>
        <div style="text-align: center; border-top: 1px dashed var(--border-color); padding-top: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
            Thank you for booking with SwiftRail. Have a safe journey!
        </div>
    `;

    modal.classList.add('active');

    // Attach modal buttons
    document.getElementById('pnr-modal-close').onclick = () => modal.classList.remove('active');
    document.getElementById('pnr-modal-ok').onclick = () => modal.classList.remove('active');

    // PDF download trigger
    document.getElementById('pnr-download-btn').onclick = () => {
        const element = document.getElementById('pnr-ticket-container');
        const opt = {
            margin:       1,
            filename:     `SwiftRail_Ticket_PNR_${booking.booking_id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, backgroundColor: '#070a13' },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };
}

// =====================================================================
// 2. LOGIN PAGE LOGIC
// =====================================================================
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const errDiv = document.getElementById('login-error');
        errDiv.style.display = 'none';

        try {
            const response = await fetch(`${API_BASE_URL}/passengers/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                errDiv.textContent = data.error || 'Authentication failed. Please try again.';
                errDiv.style.display = 'block';
                return;
            }

            // Authentication succeeded
            localStorage.setItem('currentUser', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.email === 'admin@railway.com') {
                window.location.href = 'admin_dashboard.html';
            } else {
                window.location.href = 'passenger_dashboard.html';
            }

        } catch (error) {
            console.error(error);
            errDiv.textContent = 'Server connection error. Is Django backend running?';
            errDiv.style.display = 'block';
        }
    });
}

// =====================================================================
// 3. REGISTER PAGE LOGIC
// =====================================================================
function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const full_name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const gender = document.getElementById('reg-gender').value;
        const age = parseInt(document.getElementById('reg-age').value);
        const address = document.getElementById('reg-address').value.trim();
        const password = document.getElementById('reg-password').value;
        const errDiv = document.getElementById('register-error');
        errDiv.style.display = 'none';

        try {
            const response = await fetch(`${API_BASE_URL}/passengers/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name, email, phone, gender, age, address, password })
            });

            const data = await response.json();
            if (!response.ok) {
                // Parse email uniqueness error or other validation errors
                let errorMsg = 'Failed to register passenger.';
                if (data.email) errorMsg = 'This email address is already registered.';
                else if (typeof data === 'object') errorMsg = Object.values(data).flat().join(' ');
                errDiv.textContent = errorMsg;
                errDiv.style.display = 'block';
                return;
            }

            alert('Registration successful! You can now log in.');
            window.location.href = 'login.html';

        } catch (error) {
            console.error(error);
            errDiv.textContent = 'Connection error. Please try again later.';
            errDiv.style.display = 'block';
        }
    });
}

// =====================================================================
// 4. TRAINS LIST PAGE LOGIC (Search Results)
// =====================================================================
let loadedSchedules = [];

function initTrainsPage() {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    const destination = params.get('destination');
    const date = params.get('date');

    const horizontalSearchForm = document.getElementById('horizontal-search-form');
    if (horizontalSearchForm) {
        if (source) document.getElementById('h-source').value = source;
        if (destination) document.getElementById('h-destination').value = destination;
        if (date) document.getElementById('h-date').value = date;

        horizontalSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const s = document.getElementById('h-source').value;
            const d = document.getElementById('h-destination').value;
            const dt = document.getElementById('h-date').value;
            if (s === d) {
                alert('Source and destination cannot match!');
                return;
            }
            window.location.href = `trains.html?source=${s}&destination=${d}&date=${dt}`;
        });
    }

    if (source && destination && date) {
        document.getElementById('search-results-title').textContent = `Matching Trains: ${source} to ${destination} on ${date}`;
        fetchMatchingSchedules(source, destination, date);
    } else {
        const container = document.getElementById('trains-list-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <i class="fa-solid fa-train-subway" style="font-size: 3rem; color: var(--text-muted);"></i>
                    <p style="margin-top: 1rem; color: var(--text-secondary);">Enter source, destination, and travel date above to search schedules.</p>
                </div>
            `;
        }
    }

    // Attach Event Listeners to filters
    const filterType = document.getElementById('filter-type');
    const filterTime = document.getElementById('filter-time');
    const sortBy = document.getElementById('sort-by');

    if (filterType) filterType.addEventListener('change', renderFilteredSchedules);
    if (filterTime) filterTime.addEventListener('change', renderFilteredSchedules);
    if (sortBy) sortBy.addEventListener('change', renderFilteredSchedules);
}

async function fetchMatchingSchedules(source, destination, date) {
    const container = document.getElementById('trains-list-container');
    try {
        // 1. Fetch schedules matching filters
        const res = await fetch(`${API_BASE_URL}/schedules/?source=${source}&destination=${destination}&departure_date=${date}`);
        if (!res.ok) throw new Error('Failed to fetch schedules.');
        
        loadedSchedules = await res.json();

        // 2. Fetch train details to append info like train number, train type, total seats
        const trainsRes = await fetch(`${API_BASE_URL}/trains/`);
        const trains = trainsRes.ok ? await trainsRes.json() : [];

        // 3. Fetch bookings for these schedules to calculate remaining live seats
        const bookingsRes = await fetch(`${API_BASE_URL}/bookings/`);
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];

        // Join train fields onto schedules
        loadedSchedules = loadedSchedules.map(sched => {
            const matchedTrain = trains.find(t => t.train_name.toLowerCase() === sched.train_name.toLowerCase());
            
            // Calculate dynamic booking counts
            const activeBookings = bookings.filter(b => 
                b.train_name.toLowerCase() === sched.train_name.toLowerCase() && 
                b.journey_date === sched.departure_date && 
                b.booking_status === 'Confirmed'
            );

            return {
                ...sched,
                train_number: matchedTrain ? matchedTrain.train_number : 'N/A',
                train_type: matchedTrain ? matchedTrain.train_type : 'Express',
                total_seats: matchedTrain ? matchedTrain.total_seats : 500,
                remaining_seats: Math.max(0, (matchedTrain ? matchedTrain.total_seats : 500) - activeBookings.length)
            };
        });

        renderFilteredSchedules();

    } catch (error) {
        console.error(error);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--danger);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem;"></i>
                    <p style="margin-top: 1rem;">Failed to fetch train schedules. Server connection error.</p>
                </div>
            `;
        }
    }
}

function renderFilteredSchedules() {
    const container = document.getElementById('trains-list-container');
    if (!container) return;

    const filterTypeVal = document.getElementById('filter-type').value;
    const filterTimeVal = document.getElementById('filter-time').value;
    const sortByVal = document.getElementById('sort-by').value;

    let filtered = [...loadedSchedules];

    // 1. Filter by Train Type
    if (filterTypeVal !== 'ALL') {
        filtered = filtered.filter(s => s.train_type === filterTypeVal);
    }

    // 2. Filter by Time Slots
    if (filterTimeVal !== 'ALL') {
        filtered = filtered.filter(s => {
            const hour = parseInt(s.departure_time.split(':')[0]);
            if (filterTimeVal === 'MORNING') return hour >= 6 && hour < 12;
            if (filterTimeVal === 'AFTERNOON') return hour >= 12 && hour < 18;
            if (filterTimeVal === 'EVENING') return hour >= 18 && hour < 24;
            if (filterTimeVal === 'NIGHT') return hour >= 0 && hour < 6;
            return true;
        });
    }

    // 3. Sorting Options
    filtered.sort((a, b) => {
        if (sortByVal === 'TIME_ASC') {
            return a.departure_time.localeCompare(b.departure_time);
        } else if (sortByVal === 'FARE_ASC') {
            return parseFloat(a.fare) - parseFloat(b.fare);
        } else if (sortByVal === 'DURATION_ASC') {
            // Simplified duration check: diff in departure hour
            const aHour = parseInt(a.departure_time.split(':')[0]);
            const bHour = parseInt(b.departure_time.split(':')[0]);
            return aHour - bHour;
        }
        return 0;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="glass-card" style="text-align: center; padding: 4rem;">
                <i class="fa-solid fa-face-frown" style="font-size: 3rem; color: var(--text-secondary);"></i>
                <h3 style="margin-top: 1rem;">No Trains Found</h3>
                <p style="color: var(--text-secondary); margin-top: 0.25rem;">Try adjusting your filters or date selection.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(sched => {
        // Visual theme mapping for train badges
        let typeClass = '';
        const trainType = sched.train_type.toLowerCase();
        if (trainType.includes('vande')) typeClass = 'vande';
        else if (trainType.includes('rajdhani')) typeClass = 'rajdhani';
        else if (trainType.includes('shatabdi')) typeClass = 'shatabdi';

        // Live Seat status class
        let seatStatus = 'available';
        let seatLabel = `${sched.remaining_seats} Seats Available`;
        if (sched.remaining_seats === 0) {
            seatStatus = 'waiting';
            seatLabel = 'Waitlist (WL)';
        } else if (sched.remaining_seats < 20) {
            seatStatus = 'rac';
            seatLabel = `${sched.remaining_seats} Seats (RAC)`;
        }

        return `
            <div class="glass-card train-card">
                <div class="train-title-sec">
                    <span class="train-type-badge ${typeClass}">${sched.train_type}</span>
                    <h3 style="margin-top: 0.5rem;">${sched.train_name}</h3>
                    <span style="font-size: 0.85rem; color: var(--text-secondary); font-family: var(--font-secondary);">Train No: ${sched.train_number}</span>
                </div>
                
                <div class="time-flow">
                    <div class="time-node">
                        <span class="time">${sched.departure_time}</span>
                        <span class="station">${sched.source}</span>
                    </div>
                    <div class="time-line"></div>
                    <div class="time-node" style="text-align: right;">
                        <span class="time">${sched.arrival_time}</span>
                        <span class="station">${sched.destination}</span>
                    </div>
                </div>

                <div>
                    <span class="availability-tag ${seatStatus}">
                        <i class="fa-solid fa-circle" style="font-size: 0.6rem;"></i> ${seatLabel}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">Live Availability</span>
                </div>

                <div class="fare-section">
                    <div class="price">${formatCurrency(sched.fare)}</div>
                    <a href="train_details.html?schedule_id=${sched.schedule_id}" class="btn" style="margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.85rem;">
                        View details <i class="fa-solid fa-angle-right"></i>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// =====================================================================
// 5. TRAIN DETAILS PAGE LOGIC
// =====================================================================
async function initTrainDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const scheduleId = params.get('schedule_id');
    const panel = document.getElementById('train-details-panel');
    if (!panel || !scheduleId) return;

    try {
        // Fetch specific schedule
        const res = await fetch(`${API_BASE_URL}/schedules/`);
        if (!res.ok) throw new Error();
        const schedules = await res.json();
        const sched = schedules.find(s => s.schedule_id == scheduleId);
        if (!sched) throw new Error('Schedule not found');

        // Fetch train details
        const trainsRes = await fetch(`${API_BASE_URL}/trains/`);
        const trains = trainsRes.ok ? await trainsRes.json() : [];
        const train = trains.find(t => t.train_name.toLowerCase() === sched.train_name.toLowerCase()) || {
            train_number: 'N/A', train_type: 'Express', total_seats: 500
        };

        // Fetch bookings for availability count
        const bookingsRes = await fetch(`${API_BASE_URL}/bookings/`);
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
        const activeBookings = bookings.filter(b => 
            b.train_name.toLowerCase() === sched.train_name.toLowerCase() && 
            b.journey_date === sched.departure_date && 
            b.booking_status === 'Confirmed'
        );

        // Predefine coach ratios and base fares
        const coaches = [
            { name: 'Sleeper', ratio: 0.4, capacity: Math.round(train.total_seats * 0.4), multiplier: 0.35 },
            { name: 'AC 3 Tier', ratio: 0.3, capacity: Math.round(train.total_seats * 0.25), multiplier: 1.0 },
            { name: 'AC 2 Tier', ratio: 0.2, capacity: Math.round(train.total_seats * 0.15), multiplier: 1.5 },
            { name: 'AC First Class', ratio: 0.1, capacity: Math.round(train.total_seats * 0.08), multiplier: 2.2 },
            { name: 'Chair Car', ratio: 0.2, capacity: Math.round(train.total_seats * 0.12), multiplier: 0.8 }
        ];

        // Filter valid coaches based on Train Type
        let activeCoaches = coaches;
        if (train.train_type === 'Vande Bharat' || train.train_type === 'Shatabdi') {
            activeCoaches = coaches.filter(c => c.name === 'Chair Car' || c.name === 'AC First Class');
        }

        let selectedCoach = activeCoaches[0].name;
        let selectedFare = parseFloat(sched.fare) * activeCoaches[0].multiplier;

        panel.innerHTML = `
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <span class="train-type-badge" style="background: rgba(99, 102, 241, 0.15); color: var(--primary-light);">${train.train_type}</span>
                    <h2 style="font-size: 2rem; margin-top: 0.5rem;">${sched.train_name}</h2>
                    <p style="color: var(--text-secondary);">Train No: ${train.train_number} | Schedule Reference: #${sched.schedule_id}</p>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">Journey Date</span>
                    <h3 style="font-size: 1.4rem; color: var(--primary-light);"><i class="fa-solid fa-calendar-check"></i> ${sched.departure_date}</h3>
                </div>
            </div>

            <!-- Route & Schedule Details Grid -->
            <div class="grid-3" style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.5rem; margin-bottom: 2rem;">
                <div>
                    <span style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase;">Departure Station</span>
                    <h3 style="margin: 0.25rem 0;">${sched.source}</h3>
                    <span style="font-size: 1.2rem; font-weight: 700; color: var(--primary-light);"><i class="fa-regular fa-clock"></i> ${sched.departure_time}</span>
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">Time Duration</span>
                    <strong style="margin: 0.25rem 0;"><i class="fa-solid fa-clock"></i> Direct Route</strong>
                    <div class="time-line" style="width: 100px;"></div>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase;">Arrival Station</span>
                    <h3 style="margin: 0.25rem 0;">${sched.destination}</h3>
                    <span style="font-size: 1.2rem; font-weight: 700; color: var(--primary-light);"><i class="fa-regular fa-clock"></i> ${sched.arrival_time}</span>
                </div>
            </div>

            <!-- Coach Selector -->
            <h3 style="margin-bottom: 1rem;"><i class="fa-solid fa-couch" style="color: var(--primary-light);"></i> Select Coach Class</h3>
            <div class="coach-grid" id="coach-selector-grid">
                ${activeCoaches.map((coach, index) => {
                    const bookedInCoach = activeBookings.filter(b => b.coach_type === coach.name).length;
                    const seatsLeft = Math.max(0, coach.capacity - bookedInCoach);
                    const fare = parseFloat(sched.fare) * coach.multiplier;
                    
                    let seatStatus = 'available';
                    let label = `${seatsLeft} available`;
                    if (seatsLeft === 0) {
                        seatStatus = 'waiting';
                        label = 'Waitlist (WL)';
                    } else if (seatsLeft < 10) {
                        seatStatus = 'rac';
                        label = `${seatsLeft} left (RAC)`;
                    }

                    return `
                        <div class="coach-card ${index === 0 ? 'selected' : ''}" data-coach="${coach.name}" data-fare="${fare}">
                            <h4>${coach.name}</h4>
                            <span class="seats availability-tag ${seatStatus}" style="justify-content: center; font-size: 0.8rem;">
                                <i class="fa-solid fa-circle" style="font-size: 0.5rem;"></i> ${label}
                            </span>
                            <div class="price">${formatCurrency(fare)}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Booking Action Panel -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 2rem; margin-top: 2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <span style="font-size: 0.9rem; color: var(--text-secondary);">Selected Coach Class: <strong id="selected-coach-name">${selectedCoach}</strong></span>
                    <h3 style="font-size: 2rem; margin-top: 0.25rem;">Total Fare: <span id="selected-coach-fare" style="color: var(--primary-light);">${formatCurrency(selectedFare)}</span></h3>
                </div>
                <button class="btn pulse-target" id="proceed-booking-btn" style="padding: 1rem 2.5rem; font-size: 1.1rem;">
                    <i class="fa-solid fa-circle-check"></i> Book Train Ticket
                </button>
            </div>
        `;

        // Event listener for coach selection
        const cards = document.querySelectorAll('.coach-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const target = e.currentTarget;
                cards.forEach(c => c.classList.remove('selected'));
                target.classList.add('selected');
                
                selectedCoach = target.getAttribute('data-coach');
                selectedFare = parseFloat(target.getAttribute('data-fare'));
                
                document.getElementById('selected-coach-name').textContent = selectedCoach;
                document.getElementById('selected-coach-fare').textContent = formatCurrency(selectedFare);
            });
        });

        // Booking Proceed Button
        document.getElementById('proceed-booking-btn').onclick = () => {
            const user = getCurrentUser();
            if (!user) {
                alert('Please login as passenger to book tickets.');
                window.location.href = 'login.html';
                return;
            }
            window.location.href = `booking.html?schedule_id=${scheduleId}&coach=${encodeURIComponent(selectedCoach)}`;
        };

    } catch (error) {
        console.error(error);
        panel.innerHTML = `<div style="color: var(--danger); text-align: center; padding: 2rem;">Error loading train schedule details.</div>`;
    }
}

// =====================================================================
// 6. BOOKING FORM LOGIC
// =====================================================================
async function initBookingPage() {
    const params = new URLSearchParams(window.location.search);
    const scheduleId = params.get('schedule_id');
    const defaultCoach = params.get('coach');
    const summary = document.getElementById('booking-summary-details');
    const totalFareSpan = document.getElementById('booking-summary-total-fare');
    const bookingForm = document.getElementById('ticket-booking-form');

    if (!scheduleId || !summary || !bookingForm) return;

    // Prefill passenger name from session
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('book-passenger-name').value = currentUser.full_name;
    }

    try {
        // Fetch schedule
        const res = await fetch(`${API_BASE_URL}/schedules/`);
        if (!res.ok) throw new Error();
        const schedules = await res.json();
        const sched = schedules.find(s => s.schedule_id == scheduleId);
        if (!sched) throw new Error('Schedule not found');

        // Fetch train details
        const trainsRes = await fetch(`${API_BASE_URL}/trains/`);
        const trains = trainsRes.ok ? await trainsRes.json() : [];
        const train = trains.find(t => t.train_name.toLowerCase() === sched.train_name.toLowerCase()) || { train_type: 'Express' };

        // Fetch bookings for seat layout calculation
        const bookingsRes = await fetch(`${API_BASE_URL}/bookings/`);
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];

        // Render coach dropdown choices
        const coachDropdown = document.getElementById('book-coach');
        if (defaultCoach) coachDropdown.value = defaultCoach;

        // Multipliers
        const coachMultipliers = {
            'Sleeper': 0.35, 'AC 3 Tier': 1.0, 'AC 2 Tier': 1.5, 'AC First Class': 2.2, 'Chair Car': 0.8
        };

        const renderVisualSeatLayout = (selectedCoach) => {
            const grid = document.getElementById('seat-layout-grid');
            if (!grid) return;

            // Filter confirmed bookings to find taken seat suffixes (e.g. C5-18 -> 18)
            const takenSeats = bookings
                .filter(b => b.train_name.toLowerCase() === sched.train_name.toLowerCase() && b.journey_date === sched.departure_date && b.coach_type === selectedCoach && b.booking_status === 'Confirmed')
                .map(b => {
                    const split = b.seat_number.split('-');
                    return split.length > 1 ? parseInt(split[1]) : null;
                })
                .filter(Boolean);

            let coachCode = 'S';
            if (selectedCoach.includes('AC First')) coachCode = 'H';
            else if (selectedCoach.includes('AC 2')) coachCode = 'A';
            else if (selectedCoach.includes('AC 3')) coachCode = 'B';
            else if (selectedCoach.includes('Chair')) coachCode = 'C';
            const coachNum = 1;
            const prefix = `${coachCode}${coachNum}`;

            let html = '';
            for (let i = 1; i <= 32; i++) {
                const seatNo = `${prefix}-${i}`;
                const isBooked = takenSeats.includes(i) || (i % 9 === 0); // Seed some taken seats for visual effect
                const disabledAttr = isBooked ? 'disabled style="background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); cursor: not-allowed; color: var(--danger);"' : '';

                html += `
                    <button type="button" class="seat-btn btn-secondary" data-seat="${seatNo}" ${disabledAttr} style="padding: 0.5rem; font-size: 0.8rem; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; border-radius: var(--radius-sm);">
                        <i class="fa-solid fa-couch"></i>
                        <span>${i}</span>
                    </button>
                `;
            }
            grid.innerHTML = html;
            document.getElementById('book-selected-seat').value = ''; // Reset selection

            // Attach click event
            const seatBtns = grid.querySelectorAll('.seat-btn:not([disabled])');
            seatBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    seatBtns.forEach(b => {
                        b.style.background = '';
                        b.style.borderColor = '';
                        b.style.color = '';
                    });
                    const selSeat = e.currentTarget.getAttribute('data-seat');
                    document.getElementById('book-selected-seat').value = selSeat;
                    e.currentTarget.style.background = 'var(--primary-gradient)';
                    e.currentTarget.style.borderColor = 'var(--primary-light)';
                    e.currentTarget.style.color = '#fff';
                });
            });
        };

        const updateSummary = () => {
            const coach = coachDropdown.value;
            const passengerName = document.getElementById('book-passenger-name').value.trim();
            const multiplier = coachMultipliers[coach] || 1.0;
            const baseFare = parseFloat(sched.fare) * multiplier;
            const cgst = baseFare * 0.09;
            const sgst = baseFare * 0.09;
            const finalFare = baseFare + cgst + sgst;

            summary.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Train Journey</span>
                        <strong>${sched.train_name} (${train.train_type})</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Route</span>
                        <strong>${sched.source} → ${sched.destination}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Departure Date</span>
                        <strong>${sched.departure_date} (${sched.departure_time})</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Passenger Name</span>
                        <strong>${passengerName || 'Not Entered'}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Travel Class</span>
                        <strong>${coach}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-top: 0.5rem;">
                        <span style="color: var(--text-secondary);">Base Ticket Fare</span>
                        <span>${formatCurrency(baseFare)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Central GST (9%)</span>
                        <span>${formatCurrency(cgst)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">State GST (9%)</span>
                        <span>${formatCurrency(sgst)}</span>
                    </div>
                </div>
            `;
            totalFareSpan.textContent = formatCurrency(finalFare);
            totalFareSpan.setAttribute('data-final-fare', finalFare);
        };

        updateSummary();
        renderVisualSeatLayout(coachDropdown.value);

        // Listen for field changes
        coachDropdown.addEventListener('change', () => {
            updateSummary();
            renderVisualSeatLayout(coachDropdown.value);
        });
        document.getElementById('book-passenger-name').addEventListener('input', updateSummary);

        // Handle Booking submission
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const passenger_name = document.getElementById('book-passenger-name').value.trim();
            const coach_type = coachDropdown.value;
            const finalFare = parseFloat(totalFareSpan.getAttribute('data-final-fare'));
            const selectedSeatVal = document.getElementById('book-selected-seat').value;
            
            const bookingPayload = {
                passenger_name: passenger_name,
                train_name: sched.train_name,
                journey_date: sched.departure_date,
                source: sched.source,
                destination: sched.destination,
                coach_type: coach_type,
                seat_number: selectedSeatVal || 'PENDING',
                total_fare: finalFare,
                booking_status: 'Pending'
            };

            try {
                const response = await fetch(`${API_BASE_URL}/bookings/add/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingPayload)
                });
                
                const data = await response.json();
                if (!response.ok) throw new Error('API creation failed');

                // Redirect to Payment Screen
                window.location.href = `payment.html?booking_id=${data.booking_id}`;

            } catch (error) {
                console.error(error);
                alert('Failed to initiate reservation. Check connection to backend.');
            }
        });

    } catch (error) {
        console.error(error);
        summary.innerHTML = `<div style="color: var(--danger);">Failed to load schedule details.</div>`;
    }
}

// =====================================================================
// 7. PAYMENT PAGE LOGIC
// =====================================================================
async function initPaymentPage() {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('booking_id');
    const loader = document.getElementById('payment-loader');
    const mainContent = document.getElementById('payment-main-content');
    const paymentForm = document.getElementById('payment-form');

    if (!bookingId || !loader || !mainContent || !paymentForm) return;

    try {
        // Fetch specific booking details
        const res = await fetch(`${API_BASE_URL}/bookings/`);
        if (!res.ok) throw new Error();
        const bookings = await res.json();
        const booking = bookings.find(b => b.booking_id == bookingId);
        if (!booking) throw new Error('Booking record not found.');

        // Render Booking Info
        document.getElementById('pay-booking-id').textContent = '#' + booking.booking_id;
        document.getElementById('pay-passenger-name').textContent = booking.passenger_name;
        document.getElementById('pay-amount').textContent = formatCurrency(booking.total_fare);
        
        const submitBtn = document.getElementById('payment-submit-btn');
        submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Authorize & Pay ${formatCurrency(booking.total_fare)}`;

        // Hide loader & show form
        loader.style.display = 'none';
        mainContent.style.display = 'block';

        // Payment Submission
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Transaction...`;

            const payment_method = document.getElementById('pay-method').value;
            const transaction_id = generateTxnId();
            const seat_number = booking.seat_number === 'PENDING' ? generateRandomSeat(booking.coach_type) : booking.seat_number;

            const paymentPayload = {
                booking_id: booking.booking_id,
                passenger_name: booking.passenger_name,
                amount: booking.total_fare,
                payment_method: payment_method,
                payment_status: 'Success',
                transaction_id: transaction_id,
                payment_date: new Date().toISOString().split('T')[0]
            };

            try {
                // 1. Post transaction
                const payRes = await fetch(`${API_BASE_URL}/payments/add/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paymentPayload)
                });
                if (!payRes.ok) throw new Error('Transaction submission failed.');

                // 2. Update booking status to Confirmed & assign random seat number
                const bookUpdateRes = await fetch(`${API_BASE_URL}/bookings/update/${booking.booking_id}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        booking_status: 'Confirmed',
                        seat_number: seat_number
                    })
                });
                if (!bookUpdateRes.ok) throw new Error('Booking status update failed.');

                // 3. Display Success View
                mainContent.style.display = 'none';
                document.getElementById('payment-status-panel').style.display = 'block';
                document.getElementById('payment-status-icon-container').innerHTML = `
                    <i class="fa-solid fa-circle-check" style="font-size: 5rem; color: var(--success);"></i>
                `;
                document.getElementById('status-txn-id').textContent = transaction_id;
                document.getElementById('status-seat-num').textContent = seat_number;

            } catch (error) {
                console.error(error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Authorize & Pay ${formatCurrency(booking.total_fare)}`;
                alert('Payment processing failed. Server connection error.');
            }
        });

    } catch (error) {
        console.error(error);
        loader.innerHTML = `<div style="color: var(--danger);">Failed to retrieve reservation details.</div>`;
    }
}

// =====================================================================
// 8. BOOKING HISTORY LOGIC
// =====================================================================
let userBookings = [];

async function initBookingHistoryPage() {
    const tableBody = document.getElementById('bookings-history-body');
    const badge = document.getElementById('history-count-badge');
    const user = getCurrentUser();

    if (!tableBody || !user) return;

    try {
        const response = await fetch(`${API_BASE_URL}/bookings/?passenger_name=${encodeURIComponent(user.full_name)}`);
        if (!response.ok) throw new Error('Failed to fetch user bookings');
        
        userBookings = await response.json();
        
        // Sort bookings by journey date descending
        userBookings.sort((a, b) => b.journey_date.localeCompare(a.journey_date));

        badge.textContent = `${userBookings.length} Bookings`;
        badge.className = 'status-pill confirmed';

        if (userBookings.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                        <i class="fa-solid fa-train" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>No trip bookings found. Start a new search to book tickets.</p>
                        <a href="trains.html" class="btn" style="margin-top: 1rem; display: inline-flex;">Search Trains</a>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = userBookings.map(b => {
            const isCancelled = b.booking_status === 'Cancelled';
            const isPast = new Date(b.journey_date) < new Date();
            
            let actionBtnHTML = '';
            if (!isCancelled && !isPast) {
                actionBtnHTML += `
                    <button class="btn btn-secondary cancel-booking-btn" data-id="${b.booking_id}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;"><i class="fa-solid fa-rectangle-xmark"></i> Cancel</button>
                `;
            }
            actionBtnHTML += `
                <button class="btn view-ticket-btn" data-id="${b.booking_id}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; background: var(--secondary-gradient);"><i class="fa-solid fa-file-pdf"></i> Ticket</button>
            `;

            return `
                <tr>
                    <td><strong>#${b.booking_id}</strong></td>
                    <td>${b.train_name}</td>
                    <td>${b.journey_date}</td>
                    <td>${b.source} → ${b.destination}</td>
                    <td>${b.coach_type} (${b.seat_number})</td>
                    <td>${formatCurrency(b.total_fare)}</td>
                    <td><span class="status-pill ${b.booking_status.toLowerCase()}">${b.booking_status}</span></td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            ${actionBtnHTML}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach action handlers
        document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
            btn.onclick = async (e) => {
                const bookingId = e.currentTarget.getAttribute('data-id');
                if (confirm(`Are you sure you want to cancel booking #${bookingId}? This action cannot be undone.`)) {
                    try {
                        const res = await fetch(`${API_BASE_URL}/bookings/update/${bookingId}/`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ booking_status: 'Cancelled' })
                        });
                        if (res.ok) {
                            alert('Booking cancelled successfully.');
                            initBookingHistoryPage(); // Reload history
                        } else {
                            throw new Error();
                        }
                    } catch (error) {
                        alert('Error cancelling booking.');
                    }
                }
            };
        });

        // View ticket handler
        document.querySelectorAll('.view-ticket-btn').forEach(btn => {
            btn.onclick = (e) => {
                const bookingId = e.currentTarget.getAttribute('data-id');
                const booking = userBookings.find(b => b.booking_id == bookingId);
                if (booking) showTicketModal(booking);
            };
        });

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--danger);">Failed to load journey history.</td></tr>`;
    }
}

function showTicketModal(booking) {
    const modal = document.getElementById('ticket-modal');
    const container = document.getElementById('modal-ticket-container');

    container.innerHTML = `
        <div class="ticket-header">
            <div>
                <h3 style="color: var(--primary-light); font-size: 1.4rem;">SWIFTRAIL RESERVATION SLIP</h3>
                <span style="font-size: 0.85rem; color: var(--text-secondary);">PNR / Booking Reference: #${booking.booking_id}</span>
            </div>
            <span class="status-pill ${booking.booking_status.toLowerCase()}">${booking.booking_status}</span>
        </div>
        <div class="ticket-grid">
            <div class="ticket-item">
                <span class="label">Passenger Name</span>
                <span class="val">${booking.passenger_name}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Train Name</span>
                <span class="val">${booking.train_name}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Journey Date</span>
                <span class="val">${booking.journey_date}</span>
            </div>
            <div class="ticket-item">
                <span class="label">From -> To</span>
                <span class="val">${booking.source} to ${booking.destination}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Coach Class</span>
                <span class="val">${booking.coach_type}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Allocated Seat</span>
                <span class="val" style="color: var(--primary-light); font-weight: 700;">${booking.seat_number}</span>
            </div>
            <div class="ticket-item">
                <span class="label">Fare Charged</span>
                <span class="val">${formatCurrency(booking.total_fare)}</span>
            </div>
        </div>
        <div style="text-align: center; border-top: 1px dashed var(--border-color); padding-top: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
            Thank you for booking with SwiftRail. Have a safe journey!
        </div>
    `;

    modal.classList.add('active');

    document.getElementById('ticket-modal-close').onclick = () => modal.classList.remove('active');
    document.getElementById('ticket-modal-ok').onclick = () => modal.classList.remove('active');

    // PDF Download
    document.getElementById('modal-download-btn').onclick = () => {
        const element = document.getElementById('modal-ticket-container');
        const opt = {
            margin:       1,
            filename:     `SwiftRail_Ticket_PNR_${booking.booking_id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, backgroundColor: '#070a13' },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };
}

// =====================================================================
// 9. PASSENGER DASHBOARD LOGIC (Chart.js Integration - Bonus Feature)
// =====================================================================
let spendingChartInstance = null;
let coachChartInstance = null;

async function initPassengerDashboardPage() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById('sidebar-user-name').textContent = user.full_name;
    document.getElementById('sidebar-user-email').textContent = user.email;

    // Logout
    document.getElementById('sidebar-logout-btn').onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };

    try {
        // 1. Fetch bookings
        const bookRes = await fetch(`${API_BASE_URL}/bookings/?passenger_name=${encodeURIComponent(user.full_name)}`);
        if (!bookRes.ok) throw new Error('Bookings fetch failed.');
        const bookings = await bookRes.json();

        // 2. Fetch payments
        const payRes = await fetch(`${API_BASE_URL}/payments/?passenger_name=${encodeURIComponent(user.full_name)}`);
        if (!payRes.ok) throw new Error('Payments fetch failed.');
        const payments = await payRes.json();

        // Stats calculations
        const totalBookings = bookings.length;
        const upcomingTrips = bookings.filter(b => b.booking_status === 'Confirmed' && new Date(b.journey_date) >= new Date()).length;
        const cancelledTrips = bookings.filter(b => b.booking_status === 'Cancelled').length;
        const totalExpenses = payments.filter(p => p.payment_status === 'Success').reduce((sum, p) => sum + parseFloat(p.amount), 0.0);

        document.getElementById('stat-total-bookings').textContent = totalBookings;
        document.getElementById('stat-upcoming').textContent = upcomingTrips;
        document.getElementById('stat-cancelled').textContent = cancelledTrips;
        document.getElementById('stat-expenses').textContent = formatCurrency(totalExpenses);

        // Render Recent Transactions
        const paymentsBody = document.getElementById('payments-history-body');
        if (payments.length === 0) {
            paymentsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No financial transactions found.</td></tr>`;
        } else {
            // Sort payments by date descending
            payments.sort((a, b) => b.payment_date.localeCompare(a.payment_date));
            paymentsBody.innerHTML = payments.slice(0, 5).map(p => `
                <tr>
                    <td><strong>${p.transaction_id}</strong></td>
                    <td>#${p.booking_id}</td>
                    <td>${p.payment_method}</td>
                    <td>${p.payment_date}</td>
                    <td>${formatCurrency(p.amount)}</td>
                    <td><span class="status-pill success">${p.payment_status}</span></td>
                </tr>
            `).join('');
        }

        // --- Prepare Analytics Data for Chart.js ---
        // A. Spending by Date (Bar Chart)
        const dateSpendingMap = {};
        payments.forEach(p => {
            if (p.payment_status === 'Success') {
                dateSpendingMap[p.payment_date] = (dateSpendingMap[p.payment_date] || 0) + parseFloat(p.amount);
            }
        });
        
        // Sort dates chronologically
        const chartDates = Object.keys(dateSpendingMap).sort();
        const chartExpenses = chartDates.map(d => dateSpendingMap[d]);

        // B. Coach Preference distribution (Pie Chart)
        const coachCounts = {};
        bookings.forEach(b => {
            if (b.booking_status !== 'Cancelled') {
                coachCounts[b.coach_type] = (coachCounts[b.coach_type] || 0) + 1;
            }
        });
        const coachLabels = Object.keys(coachCounts);
        const coachData = coachLabels.map(c => coachCounts[c]);

        // Destroy previous charts if they exist to prevent hover memory leak
        if (spendingChartInstance) spendingChartInstance.destroy();
        if (coachChartInstance) coachChartInstance.destroy();

        // Render Spending Chart
        const spendingCtx = document.getElementById('spendingChart').getContext('2d');
        spendingChartInstance = new Chart(spendingCtx, {
            type: 'bar',
            data: {
                labels: chartDates.length > 0 ? chartDates : ['No Data'],
                datasets: [{
                    label: 'Spent Amount (₹)',
                    data: chartExpenses.length > 0 ? chartExpenses : [0],
                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Render Coach Preference Chart
        const coachCtx = document.getElementById('coachChart').getContext('2d');
        coachChartInstance = new Chart(coachCtx, {
            type: 'pie',
            data: {
                labels: coachLabels.length > 0 ? coachLabels : ['No Bookings'],
                datasets: [{
                    data: coachData.length > 0 ? coachData : [1],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.7)',
                        'rgba(6, 182, 212, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(239, 68, 68, 0.7)'
                    ],
                    borderColor: 'rgba(6, 9, 19, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', font: { family: 'Outfit' } }
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
    }
}

// =====================================================================
// 10. ADMIN DASHBOARD OPERATIONS (CRUD PANEL ACTIONS)
// =====================================================================
let adminContext = 'passenger'; // passenger, train, schedule, booking, payment
let editRecordId = null;

function initAdminDashboardPage() {
    // Check logout admin
    document.getElementById('admin-logout-btn').onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };

    // Tab switcher handler
    const tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetTabId = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            document.getElementById(targetTabId).classList.add('active');

            // Set Admin Context
            if (targetTabId === 'tab-passengers') adminContext = 'passenger';
            else if (targetTabId === 'tab-trains') adminContext = 'train';
            else if (targetTabId === 'tab-schedules') adminContext = 'schedule';
            else if (targetTabId === 'tab-bookings') adminContext = 'booking';
            else if (targetTabId === 'tab-payments') adminContext = 'payment';
            else if (targetTabId === 'tab-analytics') adminContext = 'analytics';

            if (adminContext === 'analytics') {
                loadAdminAnalytics();
            } else {
                loadAdminRegistry();
            }
        });
    });

    // Handle Admin Modal Form Submit
    const adminForm = document.getElementById('admin-modal-form');
    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminFormSubmit);
    }

    // Default Load
    loadAdminRegistry();
}

async function loadAdminRegistry() {
    const listBodyPassengers = document.getElementById('admin-passengers-tbody');
    const listBodyTrains = document.getElementById('admin-trains-tbody');
    const listBodySchedules = document.getElementById('admin-schedules-tbody');
    const listBodyBookings = document.getElementById('admin-bookings-tbody');
    const listBodyPayments = document.getElementById('admin-payments-tbody');

    try {
        if (adminContext === 'passenger') {
            listBodyPassengers.innerHTML = `<tr><td colspan="8" style="text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Loading Passengers...</td></tr>`;
            const res = await fetch(`${API_BASE_URL}/passengers/`);
            const passengers = await res.json();
            
            listBodyPassengers.innerHTML = passengers.map(p => `
                <tr>
                    <td><strong>#${p.passenger_id}</strong></td>
                    <td>${p.full_name}</td>
                    <td>${p.email}</td>
                    <td>${p.phone}</td>
                    <td>${p.age}</td>
                    <td>${p.gender}</td>
                    <td><div style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.address}</div></td>
                    <td>
                        <button class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="openEditModal('passenger', ${p.passenger_id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="deleteAdminRecord('passengers', ${p.passenger_id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');

        } else if (adminContext === 'train') {
            listBodyTrains.innerHTML = `<tr><td colspan="7" style="text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Loading Fleet...</td></tr>`;
            const res = await fetch(`${API_BASE_URL}/trains/`);
            const trains = await res.json();
            
            listBodyTrains.innerHTML = trains.map(t => `
                <tr>
                    <td><strong>#${t.train_id}</strong></td>
                    <td>${t.train_number}</td>
                    <td>${t.train_name}</td>
                    <td>${t.train_type}</td>
                    <td>${t.total_seats}</td>
                    <td>${t.source} → ${t.destination}</td>
                    <td>
                        <button class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="openEditModal('train', ${t.train_id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="deleteAdminRecord('trains', ${t.train_id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');

        } else if (adminContext === 'schedule') {
            listBodySchedules.innerHTML = `<tr><td colspan="7" style="text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Loading Schedules...</td></tr>`;
            const res = await fetch(`${API_BASE_URL}/schedules/`);
            const schedules = await res.json();
            
            listBodySchedules.innerHTML = schedules.map(s => `
                <tr>
                    <td><strong>#${s.schedule_id}</strong></td>
                    <td>${s.train_name}</td>
                    <td>${s.source} → ${s.destination}</td>
                    <td>${s.departure_date} (${s.departure_time})</td>
                    <td>${s.arrival_date} (${s.arrival_time})</td>
                    <td>${formatCurrency(s.fare)}</td>
                    <td>
                        <button class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="openEditModal('schedule', ${s.schedule_id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="deleteAdminRecord('schedules', ${s.schedule_id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');

        } else if (adminContext === 'booking') {
            listBodyBookings.innerHTML = `<tr><td colspan="9" style="text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Loading Bookings...</td></tr>`;
            const res = await fetch(`${API_BASE_URL}/bookings/`);
            const bookings = await res.json();
            
            listBodyBookings.innerHTML = bookings.map(b => `
                <tr>
                    <td><strong>#${b.booking_id}</strong></td>
                    <td>${b.passenger_name}</td>
                    <td>${b.train_name}</td>
                    <td>${b.journey_date}</td>
                    <td>${b.source} → ${b.destination}</td>
                    <td>${b.coach_type} (${b.seat_number})</td>
                    <td>${formatCurrency(b.total_fare)}</td>
                    <td><span class="status-pill ${b.booking_status.toLowerCase()}">${b.booking_status}</span></td>
                    <td>
                        <button class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="openEditModal('booking', ${b.booking_id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="deleteAdminRecord('bookings', ${b.booking_id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');

        } else if (adminContext === 'payment') {
            listBodyPayments.innerHTML = `<tr><td colspan="9" style="text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Loading Payments...</td></tr>`;
            const res = await fetch(`${API_BASE_URL}/payments/`);
            const payments = await res.json();
            
            listBodyPayments.innerHTML = payments.map(p => `
                <tr>
                    <td><strong>#${p.payment_id}</strong></td>
                    <td>#${p.booking_id}</td>
                    <td>${p.passenger_name}</td>
                    <td>${formatCurrency(p.amount)}</td>
                    <td>${p.payment_method}</td>
                    <td><span class="status-pill success">${p.payment_status}</span></td>
                    <td><span style="font-family: monospace;">${p.transaction_id}</span></td>
                    <td>${p.payment_date}</td>
                    <td>
                        <button class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="openEditModal('payment', ${p.payment_id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="deleteAdminRecord('payments', ${p.payment_id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error(error);
    }
}

// Generate HTML Form Fields Dynamically for Admin CRUD Modals
function openAddModal(type) {
    adminContext = type;
    editRecordId = null;
    document.getElementById('admin-modal-title').textContent = `Add New ${type.toUpperCase()}`;
    generateModalFields(type);
    document.getElementById('admin-modal').classList.add('active');
}

async function openEditModal(type, id) {
    adminContext = type;
    editRecordId = id;
    document.getElementById('admin-modal-title').textContent = `Modify ${type.toUpperCase()} #${id}`;
    
    // 1. Generate empty form
    generateModalFields(type);
    
    try {
        // 2. Fetch specific record details to populate form
        let endpoint = '';
        if (type === 'passenger') endpoint = 'passengers';
        else if (type === 'train') endpoint = 'trains';
        else if (type === 'schedule') endpoint = 'schedules';
        else if (type === 'booking') endpoint = 'bookings';
        else if (type === 'payment') endpoint = 'payments';

        const res = await fetch(`${API_BASE_URL}/${endpoint}/`);
        const records = await res.json();
        const item = records.find(r => {
            const pk = r.passenger_id || r.train_id || r.schedule_id || r.booking_id || r.payment_id;
            return pk == id;
        });

        if (item) {
            // Populate fields
            for (const key in item) {
                const el = document.getElementById(`adm-${key}`);
                if (el) el.value = item[key];
            }
        }

        document.getElementById('admin-modal').classList.add('active');

    } catch (error) {
        alert('Failed to load item detail.');
    }
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.remove('active');
    document.getElementById('admin-modal-form').reset();
}

function generateModalFields(type) {
    const container = document.getElementById('admin-modal-fields-container');
    let html = '';

    if (type === 'passenger') {
        html = `
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-full_name">Full Name</label>
                    <input type="text" id="adm-full_name" required>
                </div>
                <div class="form-group">
                    <label for="adm-email">Email Address</label>
                    <input type="email" id="adm-email" required>
                </div>
            </div>
            <div class="grid-3">
                <div class="form-group">
                    <label for="adm-phone">Phone</label>
                    <input type="text" id="adm-phone" required>
                </div>
                <div class="form-group">
                    <label for="adm-gender">Gender</label>
                    <select id="adm-gender" required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="adm-age">Age</label>
                    <input type="number" id="adm-age" required>
                </div>
            </div>
            <div class="form-group">
                <label for="adm-address">Mailing Address</label>
                <textarea id="adm-address" rows="2" required></textarea>
            </div>
            <div class="form-group">
                <label for="adm-password">Password</label>
                <input type="text" id="adm-password" required>
            </div>
        `;
    } else if (type === 'train') {
        html = `
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-train_name">Train Name</label>
                    <input type="text" id="adm-train_name" placeholder="Vande Bharat Express" required>
                </div>
                <div class="form-group">
                    <label for="adm-train_number">Train Number</label>
                    <input type="text" id="adm-train_number" placeholder="20678" required>
                </div>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-train_type">Train Type</label>
                    <select id="adm-train_type" required>
                        <option value="Express">Express</option>
                        <option value="Superfast">Superfast</option>
                        <option value="Passenger">Passenger</option>
                        <option value="Rajdhani">Rajdhani</option>
                        <option value="Shatabdi">Shatabdi</option>
                        <option value="Vande Bharat">Vande Bharat</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="adm-total_seats">Total Coach Seats</label>
                    <input type="number" id="adm-total_seats" placeholder="1128" required>
                </div>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-source">Source Station</label>
                    <input type="text" id="adm-source" required>
                </div>
                <div class="form-group">
                    <label for="adm-destination">Destination Station</label>
                    <input type="text" id="adm-destination" required>
                </div>
            </div>
        `;
    } else if (type === 'schedule') {
        html = `
            <div class="form-group">
                <label for="adm-train_name">Select Train Fleet</label>
                <input type="text" id="adm-train_name" placeholder="Vande Bharat Express" required>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-source">Source</label>
                    <input type="text" id="adm-source" required>
                </div>
                <div class="form-group">
                    <label for="adm-destination">Destination</label>
                    <input type="text" id="adm-destination" required>
                </div>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-departure_date">Departure Date</label>
                    <input type="date" id="adm-departure_date" required>
                </div>
                <div class="form-group">
                    <label for="adm-departure_time">Departure Time (HH:MM)</label>
                    <input type="time" id="adm-departure_time" required>
                </div>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-arrival_date">Arrival Date</label>
                    <input type="date" id="adm-arrival_date" required>
                </div>
                <div class="form-group">
                    <label for="adm-arrival_time">Arrival Time (HH:MM)</label>
                    <input type="time" id="adm-arrival_time" required>
                </div>
            </div>
            <div class="form-group">
                <label for="adm-fare">Ticket Base Fare (₹)</label>
                <input type="number" step="0.01" id="adm-fare" required>
            </div>
        `;
    } else if (type === 'booking') {
        html = `
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-passenger_name">Passenger Name</label>
                    <input type="text" id="adm-passenger_name" required>
                </div>
                <div class="form-group">
                    <label for="adm-train_name">Train Name</label>
                    <input type="text" id="adm-train_name" required>
                </div>
            </div>
            <div class="grid-3">
                <div class="form-group">
                    <label for="adm-journey_date">Journey Date</label>
                    <input type="date" id="adm-journey_date" required>
                </div>
                <div class="form-group">
                    <label for="adm-source">Source</label>
                    <input type="text" id="adm-source" required>
                </div>
                <div class="form-group">
                    <label for="adm-destination">Destination</label>
                    <input type="text" id="adm-destination" required>
                </div>
            </div>
            <div class="grid-3">
                <div class="form-group">
                    <label for="adm-coach_type">Coach Type</label>
                    <select id="adm-coach_type" required>
                        <option value="Sleeper">Sleeper</option>
                        <option value="AC 3 Tier">AC 3 Tier</option>
                        <option value="AC 2 Tier">AC 2 Tier</option>
                        <option value="AC First Class">AC First Class</option>
                        <option value="Chair Car">Chair Car</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="adm-seat_number">Seat Allocated</label>
                    <input type="text" id="adm-seat_number" required>
                </div>
                <div class="form-group">
                    <label for="adm-booking_status">Booking Status</label>
                    <select id="adm-booking_status" required>
                        <option value="Confirmed">Confirmed</option>
                        <option value="RAC">RAC</option>
                        <option value="Waiting List">Waiting List</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="adm-total_fare">Total Fare Charged</label>
                <input type="number" step="0.01" id="adm-total_fare" required>
            </div>
        `;
    } else if (type === 'payment') {
        html = `
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-booking_id">Booking ID</label>
                    <input type="number" id="adm-booking_id" required>
                </div>
                <div class="form-group">
                    <label for="adm-passenger_name">Passenger Name</label>
                    <input type="text" id="adm-passenger_name" required>
                </div>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label for="adm-amount">Payment Amount (₹)</label>
                    <input type="number" step="0.01" id="adm-amount" required>
                </div>
                <div class="form-group">
                    <label for="adm-payment_method">Payment Method</label>
                    <select id="adm-payment_method" required>
                        <option value="UPI">UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Wallet">Wallet</option>
                    </select>
                </div>
            </div>
            <div class="grid-3">
                <div class="form-group">
                    <label for="adm-payment_status">Payment Status</label>
                    <select id="adm-payment_status" required>
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="adm-transaction_id">Transaction ID</label>
                    <input type="text" id="adm-transaction_id" required>
                </div>
                <div class="form-group">
                    <label for="adm-payment_date">Payment Date</label>
                    <input type="date" id="adm-payment_date" required>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Handle Form Submission for Add or Edit
async function handleAdminFormSubmit(e) {
    e.preventDefault();

    let endpoint = '';
    let pkName = '';
    if (adminContext === 'passenger') { endpoint = 'passengers'; pkName = 'passenger_id'; }
    else if (adminContext === 'train') { endpoint = 'trains'; pkName = 'train_id'; }
    else if (adminContext === 'schedule') { endpoint = 'schedules'; pkName = 'schedule_id'; }
    else if (adminContext === 'booking') { endpoint = 'bookings'; pkName = 'booking_id'; }
    else if (adminContext === 'payment') { endpoint = 'payments'; pkName = 'payment_id'; }

    // Collect all inputs starting with adm-
    const payload = {};
    const inputs = document.querySelectorAll('[id^="adm-"]');
    inputs.forEach(input => {
        const key = input.id.replace('adm-', '');
        let val = input.value;
        // Parse numerical fields
        if (input.type === 'number') {
            val = input.step === '0.01' ? parseFloat(val) : parseInt(val);
        }
        payload[key] = val;
    });

    const isEdit = editRecordId !== null;
    const url = isEdit 
        ? `${API_BASE_URL}/${endpoint}/update/${editRecordId}/`
        : `${API_BASE_URL}/${endpoint}/add/`;

    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            alert('Failed to save record: ' + JSON.stringify(errData));
            return;
        }

        alert(`Record successfully ${isEdit ? 'updated' : 'added'}!`);
        closeAdminModal();
        loadAdminRegistry();

    } catch (error) {
        console.error(error);
        alert('Server database error.');
    }
}

// Global record deletion handler
async function deleteAdminRecord(endpoint, id) {
    if (!confirm(`Are you sure you want to delete record #${id} from ${endpoint}?`)) return;

    try {
        const res = await fetch(`${API_BASE_URL}/${endpoint}/delete/${id}/`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert('Record deleted successfully.');
            loadAdminRegistry();
        } else {
            throw new Error();
        }
    } catch (error) {
        alert('Failed to delete the database entry.');
    }
}

// =====================================================================
// 11. ADMIN DASHBOARD ANALYTICS (VISUALIZATION FEATURE)
// =====================================================================
let adminRevenueChartInstance = null;
let adminBookingsChartInstance = null;

async function loadAdminAnalytics() {
    try {
        const bookingsRes = await fetch(`${API_BASE_URL}/bookings/`);
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];

        const paymentsRes = await fetch(`${API_BASE_URL}/payments/`);
        const payments = paymentsRes.ok ? await paymentsRes.json() : [];

        // A. Revenue by Train (Bar Chart)
        const trainRevenue = {};
        payments.forEach(p => {
            if (p.payment_status === 'Success') {
                const booking = bookings.find(b => b.booking_id == p.booking_id);
                const trainName = booking ? booking.train_name : 'Cancelled / Other';
                trainRevenue[trainName] = (trainRevenue[trainName] || 0) + parseFloat(p.amount);
            }
        });

        const trainLabels = Object.keys(trainRevenue);
        const trainData = trainLabels.map(t => trainRevenue[t]);

        // B. Booking Status Distribution (Pie Chart)
        const bookingStatuses = {};
        bookings.forEach(b => {
            bookingStatuses[b.booking_status] = (bookingStatuses[b.booking_status] || 0) + 1;
        });

        const statusLabels = Object.keys(bookingStatuses);
        const statusData = statusLabels.map(s => bookingStatuses[s]);

        // Destroy existing chart instances
        if (adminRevenueChartInstance) adminRevenueChartInstance.destroy();
        if (adminBookingsChartInstance) adminBookingsChartInstance.destroy();

        // Render Revenue Chart
        const revenueCtx = document.getElementById('adminRevenueChart').getContext('2d');
        adminRevenueChartInstance = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: trainLabels.length > 0 ? trainLabels : ['No Data'],
                datasets: [{
                    label: 'Revenue (₹)',
                    data: trainData.length > 0 ? trainData : [0],
                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        // Render Booking Status Chart
        const bookingsCtx = document.getElementById('adminBookingsChart').getContext('2d');
        adminBookingsChartInstance = new Chart(bookingsCtx, {
            type: 'pie',
            data: {
                labels: statusLabels.length > 0 ? statusLabels : ['No Data'],
                datasets: [{
                    data: statusData.length > 0 ? statusData : [1],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(6, 182, 212, 0.7)',
                        'rgba(239, 68, 68, 0.7)'
                    ],
                    borderColor: 'rgba(6, 9, 19, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', font: { family: 'Outfit' } }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Failed to load admin analytics:', error);
    }
}
