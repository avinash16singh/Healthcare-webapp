import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyRecordsAction } from '@/redux/patientSlice';
import { Typography, Card, CardBody, CardHeader } from '@material-tailwind/react';

function MyRecords() {
  const dispatch = useDispatch();
  const [profile] = useState(JSON.parse(localStorage.getItem("profile")));
  const user = profile?.user;

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchMyRecordsAction(user._id));
    }
  }, [dispatch, user]);

  const { records = [], status } = useSelector((state) => state.patient_slice);

  const renderRecords = (list) =>
    list.length === 0 ? (
      <Typography className="text-gray-600 text-sm">No medical records found.</Typography>
    ) : (
      <ul className="space-y-4 mt-4">
        {list.map((record) => (
          <li key={record._id} className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200">
            <Typography className="font-medium text-lg mb-1 text-green-800">
              Hospital: {record.hospital?.name || 'N/A'}
            </Typography>
            <Typography className="text-sm text-gray-700">
              Date: {new Date(record.date).toLocaleDateString()}
            </Typography>
            <Typography className="text-sm text-gray-700">
              Doctor: {record.doctor?.name || 'N/A'}
            </Typography>
            <Typography className="text-sm text-gray-700">
              Diagnosis: {record.diagnosis || 'N/A'}
            </Typography>

            {record.prescription?.medications?.length > 0 && (
              <>
                <Typography className="text-sm text-gray-800 font-semibold mt-2">Medications:</Typography>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {record.prescription.medications.map((med, index) => (
                    <li key={index}>
                      {med.name} - {med.dosage}, {med.frequency}, for {med.duration}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {record.prescription?.notes && (
              <Typography className="text-sm text-gray-700 mt-2">
                Notes: {record.prescription.notes}
              </Typography>
            )}
          </li>
        ))}
      </ul>
    );

    console.log(user._id);
  return (
    <div className="mt-12 mb-8 px-4">
      <Card>
        <CardHeader variant="gradient" color="blue" className="p-6">
          <Typography variant="h6" color="white">My Medical Records</Typography>
        </CardHeader>
        <CardBody>
          {status === null ? (
            <Typography className="text-gray-600">Loading records...</Typography>
          ) : (
            renderRecords(records)
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default MyRecords;
