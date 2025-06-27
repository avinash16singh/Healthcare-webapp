import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllHospitalsAction } from "@/redux/adminSlice";
import { fetchAllDoctorsAction } from "@/redux/hospitalSlice";
import { createAppointmentAction } from "@/redux/patientSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const SLOT_MAP = {
  1: "09:00 AM - 09:30 AM",
  2: "09:30 AM - 10:00 AM",
  3: "10:00 AM - 10:30 AM",
  4: "10:30 AM - 11:00 AM",
  5: "11:00 AM - 11:30 AM",
  6: "11:30 AM - 12:00 PM",
  7: "06:00 PM - 06:30 PM",
  8: "06:30 PM - 07:00 PM",
  9: "07:00 PM - 07:30 PM",
  10: "07:30 PM - 08:00 PM",
  11: "08:00 PM - 08:30 PM",
  12: "08:30 PM - 09:00 PM",
};

function BookAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hospitals, status: hospitalStatus } = useSelector((state) => state.admin_slice);
  const { doctors, status: doctorStatus } = useSelector((state) => state.hospital_slice);

  const [profile] = useState(JSON.parse(localStorage.getItem("profile")));
  const user = profile?.user;

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(fetchAllHospitalsAction());
  }, [dispatch]);

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setSelectedDoctor(null);
    dispatch(fetchAllDoctorsAction(hospital._id));
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBack = () => {
    if (selectedDoctor) {
      setSelectedDoctor(null);
    } else {
      setSelectedHospital(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentDate || !selectedSlot || !reason) {
      toast.error("Please fill out all fields.");
      return;
    }

    const payload = {
      patientId: user._id,
      doctorId: selectedDoctor._id,
      doctorName: selectedDoctor.user.name,
      hospitalId: selectedHospital._id,
      hospitalName: selectedHospital.name,
      date: appointmentDate,
      timeSlot: parseInt(selectedSlot),
      reason,
    };

    try {
      await dispatch(createAppointmentAction(payload)).unwrap();
      toast.success("Appointment booked successfully!");
      setAppointmentDate("");
      setSelectedSlot("");
      setReason("");
      setSelectedDoctor(null);
      navigate("/patient/consultations");
    } catch (err) {
      toast.error(err.message || "Failed to book appointment.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-black px-4 py-12">
      {/* Background visuals */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl" />
        <img
          src="/hospital-bg.svg"
          alt="hospital background"
          className="absolute top-0 right-0 w-1/2 opacity-10 pointer-events-none"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl">
          <CardHeader variant="gradient" color="blue" className="p-6">
            <Typography variant="h5" color="white">
              {selectedHospital
                ? selectedDoctor
                  ? `Book Appointment with ${selectedDoctor.user.name}`
                  : `${selectedHospital.name} - Doctors`
                : "Select a Hospital"}
            </Typography>
          </CardHeader>
          <CardBody className="p-6 space-y-6">
            {selectedHospital ? (
              <>
                <Button
                  size="sm"
                  onClick={handleBack}
                  variant="text"
                  className="text-gray-700 dark:text-gray-300 underline"
                >
                  ← Back
                </Button>

                {/* Doctor Selection */}
                {selectedDoctor ? (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    <Input
                      type="date"
                      label="Select Date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      crossOrigin=""
                    />
                    <div>
                      <Typography className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Time Slot
                      </Typography>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Select a slot</option>
                        {Object.entries(SLOT_MAP).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Textarea
                      label="Reason for Appointment"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      crossOrigin=""
                    />
                    <Button type="submit" color="green">
                      Confirm Appointment
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {doctorStatus === "loading" ? (
                      <Typography>Loading doctors...</Typography>
                    ) : doctors.length === 0 ? (
                      <Typography>No doctors available at this hospital.</Typography>
                    ) : (
                      doctors.map((doctor) => (
                        <motion.div
                          key={doctor._id}
                          whileHover={{ scale: 1.02 }}
                          className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <Typography variant="h6" className="text-green-800 dark:text-green-400">
                            {doctor.user.name}
                          </Typography>
                          <Typography className="text-sm">
                            Department: {doctor.department}
                          </Typography>
                          <Typography className="text-sm">
                            Specialties: {doctor.specialties.join(", ")}
                          </Typography>
                          <Typography className="text-sm">
                            License: {doctor.licenseNumber}
                          </Typography>
                          <Typography className="text-sm">
                            Email: {doctor.user.email}
                          </Typography>
                          <Typography className="text-sm">
                            Phone: {doctor.user.phone}
                          </Typography>
                          <Typography className="text-sm mb-2">
                            Type: {doctor.doctorType}
                          </Typography>
                          <Button
                            size="sm"
                            onClick={() => handleDoctorSelect(doctor)}
                            variant="outlined"
                            color="green"
                          >
                            Book Appointment
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </>
            ) : (
              // Hospital List
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {hospitalStatus === null ? (
                  <Typography>Loading hospitals...</Typography>
                ) : hospitals.length === 0 ? (
                  <Typography>No hospitals found.</Typography>
                ) : (
                  hospitals.map((hospital) => (
                    <motion.div
                      key={hospital._id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                    >
                      <Typography variant="h6" className="mb-2 text-gray-800 dark:text-white">
                        {hospital.name}
                      </Typography>
                      <Typography className="text-sm text-gray-700 dark:text-gray-300">
                        Type: {hospital.type}
                      </Typography>
                      <Typography className="text-sm text-gray-700 dark:text-gray-300">
                        Beds: {hospital.emergencyBeds} / {hospital.totalBeds}
                      </Typography>
                      <Typography className="text-sm text-gray-700 dark:text-gray-300">
                        City: {hospital.location.city}, {hospital.location.state}
                      </Typography>
                      <Typography className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Phone: {hospital.contact.phone}
                      </Typography>
                      <Button
                        size="sm"
                        onClick={() => handleHospitalSelect(hospital)}
                        color="blue"
                      >
                        Select Hospital
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

export default BookAppointment;
