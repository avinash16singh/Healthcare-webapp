import Hospital from "../models/HospitalModel.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/UserModel.js";
import AmbulanceDriver from "../models/AmbulanceDriverModel.js";

export const getDashboard = (req, res) => {};

// GET all hospitals
export const listHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate(
      "hospitalAdmin",
      "name email"
    );
    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Error listing hospitals:", error);
    res.status(500).json({ message: "Failed to fetch hospitals" });
  }
};

// CREATE new hospital
export const createHospital = async (req, res) => {
  try {
    const body = req.body;
    console.log("server: body: ", req.body);

    const {
      adminName,
      adminEmail,
      adminPhone,
      adminPassword,
      ...hospitalData
    } = body;

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Admin email already exists" });
    }

    // Hash the admin password
    const hashedPassword = await bcryptjs.hash(adminPassword, 12);

    // Create the new admin user
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: "hospitalAdmin",
    });

    await adminUser.save();

    // Create the new hospital linked to the admin
    const hospital = new Hospital({
      ...hospitalData,
      contact: {
        phone: hospitalData.phone,
        email: hospitalData.email,
        website: hospitalData.website,
      },
      location: {
        area: hospitalData.area,
        city: hospitalData.city,
        state: hospitalData.state,
        country: hospitalData.country,
        pinCode: hospitalData.pinCode,
        coordinates: {
          lat: hospitalData.lat,
          long: hospitalData.long,
        },
      },
      hospitalAdmin: adminUser._id,
    });

    await hospital.save();

    // Send credentials email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailMessage = `
🎉 Congratulations!

You have been assigned as the Hospital Admin for: ${hospitalData.name}

🔑 Your Credentials:
- Email: ${adminEmail}
- Password: ${adminPassword}

Please log in and update your profile and password.

Best regards,
Central Admin Team
`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "New Hospital Admin Role Assigned",
      text: mailMessage,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Admin credentials email sent successfully");
    } catch (mailError) {
      console.error("Failed to send admin credentials email:", mailError);
    }

    res.status(201).json({
      message: "Hospital and admin created successfully",
      hospital,
      admin: adminUser,
    });
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE hospital by ID
export const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedHospital = await Hospital.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(updatedHospital);
  } catch (error) {
    console.error("Error updating hospital:", error);
    res.status(500).json({ message: "Failed to update hospital" });
  }
};

// DELETE hospital by ID
export const deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the hospital first
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Get the linked hospitalAdmin ID
    const adminId = hospital.hospitalAdmin;

    // Delete the hospital
    await Hospital.findByIdAndDelete(id);

    // Delete the hospital admin (if exists)
    if (adminId) {
      await User.findByIdAndDelete(adminId);
    }

    res
      .status(200)
      .json({ message: "Hospital and admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting hospital and admin:", error);
    res.status(500).json({ message: "Failed to delete hospital and admin" });
  }
};

// List all hospital admins
export const listHospitalAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "hospitalAdmin" });
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error listing hospital admins:", error);
    res.status(500).json({ message: "Failed to fetch hospital admins" });
  }
};

// Create a new hospital admin
export const createHospitalAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, gender, dob } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newAdmin = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "hospitalAdmin",
      gender: gender || "male",
      dob: dob || null,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Hospital admin created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error("Error creating hospital admin:", error);
    res.status(500).json({ message: "Failed to create hospital admin" });
  }
};

// Update hospital admin
export const updateHospitalAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, dob, password } = req.body;

    const updateData = { name, email, phone, gender, dob };

    if (password) {
      updateData.password = await bcryptjs.hash(password, 12);
    }

    const updatedAdmin = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Hospital admin not found" });
    }

    res.status(200).json({
      message: "Hospital admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating hospital admin:", error);
    res.status(500).json({ message: "Failed to update hospital admin" });
  }
};

// Delete hospital admin (hard delete)
export const deleteHospitalAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await User.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Hospital admin not found" });
    }

    res.status(200).json({ message: "Hospital admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting hospital admin:", error);
    res.status(500).json({ message: "Failed to delete hospital admin" });
  }
};

// List all ambulances
export const listAmbulanceDrivers = async (req, res) => {
  try {
    const ambulances = await AmbulanceDriver.find()
      .populate("user", "-password")
      .populate("hospital", "name");
    res.status(200).json(ambulances);
  } catch (error) {
    console.error("Error listing ambulances:", error);
    res.status(500).json({ message: "Failed to fetch ambulances" });
  }
};

export const getAnalytics = (req, res) => {};
