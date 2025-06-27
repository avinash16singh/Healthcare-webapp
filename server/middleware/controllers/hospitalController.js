import bcryptjs from "bcryptjs";
import Doctor from "../models/DoctorModel.js";
import User from "../models/UserModel.js";
import nodemailer from 'nodemailer';
import Hospital from "../models/HospitalModel.js";
import AmbulanceDriver from "../models/AmbulanceDriverModel.js";
import Appointment from "../models/AppointmentModel.js";

export const getDashboard = (req, res) => {};



export const listAppointments = async (req, res) => {
  const hospitalId = req.params.id;
  try {
    const appointments = await Appointment.find({ hospital: hospitalId })
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ date: -1, timeSlot: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};


export const getHospitalModel = async (req, res) => {
    try {
        const { id } = req.params; // adminId 
        if (!id) {
            return res.status(400).json({ error: 'Missing hospitalAdmin ID' });
        }
        const hospital = await Hospital.findOne({ hospitalAdmin: id });
        res.status(200).json(hospital);
    } catch (error) {
        console.error("Error fetching hospital:", error);
        res.status(500).json({ message: "Failed to fetch hospital" });
    }
    
}


// List all doctors under the hospital admin’s hospital
export const listDoctors = async (req, res) => {
    try {
        const { id } = req.params; // hospitalId
        const hospitalId = id; 
        const doctors = await Doctor.find({ hospital: hospitalId }).populate("user", "-password");
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error listing doctors:", error);
        res.status(500).json({ message: "Failed to fetch doctors" });
    }
};

// Create a new doctor
export const createDoctor = async (req, res) => {
    try {
        const { hospitalId, name, email, phone, password, specialties, department, licenseNumber, availability, doctorType } = req.body;

        // Get hospital name using hospitalAdminId
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Check if the doctor already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Doctor email already exists" });
        }

        // Hash the doctor's password
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Create a new User (doctor)
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "doctor",
        });
        await user.save();

        // Create the doctor record and associate with the hospital
        const doctor = new Doctor({
            user: user._id,
            hospital: hospital._id, // Using the hospital's ID from the hospital model
            specialties,
            department,
            licenseNumber,
            availability,
            doctorType,
        });
        await doctor.save();

        // Send email to the doctor with their credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or another email service provider
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailMessage = `
            Congratulations, Dr. ${name}!\n\n
            You have been assigned as a doctor at ${hospital.name}. Below are your credentials:\n
            Email: ${email}\n
            Password: ${password}\n\n
            Please keep this information safe. You can log in to manage your profile and appointments.\n\n
            Welcome aboard!
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Doctor Role Assignation - Your Credentials',
            text: mailMessage,
        };

        // Send the email
        try {
            await transporter.sendMail(mailOptions);
            console.log('Doctor credential email sent successfully');
        } catch (error) {
            console.error('Failed to send email:', error.message);
        }

        // Return success response
        res.status(201).json({ message: "Doctor created successfully", doctor });
    } catch (error) {
        console.error("Error creating doctor:", error);
        res.status(500).json({ message: "Failed to create doctor" });
    }
};



// Update doctor
export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, password, specialties, department, licenseNumber, availability, doctorType } = req.body;

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Update doctor details
        doctor.specialties = specialties || doctor.specialties;
        doctor.department = department || doctor.department;
        doctor.licenseNumber = licenseNumber || doctor.licenseNumber;
        doctor.availability = availability || doctor.availability;
        doctor.doctorType = doctorType || doctor.doctorType;
        await doctor.save();

        // Update linked user details
        const user = await User.findById(doctor.user);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            if (password) {
                user.password = await bcryptjs.hash(password, 12);
            }
            await user.save();
        }

        res.status(200).json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ message: "Failed to update doctor" });
    }
};

// Delete doctor (remove both Doctor record + linked User account)
export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Delete the linked user account
        await User.findByIdAndDelete(doctor.user);

        // Delete the doctor profile
        await Doctor.findByIdAndDelete(id);

        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ message: "Failed to delete doctor" });
    }
};


export const listPatients = (req, res) => {

};



// List all ambulances under a hospital
export const listAmbulances = async (req, res) => {
    try {
        const { id } = req.params; // hospitalId
        const ambulances = await AmbulanceDriver.find({ hospital: id })
            .populate("user", "-password")
            .populate("hospital", "name");
        res.status(200).json(ambulances);
    } catch (error) {
        console.error("Error listing ambulances:", error);
        res.status(500).json({ message: "Failed to fetch ambulances" });
    }
};

// Create a new ambulance driver + ambulance
export const createAmbulance = async (req, res) => {
    try {
        console.log("Received body:", req.body);

        const { hospitalId, name, email, phone, password, ambulanceNumber, ambulanceType, licenseNumber } = req.body;

        // Check if hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Create user
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "ambulanceDriver",
        });
        await user.save();

        // Create ambulance driver record
        const ambulanceDriver = new AmbulanceDriver({
            user: user._id,
            hospital: hospital._id,
            ambulanceNumber,
            ambulanceType,
            licenseNumber,
        });
        await ambulanceDriver.save();

        // Send email with credentials (optional)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailMessage = `
            Hello ${name},\n\n
            You have been registered as an ambulance driver for ${hospital.name}.\n
            Email: ${email}\n
            Password: ${password}\n\n
            Please log in to your account.\n
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Ambulance Driver Credentials',
            text: mailMessage,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Ambulance driver email sent successfully');
        } catch (error) {
            console.error('Failed to send email:', error.message);
        }

        res.status(201).json({ message: "Ambulance driver created successfully", ambulanceDriver });
    } catch (error) {
        console.error("Error creating ambulance:", error);
        res.status(500).json({ message: "Failed to create ambulance" });
    }
};

// Update ambulance + driver details
export const updateAmbulance = async (req, res) => {
    try {
        const { id } = req.params; // ambulanceDriverId
        const { name, email, phone, password, ambulanceNumber, ambulanceType, licenseNumber, onDuty } = req.body;

        const ambulanceDriver = await AmbulanceDriver.findById(id);
        if (!ambulanceDriver) {
            return res.status(404).json({ message: "Ambulance driver not found" });
        }

        // Update ambulance details
        ambulanceDriver.ambulanceNumber = ambulanceNumber || ambulanceDriver.ambulanceNumber;
        ambulanceDriver.ambulanceType = ambulanceType || ambulanceDriver.ambulanceType;
        ambulanceDriver.licenseNumber = licenseNumber || ambulanceDriver.licenseNumber;
        if (onDuty !== undefined) {
            ambulanceDriver.onDuty = onDuty;
        }
        await ambulanceDriver.save();

        // Update linked user details
        const user = await User.findById(ambulanceDriver.user);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            if (password) {
                user.password = await bcryptjs.hash(password, 12);
            }
            await user.save();
        }

        res.status(200).json({ message: "Ambulance driver updated successfully", ambulanceDriver });
    } catch (error) {
        console.error("Error updating ambulance:", error);
        res.status(500).json({ message: "Failed to update ambulance" });
    }
};

// Delete ambulance + driver account
export const deleteAmbulance = async (req, res) => {
    try {
        const { id } = req.params; // ambulanceDriverId

        const ambulanceDriver = await AmbulanceDriver.findById(id);
        if (!ambulanceDriver) {
            return res.status(404).json({ message: "Ambulance driver not found" });
        }

        // Delete linked user account
        await User.findByIdAndDelete(ambulanceDriver.user);

        // Delete ambulance driver record
        await AmbulanceDriver.findByIdAndDelete(id);

        res.status(200).json({ message: "Ambulance driver deleted successfully" });
    } catch (error) {
        console.error("Error deleting ambulance:", error);
        res.status(500).json({ message: "Failed to delete ambulance" });
    }
};


export const getEmergencyDashboard = (req, res) => {};
