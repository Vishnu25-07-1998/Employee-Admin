
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true,
        minlength: 3
    },
    employeeMail: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
        unique: true
    },
    employeeMobile: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    designation: {
        type: String,
        required: true,
        enum: [
            "Software Engineer",
            "Data Analyst",
            "Site Reliability Engineer",
            "Cybersecurity Analyst",
            "Business Analyst"
        ]
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    courses: {
        type: [String],
        enum: ["BTECH", "MTECH", "BCA", "MCA", "MBA"],
        required: true
    },
    image: {
        type: String, 
        required: false
    }
}, {
    timestamps: true 
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
