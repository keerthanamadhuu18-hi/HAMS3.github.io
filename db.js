// HAMS Mock Database & Logic using LocalStorage

// Initialize database if empty
function initDB() {
    if (!localStorage.getItem('hams_users')) {
        const users = [
            { id: 1, name: 'Super Admin', role: 'ADMIN', username: 'admin', email: 'admin@hams.com', password: 'password' },
            { id: 2, name: 'Dr. John Smith', role: 'DOCTOR', username: 'john', email: 'john@hams.com', password: 'password', departmentId: 1 },
            { id: 3, name: 'Jane Doe', role: 'PATIENT', username: 'jane', email: 'jane@hams.com', password: 'password' }
        ];
        localStorage.setItem('hams_users', JSON.stringify(users));
    }

    if (!localStorage.getItem('hams_departments')) {
        const departments = [
            { id: 1, name: 'Cardiology' },
            { id: 2, name: 'Pediatrics' }
        ];
        localStorage.setItem('hams_departments', JSON.stringify(departments));
    }

    if (!localStorage.getItem('hams_appointments')) {
        localStorage.setItem('hams_appointments', JSON.stringify([]));
    }
}

// Authentication & Registration
function login(username, password) {
    const users = JSON.parse(localStorage.getItem('hams_users'));
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (user) {
        localStorage.setItem('hams_currentUser', JSON.stringify(user));
        return user;
    }
    return null;
}

function registerPatient(name, username, email, password) {
    const users = JSON.parse(localStorage.getItem('hams_users'));

    if (users.some(u => u.username === username)) {
        return { success: false, message: 'Username already exists.' };
    }
    if (users.some(u => u.email === email)) {
        return { success: false, message: 'Email address is already registered.' };
    }

    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: newId,
        name: name,
        username: username,
        email: email,
        password: password,
        role: 'PATIENT'
    };

    users.push(newUser);
    localStorage.setItem('hams_users', JSON.stringify(users));

    // Auto login
    localStorage.setItem('hams_currentUser', JSON.stringify(newUser));
    return { success: true, user: newUser };
}

function registerDoctor(name, username, email, password, departmentId, degree) {
    const users = JSON.parse(localStorage.getItem('hams_users'));

    if (users.some(u => u.username === username)) {
        return { success: false, message: 'Username already exists.' };
    }
    if (users.some(u => u.email === email)) {
        return { success: false, message: 'Email address is already registered.' };
    }

    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: newId,
        name: name,
        username: username,
        email: email,
        password: password,
        role: 'DOCTOR',
        departmentId: departmentId ? parseInt(departmentId) : null,
        degree: degree || 'MD',
        experience: 0,
        fees: 0
    };

    users.push(newUser);
    localStorage.setItem('hams_users', JSON.stringify(users));

    // Auto login
    localStorage.setItem('hams_currentUser', JSON.stringify(newUser));
    return { success: true, user: newUser };
}

function logout() {
    localStorage.removeItem('hams_currentUser');
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const user = localStorage.getItem('hams_currentUser');
    return user ? JSON.parse(user) : null;
}

// Appointments Logic
function getAppointments() {
    return JSON.parse(localStorage.getItem('hams_appointments'));
}

function bookAppointment(patientId, doctorId, date, time, problem, details) {
    const appointments = getAppointments();

    // Check constraint: No doctor can be double-booked
    const isDoubleBooked = appointments.some(app =>
        app.doctorId === doctorId &&
        app.date === date &&
        app.time === time &&
        app.status !== 'CANCELLED'
    );

    if (isDoubleBooked) {
        return { success: false, message: 'Doctor is already booked for this time slot.' };
    }

    const newAppointment = {
        id: Date.now(),
        patientId, // The account that booked it
        doctorId,
        date,
        time,
        problem: problem || 'Not specified',
        patientName: details.patientName || 'Unknown',
        age: details.age || '',
        phone: details.phone || '',
        address: details.address || '',
        medicalBackground: details.medicalBackground || 'None',
        status: 'SCHEDULED' // SCHEDULED, CANCELLED
    };

    appointments.push(newAppointment);
    localStorage.setItem('hams_appointments', JSON.stringify(appointments));
    return { success: true, message: 'Appointment booked successfully.' };
}

function cancelAppointment(id) {
    const appointments = getAppointments();
    const index = appointments.findIndex(app => app.id === id);
    if (index > -1) {
        appointments[index].status = 'CANCELLED';
        localStorage.setItem('hams_appointments', JSON.stringify(appointments));
        return true;
    }
    return false;
}

function getDoctorSchedule(doctorId, date = null) {
    const appointments = getAppointments();
    return appointments.filter(app => {
        if (app.doctorId !== doctorId) return false;
        if (date && app.date !== date) return false;
        return true;
    });
}

function getPatientAppointments(patientId) {
    const appointments = getAppointments();
    return appointments.filter(app => app.patientId === patientId);
}

// Fetching Data
function getDoctors() {
    const users = JSON.parse(localStorage.getItem('hams_users'));
    return users.filter(u => u.role === 'DOCTOR');
}

function getDoctorById(id) {
    return getDoctors().find(d => d.id === id) || { name: 'Unknown Doctor' };
}

function getPatientById(id) {
    const users = JSON.parse(localStorage.getItem('hams_users'));
    return users.find(u => u.role === 'PATIENT' && u.id === id) || { name: 'Unknown Patient' };
}

function getDepartments() {
    return JSON.parse(localStorage.getItem('hams_departments'));
}

function getDepartmentById(id) {
    return getDepartments().find(d => d.id === id) || { name: 'Unknown Dept' };
}

function deleteDepartment(id) {
    let departments = getDepartments();
    const index = departments.findIndex(d => d.id === id);
    if (index > -1) {
        departments.splice(index, 1);
        localStorage.setItem('hams_departments', JSON.stringify(departments));
        return { success: true, message: 'Department deleted successfully.' };
    }
    return { success: false, message: 'Department not found.' };
}

// Run init on load
initDB();
