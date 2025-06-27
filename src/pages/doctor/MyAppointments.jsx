import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Card,
  Textarea,
  Input,
  Button,
  Collapse,
} from '@material-tailwind/react';

import {
  fetchAllDoctorAppointmentsAction,
  fetchAllDoctorModelAction,
  createMedicalRecordAction,
  updateMedicalRecordAction,
  fetchMedicalRecordByApptIdAction,
} from '@/redux/doctorSlice';

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

const MyAppointments = () => {
  const dispatch = useDispatch();
 const profile = useMemo(() => JSON.parse(localStorage.getItem("profile")), []);
const user = profile?.user;

  const { doctorModel, appointments } = useSelector(state => state.doctor_slice);
  const [recordForms, setRecordForms] = useState({});
  const [medicalRecords, setMedicalRecords] = useState({});
  const [fetchedApptIds, setFetchedApptIds] = useState([]);

  useEffect(() => {
    if (user?._id) {
      console.log("Fetching doctor model for", user._id); // Debug line
      dispatch(fetchAllDoctorModelAction(user._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (doctorModel?._id) {
      dispatch(fetchAllDoctorAppointmentsAction(doctorModel._id));
    }
  }, [dispatch, doctorModel?._id]);

  useEffect(() => {
    const fetchRecords = async () => {
      for (const appt of appointments) {
        if (!fetchedApptIds.includes(appt._id)) {
          const res = await dispatch(fetchMedicalRecordByApptIdAction(appt._id));
          if (res.payload?.data) {
            setMedicalRecords(prev => ({ ...prev, [appt._id]: res.payload.data }));
          }
          setFetchedApptIds(prev => [...prev, appt._id]);
        }
      }
    };
    if (appointments.length > 0) {
      fetchRecords();
    }
  }, [appointments, fetchedApptIds, dispatch]);

  const toggleForm = (apptId) => {
    const existing = medicalRecords[apptId];
    setRecordForms(prev => ({
      ...prev,
      [apptId]: {
        open: !prev[apptId]?.open,
        diagnosis: existing?.diagnosis || '',
        prescription: existing?.prescription || {
          medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
          notes: ''
        }
      }
    }));
  };

  const handleChange = (apptId, field, value, index = null, subfield = null) => {
    setRecordForms(prev => {
      const form = { ...prev[apptId] };

      if (field === 'diagnosis') {
        form.diagnosis = value;
      } else if (field === 'notes') {
        form.prescription.notes = value;
      } else if (field === 'med') {
        form.prescription.medications[index][subfield] = value;
      }

      return { ...prev, [apptId]: form };
    });
  };

  const addMed = (apptId) => {
    setRecordForms(prev => {
      const meds = [...prev[apptId].prescription.medications, { name: '', dosage: '', frequency: '', duration: '' }];
      return {
        ...prev,
        [apptId]: {
          ...prev[apptId],
          prescription: {
            ...prev[apptId].prescription,
            medications: meds
          }
        }
      };
    });
  };

  const handleSubmit = (appt) => {
    console.log(appt);
    const form = recordForms[appt._id];
    const record = {
      appointmentId: appt._id,
      doctor: doctorModel._id,
      patient: appt.patient,
      hospital: appt.hospital,
      diagnosis: form.diagnosis,
      prescription: form.prescription,
      date: Date.now()
    };

    if (medicalRecords[appt._id]) {
        dispatch(updateMedicalRecordAction({ id: medicalRecords[appt._id]._id, record })).then((res) => {
        if (res.payload?.data) {
          setMedicalRecords(prev => ({
            ...prev,
            [appt._id]: res.payload.data
          }));
        }
        alert("Record updated");
        toggleForm(appt._id);
      });

    } else {
      dispatch(createMedicalRecordAction(record)).then((res) => {
      if (res.payload?.data) {
        setMedicalRecords(prev => ({
          ...prev,
          [appt._id]: res.payload.data
        }));
      }
      alert("Record created");
      toggleForm(appt._id);
    });

    }
  };

  return (
    <Card className="p-6 my-6 shadow-md">
      <Typography variant="h5" className="mb-6 text-blue-800">My Appointments</Typography>
      {appointments.map(appt => (
        <Card key={appt._id} className="mb-6 p-5 border rounded-md shadow-sm">
          <div className="space-y-1 mb-3">
            <Typography variant="h6" color="blue-gray">Hospital: {appt.hospitalName || appt.hospital?.name}</Typography>
            <Typography className="text-sm text-gray-700">Date: {new Date(appt.date).toLocaleDateString()}</Typography>
            <Typography className="text-sm text-gray-700">Time Slot: {SLOT_MAP[appt.timeSlot]}</Typography>
            <Typography className="text-sm text-gray-700">Status: {appt.status}</Typography>
            <Typography className="text-sm text-gray-700">Reason: {appt.reason}</Typography>
          </div>

          <Button
            onClick={() => toggleForm(appt._id)}
            size="sm"
            className="mb-4"
            color="blue"
          >
            {medicalRecords[appt._id] ? 'Update Medical Record' : 'Add Medical Record'}
          </Button>

          {recordForms[appt._id]?.open && (
            <Collapse open={true}>
              <div className="mt-4 space-y-3">
                <Textarea
                  label="Diagnosis"
                  value={recordForms[appt._id]?.diagnosis || ''}
                  onChange={(e) => handleChange(appt._id, 'diagnosis', e.target.value)}
                />
                {recordForms[appt._id]?.prescription?.medications?.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Input label="Name" value={med.name} onChange={(e) => handleChange(appt._id, 'med', e.target.value, idx, 'name')} />
                    <Input label="Dosage" value={med.dosage} onChange={(e) => handleChange(appt._id, 'med', e.target.value, idx, 'dosage')} />
                    <Input label="Frequency" value={med.frequency} onChange={(e) => handleChange(appt._id, 'med', e.target.value, idx, 'frequency')} />
                    <Input label="Duration" value={med.duration} onChange={(e) => handleChange(appt._id, 'med', e.target.value, idx, 'duration')} />
                  </div>
                ))}
                <Button onClick={() => addMed(appt._id)} variant="outlined" color="blue" size="sm">
                  + Add Medication
                </Button>
                <Textarea
                  label="Notes"
                  value={recordForms[appt._id]?.prescription.notes || ''}
                  onChange={(e) => handleChange(appt._id, 'notes', e.target.value)}
                />
                <Button color="blue" onClick={() => handleSubmit(appt)} size="sm">
                  {medicalRecords[appt._id] ? 'Update Record' : 'Save Record'}
                </Button>
              </div>
            </Collapse>
          )}
        </Card>
      ))}
    </Card>
  );
};

export default MyAppointments;
