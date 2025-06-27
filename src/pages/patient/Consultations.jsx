import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPatientAppointmentsAction } from '@/redux/patientSlice';
import { Typography, Card, CardBody, CardHeader } from '@material-tailwind/react';
import { useLocation } from 'react-router-dom';

const SLOT_MAP = {
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
  12: "08:30 PM - 09:00 PM"
};

function Consultations() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [profile] = useState(JSON.parse(localStorage.getItem("profile")));
  const user = profile?.user;

  const { appointments = [], status } = useSelector((state) => state.patient_slice);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAllPatientAppointmentsAction(user._id));
    }
  }, [dispatch, user, location]);

  const now = new Date();

  const upcomingAppointments = appointments.filter(appt => new Date(appt.date) >= now);
  const pastAppointments = appointments.filter(appt => new Date(appt.date) < now);

  const renderAppointments = (list) =>
    list.length === 0 ? (
      <Typography className="text-gray-600 text-sm">No appointments found.</Typography>
    ) : (
      <ul className="space-y-4 mt-4">
        {list.map((appt) => (
          <li key={appt._id} className="border rounded-lg p-4 shadow-sm">
            <Typography className="font-semibold text-green-800 text-base">
              Hospital: {appt.hospitalName || appt.hospital?.name || 'N/A'}
            </Typography>
            <Typography className="text-sm text-gray-700">
              <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
            </Typography>
            <Typography className="text-sm text-gray-700">
              <strong>Time Slot:</strong> {SLOT_MAP[parseInt(appt.timeSlot)]}
            </Typography>
            <Typography className="text-sm text-gray-700">
              <strong>Status:</strong> <span className="capitalize">{appt.status}</span>
            </Typography>
            <Typography className="text-sm text-gray-700">
              <strong>Reason:</strong> {appt.reason}
            </Typography>
            <Typography className="text-sm text-gray-700">
              <strong>Doctor:</strong> {appt.doctorName || 'N/A'}
            </Typography>
          </li>
        ))}
      </ul>
    );

  return (
    <div className="mt-12 mb-8 px-4">
      <Card className="mb-10">
        <CardHeader variant="gradient" color="blue" className="p-6">
          <Typography variant="h6" color="white">Upcoming Appointments</Typography>
        </CardHeader>
        <CardBody>
          {status === null ? (
            <Typography>Loading appointments...</Typography>
          ) : (
            renderAppointments(upcomingAppointments)
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader variant="gradient" color="blue" className="p-6">
          <Typography variant="h6" color="white">Past Appointments</Typography>
        </CardHeader>
        <CardBody>
          {status === null ? (
            <Typography>Loading appointments...</Typography>
          ) : (
            renderAppointments(pastAppointments)
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Consultations;
