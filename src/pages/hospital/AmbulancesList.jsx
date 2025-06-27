import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAmbulancesAction,
  createNewAmbulanceAction,
  fetchHospitalModelByUserIdAction,
} from "../../redux/hospitalSlice";

export function AmbulanceList() {
  const [showForm, setShowForm] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const storedProfile = useMemo(() => {
    return JSON.parse(localStorage.getItem("profile"));
  }, []);

  const { hospital, hospitalId, ambulances = [] } = useSelector(
    (state) => state.hospital_slice
  );

  const [hasFetchedHospital, setHasFetchedHospital] = useState(false);
  const [hasFetchedAmbulances, setHasFetchedAmbulances] = useState(false);

  useEffect(() => {
    if (!hasFetchedHospital && storedProfile?.user?._id) {
      dispatch(fetchHospitalModelByUserIdAction(storedProfile.user._id));
      setHasFetchedHospital(true);
    }
  }, [dispatch, storedProfile, hasFetchedHospital]);

  useEffect(() => {
    const fetchAmbulances = async () => {
      if (!hasFetchedAmbulances && hospital?._id) {
        setIsLoadingData(true);
        await dispatch(fetchAllAmbulancesAction(hospital._id));
        setIsLoadingData(false);
        setHasFetchedAmbulances(true);
      }
    };
    fetchAmbulances();
  }, [dispatch, hospital, hasFetchedAmbulances]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    ambulanceNumber: "",
    ambulanceType: "",
    licenseNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmpty = Object.values(formData).some((val) => val.trim() === "");
    if (isEmpty) {
      alert("Please fill in all the details.");
      return;
    }

    if (!hospitalId) {
      alert("Hospital ID not available.");
      return;
    }

    setIsSubmitting(true);

    const newAmbulance = {
      ...formData,
      hospitalId,
    };

    await dispatch(createNewAmbulanceAction(newAmbulance));
    setIsSubmitting(false);

    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      ambulanceNumber: "",
      ambulanceType: "",
      licenseNumber: "",
    });
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="shadow-lg">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-6 p-6 flex items-center justify-between"
        >
          <Typography variant="h6" color="white">
            Ambulance Management
          </Typography>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="border px-3 py-1.5 rounded-md bg-white text-blue-800 hover:bg-blue-50 font-medium transition"
          >
            {showForm ? "Hide Form" : "Add Ambulance"}
          </button>
        </CardHeader>

        {showForm && (
          <CardBody className="px-6 pt-0">
            <Typography variant="h6" className="mb-4 text-blue-gray-700">
              Add New Ambulance
            </Typography>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Ambulance Number"
                name="ambulanceNumber"
                value={formData.ambulanceNumber}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Ambulance Type"
                name="ambulanceType"
                value={formData.ambulanceType}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="col-span-2">
                <Button type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Add Ambulance"}
                </Button>
              </div>
            </form>
          </CardBody>
        )}

        <CardBody className="overflow-x-auto px-0 pt-0 pb-4">
          <table className="w-full min-w-[900px] table-auto text-left">
            <thead>
              <tr className="bg-blue-50">
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Ambulance Number",
                  "Type",
                  "License",
                  "Hospital",
                ].map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 py-3 px-5"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-600"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoadingData ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-blue-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : ambulances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-blue-gray-400">
                    No ambulances found.
                  </td>
                </tr>
              ) : (
                ambulances.map((amb, idx) => {
                  const className = `py-3 px-5 ${
                    idx === ambulances.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={amb._id} className="hover:bg-blue-50 transition">
                      <td className={className}>{amb?.user?.name || "N/A"}</td>
                      <td className={className}>{amb?.user?.email || "N/A"}</td>
                      <td className={className}>{amb?.user?.phone || "N/A"}</td>
                      <td className={className}>{amb?.ambulanceNumber}</td>
                      <td className={className}>{amb?.ambulanceType}</td>
                      <td className={className}>{amb?.licenseNumber}</td>
                      <td className={className}>{amb?.hospital?.name || "N/A"}</td>
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

export default AmbulanceList;
