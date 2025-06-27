import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAppointemnetsAction,
  fetchHospitalModelByUserIdAction,
} from "../../redux/hospitalSlice";

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
  12: "08:30 PM - 09:00 PM",
};

export function Appointments() {
  const dispatch = useDispatch();
  const storedProfile = useMemo(() => {
    return JSON.parse(localStorage.getItem("profile"));
  }, []);

  const { hospital, appointments = [] } = useSelector(
    (state) => state.hospital_slice
  );

  const [hasFetchedHospital, setHasFetchedHospital] = useState(false);
  const [hasFetchedAppointments, setHasFetchedAppointments] = useState(false);

  useEffect(() => {
    if (!hasFetchedHospital && storedProfile?.user?._id) {
      dispatch(fetchHospitalModelByUserIdAction(storedProfile.user._id));
      setHasFetchedHospital(true);
    }
  }, [dispatch, storedProfile, hasFetchedHospital]);

  useEffect(() => {
    if (!hasFetchedAppointments && hospital?._id) {
      dispatch(fetchAllAppointemnetsAction(hospital._id));
      setHasFetchedAppointments(true);
    }
  }, [dispatch, hospital, hasFetchedAppointments]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="shadow-lg">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-6 p-6 rounded-t-md"
        >
          <Typography variant="h6" color="white">
            Appointments List
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-4 pt-0 pb-4">
          <table className="w-full min-w-[900px] table-auto text-left">
            <thead>
              <tr className="bg-blue-50">
                {[
                  "Patient Name",
                  "Patient Email",
                  "Doctor Name",
                  "Date",
                  "Time Slot",
                  "Status",
                  "Reason",
                ].map((head) => (
                  <th
                    key={head}
                    className="py-3 px-5 border-b border-blue-gray-100"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-500"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-blue-gray-400">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appt, idx) => {
                  const className = `py-3 px-5 ${
                    idx === appointments.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={appt._id} className="hover:bg-blue-50 transition">
                      <td className={className}>{appt.patient?.name || "N/A"}</td>
                      <td className={className}>{appt.patient?.email || "N/A"}</td>
                      <td className={className}>{appt.doctorName || "N/A"}</td>
                      <td className={className}>
                        {new Date(appt.date).toLocaleDateString()}
                      </td>
                      <td className={className}>
                        {SLOT_MAP[appt.timeSlot] || "Unknown Slot"}
                      </td>
                      <td className={className}>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            appt.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appt.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className={className}>{appt.reason || "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Appointments;
