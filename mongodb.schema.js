const mongoose = require('mongoose');

// -----------------------------------------------------
// 1. Department Schema
// -----------------------------------------------------
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);

// -----------------------------------------------------
// 2. User Schema (Represents Admin, Doctor, and Patient)
// -----------------------------------------------------
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'DOCTOR', 'PATIENT'],
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },

    // Doctor Specific Fields (nullable for other roles)
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        default: null
    },
    degree: {
        type: String,
        default: null
    },
    experience: {
        type: Number,
        default: 0
    },
    fees: {
        type: Number,
        default: 0.00
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// -----------------------------------------------------
// 3. Appointment Schema
// -----------------------------------------------------
const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String, // e.g., "10:30 AM"
        required: true
    },
    problem: {
        type: String,
        default: 'Not specified'
    },

    // Patient Details capturing at the time of booking
    patientName: {
        type: String,
        required: true
    },
    age: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    medicalBackground: {
        type: String,
        default: 'None'
    },

    status: {
        type: String,
        enum: ['SCHEDULED', 'CANCELLED'],
        default: 'SCHEDULED'
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Exporting all models
module.exports = {
    Department,
    User,
    Appointment
};
