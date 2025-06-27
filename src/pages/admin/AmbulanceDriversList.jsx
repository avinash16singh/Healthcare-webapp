import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGlobalAmbulancesAction } from "../../redux/adminSlice";

export function AmbulanceDriversList() {
  const dispatch = useDispatch();
  const { ambulances = [], loading, error } = useSelector(
    (state) => state.admin_slice
  );

  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    dispatch(fetchGlobalAmbulancesAction());
    setLoadingState(false);
  }, [dispatch]);

  if (loading || loadingState) {
    return (
      <div className="mt-12 mb-8 flex justify-center items-center">
        <Spinner color="blue" size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 mb-8 flex justify-center text-red-600">
        <Typography variant="h6">Failed to load ambulance drivers. Please try again later.</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-8 p-6 flex items-center justify-between"
        >
          <Typography variant="h6" color="white">
            Ambulance Drivers List
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          {ambulances.length === 0 ? (
            <div className="text-center py-6 text-gray-600">
              <Typography variant="h6">No ambulance drivers found.</Typography>
            </div>
          ) : (
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="bg-blue-50">
                  {[
                    "Name",
                    "Email",
                    "Hospital",
                    "Ambulance Number",
                    "Type",
                    "License",
                    "On Duty",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ambulances.map((driver, idx) => {
                  const className = `py-3 px-5 ${
                    idx === ambulances.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={driver._id} className="hover:bg-blue-50 transition">
                      <td className={className}>{driver.user?.name || "N/A"}</td>
                      <td className={className}>{driver.user?.email || "N/A"}</td>
                      <td className={className}>{driver.hospital?.name || "N/A"}</td>
                      <td className={className}>{driver.ambulanceNumber}</td>
                      <td className={className}>{driver.ambulanceType || "—"}</td>
                      <td className={className}>{driver.licenseNumber}</td>
                      <td className={className}>
                        {driver.onDuty ? (
                          <span className="text-green-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-red-600 font-semibold">No</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default AmbulanceDriversList;
